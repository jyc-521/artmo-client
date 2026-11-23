import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { artworkService } from '../services/artworkApi';
import { useAuth } from '../contexts/AuthContext';
import ArtworkImage from '../components/ArtworkImage';
import Loading from '../components/Loading';
import { messageOf } from '../utils/errorMessage';

const MUSEUM: Record<string, string> = { met: '메트로폴리탄 미술관', aic: '시카고 미술관', sponsor: 'ARTMO 협찬 작가' };

export default function ArtworkDetailPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const query = useQuery({ queryKey: ['artwork', id], queryFn: () => artworkService.get(id), enabled: Number.isInteger(id) });
  const saved = useQuery({ queryKey: ['saved'], queryFn: artworkService.saved, enabled: isAuthenticated });
  const isSaved = Boolean(saved.data?.some((a) => a.id === id));
  const toggle = useMutation({
    mutationFn: () => (isSaved ? artworkService.unsave(id) : artworkService.save(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['saved'] });
      toast.success(isSaved ? '저장을 취소했어요.' : '작품을 저장했어요.');
    },
    onError: (e) => toast.error(messageOf(e)),
  });

  if (query.isPending) return <section className="page"><Loading /></section>;
  if (query.isError) return <section className="page center"><p>{messageOf(query.error)}</p><Link to="/artworks">갤러리로</Link></section>;
  const art = query.data;

  return (
    <section className="page wide">
      <div className="result-layout">
        <div className="artwork-frame"><ArtworkImage artwork={art} loading="eager" /></div>
        <div className="stack">
          <div className="stack tight">
            <h1 className="work-title" style={{ fontSize: 26 }}>{art.title}</h1>
            <span className="muted">{[art.artist, art.year, art.medium].filter(Boolean).join(' · ')}</span>
          </div>
          {art.emotionTags.length > 0 && (
            <ul className="tags" aria-label="감정 태그" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {art.emotionTags.map((t) => (
                <li key={t}><Link className="tag" to={`/artworks?tag=${encodeURIComponent(t)}`} style={{ textDecoration: 'none' }}>#{t}</Link></li>
              ))}
            </ul>
          )}
          {art.description && (
            <section className="stack tight">
              <h2 className="h2" style={{ fontSize: 17 }}>작품 해설</h2>
              <p style={{ margin: 0, lineHeight: 1.8 }}>{art.description}</p>
            </section>
          )}
          <div className="notice row-between" style={{ flexDirection: 'row' }}>
            <span className="muted" style={{ fontSize: 14 }}>{MUSEUM[art.source] ?? ''}{art.isPublicDomain ? ' · 퍼블릭 도메인' : ''}</span>
            {art.sourceUrl && <a href={art.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>미술관에서 보기</a>}
          </div>
          <div className="btn-row">
            <button type="button" className="btn secondary" disabled={toggle.isPending}
              onClick={() => (isAuthenticated ? toggle.mutate() : navigate('/login', { state: { from: `/artworks/${id}` } }))}>
              {isSaved ? '♥ 저장됨' : '♡ 작품 저장'}
            </button>
            <Link to="/" className="btn">내 기분으로 카드 만들기</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
