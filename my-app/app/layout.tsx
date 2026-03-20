import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import AnimatedParticles from "./landing/components/AnimatedParticles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prometheus2k26",
  description: "By IECSE",
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
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <AnimatedParticles />
        </div>
        <div className="relative min-h-screen">
          <Navbar />
          <main className="pb-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
