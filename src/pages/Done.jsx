import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui.jsx";

export default function Done() {
  const { state } = useLocation();

  return (
    <main className="container done-wrap">
      <div className="circle" aria-hidden>🎉</div>
      <h2>접수가 완료됐어요</h2>
      <p>
        {state?.title ? (
          <>
            <strong>“{state.title}”</strong> 작업이 등록됐어요.
            <br />
          </>
        ) : null}
        담당자 배정 후 진행 상황을 목록에서 확인할 수 있어요.
      </p>
      <div className="hero-actions">
        {state?.workId && (
          <Link to={`/works/${state.workId}`}>
            <Button>접수 내역 보기</Button>
          </Link>
        )}
        <Link to="/works">
          <Button variant="ghost">목록으로</Button>
        </Link>
      </div>
    </main>
  );
}
