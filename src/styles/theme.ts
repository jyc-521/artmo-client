// 색·글꼴·간격 값은 여기에만 둔다 (docs/design.md).
export const theme = {
  color: {
    bg: '#F6F3EE',
    surface: '#FFFFFF',
    surfaceMuted: '#EDE8E0',
    text: '#2B2724',
    textMuted: '#6B635B',
    line: '#D9D2C7',
    accent: '#1F3A5F',
    accentText: '#FFFFFF',
    danger: '#9B2C2C',
    imagePlaceholder: '#DDD6CB',
  },
  // 어두운 전시실: 결과 화면과 공유 카드. 작품만 조명을 받은 것처럼 보이게 한다.
  room: {
    bg: '#121110',
    surface: '#1C1A18',
    text: '#EEE7DC',
    textMuted: '#A39A8F',
    line: '#34302B',
    accent: '#F2B740',
    accentText: '#121110',
    accentSoft: 'rgba(242, 183, 64, 0.5)',
    glow: 'rgba(255, 236, 200, 0.10)',
    spot: 'rgba(255, 238, 205, 0.16)', // 천장 조명
    shadow: 'rgba(0, 0, 0, 0.6)',
  },
  font: {
    serif: '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif',
    sans: '"Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif',
  },
  radius: { sm: '4px', md: '10px', pill: '999px' },
  maxWidth: '720px',
  wideWidth: '1120px',
} as const;
