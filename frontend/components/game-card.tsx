"use client"

import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Game {
  id: string
  name: string
  description: string
  difficulty: string
  category: string
  icon: string
  color: string
  route: string
}

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const router = useRouter()
  const handlePlayNow = () => {
    // Use Next.js router for navigation
    router.push(game.route)
  }

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-purple-300 transform hover:scale-[1.02]">
      {/* Subtle gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative p-5">
        {/* Streamlined Horizontal Layout */}
        <div className="flex items-center gap-5">
          {/* Game Icon - Larger and more prominent */}
          <div className="flex-shrink-0">
            <div className="text-6xl animate-bounce-gentle filter drop-shadow-lg">{game.icon}</div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 truncate pr-4">
                {game.name}
              </h3>
              
              {/* Badges - Top right */}
              <div className="flex gap-2 flex-shrink-0">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200">
                  {game.category}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                  {game.difficulty}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{game.description}</p>
            
            {/* Bottom row - Rating and Play button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">Perfect for learning!</span>
              </div>
              
              <Button
                onClick={handlePlayNow}
                className={`bg-gradient-to-r ${game.color} hover:shadow-lg text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 group-hover:animate-pulse text-sm`}
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Play Now!
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle corner accent */}
      <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
        <div className={`w-3 h-3 bg-gradient-to-br ${game.color} rounded-full`} />
      </div>
    </div>
  )
}
