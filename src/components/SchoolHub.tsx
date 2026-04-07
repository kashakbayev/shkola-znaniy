import React from 'react';
import { useGame } from '@/contexts/GameContext';
import HudBar from '@/components/HudBar';
import { FlaskConical, Calculator, Landmark } from 'lucide-react';
import type { Screen } from '@/contexts/GameContext';
import { Languages } from 'lucide-react';

const rooms: { id: Screen; name: string; icon: React.ReactNode; emoji: string; gradient: string; glowClass: string; desc: string }[] = [
  {
    id: 'chemistry',
    name: 'Химия',
    icon: <FlaskConical className="w-10 h-10" />,
    emoji: '🧪',
    gradient: 'from-chem-bg via-chem-panel to-chem-bg',
    glowClass: 'glow-chem',
    desc: 'Молекулалар зертханасы',
  },
  {
    id: 'math',
    name: 'Математика',
    icon: <Calculator className="w-10 h-10" />,
    emoji: '📐',
    gradient: 'from-math-bg via-math-panel to-math-bg',
    glowClass: 'glow-math',
    desc: 'Математикалық лабиринт',
  },
  {
    id: 'history',
    name: 'Қазақстан тарихы',
    icon: <Landmark className="w-10 h-10" />,
    emoji: '🏛️',
    gradient: 'from-hist-bg via-hist-panel to-hist-bg',
    glowClass: 'glow-hist',
    desc: 'Тарих порталы',
  },
  {
  id: 'language',
  name: 'Language Town',
  icon: <Languages className="w-10 h-10" />,
  emoji: '🗣️',
  gradient: 'from-sky-900 via-cyan-900 to-sky-950',
  glowClass: 'glow-language',
  desc: 'Тілдер қаласы',
},
];

const accentColors: Record<string, string> = {
  chemistry: 'hsl(175 80% 45%)',
  math: 'hsl(250 70% 60%)',
  history: 'hsl(40 70% 55%)',
  language: 'hsl(190 80% 55%)',
};

const SchoolHub: React.FC = () => {

    const handleReset = () => {
      const ok = window.confirm('Прогресті шынымен өшіргің келе ме?');
      if (!ok) return;

      localStorage.clear();
      window.location.reload();
    };

  const { setScreen, totalCompleted, totalTasks, selectedAvatar, setSelectedAvatar } = useGame();
  const progressPercent = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, hsl(220 25% 10%), hsl(220 20% 16%), hsl(25 20% 14%))' }}
    >
      <div className="p-4">
        <HudBar title="Білім мектебі" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Title area */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="text-6xl mb-3">🏫</div>
          <h1 className="font-display text-4xl font-black mb-2" style={{ color: 'hsl(0 0% 92%)' }}>
            Білім мектебі
          </h1>
          <p className="font-body text-lg" style={{ color: 'hsl(220 15% 60%)' }}>
            Кабинетті таңда да, оқуды баста
          </p>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="text-6xl">
              {selectedAvatar === 'boy' && '🧑‍🎓'}
              {selectedAvatar === 'girl' && '👩‍🎓'}
              {selectedAvatar === 'student1' && '🧑'}
              {selectedAvatar === 'student2' && '👧'}
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setSelectedAvatar('boy')}
                className="px-3 py-2 rounded-xl font-bold"
              >
                Ұл
              </button>
              <button
                onClick={() => setSelectedAvatar('girl')}
                className="px-3 py-2 rounded-xl font-bold"
              >
                Қыз
              </button>
              <button
                onClick={() => setSelectedAvatar('student1')}
                className="px-3 py-2 rounded-xl font-bold"
              >
                Аватар 1
              </button>
              <button
                onClick={() => setSelectedAvatar('student2')}
                className="px-3 py-2 rounded-xl font-bold"
              >
                Аватар 2
              </button>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105"
            style={{
              background: 'hsl(0 70% 50% / 0.15)',
              color: 'hsl(0 80% 70%)',
              border: '1px solid hsl(0 70% 50% / 0.3)'
            }}
          >
            Прогресті тазалау
          </button>
          <br></br>
          <button
            onClick={() => setScreen('shop')}
            className="mt-4 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(300 70% 55%), hsl(280 70% 45%))',
              color: 'white',
            }}
          >
            🛍️ Дүкенге кіру
          </button>
          {/* Progress bar */}
          <div className="mt-4 mx-auto max-w-xs">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'hsl(220 15% 55%)' }}>
              <span>Прогресс</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'hsl(220 20% 20%)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, hsl(175 80% 45%), hsl(250 70% 60%), hsl(40 70% 55%))' }}
              />
            </div>
          </div>
        </div>

        {/* Classroom doors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {rooms.map((room, i) => (
            <button
              key={room.id}
              onClick={() => setScreen(room.id)}
              className={`hub-door group bg-gradient-to-br ${room.gradient} p-1`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative rounded-xl overflow-hidden p-8 flex flex-col items-center gap-4 min-h-[280px] justify-center"
                style={{ background: 'hsl(220 25% 12% / 0.85)' }}>
                {/* Glow overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${accentColors[room.id]} 0%, transparent 70%)`, opacity: 0 }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${accentColors[room.id]}, transparent 70%)` }}
                />

                {/* Door top decoration */}
                <div className="w-20 h-1.5 rounded-full mb-2 transition-all duration-300 group-hover:w-28"
                  style={{ background: accentColors[room.id] }} />

                <div className="text-5xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  {room.emoji}
                </div>

                <div style={{ color: accentColors[room.id] }} className="transition-transform duration-300 group-hover:scale-110">
                  {room.icon}
                </div>

                <h3 className="font-display text-xl font-bold" style={{ color: 'hsl(0 0% 92%)' }}>
                  {room.name}
                </h3>
                <p className="text-sm" style={{ color: 'hsl(220 15% 55%)' }}>{room.desc}</p>

                {/* Enter indicator */}
                <div className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 opacity-60 group-hover:opacity-100"
                  style={{ background: `${accentColors[room.id]}22`, color: accentColors[room.id], border: `1px solid ${accentColors[room.id]}44` }}>
                  Кіру →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 text-4xl opacity-10 animate-float pointer-events-none">📚</div>
      <div className="fixed top-40 right-12 text-3xl opacity-10 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>⚗️</div>
      <div className="fixed bottom-20 left-16 text-3xl opacity-10 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>🎓</div>
      <div className="fixed bottom-32 right-20 text-4xl opacity-10 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>✏️</div>
    </div>
  );
};

export default SchoolHub;