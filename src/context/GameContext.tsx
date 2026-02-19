import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { Player, GameDuration, GameStatus, GameContextType, Instruction, TurnPhase, GameVariant } from '../types';
import { DEFAULT_PLAYERS } from '../constants';
import { generateInstruction } from '../utils/instructionLogic';
import { generateExperimentalInstruction } from '../utils/experimentalLogic';
import { calculateTurnTime } from '../utils/timerLogic';

const GameContext = createContext<GameContextType | undefined>(undefined);

// AUDIO ASSETS
const AUDIO_ASSETS = {
  START_TURN: '/sounds/whistle.wav', 
  TIMEOUT_FAIL: '/sounds/fail.mp3', 
  CELEBRATION: '/sounds/Success.mp3', 
  GAME_OVER: '/sounds/klaxon.mp3?raw=true', 
  COUNTDOWN: '/sounds/10-second-countdown.mp3'
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // --- Global Settings State ---
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    soundEnabled: true,
    easyMode: false,
    gameVariant: 'A' as GameVariant,
  });

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [duration, setDuration] = useState<GameDuration>(10);
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  
  // Scoring & History
  const [turnHistory, setTurnHistory] = useState<string[]>([]); // Player IDs
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [winningPlayer, setWinningPlayer] = useState<Player | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  // --- Timer & Logic State ---
  const [gameTimeRemaining, setGameTimeRemaining] = useState<number>(duration * 60);
  const [turnTimeRemaining, setTurnTimeRemaining] = useState<number>(0);
  const [stacksExist, setStacksExist] = useState<boolean>(false);
  const [isGamePaused, setIsGamePaused] = useState<boolean>(true);
  
  // --- Turn Logic State ---
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('ready');
  const [currentInstruction, setCurrentInstruction] = useState<Instruction | null>(null);
  const [totalTurns, setTotalTurns] = useState<number>(0);

  // Refs
  const turnTimeRef = useRef(turnTimeRemaining);
  const gameTimeRef = useRef(gameTimeRemaining);
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { turnTimeRef.current = turnTimeRemaining; }, [turnTimeRemaining]);
  useEffect(() => { gameTimeRef.current = gameTimeRemaining; }, [gameTimeRemaining]);

  // --- BUG FIX (Issue 6): Comprehensive Reset Logic ---
  // This effect ensures that whenever the game goes back to 'setup' (via Rematch or New Game),
  // all gameplay-specific data is wiped so the next game starts fresh.
  useEffect(() => {
    if (gameStatus === 'setup') {
      setGameTimeRemaining(duration * 60);
      
      // Reset Scores
      const initialScores: Record<string, number> = {};
      players.forEach(p => initialScores[p.id] = 0);
      setScores(initialScores);

      // Reset turn tracking and winning data
      setTurnHistory([]);
      setTotalTurns(0);
      setWinningPlayer(null);
      setTurnPhase('ready');
      setCurrentInstruction(null);
      setIsGamePaused(true);
    }
  }, [duration, gameStatus, players]);

  // --- Audio Preloading ---
  useEffect(() => {
    Object.entries(AUDIO_ASSETS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.load();
      audioCache.current[src] = audio;
      if (key === 'COUNTDOWN') countdownAudioRef.current = audio;
    });
  }, []);

  const playSound = useCallback((src: string) => {
    if (!settings.soundEnabled) return;
    const audio = audioCache.current[src];
    if (audio) {
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.play().catch(err => console.warn("Audio clone playback warning:", err));
    }
  }, [settings.soundEnabled]);

  const stopCountdownAudio = useCallback(() => {
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0; 
    }
  }, []);

  // --- Player Selection ---
  const selectNextPlayerId = useCallback((historyOverride?: string[]) => {
    const historyToUse = historyOverride || turnHistory;
    
    // Simple fairness: who has played the least?
    const turnCounts: Record<string, number> = {};
    players.forEach(p => turnCounts[p.id] = 0);
    historyToUse.forEach(id => {
        if (turnCounts[id] !== undefined) turnCounts[id]++;
    });

    const minTurns = Math.min(...Object.values(turnCounts));
    
    // Candidates are players with minTurns, excluding the person who just went (unless 1 player)
    let candidates = players.filter(p => turnCounts[p.id] === minTurns);
    
    // If everyone is equal, allow anyone (except previous if possible)
    if (candidates.length === 0) candidates = players;

    // Avoid back-to-back if possible
    if (players.length > 1 && historyToUse.length > 0) {
        const lastId = historyToUse[historyToUse.length - 1];
        const filtered = candidates.filter(p => p.id !== lastId);
        if (filtered.length > 0) candidates = filtered;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const next = candidates[randomIndex];
    
    if (next) {
      setActivePlayer(next);
      return next.id;
    }
    return null;
  }, [players, turnHistory]);

  const nextPlayer = useCallback(() => { selectNextPlayerId(); }, [selectNextPlayerId]);

  // --- Timer Controls ---
  const startGameTimer = useCallback(() => setIsGamePaused(false), []);
  const pauseTimer = useCallback(() => {
    stopCountdownAudio(); 
    setIsGamePaused(true);
  }, [stopCountdownAudio]);

  // --- Game State Management ---
  useEffect(() => {
    if (gameStatus === 'playing' && turnPhase === 'ready') {
       // Initializing the first turn of a session
       if (totalTurns === 0) {
         setGameTimeRemaining(duration * 60);
         const initialScores: Record<string, number> = {};
         players.forEach(p => initialScores[p.id] = 0);
         setScores(initialScores);
         selectNextPlayerId([]);
       }
    }
  }, [gameStatus, turnPhase, duration, players, totalTurns, selectNextPlayerId]);


  // --- Turn Logic ---

  // 1. Start Turn
  const startTurn = useCallback(() => {
    if (!activePlayer) return;

    playSound(AUDIO_ASSETS.START_TURN);
    setIsGamePaused(false); // Game timer runs during instruction

    // Generate Instruction
    const progress = 1 - (gameTimeRef.current / (duration * 60));
    let instr: Instruction;
    if (settings.gameVariant === 'B') {
      instr = generateExperimentalInstruction(totalTurns, progress);
    } else {
      instr = generateInstruction(totalTurns, progress);
    }

    setCurrentInstruction(instr);

    // Calculate Time
    const time = calculateTurnTime(instr.type, instr.pieces);
    setTurnTimeRemaining(time);
    
    setTurnPhase('playing'); // Visible timer starts, game timer continues

    // Audio cue for short turns
    if (time <= 10 && settings.soundEnabled && countdownAudioRef.current) {
        const offset = 10 - time; 
        if (offset >= 0 && offset < 10) {
            countdownAudioRef.current.currentTime = offset;
            countdownAudioRef.current.play().catch(e => console.warn(e));
        }
    }

  }, [activePlayer, duration, totalTurns, playSound, settings.gameVariant, settings.soundEnabled]);


  // 2. End Turn (Manual or Timeout)
  const endTurn = useCallback((reason: 'manual' | 'timeout' = 'manual') => {
    stopCountdownAudio();
    setIsGamePaused(true); // Game timer PAUSES when checking turn

    if (reason === 'timeout') {
      playSound(AUDIO_ASSETS.TIMEOUT_FAIL);
      setTurnPhase('timeout');
    } else {
      // Manual finish
      setTurnPhase('checking');
    }

  }, [stopCountdownAudio, playSound]);


  // 3. Confirm Turn Result (Called from UI)
  const confirmTurnResult = useCallback((fell: boolean) => {
    if (!activePlayer) return;

    let pointsChange = 0;
    const isTimeout = turnPhase === 'timeout';

    if (isTimeout) {
        pointsChange = -10;
    } else if (fell) {
        pointsChange = -10;
        playSound(AUDIO_ASSETS.TIMEOUT_FAIL); 
    } else {
        // Success
        if (currentInstruction && currentInstruction.type === 'BUILD') {
            pointsChange = turnTimeRef.current;
        } else {
            pointsChange = 0; 
        }
        playSound(AUDIO_ASSETS.CELEBRATION);
    }

    // Update Score
    setScores(prev => ({
        ...prev,
        [activePlayer.id]: (prev[activePlayer.id] || 0) + pointsChange
    }));

    // Update History
    const newHistory = [...turnHistory, activePlayer.id];
    setTurnHistory(newHistory);
    setTotalTurns(prev => prev + 1);

    // Prepare next
    setCurrentInstruction(null);
    setTurnPhase('ready');
    selectNextPlayerId(newHistory);

  }, [activePlayer, turnPhase, turnHistory, currentInstruction, playSound, selectNextPlayerId]);


  // 4. Highest Animal Bonus
  const addHighestAnimalBonus = useCallback((playerIds: string[]) => {
      setScores(prev => {
          const newScores = { ...prev };
          playerIds.forEach(id => {
              if (newScores[id] !== undefined) {
                  newScores[id] += 50;
              }
          });
          return newScores;
      });

      // Calculate Winner
      const sorted = [...players].sort((a, b) => {
         const scoreA = scores[a.id] + (playerIds.includes(a.id) ? 50 : 0);
         const scoreB = scores[b.id] + (playerIds.includes(b.id) ? 50 : 0);
         return scoreB - scoreA;
      });

      setWinningPlayer(sorted[0]);
      setGameStatus('winner');
  }, [players, scores]);


  // --- Main Timer Loop ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        
        // 1. Game Timer
        if (!isGamePaused) {
          const currentGameTime = gameTimeRef.current;
          if (currentGameTime <= 1) {
             setGameTimeRemaining(0);
             stopCountdownAudio();
             playSound(AUDIO_ASSETS.GAME_OVER);
             setIsGamePaused(true);
             setTurnPhase('ready');
             setGameStatus('game_over_selection');
             
             const synth = window.speechSynthesis;
             if (synth && settings.voiceEnabled) {
                 const u = new SpeechSynthesisUtterance("Stop what you're doing, it's game over! Who's got the highest animal?");
                 synth.speak(u);
             }
             return;
          } else {
            setGameTimeRemaining(currentGameTime - 1);
          }
        }

        // 2. Turn Timer
        if (turnPhase === 'playing') {
          const currentTime = turnTimeRef.current;
          const nextTime = currentTime - 1;
          
          // BUG FIX (Issue 9): 0 should not be displayed. 
          // If nextTime is 0, we end the turn immediately instead of waiting for the next tick.
          if (nextTime <= 0) {
             endTurn('timeout');
          } else {
             setTurnTimeRemaining(nextTime);
             if (nextTime === 10 && settings.soundEnabled) {
                countdownAudioRef.current?.play().catch(e => console.warn(e));
             }
          }
        }

      }, 1000);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [gameStatus, isGamePaused, turnPhase, playSound, settings.soundEnabled, settings.voiceEnabled, endTurn, stopCountdownAudio]);


  return (
    <GameContext.Provider
      value={{
        players, setPlayers,
        duration, setDuration,
        gameStatus, setGameStatus,
        activePlayer, nextPlayer,
        turnHistory, winningPlayer, setWinningPlayer,
        scores, addHighestAnimalBonus,
        gameTimeRemaining, turnTimeRemaining, setTurnTimeRemaining,
        stacksExist, setStacksExist,
        isGamePaused, 
        turnPhase, currentInstruction,
        startTurn, endTurn, confirmTurnResult,
        startGameTimer, pauseTimer,
        settings, updateSettings
      }}
    >
      {children}
    </GameContext.Provider>
  );
};