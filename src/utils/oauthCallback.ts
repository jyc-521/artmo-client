// 코드를 URL에서 읽는 함수는 React 없이 검사할 수 있도록 분리합니다.
export function oauthCallbackError(search = '', hash = ''): string | null {
  for (const value of [search, hash]) {
    const params = new URLSearchParams(value.replace(/^[?#]/, ''));
    // 이메일 인증 링크가 만료되었거나 이미 쓰인 경우(Supabase는 error=access_denied와 함께 보낸다).
    if (params.get('error_code') === 'otp_expired') return '인증 링크가 만료되었거나 이미 사용되었습니다. 로그인해 보세요.';
    const error = params.get('error') ?? params.get('error_code');
    if (error === 'access_denied' || error === 'user_cancelled') {
      return '로그인이 취소되었습니다. 다시 시도하세요.';
    }
    if (error || params.has('error_description')) return '소셜 로그인을 완료하지 못했습니다. 다시 시도하세요.';
  }
  return null;
}
// 가입한 브라우저와 다른 브라우저(예: 메일 앱)에서 인증 링크를 열면 PKCE 검증값이 없어 교환이 실패한다.
// 이때도 Supabase는 이미 이메일 인증을 끝낸 상태이므로, 오류가 아니라 "로그인해 주세요" 안내로 보낸다.
export const EMAIL_CONFIRMED_NOTICE = '이메일 인증이 완료되었습니다. 로그인해 주세요.';
function isVerifierMissing(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { name?: unknown; code?: unknown };
  return e.name === 'AuthPKCECodeVerifierMissingError' || e.code === 'pkce_code_verifier_not_found';
}

export interface CodeExchanger {
  exchangeCodeForSession: (code: string) => Promise<{
    data: { session: unknown | null }; error: unknown;
  }>;
}
export async function completeAuthCallback(url: URL, auth?: CodeExchanger | null): Promise<string> {
  const providerError = oauthCallbackError(url.search, url.hash);
  if (providerError) return `/login?error=${encodeURIComponent(providerError)}`;
  const code = url.searchParams.get('code');
  if (code && auth) {
    try {
      const { data, error } = await auth.exchangeCodeForSession(code);
      // 이전 세션의 존재가 아니라 이번 일회용 코드 교환의 성공으로 판단합니다.
      if (!error && data.session) return '/me';
      if (isVerifierMissing(error)) return `/login?notice=${encodeURIComponent(EMAIL_CONFIRMED_NOTICE)}`;
    } catch (thrown) {
      if (isVerifierMissing(thrown)) return `/login?notice=${encodeURIComponent(EMAIL_CONFIRMED_NOTICE)}`;
      /* 네트워크 실패도 로그인 화면에서 다시 시작합니다. */
    }
  }
  return `/login?error=${encodeURIComponent('인증 정보를 확인하지 못했습니다. 다시 로그인하세요.')}`;
}
