import React, { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';

interface LanguageTask {
  id: string;
  phrase: string;
  question: string;
  options: string[];
  correct: number;
  reward: number;
}

const TASKS: LanguageTask[] = [
  {
    id: 'lang_1',
    phrase: 'Welcome to London!',
    question: '“Welcome to London” сөйлемінің аудармасын таңда',
    options: [
      'Лондонға қош келдің!',
      'Лондоннан келдім',
      'Лондон әдемі қала',
      'Лондонға барайық',
    ],
    correct: 0,
    reward: 10,
  },
  {
    id: 'lang_2',
    phrase: 'How are you?',
    question: '“How are you?” нені білдіреді?',
    options: [
      'Сен қайда барасың?',
      'Қалың қалай?',
      'Сенің атың кім?',
      'Неше жастасың?',
    ],
    correct: 1,
    reward: 10,
  },
  {
    id: 'lang_3',
    phrase: 'What is your name?',
    question: '“What is your name?” сөйлемінің мағынасы қандай?',
    options: [
      'Сен қайдан келдің?',
      'Сенің атың кім?',
      'Қайда тұрасың?',
      'Қалың қалай?',
    ],
    correct: 1,
    reward: 10,
  },
  {
    id: 'lang_4',
    phrase: 'I am from Kazakhstan.',
    question: '“I am from Kazakhstan” сөйлемінің аудармасын таңда',
    options: [
      'Мен Қазақстанға барамын',
      'Мен Қазақстаннанмын',
      'Мен Қазақстанды жақсы көремін',
      'Мен Лондонда тұрамын',
    ],
    correct: 1,
    reward: 15,
  },
  {
    id: 'lang_5',
    phrase: 'How old are you?',
    question: 'Бұл сөйлемнің дұрыс аудармасын таңда',
    options: [
      'Сен нешеде оянасың?',
      'Сен қай сыныпта оқисың?',
      'Сен неше жастасың?',
      'Сен қайда тұрасың?',
    ],
    correct: 2,
    reward: 15,
  },
  {
    id: 'lang_6',
    phrase: 'Nice to meet you!',
    question: '“Nice to meet you!” нені білдіреді?',
    options: [
      'Танысқаныма қуаныштымын!',
      'Кездескенше!',
      'Саған көмектесейін',
      'Қош келдің!',
    ],
    correct: 0,
    reward: 15,
  },
];

const LanguageRoom: React.FC = () => {
  const { completeTask, isTaskCompleted } = useGame();

  const [taskIndex, setTaskIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCoin, setShowCoin] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const task = TASKS[taskIndex];
  const completed = isTaskCompleted(task.id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (i: number) => {
    if (selected !== null) return;

    setSelected(i);

    if (i === task.correct) {
      setFeedback({ type: 'success', text: 'Дұрыс! Жарайсың! 🎉' });
      completeTask(task.id, task.reward);
      setShowCoin(true);
      setTimeout(() => setShowCoin(false), 1500);
    } else {
      setFeedback({ type: 'error', text: 'Қате. Қайтадан байқап көр! 🇬🇧' });
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
        bg: 'hsl(210 30% 16% / 0.92)',
        border: 'hsl(200 85% 65% / 0.28)',
        color: 'hsl(0 0% 95%)',
      };
    }

    if (i === task.correct) {
      return {
        bg: 'hsl(145 50% 18% / 0.95)',
        border: 'hsl(145 70% 55%)',
        color: 'hsl(145 80% 75%)',
      };
    }

    if (i === selected) {
      return {
        bg: 'hsl(0 55% 18% / 0.95)',
        border: 'hsl(0 75% 60%)',
        color: 'hsl(0 85% 78%)',
      };
    }

    return {
      bg: 'hsl(210 20% 14% / 0.7)',
      border: 'hsl(210 20% 24% / 0.6)',
      color: 'hsl(0 0% 68%)',
    };
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(8,15,28,0.16), rgba(8,15,28,0.34), rgba(8,15,28,0.50)), url(/language/london.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="p-4 relative z-20">
        <HudBar title="🇬🇧 Language Town" showBack />
      </div>

      {/* Intro animation */}
      {showIntro && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
          <div className="px-8 py-6 rounded-3xl border border-cyan-300/30 bg-slate-900/85 shadow-2xl animate-fade-in">
            <p className="text-center text-2xl md:text-4xl font-black text-cyan-300 tracking-wide">
              Welcome to London!
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-end justify-center px-4 pb-8 relative z-10">
        <div className="w-full max-w-6xl grid gap-4 lg:grid-cols-[0.95fr_1.05fr] items-end">
          {/* Character / left side */}
          <div className="relative min-h-[420px] hidden lg:flex items-start">
            <div
              className="absolute left-10 top-0 max-w-[300px] rounded-3xl px-5 py-4 border shadow-2xl animate-fade-in"
              style={{
                background: 'hsl(210 30% 12% / 0.92)',
                borderColor: 'hsl(200 85% 65% / 0.28)',
                color: 'white',
              }}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 mb-2">
                London Guide
              </p>
              <p className="text-lg font-bold text-white">
                {task.phrase}
              </p>
              <p className="text-sm mt-2 text-slate-300">
                Let's practice English together!
              </p>
            </div>
          </div>

          {/* Quiz panel */}
          <div
            className="rounded-[28px] border p-5 md:p-6 shadow-2xl backdrop-blur-md"
            style={{
              background: 'hsl(215 28% 10% / 0.86)',
              borderColor: 'hsl(200 85% 65% / 0.22)',
            }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: 'hsl(200 85% 55% / 0.18)',
                    color: 'hsl(190 90% 72%)',
                  }}
                >
                  English Quest
                </span>

                <span className="text-xs text-slate-300">
                  Тапсырма {taskIndex + 1}/{TASKS.length}
                </span>

                {completed && (
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      background: 'hsl(145 70% 45% / 0.18)',
                      color: 'hsl(145 80% 72%)',
                    }}
                  >
                    ✓ Орындалды
                  </span>
                )}
              </div>

              <div className="educoin-badge text-sm">🪙 +{task.reward}</div>
            </div>

            {/* Mobile phrase bubble */}
            <div className="lg:hidden mb-4 rounded-2xl border p-4" style={{ background: 'hsl(210 30% 12% / 0.92)', borderColor: 'hsl(200 85% 65% / 0.22)' }}>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">
                London Guide
              </p>
              <p className="text-lg font-bold text-white">{task.phrase}</p>
              <p className="text-sm mt-2 text-slate-300">Let's practice English together!</p>
            </div>

            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: 'linear-gradient(180deg, hsl(215 26% 12% / 0.95), hsl(215 24% 9% / 0.95))',
                border: '1px solid hsl(200 85% 65% / 0.18)',
              }}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 mb-2">
                Сұрақ
              </p>
              <h2 className="text-xl md:text-2xl font-black text-white leading-snug">
                {task.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {task.options.map((opt, i) => {
                const s = getOptionStyle(i);

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null && feedback?.type === 'success'}
                    className="p-4 rounded-2xl text-left font-bold transition-all duration-200 hover:scale-[1.02] disabled:cursor-default border-2"
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
              <div className={`text-center py-3 mt-4 font-display font-bold text-lg animate-fade-in ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                {feedback.text}
              </div>
            )}

            {showCoin && (
              <div className="flex justify-center mt-2">
                <div className="text-5xl animate-coin-pop">🪙</div>
              </div>
            )}

            <div className="flex justify-center gap-3 mt-5 flex-wrap">
              <button
                onClick={prevTask}
                disabled={taskIndex === 0}
                className="px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-30 transition-colors"
                style={{
                  background: 'hsl(210 30% 18% / 0.95)',
                  color: 'hsl(190 90% 72%)',
                }}
              >
                ← Артқа
              </button>

              {feedback?.type === 'error' && (
                <button
                  onClick={retry}
                  className="px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                  style={{
                    background: 'hsl(210 30% 18% / 0.95)',
                    color: 'hsl(190 90% 72%)',
                  }}
                >
                  🔄 Қайта көру
                </button>
              )}

              <button
                onClick={nextTask}
                disabled={taskIndex === TASKS.length - 1}
                className="px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-30 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, hsl(200 85% 52%), hsl(220 75% 45%))',
                  color: 'white',
                }}
              >
                Келесі →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageRoom;