import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Pomodoro from "@/pages/Pomodoro";
import Collection from "@/pages/Collection";
import Tasks from "@/pages/Tasks";
import History from "@/pages/History";
import Tired from "@/pages/Tired";
import Analytics from "@/pages/Analytics";
import Todo from "@/pages/Todo";
import Habits from "@/pages/Habits";
import Friends from "@/pages/Friends";
import Onboarding from "@/pages/Onboarding";
import DreamWorld from "@/pages/DreamWorld";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/pomodoro" component={Pomodoro} />
        <Route path="/collection" component={Collection} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/history" component={History} />
        <Route path="/tired" component={Tired} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/todo" component={Todo} />
        <Route path="/habits" component={Habits} />
        <Route path="/friends" component={Friends} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/dream-world" component={DreamWorld} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </div>
  );
}

function useVisitorTracking() {
  useEffect(() => {
    try {
      let vid = localStorage.getItem("mochi-visitor-id");
      if (!vid) {
        vid = `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem("mochi-visitor-id", vid);
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: vid }),
      }).catch(() => {});
    } catch {}
  }, []);
}

function App() {
  useVisitorTracking();
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
