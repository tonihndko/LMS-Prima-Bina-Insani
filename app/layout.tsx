import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PLATFORM_NAME } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: PLATFORM_NAME, template: "%s · " + PLATFORM_NAME },
  description: "Ruang belajar untuk latihan, penilaian, dan progres peserta.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#konten">Lewati ke konten</a>
        {children}
      </body>
    </html>
  );
}
