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
  font: {
    serif: '"Noto Serif KR", "Nanum Myeongjo", Georgia, serif',
    sans: '"Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif',
  },
  radius: { sm: '4px', md: '10px', pill: '999px' },
  maxWidth: '720px',
  wideWidth: '1120px',
} as const;
