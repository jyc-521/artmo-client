import axios from 'axios';
import { supabase } from '../config/supabase';

const baseURL = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

// 공개 요청은 토큰 없이, 로그인 요청은 Bearer 토큰을 자동으로 붙인다. 쿠키는 쓰지 않는다.
export const publicApi = axios.create({ baseURL, timeout: 30000, withCredentials: false });
export const authApi = axios.create({ baseURL, timeout: 30000, withCredentials: false });

for (const client of [publicApi, authApi]) {
  client.interceptors.request.use((config) => {
    if (!baseURL) throw new Error('VITE_API_BASE_URL을 확인하고 Vite를 다시 시작하세요.');
    return config;
  });
}

authApi.interceptors.request.use(async (config) => {
  const { data, error } = (await supabase?.auth.getSession()) ?? { data: { session: null }, error: null };
  if (error) throw error;
  if (data.session) config.headers.Authorization = `Bearer ${data.session.access_token}`;
  return config;
});
