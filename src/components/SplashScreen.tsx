import React from 'react';
import { Button } from './Button';
import { Settings } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface SplashScreenProps {
  onPlay: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay }) => {
  const { setGameStatus } = useGameContext();

  // Updated Asset URLs (Raw versions for direct rendering)
  const LOGO_URL = "https://raw.githubusercontent.com/sdcvr4h2vw-spec/scaffold_assets/main/animal-scaffold-logo.png";
  const BG_URL = "https://raw.githubusercontent.com/sdcvr4h2vw-spec/scaffold_assets/main/splash-bg.png";

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between bg-gradient-to-b from-orange-400 via-pink-500 to-purple-900 overflow-hidden">
      
      {/* Settings Icon - Top Right */}
      <div 
        className="absolute top-6 right-6 z-20 text-white/80 cursor-pointer hover:text-white transition-colors"
        onClick={() => setGameStatus('settings')}
      >
        <Settings size={28} />
      </div>

{/* Cityscape Background Layer - Fixed height for consistent cropping */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] pointer-events-none z-0">
        <img
          src={BG_URL}
          alt="Cityscape"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 z-10 pt-40">
        {/* Logo */}
        <div className="w-64 md:w-80 mb-4 animate-fade-in-down">
          <img 
            src={LOGO_URL} 
            alt="Scaffold Logo" 
            className="w-full h-auto drop-shadow-lg"
          />
        </div>

        {/* Tagline */}
        <p className="text-yellow-200 text-center text-lg md:text-xl font-medium max-w-xs drop-shadow-md mb-8">
          the fast-paced game of <br/>
          <span className="text-yellow-100 font-bold">bending & balancing</span>
        </p>
      </div>

      {/* Action Area */}
      <div className="w-full px-8 pb-12 z-20">
        <Button variant="cream" fullWidth onClick={onPlay} className="text-xl">
          Play
        </Button>
      </div>
    </div>
  );
};