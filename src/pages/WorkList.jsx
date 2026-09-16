import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  EmptyState,
  Spinner,
  StatusBadge,
} from "../components/ui.jsx";
import {
  STATUS,
  categoryOf,
  formatDate,
  listWorks,
} from "../lib/storage.js";

const FILTERS = ["전체", ...STATUS];

export default function WorkList() {
  const [works, setWorks] = useState(null); // null = 로딩 중
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    listWorks()
      .then(setWorks)
      .catch((e) => setError(e?.message || "작업 목록을 불러오지 못했어요."));
  }, []);

  const visible = useMemo(() => {
    if (!works) return [];
    let list = works;
    if (filter !== "전체") list = list.filter((w) => w.status === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.location.toLowerCase().includes(q)
      );
    }
    if (sort === "urgent") {
      list = [...list].sort(
        (a, b) => (b.priority === "긴급") - (a.priority === "긴급")
      );
    }
    return list;
  }, [works, filter, query, sort]);

  return (
    <main className="container page">
      <div className="page-head">
        <h2>작업 현황</h2>
        <Link to="/works/new">
          <Button size="sm">+ 새 접수</Button>
        </Link>
      </div>
      <p className="page-sub">등록된 민원·작업을 확인하고 상태를 관리해요.</p>

      <div className="work-toolbar">
        <input
          type="search"
          placeholder="제목·위치 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="작업 검색"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="정렬"
          style={{
            border: "1.5px solid var(--line)",
            borderRadius: 12,
            padding: "9px 12px",
            fontSize: 14,
          }}
        >
          <option value="latest">최신순</option>
          <option value="urgent">긴급 우선</option>
        </select>
      </div>

      <div className="chip-row" role="tablist" aria-label="상태 필터">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`chip${filter === f ? " on" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {works && f !== "전체" && (
              <> {works.filter((w) => w.status === f).length}</>
            )}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        {error ? (
          <EmptyState emoji="⚠️" title="문제가 생겼어요" sub={error} />
        ) : !works ? (
          <Spinner />
        ) : visible.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="조건에 맞는 작업이 없어요"
            sub="검색어나 필터를 바꾸거나, 새 작업을 접수해 보세요."
          />
        ) : (
          <ul className="work-list">
            {visible.map((w) => {
              const cat = categoryOf(w.category);
              return (
                <li key={w.id}>
                  <Link to={`/works/${w.id}`} className="work-item">
                    <span className="ico" aria-hidden>{cat.emoji}</span>
                    <span className="meta">
                      <span className="title">
                        {w.priority === "긴급" && "🚨 "}
                        {w.title}
                      </span>
                      <div className="sub">
                        {cat.label} · {w.location} · {formatDate(w.createdAt)}
                      </div>
                    </span>
                    <StatusBadge status={w.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
