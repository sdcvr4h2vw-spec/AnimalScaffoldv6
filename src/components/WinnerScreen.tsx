
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from './Button';
import { Trophy } from 'lucide-react';

interface WinnerScreenProps {
  onNewGame: () => void;
  onRematch: () => void;
}

export const WinnerScreen: React.FC<WinnerScreenProps> = ({ onNewGame, onRematch }) => {
  const { winningPlayer, players, scores } = useGameContext();

  // Sort players by score for the list
  const sortedPlayers = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

  return (
    <div className="h-full w-full flex flex-col p-6 bg-scaffold-cream overflow-y-auto animate-fade-in">
      
      <div className="flex-1 flex flex-col items-center pt-8">
        <div className="bg-yellow-400 p-6 rounded-full mb-6 shadow-xl animate-bounce">
          <Trophy size={48} className="text-yellow-900" />
        </div>
        
        <h2 className="text-xl font-bold text-scaffold-red uppercase tracking-widest mb-2">Winner</h2>
        <h1 className="text-5xl font-black text-gray-800 text-center mb-12 drop-shadow-sm leading-tight">
          Congratulations<br/>
          <span className="text-scaffold-red">{winningPlayer?.name}</span>
        </h1>

        {/* Scoreboard */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm mb-8">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Final Scores</h3>
           <div className="space-y-3">
             {sortedPlayers.map((p, index) => (
               <div key={p.id} className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <span className={`font-mono font-bold w-6 text-center ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                     {index + 1}
                   </span>
                   <span className={`font-bold text-lg ${index === 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                     {p.name}
                   </span>
                 </div>
                 <span className="font-mono font-bold text-xl text-scaffold-red">
                   {scores[p.id] || 0}
                 </span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="space-y-4 mt-auto pt-6">
        <Button onClick={onRematch} variant="primary" fullWidth className="py-4 text-xl shadow-lg">
          Rematch
        </Button>
        <Button onClick={onNewGame} variant="ghost" fullWidth>
          New Game
        </Button>
      </div>
    </div>
  );
};
