"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Shuffle, RotateCcw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GameData {
  image: string
  word: string
  hint?: string
}

interface WordPuzzleGameProps {
  gameData?: GameData
  onGameComplete?: (result: GameResult) => void
  className?: string
}

interface GameResult {
  imageShown: string
  correctWord: string
  userAnswer: string
  timeTaken: number
  isCorrect: boolean
}

interface LetterTile {
  id: string
  letter: string
  isPlaced: boolean
  originalIndex: number
}

export default function WordPuzzleGame({
  gameData = {
    image: "/placeholder.svg?height=200&width=200",
    word: "APPLE",
    hint: "A red or green fruit",
  },
  onGameComplete,
  className = "",
}: WordPuzzleGameProps) {
  const [letters, setLetters] = useState<LetterTile[]>([])
  const [placedLetters, setPlacedLetters] = useState<(LetterTile | null)[]>([])
  const [draggedLetter, setDraggedLetter] = useState<LetterTile | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [gameData])

  // Check for completion
  useEffect(() => {
    if (placedLetters.length === gameData.word.length && placedLetters.every((letter) => letter !== null)) {
      const userWord = placedLetters.map((letter) => letter?.letter).join("")
      const isCorrect = userWord === gameData.word
      setIsComplete(isCorrect)

      if (onGameComplete) {
        const result: GameResult = {
          imageShown: gameData.image,
          correctWord: gameData.word,
          userAnswer: userWord,
          timeTaken: Date.now() - startTime,
          isCorrect,
        }
        onGameComplete(result)
      }
    }
  }, [placedLetters, gameData.word, onGameComplete, startTime, gameData.image])

  const initializeGame = () => {
    const shuffledLetters = gameData.word
      .split("")
      .map((letter, index) => ({
        id: `${letter}-${index}`,
        letter,
        isPlaced: false,
        originalIndex: index,
      }))
      .sort(() => Math.random() - 0.5)

    setLetters(shuffledLetters)
    setPlacedLetters(new Array(gameData.word.length).fill(null))
    setIsComplete(false)
    setDragOverIndex(null)
  }

  const handleDragStart = (e: React.DragEvent, letter: LetterTile) => {
    setDraggedLetter(letter)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (!draggedLetter) return

    // Remove letter from its current position if it was already placed
    const newPlacedLetters = [...placedLetters]
    const currentIndex = newPlacedLetters.findIndex((l) => l?.id === draggedLetter.id)
    if (currentIndex !== -1) {
      newPlacedLetters[currentIndex] = null
    }

    // If target position is occupied, move that letter back to available letters
    if (newPlacedLetters[targetIndex]) {
      const displacedLetter = newPlacedLetters[targetIndex]!
      setLetters((prev) => [
        ...prev.filter((l) => l.id !== displacedLetter.id),
        { ...displacedLetter, isPlaced: false },
      ])
    }

    // Place the dragged letter in the target position
    newPlacedLetters[targetIndex] = { ...draggedLetter, isPlaced: true }
    setPlacedLetters(newPlacedLetters)

    // Remove the letter from available letters
    setLetters((prev) => prev.filter((l) => l.id !== draggedLetter.id))
    setDraggedLetter(null)
  }

  const handleLetterClick = (letter: LetterTile) => {
    // Find first empty slot
    const emptyIndex = placedLetters.findIndex((l) => l === null)
    if (emptyIndex !== -1) {
      const newPlacedLetters = [...placedLetters]
      newPlacedLetters[emptyIndex] = { ...letter, isPlaced: true }
      setPlacedLetters(newPlacedLetters)
      setLetters((prev) => prev.filter((l) => l.id !== letter.id))
    }
  }

  const handlePlacedLetterClick = (index: number) => {
    const letter = placedLetters[index]
    if (letter) {
      const newPlacedLetters = [...placedLetters]
      newPlacedLetters[index] = null
      setPlacedLetters(newPlacedLetters)
      setLetters((prev) => [...prev, { ...letter, isPlaced: false }])
    }
  }

  const shuffleLetters = () => {
    setLetters((prev) => [...prev].sort(() => Math.random() - 0.5))
  }

  const resetGame = () => {
    initializeGame()
  }

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-gradient-x">
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-400 via-green-500 to-yellow-500 opacity-70 animate-gradient-y"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 animate-pulse"></div>
      </div>

      {/* Game Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 bg-black/10 backdrop-blur-sm">
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 space-y-6">
          {/* Game Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Word Puzzle</h1>
            {gameData.hint && <p className="text-sm text-gray-600">Hint: {gameData.hint}</p>}
          </div>

          {/* Object Image */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg bg-white">
              <img
                src={gameData.image || "/placeholder.svg"}
                alt="Guess this object"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Letter Boxes */}
          <div className="flex justify-center gap-2 flex-wrap">
            {placedLetters.map((letter, index) => (
              <div
                key={index}
                className={`
                  w-12 h-12 border-2 border-dashed border-gray-400 rounded-lg
                  flex items-center justify-center text-xl font-bold
                  transition-all duration-200 cursor-pointer
                  ${dragOverIndex === index ? "border-blue-500 bg-blue-50 scale-105" : ""}
                  ${letter ? "bg-blue-100 border-blue-500 border-solid" : "bg-gray-50"}
                `}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => handlePlacedLetterClick(index)}
              >
                {letter ? letter.letter : "_"}
              </div>
            ))}
          </div>

          {/* Available Letters */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Available Letters</h3>
              <Button variant="outline" size="sm" onClick={shuffleLetters} className="h-8 px-3 bg-transparent">
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center gap-2 flex-wrap min-h-[60px] p-3 bg-gray-50 rounded-xl">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter)}
                  onClick={() => handleLetterClick(letter)}
                  className="
                    w-12 h-12 bg-white border-2 border-gray-300 rounded-lg
                    flex items-center justify-center text-xl font-bold
                    cursor-grab active:cursor-grabbing hover:border-blue-400
                    transition-all duration-200 hover:scale-105 hover:shadow-md
                    select-none touch-manipulation
                  "
                >
                  {letter.letter}
                </div>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={resetGame} className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Success Message */}
          {isComplete && (
            <div className="text-center p-4 bg-green-100 rounded-xl border border-green-300">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Congratulations!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">You solved the puzzle correctly!</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(-100%);
          }
        }
        @keyframes gradient-y {
          0%, 100% {
            transform: translateY(0%);
          }
          50% {
            transform: translateY(-100%);
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
        .animate-gradient-y {
          animation: gradient-y 20s ease infinite;
        }
      `}</style>
    </div>
  )
}
