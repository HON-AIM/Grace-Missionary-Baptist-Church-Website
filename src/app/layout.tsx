import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gmbc.org"),
  title: {
    default: "Grace Missionary Baptist Church | Embracing Faith, Compassion & Togetherness",
    template: "%s | GMBC",
  },
  description:
    "Grace Missionary Baptist Church (GMBC) is a fellowship-driven church based on rich biblical values, spiritual growth, prayer, worship, and community impact.",
  keywords: [
    "Grace Missionary Baptist Church",
    "GMBC",
    "church",
    "faith",
    "worship",
    "Bible study",
    "prayer",
    "community",
  ],
  openGraph: {
    title: "Grace Missionary Baptist Church",
    description:
      "Embracing Faith, Compassion and Togetherness",
    url: "/",
    siteName: "GMBC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grace Missionary Baptist Church",
    description:
      "Embracing Faith, Compassion and Togetherness",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
