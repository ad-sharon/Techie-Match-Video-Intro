import type { Metadata } from "next";
import "./globals.css";

import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "TechiesMatch",
  description: "Connect with Tech Professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased max-w-[440px] mx-auto`}>
        {children}
      </body>
    </html>
  );
}
