import { Link, useLocation } from "wouter";
import { Home, CheckSquare, Activity, BarChart3, Users } from "lucide-react";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/todo", icon: CheckSquare, label: "Todo" },
    { path: "/habits", icon: Activity, label: "Habits" },
    { path: "/analytics", icon: BarChart3, label: "Stats" },
    { path: "/friends", icon: Users, label: "Friends" },
  ];

  if (location === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto bg-card/95 dark:bg-card/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border-2 border-border/50 p-2 pointer-events-auto">
        <ul className="flex justify-between items-center px-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link href={item.path} className="block relative">
                  <motion.div 
                    whileTap={{ scale: 0.85 }}
                    className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute -bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2"
                      />
                    )}
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
