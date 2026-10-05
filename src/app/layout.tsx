import type { Metadata } from "next";
import { Libre_Baskerville, Manrope } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Adeyinka Bakare Fellowship | Empowering IT Students",
  description: "Scholarships, mentorship, and career development for Information Technology students at the University of Ilorin.",
  icons: {
    icon: "/brand/favicon.ico",
    shortcut: "/brand/favicon-16x16.png",
    apple: "/brand/apple-touch-icon.png",
  },
  manifest: "/brand/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/brand/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/brand/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/brand/apple-touch-icon.png" />
        <link rel="manifest" href="/brand/site.webmanifest" />
      </head>
      <body className={`${bodyFont.className} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
