
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from './Button';
import { Volume2, VolumeX, CheckCircle2, Circle } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { setGameStatus, settings, updateSettings } = useGameContext();

  const handleBack = () => {
    setGameStatus('setup');
  };

  return (
    <div className="h-full w-full flex flex-col bg-scaffold-cream overflow-y-auto">
      <div className="p-6">
        <h2 className="text-3xl font-black text-scaffold-red mb-8 tracking-tight">Settings</h2>

        {/* Audio Settings */}
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Audio</h3>
          
          <div className="space-y-3">
             <button 
               onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
               className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
             >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${settings.soundEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                   </div>
                   <span className="font-bold text-gray-700">Sound Effects</span>
                </div>
                {settings.soundEnabled ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
             </button>

             <button 
               onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
               className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
             >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${settings.voiceEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {settings.voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                   </div>
                   <span className="font-bold text-gray-700">Voice Instructions</span>
                </div>
                {settings.voiceEnabled ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
             </button>
          </div>
        </section>

        {/* Game Variant Settings */}
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Game Mode</h3>
          
          <div className="space-y-3">
            {/* Game A */}
            <button 
               onClick={() => updateSettings({ gameVariant: 'A' })}
               className={`w-full p-4 rounded-xl shadow-sm flex items-start justify-between text-left border-2 transition-all ${settings.gameVariant === 'A' ? 'bg-white border-scaffold-red' : 'bg-white/50 border-transparent'}`}
             >
                <div className="flex-1 pr-4">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-scaffold-red text-lg">Game A</span>
                      {settings.gameVariant === 'A' && <span className="bg-scaffold-red text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Active</span>}
                   </div>
                   <p className="text-sm text-gray-600 leading-snug">
                     Standard Rules. Whose animal can climb the highest and score the most points?
                   </p>
                </div>
                <div className="mt-1">
                  {settings.gameVariant === 'A' ? <CheckCircle2 className="text-scaffold-red" /> : <Circle className="text-gray-300" />}
                </div>
             </button>

             {/* Game B */}
             <button 
               onClick={() => updateSettings({ gameVariant: 'B' })}
               className={`w-full p-4 rounded-xl shadow-sm flex items-start justify-between text-left border-2 transition-all ${settings.gameVariant === 'B' ? 'bg-white border-scaffold-red' : 'bg-white/50 border-transparent'}`}
             >
                <div className="flex-1 pr-4">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800 text-lg">Game B</span>
                      {settings.gameVariant === 'B' && <span className="bg-scaffold-red text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Active</span>}
                   </div>
                   <p className="text-sm text-gray-600 leading-snug">
                     Experimental instruction cards (including The Fox).
                   </p>
                </div>
                <div className="mt-1">
                  {settings.gameVariant === 'B' ? <CheckCircle2 className="text-scaffold-red" /> : <Circle className="text-gray-300" />}
                </div>
             </button>
          </div>
        </section>
        
        {/* Difficulty */}
        <section className="mb-12">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Difficulty</h3>
           <button 
               onClick={() => updateSettings({ easyMode: !settings.easyMode })}
               className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
             >
                <div className="flex-col items-start gap-1">
                   <span className="font-bold text-gray-700 block">Easy Mode</span>
                   <span className="text-xs text-gray-500 block">Add +10 seconds to every turn</span>
                </div>
                {settings.easyMode ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
             </button>
        </section>

      </div>

      <div className="mt-auto p-6 bg-white border-t border-gray-100">
         <Button onClick={handleBack} fullWidth>
           Save & Back
         </Button>
      </div>
    </div>
  );
};
