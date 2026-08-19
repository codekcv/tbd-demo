import type { Metadata } from "next";
import "./globals.css";

// No webfont on purpose. myb-ui ships none, so the system stack defined in globals.css
// is what the product actually looks like.

export const metadata: Metadata = {
  title: "Concept Scoreboard",
  description:
    "A trunk-based development demo: one branch, short-lived branches, and feature flags.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
