import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { recommendationService } from '../services/recommendationApi';
import { artworkService } from '../services/artworkApi';
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
  const query = useQuery({ queryKey: ['recommendation', id], queryFn: () => recommendationService.get(id), enabled: Boolean(id) });
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
    <section className="page wide">
      <div className="result-layout">
        <Link to={`/artworks/${art.id}`} className="artwork-frame" aria-label={`${art.title} 작품 상세 보기`}>
          <ArtworkImage artwork={art} loading="eager" />
        </Link>
        <div className="stack">
          <p className="quote">“{rec.inputText}”</p>
          <div className="stack tight">
            <h1 className="work-title">{art.title}</h1>
            <span className="muted">{art.artist}{art.year ? ` · ${art.year}` : ''}</span>
          </div>
          {rec.emotionTags.length > 0 && (
            <ul className="tags" aria-label="감정 태그" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {rec.emotionTags.map((t) => <li key={t} className="tag">#{t}</li>)}
            </ul>
          )}
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75 }}>{rec.interpretation}</p>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 4 }}>
            <button type="button" className="btn ghost small"
              onClick={() => (isAuthenticated ? saveArtwork.mutate(art.id) : navigate('/login', { state: { from: `/result/${rec.id}` } }))}
              disabled={saveArtwork.isPending}>
              ♡ 작품 저장
            </button>
            <button type="button" className="btn ghost small" onClick={() => void copyLink()}>링크 복사</button>
            <Link to="/" className="btn ghost small">다른 문장 쓰기</Link>
          </div>
        </div>
      </div>
      <ShareCard ref={cardRef} recommendation={rec} />
    </section>
  );
}
