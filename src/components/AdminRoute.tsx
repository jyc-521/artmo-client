import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  return (
    <ProtectedRoute>
      {isAdmin ? children : (
        <section className="page stack">
          <h1 className="h2">관리자 권한이 필요해요</h1>
          <Link to="/me">마이페이지로 돌아가기</Link>
        </section>
      )}
    </ProtectedRoute>
  );
}
