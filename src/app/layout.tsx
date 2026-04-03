import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Camp.IQ",
  description: "Plan your perfect camping trip in minutes, not hours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
