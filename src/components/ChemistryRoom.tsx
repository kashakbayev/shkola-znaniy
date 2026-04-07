import React, { useState, useRef, useCallback } from 'react';
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
  C: { symbol: 'C', name: 'Көміртек', color: 'hsl(0 0% 25%)', textColor: 'hsl(0 0% 90%)' },
  N: { symbol: 'N', name: 'Азот', color: 'hsl(220 70% 55%)', textColor: 'hsl(0 0% 100%)' },
};

interface MoleculeTask {
  id: string;
  name: string;
  formula: string;
  required: Record<string, number>;
  reward: number;
  hint: string;
}

const TASKS: MoleculeTask[] = [
  { id: 'chem_1', name: 'Су (H₂O)', formula: 'H₂O', required: { H: 2, O: 1 }, reward: 10, hint: '2 сутек + 1 оттек' },
  { id: 'chem_2', name: 'Көмірқышқыл газы (CO₂)', formula: 'CO₂', required: { C: 1, O: 2 }, reward: 15, hint: '1 көміртек + 2 оттек' },
  { id: 'chem_3', name: 'Оттек (O₂)', formula: 'O₂', required: { O: 2 }, reward: 10, hint: '2 оттек атомы' },
  { id: 'chem_4', name: 'Аммиак (NH₃)', formula: 'NH₃', required: { N: 1, H: 3 }, reward: 15, hint: '1 азот + 3 сутек' },
  { id: 'chem_5', name: 'Метан (CH₄)', formula: 'CH₄', required: { C: 1, H: 4 }, reward: 20, hint: '1 көміртек + 4 сутек' },
  { id: 'chem_6', name: 'Сутек (H₂)', formula: 'H₂', required: { H: 2 }, reward: 10, hint: '2 сутек атомы' },
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
  const [placedAtoms, setPlacedAtoms] = useState<PlacedAtom[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCoinAnim, setShowCoinAnim] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);

  const task = TASKS[taskIndex];
  const completed = isTaskCompleted(task.id);

  const handleDragStart = (e: React.DragEvent, symbol: string) => {
    e.dataTransfer.setData('atom', symbol);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const symbol = e.dataTransfer.getData('atom');
    if (!symbol || !ATOMS[symbol]) return;

    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragCounterRef.current++;

    setPlacedAtoms(prev => [...prev, { id: `${symbol}_${Date.now()}_${dragCounterRef.current}`, symbol, x, y }]);
    setFeedback(null);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };

  const removeAtom = (id: string) => {
    setPlacedAtoms(prev => prev.filter(a => a.id !== id));
    setFeedback(null);
  };

  const clearWorkspace = () => { setPlacedAtoms([]); setFeedback(null); };

  const checkMolecule = () => {
    const counts: Record<string, number> = {};
    placedAtoms.forEach(a => { counts[a.symbol] = (counts[a.symbol] || 0) + 1; });

    const isCorrect = Object.keys(task.required).every(k => counts[k] === task.required[k])
      && Object.keys(counts).every(k => task.required[k] === counts[k]);

    if (isCorrect) {
      setFeedback({ type: 'success', text: 'Дұрыс! Молекула дұрыс құрастырылды! 🎉' });
      completeTask(task.id, task.reward);
      setShowCoinAnim(true);
      setTimeout(() => setShowCoinAnim(false), 1500);
    } else {
      setFeedback({ type: 'error', text: 'Қате! Тағы бір рет байқап көріңіз 🔬' });
    }
  };

  const nextTask = () => {
    if (taskIndex < TASKS.length - 1) {
      setTaskIndex(taskIndex + 1);
      setPlacedAtoms([]);
      setFeedback(null);
    }
  };

  const prevTask = () => {
    if (taskIndex > 0) {
      setTaskIndex(taskIndex - 1);
      setPlacedAtoms([]);
      setFeedback(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, hsl(200 40% 6%), hsl(200 35% 10%), hsl(200 30% 8%))' }}>
      <div className="p-4"><HudBar title="🧪 Химия" showBack /></div>

      <div className="flex-1 flex flex-col px-4 pb-4 gap-4 max-w-6xl mx-auto w-full">
        {/* Task info */}
        <div className="room-panel p-4 animate-fade-in" style={{ background: 'hsl(200 30% 12% / 0.9)', borderColor: 'hsl(175 80% 45% / 0.3)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'hsl(175 80% 45% / 0.2)', color: 'hsl(175 80% 55%)' }}>
                  Тапсырма {taskIndex + 1}/{TASKS.length}
                </span>
                {completed && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'hsl(145 70% 45% / 0.2)', color: 'hsl(145 70% 55%)' }}>✓ Орындалды</span>}
              </div>
              <h3 className="font-display text-xl font-bold text-glow-chem" style={{ color: 'hsl(175 80% 55%)' }}>
                Молекуланы құрастыр: {task.name}
              </h3>
              <p className="text-sm mt-1" style={{ color: 'hsl(200 15% 55%)' }}>Көмек: {task.hint}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="educoin-badge text-sm">🪙 +{task.reward}</div>
              <div className="flex gap-2">
                <button onClick={prevTask} disabled={taskIndex === 0} className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-30 transition-colors" style={{ background: 'hsl(200 30% 20%)', color: 'hsl(175 80% 55%)' }}>←</button>
                <button onClick={nextTask} disabled={taskIndex === TASKS.length - 1} className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-30 transition-colors" style={{ background: 'hsl(200 30% 20%)', color: 'hsl(175 80% 55%)' }}>→</button>
              </div>
            </div>
          </div>
          {/* Required atoms display */}
          <div className="flex gap-2 mt-3">
            {Object.entries(task.required).map(([sym, count]) => (
              <div key={sym} className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold" style={{ background: 'hsl(200 30% 18%)', color: ATOMS[sym].color }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: ATOMS[sym].color, color: ATOMS[sym].textColor }}>{sym}</span>
                ×{count}
              </div>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div
          ref={workspaceRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex-1 relative rounded-2xl border-2 border-dashed min-h-[320px] transition-colors"
          style={{ background: 'hsl(200 30% 8%)', borderColor: 'hsl(175 80% 45% / 0.2)', backgroundImage: 'radial-gradient(circle, hsl(175 80% 45% / 0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        >
          {placedAtoms.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="font-display text-lg" style={{ color: 'hsl(200 15% 30%)' }}>Атомдарды осы жерге сүйреп әкел ⬇️</p>
            </div>
          )}

          {/* Bond lines between close atoms */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {placedAtoms.map((a, i) =>
              placedAtoms.slice(i + 1).map(b => {
                const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
                if (dist < 120) {
                  return <line key={`${a.id}-${b.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="hsl(175 80% 45% / 0.4)" strokeWidth="3" strokeDasharray="6 4" />;
                }
                return null;
              })
            )}
          </svg>

          {placedAtoms.map(atom => (
            <div
              key={atom.id}
              className="atom-token absolute w-14 h-14 text-lg animate-bounce-in"
              style={{ left: atom.x - 28, top: atom.y - 28, background: ATOMS[atom.symbol].color, color: ATOMS[atom.symbol].textColor, boxShadow: `0 0 16px ${ATOMS[atom.symbol].color}66` }}
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

        {/* Feedback */}
        {feedback && (
          <div className={`text-center py-2 font-display font-bold text-lg animate-fade-in ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
            {feedback.text}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-3">
          <button onClick={checkMolecule} className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, hsl(175 80% 40%), hsl(175 70% 30%))', color: 'hsl(0 0% 100%)' }}>
            ✅ Тексеру
          </button>
          <button onClick={clearWorkspace} className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all hover:scale-105" style={{ background: 'hsl(200 30% 18%)', color: 'hsl(175 80% 55%)' }}>
            🗑️ Тазалау
          </button>
        </div>

        {/* Atom tray */}
        <div className="room-panel p-4" style={{ background: 'hsl(200 30% 12% / 0.9)', borderColor: 'hsl(175 80% 45% / 0.2)' }}>
          <p className="text-xs font-display font-bold mb-3" style={{ color: 'hsl(175 80% 55%)' }}>Атомдар — жұмыс аймағына сүйреп апар:</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {Object.values(ATOMS).map(atom => (
              <div
                key={atom.symbol}
                draggable
                onDragStart={(e) => handleDragStart(e, atom.symbol)}
                className="atom-token w-16 h-16 text-xl flex-col gap-0.5"
                style={{ background: atom.color, color: atom.textColor, boxShadow: `0 4px 16px ${atom.color}44` }}
              >
                <span className="font-black text-lg">{atom.symbol}</span>
                <span className="text-[9px] opacity-70">{atom.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryRoom;