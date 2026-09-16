// 작업(민원) 데이터 — 백엔드 /works API 연동 (미션 8에서 localStorage → 서버 DB 전환)
// 로그인한 사용자 본인의 작업만 서버에서 내려온다.
import { ApiError, request } from "./api.js";

export const STATUS = ["접수", "배정", "완료"];

export const CATEGORIES = [
  { key: "elec", label: "전기", emoji: "⚡" },
  { key: "plumb", label: "배관/누수", emoji: "🚿" },
  { key: "hvac", label: "냉난방", emoji: "❄️" },
  { key: "clean", label: "미화", emoji: "🧹" },
  { key: "etc", label: "기타", emoji: "🛠️" },
];

export const categoryOf = (key) =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];

export function listWorks() {
  return request("/works");
}

export async function getWork(id) {
  try {
    return await request(`/works/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function createWork({ title, category, location, priority, desc }) {
  return request("/works", {
    method: "POST",
    body: { title, category, location, priority, desc },
  });
}

export function updateStatus(id, status) {
  return request(`/works/${id}`, { method: "PATCH", body: { status } });
}

export function removeWork(id) {
  return request(`/works/${id}`, { method: "DELETE" });
}

export function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
