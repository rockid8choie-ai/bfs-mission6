import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Button,
  EmptyState,
  Spinner,
  StatusBadge,
  Toast,
} from "../components/ui.jsx";
import { checkoutPayment } from "../lib/api.js";
import { getSession } from "../lib/auth.js";
import {
  STATUS,
  categoryOf,
  formatDate,
  getWork,
  removeWork,
  updateStatus,
} from "../lib/storage.js";
import { TOSS_CLIENT_KEY, loadTossPayments } from "../lib/toss.js";

export default function WorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [work, setWork] = useState(undefined); // undefined = 로딩, null = 없음
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getWork(id)
      .then(setWork)
      .catch(() => setWork(null));
  }, [id]);

  // 토스 failUrl로 돌아온 경우 (결제창에서 취소·실패)
  useEffect(() => {
    if (params.get("payfail")) setToast("결제가 완료되지 않았어요. 다시 시도할 수 있어요.");
  }, [params]);

  // 우선처리 결제 — 주문 생성(서버가 금액 확정) 후 토스 결제창으로
  const payFastTrack = async () => {
    setPaying(true);
    try {
      const order = await checkoutPayment(work.id);
      const toss = await loadTossPayments();
      const payment = toss(TOSS_CLIENT_KEY).payment({
        customerKey: getSession()?.email ?? "guest",
      });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: order.amount },
        orderId: order.orderId,
        orderName: order.orderName,
        successUrl: `${window.location.origin}/pay/complete`,
        failUrl: `${window.location.origin}/works/${work.id}?payfail=1`,
        card: { useEscrow: false, flowMode: "DEFAULT", useCardPoint: false, useAppCardOnly: false },
      });
    } catch (error) {
      // 결제창을 그냥 닫은 경우(사용자 취소)는 조용히 복귀
      const msg = error?.message ?? "";
      if (msg && !msg.includes("취소")) setToast(msg);
      setPaying(false);
    }
  };

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
    try {
      const updated = await updateStatus(work.id, nextStatus);
      setWork(updated);
      setToast(`상태를 '${nextStatus}'로 변경했어요.`);
    } catch (error) {
      setToast(error?.message || "상태 변경에 실패했어요.");
    }
    setBusy(false);
  };

  const remove = async () => {
    if (!window.confirm("이 작업을 삭제할까요?")) return;
    setBusy(true);
    try {
      await removeWork(work.id);
      navigate("/works");
    } catch (error) {
      setToast(error?.message || "삭제에 실패했어요.");
      setBusy(false);
    }
  };

  return (
    <main className="container page" style={{ maxWidth: 560 }}>
      <div className="page-head">
        <Link to="/works" className="back-link">← 목록</Link>
        <h2 style={{ fontSize: 20 }}>
          {work.fastTrack && "🚀 "}
          {work.title}
        </h2>
        <StatusBadge status={work.status} />
      </div>

      {work.fastTrack ? (
        <p className="page-sub">🚀 우선처리 적용 — 배정 대기열 최상단에서 처리돼요.</p>
      ) : (
        work.status !== "완료" && (
          <div
            className="card-white"
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🚀 우선처리로 올리기</div>
              <div style={{ fontSize: 12.5, color: "var(--gray-500, #6b7684)" }}>
                9,900원 — 배정 대기열 최상단, 담당자 우선 배정
              </div>
            </div>
            <Button size="sm" onClick={payFastTrack} disabled={paying}>
              {paying ? "결제창 여는 중…" : "카드로 결제"}
            </Button>
          </div>
        )
      )}

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
