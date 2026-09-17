import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Spinner } from "../components/ui.jsx";
import { confirmPayment } from "../lib/api.js";

// 토스 successUrl 랜딩 — 서버 최종 승인(금액 대조) 후 결과를 보여준다.
export default function PayComplete() {
  const [params] = useSearchParams();
  const [state, setState] = useState("working"); // working | ok | fail
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const ran = useRef(false);

  const orderId = params.get("orderId") ?? "";
  const paymentKey = params.get("paymentKey") ?? "";
  const amount = Number(params.get("amount") ?? 0);

  useEffect(() => {
    if (ran.current) return;
    if (!orderId || !paymentKey || !amount) {
      setState("fail");
      setMessage("결제 정보가 올바르지 않아요. 작업 상세에서 다시 시도해 주세요.");
      return;
    }
    ran.current = true;
    confirmPayment({ orderId, paymentKey, amount })
      .then((r) => {
        setResult(r);
        setState("ok");
      })
      .catch((e) => {
        setState("fail");
        setMessage(e?.message ?? "결제 승인에 실패했어요.");
      });
  }, [orderId, paymentKey, amount]);

  return (
    <main className="container page" style={{ maxWidth: 420, textAlign: "center" }}>
      {state === "working" && (
        <>
          <Spinner />
          <h2 style={{ marginTop: 16 }}>결제를 확인하고 있어요</h2>
          <p className="page-sub">카드사 승인을 마무리하는 중이에요. 잠시만요.</p>
        </>
      )}
      {state === "ok" && (
        <>
          <div style={{ fontSize: 44 }}>🚀</div>
          <h2 style={{ marginTop: 8 }}>우선처리 결제 완료</h2>
          <p className="page-sub">
            {amount.toLocaleString("ko-KR")}원 결제가 정상 처리됐어요.
            <br />이 작업은 배정 대기열 최상단에서 처리됩니다.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18 }}>
            {result?.receiptUrl && (
              <a href={result.receiptUrl} target="_blank" rel="noreferrer">
                <Button variant="ghost">영수증 보기</Button>
              </a>
            )}
            <Link to={result?.workId ? `/works/${result.workId}` : "/works"}>
              <Button>작업으로 돌아가기</Button>
            </Link>
          </div>
        </>
      )}
      {state === "fail" && (
        <>
          <div style={{ fontSize: 44 }}>⚠️</div>
          <h2 style={{ marginTop: 8 }}>결제를 완료하지 못했어요</h2>
          <p className="page-sub">{message}</p>
          <Link to="/works" style={{ display: "inline-block", marginTop: 18 }}>
            <Button variant="ghost">목록으로</Button>
          </Link>
        </>
      )}
    </main>
  );
}
