import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CookieBanner from "@/components/ui/CookieBanner";
import QuickViewModal from "@/components/ui/QuickViewModal";
import Script from "next/script";
import CompareDrawer from "@/components/ui/CompareDrawer";

export const metadata: Metadata = {
  title: {
    default: "Best Trending Products India 2026 | SmartEssentials Hub",
    template: "%s | SmartEssentials Hub",
  },
  description:
    "Discover the best trending, student-essential, and budget products in India 2026. Curated weekly with honest reviews and the best Amazon deals.",
  keywords: [
    "trending products India 2026",
    "student essentials India",
    "best products under 999",
    "amazon deals India",
    "ai tools students",
    "best earbuds India",
    "budget laptop accessories India",
  ],
  openGraph: {
    title: "Best Trending Products India 2026 | SmartEssentials Hub",
    description:
      "Handpicked essentials updated weekly for Indian students & professionals.",
    url: "https://smartessentials.vercel.app",
    siteName: "SmartEssentials Hub",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Trending Products India 2026",
    description: "Curated student essentials & deals — updated weekly.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  alternates: { canonical: "https://smartessentials.vercel.app" },
};

export const viewport = {
  themeColor: "#d946ef",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="SmartEssentials" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/*
          ── GA4 ── Uncomment + replace G-XXXXXXXXXX ──────────────────────────
          Get your Measurement ID from: analytics.google.com → Data Streams
        */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" /> */}
        {/* <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');` }} /> */}

        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-script" strategy="afterInteractive">
              {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
      `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-white text-ink font-body antialiased">
        <ToastProvider>
          {children}
          {/* Global overlays — rendered once at root level */}
          <QuickViewModal />
          <CompareDrawer />
          <ScrollToTop />
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
