import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://coursefocus.ai"),
  title: {
    default: "CourseFocus AI — Academy OS for Creators",
    template: "%s · CourseFocus AI",
  },
  description:
    "The operating system for your digital academy — courses, community, and subscriptions, run by one central AI.",
  icons: { icon: "/favicon.svg" },
};

// Minimal root: html/body live in [locale]/layout.tsx (App Router supports this).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
