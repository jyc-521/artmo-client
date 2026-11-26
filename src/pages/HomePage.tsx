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
      {/* 미술관 정면: 돌벽에 새긴 이름과 큰 대문. 문이 열리면 그 너머 전시실에서 문장을 쓴다. */}
      <div className="facade">
        <p className="facade-name" aria-hidden="true">ARTMO</p>
        <p className="facade-plaque">상설전 · 메트로폴리탄 미술관 명화</p>
        <div className="portal">
          <div className="portal-opening">
            <div className="portal-room">
              <ArtworkCorridor />
              <form className="portal-form" onSubmit={submit} noValidate>
                <div className="field">
                  <label htmlFor="mood" className="portal-label">지금 기분을 한 문장으로 남겨 주세요</label>
                  <textarea
                    id="mood"
                    className="portal-input"
                    rows={2}
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
                    <span style={{ fontSize: 14, opacity: 0.8 }}>예: 배부르고 나른해서 햇살 드는 창가에 누운 고양이 같아</span>
                  </div>
                )}
                <button type="submit" className="btn enter-btn" disabled={mutation.isPending || length === 0}>
                  {mutation.isPending ? '작품을 거는 중…' : hint ? '다시 찾기' : <>전시실 입장 <span className="enter-arrow" aria-hidden="true">→</span></>}
                </button>
                <p className="portal-info">입장 무료 · {isAuthenticated ? '하루 10회' : '하루 3회 (로그인 시 10회)'}</p>
              </form>
            </div>
            {/* 안쪽으로 열리는 문짝 두 개 */}
            <div className="door door-left" aria-hidden="true" />
            <div className="door door-right" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
