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
  title: "Palestine Memorial - Honoring All Lives Lost",
  description: "A comprehensive interactive memorial honoring Palestinian lives lost in Gaza and the West Bank. Over 63,000 souls remembered - their names, ages, and stories preserved in digital remembrance. 🕯️",
  keywords: ["Palestine", "Gaza", "West Bank", "Memorial", "Remembrance", "Interactive", "Lives Lost", "Memorial Wall", "Journalists", "Children", "Civilians"],
  authors: [{ name: "Palestine Memorial Project" }],
  openGraph: {
    title: "Palestine Memorial - Honoring All Lives Lost",
    description: "Each light represents a life lost. Visit this comprehensive interactive memorial to honor Palestinian souls from Gaza and the West Bank.",
    type: "website",
    locale: "en_US",
    siteName: "Palestine Memorial",
    images: [
      {
        url: "/memorial-preview.jpg", // You would need to add this image
        width: 1200,
        height: 630,
        alt: "Palestine Memorial - Interactive visualization honoring all lives lost",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palestine Memorial - Honoring All Lives Lost",
    description: "Each light represents a life lost. A comprehensive interactive memorial for Palestinian souls from Gaza and the West Bank. 🕯️",
    images: ["/memorial-preview.jpg"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
