import abylaiKhanImg from '@/assets/history/abylai-khan.jpg';
import kenesaryKhanImg from '@/assets/history/kenesary-khan.jpg';
import kabanbayBatyrImg from '@/assets/history/kabanbay-batyr.jpg';
import toleBiImg from '@/assets/history/tole-bi.jpg';
import kazybekBiImg from '@/assets/history/kazybek-bi.jpg';
import bogenbayBatyrImg from '@/assets/history/bogenbay-batyr.jpg';

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';

interface HistoricalFigure {
  id: string;
  name: string;
  title: string;
  period: string;
  image: string;
  options: string[];
  correct: number;
  reward: number;
}

const FIGURES: HistoricalFigure[] = [
  {
    id: 'hist_1',
    name: 'Абылай хан',
    title: 'Орта Жүздің ханы',
    period: 'XVIII ғасыр',
    image: abylaiKhanImg,
    options: ['Абылай хан', 'Кенесары хан', 'Қасым хан', 'Тәуке хан'],
    correct: 0,
    reward: 15
  },
  {
    id: 'hist_2',
    name: 'Кенесары хан',
    title: 'Қазақтың соңғы ханы',
    period: 'XIX ғасыр',
    image: kenesaryKhanImg,
    options: ['Абылай хан', 'Кенесары хан', 'Жәңгір хан', 'Қасым хан'],
    correct: 1,
    reward: 15
  },
  {
    id: 'hist_3',
    name: 'Қабанбай батыр',
    title: 'Аңызға айналған батыр',
    period: 'XVIII ғасыр',
    image: kabanbayBatyrImg,
    options: ['Бөгенбай батыр', 'Қабанбай батыр', 'Райымбек батыр', 'Наурызбай батыр'],
    correct: 1,
    reward: 15
  },
  {
    id: 'hist_4',
    name: 'Төле би',
    title: 'Ұлы Жүздің биі',
    period: 'XVII–XVIII ғғ.',
    image: toleBiImg,
    options: ['Әйтеке би', 'Қазыбек би', 'Төле би', 'Бұхар жырау'],
    correct: 2,
    reward: 15
  },
  {
    id: 'hist_5',
    name: 'Қазыбек би',
    title: 'Орта Жүздің биі',
    period: 'XVII–XVIII ғғ.',
    image: kazybekBiImg,
    options: ['Төле би', 'Қазыбек би', 'Әйтеке би', 'Бұхар Жырау'],
    correct: 1,
    reward: 15
  },
  {
    id: 'hist_6',
    name: 'Бөгенбай батыр',
    title: 'Ұлы көшбасшы',
    period: 'XVIII ғасыр',
    image: bogenbayBatyrImg,
    options: ['Қабанбай батыр', 'Наурызбай батыр', 'Бөгенбай батыр', 'Райымбек батыр'],
    correct: 2,
    reward: 15
  },
];

