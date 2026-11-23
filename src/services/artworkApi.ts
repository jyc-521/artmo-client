import { authApi, publicApi } from './http';
import type { Artwork, DataResponse } from '../types';

export const artworkService = {
  list: async (params: { tag?: string; limit?: number; offset?: number } = {}) =>
    (await publicApi.get<DataResponse<Artwork[]>>('/api/artworks', { params })).data.data,
  popular: async (limit = 24) => (await publicApi.get<DataResponse<Artwork[]>>('/api/artworks/popular', { params: { limit } })).data.data,
  tags: async () => (await publicApi.get<DataResponse<string[]>>('/api/artworks/tags')).data.data,
  get: async (id: number) => (await publicApi.get<DataResponse<Artwork>>(`/api/artworks/${id}`)).data.data,
  saved: async () => (await authApi.get<DataResponse<Artwork[]>>('/api/artworks/saved')).data.data,
  save: async (id: number) => {
    await authApi.post(`/api/artworks/${id}/save`);
  },
  unsave: async (id: number) => {
    await authApi.delete(`/api/artworks/${id}/save`);
  },
  update: async (id: number, patch: Partial<Pick<Artwork, 'title' | 'artist' | 'year' | 'description' | 'emotionTags' | 'isVisible'>>) =>
    (await authApi.put<DataResponse<Artwork>>(`/api/artworks/${id}`, patch)).data.data,
  remove: async (id: number) => {
    await authApi.delete(`/api/artworks/${id}`);
  },
};
