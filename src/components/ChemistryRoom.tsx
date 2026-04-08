import React, { useCallback, useRef, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';

interface AtomDef {
  symbol: string;
  name: string;
  color: string;
  textColor: string;
}

const ATOMS: Record<string, AtomDef> = {
  H: { symbol: 'H', name: 'Сутек', color: 'hsl(0 0% 85%)', textColor: 'hsl(0 0% 10%)' },
  O: { symbol: 'O', name: 'Оттек', color: 'hsl(0 70% 55%)', textColor: 'hsl(0 0% 100%)' },
  Na: { symbol: 'Na', name: 'Натрий', color: 'hsl(220 70% 65%)', textColor: 'hsl(0 0% 100%)' },
  C: { symbol: 'C', name: 'Көміртек', color: 'hsl(0 0% 25%)', textColor: 'hsl(0 0% 90%)' },
  Cl: { symbol: 'Cl', name: 'Хлор', color: 'hsl(120 55% 45%)', textColor: 'hsl(0 0% 100%)' },
  N: { symbol: 'N', name: 'Азот', color: 'hsl(220 70% 55%)', textColor: 'hsl(0 0% 100%)' }
};

type ChemistryTaskType = 'sequence' | 'build' | 'identify';

interface ChemistryTask {
  id: string;
  type: ChemistryTaskType;
  title: string;
  reward: number;

  question?: string;

  // sequence
  steps?: string[];
  sequenceOptions?: string[];
  correctSequence?: number;

  // build
  formula?: string;
  required?: Record<string, number>;
  hint?: string;

  // identify
  image?: string;
  options?: string[];
  correct?: number;
}

const TASKS: ChemistryTask[] = [
  {
    id: 'chem_1',
    type: 'sequence',
    title: 'Тұзды суда еріту кезеңдері',
    reward: 5,
    question: 'Тұзды суда еріту кезеңдерін дұрыс ретпен қойыңыз:',
    steps: [
      'Стақанға су құю',
      'Тұзды өлшеп алу',
      'Тұзды суға салу',
      'Шыны таяқшамен араластыру',
    ],
    sequenceOptions: [
      '1 → 2 → 3 → 4',
      '2 → 1 → 3 → 4',
      '1 → 3 → 2 → 4',
      '2 → 3 → 1 → 4',
    ],
    correctSequence: 1,
  },
  {
    id: 'chem_2',
    type: 'build',
    title: 'Ас тұзының молекуласын құрастыр',
    reward: 5,
    question: 'Натрий мен хлор әрекеттескенде түзілетін ас тұзының молекуласын атомдардан құрастыр.',
    formula: 'NaCl',
    required: { Na: 1, Cl: 1 },
    
  },
  {
    id: 'chem_3',
    type: 'identify',
    title: 'Молекуланы анықта',
    reward: 5,
    question: 'Экрандағы молекуланың моделіне қарап, оның қай затқа тиесілі екенін табыңыз.',
    image: '/chemistry/h2o-model.png',
    options: ['Су', 'Көмірқышқыл газы', 'Метан'],
    correct: 0,
  },
];

interface PlacedAtom {
  id: string;
  symbol: string;
  x: number;
  y: number;
}

const ChemistryRoom: React.FC = () => {
  const { completeTask, isTaskCompleted } = useGame();

  const [taskIndex, setTaskIndex] = useState(0);

  // common
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCoinAnim, setShowCoinAnim] = useState(false);

  // sequence / identify
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // build
  const [placedAtoms, setPlacedAtoms] = useState<PlacedAtom[]>([]);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);

  const task = TASKS[taskIndex];
  const completed = isTaskCompleted(task.id);

  const showSuccess = (reward: number) => {
    completeTask(task.id, reward);
    setShowCoinAnim(true);
    setTimeout(() => setShowCoinAnim(false), 1500);
  };

  const goNext = () => {
    if (taskIndex < TASKS.length - 1) {
      setTaskIndex(taskIndex + 1);
      setFeedback(null);
      setSelectedOption(null);
      setPlacedAtoms([]);
    }
  };

  const goPrev = () => {
    if (taskIndex > 0) {
      setTaskIndex(taskIndex - 1);
      setFeedback(null);
      setSelectedOption(null);
      setPlacedAtoms([]);
    }
  };

  const retry = () => {
    setFeedback(null);
    setSelectedOption(null);
    if (task.type === 'build') setPlacedAtoms([]);
  };

  // sequence + identify
  const handleOptionSelect = (i: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(i);

    let isCorrect = false;

    if (task.type === 'sequence') {
      isCorrect = i === task.correctSequence;
    }

    if (task.type === 'identify') {
      isCorrect = i === task.correct;
    }

    if (isCorrect) {
      setFeedback({ type: 'success', text: 'Дұрыс! Жарайсың! 🎉' });
      showSuccess(task.reward);
    } else {
      setFeedback({ type: 'error', text: 'Қате. Қайтадан байқап көр! 🔬' });
    }
  };

  // build
  const handleDragStart = (e: React.DragEvent, symbol: string) => {
    e.dataTransfer.setData('atom', symbol);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    if (task.type !== 'build') return;

    const symbol = e.dataTransfer.getData('atom');
    if (!symbol || !ATOMS[symbol]) return;

    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragCounterRef.current++;

    setPlacedAtoms(prev => [
      ...prev,
      {
        id: `${symbol}_${Date.now()}_${dragCounterRef.current}`,
        symbol,
        x,
        y,
      },
    ]);
    setFeedback(null);
  }, [task.type]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const removeAtom = (id: string) => {
    setPlacedAtoms(prev => prev.filter(a => a.id !== id));
    setFeedback(null);
  };

  const clearWorkspace = () => {
    setPlacedAtoms([]);
    setFeedback(null);
  };

  const checkMolecule = () => {
    if (task.type !== 'build' || !task.required) return;

    const counts: Record<string, number> = {};
    placedAtoms.forEach(a => {
      counts[a.symbol] = (counts[a.symbol] || 0) + 1;
    });

    const isCorrect =
      Object.keys(task.required).every(k => counts[k] === task.required?.[k]) &&
      Object.keys(counts).every(k => task.required?.[k] === counts[k]);

    if (isCorrect) {
      setFeedback({ type: 'success', text: 'Дұрыс! NaCl дұрыс құрастырылды! 🎉' });
      showSuccess(task.reward);
    } else {
      setFeedback({ type: 'error', text: 'Қате! Тағы бір рет байқап көріңіз 🔬' });
    }
  };

  const getOptionStyle = (i: number) => {
    if (selectedOption === null) {
      return {
        bg: 'hsl(200 30% 16%)',
        border: 'hsl(175 80% 45% / 0.3)',
        color: 'hsl(0 0% 90%)',
      };
    }

    const isCorrect =
      (task.type === 'sequence' && i === task.correctSequence) ||
      (task.type === 'identify' && i === task.correct);

    if (isCorrect) {
      return {
        bg: 'hsl(145 50% 18%)',
        border: 'hsl(145 70% 50%)',
        color: 'hsl(145 75% 60%)',
      };
    }

    if (i === selectedOption) {
      return {
        bg: 'hsl(0 50% 18%)',
        border: 'hsl(0 70% 50%)',
        color: 'hsl(0 75% 60%)',
      };
    }

    return {
      bg: 'hsl(200 25% 12%)',
      border: 'hsl(200 15% 22%)',
      color: 'hsl(200 10% 40%)',
    };
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(8,15,28,0.16), rgba(8,15,28,0.34), rgba(8,15,28,0.50)), url(/backgrounds/chemistry.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="p-4">
        <HudBar title="🧪 Химия" showBack />
      </div>

      <div className="flex-1 flex flex-col px-4 pb-6 gap-4 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div
          className="room-panel p-4 animate-fade-in"
          style={{ background: 'hsl(200 30% 12% / 0.88)', borderColor: 'hsl(175 80% 45% / 0.3)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'hsl(175 80% 45% / 0.2)', color: 'hsl(175 80% 55%)' }}
                >
                  Тапсырма {taskIndex + 1}/{TASKS.length}
                </span>

                {completed && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'hsl(145 70% 45% / 0.2)', color: 'hsl(145 70% 55%)' }}
                  >
                    ✓ Орындалды
                  </span>
                )}
              </div>

              <h3
                className="font-display text-xl font-bold text-glow-chem"
                style={{ color: 'hsl(175 80% 55%)' }}
              >
                {task.title}
              </h3>

              {task.question && (
                <p className="text-sm mt-1" style={{ color: 'hsl(200 15% 55%)' }}>
                  {task.question}
                </p>
              )}

              {task.type === 'build' && task.hint && (
                <p className="text-sm mt-1" style={{ color: 'hsl(200 15% 55%)' }}>
                  Көмек: {task.hint}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="educoin-badge text-sm">🪙 +{task.reward}</div>
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={taskIndex === 0}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-30 transition-colors"
                  style={{ background: 'hsl(200 30% 20%)', color: 'hsl(175 80% 55%)' }}
                >
                  ←
                </button>
                <button
                  onClick={goNext}
                  disabled={taskIndex === TASKS.length - 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-30 transition-colors"
                  style={{ background: 'hsl(200 30% 20%)', color: 'hsl(175 80% 55%)' }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TASK TYPE: sequence */}
        {task.type === 'sequence' && (
          <div
            className="room-panel p-6 animate-fade-in"
            style={{ background: 'hsl(200 30% 12% / 0.88)', borderColor: 'hsl(175 80% 45% / 0.3)' }}
          >
            <div className="mb-5">
              <h4 className="font-display text-lg font-bold mb-3" style={{ color: 'hsl(175 80% 58%)' }}>
                Кезеңдер:
              </h4>

              <div className="grid gap-2">
                {task.steps?.map((step, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 rounded-xl border"
                    style={{
                      background: 'hsl(200 25% 10% / 0.9)',
                      borderColor: 'hsl(175 80% 45% / 0.15)',
                      color: 'hsl(0 0% 92%)',
                    }}
                  >
                    {index + 1}. {step}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold mb-3" style={{ color: 'hsl(175 80% 58%)' }}>
                Дұрыс ретті таңда:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {task.sequenceOptions?.map((opt, i) => {
                  const s = getOptionStyle(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      disabled={selectedOption !== null && feedback?.type === 'success'}
                      className="p-4 rounded-xl font-display font-bold text-lg transition-all duration-200 hover:scale-[1.02] disabled:cursor-default border-2"
                      style={{ background: s.bg, borderColor: s.border, color: s.color }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TASK TYPE: build */}
        {task.type === 'build' && (
          <>
            

            {/* Workspace */}
            <div
              ref={workspaceRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex-1 relative rounded-2xl border-2 border-dashed min-h-[320px] transition-colors"
              style={{
                background: 'hsl(200 30% 8% / 0.92)',
                borderColor: 'hsl(175 80% 45% / 0.2)',
                backgroundImage: 'radial-gradient(circle, hsl(175 80% 45% / 0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {placedAtoms.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="font-display text-lg" style={{ color: 'hsl(200 15% 34%)' }}>
                    Атомдарды осы жерге сүйреп әкел ⬇️
                  </p>
                </div>
              )}

              {/* Bond lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {placedAtoms.map((a, i) =>
                  placedAtoms.slice(i + 1).map(b => {
                    const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
                    if (dist < 120) {
                      return (
                        <line
                          key={`${a.id}-${b.id}`}
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke="hsl(175 80% 45% / 0.4)"
                          strokeWidth="3"
                          strokeDasharray="6 4"
                        />
                      );
                    }
                    return null;
                  })
                )}
              </svg>

              {placedAtoms.map(atom => (
                <div
                  key={atom.id}
                  className="atom-token absolute w-14 h-14 text-lg animate-bounce-in"
                  style={{
                    left: atom.x - 28,
                    top: atom.y - 28,
                    background: ATOMS[atom.symbol].color,
                    color: ATOMS[atom.symbol].textColor,
                    boxShadow: `0 0 16px ${ATOMS[atom.symbol].color}66`,
                  }}
                  onClick={() => removeAtom(atom.id)}
                  title="Жою үшін бас"
                >
                  {atom.symbol}
                </div>
              ))}

              {showCoinAnim && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-6xl animate-coin-pop">🪙</div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={checkMolecule}
                className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, hsl(175 80% 40%), hsl(175 70% 30%))',
                  color: 'hsl(0 0% 100%)',
                }}
              >
                ✅ Тексеру
              </button>

              <button
                onClick={clearWorkspace}
                className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'hsl(200 30% 18%)', color: 'hsl(175 80% 55%)' }}
              >
                🗑️ Тазалау
              </button>
            </div>

            {/* Atom tray */}
            <div
              className="room-panel p-4"
              style={{ background: 'hsl(200 30% 12% / 0.88)', borderColor: 'hsl(175 80% 45% / 0.2)' }}
            >
              <p className="text-xs font-display font-bold mb-3" style={{ color: 'hsl(175 80% 55%)' }}>
                Атомдар — жұмыс аймағына сүйреп апар:
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                {Object.values(ATOMS).map(atom => (
                  <div
                    key={atom.symbol}
                    draggable
                    onDragStart={(e) => handleDragStart(e, atom.symbol)}
                    className="atom-token w-16 h-16 text-xl flex-col gap-0.5"
                    style={{
                      background: atom.color,
                      color: atom.textColor,
                      boxShadow: `0 4px 16px ${atom.color}44`,
                    }}
                  >
                    <span className="font-black text-lg">{atom.symbol}</span>
                    <span className="text-[9px] opacity-70">{atom.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TASK TYPE: identify */}
        {task.type === 'identify' && (
          <div
            className="room-panel p-6 animate-fade-in"
            style={{ background: 'hsl(200 30% 12% / 0.88)', borderColor: 'hsl(175 80% 45% / 0.3)' }}
          >
            <div className="flex flex-col items-center">
              <div
                className="rounded-2xl overflow-hidden border mb-5 max-w-md w-full"
                style={{ borderColor: 'hsl(175 80% 45% / 0.2)' }}
              >
                <img
                  src={task.image}
                  alt="Молекула моделі"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                {task.options?.map((opt, i) => {
                  const s = getOptionStyle(i);

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      disabled={selectedOption !== null && feedback?.type === 'success'}
                      className="p-4 rounded-xl font-display font-bold text-lg transition-all duration-200 hover:scale-[1.02] disabled:cursor-default border-2"
                      style={{ background: s.bg, borderColor: s.border, color: s.color }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`text-center py-2 font-display font-bold text-lg animate-fade-in ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
            {feedback.text}
          </div>
        )}

        {/* Retry button for non-build tasks */}
        {feedback?.type === 'error' && task.type !== 'build' && (
          <div className="flex justify-center">
            <button
              onClick={retry}
              className="px-4 py-2 rounded-xl font-display font-bold text-sm"
              style={{ background: 'hsl(200 30% 18%)', color: 'hsl(175 80% 55%)' }}
            >
              🔄 Қайта көру
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChemistryRoom;