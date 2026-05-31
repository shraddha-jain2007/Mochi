import { useMemo } from "react";
import { useMochi } from "@/hooks/use-mochi";
import { Link } from "wouter";
import { ChevronLeft, Trash2, Calendar, Clock, Target, Zap, Flame, Trophy, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const LEVEL_MILESTONES = [1, 5, 10, 20, 30, 50];

function getLevelFromXp(xp: number) { return Math.floor(xp / 100) + 1; }

export default function History() {
  const { sessions, clearHistory, xp, streak } = useMochi();

  const totalFocusMinutes = useMemo(() => sessions.reduce((a, s) => a + (s.type === 'pomodoro' ? s.minutes : 0), 0), [sessions]);
  const totalTasks = useMemo(() => sessions.filter(s => s.type === 'task').length, [sessions]);
  const currentLevel = getLevelFromXp(xp);
  const xpProgress = xp % 100;

  // Group by month, newest first
  const groupedSessions = useMemo(() => {
    const groups: Record<string, typeof sessions> = {};
    [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach(s => {
        const month = format(new Date(s.date), "MMMM yyyy");
        if (!groups[month]) groups[month] = [];
        groups[month].push(s);
      });
    return groups;
  }, [sessions]);

  // Monthly stats
  const monthStats = useMemo(() =>
    Object.entries(groupedSessions).map(([month, list]) => ({
      month,
      focusMins: list.reduce((a, s) => a + (s.type === 'pomodoro' ? s.minutes : 0), 0),
      tasks: list.filter(s => s.type === 'task').length,
      count: list.length,
    })), [groupedSessions]);

  // Next XP milestone
  const nextMilestoneLevel = LEVEL_MILESTONES.find(l => l > currentLevel) ?? currentLevel + 10;

  return (
    <div className="min-h-screen pb-36 px-4 pt-8 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-3 rounded-2xl bg-white/70 border border-pink-100 shadow-sm btn-bounce backdrop-blur-sm" data-testid="button-back">
              <ChevronLeft size={20} />
            </button>
          </Link>
          <div>
            <h2 className="text-3xl font-black text-foreground leading-tight" style={{ fontFamily: 'Fredoka' }}>Memory Book</h2>
            <p className="text-xs font-bold text-muted-foreground">{sessions.length} entries logged ✨</p>
          </div>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={() => { if (confirm("Wipe all memories? Mochi will be sad...")) clearHistory(); }}
            className="p-3 text-rose-400 hover:bg-rose-50 rounded-2xl transition-colors btn-bounce"
            data-testid="button-clear-history"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Hero milestones bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] p-6 mb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #a5b4fc)' }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute top-3 right-5 text-xl animate-sparkle">✨</div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-white/80" />
            <span className="text-xs font-black text-white/80 uppercase tracking-widest">Your Milestones</span>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { icon: Trophy,        val: `Lv ${currentLevel}`,         label: "Level" },
              { icon: Zap,           val: `${xp} XP`,                   label: "Total XP" },
              { icon: Clock,         val: `${totalFocusMinutes}m`,       label: "Focused" },
              { icon: CheckCircle2,  val: String(totalTasks),            label: "Tasks" },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="bg-white/20 backdrop-blur-sm rounded-[1.25rem] p-3 text-center border border-white/25">
                <Icon size={14} className="text-white mx-auto mb-1 opacity-80" />
                <p className="text-base font-black text-white leading-none" style={{ fontFamily: 'Fredoka' }}>{val}</p>
                <p className="text-[9px] font-bold text-white/70 uppercase tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* XP progress to next level */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black text-white/80">Level {currentLevel}</span>
              <span className="text-[10px] font-black text-white/80">{xpProgress}/100 XP → Level {currentLevel + 1}</span>
            </div>
            <div className="h-2.5 bg-white/25 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.9, delay: 0.3 }}
              />
            </div>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-2 mt-3 bg-white/20 border border-white/25 rounded-2xl px-3 py-2 w-fit">
              <Flame size={14} className="text-orange-200" fill="currentColor" />
              <span className="text-xs font-black text-white">{streak} day streak 🔥</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Month summary chips */}
      {monthStats.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-5">
          {monthStats.map(m => (
            <a key={m.month} href={`#month-${m.month.replace(' ', '-')}`}
              className="shrink-0 bg-white/70 border-2 border-pink-100 rounded-[1.5rem] px-4 py-2 flex items-center gap-2 text-xs font-black text-zinc-600 backdrop-blur-sm hover:bg-pink-50 transition-colors"
            >
              <span>{m.month}</span>
              <span className="text-pink-400">·</span>
              <span>{m.focusMins}m</span>
              <span className="text-emerald-500">{m.tasks}✓</span>
            </a>
          ))}
        </div>
      )}

      {/* Empty state */}
      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <div className="w-28 h-28 bg-pink-50 border-4 border-dashed border-pink-200 rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
            <Calendar size={48} className="text-pink-300" />
          </div>
          <p className="text-xl font-black text-zinc-700" style={{ fontFamily: 'Fredoka' }}>Blank pages...</p>
          <p className="font-semibold text-zinc-400 mt-2 max-w-xs">Complete Pomodoro sessions or tasks to start your memory book!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedSessions).map(([month, monthSessions], idx) => {
            const mStats = monthStats[idx];
            return (
              <motion.div
                key={month}
                id={`month-${month.replace(' ', '-')}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                {/* Month header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-200/50 px-4 py-1.5 rounded-full">
                    <h3 className="text-sm font-black text-zinc-700">{month}</h3>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-pink-100 to-transparent" />
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 shrink-0">
                    <span className="text-pink-400">{mStats?.focusMins}m</span>
                    <span>·</span>
                    <span className="text-emerald-500">{mStats?.tasks} tasks</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {monthSessions.map((session, si) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: si * 0.03 }}
                        className={`p-4 rounded-[2rem] border-2 shadow-sm flex justify-between items-center gap-3 transition-all hover:scale-[1.01] ${
                          session.type === 'task'
                            ? 'bg-emerald-50/60 border-emerald-200/60 dark:bg-emerald-900/15 dark:border-emerald-800/30'
                            : 'bg-white/70 border-pink-100/60 dark:bg-pink-900/15 dark:border-pink-800/30'
                        }`}
                        data-testid={`history-item-${session.id}`}
                      >
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                          session.type === 'task' ? 'bg-emerald-100' : 'bg-pink-100'
                        }`}>
                          {session.type === 'task' ? '✅' : '🌸'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm text-foreground line-clamp-1 leading-snug">
                            {session.purpose || "Focus Session"}
                          </h4>
                          <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                            {format(new Date(session.date), "MMM d, h:mm a")}
                          </p>
                        </div>
                        <div className={`flex flex-col items-end gap-0.5 px-3 py-2 rounded-2xl shrink-0 ${
                          session.type === 'task' ? 'bg-emerald-100' : 'bg-pink-100'
                        }`}>
                          <span className={`text-xs font-black ${session.type === 'task' ? 'text-emerald-600' : 'text-pink-500'}`}>
                            {session.type === 'task' ? '+5 XP' : `+${session.minutes} XP`}
                          </span>
                          {session.type !== 'task' && (
                            <div className="flex items-center gap-0.5 opacity-60">
                              <Clock size={9} />
                              <span className="text-[9px] font-bold">{session.minutes}m</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
