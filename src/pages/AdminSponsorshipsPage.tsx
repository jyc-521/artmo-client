import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { sponsorshipService } from '../services/sponsorshipApi';
import Loading from '../components/Loading';
import ArtworkImage from '../components/ArtworkImage';
import { messageOf } from '../utils/errorMessage';
import type { Sponsorship } from '../types';

const FILTERS: { key: Sponsorship['status']; label: string }[] = [
  { key: 'pending', label: '심사 대기' },
  { key: 'approved', label: '승인' },
  { key: 'rejected', label: '거절' },
];

export default function AdminSponsorshipsPage() {
  const [status, setStatus] = useState<Sponsorship['status']>('pending');
  const queryClient = useQueryClient();
  const q = useQuery({ queryKey: ['admin-sponsorships', status], queryFn: () => sponsorshipService.list(status) });
  const done = (msg: string) => {
    void queryClient.invalidateQueries({ queryKey: ['admin-sponsorships'] });
    void queryClient.invalidateQueries({ queryKey: ['artworks'] });
    toast.success(msg);
  };
  const approve = useMutation({ mutationFn: sponsorshipService.approve, onSuccess: () => done('승인했어요. 갤러리에 추가됐어요.'), onError: (e) => toast.error(messageOf(e)) });
  const reject = useMutation({ mutationFn: sponsorshipService.reject, onSuccess: () => done('거절했어요.'), onError: (e) => toast.error(messageOf(e)) });

  return (
    <section className="page wide stack">
      <div className="row-between">
        <h1 className="h1" style={{ fontSize: 28 }}>협찬 심사</h1>
        <Link to="/admin">관리자 홈</Link>
      </div>
      <div className="chips" role="group" aria-label="상태">
        {FILTERS.map((f) => <button key={f.key} type="button" className="chip" aria-pressed={status === f.key} onClick={() => setStatus(f.key)}>{f.label}</button>)}
      </div>
      {q.isPending ? <Loading /> : q.isError ? <p role="alert">{messageOf(q.error)}</p> : q.data.length === 0 ? (
        <p className="muted">해당하는 신청이 없어요.</p>
      ) : (
        <ul className="list">
          {q.data.map((s) => (
            <li key={s.id} className="card" style={{ display: 'grid', gridTemplateColumns: 'minmax(96px, 160px) 1fr', gap: 20 }}>
              <ArtworkImage artwork={{ imageUrl: s.imageUrl, title: s.title, artist: s.artistName }} className="tile-img" />
              <div className="stack tight">
                <strong className="serif" style={{ fontSize: 18 }}>{s.title}</strong>
                <span className="muted">{s.artistName} · {new Date(s.createdAt).toLocaleDateString('ko-KR')}</span>
                {s.description && <p style={{ margin: 0 }}>{s.description}</p>}
                <span style={{ fontSize: 13 }}>굿즈 동의: {s.goodsConsent ? '예' : '아니오'}</span>
                {s.status === 'pending' && (
                  <div className="btn-row" style={{ marginTop: 8, maxWidth: 320 }}>
                    <button type="button" className="btn secondary small" onClick={() => reject.mutate(s.id)} disabled={reject.isPending || approve.isPending}>거절</button>
                    <button type="button" className="btn small" onClick={() => approve.mutate(s.id)} disabled={reject.isPending || approve.isPending}>승인</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
