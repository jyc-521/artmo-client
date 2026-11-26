import { useEffect, useState, type CSSProperties } from 'react';
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
  const [entering, setEntering] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const length = sentence.trim().length;
  // 입구도 전시실과 같은 어두운 분위기(머리말·하단 메뉴 포함).
  useEffect(() => {
    document.body.classList.add('room');
    return () => document.body.classList.remove('room');
  }, []);

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
      // 문이 활짝 열린 채 카메라가 안으로 들어가고(1.1초), 어두워지며 전시실로 넘어간다.
      setEntering(true);
      window.setTimeout(() => document.body.classList.add('entering'), 700);
      window.setTimeout(() => {
        navigate(`/result/${result.id}`);
        document.body.classList.remove('entering');
      }, 1300);
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

  // 문 여는 정도: 처음엔 살짝, 문장을 쓸수록 조금씩, 입장하면 활짝.
  const typed = Math.min(length / 30, 1);
  const open = entering || mutation.isPending ? 86 : 14 + typed * 30;

  return (
    <section className="lobby">
      {/* 거대한 청동 대문. 문 이미지는 scripts/render-door.py, 문고리는 scripts/render-knocker.py로 만든다. */}
      <div className={`gate${entering ? ' gate-entering' : ''}`} style={{ '--open': `${open}deg`, '--spill': open / 86 } as CSSProperties}>
        <div className="gate-lintel" aria-hidden="true"><span>ARTMO</span></div>
        <div className="gate-stage">
          <div className="gate-frame" aria-hidden="true">
            <div className="gate-doorway">
              <div className="gate-room">
                <ArtworkCorridor />
                <div className="gate-room-floor" />
              </div>
              <div className="door door-left">
                <span className="door-edge" />
                <span className="door-knocker" />
              </div>
              <div className="door door-right">
                <span className="door-edge" />
                <span className="door-knocker" />
              </div>
            </div>
            <div className="gate-threshold" />
          </div>
        </div>
        <div className="gate-front">
        <form className="gate-form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="mood" className="gate-label">지금 기분을 한 문장으로 남겨 주세요</label>
            <textarea
              id="mood"
              className="gate-input"
              rows={1}
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
          <p className="gate-info">입장 무료 · {isAuthenticated ? '하루 10회' : '하루 3회 (로그인 시 10회)'}</p>
        </form>
        </div>
      </div>
    </section>
  );
}
