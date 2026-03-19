
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from './Button';
import { Trophy, AlertTriangle } from 'lucide-react';

export const GameOverScreen: React.FC = () => {
  const { 
    players, 
    gameStatus, 
    setGameStatus, 
    addHighestAnimalBonus, 
    scores 
  } = useGameContext();

  const [selectedHighestIds, setSelectedHighestIds] = useState<string[]>([]);

  // Toggle selection for Highest Animal
  const togglePlayerSelection = (id: string) => {
    if (selectedHighestIds.includes(id)) {
      setSelectedHighestIds(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedHighestIds(prev => [...prev, id]);
    }
  };

  const handleHighestSubmit = () => {
    if (selectedHighestIds.length > 0) {
      addHighestAnimalBonus(selectedHighestIds);
    }
  };

  // --- SCREEN 1: WHO WON HIGHEST ANIMAL? ---
  if (gameStatus === 'game_over_selection') {
    return (
      <div className="h-full w-full flex flex-col p-6 bg-scaffold-red overflow-y-auto animate-fade-in">
        <div className="text-center mb-8 mt-4">
          <AlertTriangle className="w-16 h-16 text-scaffold-cream mx-auto mb-4" />
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Game Over!</h1>
          <p className="text-xl text-white/90 font-medium">Who has the highest animal?</p>
          <p className="text-sm text-white/70 mt-2">Select one or more players (for a draw)</p>
        </div>

        <div className="flex-1 space-y-3 mb-8">
          {players.map(player => {
             const isSelected = selectedHighestIds.includes(player.id);
             return (
               <button
                 key={player.id}
                 onClick={() => togglePlayerSelection(player.id)}
                 className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                   isSelected 
                     ? 'bg-scaffold-cream border-scaffold-cream text-scaffold-red shadow-lg scale-[1.02]' 
                     : 'bg-black/20 border-white/20 text-white hover:bg-black/30'
                 }`}
               >
                 <div className="flex justify-between items-center">
                   <span className="font-bold text-xl">{player.name}</span>
                   {isSelected && <Trophy size={24} />}
                 </div>
               </button>
             );
          })}
        </div>

        <Button 
          variant="cream" 
          fullWidth 
          disabled={selectedHighestIds.length === 0}
          onClick={handleHighestSubmit}
          className="py-6 text-xl shadow-xl"
        >
          Confirm Bonus (+50pts)
        </Button>
      </div>
    );
  }

  // --- SCREEN 2: SCOREBOARD (Standard Winner Screen logic moved here for clarity) ---
  return null; // Handled by WinnerScreen in App.tsx based on 'winner' status
};
