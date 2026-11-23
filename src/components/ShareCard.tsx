import { forwardRef } from 'react';
import type { Recommendation } from '../types';
import { theme } from '../styles/theme';
import { CARD_HEIGHT, CARD_WIDTH } from '../services/share';

const SAFE = 250; // 인스타 스토리 위·아래 UI가 가리는 영역

const MUSEUM: Record<string, string> = { met: '메트로폴리탄 미술관', aic: '시카고 미술관', sponsor: 'ARTMO 협찬 작가' };

// 화면 밖에 그려 두고 PNG로 만드는 1080×1920 공유 카드.
const ShareCard = forwardRef<HTMLDivElement, { recommendation: Recommendation }>(function ShareCard({ recommendation }, ref) {
  const art = recommendation.artwork;
  if (!art) return null;
  const c = theme.color;
  return (
    <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}>
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH, height: CARD_HEIGHT, background: c.bg, color: c.text, fontFamily: theme.font.sans, wordBreak: 'keep-all',
          display: 'flex', flexDirection: 'column', padding: `${SAFE}px 96px ${SAFE - 40}px`, boxSizing: 'border-box', gap: 44,
        }}
      >
        <div style={{ background: c.surface, padding: 24, boxShadow: '0 2px 8px rgba(43,39,36,0.12)' }}>
          <img src={art.imageUrl} crossOrigin="anonymous" alt=""
            style={{ width: '100%', height: 760, objectFit: 'contain', background: c.surface, display: 'block' }} />
        </div>
        <p style={{ margin: 0, fontFamily: theme.font.serif, fontSize: 50, lineHeight: 1.45, fontWeight: 600 }}>
          “{recommendation.inputText}”
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: theme.font.serif, fontSize: 38, fontWeight: 700, lineHeight: 1.3 }}>{art.title}</span>
          <span style={{ fontSize: 28, color: c.textMuted }}>{art.artist}{art.year ? ` · ${art.year}` : ''}</span>
        </div>
        <p style={{ margin: 0, fontSize: 30, lineHeight: 1.6, color: c.text, flex: 1, overflow: 'hidden' }}>{recommendation.interpretation}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: theme.font.serif, fontSize: 34, fontWeight: 700, letterSpacing: 8, color: c.accent }}>ARTMO</span>
          <span style={{ fontSize: 22, color: c.textMuted }}>{MUSEUM[art.source] ?? ''}{art.isPublicDomain ? ' · 퍼블릭 도메인' : ''}</span>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
