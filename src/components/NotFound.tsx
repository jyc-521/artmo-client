import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page center">
      <h1 className="h2">찾는 페이지가 없어요</h1>
      <Link to="/" className="btn">홈으로</Link>
    </section>
  );
}
