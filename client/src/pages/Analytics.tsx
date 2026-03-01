import { useMochi } from "@/hooks/use-mochi";
import { Link } from "wouter";
import { ChevronLeft, TrendingUp, BarChart2, Zap, Clock, Trophy, Calendar, Target, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { format, subDays, isSameDay, getHours } from "date-fns";

export default function Analytics() {
  const { sessions, streak, xp } = useMochi();

  // --- Data Processing for Data Science Insights ---
  
  // 1. Basic Stats
  const pomodoroSessions = sessions.filter(s => s.type === 'pomodoro');
  const totalFocusMinutes = pomodoroSessions.reduce((acc, s) => acc + s.minutes, 0);
  const avgSessionLength = pomodoroSessions.length > 0 
    ? Math.round(totalFocusMinutes / pomodoroSessions.length)
    : 0;

  // 2. Behavioral: Most Productive Hour
  const hourCounts = new Array(24).fill(0);
  sessions.forEach(s => {
    const hour = getHours(new Date(s.date));
    hourCounts[hour]++;
  });
  const busiestHour = hourCounts.indexOf(Math.max(...hourCounts));
  const busiestHourLabel = busiestHour >= 12 ? `${busiestHour === 12 ? 12 : busiestHour - 12} PM` : `${busiestHour === 0 ? 12 : busiestHour} AM`;

  // 3. Consistency Score (Calculated based on variance of focus time in last 7 days)
  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return sessions
      .filter(s => isSameDay(new Date(s.date), date))
      .reduce((acc, s) => acc + (s.type === 'pomodoro' ? s.minutes : 5), 0); // Normalized impact
  });
  const avg7DayFocus = last7DaysData.reduce((a, b) => a + b, 0) / 7;
  const variance = last7DaysData.reduce((a, b) => a + Math.pow(b - avg7DayFocus, 2), 0) / 7;
  const consistencyScore = Math.max(0, Math.min(100, Math.round(100 - (Math.sqrt(variance) / (avg7DayFocus || 1)) * 50)));

  // 4. Time Series: Last 30 Days Focus
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const daySessions = sessions.filter(s => 
      s.type === 'pomodoro' && isSameDay(new Date(s.date), date)
    );
    return {
      date: format(date, "MMM d"),
      minutes: daySessions.reduce((acc, s) => acc + s.minutes, 0),
      fullDate: date
    };
  }).reverse();

  // 5. Categorical: Task vs Focus Distribution
  const tasksDone = sessions.filter(s => s.type === 'task').length;
  const focusDone = pomodoroSessions.length;

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto font-display">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
            <ChevronLeft />
          </button>
        </Link>
        <div>
          <h2 className="text-3xl font-black text-foreground">Insights</h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Behavioral Analysis</p>
        </div>
      </div>

      {/* Primary Science Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card p-5 rounded-[2.5rem] border-2 border-primary/20 shadow-xl shadow-primary/5 flex flex-col items-center text-center"
        >
          <Activity className="text-primary mb-2" size={24} />
          <h3 className="text-3xl font-black text-primary">{consistencyScore}%</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Consistency</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-5 rounded-[2.5rem] border-2 border-secondary/30 shadow-xl shadow-secondary/5 flex flex-col items-center text-center"
        >
          <Clock className="text-secondary-foreground mb-2" size={24} />
          <h3 className="text-2xl font-black text-secondary-foreground">{busiestHourLabel}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Peak Hour</p>
        </motion.div>
      </div>

      {/* Focus Trend (Area Chart for 'Flow' visual) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-lg flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Focus Flow
          </h3>
          <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded-full text-muted-foreground uppercase">Last 30 Days</span>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last30Days}>
              <defs>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontFamily: 'Fredoka',
                  fontWeight: 'bold'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="minutes" 
                stroke="hsl(var(--primary))" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorMin)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Task Distribution */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary/5 p-6 rounded-[2.5rem] border-2 border-primary/10">
          <p className="text-4xl mb-2">🌸</p>
          <h4 className="text-2xl font-black text-primary">{focusDone}</h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Deep Focus</p>
        </div>
        <div className="bg-secondary/10 p-6 rounded-[2.5rem] border-2 border-secondary/20">
          <p className="text-4xl mb-2">✅</p>
          <h4 className="text-2xl font-black text-secondary-foreground">{tasksDone}</h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Micro Tasks</p>
        </div>
      </div>

      {/* Science Tidbit */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-accent/10 rounded-[2.5rem] border-2 border-dashed border-accent/30 text-center"
      >
        <Target className="mx-auto mb-2 text-accent-foreground" size={20} />
        <p className="text-xs font-medium text-accent-foreground leading-relaxed">
          Your current <span className="font-black">Focus Intensity</span> is optimized when you work around {busiestHourLabel}. Keep your consistency above 80% to maximize Mochi XP!
        </p>
      </motion.div>
    </div>
  );
}
