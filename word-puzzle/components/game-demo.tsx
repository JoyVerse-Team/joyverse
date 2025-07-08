"use client"

import { useState } from "react"
import WordPuzzleGame from "./word-puzzle-game"

interface GameResult {
  imageShown: string
  correctWord: string
  userAnswer: string
  timeTaken: number
  isCorrect: boolean
}

const sampleGames = [
  {
    image: "/placeholder.svg?height=200&width=200",
    word: "APPLE",
    hint: "A red or green fruit",
  },
  {
    image: "/placeholder.svg?height=200&width=200",
    word: "HOUSE",
    hint: "A place where people live",
  },
  {
    image: "/placeholder.svg?height=200&width=200",
    word: "OCEAN",
    hint: "A large body of salt water",
  },
]

export default function GameDemo() {
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [gameResults, setGameResults] = useState<GameResult[]>([])

  const handleGameComplete = (result: GameResult) => {
    console.log("Game completed:", result)
    setGameResults((prev) => [...prev, result])

    // Simulate saving to backend
    // This is where you would integrate with your server.js and MongoDB
    // saveGameResult(result)
  }

  const nextGame = () => {
    setCurrentGameIndex((prev) => (prev + 1) % sampleGames.length)
  }

  const prevGame = () => {
    setCurrentGameIndex((prev) => (prev - 1 + sampleGames.length) % sampleGames.length)
  }

  return (
    <div className="relative">
      <WordPuzzleGame gameData={sampleGames[currentGameIndex]} onGameComplete={handleGameComplete} />

      {/* Game Navigation */}
      <div className="fixed top-4 left-4 right-4 z-20 flex justify-between">
        <button
          onClick={prevGame}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/90 transition-all"
        >
          ← Previous
        </button>
        <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          Game {currentGameIndex + 1} of {sampleGames.length}
        </div>
        <button
          onClick={nextGame}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/90 transition-all"
        >
          Next →
        </button>
      </div>

      {/* Results Panel (for development) */}
      {gameResults.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20 max-h-32 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
            <h3 className="font-semibold mb-2">Game Results:</h3>
            {gameResults.slice(-3).map((result, index) => (
              <div key={index} className="text-sm mb-1">
                {result.correctWord}: {result.isCorrect ? "✅" : "❌"}({(result.timeTaken / 1000).toFixed(1)}s)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
