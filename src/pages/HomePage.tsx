import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { recommendationService } from '../services/recommendationApi';
import { useAuth } from '../contexts/AuthContext';
import { messageOf, statusOf } from '../utils/errorMessage';

const MIN = 5;
const MAX = 200;

export default function HomePage() {
  const [sentence, setSentence] = useState('');
  const [hint, setHint] = useState('');
  const [fieldError, setFieldError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const length = sentence.trim().length;

  const mutation = useMutation({
    mutationFn: (text: string) => recommendationService.create(text),
    onSuccess: (result) => {
      if (result.needsMoreDetail) {
        setHint(result.hint);
        return;
      }
      queryClient.setQueryData(['recommendation', result.id], result);
      navigate(`/result/${result.id}`);
    },
    onError: (error) => {
      const status = statusOf(error);
      if (status === 400) setFieldError(messageOf(error));
      else toast.error(messageOf(error));
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setHint('');
    setFieldError('');
    if (length < MIN || length > MAX) {
      setFieldError(`${MIN}자 이상 ${MAX}자 이하로 써 주세요.`);
      return;
    }
    mutation.mutate(sentence.trim());
  };

  return (
    <section className="page">
      <form className="stack" onSubmit={submit} style={{ paddingTop: 32 }} noValidate>
        <h1 className="h1">지금 기분을<br />한 문장으로 써 주세요</h1>
        <p className="muted" style={{ margin: 0 }}>어울리는 명화 한 점을 찾아 카드로 만들어 드려요.</p>
        <div className="field" style={{ marginTop: 16 }}>
          <label htmlFor="mood">기분 문장</label>
          <textarea
            id="mood"
            className="textarea"
            rows={4}
            maxLength={MAX + 20}
            value={sentence}
            onChange={(e) => {
              setSentence(e.target.value);
              setFieldError('');
            }}
            placeholder="수평선 한가운데 선 고독한 사람 같아"
            aria-describedby="mood-help mood-hint"
            aria-invalid={Boolean(fieldError)}
            disabled={mutation.isPending}
          />
          <div className="field-help" id="mood-help">
            <span>{MIN}자 이상 {MAX}자 이하</span>
            <span aria-live="polite">{length} / {MAX}</span>
          </div>
          {fieldError && <p className="field-error" role="alert" style={{ margin: 0 }}>{fieldError}</p>}
        </div>
        {hint && (
          <div className="notice" id="mood-hint" role="status">
            <strong>감정이 조금 더 드러나면 좋아요</strong>
            <span>{hint}</span>
            <span className="muted" style={{ fontSize: 14 }}>예: 배부르고 나른해서 햇살 드는 창가에 누운 고양이 같아</span>
          </div>
        )}
        <button type="submit" className="btn" disabled={mutation.isPending || length === 0}>
          {mutation.isPending ? '작품을 고르는 중…' : hint ? '다시 찾기' : '작품 찾기'}
        </button>
        <p className="muted" style={{ margin: 0, fontSize: 13, textAlign: 'center' }}>
          {isAuthenticated ? '로그인하면 하루 10번, 추천 기록이 저장돼요' : '로그인 없이 하루 3번 · 로그인하면 하루 10번'}
        </p>
      </form>
    </section>
  );
}
