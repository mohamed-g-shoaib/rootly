import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { DashboardColorThemeStyle } from "@/components/dashboard-color-theme-style"
import { ThemeProvider } from "@/components/theme-provider"
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast"

import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body suppressHydrationWarning>
        <DashboardColorThemeStyle />
        <ThemeProvider>
          <ToastProvider>
            <AnchoredToastProvider>{children}</AnchoredToastProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
