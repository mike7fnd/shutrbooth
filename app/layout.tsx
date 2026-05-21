import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShuttrBooth — Aesthetic Photobooth',
  description:
    'Create beautiful photo strips with real-time filters. A papery, editorial photobooth experience straight from your browser.',
  keywords: ['photobooth', 'photo strip', 'filters', 'aesthetic', 'camera', 'vintage'],
  openGraph: {
    title: 'ShuttrBooth — Aesthetic Photobooth',
    description: 'Capture film-quality memories with real-time filters and beautiful photo strips.',
    type: 'website',
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
      </head>
      <body className="bg-paper text-charcoal antialiased min-h-screen">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
