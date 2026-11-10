"use client";

import { useActionState, type ReactNode } from "react";

type FormState = { error?: string };

export function ActionForm({
  action,
  children,
  label,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  label: string;
}) {
  const [state, dispatch, pending] = useActionState(action, {});
  return (
    <form action={dispatch} className="stack-form">
      {state.error && <p className="form-alert" role="alert">{state.error}</p>}
      {children}
      <div className="form-footer">
        <button className="button primary" type="submit" disabled={pending}>
          {pending ? "Memproses…" : label}
        </button>
      </div>
    </form>
  );
}
