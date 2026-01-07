import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Menggunakan font Inter untuk kesan modern dan bersih (cocok untuk UI/UX minimalis)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // Solusi untuk warning metadataBase
  metadataBase: new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://kkn-pabean-udik.vercel.app" // Ganti dengan domain asli kamu nanti
  ),
  title: {
    default: "KKN Pabean Udik 2026",
    template: "%s | KKN Pabean Udik",
  },
  description: "Website resmi dokumentasi dan program kerja KKN Desa Pabean Udik 2026.",
  icons: {
    icon: "/favicon.ico", // Pastikan file ini ada di folder public
  },
  openGraph: {
    title: "KKN Pabean Udik 2026",
    description: "Mengabdi untuk masyarakat Pabean Udik.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} antialiased bg-white text-slate-900 selection:bg-blue-100`}
      >
        {/* Kamu bisa menambahkan Navbar global di sini nanti */}
        
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer sederhana */}
        <footer className="py-10 border-t text-center text-sm text-slate-500">
          <p>© 2026 KKN Pabean Udik. Dibuat dengan Next.js & Neon.</p>
        </footer>
      </body>
    </html>
  );
}