/* eslint-disable react-refresh/only-export-components -- useAuth와 Provider를 함께 제공한다. */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { authService } from '../services/authApi';
import { messageOf } from '../utils/errorMessage';
import type { AppUser } from '../types';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  authError: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refresh: () => Promise<AppUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider가 필요합니다.');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // user는 서버(/api/auth/me)가 확인한 앱 프로필이다. SDK session만으로 정하지 않는다.
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const queryClient = useQueryClient();

  const refresh = useCallback(async () => {
    const me = await authService.me();
    setUser(me);
    setAuthError('');
    return me;
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let alive = true;
    let generation = 0;
    let previousUserId: string | undefined;
    const applySession = async (session: Session | null) => {
      if (!alive) return;
      const ticket = ++generation; // 늦게 도착한 이전 응답은 무시한다
      if (session?.user.id !== previousUserId) {
        queryClient.clear(); // 계정이 바뀌면 이전 사용자의 화면 데이터를 지운다
        previousUserId = session?.user.id;
      }
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const me = await authService.me();
        if (alive && ticket === generation) {
          setUser(me);
          setAuthError('');
        }
      } catch (error) {
        if (alive && ticket === generation) {
          setUser(null);
          setAuthError(messageOf(error));
        }
      } finally {
        if (alive && ticket === generation) setLoading(false);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => void applySession(session), 0);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }
      void applySession(data.session);
    });
    return () => {
      alive = false;
      generation++;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAuthError('');
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, isAuthenticated: Boolean(user), isAdmin: user?.userType === 'admin', refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
