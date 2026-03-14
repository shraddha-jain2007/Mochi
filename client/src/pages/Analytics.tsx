import { useState, type ReactNode } from "react";
import { useMochi } from "@/hooks/use-mochi";
import { Link } from "wouter";
import {
  ChevronLeft, TrendingUp, Clock, Download, Target, Activity,
  Sigma, FlaskConical, Info, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LineChart, Line, Cell
} from 'recharts';
import { format, subDays, isSameDay, getHours } from "date-fns";

// ── Math helpers ──────────────────────────────────────────────────────────────
function mean(arr: number[]) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function stdDev(arr: number[]) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length || 1));
}
function pearson(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  const mx = mean(x), my = mean(y);
  const num = x.slice(0, n).reduce((a, xi, i) => a + (xi - mx) * (y[i] - my), 0);
  const den = Math.sqrt(
    x.slice(0, n).reduce((a, xi) => a + (xi - mx) ** 2, 0) *
    y.slice(0, n).reduce((a, yi) => a + (yi - my) ** 2, 0)
  );
  return den === 0 ? 0 : Math.round((num / den) * 100) / 100;
}
function movingAvg(data: number[], window: number) {
  return data.map((_, i) => {
    if (i < window - 1) return null;
    return Math.round(mean(data.slice(i - window + 1, i + 1)));
  });
}

const SUBJECT_COLORS: Record<string, string> = {
  'Machine Learning': '#c084fc',
  'Statistics':       '#60a5fa',
  'Python':           '#34d399',
  'Data Analysis':    '#fbbf24',
  'Mathematics':      '#fb7185',
  'Deep Learning':    '#e879f9',
  'SQL / Databases':  '#22d3ee',
  'Research':         '#fb923c',
  'Reading':          '#f472b6',
  'Other':            '#94a3b8',
};

// ── InfoBox — expandable explanation ─────────────────────────────────────────
function InfoBox({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 mb-1">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-[11px] font-black text-pink-400 hover:text-pink-600 transition-colors"
      >
        <Info size={12} />
        <span>What does this mean?</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/40 rounded-2xl text-xs font-semibold text-pink-900 dark:text-pink-200 leading-relaxed">
              {text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-white dark:bg-zinc-900 border-2 border-pink-100 dark:border-zinc-800 rounded-[2rem] p-5 mb-4 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
      {children}
    </h3>
  );
}

// ── Heatmap ───────────────────────────────────────────────────────────────────
function FocusHeatmap({ sessions }: { sessions: ReturnType<typeof useMochi>['sessions'] }) {
  const weeks = 14;
  const today = new Date();
  const totalDays = weeks * 7;

  const dayMap: Record<string, number> = {};
  sessions.filter(s => s.type === 'pomodoro').forEach(s => {
    const key = format(new Date(s.date), 'yyyy-MM-dd');
    dayMap[key] = (dayMap[key] || 0) + s.minutes;
  });

  const maxMins = Math.max(...Object.values(dayMap), 1);
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const d   = subDays(today, totalDays - 1 - i);
    const key = format(d, 'yyyy-MM-dd');
    const mins = dayMap[key] || 0;
    return { date: d, key, mins, intensity: mins / maxMins };
  });

  function intensityColor(v: number) {
    if (v === 0)  return '#fce7f3';
    if (v < 0.25) return '#fbcfe8';
    if (v < 0.5)  return '#f472b6';
    if (v < 0.75) return '#ec4899';
    return '#be185d';
  }

  const grid: typeof cells[] = [];
  for (let w = 0; w < weeks; w++) grid.push(cells.slice(w * 7, w * 7 + 7));

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-[3px] min-w-max">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell) => (
              <div
                key={cell.key}
                title={`${format(cell.date, 'MMM d')}: ${cell.mins}m`}
                className="w-[15px] h-[15px] rounded-[3px] cursor-pointer transition-transform hover:scale-125"
                style={{ background: intensityColor(cell.intensity) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px] font-bold text-zinc-500">Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <div key={v} className="w-3 h-3 rounded-[3px]" style={{ background: intensityColor(v) }} />
        ))}
        <span className="text-[10px] font-bold text-zinc-500">More</span>
      </div>
    </div>
  );
}

