import React from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import SchoolHub from '@/components/SchoolHub';
import ChemistryRoom from '@/components/ChemistryRoom';
import MathRoom from '@/components/MathRoom';
import HistoryRoom from '@/components/HistoryRoom';
import LanguageRoom from '@/components/LanguageRoom';
import ShopRoom from '@/components/ShopRoom';
import GeographyRoom from '@/components/GeographyRoom';

const GameRouter: React.FC = () => {
  const { currentScreen } = useGame();

  return (
    <div className="min-h-screen">
      {currentScreen === 'hub' && <SchoolHub />}
      {currentScreen === 'chemistry' && <ChemistryRoom />}
      {currentScreen === 'math' && <MathRoom />}
      {currentScreen === 'history' && <HistoryRoom />}
      {currentScreen === 'language' && <LanguageRoom />}
      {currentScreen === 'geography' && <GeographyRoom />}
      {currentScreen === 'shop' && <ShopRoom />}
    </div>
  );
};

const Index: React.FC = () => (
  <GameProvider>
    <GameRouter />
  </GameProvider>
);

export default Index;
