import { Link } from "react-router-dom";
import { Button } from "../components/ui.jsx";

const FEATURES = [
  {
    emoji: "📝",
    title: "민원 접수",
    desc: "입주사 민원과 시설 작업을 30초 만에 등록해요.",
  },
  {
    emoji: "📋",
    title: "작업 현황",
    desc: "접수 → 배정 → 완료. 모든 작업의 상태를 한눈에 봐요.",
  },
  {
    emoji: "✅",
    title: "처리 완료",
    desc: "터치 한 번으로 상태를 바꾸고 완료 이력을 남겨요.",
  },
];

export default function Landing({ session }) {
  const startTo = session ? "/works" : "/login";

  return (
    <main>
      <section className="hero container">
        <span className="hero-eyebrow">빌딩 시설 운영 OS</span>
        <h1>
          빌딩 시설 운영,
          <br />폰 하나로 끝내세요
        </h1>
        <p className="hero-lede">
          접수부터 배정, 완료까지. 관리소장님의 하루를 BFS OS가 정리해 드려요.
        </p>
        <div className="hero-actions">
          <Link to={startTo}>
            <Button>지금 시작하기</Button>
          </Link>
          <Link to="/works">
            <Button variant="ghost">작업 현황 보기</Button>
          </Link>
        </div>
      </section>

      <section className="container feature-grid" aria-label="핵심 기능">
        {FEATURES.map((f) => (
          <div className="card" key={f.title}>
            <div className="ico" aria-hidden>{f.emoji}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
