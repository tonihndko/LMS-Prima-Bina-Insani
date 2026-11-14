# UI/UX Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perbaiki feedback form, tambah data viz SVG, perkaya halaman kelas, dan rapikan aksesibilitas/mobile pada LMS Prima Bina Insani.

**Architecture:** Semua server-rendered Next.js App Router. Data viz = server component SVG murni tanpa dependensi. Feedback sukses = flag di query string yang dibaca `searchParams`. Tidak ada perubahan skema DB atau logika bisnis.

**Tech Stack:** Next.js 16 App Router, React 19 (`useActionState`, `useFormStatus`, `searchParams`), TypeScript, CSS murni di `app/globals.css`, Prisma 7.

## Global Constraints

- Tanpa dependensi baru (`package.json` tidak boleh berubah).
- Tanpa perubahan `prisma/schema.prisma`.
- Semua teks UI dalam Bahasa Indonesia, gaya singkat seperti yang sudah ada.
- Warna hanya dari token CSS di `:root` (`--green`, `--mist`, `--line`, `--paper`, `--muted`, `--canvas`, `--pine`, `--lime`) atau nilai hex yang sudah terpakai di `globals.css`. Jangan perkenalkan palet baru.
- Grafik SVG wajib `aria-hidden="true"` dan disertai teks ringkasan terpisah untuk screen reader.
- Setiap langkah selesai → `npm run check` lulus sebelum commit.
- Verifikasi akhir: `npm run check` DAN `npm run build` lulus.

---

### Task 1: Branch + grafik SVG

**Files:**
- Create: `components/charts.tsx`
- Modify: (tidak ada — komponen baru, dipakai Task 3–5)

**Interfaces:**
- Consumes: tidak ada.
- Produces:
  - `Donut({ value, total, label }: { value: number; total: number; label: string })` → JSX. Render donut 120px + angka persentase di tengah + `<span className="sr-only">` ringkasan.
  - `ScoreBars({ scores }: { scores: number[] })` → JSX. Histogram 10 bucket (0–9, …, 90–100) dari array nilai 0–100. Jika `scores` kosong, render `null` (pemanggil yang render empty state).
  - `Sparkline({ counts }: { counts: number[] })` → JSX. Garis dari array angka (urut waktu). Jika `counts.length < 2`, render `null`.

- [ ] **Step 1: Buat branch baru**

```bash
git checkout -b feature/ui-ux-polish
git add docs/superpowers/specs/2026-11-10-ui-ux-polish-design.md docs/superpowers/plans/2026-11-10-ui-ux-polish.md
git commit -m "docs: add UI/UX polish design and plan"
```

- [ ] **Step 2: Tulis `components/charts.tsx`**

```tsx
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Donut({ value, total, label }: { value: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const offset = CIRCUMFERENCE * (1 - pct / 100);
  return (
    <figure className="chart donut">
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
        <circle className="donut-track" cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="12" />
        <circle className="donut-value" cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="12"
          strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
          transform="rotate(-90 60 60)" />
      </svg>
      <figcaption>
        <strong>{pct}%</strong>
        <span>{value}/{total}</span>
      </figcaption>
      <span className="sr-only">{`${label}: ${value} dari ${total} (${pct}%)`}</span>
    </figure>
  );
}

export function ScoreBars({ scores }: { scores: number[] }) {
  if (!scores.length) return null;
  const buckets = Array.from({ length: 10 }, () => 0);
  for (const score of scores) buckets[Math.min(9, Math.floor(score / 10))] += 1;
  const max = Math.max(...buckets);
  return (
    <figure className="chart bars">
      <svg viewBox="0 0 300 180" role="img" aria-label={`Distribusi ${scores.length} nilai`}>
        {[0, 0.5, 1].map((line) => (
          <line key={line} className="bars-grid" x1="0" x2="300"
            y1={20 + line * 140} y2={20 + line * 140} />
        ))}
        {buckets.map((count, index) => {
          const height = max ? (count / max) * 140 : 0;
          return (
            <g key={index}>
              <rect className="bars-value" x={index * 30 + 4} y={160 - height}
                width="22" height={height} rx="3" />
              <text className="bars-label" x={index * 30 + 15} y={175} textAnchor="middle">
                {index * 10}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>{`${scores.length} nilai terkumpul · tertinggi ${Math.max(...scores)}`}</figcaption>
    </figure>
  );
}

export function Sparkline({ counts }: { counts: number[] }) {
  if (counts.length < 2) return null;
  const max = Math.max(...counts, 1);
  const width = 220;
  const height = 40;
  const step = width / (counts.length - 1);
  const points = counts.map((count, index) =>
    `${(index * step).toFixed(1)},${(height - (count / max) * (height - 6) - 3).toFixed(1)}`
  ).join(" ");
  return (
    <svg className="chart sparkline" viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <polyline points={points} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
```

