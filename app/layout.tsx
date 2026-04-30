import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { QueryProvider } from "@/components/query-provider"
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: "%s | Rootly",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  manifest: "/manifest.webmanifest",
  category: "education",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <AnchoredToastProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </AnchoredToastProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
