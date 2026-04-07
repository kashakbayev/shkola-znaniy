import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';

interface GeographyTask {
  id: string;
  question: string;
  options: string[];
  correct: number;
  reward: number;
  type: string;
}

const TASKS: GeographyTask[] = [
  {
    id: 'geo_1',
    question: 'Қазақстанның астанасы қай қала?',
    options: ['Алматы', 'Шымкент', 'Астана', 'Тараз'],
    correct: 2,
    reward: 10,
    type: 'Астана',
  },
  {
    id: 'geo_2',
    question: 'Жер шарындағы ең үлкен мұхит қайсысы?',
    options: ['Атлант мұхиты', 'Үнді мұхиты', 'Солтүстік Мұзды мұхит', 'Тынық мұхиты'],
    correct: 3,
    reward: 10,
    type: 'Мұхиттар',
  },
  {
    id: 'geo_3',
    question: 'Қазақстан қай құрлықта орналасқан?',
    options: ['Африка', 'Еуропа', 'Еуразия', 'Оңтүстік Америка'],
    correct: 2,
    reward: 10,
    type: 'Құрлықтар',
  },
  {
    id: 'geo_4',
    question: 'Францияның астанасы қай қала?',
    options: ['Рим', 'Берлин', 'Мадрид', 'Париж'],
    correct: 3,
    reward: 15,
    type: 'Елдер мен астаналар',
  },
  {
    id: 'geo_5',
    question: 'Әлемдегі ең ұзын өзендердің бірі қайсысы?',
    options: ['Ніл', 'Есіл', 'Іле', 'Жайық'],
    correct: 0,
    reward: 15,
    type: 'Өзендер',
  },
  {
    id: 'geo_6',
    question: 'Жердің серігі қалай аталады?',
    options: ['Күн', 'Ай', 'Марс', 'Шолпан'],
    correct: 1,
    reward: 10,
    type: 'Ғарыш',
  },
];

const GeographyRoom: React.FC = () => {
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
      setFeedback({ type: 'success', text: 'Дұрыс! Жарайсың! 🌍' });
      completeTask(task.id, task.reward);
      setShowCoin(true);
      setTimeout(() => setShowCoin(false), 1500);
    } else {
      setFeedback({ type: 'error', text: 'Қате. Қайтадан байқап көр! 🗺️' });
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
        bg: 'hsl(180 25% 16%)',
        border: 'hsl(170 70% 50% / 0.3)',
        color: 'hsl(0 0% 90%)',
      };
    }

    if (i === task.correct) {
      return {
        bg: 'hsl(145 55% 18%)',
        border: 'hsl(145 70% 50%)',
        color: 'hsl(145 80% 70%)',
      };
    }

    if (i === selected) {
      return {
        bg: 'hsl(0 55% 18%)',
        border: 'hsl(0 70% 55%)',
        color: 'hsl(0 80% 72%)',
      };
    }

    return {
      bg: 'hsl(180 18% 13%)',
      border: 'hsl(180 15% 24%)',
      color: 'hsl(180 10% 42%)',
    };
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, hsl(175 35% 8%), hsl(185 28% 12%), hsl(190 20% 10%))' }}
    >
      <div className="p-4">
        <HudBar title="🌍 Географиялық панорама" showBack />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 max-w-3xl mx-auto w-full">
        <div className="fixed top-24 left-10 text-4xl opacity-10 pointer-events-none animate-float">🌍</div>
        <div className="fixed bottom-24 right-10 text-3xl opacity-10 pointer-events-none animate-float" style={{ animationDelay: '1s' }}>🗺️</div>

        <div
          className="w-full room-panel p-6 animate-fade-in"
          style={{ background: 'hsl(180 25% 13% / 0.95)', borderColor: 'hsl(170 70% 50% / 0.25)' }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'hsl(170 70% 50% / 0.18)', color: 'hsl(170 80% 68%)' }}
              >
                {task.type}
              </span>

              <span className="text-xs" style={{ color: 'hsl(180 15% 55%)' }}>
                Тапсырма {taskIndex + 1}/{TASKS.length}
              </span>

              {completed && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'hsl(145 70% 45% / 0.18)', color: 'hsl(145 80% 70%)' }}
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
              background: 'hsl(180 20% 10%)',
              backgroundImage:
                'linear-gradient(hsl(170 70% 50% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(170 70% 50% / 0.03) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <p className="font-display text-2xl font-bold" style={{ color: 'hsl(170 80% 74%)' }}>
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
                  style={{
                    background: s.bg,
                    borderColor: s.border,
                    color: s.color,
                  }}
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
              style={{ background: 'hsl(180 25% 18%)', color: 'hsl(170 80% 68%)' }}
            >
              ← Артқа
            </button>

            {feedback?.type === 'error' && (
              <button
                onClick={retry}
                className="px-4 py-2 rounded-xl font-display font-bold text-sm"
                style={{ background: 'hsl(180 25% 18%)', color: 'hsl(170 80% 68%)' }}
              >
                🔄 Қайта көру
              </button>
            )}

            <button
              onClick={nextTask}
              disabled={taskIndex === TASKS.length - 1}
              className="px-4 py-2 rounded-xl font-display font-bold text-sm disabled:opacity-30 transition-colors"
              style={{ background: 'hsl(180 25% 18%)', color: 'hsl(170 80% 68%)' }}
            >
              Келесі →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographyRoom;