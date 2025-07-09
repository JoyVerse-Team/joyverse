import type React from "react"
import type { Metadata } from "next"
import { Inter, Lexend } from "next/font/google"
import "./globals.css"
import "./fonts.css"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })
const lexend = Lexend({ 
  subsets: ["latin"],
  variable: '--font-lexend'
})

export const metadata: Metadata = {
  title: "JoyVerse - Making Learning Joyful for Every Mind",
  description:
    "An emotion-aware educational platform designed specifically for dyslexic children. Learn through games with AI-powered adaptation and emotional support.",
  keywords: "dyslexia, educational games, kids learning, emotion-aware AI, special needs education, learning difficulties",
  generator: 'JoyVerse'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
