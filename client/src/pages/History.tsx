import { useMochi } from "@/hooks/use-mochi";
import { Link } from "wouter";
import { ChevronLeft, Trash2, Calendar, Clock, Star, Target } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function History() {
  const { sessions, clearHistory, xp } = useMochi();

  // Group by month
  const groupedSessions = sessions.reduce((acc, session) => {
    const month = format(new Date(session.date), "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto font-display">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-3 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors btn-bounce">
              <ChevronLeft />
            </button>
          </Link>
          <h2 className="text-3xl font-black">Memory Book</h2>
        </div>
        
        {sessions.length > 0 && (
          <button 
            onClick={() => {
              if(confirm("Wipe all memories? Mochi will be sad...")) clearHistory();
            }}
            className="p-3 text-destructive hover:bg-destructive/10 rounded-2xl transition-colors btn-bounce"
          >
            <Trash2 size={22} />
          </button>
        )}
      </div>

      {/* Monthly Milestones Overview */}
      <div className="bg-primary/5 rounded-[2.5rem] p-6 mb-8 border-2 border-primary/10">
        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
          <Target size={20} className="text-primary" /> Your Milestones
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-3xl shadow-sm border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Focused</p>
            <p className="text-2xl font-black text-primary">{sessions.reduce((acc, s) => acc + (s.type === 'pomodoro' ? s.minutes : 0), 0)}m</p>
          </div>
          <div className="bg-card p-4 rounded-3xl shadow-sm border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Tasks Done</p>
            <p className="text-2xl font-black text-secondary-foreground">{sessions.filter(s => s.type === 'task').length}</p>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center opacity-40">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6">
            <Calendar size={64} className="text-muted-foreground" />
          </div>
          <p className="text-xl font-black">Blank pages...</p>
          <p className="font-medium">Complete tasks or sessions to fill your book!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedSessions).map(([month, monthSessions], idx) => (
            <motion.div 
              key={month} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-black text-foreground bg-accent/20 px-4 py-1 rounded-full">
                  {month}
                </h3>
                <div className="h-[2px] flex-1 bg-muted rounded-full" />
              </div>
              
              <div className="space-y-4">
                {monthSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`p-5 rounded-[2rem] border-2 shadow-sm flex justify-between items-center transition-all hover:scale-[1.02] ${
                      session.type === 'task' 
                        ? 'bg-secondary/10 border-secondary/20' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        session.type === 'task' ? 'bg-secondary/20' : 'bg-primary/10'
                      }`}>
                        {session.type === 'task' ? '✅' : '🌸'}
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-foreground line-clamp-1">{session.purpose || "Focus Session"}</h4>
                        <p className="text-xs font-bold text-muted-foreground">
                          {format(new Date(session.date), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex flex-col items-end gap-1 px-4 py-2 rounded-2xl ${
                      session.type === 'task' ? 'bg-secondary/20' : 'bg-primary/10'
                    }`}>
                      <span className={`text-sm font-black ${
                        session.type === 'task' ? 'text-secondary-foreground' : 'text-primary'
                      }`}>
                        {session.type === 'task' ? '+5 XP' : `${session.minutes} XP`}
                      </span>
                      {session.type !== 'task' && (
                        <div className="flex items-center gap-1 opacity-60">
                          <Clock size={10} />
                          <span className="text-[10px] font-bold">{session.minutes}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
