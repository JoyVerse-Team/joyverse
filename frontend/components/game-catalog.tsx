"use client"

import GameCard from "./game-card"

// Game data structure - easily expandable
const games = [
  {
    id: "snake-game",
    name: "Snake Word Adventure",
    description:
      "Guide the magical snake through enchanted gardens while collecting letters to form powerful words. Master spelling in this thrilling adventure!",
    difficulty: "Easy",
    category: "Spelling & Strategy",
    icon: "🐍",
    color: "from-emerald-500 to-green-700",
    route: "/snake-game",
  },
  {
    id: "car-game",
    name: "WordCatcher Car Race", 
    description:
      "Drive through lanes to catch the correct letters and complete words! Navigate your car with precision timing in this high-speed word adventure.",
    difficulty: "Medium",
    category: "Driving & Vocabulary",
    icon: "🚗",
    color: "from-blue-500 to-purple-700",
    route: "/car_game",
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
    <section id="games-catalog" className="relative min-h-screen py-20 overflow-hidden">
      {/* Enhanced Dark Glassmorphic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
        {/* Large animated gradient orbs */}
        <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Enhanced floating particles with glassmorphic effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { left: '10%', top: '20%', delay: '0s', duration: '4s', size: 'w-3 h-3' },
            { left: '80%', top: '30%', delay: '1s', duration: '5s', size: 'w-2 h-2' },
            { left: '30%', top: '60%', delay: '2s', duration: '6s', size: 'w-4 h-4' },
            { left: '70%', top: '80%', delay: '0.5s', duration: '4.5s', size: 'w-2 h-2' },
            { left: '50%', top: '15%', delay: '1.5s', duration: '5.5s', size: 'w-3 h-3' },
            { left: '20%', top: '70%', delay: '3s', duration: '4s', size: 'w-2 h-2' },
            { left: '90%', top: '60%', delay: '2.5s', duration: '5s', size: 'w-3 h-3' },
            { left: '60%', top: '40%', delay: '1.8s', duration: '4.8s', size: 'w-2 h-2' }
          ].map((particle, i) => (
            <div
              key={i}
              className={`absolute ${particle.size} bg-white/30 backdrop-blur-sm rounded-full 
                         border border-white/20 animate-bounce shadow-lg`}
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            />
          ))}
        </div>

        {/* Glassmorphic mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent backdrop-blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block p-8 rounded-3xl 
                        bg-gradient-to-br from-white/5 via-transparent to-white/3
                        backdrop-blur-sm border border-white/30
                        shadow-[0_16px_40px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
              🎮 Choose Your Game!
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Pick a game below and start your learning adventure! More games coming soon! 🌟
            </p>
          </div>
        </div>        
        
        {/* Enhanced Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <div key={game.id} className="flex">
              <GameCard game={game} />
            </div>
          ))}

          {/* Coming Soon Card - Enhanced */}
          <div className="flex">
            <div className="w-full relative rounded-3xl border border-white/30 
                          bg-gradient-to-br from-white/5 via-transparent to-white/3
                          backdrop-blur-sm backdrop-saturate-200
                          shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]
                          hover:shadow-[0_20px_40px_rgba(139,92,246,0.1),0_0_0_1px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
                          hover:bg-gradient-to-br hover:from-white/8 hover:via-transparent hover:to-white/5
                          hover:border-white/40 hover:backdrop-blur-md
                          transform hover:scale-105 transition-all duration-500 
                          p-8 flex flex-col items-center justify-center text-center min-h-[280px] overflow-hidden">
              
              {/* Light shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent 
                            transform -skew-x-12 -translate-x-full
                            hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 animate-bounce">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">More Games Coming Soon!</h3>
                <p className="text-white/70 text-lg">We're working on exciting new games for you!</p>
                <div className="mt-4 flex gap-2 justify-center">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                  ))}
                </div>
              </div>
              
              {/* Corner highlights */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-tl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-white/5 to-transparent rounded-br-3xl"></div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-20 text-center">
          <div className="inline-block p-6 rounded-2xl 
                        bg-gradient-to-br from-white/3 via-transparent to-white/2
                        backdrop-blur-sm border border-white/20
                        shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-semibold text-white/90 mb-2 drop-shadow-lg">
              ✨ More Adventures Await!
            </h3>
            <p className="text-white/70 drop-shadow-md">
              We're constantly adding new therapeutic games and activities to help with your journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
