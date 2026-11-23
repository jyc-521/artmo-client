import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="ARTMO 홈">ARTMO</Link>
        <nav className="topnav" aria-label="주 메뉴">
          <NavLink to="/" end>기분 쓰기</NavLink>
          <NavLink to="/artworks">갤러리</NavLink>
          <NavLink to="/sponsor">작품 협찬</NavLink>
          {isAdmin && <NavLink to="/admin">관리자</NavLink>}
          {isAuthenticated
            ? <NavLink to="/me">마이페이지</NavLink>
            : <Link to="/login" className="btn secondary small">로그인</Link>}
        </nav>
        {!isAuthenticated && <Link to="/login" className="header-login btn ghost small">로그인</Link>}
      </div>
    </header>
  );
}
