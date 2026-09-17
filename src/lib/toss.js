// 토스페이먼츠 v2 SDK 로더 — 결제 버튼을 누를 때만 로드한다.
// 클라이언트 키: env 우선, 없으면 공식 문서의 공개 샌드박스 키(실청구 불가).
export const TOSS_CLIENT_KEY =
  import.meta.env.VITE_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

const SDK_URL = "https://js.tosspayments.com/v2/standard";

export function loadTossPayments() {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) return resolve(window.TossPayments);
    const fail = () => reject(new Error("결제 모듈을 불러오지 못했어요."));
    const existing = document.querySelector(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () =>
        window.TossPayments ? resolve(window.TossPayments) : fail()
      );
      existing.addEventListener("error", fail);
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => (window.TossPayments ? resolve(window.TossPayments) : fail());
    script.onerror = fail;
    document.head.appendChild(script);
  });
}
