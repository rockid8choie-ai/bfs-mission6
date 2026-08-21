import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Field } from "../components/ui.jsx";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = "이름을 입력해 주세요.";
    if (pw.length < 4) next.pw = "비밀번호는 4자 이상이에요. (시뮬레이션)";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // 인증 요청 시뮬레이션
    onLogin(name.trim());
    navigate(location.state?.from ?? "/works", { replace: true });
  };

  return (
    <main className="container page" style={{ maxWidth: 420 }}>
      <div className="page-head">
        <h2>로그인</h2>
      </div>
      <p className="page-sub">
        실제 인증이 아닌 localStorage 기반 시뮬레이션이에요.
      </p>
      <form className="card-white" onSubmit={submit} noValidate>
        <Field label="이름" error={errors.name}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 김소장"
            autoFocus
          />
        </Field>
        <Field label="비밀번호" error={errors.pw} hint="아무 4자 이상이면 통과돼요.">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••"
          />
        </Field>
        <Button block disabled={loading}>
          {loading ? "확인 중…" : "로그인"}
        </Button>
      </form>
    </main>
  );
}
