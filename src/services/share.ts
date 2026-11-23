import { toPng } from 'html-to-image';

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

export function cardFileName(title: string): string {
  const safe = title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 40) || 'card';
  return `artmo-${safe}.png`;
}

// 숨겨 둔 1080×1920 카드 노드를 PNG 파일로 만든다. 작품 이미지는 crossOrigin으로 불러와야 캔버스에 그려진다.
export async function renderCard(node: HTMLElement, fileName: string): Promise<File> {
  const dataUrl = await toPng(node, { width: CARD_WIDTH, height: CARD_HEIGHT, pixelRatio: 1, cacheBust: true });
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: 'image/png' });
}

export function canShareFile(file: File): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
}

export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// 기기 공유가 되면 공유 메뉴(인스타 스토리 포함), 안 되면 다운로드. 사용자가 공유 창을 닫으면 'cancelled'.
export async function shareOrDownload(file: File): Promise<'shared' | 'downloaded' | 'cancelled'> {
  if (canShareFile(file)) {
    try {
      await navigator.share({ files: [file], title: 'ARTMO' });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    }
  }
  downloadFile(file);
  return 'downloaded';
}
