import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Field } from "../components/ui.jsx";
import { login, signup } from "../lib/auth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const switchMode = () => {
    setMode(isSignup ? "login" : "signup");
    setErrors({});
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (isSignup && !name.trim()) next.name = "이름을 입력해 주세요.";
    if (!EMAIL_RE.test(email.trim()))
      next.email = "이메일 형식을 확인해 주세요.";
    if (pw.length < 6) next.pw = "비밀번호는 6자 이상이에요.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const session = isSignup
        ? await signup({ name: name.trim(), email: email.trim(), password: pw })
        : await login({ email: email.trim(), password: pw });
      onLogin(session);
      navigate(location.state?.from ?? "/works", { replace: true });
    } catch (error) {
      setErrors({ submit: error.message });
      setLoading(false);
    }
  };

  return (
    <main className="container page" style={{ maxWidth: 420 }}>
      <div className="page-head">
        <h2>{isSignup ? "회원가입" : "로그인"}</h2>
      </div>
      <p className="page-sub">
        {isSignup
          ? "계정을 만들면 내 작업이 서버에 저장돼요."
          : "내 계정으로 접수한 작업을 어디서든 확인해요."}
      </p>
      <form className="card-white" onSubmit={submit} noValidate>
        {isSignup && (
          <Field label="이름" error={errors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김소장"
              autoFocus
            />
          </Field>
        )}
        <Field label="이메일" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus={!isSignup}
          />
        </Field>
        <Field label="비밀번호" error={errors.pw} hint="6자 이상 입력해 주세요.">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••"
          />
        </Field>
        {errors.submit && <p className="field-error">{errors.submit}</p>}
        <Button block disabled={loading}>
          {loading
            ? "확인 중…"
            : isSignup
              ? "가입하고 시작하기"
              : "로그인"}
        </Button>
      </form>
      <p className="page-sub" style={{ textAlign: "center", marginTop: 14 }}>
        {isSignup ? "이미 계정이 있나요?" : "처음이신가요?"}{" "}
        <button
          type="button"
          className="back-link"
          style={{ background: "none", border: 0, cursor: "pointer" }}
          onClick={switchMode}
        >
          {isSignup ? "로그인" : "회원가입"}
        </button>
      </p>
    </main>
  );
}
