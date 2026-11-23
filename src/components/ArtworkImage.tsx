import { useState } from 'react';
import type { Artwork } from '../types';

interface Props {
  artwork: Pick<Artwork, 'imageUrl' | 'title' | 'artist'>;
  className?: string;
  loading?: 'lazy' | 'eager';
}

// crossOrigin은 카드 이미지(PNG) 생성 때 캔버스에 그릴 수 있게 하려는 설정이다.
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
      crossOrigin="anonymous"
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