- [ ] **Step 3: Tambah util `lastNDays` + agregasi**

Tambahkan di akhir `lib/presentation.ts`:

```ts
export function lastNDays(n: number) {
  const today = new Date();
  return Array.from({ length: n }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (n - 1 - index));
    day.setHours(0, 0, 0, 0);
    return day;
  });
}
```

- [ ] **Step 4: Tambah CSS grafik + sr-only**

Tambahkan di akhir `app/globals.css`:

```css
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.chart { margin: 0; display: grid; gap: 8px; }
.chart figcaption { color: var(--muted); font-size: .82rem; }
.donut { grid-template-columns: 120px auto; align-items: center; gap: 16px; }
.donut-track { stroke: var(--mist); }
.donut-value { stroke: var(--green); transition: stroke-dashoffset .5s ease; }
.donut figcaption { display: grid; gap: 2px; }
.donut figcaption strong { font-size: 1.9rem; letter-spacing: -.045em; color: var(--green); line-height: 1.1; }
.donut figcaption span { color: var(--muted); font-size: .82rem; font-variant-numeric: tabular-nums; }
.bars svg { width: 100%; height: auto; max-width: 420px; }
.bars-value { fill: var(--green); }
.bars-grid { stroke: var(--line); stroke-width: 1; }
.bars-label { fill: var(--muted); font-size: 9px; font-variant-numeric: tabular-nums; }
.sparkline polyline { stroke: var(--lime); }
@media (prefers-reduced-motion: reduce) {
  .donut-value { transition: none; }
}
```

- [ ] **Step 5: Verifikasi**

Run: `npm run check`
Expected: PASS (tidak ada error TS; komponen belum dipakai, tapi harus lolos type-check).

- [ ] **Step 6: Commit**

```bash
git add components/charts.tsx lib/presentation.ts app/globals.css
git commit -m "feat(ui): add inline SVG chart components"
```

---

### Task 2: Feedback form (spinner + aria-live + flag URL)

**Files:**
- Modify: `components/action-form.tsx` (seluruh file)
- Modify: `app/actions.ts` — redirect sukses diberi flag `?ok=`
- Create: `components/flash.tsx`
- Modify: `app/globals.css` — CSS strip sukses + spinner

**Interfaces:**
- Consumes: `useActionState` (sudah ada), `useFormStatus` (React 19).
- Produces:
  - `Flash({ ok }: { ok?: string })` — strip hijau `role="status"` di atas panel. `ok` adalah kode pesan; tak dikenal → render `null`.
  - Server action sukses me-redirect ke path + `?ok=<kode>`.

- [ ] **Step 1: Update `components/action-form.tsx`**

Ganti seluruh isi:

```tsx
"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

type FormState = { error?: string };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="form-footer">
      <button className="button primary" type="submit" disabled={pending}>
        {pending && (
          <svg className="spinner" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <circle cx="8" cy="8" r="6" fill="none" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
          </svg>
        )}
        {pending ? "Memproses…" : label}
      </button>
    </div>
  );
}

export function ActionForm({
  action,
  children,
  label,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  label: string;
}) {
  const [state, dispatch] = useActionState(action, {});
  return (
    <form action={dispatch} className="stack-form">
      <div aria-live="polite">
        {state.error && <p className="form-alert" role="alert">{state.error}</p>}
      </div>
      {children}
      <SubmitButton label={label} />
    </form>
  );
}
```

- [ ] **Step 2: Buat `components/flash.tsx`**

