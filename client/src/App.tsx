import { Switch, Route } from "wouter";
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
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
