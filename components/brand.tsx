import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/brand";

export function Brand({ href }: { href: string }) {
  return (
    <Link className="brand" href={href}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="m4 12 8-7 8 7-8 7-8-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m8 12 4 3.5 4-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <span>{PLATFORM_NAME}<small>Ruang belajar</small></span>
    </Link>
  );
}
