import React from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import SchoolHub from '@/components/SchoolHub';
import ChemistryRoom from '@/components/ChemistryRoom';
import MathRoom from '@/components/MathRoom';
import HistoryRoom from '@/components/HistoryRoom';

const GameRouter: React.FC = () => {
  const { currentScreen } = useGame();

  return (
    <div className="min-h-screen">
      {currentScreen === 'hub' && <SchoolHub />}
      {currentScreen === 'chemistry' && <ChemistryRoom />}
      {currentScreen === 'math' && <MathRoom />}
      {currentScreen === 'history' && <HistoryRoom />}
    </div>
  );
};

const Index: React.FC = () => (
  <GameProvider>
    <GameRouter />
  </GameProvider>
);

export default Index;
