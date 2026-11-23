import { authApi, publicApi } from './http';
import { requireSupabase } from '../config/supabase';
import type { AppUser, DataResponse, ProviderState, SuccessResponse, UserType } from '../types';

export type SocialProvider = 'google' | 'custom:naver';
const callbackUrl = () => `${window.location.origin}/auth/callback`;

export const authService = {
  register: async (email: string, password: string, name: string) => {
    const { data, error } = await requireSupabase().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() }, emailRedirectTo: callbackUrl() },
    });
    if (error) throw error;
    return data;
  },
  login: async (email: string, password: string) => {
    const { error } = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  },
  socialLogin: async (provider: SocialProvider) => {
    const { error } = await requireSupabase().auth.signInWithOAuth({ provider: provider as 'google', options: { redirectTo: callbackUrl() } });
    if (error) throw error;
  },
  logout: async () => {
    const { error } = await requireSupabase().auth.signOut({ scope: 'local' });
    if (error) throw error;
  },
  me: async () => (await authApi.get<SuccessResponse<AppUser>>('/api/auth/me')).data.data,
  providers: async () => (await publicApi.get<DataResponse<ProviderState>>('/api/auth/providers')).data.data,
  updateProfile: async (patch: { name?: string; avatar?: string }) =>
    (await authApi.put<SuccessResponse<AppUser>>('/api/users/profile', patch)).data.data,
  deactivate: async () => {
    await authApi.delete('/api/users/account');
  },
  listUsers: async () => (await authApi.get<SuccessResponse<AppUser[]>>('/api/users/all')).data.data,
  changeUserType: async (id: string, userType: UserType) =>
    (await authApi.put<SuccessResponse<AppUser>>(`/api/users/${id}/type`, { userType })).data.data,
};
