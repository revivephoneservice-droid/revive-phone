import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import {SiteHeader} from "@/components/header";
import {SiteFooter} from "@/components/footer";
import { CartProvider } from '@/context/cart-context';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FixPhon — Аксесуари, Trade-In та підбір телефонів',
  description:
    'Одягни свій девайс, обміняй старий на новий або підбери ідеальну модель. Преміальні чохли, захисне скло, Trade-In та новинки Apple і Samsung.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans antialiased">
        <CartProvider>
          <SiteHeader />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  )
}
