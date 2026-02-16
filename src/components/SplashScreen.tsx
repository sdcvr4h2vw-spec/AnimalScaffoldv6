
import React from 'react';
import { Button } from './Button';

interface SplashScreenProps {
  onPlay: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-8 bg-scaffold-red animate-fade-in relative overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[40%] bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
        <div className="mb-8 p-6 bg-white rounded-[2rem] shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 cursor-pointer">
           <img 
             src="https://github.com/sdcvr4h2vw-spec/scaffold_assets/blob/main/animal-scaffold-logo.png?raw=true" 
             alt="Animal Scaffold Logo" 
             className="w-48 h-48 object-contain"
           />
        </div>
        
        <h1 className="text-5xl font-black text-white tracking-tighter text-center leading-tight drop-shadow-md mb-2">
          ANIMAL<br/>SCAFFOLD
        </h1>
        <p className="text-scaffold-cream text-lg font-medium opacity-90 tracking-widest uppercase">
          Build High. Don't Fall.
        </p>
      </div>

      <div className="w-full max-w-sm z-10">
        <Button onClick={onPlay} variant="cream" fullWidth className="text-2xl py-6 shadow-xl">
          Play
        </Button>
      </div>
    </div>
  );
};
