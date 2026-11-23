import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { authService } from '../services/authApi';
import { artworkService } from '../services/artworkApi';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import { messageOf } from '../utils/errorMessage';
import type { UserType } from '../types';

export default function AdminPage() {
  return (
    <section className="page wide stack">
      <div className="row-between">
        <h1 className="h1" style={{ fontSize: 28 }}>관리자</h1>
        <Link to="/admin/sponsorships" className="btn small">협찬 심사</Link>
      </div>
      <Users />
      <Artworks />
    </section>
  );
}

function Users() {
  const { user: me } = useAuth();
  const queryClient = useQueryClient();
  const q = useQuery({ queryKey: ['admin-users'], queryFn: authService.listUsers });
  const change = useMutation({
    mutationFn: ({ id, type }: { id: string; type: UserType }) => authService.changeUserType(id, type),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('역할을 바꿨어요.'); },
    onError: (e) => toast.error(messageOf(e)),
  });
  return (
    <section className="card stack">
      <h2 className="h2">사용자</h2>
      {q.isPending ? <Loading /> : q.isError ? <p role="alert">{messageOf(q.error)}</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>이름</th><th>이메일</th><th>상태</th><th>역할</th></tr></thead>
            <tbody>
              {q.data.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}{u.id === me?.id ? ' (나)' : ''}</td>
                  <td>{u.email || '-'}</td>
                  <td>{u.isActive ? '활성' : '비활성'}</td>
                  <td>
                    <label className="sr-only" htmlFor={`role-${u.id}`}>{u.name} 역할</label>
                    <select id={`role-${u.id}`} className="input" style={{ padding: '8px 10px', minHeight: 44 }} value={u.userType}
                      disabled={!u.isActive || change.isPending}
                      onChange={(e) => change.mutate({ id: u.id, type: e.target.value as UserType })}>
                      <option value="user">일반</option>
                      <option value="admin">관리자</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Artworks() {
  const queryClient = useQueryClient();
  const q = useQuery({ queryKey: ['admin-artworks'], queryFn: () => artworkService.list({ limit: 60 }) });
  const hide = useMutation({
    mutationFn: (id: number) => artworkService.update(id, { isVisible: false }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      void queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast.success('작품을 숨겼어요. 추천 후보에서도 빠져요.');
    },
    onError: (e) => toast.error(messageOf(e)),
  });
  return (
    <section className="card stack">
      <h2 className="h2">작품 (최근 60점)</h2>
      <p className="muted" style={{ margin: 0, fontSize: 14 }}>이미지가 깨지거나 분위기와 맞지 않는 작품은 숨기세요.</p>
      {q.isPending ? <Loading /> : q.isError ? <p role="alert">{messageOf(q.error)}</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>작품</th><th>작가</th><th>감정 태그</th><th aria-label="관리" /></tr></thead>
            <tbody>
              {q.data.map((a) => (
                <tr key={a.id}>
                  <td><Link to={`/artworks/${a.id}`}>{a.title}</Link></td>
                  <td>{a.artist}</td>
                  <td>{a.emotionTags.map((t) => `#${t}`).join(' ')}</td>
                  <td><button type="button" className="btn ghost small" onClick={() => hide.mutate(a.id)} disabled={hide.isPending}>숨기기</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
