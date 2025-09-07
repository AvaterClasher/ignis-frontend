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
