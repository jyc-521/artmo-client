import { authApi } from './http';
import type { Artwork, DataResponse, Sponsorship } from '../types';

export interface SponsorshipInput {
  title: string;
  artistName: string;
  imageUrl: string;
  description: string;
  licenseAgreed: boolean;
  goodsConsent: boolean;
}

export const sponsorshipService = {
  create: async (input: SponsorshipInput) => (await authApi.post<DataResponse<Sponsorship>>('/api/sponsorships', input)).data.data,
  mine: async () => (await authApi.get<DataResponse<Sponsorship[]>>('/api/sponsorships/me')).data.data,
  list: async (status?: Sponsorship['status']) =>
    (await authApi.get<DataResponse<Sponsorship[]>>('/api/sponsorships', { params: status ? { status } : {} })).data.data,
  approve: async (id: number) => (await authApi.post<DataResponse<Artwork>>(`/api/sponsorships/${id}/approve`)).data.data,
  reject: async (id: number) => (await authApi.put<DataResponse<Sponsorship>>(`/api/sponsorships/${id}`)).data.data,
};
