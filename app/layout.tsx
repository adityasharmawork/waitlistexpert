import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";
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
  title: {
    default: "waitlist.expert — Build your audience before you launch",
    template: "%s | waitlist.expert",
  },
  description:
    "Create a viral waitlist for your product in 3 minutes. Built-in referral mechanics, real-time analytics, and a discovery feed for pre-launch products.",
  openGraph: {
    title: "waitlist.expert — Build your audience before you launch",
    description:
      "Create a viral waitlist for your product in 3 minutes. Built-in referral mechanics, real-time analytics, and a discovery feed.",
    siteName: "waitlist.expert",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "waitlist.expert",
    description:
      "Build your audience before you launch — with referral mechanics that make your waitlist go viral.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
