import { useState, useEffect } from 'react';
import { api, type InsertSession } from '@shared/routes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- Mochi Storage Types (Local Persistence) ---
export interface MochiSession {
  id: number;
  purpose: string;
  minutes: number;
  date: string;
  type: 'pomodoro' | 'task';
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
  buddyId: string;
}

// Initial State
const INITIAL_STATE: MochiState = {
  xp: 0,
  streak: 0,
  lastSessionDate: null,
  unlockedKitties: [{ id: 'k1', name: 'Original Mochi', unlockedAt: new Date().toISOString() }],
  isDarkMode: false,
  sessions: [],
  buddyId: 'k1',
};

export function useMochi() {
  const [state, setState] = useState<MochiState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('mochi-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old data without buddyId
      if (!parsed.buddyId) parsed.buddyId = 'k1';
      setState(parsed);
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
      if (newXP >= 500 && !newKitties.find(k => k.id === 'k5')) {
        newKitties.push({ id: 'k5', name: 'Galaxy Mochi', unlockedAt: new Date().toISOString() });
      }

      return { ...prev, xp: newXP, unlockedKitties: newKitties };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    setState(prev => {
      if (prev.lastSessionDate === today) return prev;

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
    if (session.type === 'pomodoro') {
      addXP(session.minutes);
      updateStreak();
    } else {
      // Task completion also adds a bit of XP
      addXP(5);
    }
  };

  const setBuddy = (id: string) => {
    setState(prev => ({ ...prev, buddyId: id }));
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
    setBuddy,
    isLoaded
  };
}
