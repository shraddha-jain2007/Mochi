import { useState, useEffect } from 'react';

// --- Types ---
export interface MochiSession {
  id: number;
  purpose: string;
  minutes: number;
  date: string;
  type: 'pomodoro' | 'task';
  subject?: string;
  notes?: string;
}

export interface UnlockedKitty {
  id: string;
  name: string;
  unlockedAt: string;
}

export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
}

export interface Habit {
  id: number;
  name: string;
  emoji: string;
  completions: string[]; // Array of "YYYY-MM-DD"
  color: string;
  createdAt: string;
}

interface MochiState {
  username: string;
  xp: number;
  streak: number;
  lastSessionDate: string | null;
  unlockedKitties: UnlockedKitty[];
  isDarkMode: boolean;
  sessions: MochiSession[];
  buddyId: string;
  todos: TodoItem[];
  habits: Habit[];
  dailyGoalMinutes: number;
}

const INITIAL_STATE: MochiState = {
  username: '',
  xp: 0,
  streak: 0,
  lastSessionDate: null,
  unlockedKitties: [{ id: 'k1', name: 'Original Mochi', unlockedAt: new Date().toISOString() }],
  isDarkMode: false,
  sessions: [],
  buddyId: 'k1',
  todos: [],
  habits: [],
  dailyGoalMinutes: 60,
};

export function useMochi() {
  const [state, setState] = useState<MochiState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mochi-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.buddyId) parsed.buddyId = 'k1';
      if (!parsed.username) parsed.username = '';
      if (!parsed.todos) parsed.todos = [];
      if (!parsed.habits) parsed.habits = [];
      if (!parsed.dailyGoalMinutes) parsed.dailyGoalMinutes = 60;
      setState(parsed);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('mochi-data', JSON.stringify(state));
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [state, isLoaded]);

  const setUsername = (name: string) => setState(prev => ({ ...prev, username: name }));

  const setDailyGoal = (minutes: number) => setState(prev => ({ ...prev, dailyGoalMinutes: minutes }));

  const addXP = (amount: number) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newKitties = [...prev.unlockedKitties];
      if (newXP >= 50  && !newKitties.find(k => k.id === 'k2'))
        newKitties.push({ id: 'k2', name: 'Sleepy Mochi',  unlockedAt: new Date().toISOString() });
      if (newXP >= 150 && !newKitties.find(k => k.id === 'k3'))
        newKitties.push({ id: 'k3', name: 'Chef Mochi',    unlockedAt: new Date().toISOString() });
      if (newXP >= 300 && !newKitties.find(k => k.id === 'k4'))
        newKitties.push({ id: 'k4', name: 'Ninja Mochi',   unlockedAt: new Date().toISOString() });
      if (newXP >= 500 && !newKitties.find(k => k.id === 'k5'))
        newKitties.push({ id: 'k5', name: 'Galaxy Mochi',  unlockedAt: new Date().toISOString() });
      return { ...prev, xp: newXP, unlockedKitties: newKitties };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    setState(prev => {
      if (prev.lastSessionDate === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = prev.lastSessionDate === yesterday.toDateString() ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastSessionDate: today };
    });
  };

  const addSession = (session: Omit<MochiSession, 'id'>) => {
    const newSession = { ...session, id: Date.now() };
    setState(prev => ({ ...prev, sessions: [newSession, ...prev.sessions] }));
    if (session.type === 'pomodoro') {
      addXP(session.minutes);
      updateStreak();
    } else {
      addXP(5);
    }
  };

  const setBuddy    = (id: string) => setState(prev => ({ ...prev, buddyId: id }));
  const clearHistory = ()          => setState(prev => ({ ...prev, sessions: [] }));
  const toggleTheme  = ()          => setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));

  // --- Todo ---
  const addTodo = (text: string, priority: TodoItem['priority'] = 'medium', category = 'General') => {
    const todo: TodoItem = { id: Date.now(), text, done: false, priority, category, createdAt: new Date().toISOString() };
    setState(prev => ({ ...prev, todos: [todo, ...prev.todos] }));
  };
  const toggleTodo = (id: number) =>
    setState(prev => ({ ...prev, todos: prev.todos.map(t => t.id === id ? { ...t, done: !t.done } : t) }));
  const deleteTodo = (id: number) =>
    setState(prev => ({ ...prev, todos: prev.todos.filter(t => t.id !== id) }));

  // --- Habits ---
  const addHabit = (name: string, emoji: string, color: string) => {
    const habit: Habit = { id: Date.now(), name, emoji, completions: [], color, createdAt: new Date().toISOString() };
    setState(prev => ({ ...prev, habits: [habit, ...prev.habits] }));
  };
  const toggleHabit = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== id) return h;
        const already = h.completions.includes(today);
        return { ...h, completions: already ? h.completions.filter(d => d !== today) : [...h.completions, today] };
      })
    }));
    addXP(2);
  };
  const deleteHabit = (id: number) =>
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));

  // --- Data Export ---
  const exportCSV = () => {
    const rows = [
      ['id','purpose','subject','minutes','date','type','notes'],
      ...state.sessions.map(s => [
        s.id, `"${s.purpose}"`, `"${s.subject || ''}"`, s.minutes, s.date, s.type, `"${s.notes || ''}"`
      ])
    ];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'mochi-sessions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ sessions: state.sessions, habits: state.habits, todos: state.todos, xp: state.xp, streak: state.streak }, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'mochi-data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return {
    ...state,
    addSession,
    clearHistory,
    toggleTheme,
    setBuddy,
    setUsername,
    setDailyGoal,
    addTodo, toggleTodo, deleteTodo,
    addHabit, toggleHabit, deleteHabit,
    exportCSV, exportJSON,
    isLoaded
  };
}
