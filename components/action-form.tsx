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
