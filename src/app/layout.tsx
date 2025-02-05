import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";
import { Navbar } from "@/components/navbar";
import { History } from "@/components/history";

export const metadata: Metadata = {
  metadataBase: new URL("https://mentorrai.vercel.app"),
  title: "MentorAI",
  description: "Your Personal code mentor using Retrieval Augmented Generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster position="top-center" />
        <div className="flex flex-row">
          <History />
          <div className="flex flex-col flex-1 bg-white dark:bg-zinc-900">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
