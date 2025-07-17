/**
 * ===============================================================
 * Navbar Component - Application Navigation Header
 * ===============================================================
 * 
 * This component provides the main navigation header for the application.
 * It adapts based on user authentication state and provides:
 * 1. Brand logo and title
 * 2. Authentication buttons (login/signup) when not authenticated
 * 3. User dropdown menu when authenticated
 * 4. Responsive design for mobile and desktop
 * 
 * Features:
 * - Glassmorphic design with backdrop blur
 * - Sticky positioning for always-visible navigation
 * - Dropdown menu with user actions
 * - Responsive text and button sizing
 * - Smooth hover animations and transitions
 * - Gradient styling consistent with app theme
 * 
 * Authentication States:
 * - Not authenticated: Shows login/signup buttons
 * - Authenticated: Shows user dropdown with profile and logout
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gamepad2, User, UserPlus, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Navbar Component
 * 
 * Main navigation header that adapts to authentication state
 * 
 * @returns {JSX.Element} The navbar component
 */
export default function Navbar() {
  // Get authentication state from context
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-4 border-gradient-to-r from-purple-400 to-pink-400">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand Section */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Joy-Verse
              </h1>
              <p className="text-sm text-gray-500 hidden md:block">Fun Learning Games</p>
            </div>
          </Link>

          {/* Authentication Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              /* Authenticated User Dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    <span>My Games</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Not Authenticated - Show Login/Signup Buttons */
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