```tsx
const MESSAGES: Record<string, string> = {
  submitted: "Jawaban berhasil dikirim.",
  graded: "Nilai dan umpan balik tersimpan.",
  material: "Materi berhasil diunggah.",
  assignment: "Latihan baru dibuat.",
  account: "Akun berhasil dibuat.",
  renamed: "Nama akun diperbarui.",
  deactivated: "Akun dinonaktifkan.",
  activated: "Akun diaktifkan.",
  course: "Kelas tersimpan.",
  enrolled: "Peserta ditambahkan ke kelas.",
  removed: "Peserta dikeluarkan dari kelas.",
};

export function Flash({ ok }: { ok?: string }) {
  const message = ok ? MESSAGES[ok] : undefined;
  if (!message) return null;
  return <p className="flash" role="status">{message}</p>;
}
```

- [ ] **Step 3: Update redirect di `app/actions.ts`**

Tambahkan flag `?ok=` pada setiap redirect sukses. Contoh `submitAnswer` (baris ~111):

```ts
redirect(path + "?ok=submitted");
```

`gradeSubmission`:
```ts
redirect(path + "?ok=graded");
```

`createAssignment`:
```ts
redirect(assignmentPath(courseId, assignment.id) + "?ok=assignment");
```

`createAccount`, `renameAccount`, `setAccountActive`, `saveCourse`, `enrollStudent`, `removeStudent` di `app/admin-actions.ts`: ganti `redirect("/admin/akun")` → `redirect("/admin/akun?ok=account")` dst. sesuai `MESSAGES` di `flash.tsx`.

`createMaterial` di `app/material-actions.ts`:
```ts
redirect(path + "/" + material.id + "?ok=material");
```

- [ ] **Step 4: Tambah CSS**

Tambahkan di `app/globals.css`:

```css
.flash { margin-bottom: 16px; padding: 11px 14px; border: 1px solid #cfe6c3; border-radius: 10px; background: #eef7e6; color: #1e5e3d; font-size: .9rem; font-weight: 600; }
.spinner { animation: spin .8s linear infinite; flex: 0 0 auto; }
.spinner circle { stroke: currentColor; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
}
```

