import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { artworkService } from '../services/artworkApi';
import ArtworkImage from './ArtworkImage';

const SPEED = 28; // px/초
const CURVE = 38; // 화면 가장자리에서 작품이 돌아가는 각도(도)

// 입구 로비의 둥근 벽: 실제 소장 작품이 휘어진 벽을 따라 천천히 흘러간다.
// 가운데 작품은 정면, 양옆은 벽이 감싸듯 안쪽으로 돈다. 장식이라 화면 읽기 프로그램에는 숨긴다.
export default function ArtworkCorridor() {
  // 들어올 때마다 다른 작품이 걸리도록 시작 위치를 바꾼다.
  const [offset] = useState(() => Math.floor(Math.random() * 400));
  const { data } = useQuery({
    queryKey: ['corridor', offset],
    queryFn: async () => {
      const list = await artworkService.list({ limit: 12, offset });
      return list.length >= 6 ? list : artworkService.list({ limit: 12 });
    },
    staleTime: Infinity,
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || !data?.length) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0;
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!still && !paused.current) {
        x -= SPEED * dt;
        const half = track.scrollWidth / 2;
        if (half > 0 && -x >= half) x += half;
      }
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      const w = wrap.clientWidth;
      for (const el of Array.from(track.children) as HTMLElement[]) {
        const center = el.offsetLeft + el.offsetWidth / 2 + x;
        const d = Math.max(-1.4, Math.min(1.4, (center - w / 2) / (w / 2)));
        // 오목한 벽: 양옆 작품은 안쪽을 향해 돌고 조금 뒤로 물러난다.
        el.style.transform = `rotateY(${-d * CURVE}deg) translateZ(${-Math.abs(d) * 60}px)`;
        el.style.opacity = String(1 - Math.max(0, Math.abs(d) - 0.9) * 1.6);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [data]);

  if (!data || data.length === 0) return <div className="corridor placeholder" aria-hidden="true" />;
  const row = [...data, ...data]; // 끊김 없이 이어지도록 두 번
  return (
    <div className="corridor" aria-hidden="true" ref={wrapRef}
      onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
      <div className="corridor-track" ref={trackRef}>
        {row.map((art, i) => (
          <figure className="corridor-item" key={`${art.id}-${i}`}>
            <ArtworkImage artwork={art} />
          </figure>
        ))}
      </div>
    </div>
  );
}
