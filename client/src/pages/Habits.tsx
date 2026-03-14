import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Trash2, Flame } from "lucide-react";
import { Link } from "wouter";
import { useMochi, type Habit } from "@/hooks/use-mochi";

const COLORS = [
  'bg-pink-200 dark:bg-pink-900/40',
  'bg-purple-200 dark:bg-purple-900/40',
  'bg-blue-200 dark:bg-blue-900/40',
  'bg-emerald-200 dark:bg-emerald-900/40',
  'bg-yellow-200 dark:bg-yellow-900/40',
  'bg-rose-200 dark:bg-rose-900/40',
];

const EMOJIS = ['🌊', '🏃', '📚', '💧', '🧘', '🍎', '✍️', '🌞', '🎵', '💪', '🌸', '🎨'];

function getHabitStreak(habit: Habit): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (habit.completions.includes(key)) streak++;
    else break;
  }
  return streak;
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

export default function Habits() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useMochi();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🌸');
  const [color, setColor] = useState(COLORS[0]);
  const today = new Date().toISOString().split('T')[0];
  const last7 = getLast7Days();
  const doneToday = habits.filter(h => h.completions.includes(today)).length;

  const handleAdd = () => {
    if (!name.trim()) return;
    addHabit(name.trim(), emoji, color);
    setName(''); setShowForm(false);
  };

  return (
    <div className="min-h-screen pb-36 px-4 pt-8 max-w-md mx-auto font-display">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-200/50 shadow-sm backdrop-blur-sm btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: 'Fredoka' }}>Habit Tracker 🌱</h2>
          <p className="text-sm font-bold text-muted-foreground">
            <span style={{ fontFamily: 'Dancing Script, cursive' }}>{doneToday}/{habits.length} done today ✨</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="p-3 rounded-2xl text-white shadow-lg btn-bounce"
          style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 4px 0 0 #be185d' }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-white/70 dark:bg-white/5 border-2 border-pink-200/60 rounded-[2.5rem] p-6 mb-6 shadow-xl space-y-4 overflow-hidden backdrop-blur-sm"
          >
            <input
              autoFocus value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Habit name (e.g. Morning Run)"
              className="w-full text-lg font-bold bg-transparent border-b-2 border-pink-200 focus:border-primary outline-none py-2 placeholder:text-muted-foreground/40 text-foreground"
            />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Pick emoji</p>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-2xl transition-all btn-bounce ${emoji === e ? 'bg-pink-100 dark:bg-pink-900/30 scale-110 ring-2 ring-pink-300' : 'bg-muted'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Pick color</p>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full ${c} transition-all btn-bounce ${color === c ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''}`}
                  />
                ))}
              </div>
            </div>
            <button onClick={handleAdd}
              className="w-full py-3 text-white font-black rounded-2xl btn-bounce text-lg"
              style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', boxShadow: '0 4px 0 0 #be185d' }}>
              Add Habit 🌱
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week header */}
      {habits.length > 0 && (
        <div className="flex items-center gap-2 mb-4 pr-2">
          <div className="flex-1" />
          {last7.map(d => (
            <div key={d} className="w-9 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                {new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
              </p>
              <p className={`text-[11px] font-black ${d === today ? 'text-primary' : 'text-muted-foreground/50'}`}>
                {new Date(d + 'T00:00:00').getDate()}
              </p>
            </div>
          ))}
        </div>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-24 opacity-50">
          <div className="text-7xl mb-4 animate-float2">🌱</div>
          <p className="font-black text-xl" style={{ fontFamily: 'Fredoka' }}>No habits yet!</p>
          <p className="text-sm font-semibold text-muted-foreground mt-1">Start building your daily rituals ✨</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {habits.map(habit => {
              const streak = getHabitStreak(habit);
              const isDone = habit.completions.includes(today);
              return (
                <motion.div
                  key={habit.id} layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`bg-white/60 dark:bg-white/5 rounded-[2.5rem] p-5 border-2 backdrop-blur-sm shadow-sm transition-all ${
                    isDone ? 'border-pink-200/60 shadow-pink-100/60 dark:shadow-pink-900/10' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${habit.color} shadow-sm`}>
                      {habit.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-base text-foreground">{habit.name}</h3>
                      {streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-500 text-xs font-black">
                          <Flame size={11} fill="currentColor" /> {streak}d streak
                        </div>
                      )}
                    </div>
                    <button onClick={() => toggleHabit(habit.id)}
                      className={`px-4 py-2 rounded-2xl font-black text-sm transition-all btn-bounce ${
                        isDone
                          ? 'text-white shadow-md'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      style={isDone ? { background: 'linear-gradient(135deg, #f472b6, #c084fc)' } : {}}>
                      {isDone ? 'Done! 🎉' : 'Check'}
                    </button>
                    <button onClick={() => deleteHabit(habit.id)} className="p-2 text-muted-foreground hover:text-destructive btn-bounce">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex gap-1.5 justify-end">
                    {last7.map(d => (
                      <div key={d}
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg transition-all ${
                          habit.completions.includes(d) ? habit.color + ' shadow-sm scale-105 border border-white/40' : 'bg-muted/40'
                        }`}>
                        {habit.completions.includes(d) ? habit.emoji : ''}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
