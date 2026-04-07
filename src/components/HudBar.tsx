import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Coins, Trophy, CheckCircle, BookOpen } from 'lucide-react';

interface HudBarProps {
  title?: string;
  showBack?: boolean;
}

const HudBar: React.FC<HudBarProps> = ({ title, showBack = false }) => { 
  const { educoins, totalCompleted, totalTasks, setScreen } = useGame();


  return (
    <div className="hud-bar animate-fade-in z-50">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => setScreen('hub')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hub-wall/60 hover:bg-hub-wall transition-colors font-display text-sm"
            style={{ color: 'hsl(0 0% 85%)' }}
          >
            ← Артқа
          </button>
        )}
        {title && (
          <h2 className="font-display font-bold text-lg" style={{ color: 'hsl(0 0% 92%)' }}>
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2" style={{ color: 'hsl(0 0% 80%)' }}>
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-sm font-semibold">{totalCompleted}/{totalTasks}</span>
        </div>
        <div className="educoin-badge">
          <Coins className="w-4 h-4" />
          <span>{educoins}</span>
        </div>
      </div>
    </div>
  );
};

export default HudBar;
