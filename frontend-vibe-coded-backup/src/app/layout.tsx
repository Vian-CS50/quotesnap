import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quotesnap.com.au"),
  title: "QuoteSnap — AI Quotes for Adelaide Landscapers",
  description: "Turn your voice memo into a professional landscaping quote in 30 seconds. Built for Adelaide landscapers. $25.99/mo with 7-day free trial.",
  keywords: ["landscaping quotes", "Adelaide landscapers", "AI quote generator", "landscape quote software", "tradies Australia"],
  authors: [{ name: "QuoteSnap" }],
  creator: "QuoteSnap",
  publisher: "QuoteSnap",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://quotesnap.com.au",
    siteName: "QuoteSnap",
    title: "QuoteSnap — AI Quotes for Adelaide Landscapers",
    description: "Turn your voice memo into a professional landscaping quote in 30 seconds. Built for Adelaide landscapers.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QuoteSnap — AI quote generator for Adelaide landscapers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteSnap — AI Quotes for Adelaide Landscapers",
    description: "Turn your voice memo into a professional landscaping quote in 30 seconds.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://quotesnap.com.au",
  },
  other: {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com;",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F1EB" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSerif.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = saved || (prefersDark ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Simple Analytics — privacy-friendly, no cookie banner needed */}
        <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js" />
        <noscript>
          <img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerPolicy="no-referrer-when-downgrade" />
        </noscript>
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
