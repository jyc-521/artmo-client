// Template for a new ARTMO API module. Copy to src/services/<domain>Api.ts and rename.
import { publicApi, authApi } from './http';

export interface ExampleItem {
  id: number;
  title: string;
}

interface DataResponse<T> {
  data: T;
}

// Public read: no token.
export async function listExamples(): Promise<ExampleItem[]> {
  const res = await publicApi.get<DataResponse<ExampleItem[]>>('/api/examples');
  return res.data.data;
}

// Signed-in write: Bearer token attached by authApi.
export async function createExample(input: Pick<ExampleItem, 'title'>): Promise<ExampleItem> {
  const res = await authApi.post<DataResponse<ExampleItem>>('/api/examples', input);
  return res.data.data;
}

// Delete returns 204 with an empty body.
export async function deleteExample(id: number): Promise<void> {
  await authApi.delete(`/api/examples/${id}`);
}
