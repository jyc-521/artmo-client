import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/authApi';
import { authConfigured } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { messageOf } from '../utils/errorMessage';

interface Form { name: string; email: string; password: string; confirm: string }

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Form>();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setMessage('');
    try {
      const result = await authService.register(email, password, name);
      if (result.session) {
        await refresh();
        navigate('/me', { replace: true });
      } else {
        setSent(true);
      }
    } catch (e) {
      setMessage(messageOf(e));
    }
  });

  if (sent) {
    return (
      <section className="page center" style={{ maxWidth: 440 }}>
        <h1 className="h2">가입 확인 메일을 보냈어요</h1>
        <p className="muted">메일의 링크를 누르면 가입이 끝나요.</p>
        <Link to="/login" className="btn">로그인으로</Link>
      </section>
    );
  }

  return (
    <section className="page" style={{ maxWidth: 440 }}>
      <form className="stack" onSubmit={onSubmit} noValidate>
        <h1 className="h1" style={{ fontSize: 28 }}>회원가입</h1>
        <div className="field">
          <label htmlFor="name">이름</label>
          <input id="name" className="input" autoComplete="nickname" {...register('name', { required: '이름을 입력해 주세요.', maxLength: { value: 80, message: '80자 이하로 입력해 주세요.' } })} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="r-email">이메일</label>
          <input id="r-email" type="email" className="input" autoComplete="email" {...register('email', { required: '이메일을 입력해 주세요.' })} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="r-password">비밀번호 (8자 이상)</label>
          <input id="r-password" type="password" className="input" autoComplete="new-password" {...register('password', { required: '비밀번호를 입력해 주세요.', minLength: { value: 8, message: '8자 이상으로 정해 주세요.' } })} />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="r-confirm">비밀번호 확인</label>
          <input id="r-confirm" type="password" className="input" autoComplete="new-password" {...register('confirm', { validate: (v) => v === watch('password') || '비밀번호가 서로 달라요.' })} />
          {errors.confirm && <span className="field-error">{errors.confirm.message}</span>}
        </div>
        {message && <p className="field-error" role="alert" style={{ margin: 0 }}>{message}</p>}
        <button type="submit" className="btn" disabled={isSubmitting || !authConfigured}>{isSubmitting ? '가입 중…' : '가입하기'}</button>
        <SocialLoginButtons />
        <p className="muted" style={{ margin: 0, textAlign: 'center' }}>이미 계정이 있나요? <Link to="/login">로그인</Link></p>
      </form>
    </section>
  );
}
