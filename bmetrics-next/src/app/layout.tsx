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
  description: "BMetrics is a dynamic and intuitive software application designed to track and analyze behavior data, specifically in the context of Applied Behavior Analysis (ABA). Aimed at behavior analysts, educators, and clinicians, BMetrics helps users efficiently monitor various behavioral metrics, such as frequency, duration, and rate, to assess intervention efficacy and track behavioral trends over time. The platform allows users to visualize their data through interactive graphs, with customizable date ranges and measurement types. With a focus on user-friendliness and flexibility, BMetrics offers tools for data aggregation, reporting, and handling missing data, making it an essential tool for professionals in the field of behavior analysis.",
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
