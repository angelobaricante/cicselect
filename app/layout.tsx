import type React from "react"
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "CICSelect - Online Voting System",
  description: "Online Voting System for the College of Informatics and Computing Sciences - Student Council",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          <main>{children}</main>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

