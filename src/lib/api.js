// 백엔드(backend-route, 미션 7 배포 서버) API 클라이언트
const BASE = import.meta.env.VITE_API_URL || "https://backend-route.vercel.app";

const TOKEN_KEY = "bfs.token.v1";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("서버에 연결하지 못했어요. 네트워크를 확인해 주세요.", 0);
  }

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // 본문 없는 응답
  }

  if (!res.ok) {
    // 로그인된 상태에서 토큰이 만료된 경우 → 세션 정리 후 재로그인 유도
    if (res.status === 401 && auth && getToken()) {
      clearToken();
      localStorage.removeItem("bfs.session.v2");
      window.location.assign("/login");
    }
    throw new ApiError(
      data?.message || "요청에 실패했어요. 잠시 후 다시 시도해 주세요.",
      res.status,
    );
  }

  return data;
}

// OpenAI 기반 민원 자동 분류 — 제목/설명을 보내면 분류·우선순위·근거를 받는다
export function classifyWork({ title, desc }) {
  return request("/ai/classify", { method: "POST", body: { title, desc } });
}
