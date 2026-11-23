import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/authApi';
import { authConfigured } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { messageOf } from '../utils/errorMessage';

interface Form { email: string; password: string }

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<Form>();
  const [message, setMessage] = useState('');
  const [params] = useSearchParams();
  const { isAuthenticated, refresh } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/me';
  const callbackError = params.get('error');
  const notice = params.get('notice');

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setMessage('');
    try {
      await authService.login(email, password);
      await refresh();
      navigate(from, { replace: true });
    } catch (e) {
      setMessage(messageOf(e) === 'Invalid login credentials' ? '이메일 또는 비밀번호가 맞지 않아요.' : messageOf(e));
    }
  });

  return (
    <section className="page" style={{ maxWidth: 440 }}>
      <form className="stack" onSubmit={onSubmit} noValidate>
        <h1 className="h1" style={{ fontSize: 28 }}>로그인</h1>
        <p className="muted" style={{ margin: 0 }}>추천 기록과 저장한 작품을 모아 볼 수 있어요.</p>
        {!authConfigured && <p className="notice">로그인 설정(Supabase 환경변수)이 아직 없어요.</p>}
        {notice && <p className="muted" role="status">{notice}</p>}
        {callbackError && <p className="field-error" role="alert">{callbackError}</p>}
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input id="email" type="email" autoComplete="email" className="input" {...register('email', { required: true })} />
        </div>
        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input id="password" type="password" autoComplete="current-password" className="input" {...register('password', { required: true })} />
        </div>
        {message && <p className="field-error" role="alert" style={{ margin: 0 }}>{message}</p>}
        <button type="submit" className="btn" disabled={formState.isSubmitting || !authConfigured}>
          {formState.isSubmitting ? '로그인 중…' : '로그인'}
        </button>
        <SocialLoginButtons />
        <p className="muted" style={{ margin: 0, textAlign: 'center' }}>처음이세요? <Link to="/register">회원가입</Link></p>
      </form>
    </section>
  );
}
