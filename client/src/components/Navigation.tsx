import { Link, useLocation } from "wouter";
import { Home, Cat, History, Coffee, Sparkles, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/collection", icon: Cat, label: "Kitties" },
    { path: "/tasks", icon: Sparkles, label: "Tasks" },
    { path: "/analytics", icon: BarChart3, label: "Stats" },
    { path: "/history", icon: History, label: "History" },
  ];

  if (location === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto bg-card/90 dark:bg-card/90 backdrop-blur-lg rounded-full shadow-xl border border-border/50 p-2 pointer-events-auto">
        <ul className="flex justify-between items-center px-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link href={item.path} className="block relative">
                  <div className={`p-3 rounded-full transition-all duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2"
                      />
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
