/**
 * ===============================================================
 * Root Layout Component - Next.js App Router Layout
 * ===============================================================
 * 
 * This is the root layout component that wraps all pages in the application.
 * It provides:
 * 1. Global font configuration using Google Fonts
 * 2. Application-wide CSS imports
 * 3. Authentication context provider
 * 4. HTML metadata for SEO and accessibility
 * 
 * Fonts Used:
 * - Lexend: Primary font, designed for better reading comprehension
 * - Inter: Fallback font for system compatibility
 * 
 * Authentication:
 * - Wraps entire app in AuthProvider for user state management
 * - Provides login/logout functionality across all pages
 * - Manages user sessions and role-based access
 */

import type React from "react"
import type { Metadata } from "next"
import { Inter, Lexend } from "next/font/google"
import "./globals.css"         // Global styles including Tailwind CSS
import "./fonts.css"           // Custom font styles and animations
import { AuthProvider } from "@/components/auth-provider"

// Configure Google Fonts
const inter = Inter({ subsets: ["latin"] })

// Lexend font - optimized for reading comprehension (ideal for dyslexic children)
const lexend = Lexend({ 
  subsets: ["latin"],
  variable: '--font-lexend'  // CSS variable for use in components
})

// SEO metadata for the application
export const metadata: Metadata = {
  title: "JoyVerse - Making Learning Joyful for Every Mind",
  description:
    "An emotion-aware educational platform designed specifically for dyslexic children. Learn through games with AI-powered adaptation and emotional support.",
  keywords: "dyslexia, educational games, kids learning, emotion-aware AI, special needs education, learning difficulties",
  generator: 'JoyVerse'
}

/**
 * Root Layout Component
 * 
 * This component:
 * 1. Sets up the HTML structure with proper lang attribute
 * 2. Applies global fonts using CSS variables
 * 3. Wraps all content in AuthProvider for authentication
 * 4. Provides consistent styling across all pages
 * 
 * @param {React.ReactNode} children - Child components/pages to render
 * @returns {JSX.Element} The root layout HTML structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} font-sans`}>
        {/* Authentication Provider wraps entire app */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
