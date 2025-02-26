import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BMetrics",
  description:
    "BMetrics is a dynamic and intuitive software application designed to track and analyze behavior data, specifically in the context of Applied Behavior Analysis (ABA)...",
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "32x32",
      url: "/bmetrics-logo-removebg.ico?v=1", // Versioned URL for .ico file
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/bmetrics-logo-removebg.png?v=1", // Versioned URL for .png file
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/bmetrics-logo-removebg.png?v=1", // Versioned URL for 16x16 .png file
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/bmetrics-logo-removebg.png?v=1", // Versioned Apple touch icon
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
