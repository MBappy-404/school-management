import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "School Management System",
  description:
    "Reporting & Export Center for Bangladesh Model High School — student, teacher, fees, attendance and exam reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
