import { forwardRef } from 'react';
import type { Recommendation } from '../types';
import { theme } from '../styles/theme';
import { CARD_HEIGHT, CARD_WIDTH } from '../services/share';
import { baseURL } from '../services/http';
import type { Ambient } from '../services/ambient';

const SAFE = 250; // 인스타 스토리 위·아래 UI가 가리는 영역

// 어두운 그라데이션은 인스타 압축에서 계단(띠)이 생긴다. 아주 옅은 필름 그레인을 덮어 띠를 흩뜨린다.
let grainUrl: string | undefined;
function grain(): string | undefined {
  if (grainUrl || typeof document === 'undefined') return grainUrl;
  const size = 160;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() < 0.5 ? 0 : 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = Math.round(Math.random() * 14); // 최대 약 5% 불투명
  }
  ctx.putImageData(img, 0, 0);
  grainUrl = canvas.toDataURL('image/png');
  return grainUrl;
}

const TEXT_SHADOW = '0 2px 16px rgba(0, 0, 0, 0.35)';

const MUSEUM: Record<string, string> = { met: '메트로폴리탄 미술관', aic: '시카고 미술관', sponsor: 'ARTMO 협찬 작가' };

// 화면 밖에 그려 두고 PNG로 만드는 1080×1920 공유 카드.
const ShareCard = forwardRef<HTMLDivElement, { recommendation: Recommendation; ambient?: Ambient }>(function ShareCard({ recommendation, ambient }, ref) {
  const art = recommendation.artwork;
  if (!art) return null;
  const r = theme.room;
  const g = grain();
  // 배경 레이어(위→아래): 그레인 → 아래로 갈수록 어두워지는 막 → 작품 뒤 조명 → 작품 색이 번진 잔광 → 바탕색
  const layers = [
    g && `url(${g})`,
    `linear-gradient(to bottom, rgba(18,17,16,0.15) 0%, rgba(18,17,16,0.3) 40%, rgba(18,17,16,0.72) 62%, rgba(18,17,16,0.9) 85%)`,
    `radial-gradient(ellipse 45% 32% at 50% 9%, ${r.spot}, transparent 75%)`, // 천장 조명
    `radial-gradient(ellipse 70% 38% at 50% 30%, ${r.glow}, transparent 70%)`,
    ambient && `url(${ambient.backdrop})`,
  ].filter(Boolean) as string[];
  const clamp = (lines: number) => ({ display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' });
  return (
    <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}>
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH, height: CARD_HEIGHT, color: r.text, fontFamily: theme.font.sans, wordBreak: 'keep-all',
          // 작품 색이 벽에 번진 어두운 전시실. 효과는 배경에만(작품 위에는 씌우지 않는다).
          backgroundColor: r.bg,
          backgroundImage: layers.join(', '),
          backgroundSize: layers.map((l) => (l === `url(${g})` ? 'auto' : 'cover')).join(', '),
          backgroundPosition: 'center',
          display: 'flex', flexDirection: 'column', padding: `${SAFE}px 88px ${SAFE}px`, boxSizing: 'border-box',
        }}
      >
        <div style={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {/* 캔버스에 그리려면 CORS가 필요해서 서버가 대신 받아 준 이미지를 쓴다. 테두리 없이 그림자만. */}
          <img src={`${baseURL}/api/artworks/${art.id}/image`} crossOrigin="anonymous" alt=""
            style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', boxShadow: `0 36px 80px ${r.shadow}` }} />
        </div>

        {/* 미술관 벽의 작품 설명판처럼: 작품명·작가·연도 */}
        <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 8, textShadow: TEXT_SHADOW }}>
          <span style={{ fontFamily: theme.font.serif, fontSize: 40, fontWeight: 700, lineHeight: 1.3, ...clamp(2) }}>{art.title}</span>
          <span style={{ fontSize: 26, color: r.textMuted }}>{art.artist}{art.year ? ` · ${art.year}` : ''}</span>
          {art.medium && <span style={{ fontSize: 22, color: r.textMuted, letterSpacing: 0.5 }}>{art.medium}</span>}
        </div>
        <span style={{ marginTop: 44, width: 80, height: 3, background: r.accent }} />

        <p style={{ margin: '44px 0 0', fontFamily: theme.font.serif, fontSize: 50, lineHeight: 1.5, fontWeight: 600, textShadow: TEXT_SHADOW, ...clamp(3) }}>
          <span style={{ color: r.accent }}>“</span>{recommendation.inputText}<span style={{ color: r.accent }}>”</span>
        </p>
        <p style={{ margin: '24px 0 0', fontSize: 28, lineHeight: 1.65, color: r.textMuted, ...clamp(3) }}>{recommendation.interpretation}</p>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: theme.font.serif, fontSize: 36, fontWeight: 700, letterSpacing: 12, color: r.accent }}>ARTMO</span>
          <span style={{ fontSize: 24, color: r.textMuted }}>{MUSEUM[art.source] ?? ''}{art.isPublicDomain ? ' · 퍼블릭 도메인' : ''}</span>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
