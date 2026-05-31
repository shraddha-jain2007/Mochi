import { Link, useLocation } from "wouter";
import { Home, CheckSquare, Activity, BarChart3, Users } from "lucide-react";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home,         label: "Home",    emoji: "🏠" },
    { path: "/todo",      icon: CheckSquare,   label: "Todo",    emoji: "📝" },
    { path: "/habits",    icon: Activity,      label: "Habits",  emoji: "🌱" },
    { path: "/analytics", icon: BarChart3,     label: "Stats",   emoji: "📊" },
    { path: "/friends",   icon: Users,         label: "Friends", emoji: "💌" },
  ];

  const HIDE_ON = ["/", "/onboarding"];
  if (HIDE_ON.includes(location)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 z-50 pointer-events-none">
      <nav
        className="max-w-md mx-auto backdrop-blur-xl rounded-[2rem] p-2 pointer-events-auto border-2"
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderColor: 'rgba(244,114,182,0.2)',
          boxShadow: '0 -4px 30px rgba(244,114,182,0.12), 0 4px 20px rgba(0,0,0,0.06)',
        }}
      >
        <ul className="flex justify-between items-center px-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link href={item.path} className="block">
                  <motion.div
                    whileTap={{ scale: 0.82 }}
                    className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-[1.5rem] transition-all duration-300 ${
                      isActive ? 'bg-gradient-to-b from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30' : ''
                    }`}
                  >
                    {isActive ? (
                      <span className="text-xl animate-wiggle">{item.emoji}</span>
                    ) : (
                      <Icon
                        size={21}
                        strokeWidth={2}
                        className="text-muted-foreground"
                      />
                    )}
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      isActive
                        ? 'text-transparent bg-clip-text'
                        : 'text-muted-foreground'
                    }`}
                      style={isActive ? {
                        backgroundImage: 'linear-gradient(135deg, #f472b6, #c084fc)',
                      } : {}}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
