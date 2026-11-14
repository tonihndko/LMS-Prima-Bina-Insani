import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/brand";

// Logo PNG klien berwarna biru — hanya terbaca di latar terang.
// Di hero login (gelap) logo dibungkus kartu putih agar tetap terbaca.
export function Brand({ href, variant = "light" }: { href: string; variant?: "light" | "dark" }) {
  if (variant === "dark") {
    return (
      <Link className="brand brand-dark login-anim" href={href}>
        <span className="brand-logo-plate">
          <img className="brand-logo" src="/logo-prima-bina-insani.svg" alt={PLATFORM_NAME} />
        </span>
        <span className="brand-dark-text">Learning Management System</span>
      </Link>
    );
  }
  return (
    <Link className="brand" href={href}>
      <img className="brand-logo" src="/logo-prima-bina-insani.svg" alt={PLATFORM_NAME + " — ruang belajar"} />
    </Link>
  );
}
