import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FaithNotes — Turn Sermons into Spiritual Growth",
  description:
    "Upload any sermon and instantly transform it into a week of spiritual growth with AI-powered summaries, devotions, and quizzes.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafaf9]">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
