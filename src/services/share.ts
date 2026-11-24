import { toPng } from 'html-to-image';

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

export function cardFileName(title: string): string {
  const safe = title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 40) || 'card';
  return `artmo-${safe}.png`;
}

// 카드에 쓰는 웹 글꼴 CSS. index.html의 <link>와 같은 주소여야 브라우저 캐시를 그대로 쓴다.
const FONT_CSS = [
  'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
];
const SERIF_WEIGHTS = new Set(['600', '700']); // ShareCard에서 쓰는 명조 굵기

type Range = [number, number];
function parseRanges(value: string | undefined): Range[] {
  if (!value) return [[0, 0x10ffff]];
  return value.split(',').map((part) => {
    const [a = '', b] = part.trim().replace(/^U\+/i, '').split('-');
    if (a.includes('?')) return [parseInt(a.replace(/\?/g, '0'), 16), parseInt(a.replace(/\?/g, 'F'), 16)] as Range;
    const start = parseInt(a, 16);
    return [start, b ? parseInt(b, 16) : start] as Range;
  });
}

const cssCache = new Map<string, Promise<string>>();
const fontCache = new Map<string, Promise<string>>();
const fetchText = (url: string) => cssCache.get(url) ?? cssCache.set(url, fetch(url).then((r) => r.text())).get(url)!;
function fetchDataUrl(url: string): Promise<string> {
  const cached = fontCache.get(url);
  if (cached) return cached;
  const p = fetch(url).then((r) => r.blob()).then((blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  }));
  fontCache.set(url, p);
  return p;
}

// html-to-image는 기본으로 페이지의 글꼴 파일을 전부(한글 글꼴은 수백 개 조각, 20MB 넘게) 내려받아 넣는다.
// 카드에 실제로 나오는 글자가 들어 있는 조각만 골라 넣어서 몇 개 파일로 줄인다.
async function cardFontCss(node: HTMLElement): Promise<string> {
  const used = new Set<number>();
  for (const ch of node.textContent ?? '') used.add(ch.codePointAt(0)!);
  const codes = [...used];
  const faces: string[] = [];
  for (const cssUrl of FONT_CSS) {
    const css = await fetchText(cssUrl);
    for (const block of css.match(/@font-face\s*{[^}]*}/g) ?? []) {
      const family = /font-family:\s*['"]?([^;'"]+)/.exec(block)?.[1] ?? '';
      const weight = /font-weight:\s*([^;]+)/.exec(block)?.[1]?.trim() ?? '';
      if (family.includes('Noto Serif KR') && !SERIF_WEIGHTS.has(weight)) continue;
      const ranges = parseRanges(/unicode-range:\s*([^;]+)/.exec(block)?.[1]);
      if (!codes.some((c) => ranges.some(([a, b]) => c >= a && c <= b))) continue;
      const src = /url\(([^)]+)\)/.exec(block)?.[1]?.replace(/['"]/g, '');
      if (!src) continue;
      const abs = new URL(src, cssUrl).toString();
      faces.push(block.replace(/src:[^;]+;/, `src: url(${await fetchDataUrl(abs)});`));
    }
  }
  return faces.join('\n');
}

// 숨겨 둔 1080×1920 카드 노드를 PNG 파일로 만든다. 작품 이미지는 서버가 대신 받아 준 주소(CORS 허용)로 그린다.
export async function renderCard(node: HTMLElement, fileName: string): Promise<File> {
  let fontEmbedCSS: string | undefined;
  try {
    fontEmbedCSS = await cardFontCss(node);
  } catch {
    fontEmbedCSS = undefined; // 글꼴을 못 받으면 기본 동작(전체 임베드)으로 돌아간다
  }
  const dataUrl = await toPng(node, { width: CARD_WIDTH, height: CARD_HEIGHT, pixelRatio: 1, fontEmbedCSS });
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
