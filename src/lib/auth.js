// 실제 인증 — 백엔드 /auth API (JWT) 사용. 미션 6의 localStorage 시뮬레이션을 대체.
import { clearToken, request, setToken } from "./api.js";

const KEY = "bfs.session.v2";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

function saveSession({ token, user }) {
  setToken(token);
  const session = {
    name: user.name,
    email: user.email,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export async function signup({ name, email, password }) {
  const result = await request("/auth/signup", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
  return saveSession(result);
}

export async function login({ email, password }) {
  const result = await request("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  return saveSession(result);
}

export function logout() {
  clearToken();
  localStorage.removeItem(KEY);
}
