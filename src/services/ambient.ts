import { baseURL } from './http';

// 작품의 색을 배경으로 번지게 하는 "잔광". 작품 이미지 자체에는 아무것도 씌우지 않고,
// 작게 줄여 흐린 복사본을 배경에만 깐다. 캔버스로 픽셀을 읽어야 해서 CORS가 되는 서버 경로를 쓴다.
export interface Ambient {
  backdrop: string; // 흐리게 만든 배경 이미지(data URL)
  tint: string; // 작품의 평균 색 rgb(...)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('ambient image failed'));
    img.src = src;
  });
}

export async function loadAmbient(artworkId: number): Promise<Ambient> {
  const img = await loadImage(`${baseURL}/api/artworks/${artworkId}/image`);

  // 1) 아주 작게 줄였다가(색 덩어리만 남김)
  const tiny = document.createElement('canvas');
  tiny.width = 12;
  tiny.height = 20;
  const t = tiny.getContext('2d');
  if (!t) throw new Error('canvas unavailable');
  const scale = Math.max(tiny.width / img.naturalWidth, tiny.height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  t.drawImage(img, (tiny.width - w) / 2, (tiny.height - h) / 2, w, h);

  // 평균 색
  const px = t.getImageData(0, 0, tiny.width, tiny.height).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < px.length; i += 4) { r += px[i]!; g += px[i + 1]!; b += px[i + 2]!; }
  const n = px.length / 4;
  const tint = `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;

  // 2) 단계적으로 키우면서 부드럽게 번지게 한다(한 번에 키우면 색 덩어리 경계가 띠처럼 보인다).
  let src: HTMLCanvasElement = tiny;
  for (const [w2, h2, blur] of [[48, 80, 2], [180, 320, 12]] as const) {
    const next = document.createElement('canvas');
    next.width = w2;
    next.height = h2;
    const ctx = next.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if ('filter' in ctx) ctx.filter = `blur(${blur}px) saturate(1.15)`;
    // 가장자리가 흐려지며 어두워지지 않도록 조금 크게 그린다.
    const pad = blur * 3;
    ctx.drawImage(src, -pad, -pad, w2 + pad * 2, h2 + pad * 2);
    src = next;
  }
  const big = src;

  return { backdrop: big.toDataURL('image/jpeg', 0.85), tint };
}
