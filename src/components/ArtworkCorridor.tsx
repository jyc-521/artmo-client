import { useState, type CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { artworkService } from '../services/artworkApi';
import ArtworkImage from './ArtworkImage';

const COUNT = 12;

// 문 너머 회전 전시대: 실제 소장 작품이 원기둥 둘레에 걸려 한 방향으로 천천히 돈다.
// 회전은 CSS 애니메이션(GPU)으로만 처리해 매 프레임 계산이 없다. 장식이라 화면 읽기 프로그램에는 숨긴다.
export default function ArtworkCorridor() {
  // 들어올 때마다 다른 작품이 걸리도록 시작 위치를 바꾼다.
  const [offset] = useState(() => Math.floor(Math.random() * 400));
  const { data } = useQuery({
    queryKey: ['corridor', offset],
    queryFn: async () => {
      const list = await artworkService.list({ limit: COUNT, offset });
      return list.length >= 6 ? list : artworkService.list({ limit: COUNT });
    },
    staleTime: Infinity,
  });
  if (!data || data.length === 0) return <div className="corridor placeholder" aria-hidden="true" />;
  return (
    <div className="corridor" aria-hidden="true">
      <div className="carousel" style={{ '--n': data.length } as CSSProperties}>
        {data.map((art, i) => (
          <figure className="carousel-item" key={art.id} style={{ '--i': i } as CSSProperties}>
            <ArtworkImage artwork={art} loading="eager" />
          </figure>
        ))}
      </div>
    </div>
  );
}
