import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';

type HistoryTaskType = 'portrait' | 'match' | 'yesno';

interface PortraitTask {
  id: string;
  type: 'portrait';
  title: string;
  subtitle: string;
  period: string;
  image: string;
  options: string[];
  correct: number;
  reward: number;
}

interface MatchTask {
  id: string;
  type: 'match';
  title: string;
  reward: number;
  pairs: {
    left: string;
    correct: string;
  }[];
  options: string[];
}

interface YesNoTask {
  id: string;
  type: 'yesno';
  title: string;
  question: string;
  reward: number;
  options: string[];
  correct: number;
}

type HistoryTask = PortraitTask | MatchTask | YesNoTask;

const TASKS: HistoryTask[] = [
  {
    id: 'hist_1',
    type: 'portrait',
    title: 'Тұлғаны тап',
    subtitle: 'Орта жүздің биі',
    period: 'XVII–XVIII ғасырлар',
    image: '/history/kazybek-bi.jpg',
    options: ['Төле би', 'Қазыбек би', 'Әйтеке би', 'Бұқар жырау'],
    correct: 1,
    reward: 5,
  },
  {
    id: 'hist_2',
    type: 'match',
    title: 'Тұлғаны оның қалдырған мұрасымен сәйкестендіріңіз',
    reward: 5,
    pairs: [
      { left: 'Абай Құнанбаев', correct: 'Қара сөздер' },
      { left: 'Әл-Фараби', correct: 'Екінші ұстаз' },
      { left: 'Шоқан Уәлиханов', correct: 'Саяхатшы, ғалым' },
    ],
    options: ['Қара сөздер', 'Екінші ұстаз', 'Саяхатшы, ғалым'],
  },
  {
    id: 'hist_3',
    type: 'yesno',
    title: 'Қазақ хандығы',
    question: 'Керей мен Жәнібек қазақ хандығының негізін қалады ма?',
    reward: 5,
    options: ['Жоқ', 'Иә'],
    correct: 1,
  },
];

