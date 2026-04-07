import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Screen = 'hub' | 'chemistry' | 'math' | 'history' | 'language' | 'geography' | 'shop';
export type AvatarId = 'boy' | 'girl' | 'student1' | 'student2';

interface TaskProgress {
  [taskId: string]: boolean;
}

interface GameState {
  educoins: number;
  completedTasks: TaskProgress;
  currentScreen: Screen;
  selectedAvatar: AvatarId;
  ownedItems: string[];
  equippedItem: string | null;
}

interface GameContextType extends GameState {
  setScreen: (s: Screen) => void;
  setSelectedAvatar: (avatar: AvatarId) => void;
  completeTask: (taskId: string, reward: number) => void;
  isTaskCompleted: (taskId: string) => boolean;
  totalCompleted: number;
  totalTasks: number;
  resetProgress: () => void;
  buyItem: (itemId: string, price: number) => boolean;
  equipItem: (itemId: string) => void;
}

const STORAGE_KEY = 'eduschool_progress';
const TOTAL_TASKS = 24;

const defaultState: GameState = {
  educoins: 0,
  completedTasks: {},
  currentScreen: 'hub',
  selectedAvatar: 'boy',
  ownedItems: [],
  equippedItem: null,
};

const loadState = (): GameState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        currentScreen: 'hub',
      };
    }
  } catch {}
  return { ...defaultState };
};

const saveState = (state: GameState) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        educoins: state.educoins,
        completedTasks: state.completedTasks,
        selectedAvatar: state.selectedAvatar,
        ownedItems: state.ownedItems,
        equippedItem: state.equippedItem,
      })
    );
  } catch {}
};

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setScreen = useCallback((s: Screen) => {
    setState(prev => ({ ...prev, currentScreen: s }));
  }, []);

  const setSelectedAvatar = useCallback((avatar: AvatarId) => {
    setState(prev => ({ ...prev, selectedAvatar: avatar }));
  }, []);

  const completeTask = useCallback((taskId: string, reward: number) => {
    setState(prev => {
      if (prev.completedTasks[taskId]) return prev;
      return {
        ...prev,
        educoins: prev.educoins + reward,
        completedTasks: { ...prev.completedTasks, [taskId]: true },
      };
    });
  }, []);

  const buyItem = useCallback((itemId: string, price: number) => {
    let success = false;

    setState(prev => {
      if (prev.ownedItems.includes(itemId)) return prev;
      if (prev.educoins < price) return prev;

      success = true;
      return {
        ...prev,
        educoins: prev.educoins - price,
        ownedItems: [...prev.ownedItems, itemId],
      };
    });

    return success;
  }, []);

  const equipItem = useCallback((itemId: string) => {
    setState(prev => {
      if (!prev.ownedItems.includes(itemId)) return prev;
      return {
        ...prev,
        equippedItem: itemId,
      };
    });
  }, []);

  const isTaskCompleted = useCallback(
    (taskId: string) => !!state.completedTasks[taskId],
    [state.completedTasks]
  );

  const totalCompleted = Object.keys(state.completedTasks).length;

  const resetProgress = useCallback(() => {
    setState({ ...defaultState });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        setScreen,
        setSelectedAvatar,
        completeTask,
        isTaskCompleted,
        totalCompleted,
        totalTasks: TOTAL_TASKS,
        resetProgress,
        buyItem,
        equipItem,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};