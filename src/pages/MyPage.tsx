import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { recommendationService } from '../services/recommendationApi';
import { artworkService } from '../services/artworkApi';
import { sponsorshipService } from '../services/sponsorshipApi';
import { authService } from '../services/authApi';
import { useAuth } from '../contexts/AuthContext';
import ArtworkTile from '../components/ArtworkTile';
import ArtworkImage from '../components/ArtworkImage';
import Loading from '../components/Loading';
import { messageOf } from '../utils/errorMessage';

const TABS = [
  { key: 'history', label: '추천 기록' },
  { key: 'saved', label: '저장한 작품' },
  { key: 'sponsor', label: '협찬 신청' },
  { key: 'account', label: '내 정보' },
] as const;
type Tab = (typeof TABS)[number]['key'];
const STATUS = { pending: '심사 중', approved: '승인됨', rejected: '거절됨' } as const;

export default function MyPage() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.find((t) => t.key === params.get('tab'))?.key ?? 'history') as Tab;
  const { user } = useAuth();
  return (
    <section className="page wide stack">
      <div className="row-between">
        <h1 className="h1" style={{ fontSize: 28 }}>{user?.name}님의 ARTMO</h1>
        <Link to="/" className="btn small">새 기분 쓰기</Link>
      </div>
      <div className="chips" role="tablist" aria-label="마이페이지 메뉴">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" className="chip" aria-pressed={tab === t.key} aria-selected={tab === t.key}
            onClick={() => setParams({ tab: t.key }, { replace: true })}>{t.label}</button>
        ))}
      </div>
      {tab === 'history' && <History />}
      {tab === 'saved' && <Saved />}
      {tab === 'sponsor' && <MySponsorships />}
      {tab === 'account' && <Account />}
    </section>
  );
}

function History() {
  const q = useQuery({ queryKey: ['my-recommendations'], queryFn: recommendationService.mine });
  if (q.isPending) return <Loading />;
  if (q.isError) return <p role="alert">{messageOf(q.error)}</p>;
  if (!q.data.length) return <p className="muted">아직 추천 기록이 없어요. <Link to="/">첫 문장을 써 보세요.</Link></p>;
  return (
    <ul className="list">
      {q.data.map((r) => r.artwork && (
        <li key={r.id}>
          <Link to={`/result/${r.id}`} className="card" style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 16, textDecoration: 'none', color: 'inherit', alignItems: 'center' }}>
            <ArtworkImage artwork={r.artwork} className="tile-img" />
            <span className="stack tight">
              <span className="serif" style={{ fontWeight: 600 }}>“{r.inputText}”</span>
              <span className="muted" style={{ fontSize: 13 }}>{r.artwork.title} · {new Date(r.createdAt).toLocaleDateString('ko-KR')}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Saved() {
  const q = useQuery({ queryKey: ['saved'], queryFn: artworkService.saved });
  if (q.isPending) return <Loading />;
  if (q.isError) return <p role="alert">{messageOf(q.error)}</p>;
  if (!q.data.length) return <p className="muted">저장한 작품이 없어요. <Link to="/artworks">갤러리 둘러보기</Link></p>;
  return <div className="grid">{q.data.map((a) => <ArtworkTile key={a.id} artwork={a} />)}</div>;
}

function MySponsorships() {
  const q = useQuery({ queryKey: ['my-sponsorships'], queryFn: sponsorshipService.mine });
  if (q.isPending) return <Loading />;
  if (q.isError) return <p role="alert">{messageOf(q.error)}</p>;
  return (
    <div className="stack">
      <Link to="/sponsor" className="btn secondary" style={{ alignSelf: 'flex-start' }}>작품 협찬 신청하기</Link>
      {q.data.length === 0 ? <p className="muted">아직 신청한 작품이 없어요.</p> : (
        <ul className="list">
          {q.data.map((s) => (
            <li key={s.id} className="card row-between">
              <span><strong className="serif">{s.title}</strong> <span className="muted">· {s.artistName}</span></span>
              <span className="status">{STATUS[s.status]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Account() {
  const { user, refresh, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();
  const save = useMutation({
    mutationFn: () => authService.updateProfile({ name: name.trim() }),
    onSuccess: async () => { await refresh(); toast.success('이름을 바꿨어요.'); },
    onError: (e) => toast.error(messageOf(e)),
  });
  const deactivate = useMutation({
    mutationFn: authService.deactivate,
    onSuccess: async () => { await logout(); toast.info('계정을 비활성화했어요.'); navigate('/'); },
    onError: (e) => toast.error(messageOf(e)),
  });
  return (
    <div className="stack" style={{ maxWidth: 480 }}>
      <form className="stack" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <div className="field">
          <label htmlFor="my-name">표시 이름</label>
          <input id="my-name" className="input" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
        </div>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>{user?.email || '이메일 없음'} · {user?.provider} 로그인</p>
        <button type="submit" className="btn" disabled={save.isPending || !name.trim() || name.trim() === user?.name}>저장</button>
      </form>
      <button type="button" className="btn secondary" onClick={() => void logout().then(() => navigate('/'))}>로그아웃</button>
      <div className="card stack tight">
        <strong>계정 비활성화</strong>
        <span className="muted" style={{ fontSize: 14 }}>비활성화하면 다시 로그인할 수 없어요.</span>
        {confirming ? (
          <div className="btn-row">
            <button type="button" className="btn secondary small" onClick={() => setConfirming(false)}>취소</button>
            <button type="button" className="btn danger small" onClick={() => deactivate.mutate()} disabled={deactivate.isPending}>정말 비활성화</button>
          </div>
        ) : (
          <button type="button" className="btn ghost small" style={{ alignSelf: 'flex-start' }} onClick={() => setConfirming(true)}>비활성화하기</button>
        )}
      </div>
    </div>
  );
}
