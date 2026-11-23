import axios from 'axios';

export function statusOf(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

// 서버가 보낸 안전한 한국어 메시지만 보여준다. 5xx 원문은 일반 문구로 바꾼다.
export function messageOf(error: unknown): string {
  if (axios.isAxiosError<{ message?: string; error?: { message?: string } }>(error)) {
    const status = error.response?.status;
    if (!error.response) return '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.';
    if (status === 429) return error.response.data?.message ?? '잠시 후 다시 시도해 주세요.';
    if (status && status >= 500 && status !== 503) return '문제가 생겼어요. 잠시 후 다시 시도해 주세요.';
    return error.response.data?.message ?? error.response.data?.error?.message ?? '요청에 실패했어요.';
  }
  return error instanceof Error ? error.message : '요청에 실패했어요. 다시 시도해 주세요.';
}
