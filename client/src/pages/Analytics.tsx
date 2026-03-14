import { useMochi } from "@/hooks/use-mochi";
import { Link } from "wouter";
import { ChevronLeft, TrendingUp, Clock, Download, Target, Activity, Sigma, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Cell
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

// ── Heatmap component (GitHub-style) ─────────────────────────────────────────
function FocusHeatmap({ sessions }: { sessions: ReturnType<typeof useMochi>['sessions'] }) {
  const weeks = 15;
  const today = new Date();
  const totalDays = weeks * 7;

  const dayMap: Record<string, number> = {};
  sessions.filter(s => s.type === 'pomodoro').forEach(s => {
    const key = format(new Date(s.date), 'yyyy-MM-dd');
    dayMap[key] = (dayMap[key] || 0) + s.minutes;
  });

  const maxMins = Math.max(...Object.values(dayMap), 1);
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const d  = subDays(today, totalDays - 1 - i);
    const key = format(d, 'yyyy-MM-dd');
    const mins = dayMap[key] || 0;
    return { date: d, key, mins, intensity: mins / maxMins };
  });

  function intensityColor(v: number) {
    if (v === 0)   return '#f9e8f0';
    if (v < 0.25)  return '#f9a8d4';
    if (v < 0.5)   return '#f472b6';
    if (v < 0.75)  return '#ec4899';
    return '#be185d';
  }

  const grid: typeof cells[] = [];
  for (let w = 0; w < weeks; w++) grid.push(cells.slice(w * 7, w * 7 + 7));

  return (
    <div className="overflow-x-auto no-scrollbar pb-1">
      <div className="flex gap-1 min-w-max">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.key}
                title={`${format(cell.date, 'MMM d')}: ${cell.mins}m`}
                className="w-4 h-4 rounded-sm transition-all hover:scale-125"
                style={{ background: intensityColor(cell.intensity) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[10px] font-black text-muted-foreground">
        <span>less</span>
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <div key={v} className="w-3.5 h-3.5 rounded-sm" style={{ background: intensityColor(v) }} />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Analytics() {
  const { sessions, streak, xp, habits, exportCSV, exportJSON } = useMochi();

  const pomodoros   = sessions.filter(s => s.type === 'pomodoro');
  const totalMins   = pomodoros.reduce((a, s) => a + s.minutes, 0);
  const avgSession  = pomodoros.length ? Math.round(totalMins / pomodoros.length) : 0;
  const totalHours  = (totalMins / 60).toFixed(1);

  // Peak hour
  const hourBuckets = new Array(24).fill(0);
  pomodoros.forEach(s => hourBuckets[getHours(new Date(s.date))]++);
  const peakHour    = hourBuckets.indexOf(Math.max(...hourBuckets));
  const peakLabel   = peakHour >= 12 ? `${peakHour === 12 ? 12 : peakHour - 12} PM` : `${peakHour === 0 ? 12 : peakHour} AM`;

  // Last 30 days series
  const focusByDay = Array.from({ length: 30 }, (_, i) => {
    const d    = subDays(new Date(), 29 - i);
    const mins = pomodoros.filter(s => isSameDay(new Date(s.date), d)).reduce((a, s) => a + s.minutes, 0);
    return { date: format(d, 'MMM d'), dateObj: d, minutes: mins };
  });

  const minsArr = focusByDay.map(d => d.minutes);
  const avgArr  = movingAvg(minsArr, 7);
  const chartData = focusByDay.map((d, i) => ({ ...d, movingAvg: avgArr[i] }));

  // Standard deviation
  const focusSD = Math.round(stdDev(minsArr));

  // Consistency score (coefficient of variation)
  const focusMean = mean(minsArr);
  const cv = focusMean > 0 ? stdDev(minsArr) / focusMean : 1;
  const consistencyScore = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));

  // Subject breakdown
  const subjectMap: Record<string, number> = {};
  pomodoros.forEach(s => {
    const sub = s.subject || 'Other';
    subjectMap[sub] = (subjectMap[sub] || 0) + s.minutes;
  });
  const subjectData = Object.entries(subjectMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, minutes]) => ({ name, minutes, pct: Math.round((minutes / totalMins) * 100) }));

  // Pearson correlation: habits done/day vs focus mins/day
  const habitArr = Array.from({ length: 30 }, (_, i) => {
    const d   = subDays(new Date(), 29 - i);
    const key = format(d, 'yyyy-MM-dd');
    return habits.reduce((a, h) => a + (h.completions.includes(key) ? 1 : 0), 0);
  });
  const r = pearson(habitArr, minsArr);
  const rLabel = r > 0.5 ? 'Strong positive' : r > 0.2 ? 'Moderate positive' : r < -0.3 ? 'Negative' : 'Weak / none';
  const rColor = r > 0.3 ? 'text-emerald-500' : r < -0.2 ? 'text-rose-500' : 'text-amber-500';

  // Last 7 days bar chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      day: format(d, 'EEE'),
      minutes: pomodoros.filter(s => isSameDay(new Date(s.date), d)).reduce((a, s) => a + s.minutes, 0),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-pink-100 dark:border-white/10 text-xs font-bold">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.name.includes('Avg') ? 'm' : 'm'}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-36 px-4 pt-8 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-200/50 shadow-sm backdrop-blur-sm btn-bounce">
            <ChevronLeft size={20} />
          </button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: 'Fredoka' }}>
            Data Insights 📊
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Behavioral Analysis</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            title="Export CSV"
            className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200/50 btn-bounce shadow-sm">
            <Download size={16} />
          </button>
          <button onClick={exportJSON}
            title="Export JSON"
            className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 border border-purple-200/50 btn-bounce shadow-sm">
            <FlaskConical size={16} />
          </button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { icon: <Activity size={18} />, value: `${consistencyScore}%`, label: 'Consistency', bg: 'from-pink-400/80 to-rose-400', shadow: 'shadow-rose-200' },
          { icon: <Clock size={18} />,    value: `${totalHours}h`,        label: 'Total Focus',  bg: 'from-violet-400/80 to-purple-400', shadow: 'shadow-purple-200' },
          { icon: <Target size={18} />,   value: peakLabel,               label: 'Peak Hour',    bg: 'from-amber-400/80 to-orange-400', shadow: 'shadow-amber-200' },
          { icon: <Sigma size={18} />,    value: `±${focusSD}m`,          label: 'Std Dev / Day', bg: 'from-cyan-400/80 to-blue-400',  shadow: 'shadow-blue-200' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-[2.5rem] text-white flex flex-col gap-1 shadow-xl ${m.shadow} dark:shadow-none`}
            style={{ background: `linear-gradient(135deg, ${m.bg.replace('from-', '').replace(' to-', ', ')})` }}
          >
            <div className="opacity-80">{m.icon}</div>
            <h3 className="text-2xl font-black leading-none" style={{ fontFamily: 'Fredoka' }}>{m.value}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Focus Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-white/5 border-2 border-pink-100/60 dark:border-white/10 rounded-[2.5rem] p-6 mb-5 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🗓️</span>
          <h3 className="font-black text-base text-foreground" style={{ fontFamily: 'Fredoka' }}>Focus Heatmap</h3>
          <span className="text-[10px] font-black uppercase tracking-widest bg-pink-50 dark:bg-pink-900/20 text-pink-400 px-2 py-0.5 rounded-full ml-auto">15 weeks</span>
        </div>
        <FocusHeatmap sessions={sessions} />
      </motion.div>

      {/* 30-Day Trend + 7-day moving average */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/60 dark:bg-white/5 border-2 border-pink-100/60 dark:border-white/10 rounded-[2.5rem] p-6 mb-5 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="font-black text-base text-foreground" style={{ fontFamily: 'Fredoka' }}>Focus Flow</h3>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1"><div className="w-3 h-1 rounded-full bg-pink-400" />Daily</div>
            <div className="flex items-center gap-1"><div className="w-3 h-1 rounded-full border-2 border-dashed border-purple-400" />7d Avg</div>
          </div>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f472b6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="minutes" name="Focus" stroke="#f472b6" strokeWidth={3} fill="url(#focusGrad)" dot={false} />
              <Line type="monotone" dataKey="movingAvg" name="7d Avg" stroke="#c084fc" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Mean/day',    value: `${Math.round(focusMean)}m` },
            { label: 'Std Dev',    value: `${focusSD}m` },
            { label: 'Sessions',   value: pomodoros.length },
          ].map(s => (
            <div key={s.label} className="bg-pink-50/60 dark:bg-pink-900/10 rounded-2xl p-2">
              <p className="font-black text-primary text-base">{s.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Last 7 days bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/60 dark:bg-white/5 border-2 border-pink-100/60 dark:border-white/10 rounded-[2.5rem] p-6 mb-5 shadow-sm backdrop-blur-sm"
      >
        <h3 className="font-black text-base text-foreground mb-4" style={{ fontFamily: 'Fredoka' }}>⚡ This Week</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barCategoryGap="30%">
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="minutes" name="Focus" radius={[12, 12, 4, 4]}>
                {last7.map((_, i) => (
                  <Cell key={i} fill={i === 6 ? '#f472b6' : '#f9a8d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Subject Breakdown */}
      {subjectData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-white/5 border-2 border-pink-100/60 dark:border-white/10 rounded-[2.5rem] p-6 mb-5 shadow-sm backdrop-blur-sm"
        >
          <h3 className="font-black text-base text-foreground mb-4" style={{ fontFamily: 'Fredoka' }}>📚 Study by Subject</h3>
          <div className="space-y-3">
            {subjectData.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-xs font-black mb-1">
                  <span className="text-foreground">{s.name}</span>
                  <span className="text-muted-foreground">{s.minutes}m · {s.pct}%</span>
                </div>
                <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    style={{ background: SUBJECT_COLORS[s.name] || '#c084fc' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pearson Correlation Insight */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/60 dark:bg-white/5 border-2 border-purple-100/60 dark:border-purple-900/20 rounded-[2.5rem] p-6 mb-5 shadow-sm backdrop-blur-sm"
        >
          <h3 className="font-black text-base text-foreground mb-3" style={{ fontFamily: 'Fredoka' }}>
            🔬 Habit × Focus Correlation
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 text-center">
              <p className={`text-4xl font-black ${rColor}`} style={{ fontFamily: 'Fredoka' }}>r = {r}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Pearson r</p>
            </div>
            <div className="text-sm font-semibold text-muted-foreground leading-snug">
              <span className={`font-black ${rColor}`}>{rLabel} correlation</span> between your habit completion and daily focus minutes over 30 days.
              {r > 0.3 && ' Habits are boosting your focus time!'}
              {r < -0.2 && ' Your focus seems to be inversely linked to habits — investigate further!'}
            </div>
          </div>

          {/* Mini correlation scatter (simplified) */}
          <div className="mt-4 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.from({ length: 30 }, (_, i) => ({ day: i, habits: habitArr[i], focus: minsArr[i] }))}>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="habits" name="Habits" stroke="#c084fc" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="focus"  name="Focus(m)" stroke="#f472b6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1"><div className="w-3 h-1 rounded-full bg-purple-400" /> Habits/day</div>
            <div className="flex items-center gap-1"><div className="w-3 h-1 rounded-full bg-pink-400" /> Focus min/day</div>
          </div>
        </motion.div>
      )}

      {/* Quick insight card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-[2.5rem] p-6 mb-5 border-2 border-dashed border-primary/20 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(249,168,212,0.15), rgba(192,132,252,0.1))' }}
      >
        <p className="text-sm font-semibold text-foreground leading-relaxed">
          You've clocked <span className="font-black text-primary">{totalHours} hours</span> of deep work.
          Your consistency score of <span className="font-black text-primary">{consistencyScore}%</span>{' '}
          is measured by how evenly spread your focus sessions are (low coefficient of variation = high consistency).
          {consistencyScore >= 70 ? ' Keep it up! 🌸' : ' Try to study a little every day for a better score!'}
        </p>
      </motion.div>

      {/* Export Row */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={exportCSV}
          className="py-4 rounded-[2rem] font-black text-white text-sm flex items-center justify-center gap-2 btn-bounce"
          style={{ background: 'linear-gradient(135deg, #34d399, #059669)', boxShadow: '0 4px 0 0 #065f46' }}>
          <Download size={16} /> Export CSV
        </button>
        <button onClick={exportJSON}
          className="py-4 rounded-[2rem] font-black text-white text-sm flex items-center justify-center gap-2 btn-bounce"
          style={{ background: 'linear-gradient(135deg, #c084fc, #7c3aed)', boxShadow: '0 4px 0 0 #4c1d95' }}>
          <FlaskConical size={16} /> Export JSON
        </button>
      </div>
    </div>
  );
}
