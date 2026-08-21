import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui.jsx";

export default function TopBar({ session, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="brand" aria-label="BFS OS 홈">
          <img src="/bfs-wordmark.png" alt="BFS" />
          <span className="brand-badge">OS · 미션 6</span>
        </Link>
        <div className="topbar-spacer" />
        {session ? (
          <>
            <span className="topbar-user">{session.name}님</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onLogout();
                navigate("/");
              }}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            로그인
          </Button>
        )}
      </div>
    </header>
  );
}
