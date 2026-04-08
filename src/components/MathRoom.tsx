import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';

interface MathTask {
  id: string;
  question: string;
  options: string[];
  correct: number;
  reward: number;
  type: string;
}

const TASKS: MathTask[] = [
  {
    id: 'math_1',
    question: 'Теңдеуді шеш: 2x + 6 = 14',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 8'],
    correct: 1,
    reward: 5,
    type: 'Теңдеу',
  },
  {
    id: 'math_2',
    question: '80 санының 25%-ы неге тең?',
    options: ['15', '20', '25', '40'],
    correct: 1,
    reward: 5,
    type: 'Пайыздар',
  },
  {
    id: 'math_3',
    question: 'Қабырғалары 5 және 8 болатын тіктөртбұрыштың ауданы нешеге тең?',
    options: ['13', '26', '40', '48'],
    correct: 2,
    reward: 5,
    type: 'Геометрия',
  },
];

const MathRoom: React.FC = () => {
  const { completeTask, isTaskCompleted } = useGame();
  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCoin, setShowCoin] = useState(false);

  const task = TASKS[taskIndex];
  const completed = isTaskCompleted(task.id);

  const handleSelect = (i: number) => {
    if (selected !== null) return;

    setSelected(i);

    if (i === task.correct) {
      setFeedback({ type: 'success', text: 'Дұрыс! Жарайсың! 🎉' });
      completeTask(task.id, task.reward);
      setShowCoin(true);
      setTimeout(() => setShowCoin(false), 1500);
    } else {
      setFeedback({ type: 'error', text: 'Қате. Қайтадан байқап көр! 🤔' });
    }
  };

  const nextTask = () => {
    setTaskIndex(Math.min(taskIndex + 1, TASKS.length - 1));
    setSelected(null);
    setFeedback(null);
  };

  const prevTask = () => {
    setTaskIndex(Math.max(taskIndex - 1, 0));
    setSelected(null);
    setFeedback(null);
  };

  const retry = () => {
    setSelected(null);
    setFeedback(null);
  };

  const getOptionStyle = (i: number) => {
    if (selected === null) {
      return {
        bg: 'hsl(240 25% 18%)',
        border: 'hsl(250 70% 60% / 0.3)',
        color: 'hsl(0 0% 90%)',
      };
    }

    if (i === task.correct) {
      return {
        bg: 'hsl(145 60% 20%)',
        border: 'hsl(145 70% 50%)',
        color: 'hsl(145 70% 55%)',
      };
    }

    if (i === selected) {
      return {
        bg: 'hsl(0 60% 20%)',
        border: 'hsl(0 70% 50%)',
        color: 'hsl(0 70% 55%)',
      };
    }

    return {
      bg: 'hsl(240 25% 15%)',
      border: 'hsl(240 15% 25%)',
      color: 'hsl(240 10% 40%)',
    };
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(8,15,28,0.16), rgba(8,15,28,0.34), rgba(8,15,28,0.50)), url(/backgrounds/math.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="p-4">
        <HudBar title="📐 Математика" showBack />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 max-w-3xl mx-auto w-full">
        <div className="fixed top-24 left-8 font-display text-3xl opacity-5 pointer-events-none" style={{ color: 'hsl(250 70% 60%)' }}>∑∫π</div>
        <div className="fixed bottom-20 right-10 font-display text-2xl opacity-5 pointer-events-none" style={{ color: 'hsl(250 70% 60%)' }}>√x²</div>

        <div
          className="w-full room-panel p-6 animate-fade-in"
          style={{ background: 'hsl(240 25% 13% / 0.92)', borderColor: 'hsl(250 70% 60% / 0.25)' }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'hsl(250 70% 60% / 0.2)', color: 'hsl(250 70% 65%)' }}
              >
                {task.type}
              </span>

              <span className="text-xs" style={{ color: 'hsl(240 15% 50%)' }}>
                Тапсырма {taskIndex + 1}/{TASKS.length}
              </span>

              {completed && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'hsl(145 70% 45% / 0.2)', color: 'hsl(145 70% 55%)' }}
                >
                  ✓
                </span>
              )}
            </div>

            <div className="educoin-badge text-sm">🪙 +{task.reward}</div>
          </div>

          <div
            className="rounded-xl p-6 mb-6 text-center"
            style={{
              background: 'hsl(240 20% 10%)',
              backgroundImage:
                'linear-gradient(hsl(250 70% 60% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(250 70% 60% / 0.03) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <p className="font-display text-2xl font-bold text-glow-math" style={{ color: 'hsl(250 80% 75%)' }}>
              {task.question}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {task.options.map((opt, i) => {
              const s = getOptionStyle(i);

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null && feedback?.type === 'success'}
                  className="p-4 rounded-xl font-display font-bold text-lg transition-all duration-200 hover:scale-[1.02] disabled:cursor-default border-2"
                  style={{ background: s.bg, borderColor: s.border, color: s.color }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`text-center py-2 font-display font-bold animate-fade-in ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
              {feedback.text}
            </div>
          )}

          {showCoin && (
            <div className="flex justify-center">
              <div className="text-5xl animate-coin-pop">🪙</div>
            </div>
          )}

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={prevTask}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl font-display font-bold text-sm disabled:opacity-30 transition-colors"
              style={{ background: 'hsl(240 25% 18%)', color: 'hsl(250 70% 65%)' }}
            >
              ← Артқа
            </button>

            {feedback?.type === 'error' && (
              <button
                onClick={retry}
                className="px-4 py-2 rounded-xl font-display font-bold text-sm"
                style={{ background: 'hsl(240 25% 18%)', color: 'hsl(250 70% 65%)' }}
              >
                🔄 Қайта көру
              </button>
            )}

            <button
              onClick={nextTask}
              disabled={taskIndex === TASKS.length - 1}
              className="px-4 py-2 rounded-xl font-display font-bold text-sm disabled:opacity-30 transition-colors"
              style={{ background: 'hsl(240 25% 18%)', color: 'hsl(250 70% 65%)' }}
            >
              Келесі →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathRoom;