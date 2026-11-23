import { authApi, publicApi } from './http';
import { supabase } from '../config/supabase';
import type { CreateRecommendationResult, DataResponse, Recommendation } from '../types';

async function signedIn(): Promise<boolean> {
  const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
  return Boolean(data.session);
}

export const recommendationService = {
  // 로그인 상태면 authApi로 보내 추천 기록을 남긴다.
  create: async (sentence: string) => {
    const client = (await signedIn()) ? authApi : publicApi;
    return (await client.post<DataResponse<CreateRecommendationResult>>('/api/recommendations', { sentence })).data.data;
  },
  get: async (id: string) => {
    const client = (await signedIn()) ? authApi : publicApi;
    return (await client.get<DataResponse<Recommendation>>(`/api/recommendations/${id}`)).data.data;
  },
  mine: async () => (await authApi.get<DataResponse<Recommendation[]>>('/api/recommendations/me')).data.data,
  recordShare: async (id: string) => {
    await publicApi.post(`/api/recommendations/${id}/share`);
  },
};
