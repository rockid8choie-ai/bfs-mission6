import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  EmptyState,
  Spinner,
  StatusBadge,
  Toast,
} from "../components/ui.jsx";
import {
  STATUS,
  categoryOf,
  formatDate,
  getWork,
  removeWork,
  updateStatus,
} from "../lib/storage.js";

export default function WorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(undefined); // undefined = 로딩, null = 없음
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getWork(id).then(setWork);
  }, [id]);

  if (work === undefined)
    return (
      <main className="container page">
        <Spinner />
      </main>
    );

  if (work === null)
    return (
      <main className="container page">
        <EmptyState
          emoji="🫥"
          title="작업을 찾을 수 없어요"
          sub="삭제되었거나 잘못된 주소예요."
        />
        <div style={{ textAlign: "center" }}>
          <Link to="/works">
            <Button variant="ghost">목록으로</Button>
          </Link>
        </div>
      </main>
    );

  const cat = categoryOf(work.category);
  const stepIdx = STATUS.indexOf(work.status);
  const nextStatus = STATUS[stepIdx + 1];

  const advance = async () => {
    setBusy(true);
    const updated = await updateStatus(work.id, nextStatus);
    setWork(updated);
    setToast(`상태를 '${nextStatus}'로 변경했어요.`);
    setBusy(false);
  };

  const remove = async () => {
    if (!window.confirm("이 작업을 삭제할까요?")) return;
    setBusy(true);
    await removeWork(work.id);
    navigate("/works");
  };

  return (
    <main className="container page" style={{ maxWidth: 560 }}>
      <div className="page-head">
        <Link to="/works" className="back-link">← 목록</Link>
        <h2 style={{ fontSize: 20 }}>{work.title}</h2>
        <StatusBadge status={work.status} />
      </div>

      <div className="steps" aria-label="진행 단계">
        {STATUS.map((s, i) => (
          <div
            key={s}
            className={`step${i < stepIdx ? " done" : i === stepIdx ? " now" : ""}`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="card-white">
        <div className="detail-rows">
          <div className="detail-row">
            <span className="k">분류</span>
            <span className="v">{cat.emoji} {cat.label}</span>
          </div>
          <div className="detail-row">
            <span className="k">위치</span>
            <span className="v">{work.location}</span>
          </div>
          <div className="detail-row">
            <span className="k">우선순위</span>
            <span className="v">
              {work.priority === "긴급" ? "🚨 긴급" : "보통"}
            </span>
          </div>
          <div className="detail-row">
            <span className="k">접수 시각</span>
            <span className="v">{formatDate(work.createdAt)}</span>
          </div>
          {work.desc && (
            <div className="detail-row">
              <span className="k">상세</span>
              <span className="v">{work.desc}</span>
            </div>
          )}
        </div>
      </div>

      <div className="detail-actions">
        {nextStatus ? (
          <Button onClick={advance} disabled={busy}>
            {busy ? "처리 중…" : `'${nextStatus}' 처리하기 →`}
          </Button>
        ) : (
          <Button variant="ghost" disabled>
            ✅ 완료된 작업이에요
          </Button>
        )}
        <Button variant="danger" onClick={remove} disabled={busy}>
          삭제
        </Button>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </main>
  );
}
