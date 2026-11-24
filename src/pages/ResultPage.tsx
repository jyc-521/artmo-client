import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { recommendationService } from '../services/recommendationApi';
import { artworkService } from '../services/artworkApi';
import { loadAmbient } from '../services/ambient';
import { cardFileName, renderCard, shareOrDownload, downloadFile } from '../services/share';
import { useAuth } from '../contexts/AuthContext';
import ArtworkImage from '../components/ArtworkImage';
import ShareCard from '../components/ShareCard';
import Loading from '../components/Loading';
import { messageOf } from '../utils/errorMessage';

const MUSEUM: Record<string, string> = { met: '메트로폴리탄 미술관', aic: '시카고 미술관', sponsor: 'ARTMO 협찬 작가' };

export default function ResultPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'' | 'save' | 'share'>('');
  // 결과 화면만 어두운 전시실 분위기로. 다른 화면으로 나가면 원래대로.
  useEffect(() => {
    document.body.classList.add('room');
    return () => document.body.classList.remove('room');
  }, []);
  const query = useQuery({ queryKey: ['recommendation', id], queryFn: () => recommendationService.get(id), enabled: Boolean(id) });
  const artworkId = query.data?.artwork?.id;
  // 작품 색을 배경에 번지게 하는 잔광. 실패하면 그냥 어두운 배경으로 둔다.
  const ambient = useQuery({
    queryKey: ['ambient', artworkId], queryFn: () => loadAmbient(artworkId!),
    enabled: artworkId !== undefined, staleTime: Infinity, retry: false,
  });
  const saveArtwork = useMutation({
    mutationFn: (artworkId: number) => artworkService.save(artworkId),
    onSuccess: () => toast.success('작품을 저장했어요. 마이페이지에서 볼 수 있어요.'),
    onError: (e) => toast.error(messageOf(e)),
  });

  if (query.isPending) return <section className="page"><Loading /></section>;
  if (query.isError || !query.data.artwork) {
    return (
      <section className="page center">
        <p>{query.isError ? messageOf(query.error) : '작품 정보를 찾을 수 없어요.'}</p>
        <Link to="/" className="btn">다시 쓰기</Link>
      </section>
    );
  }
  const rec = query.data;
  const art = rec.artwork!;

  const makeCard = async (mode: 'save' | 'share') => {
    if (!cardRef.current) return;
    setBusy(mode);
    try {
      const file = await renderCard(cardRef.current, cardFileName(art.title));
      const outcome = mode === 'share' ? await shareOrDownload(file) : (downloadFile(file), 'downloaded' as const);
      if (outcome !== 'cancelled') {
        void recommendationService.recordShare(rec.id).catch(() => undefined);
        if (outcome === 'downloaded') toast.success('카드 이미지를 저장했어요. 인스타 스토리에 올려 보세요.');
      }
    } catch {
      toast.error('카드 이미지를 만들지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy('');
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/#/result/${rec.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('링크를 복사했어요.');
    } catch {
      toast.info(url);
    }
  };

  return (
    <section className="page wide result-room">
      <div className={`room-ambient${ambient.data ? ' on' : ''}`} aria-hidden="true"
        style={ambient.data ? { backgroundImage: `url(${ambient.data.backdrop})` } : undefined} />
      <div className="result-layout">
        <div className="room-stage">
          <Link to={`/artworks/${art.id}`} className="artwork-frame" aria-label={`${art.title} 작품 상세 보기`}>
            <ArtworkImage artwork={art} loading="eager" />
          </Link>
        </div>
        <div className="stack">
          {/* 작품 설명판: 작품명·작가 + 하트(작품 저장) */}
          <div className="track">
            <div className="stack tight" style={{ minWidth: 0 }}>
              <h1 className="work-title">{art.title}</h1>
              <span className="muted">{art.artist}{art.year ? ` · ${art.year}` : ''}</span>
              {art.medium && <span className="muted label-meta">{art.medium}</span>}
            </div>
            <button type="button" className="heart" aria-label="작품 저장" title="작품 저장"
              onClick={() => (isAuthenticated ? saveArtwork.mutate(art.id) : navigate('/login', { state: { from: `/result/${rec.id}` } }))}
              disabled={saveArtwork.isPending} aria-pressed={saveArtwork.isSuccess}>
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
              </svg>
            </button>
          </div>
          <p className="quote museum-quote"><span className="qmark">“</span>{rec.inputText}<span className="qmark">”</span></p>
          {rec.emotionTags.length > 0 && (
            <ul className="tags" aria-label="감정 태그" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {rec.emotionTags.map((t) => <li key={t} className="tag">#{t}</li>)}
            </ul>
          )}
          <p className="interpretation">{rec.interpretation}</p>
          <span className="muted" style={{ fontSize: 13 }}>
            출처: {MUSEUM[art.source] ?? ''}{art.isPublicDomain ? ' · 퍼블릭 도메인' : ''}
          </span>
          <div className="btn-row">
            <button type="button" className="btn secondary" onClick={() => void makeCard('save')} disabled={busy !== ''}>
              {busy === 'save' ? '만드는 중…' : '이미지 저장'}
            </button>
            <button type="button" className="btn" onClick={() => void makeCard('share')} disabled={busy !== ''}>
              {busy === 'share' ? '만드는 중…' : '스토리에 공유'}
            </button>
          </div>
          <div className="action-links">
            <button type="button" className="btn ghost small" onClick={() => void copyLink()}>링크 복사</button>
            <Link to="/" className="btn ghost small">다른 문장 쓰기</Link>
          </div>
        </div>
      </div>
      <ShareCard ref={cardRef} recommendation={rec} ambient={ambient.data} />
    </section>
  );
}