// ── Custom chart tooltip ──────────────────────────────────────────────────────
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-2.5 shadow-xl border border-pink-100 dark:border-zinc-700 text-xs font-bold">
      {label && <p className="text-zinc-400 mb-1 text-[10px] uppercase tracking-widest">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || p.stroke || '#f472b6' }}>
          {p.name}: <strong>{p.value}m</strong>
        </p>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Analytics() {
  const { sessions, xp, habits, exportCSV, exportJSON } = useMochi();

  const pomodoros  = sessions.filter(s => s.type === 'pomodoro');
  const totalMins  = pomodoros.reduce((a, s) => a + s.minutes, 0);
  const totalHours = (totalMins / 60).toFixed(1);

  // Peak hour
  const hourBuckets = new Array(24).fill(0);
  pomodoros.forEach(s => hourBuckets[getHours(new Date(s.date))]++);
  const peakHour  = hourBuckets.indexOf(Math.max(...hourBuckets));
  const peakLabel = pomodoros.length
    ? (peakHour >= 12 ? `${peakHour === 12 ? 12 : peakHour - 12} PM` : `${peakHour === 0 ? 12 : peakHour} AM`)
    : '—';

  // 30-day series
  const focusByDay = Array.from({ length: 30 }, (_, i) => {
    const d    = subDays(new Date(), 29 - i);
    const mins = pomodoros.filter(s => isSameDay(new Date(s.date), d)).reduce((a, s) => a + s.minutes, 0);
    return { date: format(d, 'MMM d'), minutes: mins };
  });
  const minsArr  = focusByDay.map(d => d.minutes);
  const avgArr   = movingAvg(minsArr, 7);
  const chartData = focusByDay.map((d, i) => ({ ...d, movingAvg: avgArr[i] }));

  const focusMean = mean(minsArr);
  const focusSD   = Math.round(stdDev(minsArr));
  const cv        = focusMean > 0 ? stdDev(minsArr) / focusMean : 1;
  const consistencyScore = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));

  // Subject breakdown
  const subjectMap: Record<string, number> = {};
  pomodoros.forEach(s => {
    const sub = s.subject || 'Other';
    subjectMap[sub] = (subjectMap[sub] || 0) + s.minutes;
  });
  const subjectData = Object.entries(subjectMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, minutes]) => ({ name, minutes, pct: totalMins > 0 ? Math.round((minutes / totalMins) * 100) : 0 }));

  // Pearson: habits/day vs focus/day
  const habitArr = Array.from({ length: 30 }, (_, i) => {
    const d   = subDays(new Date(), 29 - i);
    const key = format(d, 'yyyy-MM-dd');
    return habits.reduce((a, h) => a + (h.completions.includes(key) ? 1 : 0), 0);
  });
  const r      = pearson(habitArr, minsArr);
  const rLabel = r > 0.5 ? 'Strong positive ↑' : r > 0.2 ? 'Moderate positive' : r < -0.3 ? 'Negative ↓' : 'Weak / no correlation';
  const rColor = r > 0.3 ? '#10b981' : r < -0.2 ? '#f43f5e' : '#f59e0b';

  // Last 7 days bar chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      day: format(d, 'EEE'),
      minutes: pomodoros.filter(s => isSameDay(new Date(s.date), d)).reduce((a, s) => a + s.minutes, 0),
    };
  });

  // Metric cards
  const metrics = [
    { emoji: '🎯', value: `${consistencyScore}%`, label: 'Consistency',    color: 'text-pink-500',   bg: 'bg-pink-50 dark:bg-pink-950/40',   border: 'border-pink-200 dark:border-pink-800/40' },
    { emoji: '⏰', value: `${totalHours}h`,        label: 'Total Focus',   color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800/40' },
    { emoji: '⚡', value: peakLabel,               label: 'Peak Hour',     color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950/40',   border: 'border-amber-200 dark:border-amber-800/40' },
    { emoji: '📐', value: `±${focusSD}m`,           label: 'Std Dev / Day', color: 'text-cyan-500',   bg: 'bg-cyan-50 dark:bg-cyan-950/40',     border: 'border-cyan-200 dark:border-cyan-800/40' },
  ];

  return (
    <div
      className="min-h-screen pb-36 px-4 pt-8 max-w-md mx-auto"
      style={{ background: 'linear-gradient(160deg, #fff0f6 0%, #f5f0ff 50%, #f0f7ff 100%)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white border-2 border-pink-100 shadow-sm btn-bounce">
            <ChevronLeft size={20} className="text-zinc-600" />
          </button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-zinc-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Data Insights 📊
          </h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">your study analytics</p>
        </div>
        <button onClick={exportCSV} title="Export CSV"
          className="p-3 rounded-2xl bg-emerald-500 text-white shadow-md btn-bounce">
          <Download size={16} />
        </button>
        <button onClick={exportJSON} title="Export JSON"
          className="p-3 rounded-2xl bg-purple-500 text-white shadow-md btn-bounce">
          <FlaskConical size={16} />
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className={`${m.bg} border-2 ${m.border} rounded-[2rem] p-4 flex items-center gap-3 shadow-sm`}
          >
            <span className="text-3xl">{m.emoji}</span>
            <div>
              <p className={`text-2xl font-black leading-none ${m.color}`} style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {m.value}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-0.5">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metric info */}
      <div className="mb-4 px-1">
        <InfoBox text="Consistency %: measures how evenly you study each day using the Coefficient of Variation (CV = σ/μ). A score near 100% means you study the same amount daily — no cramming! | Total Focus: sum of all your Pomodoro minutes. | Peak Hour: the clock hour when you start the most sessions. | Std Dev ±: standard deviation of your daily focus minutes — lower = more consistent." />
      </div>

      {/* ── Focus Heatmap ── */}
      <Card delay={0.1}>
        <SectionLabel>🗓️ Focus Heatmap</SectionLabel>
        <p className="text-xs text-zinc-500 font-semibold mb-3">
          Each square = one day · darker = more focus time · last 14 weeks
        </p>
        <FocusHeatmap sessions={sessions} />
        <InfoBox text="Inspired by GitHub's contribution graph, this heatmap shows your focus activity over the past 14 weeks. Each column is a week (Mon–Sun). Darker pink = more minutes focused that day. Hover any square to see the exact date and minutes. Gaps (pale squares) show days you didn't study — aim to fill those in!" />
      </Card>

      {/* ── Focus Flow (30-day area + 7d MA) ── */}
      <Card delay={0.15}>
        <SectionLabel>📈 Focus Flow — 30 Days</SectionLabel>
        <p className="text-xs text-zinc-500 font-semibold mb-4">Daily focus minutes with 7-day moving average</p>

        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2 rounded-full bg-pink-400" />
            <span>Daily mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0 border-t-2 border-dashed border-purple-500" />
            <span>7-day avg</span>
          </div>
        </div>

        <div className="h-44 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 4, right: 4 }}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#f472b6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3e8ff" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }} interval={6} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="minutes" name="Daily" stroke="#f472b6" strokeWidth={2.5} fill="url(#grad1)" dot={false} />
              <Line type="monotone" dataKey="movingAvg" name="7d Avg" stroke="#a855f7" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Mean / day', value: `${Math.round(focusMean)}m`, color: 'text-pink-500' },
            { label: 'Std Dev',    value: `${focusSD}m`,              color: 'text-purple-500' },
            { label: 'Sessions',   value: `${pomodoros.length}`,      color: 'text-zinc-700 dark:text-zinc-300' },
          ].map(s => (
            <div key={s.label} className="bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 rounded-2xl p-3 text-center">
              <p className={`text-xl font-black ${s.color}`} style={{ fontFamily: 'Fredoka, sans-serif' }}>{s.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <InfoBox text="Focus Flow shows how many minutes you studied each day for the past 30 days. The pink area = raw daily minutes. The dashed purple line = 7-day moving average (MA), which smooths out the noise so you can see your true trend. If the MA line is rising, your study habit is improving! Standard deviation tells you how much your daily focus varies — lower is better." />
      </Card>

      {/* ── This Week Bar Chart ── */}
      <Card delay={0.2}>
        <SectionLabel>⚡ This Week</SectionLabel>
        <p className="text-xs text-zinc-500 font-semibold mb-4">Focus minutes per day (last 7 days)</p>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barCategoryGap="30%" margin={{ left: 0, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fce7f3" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 800 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="minutes" name="Focus" radius={[10, 10, 3, 3]}>
                {last7.map((_, i) => (
                  <Cell key={i} fill={i === 6 ? '#f472b6' : '#fbcfe8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <InfoBox text="A simple bar chart showing your focus minutes for each day this week. Today's bar is highlighted in deep pink. Use this to spot which days of the week you tend to be most productive — useful for planning when to schedule hard study sessions!" />
      </Card>

      {/* ── Subject Breakdown ── */}
      {subjectData.length > 0 && (
        <Card delay={0.25}>
          <SectionLabel>📚 Study by Subject</SectionLabel>
          <p className="text-xs text-zinc-500 font-semibold mb-4">Total minutes per topic (from tagged sessions)</p>
          <div className="space-y-3">
            {subjectData.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-xs font-black mb-1.5">
                  <span className="text-zinc-700 dark:text-zinc-200">{s.name}</span>
                  <span className="text-zinc-400">{s.minutes}m · {s.pct}%</span>
                </div>
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ background: SUBJECT_COLORS[s.name] || '#c084fc' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <InfoBox text="This breakdown shows how your focus time is distributed across different study topics. Each bar represents what percentage of your total study time went to that subject. Tag your Pomodoro sessions with a subject (like Python, ML, Statistics) to populate this chart — and find out if you're under-studying certain topics!" />
        </Card>
      )}

      {/* ── Pearson Correlation ── */}
      {habits.length > 0 && (
        <Card delay={0.3} className="border-purple-100 dark:border-purple-900/40">
          <SectionLabel>🔬 Habit × Focus Correlation</SectionLabel>
          <p className="text-xs text-zinc-500 font-semibold mb-4">Pearson r over last 30 days</p>

          {/* r value badge */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="flex-shrink-0 w-20 h-20 rounded-[1.5rem] flex flex-col items-center justify-center shadow-lg"
              style={{ background: `${rColor}22`, border: `2px solid ${rColor}44` }}
            >
              <span className="text-2xl font-black" style={{ color: rColor, fontFamily: 'Fredoka, sans-serif' }}>
                {r}
              </span>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">r value</span>
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: rColor }}>{rLabel}</p>
              <p className="text-xs font-semibold text-zinc-500 mt-1 leading-snug">
                between habits completed/day and focus minutes/day.
                {r > 0.3 && ' ✨ Habits appear to boost your study time!'}
                {r < -0.2 && ' 🤔 Something might be off — investigate!'}
                {Math.abs(r) <= 0.2 && ' No strong link detected yet — need more data.'}
              </p>
            </div>
          </div>

          {/* Dual-line chart */}
          <div className="h-32 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.from({ length: 30 }, (_, i) => ({ day: i + 1, habits: habitArr[i], focus: minsArr[i] }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3e8ff" />
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="habits" name="Habits" stroke="#a855f7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="focus"  name="Focus(m)" stroke="#f472b6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <div className="flex items-center gap-1.5"><div className="w-4 h-1.5 rounded-full bg-purple-400" /> Habits/day</div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-1.5 rounded-full bg-pink-400" /> Focus min/day</div>
          </div>

          <InfoBox text="Pearson r measures the linear correlation between two variables on a scale of –1 to +1. Here: r = correlation between how many habits you completed vs how many minutes you focused, computed daily over 30 days. r > 0.5 = strong positive (habits predict more focus). r ≈ 0 = no relationship. r < –0.3 = negative (habits compete with focus time). This is actual statistical analysis — just like in a data science notebook!" />
        </Card>
      )}

      {/* ── Insight Summary ── */}
      <Card delay={0.35} className="border-dashed">
        <div className="flex gap-3 items-start">
          <span className="text-3xl">💡</span>
          <div>
            <p className="font-black text-zinc-700 dark:text-zinc-200 text-sm mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>Your Study Summary</p>
            <p className="text-xs font-semibold text-zinc-500 leading-relaxed">
              You've accumulated <span className="font-black text-pink-500">{totalHours}h</span> of deep focus.
              Consistency score: <span className="font-black text-purple-500">{consistencyScore}%</span>
              {' '}(based on coefficient of variation — lower daily variance = higher score).
              {consistencyScore >= 70
                ? ' You\'re studying very regularly! 🌸'
                : ' Try to study a little each day to improve your consistency score!'}
            </p>
          </div>
        </div>
      </Card>

      {/* ── Export ── */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <button onClick={exportCSV}
          className="py-4 rounded-[1.75rem] font-black text-white text-sm flex items-center justify-center gap-2 btn-bounce shadow-lg"
          style={{ background: 'linear-gradient(135deg, #34d399, #059669)', boxShadow: '0 5px 0 0 #065f46' }}>
          <Download size={16} /> Export CSV
        </button>
        <button onClick={exportJSON}
          className="py-4 rounded-[1.75rem] font-black text-white text-sm flex items-center justify-center gap-2 btn-bounce shadow-lg"
          style={{ background: 'linear-gradient(135deg, #c084fc, #7c3aed)', boxShadow: '0 5px 0 0 #4c1d95' }}>
          <FlaskConical size={16} /> Export JSON
        </button>
      </div>
    </div>
  );
}
