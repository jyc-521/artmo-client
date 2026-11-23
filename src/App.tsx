import { HashRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import AuthCallbackHandler from './components/AuthCallbackHandler';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import NotFound from './components/NotFound';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import SponsorPage from './pages/SponsorPage';
import AdminPage from './pages/AdminPage';
import AdminSponsorshipsPage from './pages/AdminSponsorshipsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  // 외부 인증은 해시 없는 /auth/callback으로 돌아오므로 HashRouter보다 먼저 처리한다.
  if (window.location.pathname === '/auth/callback') return <AuthCallbackHandler />;
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <GlobalStyles />
          <div className="app">
            <Header />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/result/:id" element={<ResultPage />} />
                <Route path="/artworks" element={<GalleryPage />} />
                <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
                <Route path="/popular" element={<GalleryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/me" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
                <Route path="/sponsor" element={<ProtectedRoute><SponsorPage /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                <Route path="/admin/sponsorships" element={<AdminRoute><AdminSponsorshipsPage /></AdminRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
          <ToastContainer position="bottom-center" autoClose={3000} theme="light" />
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
