import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { QueryProvider, WalletProvider } from '@/components/providers';
import './globals.css';

// Headings - geometric, techy, slightly playful
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700'],
  display: 'swap',
});

// Body text - clean, readable, professional
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'AssetMonsters - Your Assets, Alive',
  description: 'Watch your assets come alive as evolving creatures',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen" suppressHydrationWarning>
        <WalletProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
