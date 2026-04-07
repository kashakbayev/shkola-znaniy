import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Screen = 'hub' | 'chemistry' | 'math' | 'history';

interface TaskProgress {
  [taskId: string]: boolean;
}

interface GameState {
  educoins: number;
  completedTasks: TaskProgress;
  currentScreen: Screen;
}

interface GameContextType extends GameState {
  setScreen: (s: Screen) => void;
  completeTask: (taskId: string, reward: number) => void;
  isTaskCompleted: (taskId: string) => boolean;
  totalCompleted: number;
  totalTasks: number;
  resetProgress: () => void;
}

const STORAGE_KEY = 'eduschool_progress';
const TOTAL_TASKS = 18;

const defaultState: GameState = {
  educoins: 0,
  completedTasks: {},
  currentScreen: 'hub',
};

const loadState = (): GameState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed, currentScreen: 'hub' };
    }
  } catch {}
  return { ...defaultState };
};

const saveState = (state: GameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ educoins: state.educoins, completedTasks: state.completedTasks }));
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

  useEffect(() => { saveState(state); }, [state]);

  const setScreen = useCallback((s: Screen) => setState(prev => ({ ...prev, currentScreen: s })), []);

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

  const isTaskCompleted = useCallback((taskId: string) => !!state.completedTasks[taskId], [state.completedTasks]);

  const totalCompleted = Object.keys(state.completedTasks).length;

  const resetProgress = useCallback(() => {
    setState({ ...defaultState });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <GameContext.Provider value={{ ...state, setScreen, completeTask, isTaskCompleted, totalCompleted, totalTasks: TOTAL_TASKS, resetProgress }}>
      {children}
    </GameContext.Provider>
  );
};
