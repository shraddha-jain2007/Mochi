import { useState, useEffect } from 'react';
import { api, type InsertSession } from '@shared/routes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- Mochi Storage Types (Local Persistence) ---
export interface MochiSession {
  id: number;
  purpose: string;
  minutes: number;
  date: string;
}

export interface UnlockedKitty {
  id: string;
  name: string;
  unlockedAt: string;
}

interface MochiState {
  xp: number;
  streak: number;
  lastSessionDate: string | null;
  unlockedKitties: UnlockedKitty[];
  isDarkMode: boolean;
  sessions: MochiSession[];
}

// Initial State
const INITIAL_STATE: MochiState = {
  xp: 0,
  streak: 0,
  lastSessionDate: null,
  unlockedKitties: [{ id: 'k1', name: 'Original Mochi', unlockedAt: new Date().toISOString() }],
  isDarkMode: false,
  sessions: [],
};

// --- Custom Hook for Mochi Logic ---
// Note: We are mocking the backend interaction here using localStorage
// because the user specifically requested "Use localStorage for persistence for ALL data".
// The real backend hooks (useQuery/useMutation) are provided below but won't be used for the core logic 
// to strictly follow the requirement of client-side persistence for this "lite" version.

export function useMochi() {
  const [state, setState] = useState<MochiState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('mochi-data');
    if (saved) {
      setState(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('mochi-data', JSON.stringify(state));
      
      // Apply theme
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [state, isLoaded]);

  const addXP = (amount: number) => {
    setState(prev => {
      // Logic for unlocking kitties based on XP milestones
      const newXP = prev.xp + amount;
      const newKitties = [...prev.unlockedKitties];
      
      if (newXP >= 50 && !newKitties.find(k => k.id === 'k2')) {
        newKitties.push({ id: 'k2', name: 'Sleepy Mochi', unlockedAt: new Date().toISOString() });
      }
      if (newXP >= 150 && !newKitties.find(k => k.id === 'k3')) {
        newKitties.push({ id: 'k3', name: 'Chef Mochi', unlockedAt: new Date().toISOString() });
      }
       if (newXP >= 300 && !newKitties.find(k => k.id === 'k4')) {
        newKitties.push({ id: 'k4', name: 'Ninja Mochi', unlockedAt: new Date().toISOString() });
      }

      return { ...prev, xp: newXP, unlockedKitties: newKitties };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    setState(prev => {
      if (prev.lastSessionDate === today) return prev; // Already did a session today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = prev.streak;
      if (prev.lastSessionDate === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      return { ...prev, streak: newStreak, lastSessionDate: today };
    });
  };

  const addSession = (session: Omit<MochiSession, 'id'>) => {
    const newSession = { ...session, id: Date.now() };
    setState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions]
    }));
    
    // Update game state
    addXP(session.minutes); // 1 min = 1 XP
    updateStreak();
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, sessions: [] }));
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  return {
    ...state,
    addSession,
    clearHistory,
    toggleTheme,
    isLoaded
  };
}

// --- Standard API Hooks (if we were using the backend) ---
export function useSessions() {
  return useQuery({
    queryKey: [api.sessions.list.path],
    queryFn: async () => {
      const res = await fetch(api.sessions.list.path);
      if (!res.ok) throw new Error('Failed to fetch sessions');
      return api.sessions.list.responses[200].parse(await res.json());
    }
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSession) => {
      const res = await fetch(api.sessions.create.path, {
        method: api.sessions.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create session');
      return api.sessions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.sessions.list.path] }),
  });
}
