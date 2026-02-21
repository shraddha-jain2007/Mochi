import { useMochi } from "@/hooks/use-mochi";
import { Link } from "wouter";
import { ChevronLeft, Trash2, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const { sessions, clearHistory } = useMochi();

  // Group by month
  const groupedSessions = sessions.reduce((acc, session) => {
    const month = format(new Date(session.date), "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <ChevronLeft />
            </button>
          </Link>
          <h2 className="text-2xl font-bold">History</h2>
        </div>
        
        {sessions.length > 0 && (
          <button 
            onClick={() => {
              if(confirm("Are you sure you want to clear all history?")) clearHistory();
            }}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center opacity-50">
          <Calendar size={64} className="mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">No sessions yet</p>
          <p className="text-sm text-muted-foreground">Start a focus session to see it here!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSessions).map(([month, monthSessions]) => (
            <div key={month} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                {month}
              </h3>
              <div className="space-y-3">
                {monthSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="bg-card p-4 rounded-2xl border border-border shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-foreground">{session.purpose || "Focus Session"}</h4>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.date), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                      <Clock size={14} className="text-primary" />
                      <span className="text-sm font-bold text-primary">{session.minutes}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
