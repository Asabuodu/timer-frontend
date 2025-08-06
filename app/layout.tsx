

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Include weights you want to use
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Simp",
  description: "A simple and intuitive timer app to help you manage your time effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1390038745883140"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
