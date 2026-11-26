import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { artworkService } from '../services/artworkApi';
import ArtworkImage from './ArtworkImage';

// 입구 로비의 복도: 실제 소장 작품이 벽에 걸린 것처럼 천천히 흘러간다. 장식이라 화면 읽기 프로그램에는 숨긴다.
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
  if (!data || data.length === 0) return <div className="corridor placeholder" aria-hidden="true" />;
  const row = [...data, ...data]; // 끊김 없이 이어지도록 두 번
  return (
    <div className="corridor" aria-hidden="true">
      <div className="corridor-track">
        {row.map((art, i) => (
          <figure className="corridor-item" key={`${art.id}-${i}`}>
            <ArtworkImage artwork={art} />
          </figure>
        ))}
      </div>
    </div>
  );
}
