import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#2D2926',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'ShuttrBooth — Aesthetic Photobooth',
  description:
    'Create beautiful photo strips with real-time filters. A papery, editorial photobooth experience straight from your browser.',
  keywords: ['photobooth', 'photo strip', 'filters', 'aesthetic', 'camera', 'vintage'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ShuttrBooth',
  },
  openGraph: {
    title: 'ShuttrBooth — Aesthetic Photobooth',
    description: 'Capture film-quality memories with real-time filters and beautiful photo strips.',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ShuttrBooth" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2022366633301528"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-paper text-charcoal antialiased min-h-screen">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
