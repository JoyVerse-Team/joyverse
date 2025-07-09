"use client"

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
    <div className="group relative">
      {/* Solid Colored Card */}
      <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${game.color} 
                      border border-white/20 shadow-xl hover:shadow-2xl
                      transform hover:scale-105 transition-all duration-300 ease-out
                      cursor-pointer min-h-[400px] flex flex-col`}>
        
        {/* Icon Container */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">{game.icon}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
          {game.name}
        </h3>
        
        {/* Description */}
        <p className="text-white/90 text-base leading-relaxed mb-6 flex-grow">
          {game.description}
        </p>

        {/* Feature List */}
        <div className="mb-6">
          <div className="space-y-2">
            {[
              "Interactive Learning",
              "Progress Tracking", 
              "Skill Building",
              "Fun & Engaging"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                <span className="text-white/90 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {game.category}
            </span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {game.difficulty}
            </span>
          </div>
          
          {/* Play Button */}
          <button
            onClick={handlePlayNow}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     text-white font-bold py-3 px-6 rounded-xl
                     border border-white/30 hover:border-white/50
                     transition-all duration-300 transform hover:scale-105
                     flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </button>
        </div>
      </div>
    </div>
  )
}
