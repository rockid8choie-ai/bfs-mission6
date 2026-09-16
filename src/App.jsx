import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar.jsx";
import { getSession, logout } from "./lib/auth.js";
import Done from "./pages/Done.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import WorkDetail from "./pages/WorkDetail.jsx";
import WorkList from "./pages/WorkList.jsx";
import WorkNew from "./pages/WorkNew.jsx";
import { EmptyState } from "./components/ui.jsx";

// 로그인해야 들어갈 수 있는 화면 가드
function RequireAuth({ session, children }) {
  const location = useLocation();
  if (!session)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(getSession);

  const handleLogin = (session) => setSession(session);
  const handleLogout = () => {
    logout();
    setSession(null);
  };

  return (
    <>
      <TopBar session={session} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing session={session} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/works"
          element={
            <RequireAuth session={session}>
              <WorkList />
            </RequireAuth>
          }
        />
        <Route
          path="/works/new"
          element={
            <RequireAuth session={session}>
              <WorkNew />
            </RequireAuth>
          }
        />
        <Route
          path="/works/:id"
          element={
            <RequireAuth session={session}>
              <WorkDetail />
            </RequireAuth>
          }
        />
        <Route path="/done" element={<Done />} />
        <Route
          path="*"
          element={
            <main className="container page">
              <EmptyState
                emoji="🧭"
                title="없는 페이지예요"
                sub="주소를 다시 확인해 주세요."
              />
            </main>
          }
        />
      </Routes>
    </>
  );
}
