import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PLATFORM_NAME } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: { default: PLATFORM_NAME, template: "%s · " + PLATFORM_NAME },
  description: "Ruang belajar untuk latihan, penilaian, dan progres peserta.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>
        <a className="skip-link" href="#konten">Lewati ke konten</a>
        {children}
      </body>
    </html>
  );
}
