import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Catcher Game",
  description: "A fun word catching game built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
