"use client"

import GameCard from "./game-card"

// Game data structure - easily expandable
const games = [
  {
    id: "spelling-quiz",
    name: "Spelling Quiz",
    description:
      "🔤 Practice spelling with fun words and pictures! Perfect for building vocabulary and letter recognition.",
    difficulty: "Easy",
    category: "Spelling",
    icon: "📝",
    color: "from-blue-400 to-cyan-400",
    route: "/games/spelling-quiz", // You can update this path later
  },
  {
    id: "snake-game",
    name: "Word Snake Game",
    description:
      "🐍 Guide the snake to collect letters and spell words! Fun way to practice spelling and hand-eye coordination.",
    difficulty: "Medium",
    category: "Spelling",
    icon: "🐍",
    color: "from-green-400 to-emerald-400",
    route: "/snake-game",
  },
  // Add more games here easily:
  // {
  //   id: 'math-adventure',
  //   name: 'Math Adventure',
  //   description: '🔢 Solve fun math problems and go on exciting adventures!',
  //   difficulty: 'Medium',
  //   category: 'Math',
  //   icon: '🧮',
  //   color: 'from-green-400 to-emerald-400',
  //   route: '/games/math-adventure'
  // }
]

export default function GameCatalog() {
  return (
    <section id="games-catalog" className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">🎮 Choose Your Game!</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pick a game below and start your learning adventure! More games coming soon! 🌟
          </p>
        </div>

        {/* Games Grid */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <div key={game.id} className="w-full sm:w-auto sm:min-w-[300px] sm:max-w-[350px]">
              <GameCard game={game} />
            </div>
          ))}

          {/* Coming Soon Card */}
          <div className="w-full sm:w-auto sm:min-w-[300px] sm:max-w-[350px]">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-lg border-4 border-dashed border-gray-300 flex flex-col items-center justify-center text-center min-h-[300px] opacity-75">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">More Games Coming Soon!</h3>
              <p className="text-gray-500">We're working on exciting new games for you!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
