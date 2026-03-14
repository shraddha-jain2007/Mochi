import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Trash2, Flame } from "lucide-react";
import { Link } from "wouter";
import { useMochi, type Habit } from "@/hooks/use-mochi";

const COLORS = [
  'bg-pink-200 dark:bg-pink-900/40',
  'bg-purple-200 dark:bg-purple-900/40',
  'bg-blue-200 dark:bg-blue-900/40',
  'bg-green-200 dark:bg-green-900/40',
  'bg-yellow-200 dark:bg-yellow-900/40',
  'bg-orange-200 dark:bg-orange-900/40',
];

const EMOJIS = ['🌊', '🏃', '📚', '💧', '🧘', '🍎', '✍️', '🌞', '🎵', '💪'];

function getHabitStreak(habit: Habit): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (habit.completions.includes(key)) {
      streak++;
    } else {
      break;
    }
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
  const [emoji, setEmoji] = useState('🌊');
  const [color, setColor] = useState(COLORS[0]);
  const today = new Date().toISOString().split('T')[0];
  const last7 = getLast7Days();

  const handleAdd = () => {
    if (!name.trim()) return;
    addHabit(name.trim(), emoji, color);
    setName('');
    setShowForm(false);
  };

  return (
    <div className="min-h-screen pb-32 px-4 pt-8 max-w-md mx-auto font-display">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-foreground">Habit Tracker</h2>
          <p className="text-sm font-bold text-muted-foreground">{habits.filter(h => h.completions.includes(today)).length}/{habits.length} done today</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg btn-bounce"
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
            className="bg-card border-2 border-secondary/30 rounded-[2.5rem] p-6 mb-6 shadow-xl space-y-4 overflow-hidden"
          >
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Habit name (e.g. Morning Run)"
              className="w-full text-lg font-bold bg-transparent border-b-2 border-muted focus:border-primary outline-none py-2 placeholder:text-muted-foreground/40 text-foreground"
            />

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Pick emoji</p>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-2xl transition-all btn-bounce ${emoji === e ? 'bg-primary/20 scale-110' : 'bg-muted'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Pick color</p>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${c} transition-all btn-bounce ${color === c ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-3 bg-primary text-primary-foreground font-black rounded-2xl btn-bounce text-lg"
            >
              Add Habit 🌱
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week Header */}
      {habits.length > 0 && (
        <div className="flex items-center gap-2 mb-4 pr-2">
          <div className="flex-1" />
          {last7.map(d => (
            <div key={d} className="w-9 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                {new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
              </p>
              <p className={`text-[10px] font-black ${d === today ? 'text-primary' : 'text-muted-foreground'}`}>
                {new Date(d + 'T00:00:00').getDate()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Habit Rows */}
      {habits.length === 0 ? (
        <div className="text-center py-20 opacity-40">
          <div className="text-6xl mb-4">🌱</div>
          <p className="font-black text-xl">No habits yet!</p>
          <p className="text-sm font-medium text-muted-foreground">Start building your daily rituals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {habits.map(habit => {
              const streak = getHabitStreak(habit);
              const doneToday = habit.completions.includes(today);
              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-[2.5rem] p-5 border-2 ${doneToday ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-border'} bg-card`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${habit.color}`}>
                      {habit.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-base text-foreground">{habit.name}</h3>
                      {streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-500 text-xs font-black">
                          <Flame size={12} fill="currentColor" /> {streak}d streak
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`px-4 py-2 rounded-2xl font-black text-sm transition-all btn-bounce ${doneToday ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}
                    >
                      {doneToday ? 'Done!' : 'Check'}
                    </button>
                    <button onClick={() => deleteHabit(habit.id)} className="p-2 text-muted-foreground hover:text-destructive btn-bounce">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* 7-day grid */}
                  <div className="flex gap-2 justify-end">
                    {last7.map(d => (
                      <div
                        key={d}
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg transition-all ${habit.completions.includes(d) ? habit.color + ' border-2 border-primary/20 scale-105' : 'bg-muted/50'}`}
                      >
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
