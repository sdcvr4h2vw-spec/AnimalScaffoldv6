
import React from 'react';

export type ScreenState = 'splash' | 'players' | 'length' | 'game';

export interface Player {
  id: string;
  name: string;
}

export type GameDuration = 3 | 5 | 7;

export type GameStatus = 'setup' | 'playing' | 'game_over_selection' | 'winner';

export type TurnPhase = 'ready' | 'playing' | 'checking' | 'penalty' | 'timeout';

export type GameVariant = 'A' | 'B';

export type InstructionType = 'BUILD' | 'MOVE' | 'REMOVE' | 'FOX';

export interface Instruction {
  text: string;
  type: InstructionType;
  secondaryText?: string;
  pieces: number; // Used for timer calc
  orientation?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cream' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export interface GameContextType {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  
  duration: GameDuration;
  setDuration: (duration: GameDuration) => void;
  
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
  
  activePlayer: Player | null;
  nextPlayer: () => void;
  
  turnHistory: string[]; // Array of Player IDs
  winningPlayer: Player | null; // Calculated based on score
  setWinningPlayer: (player: Player | null) => void;

  // Scores
  scores: Record<string, number>;
  addHighestAnimalBonus: (playerIds: string[]) => void;
  
  // Timer & Game Logic State
  gameTimeRemaining: number; // in seconds
  turnTimeRemaining: number; // in seconds
  setTurnTimeRemaining: (time: number) => void;
  
  stacksExist: boolean;
  setStacksExist: (exists: boolean) => void;
  isGamePaused: boolean;
  
  // Turn Logic
  turnPhase: TurnPhase;
  currentInstruction: Instruction | null;
  
  startTurn: () => void;
  endTurn: (reason?: 'manual' | 'timeout') => void;
  confirmTurnResult: (fell: boolean) => void; // Handles the "Did anything fall?" logic
  
  // Timer Control Functions
  startGameTimer: () => void;
  pauseTimer: () => void;
  
  // Settings
  settings: {
    voiceEnabled: boolean;
    soundEnabled: boolean;
    easyMode: boolean; // Retained but not explicitly requested in new rules, keeping for compat
    gameVariant: GameVariant;
  };
  updateSettings: (settings: Partial<{ voiceEnabled: boolean; soundEnabled: boolean; easyMode: boolean; gameVariant: GameVariant }>) => void;
}
