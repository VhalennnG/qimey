import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qimey - Kalkulator Arus Kas Akhir Tahun",
  description:
    "Ketahui sisa saldo tabungan kumulatif Anda dari bulan berjalan sampai Desember secara transparan dan aman di browser lokal Anda.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
