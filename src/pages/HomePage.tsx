import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { recommendationService } from '../services/recommendationApi';
import { useAuth } from '../contexts/AuthContext';
import { messageOf, statusOf } from '../utils/errorMessage';
import ArtworkCorridor from '../components/ArtworkCorridor';

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
      // 전시실로 들어가듯 조명이 어두워진 뒤 결과 화면으로 넘어간다.
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        navigate(`/result/${result.id}`);
        return;
      }
      document.body.classList.add('entering');
      window.setTimeout(() => {
        navigate(`/result/${result.id}`);
        document.body.classList.remove('entering');
      }, 600);
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
    <section className="lobby">
      <div className="page wide lobby-inner">
        <header className="lobby-banner">
          <span className="lobby-eyebrow">ARTMO 상설전</span>
          <h1 className="lobby-title">오늘의 기분<span className="lobby-title-mark">展</span></h1>
          <p className="lobby-lead">당신이 남긴 한 문장에 어울리는 명화 한 점을 전시실에 걸어 드려요.</p>
          <dl className="lobby-info">
            <div><dt>소장</dt><dd>메트로폴리탄 미술관 명화</dd></div>
            <div><dt>관람</dt><dd>{isAuthenticated ? '하루 10회' : <>하루 3회 <small>로그인 10회</small></>}</dd></div>
            <div><dt>입장료</dt><dd>무료</dd></div>
          </dl>
        </header>

        <form className="guestbook" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="mood" className="guestbook-label">
              <span>방명록</span>
              지금 기분을 한 문장으로 남겨 주세요
            </label>
            <textarea
              id="mood"
              className="guestbook-input"
              rows={3}
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
          <button type="submit" className="btn enter-btn" disabled={mutation.isPending || length === 0}>
            {mutation.isPending ? '작품을 거는 중…' : hint ? '다시 찾기' : <>전시실 입장 <span className="enter-arrow" aria-hidden="true">→</span></>}
          </button>
        </form>
      </div>

      <div className="corridor-wrap">
        <p className="corridor-caption">지금 소장 중인 작품</p>
        <ArtworkCorridor />
      </div>
    </section>
  );
}
