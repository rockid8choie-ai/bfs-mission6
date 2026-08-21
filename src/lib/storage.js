// 작업(민원) 데이터 — localStorage 기반 저장/조회
// 실제 API 연동은 미션 7에서 진행 예정이라, 여기서는 비동기 API처럼 보이는
// 인터페이스(Promise + 지연)로 감싸 로딩 상태까지 시뮬레이션한다.

const KEY = "bfs.works.v1";

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

// 첫 방문 시 화면이 비어 보이지 않도록 넣어 두는 예시 데이터
const SEED = [
  {
    id: "w-seed-3",
    title: "3층 여자 화장실 센서등 깜빡임",
    category: "elec",
    location: "본관 3F",
    priority: "보통",
    status: "접수",
    desc: "복도 쪽 센서등이 2~3초 간격으로 깜빡입니다.",
    createdAt: "2026-08-20T09:30:00.000Z",
  },
  {
    id: "w-seed-2",
    title: "지하 주차장 B2 배수구 역류",
    category: "plumb",
    location: "B2 램프 옆",
    priority: "긴급",
    status: "배정",
    desc: "비 온 뒤 배수가 안 되어 물이 고여 있습니다.",
    createdAt: "2026-08-19T14:05:00.000Z",
  },
  {
    id: "w-seed-1",
    title: "7층 회의실 에어컨 소음",
    category: "hvac",
    location: "7F 대회의실",
    priority: "보통",
    status: "완료",
    desc: "실외기 쪽에서 덜덜거리는 소음이 납니다. 필터 교체로 조치 완료.",
    createdAt: "2026-08-18T10:00:00.000Z",
  },
];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return [...SEED];
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED];
  }
}

function save(works) {
  localStorage.setItem(KEY, JSON.stringify(works));
}

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function listWorks() {
  await delay();
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getWork(id) {
  await delay(250);
  return load().find((w) => w.id === id) ?? null;
}

export async function createWork(input) {
  await delay(450);
  const work = {
    ...input,
    id: `w-${Date.now()}`,
    status: "접수",
    createdAt: new Date().toISOString(),
  };
  save([work, ...load()]);
  return work;
}

export async function updateStatus(id, status) {
  await delay(250);
  const works = load().map((w) => (w.id === id ? { ...w, status } : w));
  save(works);
  return works.find((w) => w.id === id);
}

export async function removeWork(id) {
  await delay(250);
  save(load().filter((w) => w.id !== id));
}

export function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
