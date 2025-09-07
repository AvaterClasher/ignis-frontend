import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import QueryProvider from '@/providers/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ignis',
  description: 'Secure Code Execution. Made by Soumyadip',
  openGraph: {
    images: [
      {
        url: 'https://ignis.avater.tech/og.png',
      },
    ],
    title: 'Ignis',
    description: 'Secure Code Execution. Made by Soumyadip',
    url: 'https://ignis.avater.tech',
    type: 'website',
    siteName: 'Ignis',
    locale: 'en_US',
  },
  creator: 'Soumyadip Moni',
  publisher: 'Soumyadip Moni',
  keywords: [
    'Ignis',
    'Code Execution',
    'Code Sandbox',
    'Code Runner',
    'Code Executor',
    'Code Sandbox',
    'Code Runner',
    'Code Executor',
  ],
  authors: [{ name: 'Soumyadip Moni', url: 'https://avater.tech' }],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ignis',
    description: 'Secure Code Execution. Made by Soumyadip',
    siteId: 'Avater004',
    creator: '@Avater004',
    creatorId: 'Avater004',
    images: {
      url: 'https://ignis.avater.tech/og.png',
      alt: 'Ignis',
    },
  },
  alternates: {
    canonical: 'https://ignis.avater.tech',
    types: { 'application/rss': 'https://ignis.avater.tech/rss' },
  },
  category: 'technology',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        className={`${geistSans.variable} ${geistMono.variable}`}
        lang="en"
        suppressHydrationWarning
      >
        <body className={cn('bg-background antialiased', geistSans.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem
          >
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
