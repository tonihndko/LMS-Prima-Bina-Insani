"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

type Item = { href: string; label: string; section?: boolean };

export function PortalNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { courseId } = useParams<{ courseId?: string }>();
  const course = courseId ? "/kelas/" + courseId : "";
  const items: Item[] = isAdmin
    ? [
        { href: "/admin", label: "Dasbor" },
        { href: "/admin/akun", label: "Akun", section: true },
        { href: "/admin/kelas", label: "Kelas", section: true },
      ]
    : [
        { href: "/kelas", label: "Kelas saya" },
        ...(course ? [
          { href: course, label: "Ringkasan" },
          { href: course + "/materi", label: "Materi", section: true },
          { href: course + "/latihan", label: "Latihan", section: true },
        ] : []),
      ];

  function goBack() {
    const navigation = (window as Window & { navigation?: { canGoBack: boolean } }).navigation;
    if (navigation?.canGoBack ?? (window.history.length > 1)) {
      router.back();
      return;
    }

    const parent = items.filter(({ href }) => pathname.startsWith(href + "/")).at(-1);
    if (parent) router.replace(parent.href);
  }

  return (
    <nav className="portal-nav" aria-label="Navigasi utama">
      <button type="button" className="nav-link nav-back" onClick={goBack} aria-label="Kembali ke halaman sebelumnya" title="Kembali">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m10 6-6 6 6 6M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Kembali</span>
      </button>
      {items.map(({ href, label, section }) => (
        <Link
          key={href}
          href={href}
          className="nav-link"
          aria-current={pathname === href ? "page" : section && pathname.startsWith(href + "/") ? "location" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
