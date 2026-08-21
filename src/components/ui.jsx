// 재사용 UI 컴포넌트 — 버튼 / 필드 / 배지 / 빈 화면 / 스피너 / 토스트
import { useEffect } from "react";

export function Button({ variant = "primary", size, block, ...props }) {
  const cls = [
    "btn",
    `btn-${variant}`,
    size === "sm" && "btn-sm",
    block && "btn-block",
  ]
    .filter(Boolean)
    .join(" ");
  return <button className={cls} {...props} />;
}

export function Field({ label, error, hint, children }) {
  return (
    <div className={`field${error ? " invalid" : ""}`}>
      <label>{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
      {!error && hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

const BADGE_COLOR = { 접수: "amber", 배정: "blue", 완료: "green" };

export function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${BADGE_COLOR[status] ?? "gray"}`}>
      {status}
    </span>
  );
}

export function EmptyState({ emoji = "🗂️", title, sub }) {
  return (
    <div className="empty">
      <div className="emoji">{emoji}</div>
      <h3>{title}</h3>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" role="status" aria-label="불러오는 중" />;
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="toast">{message}</div>;
}
