import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService, type SocialProvider } from '../services/authApi';
import { authConfigured } from '../config/supabase';
import { messageOf } from '../utils/errorMessage';

const BUTTONS = [
  { key: 'google', provider: 'google', label: 'Google로 계속하기' },
  { key: 'naver', provider: 'custom:naver', label: '네이버로 계속하기' },
] as const;

export default function SocialLoginButtons() {
  const [redirecting, setRedirecting] = useState<SocialProvider | null>(null);
  const [message, setMessage] = useState('');
  const providers = useQuery({ queryKey: ['auth-providers'], queryFn: authService.providers, staleTime: 60_000, retry: false });
  const shown = BUTTONS.filter((b) => providers.data?.[b.key]);
  if (!authConfigured || !shown.length) return null;
  return (
    <section aria-label="소셜 로그인" className="stack tight">
      {shown.map((b) => (
        <button key={b.key} type="button" className="btn secondary" disabled={redirecting !== null}
          onClick={() => {
            setMessage('');
            setRedirecting(b.provider);
            authService.socialLogin(b.provider).catch((e: unknown) => {
              setMessage(messageOf(e));
              setRedirecting(null);
            });
          }}>
          {redirecting === b.provider ? '이동 중…' : b.label}
        </button>
      ))}
      {message && <p role="alert" className="field-error">{message}</p>}
    </section>
  );
}
