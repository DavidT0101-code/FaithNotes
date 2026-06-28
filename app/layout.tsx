import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FaithNotes — Turn Every Sermon Into a Week of Growth",
  description:
    "Upload any sermon and instantly receive a personalized week of spiritual growth — summaries, daily devotions, quizzes, and prayer guides.",
  openGraph: {
    title: "FaithNotes",
    description: "Turn every sermon into a week of spiritual growth.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
