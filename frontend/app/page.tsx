"use client"
import Navbar from "@/components/navbar"
import GameCatalog from "@/components/game-catalog"
import { Button } from "@/components/ui/button"
import { ChevronDown, Gamepad2, Star, Sparkles, Mail, Phone, MapPin } from "lucide-react"

export default function HomePage() {
  const scrollToGames = () => {
    const gamesSection = document.getElementById("games-catalog")
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Navbar />

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-bounce">
            <Star className="w-8 h-8 text-yellow-400 fill-current" />
          </div>
          <div className="absolute top-32 right-20 animate-pulse">
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          <div className="absolute bottom-40 left-20 animate-bounce delay-1000">
            <Star className="w-6 h-6 text-blue-400 fill-current" />
          </div>
          <div className="absolute top-40 right-40 animate-pulse delay-500">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-15 text-center relative z-10">
         {/* Hero Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 animate-fade-in">
              Welcome to{" "} <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Joy Verse
              </span>
            </h1>

            <div className="mb-16">
              <Button
                onClick={scrollToGames}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-2xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce-gentle"
              >
                <Gamepad2 className="w-8 h-8 mr-4" />
                Play Games!
                <ChevronDown className="w-6 h-6 ml-4 animate-bounce" />
              </Button>
            </div>

            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-fade-in-delay">
              helping dyslexic kids learn through games
            </p>


          </div>
        </div>
      </main>

      {/* Games Catalog Section */}
      <GameCatalog />

      {/* Contact Section */}
      <section className="bg-white/80 backdrop-blur-sm py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Contact
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
              <a href="mailto:hello@joyverse.com" className="text-purple-600 hover:text-purple-800 font-medium">
                hello@joyverse.com
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">DAT contact</h3>
              <h2>dyslexic authority of telengana</h2>
              <a href="tel:+1-555-123-4567" className="text-purple-600 hover:text-purple-800 font-medium">
                1234567890
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit Us</h3>
              <address className="text-purple-600 not-italic">
                123 Learning Lane<br />
                Education City, EC 12345
              </address>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 Joy Verse. Made with ❤️ for kids with dyslexia.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
