import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { artworkService } from '../services/artworkApi';
import ArtworkTile from '../components/ArtworkTile';
import Loading from '../components/Loading';
import { messageOf } from '../utils/errorMessage';

const PAGE = 24;

export default function GalleryPage() {
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'popular' ? 'popular' : 'all';
  const tag = params.get('tag') ?? '';
  const tags = useQuery({ queryKey: ['tags'], queryFn: artworkService.tags, staleTime: Infinity });
  const all = useInfiniteQuery({
    queryKey: ['artworks', tag],
    queryFn: ({ pageParam }) => artworkService.list({ tag: tag || undefined, limit: PAGE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => (last.length < PAGE ? undefined : pages.length * PAGE),
    enabled: view === 'all',
  });
  const popular = useQuery({ queryKey: ['artworks', 'popular'], queryFn: () => artworkService.popular(24), enabled: view === 'popular' });

  const set = (next: Record<string, string>) => setParams({ ...Object.fromEntries(params), ...next }, { replace: true });
  const items = view === 'all' ? all.data?.pages.flat() ?? [] : popular.data ?? [];
  const active = view === 'all' ? all : popular;

  return (
    <section className="page wide">
      <h1 className="sr-only">작품 갤러리</h1>
      <div className="tabs" role="tablist" aria-label="갤러리 보기">
        <button type="button" role="tab" className="tab" aria-selected={view === 'all'} onClick={() => set({ view: 'all' })}>전체 작품</button>
        <button type="button" role="tab" className="tab" aria-selected={view === 'popular'} onClick={() => set({ view: 'popular' })}>인기 작품</button>
      </div>
      {view === 'all' && (
        <div className="chips" role="group" aria-label="감정 태그로 보기" style={{ marginBottom: 20 }}>
          <button type="button" className="chip" aria-pressed={!tag} onClick={() => set({ tag: '' })}>전체</button>
          {tags.data?.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => set({ tag: t })}>#{t}</button>
          ))}
        </div>
      )}
      {active.isPending ? <Loading /> : active.isError ? (
        <p role="alert">{messageOf(active.error)}</p>
      ) : items.length === 0 ? (
        <p className="muted center">아직 작품이 없어요.</p>
      ) : (
        <div className="grid">{items.map((a) => <ArtworkTile key={a.id} artwork={a} />)}</div>
      )}
      {view === 'all' && all.hasNextPage && (
        <div className="center">
          <button type="button" className="btn secondary" onClick={() => void all.fetchNextPage()} disabled={all.isFetchingNextPage}>
            {all.isFetchingNextPage ? '불러오는 중…' : '더 보기'}
          </button>
        </div>
      )}
    </section>
  );
}
