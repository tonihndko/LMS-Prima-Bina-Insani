import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/brand";

// Logo PNG klien berwarna biru — hanya terbaca di latar terang.
// Varian "dark" memakai wordmark putih untuk hero login yang gelap.
export function Brand({ href, variant = "light" }: { href: string; variant?: "light" | "dark" }) {
  if (variant === "dark") {
    return (
      <Link className="brand brand-dark" href={href}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="m4 12 8-7 8 7-8 7-8-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m8 12 4 3.5 4-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <span>{PLATFORM_NAME}<small>Ruang belajar</small></span>
      </Link>
    );
  }
  return (
    <Link className="brand" href={href}>
      <img className="brand-logo" src="/logo-prima-bina-insani.svg" alt={PLATFORM_NAME + " — ruang belajar"} />
    </Link>
  );
}