const HistoryRoom: React.FC = () => {
  const { completeTask, isTaskCompleted } = useGame();

  const [taskIndex, setTaskIndex] = useState(0);

  // portrait + yes/no
  const [selected, setSelected] = useState<number | null>(null);

  // match
  const [matchAnswers, setMatchAnswers] = useState<Record<number, string>>({});

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCoin, setShowCoin] = useState(false);

  const task = TASKS[taskIndex];
  const completed = isTaskCompleted(task.id);

  const showSuccess = () => {
    completeTask(task.id, task.reward);
    setShowCoin(true);
    setTimeout(() => setShowCoin(false), 1500);
  };

  const next = () => {
    setTaskIndex(Math.min(taskIndex + 1, TASKS.length - 1));
    setSelected(null);
    setFeedback(null);
    setMatchAnswers({});
  };

  const prev = () => {
    setTaskIndex(Math.max(taskIndex - 1, 0));
    setSelected(null);
    setFeedback(null);
    setMatchAnswers({});
  };

  const retry = () => {
    setSelected(null);
    setFeedback(null);
    setMatchAnswers({});
  };

  const handleOptionSelect = (i: number) => {
    if (selected !== null) return;
    if (task.type !== 'portrait' && task.type !== 'yesno') return;

    setSelected(i);

    if (i === task.correct) {
      setFeedback({ type: 'success', text: 'Дұрыс! Жарайсың! 🎉' });
      showSuccess();
    } else {
      setFeedback({ type: 'error', text: 'Қате. Қайтадан байқап көр! 📚' });
    }
  };

  const handleMatchChange = (index: number, value: string) => {
    setMatchAnswers(prev => ({ ...prev, [index]: value }));
    setFeedback(null);
  };

  const checkMatchTask = () => {
    if (task.type !== 'match') return;

    const allAnswered = task.pairs.every((_, index) => !!matchAnswers[index]);
    if (!allAnswered) {
      setFeedback({ type: 'error', text: 'Барлық жауапты таңдаңыз.' });
      return;
    }

    const isCorrect = task.pairs.every((pair, index) => matchAnswers[index] === pair.correct);

    if (isCorrect) {
      setFeedback({ type: 'success', text: 'Дұрыс сәйкестендірдің! 🎉' });
      showSuccess();
    } else {
      setFeedback({ type: 'error', text: 'Қате. Қайтадан байқап көр! 📚' });
    }
  };

  const getOptionStyle = (i: number) => {
    if (selected === null) {
      return {
        bg: 'hsl(30 20% 16%)',
        border: 'hsl(40 70% 55% / 0.3)',
        color: 'hsl(0 0% 88%)',
      };
    }

    const correctIndex =
      task.type === 'portrait' || task.type === 'yesno'
        ? task.correct
        : -1;

    if (i === correctIndex) {
      return {
        bg: 'hsl(145 50% 16%)',
        border: 'hsl(145 70% 50%)',
        color: 'hsl(145 70% 55%)',
      };
    }

    if (i === selected) {
      return {
        bg: 'hsl(0 50% 16%)',
        border: 'hsl(0 70% 50%)',
        color: 'hsl(0 70% 55%)',
      };
    }

    return {
      bg: 'hsl(30 15% 12%)',
      border: 'hsl(30 10% 22%)',
      color: 'hsl(30 10% 40%)',
    };
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(8,15,28,0.16), rgba(8,15,28,0.34), rgba(8,15,28,0.50)), url(/backgrounds/history.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="p-4">
        <HudBar title="🏛️ Қазақстан тарихы" showBack />
      </div>

      <div className="fixed top-24 right-8 text-4xl opacity-10 pointer-events-none animate-float">🗺️</div>
      <div className="fixed bottom-20 left-8 text-3xl opacity-10 pointer-events-none animate-float" style={{ animationDelay: '1s' }}>📜</div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 max-w-4xl mx-auto w-full">
        <div
          className="w-full room-panel p-6 animate-fade-in"
          style={{ background: 'hsl(30 20% 12% / 0.90)', borderColor: 'hsl(40 70% 55% / 0.25)' }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'hsl(40 70% 55% / 0.2)', color: 'hsl(40 70% 60%)' }}
              >
                {task.title}
              </span>

              <span className="text-xs" style={{ color: 'hsl(30 15% 50%)' }}>
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

          {/* Task 1: portrait */}
          {task.type === 'portrait' && (
            <>
              <div
                className="portrait-card mx-auto max-w-sm mb-6"
                style={{
                  background: 'linear-gradient(135deg, hsl(30 30% 18%), hsl(30 20% 14%))',
                  border: '2px solid hsl(40 60% 40% / 0.3)',
                }}
              >
                <div className="p-8 flex flex-col items-center text-center">
                  <div
                    className="w-36 h-36 rounded-full overflow-hidden mb-4 border-4"
                    style={{
                      borderColor: 'hsl(40 60% 45% / 0.5)',
                      boxShadow: '0 0 30px hsl(40 70% 55% / 0.2), inset 0 2px 10px hsl(40 50% 30% / 0.3)',
                    }}
                  >
                    <img
                      src={task.image}
                      alt="Тұлға"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3
                    className="font-display text-xl font-bold mb-1 text-glow-hist"
                    style={{ color: 'hsl(40 80% 65%)' }}
                  >
                    Бұл кім?
                  </h3>

                  <p className="text-sm" style={{ color: 'hsl(30 15% 55%)' }}>
                    {task.subtitle} • {task.period}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {task.options.map((opt, i) => {
                  const s = getOptionStyle(i);

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      disabled={selected !== null && feedback?.type === 'success'}
                      className="p-4 rounded-xl font-display font-bold transition-all duration-200 hover:scale-[1.02] disabled:cursor-default border-2"
                      style={{ background: s.bg, borderColor: s.border, color: s.color }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Task 2: matching */}
          {task.type === 'match' && (
            <div className="space-y-4 mb-4">
              {task.pairs.map((pair, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-[1fr_1fr] gap-3 items-center rounded-xl p-4 border"
                  style={{
                    background: 'hsl(30 16% 14% / 0.9)',
                    borderColor: 'hsl(40 70% 55% / 0.18)',
                  }}
                >
                  <div className="font-display font-bold text-lg" style={{ color: 'hsl(0 0% 92%)', fontFamily: 'Arial, sans-serif' }}>
                    {index + 1}. {pair.left}
                  </div>

                  <select
                    value={matchAnswers[index] || ''}
                    onChange={(e) => handleMatchChange(index, e.target.value)}
                    className="rounded-xl px-4 py-3 font-bold outline-none border"
                    style={{
                      background: 'hsl(30 20% 12%)',
                      borderColor: 'hsl(40 70% 55% / 0.25)',
                      color: 'white',
                    }}
                  >
                    <option value="">Таңдаңыз</option>
                    {task.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  onClick={checkMatchTask}
                  className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, hsl(40 70% 55%), hsl(30 60% 42%))',
                    color: 'white',
                  }}
                >
                  ✅ Тексеру
                </button>
              </div>
            </div>
          )}

          {/* Task 3: yes/no */}
          {task.type === 'yesno' && (
            <>
              <div
                className="rounded-xl p-6 mb-6 text-center"
                style={{
                  background: 'hsl(30 18% 10% / 0.92)',
                  border: '1px solid hsl(40 70% 55% / 0.18)',
                }}
              >
                <p
                  className="font-display text-2xl font-bold"
                  style={{ color: 'hsl(40 80% 68%)' }}
                >
                  {task.question}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 max-w-md mx-auto">
                {task.options.map((opt, i) => {
                  const s = getOptionStyle(i);

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      disabled={selected !== null && feedback?.type === 'success'}
                      className="p-4 rounded-xl font-display font-bold text-lg transition-all duration-200 hover:scale-[1.02] disabled:cursor-default border-2"
                      style={{ background: s.bg, borderColor: s.border, color: s.color }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          )}

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
              onClick={prev}
              disabled={taskIndex === 0}
              className="px-4 py-2 rounded-xl font-display font-bold text-sm disabled:opacity-30 transition-colors"
              style={{ background: 'hsl(30 20% 18%)', color: 'hsl(40 70% 60%)' }}
            >
              ← Артқа
            </button>

            {feedback?.type === 'error' && (
              <button
                onClick={retry}
                className="px-4 py-2 rounded-xl font-display font-bold text-sm"
                style={{ background: 'hsl(30 20% 18%)', color: 'hsl(40 70% 60%)' }}
              >
                🔄 Қайта көру
              </button>
            )}

            <button
              onClick={next}
              disabled={taskIndex === TASKS.length - 1}
              className="px-4 py-2 rounded-xl font-display font-bold text-sm disabled:opacity-30 transition-colors"
              style={{ background: 'hsl(30 20% 18%)', color: 'hsl(40 70% 60%)' }}
            >
              Келесі →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryRoom;