export default function Loading({ label = '불러오는 중이에요' }: { label?: string }) {
  return (
    <div className="center" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="muted">{label}</span>
    </div>
  );
}
