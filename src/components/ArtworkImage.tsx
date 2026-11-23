import { useState } from 'react';
import type { Artwork } from '../types';

interface Props {
  artwork: Pick<Artwork, 'imageUrl' | 'title' | 'artist'>;
  className?: string;
  loading?: 'lazy' | 'eager';
}

// 화면 표시용. 미술관 이미지 서버가 CORS 헤더를 주지 않으므로 crossOrigin을 붙이지 않는다(붙이면 로드 실패).
// 공유 카드 PNG는 서버의 /api/artworks/:id/image를 거쳐 그린다(ShareCard).
export default function ArtworkImage({ artwork, className, loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={className} role="img" aria-label={`${artwork.title}, ${artwork.artist} (이미지를 불러오지 못함)`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4 / 5' }}>
        <span className="muted" style={{ fontSize: 13 }}>이미지를 불러오지 못했어요</span>
      </div>
    );
  }
  return (
    <img
      className={className}
      src={artwork.imageUrl}
      alt={`${artwork.title}, ${artwork.artist}`}
      referrerPolicy="no-referrer"
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
