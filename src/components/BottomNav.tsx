import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="하단 메뉴">
      <NavLink to="/" end>홈</NavLink>
      <NavLink to="/artworks">갤러리</NavLink>
      <NavLink to="/me">마이</NavLink>
    </nav>
  );
}
