import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FocusFlow — Make Space for What Matters",
    template: "%s | FocusFlow",
  },
  description:
    "A thoughtful productivity workspace to organize tasks, manage projects, and focus on meaningful work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
