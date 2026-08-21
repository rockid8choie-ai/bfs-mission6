import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Field } from "../components/ui.jsx";
import { CATEGORIES, createWork } from "../lib/storage.js";

const INITIAL = {
  title: "",
  category: "elec",
  location: "",
  priority: "보통",
  desc: "",
};

export default function WorkNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.title.trim().length < 5)
      next.title = "제목은 5자 이상 입력해 주세요.";
    if (!form.location.trim()) next.location = "위치를 입력해 주세요.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const work = await createWork({
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        desc: form.desc.trim(),
      });
      navigate("/done", { state: { workId: work.id, title: work.title } });
    } catch {
      setErrors({ submit: "저장에 실패했어요. 다시 시도해 주세요." });
      setSaving(false);
    }
  };

  return (
    <main className="container page" style={{ maxWidth: 560 }}>
      <div className="page-head">
        <Link to="/works" className="back-link">← 목록</Link>
        <h2>새 작업 접수</h2>
      </div>
      <p className="page-sub">민원·시설 작업을 등록하면 바로 목록에 반영돼요.</p>

      <form className="card-white" onSubmit={submit} noValidate>
        <Field label="제목" error={errors.title} hint="예: 3층 복도 형광등 교체">
          <input
            value={form.title}
            onChange={set("title")}
            placeholder="무엇이 문제인가요?"
            autoFocus
          />
        </Field>

        <Field label="분류">
          <select value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="위치" error={errors.location}>
          <input
            value={form.location}
            onChange={set("location")}
            placeholder="예: 본관 3F 여자 화장실"
          />
        </Field>

        <Field label="우선순위">
          <select value={form.priority} onChange={set("priority")}>
            <option>보통</option>
            <option>긴급</option>
          </select>
        </Field>

        <Field label="상세 설명 (선택)">
          <textarea
            rows={4}
            value={form.desc}
            onChange={set("desc")}
            placeholder="상황을 조금 더 자세히 적어 주세요."
          />
        </Field>

        {errors.submit && <p className="field-error">{errors.submit}</p>}
        <Button block disabled={saving}>
          {saving ? "접수 중…" : "접수하기"}
        </Button>
      </form>
    </main>
  );
}
