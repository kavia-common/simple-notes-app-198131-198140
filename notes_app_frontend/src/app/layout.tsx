import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forest Notes",
  description: "A simple, frontend-only notes app with local persistence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