const HistoryRoom: React.FC = () => {
  const { completeTask, isTaskCompleted } = useGame();
  const [figureIndex, setFigureIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCoin, setShowCoin] = useState(false);

  const figure = FIGURES[figureIndex];
  const completed = isTaskCompleted(figure.id);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === figure.correct) {
      setFeedback({ type: 'success', text: 'Дұрыс! Жарайсың! 🎉' });
      completeTask(figure.id, figure.reward);
      setShowCoin(true);
      setTimeout(() => setShowCoin(false), 1500);
    } else {
      setFeedback({ type: 'error', text: 'Қате. Қайтадан байқап көр! 📚' });
    }
  };

  const next = () => { setFigureIndex(Math.min(figureIndex + 1, FIGURES.length - 1)); setSelected(null); setFeedback(null); };
  const prev = () => { setFigureIndex(Math.max(figureIndex - 1, 0)); setSelected(null); setFeedback(null); };
  const retry = () => { setSelected(null); setFeedback(null); };

  const getOptionStyle = (i: number) => {
    if (selected === null) return { bg: 'hsl(30 20% 16%)', border: 'hsl(40 70% 55% / 0.3)', color: 'hsl(0 0% 88%)' };
    if (i === figure.correct) return { bg: 'hsl(145 50% 16%)', border: 'hsl(145 70% 50%)', color: 'hsl(145 70% 55%)' };
    if (i === selected) return { bg: 'hsl(0 50% 16%)', border: 'hsl(0 70% 50%)', color: 'hsl(0 70% 55%)' };
    return { bg: 'hsl(30 15% 12%)', border: 'hsl(30 10% 22%)', color: 'hsl(30 10% 40%)' };
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
      <div className="p-4"><HudBar title="🏛️ Қазақстан тарихы" showBack /></div>

      {/* Decorative */}
      <div className="fixed top-24 right-8 text-4xl opacity-10 pointer-events-none animate-float">🗺️</div>
      <div className="fixed bottom-20 left-8 text-3xl opacity-10 pointer-events-none animate-float" style={{ animationDelay: '1s' }}>📜</div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 max-w-3xl mx-auto w-full">
        <div className="w-full room-panel p-6 animate-fade-in" style={{ background: 'hsl(30 20% 12% / 0.95)', borderColor: 'hsl(40 70% 55% / 0.25)' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'hsl(40 70% 55% / 0.2)', color: 'hsl(40 70% 60%)' }}>
                Тұлғаны тап
              </span>
              <span className="text-xs" style={{ color: 'hsl(30 15% 50%)' }}>Тапсырма {figureIndex + 1}/{FIGURES.length}</span>
              {completed && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'hsl(145 70% 45% / 0.2)', color: 'hsl(145 70% 55%)' }}>✓</span>}
            </div>
            <div className="educoin-badge text-sm">🪙 +{figure.reward}</div>
          </div>

          {/* Portrait card */}
          <div className="portrait-card mx-auto max-w-sm mb-6" style={{ background: 'linear-gradient(135deg, hsl(30 30% 18%), hsl(30 20% 14%))', border: '2px solid hsl(40 60% 40% / 0.3)' }}>
            <div className="p-8 flex flex-col items-center text-center">
              <div
                className="w-36 h-36 rounded-full overflow-hidden mb-4 border-4"
                style={{
                  borderColor: 'hsl(40 60% 45% / 0.5)',
                  boxShadow: '0 0 30px hsl(40 70% 55% / 0.2), inset 0 2px 10px hsl(40 50% 30% / 0.3)'
                }}
              >
                <img
                  src={figure.image}
                  alt={figure.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl font-bold mb-1 text-glow-hist" style={{ color: 'hsl(40 80% 65%)' }}>
                Суретте кім бейнеленген?
              </h3>
              <p className="text-sm" style={{ color: 'hsl(30 15% 55%)' }}>{figure.title} • {figure.period}</p>
              {/* Ornament line */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px w-8" style={{ background: 'hsl(40 60% 40% / 0.4)' }} />
                <div className="text-sm" style={{ color: 'hsl(40 60% 45%)' }}>❖</div>
                <div className="h-px w-8" style={{ background: 'hsl(40 60% 40% / 0.4)' }} />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {figure.options.map((opt, i) => {
              const s = getOptionStyle(i);
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null && feedback?.type === 'success'}
                  className="p-4 rounded-xl font-display font-bold transition-all duration-200 hover:scale-[1.02] disabled:cursor-default border-2"
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
            <div className="flex justify-center"><div className="text-5xl animate-coin-pop">🪙</div></div>
          )}

          <div className="flex justify-center gap-3 mt-4">
            <button onClick={prev} disabled={figureIndex === 0} className="px-4 py-2 rounded-xl font-display font-bold text-sm disabled:opacity-30 transition-colors" style={{ background: 'hsl(30 20% 18%)', color: 'hsl(40 70% 60%)' }}>← Артқа</button>
            {feedback?.type === 'error' && <button onClick={retry} className="px-4 py-2 rounded-xl font-display font-bold text-sm" style={{ background: 'hsl(30 20% 18%)', color: 'hsl(40 70% 60%)' }}>🔄 Қайта көру</button>}
            <button onClick={next} disabled={figureIndex === FIGURES.length - 1} className="px-4 py-2 rounded-xl font-display font-bold text-sm disabled:opacity-30 transition-colors" style={{ background: 'hsl(30 20% 18%)', color: 'hsl(40 70% 60%)' }}>Келесі →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryRoom;
