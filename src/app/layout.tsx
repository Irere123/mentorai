import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";

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
      <body className={`antialiased`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
