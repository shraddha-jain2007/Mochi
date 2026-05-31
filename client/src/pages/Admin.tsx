import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Users, Activity, Calendar, Lock, RefreshCw } from "lucide-react";

interface AdminStats {
  totalUnique: number;
  totalVisits: number;
  todayUnique: number;
  recentVisitors: {
    id: number;
    visitorId: string;
    firstSeen: string;
    lastSeen: string;
    visitCount: number;
  }[];
}

const ADMIN_KEY = "mochi-admin-secret"; // change to match your ADMIN_KEY env var

export default function Admin() {
  const [key, setKey]       = useState("");
  const [stats, setStats]   = useState<AdminStats | null>(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStats = async (k = key) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/admin/stats?key=${encodeURIComponent(k)}`);
      const data = await res.json();
      if (!res.ok) { setError("Wrong key or server error."); setStats(null); }
      else setStats(data);
    } catch {
      setError("Could not reach server.");
    }
    setLoading(false);
  };

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="min-h-screen px-5 py-10 max-w-md mx-auto"
      style={{ background: "linear-gradient(160deg, #fff0f6, #f5f0ff, #f0f7ff)" }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-pink-100">
          <Eye size={22} className="text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-800" style={{ fontFamily: "Fredoka" }}>
            Mochi Admin
          </h1>
          <p className="text-xs font-bold text-zinc-400">Usage analytics — visible only to you</p>
        </div>
      </div>

      {/* Key input */}
      {!stats && (
        <div className="bg-white rounded-[2.5rem] border-2 border-pink-100 shadow-lg p-6 mb-6">
          <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
            <Lock size={12} /> Admin Key
          </label>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchStats()}
            placeholder="Enter your admin key..."
            className="w-full text-base font-semibold bg-transparent border-b-2 border-pink-200 focus:border-pink-400 outline-none py-2 placeholder:text-zinc-300 text-zinc-800 mb-4"
          />
          {error && <p className="text-xs font-bold text-red-400 mb-3">{error}</p>}
          <button
            onClick={() => fetchStats()}
            disabled={loading || !key.trim()}
            className="w-full py-3 rounded-2xl text-white font-black btn-bounce disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)" }}
          >
            {loading ? "Checking..." : "View Stats →"}
          </button>
        </div>
      )}

      {/* Stats */}
      <AnimatePresence>
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Key metric cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users,    value: stats.totalUnique, label: "Total Users",   color: "text-pink-500",   bg: "bg-pink-50",   border: "border-pink-100" },
                { icon: Activity, value: stats.totalVisits, label: "Total Visits",  color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100" },
                { icon: Calendar, value: stats.todayUnique, label: "Active Today",  color: "text-emerald-500",bg: "bg-emerald-50",border: "border-emerald-100" },
              ].map(({ icon: Icon, value, label, color, bg, border }) => (
                <div key={label} className={`${bg} border-2 ${border} rounded-[1.5rem] p-4 text-center`}>
                  <Icon size={16} className={`${color} mx-auto mb-1`} />
                  <p className={`text-2xl font-black ${color}`} style={{ fontFamily: "Fredoka" }}>{value}</p>
                  <p className="text-[10px] font-bold text-zinc-400 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent visitors */}
            <div className="bg-white rounded-[2.5rem] border-2 border-pink-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-zinc-700">Recent Visitors</h3>
                <button
                  onClick={() => fetchStats()}
                  className="p-2 rounded-xl bg-pink-50 text-pink-400 hover:bg-pink-100 transition-colors btn-bounce"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="space-y-2">
                {stats.recentVisitors.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-200 to-violet-200 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-zinc-600">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-zinc-600 truncate font-mono">
                        {v.visitorId.slice(0, 8)}…
                      </p>
                      <p className="text-[10px] font-semibold text-zinc-400">
                        first: {fmt(v.firstSeen)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-violet-500">{v.visitCount}×</p>
                      <p className="text-[10px] text-zinc-400">{fmt(v.lastSeen)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setStats(null); setKey(""); }}
              className="w-full py-3 rounded-2xl bg-white border-2 border-zinc-100 text-zinc-500 font-black text-sm btn-bounce"
            >
              Lock Admin Panel 🔒
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