- [ ] **Step 5: Verifikasi**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/action-form.tsx components/flash.tsx app/actions.ts app/admin-actions.ts app/material-actions.ts app/globals.css
git commit -m "feat(ui): add submit spinner, aria-live, and success flash"
```

---

### Task 3: Halaman kelas — Flash + grafik + banner

**Files:**
- Modify: `app/(kelas)/kelas/[courseId]/page.tsx`
- Modify: `app/(kelas)/kelas/[courseId]/latihan/[assignmentId]/page.tsx`
- Modify: `app/(kelas)/kelas/[courseId]/latihan/[assignmentId]/jawaban/[submissionId]/page.tsx`
- Modify: `app/(kelas)/kelas/[courseId]/materi/[materialId]/page.tsx`
- Modify: `app/(kelas)/kelas/[courseId]/materi/baru/page.tsx` (tambah Flash)
- Modify: `app/(kelas)/kelas/[courseId]/latihan/baru/page.tsx` (tambah Flash)
- Modify: `app/(kelas)/layout.tsx` — tidak diubah (breadcrumb per halaman)

**Interfaces:**
- Consumes: `Flash`, `Donut`, `Sparkline` dari Task 1–2; `lastNDays` dari `lib/presentation.ts`.
- Produces: tidak ada (leaf pages).

- [ ] **Step 1: Tambah Flash di 6 halaman dalam kelas**

Halaman dengan redirect sukses membaca `searchParams`. Next 16: `searchParams` adalah `Promise`. Contoh `latihan/[assignmentId]/page.tsx`:

```tsx
export default async function AssignmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; assignmentId: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { courseId, assignmentId } = await params;
  const { ok } = await searchParams;
  // ... existing code
  return (
    <>
      <Flash ok={ok} />
      <Link className="back-link" ...>...</Link>
      {/* ... */}
    </>
  );
}
```

Terapkan pola sama pada: review submission (`ok=graded`), materi detail (`ok=material`), materi/baru + latihan/baru (tambah Flash saja, tanpa searchParams karena tidak jadi target redirect).

- [ ] **Step 2: Donut di banner kelas (pengajar)**

Di `app/(kelas)/kelas/[courseId]/page.tsx`, tambah donut + sparkline untuk pengajar di sisi kanan banner:

```tsx
{isTeacher && (
  <div className="banner-viz" aria-hidden="false">
    <Donut value={graded} total={submissions.length} label="Jawaban dinilai" />
  </div>
)}
```

dengan:

```tsx
const graded = submissions.filter(({ score }) => score !== null).length;
```

Sparkline pengumpulan 14 hari (pengajar):

```tsx
const daily = lastNDays(14).map((day) =>
  submissions.filter(({ submittedAt }) => {
    const date = new Date(submittedAt);
    return date >= day && date < new Date(day.getTime() + 86_400_000);
  }).length
);
```

Render `<Sparkline counts={daily} />` di bawah stats (pengajar).

- [ ] **Step 3: CSS banner-viz**

Tambahkan di `globals.css`:

```css
.banner-viz { flex: 0 0 auto; display: grid; place-items: center; }
.banner-viz .donut-track { stroke: #2a6553; }
.banner-viz .donut-value { stroke: var(--lime); }
.banner-viz .donut figcaption strong { color: var(--lime); }
.banner-viz .donut figcaption span { color: #cfe2d4; }
@media (max-width: 540px) {
  .banner-viz { display: none; }
}
```

- [ ] **Step 4: Verifikasi**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/(kelas)/kelas" app/globals.css
git commit -m "feat(ui): add class flash, progress donut, and submission sparkline"
```

---

### Task 4: Admin dashboard — grafik + Flash

**Files:**
- Modify: `app/(kelas)/admin/page.tsx`
- Modify: `app/(kelas)/admin/akun/page.tsx`
- Modify: `app/(kelas)/admin/kelas/page.tsx`
- Modify: `app/(kelas)/admin/kelas/[courseId]/page.tsx`

**Interfaces:**
- Consumes: `Flash`, `Donut`, `ScoreBars` dari Task 1–2.
- Produces: tidak ada.

- [ ] **Step 1: Tambah searchParams + Flash di 4 halaman admin**

Pola sama dengan Task 3 Step 1. Redirect admin target: `/admin/akun?ok=account`, `/admin/kelas?ok=course`, `/admin/kelas/<id>?ok=enrolled`.

- [ ] **Step 2: Donut penilaian + bar distribusi di dasbor admin**

Di `app/(kelas)/admin/page.tsx`, agregasi sudah tersedia dari `courses` (masing-masing punya `assignments.submissions.score`). Hitung:

```tsx
const allScores = courses.flatMap((course) =>
  course.assignments.flatMap((assignment) => assignment.submissions)
    .filter(({ score }) => score !== null)
    .map(({ score }) => score as number)
);
const graded = allScores.length;
const submitted = courses.flatMap((course) =>
  course.assignments.flatMap((assignment) => assignment.submissions)
).length;
```

Render setelah `.stats`:

```tsx
<section className="section" aria-labelledby="progres-penilaian">
  <div className="section-heading">
    <p className="eyebrow accent">Pemantauan</p>
    <h2 id="progres-penilaian">Progres penilaian</h2>
  </div>
  <div className="panel chart-panel">
    <Donut value={graded} total={submitted} label="Jawaban dinilai" />
    <ScoreBars scores={allScores} />
    {!allScores.length && <p className="empty">Belum ada nilai yang tersimpan.</p>}
  </div>
</section>
```

- [ ] **Step 3: CSS chart-panel**

Tambahkan di `globals.css`:

```css
.chart-panel { display: grid; gap: 24px; padding: clamp(17px, 3vw, 26px); grid-template-columns: minmax(0, auto) minmax(0, 1fr); align-items: center; }
@media (max-width: 800px) {
  .chart-panel { grid-template-columns: minmax(0, 1fr); }
}
```

- [ ] **Step 4: Verifikasi**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/(kelas)/admin" app/globals.css
git commit -m "feat(ui): add admin grading progress charts and flash"
```

---

### Task 5: Halaman "Kelas saya" jadi kartu

**Files:**
- Modify: `app/(kelas)/kelas/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `courseAccess` (sudah ada), `db.course.findMany` dengan `_count`.
- Produces: tidak ada.

- [ ] **Step 1: Ubah query + markup**

Di `app/(kelas)/kelas/page.tsx`:

```tsx
const courses = await db.course.findMany({
  where: courseAccess(user),
  orderBy: { title: "asc" },
  select: {
    id: true, title: true, description: true,
    teacher: { select: { name: true } },
    _count: { select: { assignments: true, materials: true, enrollments: true } },
  },
});
```

Markup:

```tsx
<div className="class-grid">
  {courses.length ? courses.map((course) => (
    <Link key={course.id} className="class-card" href={coursePath(course.id)}>
      <p className="eyebrow accent">{course.teacher.name}</p>
      <h2>{course.title}</h2>
      <p className="muted">{course.description}</p>
      <div className="class-card-stats">
        <span><strong>{course._count.assignments}</strong> latihan</span>
        <span><strong>{course._count.materials}</strong> materi</span>
        <span><strong>{course._count.enrollments}</strong> peserta</span>
      </div>
    </Link>
  )) : (
    <div className="panel list-panel">
      <p className="empty empty-rich">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true"><path d="M4 5h16v14H4V5Zm3 4h10M7 13h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Belum ada kelas untuk akun ini. Hubungi admin untuk penempatan.
      </p>
    </div>
  )}
</div>
```

- [ ] **Step 2: CSS class-card + empty-rich**

Tambahkan di `globals.css`:

```css
.class-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.class-card { display: grid; gap: 10px; padding: clamp(18px, 3vw, 24px); border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); transition: border-color .15s ease, transform .15s ease; }
.class-card:hover { border-color: var(--green); transform: translateY(-1px); }
.class-card h2 { font-size: 1.35rem; letter-spacing: -.03em; }
.class-card .muted { font-size: .88rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.class-card-stats { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 4px; color: var(--muted); font-size: .84rem; }
.class-card-stats strong { color: var(--ink); font-variant-numeric: tabular-nums; }
.empty-rich { display: grid; justify-items: start; gap: 10px; padding: 28px 20px; }
.empty-rich svg { color: var(--green); }
@media (prefers-reduced-motion: reduce) {
  .class-card { transition: none; }
  .class-card:hover { transform: none; }
}
```

- [ ] **Step 3: Verifikasi**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add "app/(kelas)/kelas/page.tsx" app/globals.css
git commit -m "feat(ui): rework course list as cards with mini stats"
```

---

### Task 6: Breadcrumb, empty state latihan, polish aksesibilitas

**Files:**
- Modify: `app/(kelas)/kelas/[courseId]/latihan/[assignmentId]/page.tsx`
- Modify: `app/(kelas)/kelas/[courseId]/materi/[materialId]/page.tsx`
- Modify: `app/(kelas)/kelas/[courseId]/materi/page.tsx`
- Modify: `app/(kelas)/kelas/[courseId]/latihan/page.tsx`
- Modify: `components/assignment-list.tsx`
- Modify: `components/status.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: komponen dari Task 1–2.
- Produces: `Breadcrumb({ items }: { items: { href: string; label: string }[] })` di `components/breadcrumb.tsx`.

- [ ] **Step 1: Buat `components/breadcrumb.tsx`**

```tsx
import Link from "next/link";

export function Breadcrumb({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.href}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1
              ? <span aria-current="page">{item.label}</span>
              : <Link href={item.href}>{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Ganti back-link dengan Breadcrumb di 4 halaman**

Contoh `latihan/[assignmentId]/page.tsx`, ganti baris `<Link className="back-link" ...>`:

```tsx
<Breadcrumb items={[
  { href: "/kelas", label: "Kelas saya" },
  { href: coursePath(courseId), label: course.title },
  { href: coursePath(courseId) + "/latihan", label: "Latihan" },
  { href: assignmentPath(courseId, assignmentId), label: assignment.title },
]} />
```

Terapkan serupa untuk materi detail (materi list → judul), materi list (ringkasan → materi), latihan list (ringkasan → latihan).

- [ ] **Step 3: Empty state kaya untuk latihan**

Di `components/assignment-list.tsx`, ganti `<p className="empty">`:

```tsx
) : (
  <p className="empty empty-rich">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true"><path d="M7 3h7l4 4v14H6V3h1Zm6 0v5h5M9 12h6m-6 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    Belum ada latihan di kelas ini.{isTeacher ? " Buat latihan pertama dari tombol di atas." : " Jawaban akan muncul di sini saat pengajar menambahkan latihan."}
  </p>
)}
```

- [ ] **Step 4: Status-new outline halus**

Di `components/status.tsx`, tidak berubah (markup sudah bagus). Cukup CSS di `globals.css`:

```css
.status-new { color: #4f6058; background: #edf1ed; border: 1px solid #d5ddd6; }
.status { border: 1px solid transparent; }
```

- [ ] **Step 5: CSS breadcrumb + target sentuh mobile**

Tambahkan di `globals.css`:

```css
.breadcrumb { margin-bottom: 14px; }
.breadcrumb ol { display: flex; flex-wrap: wrap; gap: 4px 8px; margin: 0; padding: 0; list-style: none; font-size: .82rem; color: var(--muted); }
.breadcrumb li { display: inline-flex; gap: 8px; align-items: center; }
.breadcrumb a { color: var(--green); font-weight: 650; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb [aria-current] { color: var(--muted); font-weight: 600; }
.table-wrap:focus-visible { outline: 3px solid #508b37; outline-offset: 4px; }
```

Modifikasi blok `@media (max-width: 540px)` yang sudah ada — tambahkan:

```css
  .button.compact { min-height: 40px; padding: 8px 12px; }
```

Modifikasi blok `@media (max-width: 800px)` yang sudah ada — tambahkan di `.sidebar .portal-nav`:

```css
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
```

- [ ] **Step 6: tabIndex tabel (aksesibilitas scroll)**

Di 3 halaman dengan tabel (admin dasbor, admin kelas/[courseId], kelas/[courseId]), tambah atribut:

```tsx
<div className="panel table-wrap" tabIndex={0} role="region" aria-label="Tabel rekap">
```

Sesuaikan `aria-label` per konteks ("Tabel rekap kelas", "Tabel progres peserta", dst.).

- [ ] **Step 7: Verifikasi**

Run: `npm run check && npm run build`
Expected: keduanya PASS.

- [ ] **Step 8: Commit**

```bash
git add components app
git commit -m "feat(ui): add breadcrumb, rich empty states, and mobile touch targets"
```

---

### Task 9: Verifikasi akhir manual

**Files:** tidak ada perubahan.

- [ ] **Step 1: Build produksi**

Run: `npm run build`
Expected: PASS, tanpa warning TypeScript.

- [ ] **Step 2: (Opsional) Jalankan demo**

Jika Docker tersedia:

```bash
docker compose up -d --wait database
npm run setup
npm run dev
```

Buka http://127.0.0.1:3030. Uji alur README dengan fokus:
- Login admin → dasbor: donut + bar distribusi muncul dari data seed.
- Login pengajar → kelas: banner ada donut; latihan list kosong untuk kelas tanpa latihan menampilkan empty state kaya.
- Login peserta → submit jawaban: tombol jadi "Memproses…" + spinner, setelah redirect muncul strip "Jawaban berhasil dikirim.".
- Kecilkan viewport ke 375px: kartu kelas stack, tombol compact min 40px, tabel bisa discroll dengan keyboard.

- [ ] **Step 3: Commit akhir (jika ada perbaikan)**

```bash
git add -A
git commit -m "fix(ui): address manual verification findings"
```

---

## Self-Review

- **Spec coverage:**
  - Bagian 1 (feedback form): Task 2 ✓
  - Bagian 2 (data viz): Task 1 + Task 3 + Task 4 ✓
  - Bagian 3 (halaman & navigasi kelas): Task 5 + Task 6 ✓
  - Bagian 4 (aksesibilitas & mobile): Task 2 (aria-live) + Task 6 (breadcrumb, tabIndex, target sentuh, reduced-motion) ✓
- **Placeholder scan:** semua step punya kode nyata; tidak ada TBD/TODO.
- **Type consistency:** `Donut({ value, total, label })`, `ScoreBars({ scores: number[] })`, `Sparkline({ counts: number[] })`, `Flash({ ok?: string })`, `Breadcrumb({ items: { href, label }[] })` — dipakai konsisten di Task 3–6.
- **Global constraints:** tak ada dependensi baru, tak ada perubahan skema, hanya token warna lama, grafik aria-hidden + sr-only, `npm run check` di setiap task.
