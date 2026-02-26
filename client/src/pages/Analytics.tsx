import { useMochi } from "@/hooks/use-mochi";
import { Link } from "wouter";
import { ChevronLeft, TrendingUp, BarChart2, Zap, Clock, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { format, subDays, isSameDay, startOfDay } from "date-fns";

export default function Analytics() {
  const { sessions, streak, xp } = useMochi();

  // Calculate Stats
  const totalFocusMinutes = sessions
    .filter(s => s.type === 'pomodoro')
    .reduce((acc, s) => acc + s.minutes, 0);
  
  const avgSessionLength = sessions.length > 0 
    ? Math.round(totalFocusMinutes / sessions.filter(s => s.type === 'pomodoro').length || 0)
    : 0;

  // Process data for Line Chart (Last 30 days)
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

  // Process data for Bar Chart (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const daySessions = sessions.filter(s => isSameDay(new Date(s.date), date));
    return {
      name: format(date, "EEE"),
      count: daySessions.length,
      fullDate: date
    };
  }).reverse();

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto font-display">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
            <ChevronLeft />
          </button>
        </Link>
        <h2 className="text-3xl font-black text-foreground">Analytics</h2>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 p-5 rounded-[2rem] border-2 border-primary/20"
        >
          <Clock className="text-primary mb-2" size={20} />
          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Total Focus</p>
          <h3 className="text-2xl font-black text-primary">{totalFocusMinutes}m</h3>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary/20 p-5 rounded-[2rem] border-2 border-secondary/30"
        >
          <Zap className="text-secondary-foreground mb-2" size={20} />
          <p className="text-[10px] font-black uppercase tracking-widest text-secondary-foreground/60">Avg Session</p>
          <h3 className="text-2xl font-black text-secondary-foreground">{avgSessionLength}m</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent/20 p-5 rounded-[2rem] border-2 border-accent/30"
        >
          <TrendingUp className="text-accent-foreground mb-2" size={20} />
          <p className="text-[10px] font-black uppercase tracking-widest text-accent-foreground/60">Streak</p>
          <h3 className="text-2xl font-black text-accent-foreground">{streak}d</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-5 rounded-[2rem] border-2 border-border shadow-sm"
        >
          <Trophy className="text-orange-400 mb-2" size={20} />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total XP</p>
          <h3 className="text-2xl font-black text-foreground">{xp}</h3>
        </motion.div>
      </div>

      {/* Focus Minutes Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm mb-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BarChart2 size={18} className="text-primary" />
          </div>
          <h3 className="font-black text-lg">Focus Time (30d)</h3>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="date" 
                hide 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontFamily: 'Fredoka'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="minutes" 
                stroke="hsl(var(--primary))" 
                strokeWidth={4} 
                dot={false}
                activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Sessions Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm mb-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-secondary/20 rounded-xl">
            <Zap size={18} className="text-secondary-foreground" />
          </div>
          <h3 className="font-black text-lg">Sessions (7d)</h3>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '1rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontFamily: 'Fredoka'
                }}
              />
              <Bar dataKey="count" radius={[10, 10, 10, 10]}>
                {last7Days.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isSameDay(entry.fullDate, new Date()) ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
