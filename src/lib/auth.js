// 로그인 흐름 시뮬레이션 — 실제 인증이 아니라 localStorage 기반
const KEY = "bfs.session.v1";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function login(name) {
  const session = { name, loginAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(KEY);
}
