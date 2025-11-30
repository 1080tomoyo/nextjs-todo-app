import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TodoProvider } from "./contexts/TodoContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TODOアプリ",
  description: "Route Handler + Prisma TODO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <TodoProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b bg-white/80 backdrop-blur">
              <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-semibold tracking-tight">
                  TODOアプリ
                </h1>
                <p className="text-xs text-slate-500">
                  Next.js / Route Handler / Prisma
                </p>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t bg-white/60">
              <div className="max-w-4xl mx-auto px-4 py-3 text-xs text-slate-400">
                課題ToDoアプリ
              </div>
            </footer>
          </div>
        </TodoProvider>
      </body>
    </html>
  );
}
