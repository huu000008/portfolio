import type { Metadata } from "next";
import "@/styles/global.scss";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js 15 with custom theme system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body>
        <ThemeScript />
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
