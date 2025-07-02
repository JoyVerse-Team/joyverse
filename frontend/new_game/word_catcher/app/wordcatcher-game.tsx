"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

// Game constants
const INITIAL_LANES = 3
const MAX_LANES = 7
const LANE_INCREASE_THRESHOLD = 5
const LANE_DECREASE_THRESHOLD = 3 // Decrease lanes after 3 mistakes
const INITIAL_SPEED = 1.2
const SPEED_INCREMENT = 0.2
const LETTER_SIZE = 60

// Expanded word bank with missing letters
const WORD_BANK = [
  { word: "CAT", missing: [1], answer: "A" },
  { word: "DOG", missing: [1], answer: "O" },
  { word: "SUN", missing: [1], answer: "U" },
  { word: "TREE", missing: [2], answer: "E" },
  { word: "HOUSE", missing: [1], answer: "O" },
  { word: "WATER", missing: [1], answer: "A" },
  { word: "HAPPY", missing: [1], answer: "A" },
  { word: "LIGHT", missing: [1], answer: "I" },
  { word: "MUSIC", missing: [1], answer: "U" },
  { word: "FRIEND", missing: [2], answer: "I" },
  { word: "SCHOOL", missing: [3], answer: "O" }, // Fixed: O is at index 3, not H
  { word: "FLOWER", missing: [2], answer: "O" }, // Fixed: O is at index 2, not L
  { word: "GARDEN", missing: [1], answer: "A" },
  { word: "ANIMAL", missing: [0], answer: "A" },
  { word: "PLANET", missing: [2], answer: "A" },
  { word: "FOREST", missing: [1], answer: "O" },
  { word: "BRIDGE", missing: [2], answer: "I" },
  { word: "CASTLE", missing: [1], answer: "A" },
  { word: "DRAGON", missing: [2], answer: "A" },
  { word: "WIZARD", missing: [1], answer: "I" },
  { word: "KNIGHT", missing: [2], answer: "I" },
  { word: "PRINCE", missing: [2], answer: "I" },
  { word: "QUEEN", missing: [2], answer: "E" },
  { word: "MAGIC", missing: [1], answer: "A" },
  { word: "STORY", missing: [2], answer: "O" },
  { word: "DREAM", missing: [2], answer: "E" },
  { word: "SMILE", missing: [2], answer: "I" },
  { word: "LAUGH", missing: [1], answer: "A" },
  { word: "DANCE", missing: [1], answer: "A" },
  { word: "PAINT", missing: [1], answer: "A" },
]

// Dyslexia confusion sets for distractors
const CONFUSION_SETS = {
  A: ["E", "O"],
  E: ["A", "I"],
  I: ["E", "Y"],
  O: ["A", "U"],
  U: ["O", "A"],
  B: ["D", "P"],
  D: ["B", "Q"],
  P: ["B", "Q"],
  Q: ["P", "D"],
  M: ["N", "W"],
  N: ["M", "H"],
  H: ["N", "M"],
  L: ["I", "T"],
  Y: ["V", "U"],
}

interface Letter {
  id: number
  char: string
  lane: number
  yPosition: number
  isCorrect: boolean
}

interface Scenery {
  id: number
  type: "tree" | "streetlight"
  side: "left" | "right"
  yPosition: number
}

interface GameState {
  score: number
  lanes: number
  speed: number
  currentWord: (typeof WORD_BANK)[0]
  playerLane: number
  letters: Letter[]
  scenery: Scenery[]
  gameRunning: boolean
  feedbackType: "success" | "error" | null
  feedbackMessage: string
  mistakesInCurrentLanes: number // Track mistakes in current lane configuration
}

export default function WordCatcherGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lanes: INITIAL_LANES,
    speed: INITIAL_SPEED,
    currentWord: WORD_BANK[0],
    playerLane: 1,
    letters: [],
    scenery: [],
    gameRunning: false,
    feedbackType: null,
    feedbackMessage: "",
    mistakesInCurrentLanes: 0,
  })

  const gameLoopRef = useRef<number>()
  const letterIdRef = useRef(0)
  const sceneryIdRef = useRef(0)
  const lastLetterSpawnRef = useRef(0)
  const lastScenerySpawnRef = useRef(0)
  const feedbackTimeoutRef = useRef<NodeJS.Timeout>()

  // Generate distractors for current answer
  const generateDistractors = useCallback((correctAnswer: string, count: number) => {
    const confusionSet = CONFUSION_SETS[correctAnswer] || ["X", "Y", "Z"]
    const distractors = [...confusionSet]

    // Add random letters if we need more distractors
    while (distractors.length < count) {
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      if (randomLetter !== correctAnswer && !distractors.includes(randomLetter)) {
        distractors.push(randomLetter)
      }
    }

    return distractors.slice(0, count)
  }, [])

  // Spawn scenery items
  const spawnScenery = useCallback(() => {
    if (!gameState.gameRunning) return

    const now = Date.now()
    if (now - lastScenerySpawnRef.current < 1500) return // Spawn scenery every 1.5 seconds

    lastScenerySpawnRef.current = now

    // Spawn multiple scenery items for denser environment
    const itemsToSpawn = Math.random() > 0.5 ? 2 : 1

    for (let i = 0; i < itemsToSpawn; i++) {
      const sceneryType = Math.random() > 0.4 ? "tree" : "streetlight" // More trees
      const side = Math.random() > 0.5 ? "left" : "right"

      const newScenery: Scenery = {
        id: sceneryIdRef.current++,
        type: sceneryType,
        side: side,
        yPosition: -100 - i * 80, // Stagger multiple items
      }

      setGameState((prev) => ({
        ...prev,
        scenery: [...prev.scenery, newScenery],
      }))
    }
  }, [gameState.gameRunning])

  // Spawn new letters
  const spawnLetters = useCallback(() => {
    if (!gameState.gameRunning) return

    const now = Date.now()
    if (now - lastLetterSpawnRef.current < 5000) return // Spawn every 5 seconds

    lastLetterSpawnRef.current = now
    const correctLane = Math.floor(Math.random() * gameState.lanes)
    const distractors = generateDistractors(gameState.currentWord.answer, gameState.lanes - 1)

    const newLetters: Letter[] = []

    for (let lane = 0; lane < gameState.lanes; lane++) {
      const isCorrect = lane === correctLane
      const char = isCorrect ? gameState.currentWord.answer : distractors[lane < correctLane ? lane : lane - 1]

      newLetters.push({
        id: letterIdRef.current++,
        char,
        lane,
        yPosition: -200,
        isCorrect,
      })
    }

    setGameState((prev) => ({
      ...prev,
      letters: [...prev.letters, ...newLetters],
    }))
  }, [gameState.lanes, gameState.currentWord.answer, generateDistractors, gameState.gameRunning])

  // Show feedback in side panel
  const showFeedback = useCallback((type: "success" | "error", message: string) => {
    setGameState((prev) => ({
      ...prev,
      feedbackType: type,
      feedbackMessage: message,
    }))

    // Clear feedback after 3 seconds
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        feedbackType: null,
        feedbackMessage: "",
      }))
    }, 3000)
  }, [])

  // Handle collision and game progression
  const handleCollision = useCallback(
    (letter: Letter) => {
      if (!gameState.gameRunning) return

      if (letter.isCorrect) {
        // Correct answer
        const newScore = gameState.score + 1
        const shouldIncreaseLanes =
          newScore > 0 && newScore % LANE_INCREASE_THRESHOLD === 0 && gameState.lanes < MAX_LANES
        const newWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]

        setGameState((prev) => ({
          ...prev,
          letters: [], // Clear letters immediately
          score: newScore,
          lanes: shouldIncreaseLanes ? prev.lanes + 1 : prev.lanes,
          speed: prev.speed + SPEED_INCREMENT * 0.1,
          currentWord: newWord,
          mistakesInCurrentLanes: shouldIncreaseLanes ? 0 : prev.mistakesInCurrentLanes,
          playerLane:
            shouldIncreaseLanes && prev.playerLane >= prev.lanes + 1
              ? Math.floor((prev.lanes + 1) / 2)
              : prev.playerLane,
          feedbackType: "success",
          feedbackMessage: "Job well done!",
        }))
      } else {
        // Wrong answer - increment mistakes and check if we should decrease lanes
        const newMistakes = gameState.mistakesInCurrentLanes + 1
        const shouldDecreaseLanes = newMistakes >= LANE_DECREASE_THRESHOLD && gameState.lanes > INITIAL_LANES

        setGameState((prev) => ({
          ...prev,
          letters: [], // Clear letters immediately
          mistakesInCurrentLanes: shouldDecreaseLanes ? 0 : newMistakes,
          lanes: shouldDecreaseLanes ? prev.lanes - 1 : prev.lanes,
          playerLane:
            shouldDecreaseLanes && prev.playerLane >= prev.lanes - 1
              ? Math.floor((prev.lanes - 1) / 2)
              : prev.playerLane,
          feedbackType: "error",
          feedbackMessage: shouldDecreaseLanes ? "Don't worry, let's make it easier!" : "Don't worry, keep going!",
        }))
      }

      // Clear feedback after 3 seconds
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
      feedbackTimeoutRef.current = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          feedbackType: null,
          feedbackMessage: "",
        }))
      }, 3000)

      // Reset spawn timer for next letters
      lastLetterSpawnRef.current = Date.now()
    },
    [gameState.score, gameState.lanes, gameState.gameRunning, gameState.mistakesInCurrentLanes],
  )

  // Update game elements
  const updateGame = useCallback(() => {
    if (!gameState.gameRunning) return

    setGameState((prev) => {
      // Update letters and check for collisions in the same pass
      const updatedLetters = []
      let collisionDetected = false

      for (const letter of prev.letters) {
        const newYPosition = letter.yPosition + prev.speed

        // Check collision at car position (bottom: 50px means car is at ~550px from top)
        if (newYPosition >= 500 && newYPosition <= 600 && letter.lane === prev.playerLane) {
          // COLLISION! Handle immediately and clear ALL letters
          collisionDetected = true
          handleCollision(letter)
          break // Stop processing more letters
        }

        // Only keep letters that haven't collided and are still on screen
        if (newYPosition < 700) {
          updatedLetters.push({
            ...letter,
            yPosition: newYPosition,
          })
        }
      }

      // If collision detected, return empty letters array immediately
      if (collisionDetected) {
        return {
          ...prev,
          letters: [], // Clear ALL letters instantly
          scenery: prev.scenery
            .map((item) => ({
              ...item,
              yPosition: item.yPosition + prev.speed * 1.5,
            }))
            .filter((item) => item.yPosition < 800),
        }
      }

      // No collision - continue with normal updates
      const updatedScenery = prev.scenery
        .map((item) => ({
          ...item,
          yPosition: item.yPosition + prev.speed * 1.5,
        }))
        .filter((item) => item.yPosition < 800)

      return {
        ...prev,
        letters: updatedLetters,
        scenery: updatedScenery,
      }
    })
  }, [gameState.gameRunning, handleCollision])

  // Game loop
  useEffect(() => {
    if (!gameState.gameRunning) return

    const gameLoop = () => {
      updateGame()
      spawnLetters()
      spawnScenery()
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.gameRunning, updateGame, spawnLetters, spawnScenery])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
    }
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.gameRunning) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          setGameState((prev) => ({
            ...prev,
            playerLane: Math.max(0, prev.playerLane - 1),
          }))
          break
        case "ArrowRight":
          e.preventDefault()
          setGameState((prev) => ({
            ...prev,
            playerLane: Math.min(prev.lanes - 1, prev.playerLane + 1),
          }))
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState.gameRunning, gameState.lanes])

  // Start game
  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      gameRunning: true,
      score: 0,
      lanes: INITIAL_LANES,
      speed: INITIAL_SPEED,
      playerLane: Math.floor(INITIAL_LANES / 2),
      letters: [],
      scenery: [],
      currentWord: WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)],
      feedbackType: null,
      feedbackMessage: "",
      mistakesInCurrentLanes: 0,
    }))
    lastLetterSpawnRef.current = Date.now()
    lastScenerySpawnRef.current = Date.now()
  }

  // Stop game
  const stopGame = () => {
    setGameState((prev) => ({
      ...prev,
      gameRunning: false,
      letters: [],
      scenery: [],
      feedbackType: null,
      feedbackMessage: "",
      mistakesInCurrentLanes: 0,
    }))
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current)
    }
  }

  // Display word with missing letter
  const displayWord = () => {
    const { word, missing } = gameState.currentWord
    return word
      .split("")
      .map((char, index) => (missing.includes(index) ? "_" : char))
      .join(" ")
  }

  return (
    <div className="w-full h-screen bg-blue-900 relative overflow-hidden">
      {/* Load OpenDyslexic font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=OpenDyslexic:wght@400;700&display=swap');
        .dyslexic-font {
          font-family: 'OpenDyslexic', monospace;
        }
      `}</style>

      {/* Control Panel */}
      <div className="absolute top-0 left-0 right-0 bg-indigo-900 text-white p-4 z-10">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="dyslexic-font">
            <div className="text-2xl font-bold mb-2">WordCatcher</div>
            <div className="text-2xl font-bold">
              Complete the word: <span className="text-yellow-300 text-5xl font-bold">{displayWord()}</span>
            </div>
          </div>
          <div className="text-right dyslexic-font">
            <div className="text-xl">Score: {gameState.score}</div>
            <div className="text-sm">Lanes: {gameState.lanes}</div>
            <div className="text-xs text-gray-300">
              Mistakes: {gameState.mistakesInCurrentLanes}/{LANE_DECREASE_THRESHOLD}
            </div>
          </div>
        </div>
      </div>

      {/* Side Feedback Panel */}
      {gameState.feedbackType && (
        <div className="absolute top-32 right-4 z-20">
          <div
            className={`p-4 rounded-lg shadow-lg dyslexic-font transition-all duration-300 ${
              gameState.feedbackType === "success"
                ? "bg-green-100 border-l-4 border-green-500"
                : "bg-orange-100 border-l-4 border-orange-500"
            }`}
            style={{ minWidth: "200px" }}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`text-3xl ${gameState.feedbackType === "success" ? "text-green-600" : "text-orange-600"}`}
              >
                {gameState.feedbackType === "success" ? "✅" : "❌"}
              </div>
              <div>
                <div
                  className={`text-lg font-bold ${
                    gameState.feedbackType === "success" ? "text-green-800" : "text-orange-800"
                  }`}
                >
                  {gameState.feedbackMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="absolute top-24 left-4 z-10">
        {!gameState.gameRunning ? (
          <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold dyslexic-font">
            Start Game
          </Button>
        ) : (
          <Button onClick={stopGame} className="bg-red-500 hover:bg-red-600 text-white font-bold dyslexic-font">
            Stop Game
          </Button>
        )}
      </div>

      {/* Instructions */}
      {!gameState.gameRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center dyslexic-font">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900">How to Play</h2>
            <div className="text-left space-y-2 text-gray-700">
              <p>• Use ← → arrow keys to switch lanes</p>
              <p>• Drive forward to collect the correct letter</p>
              <p>• Complete the word shown at the top</p>
              <p>• All letters look the same - choose carefully!</p>
              <p>• Feedback appears on the right side</p>
              <p>• Difficulty adjusts based on your performance</p>
            </div>
          </div>
        </div>
      )}

      {/* Road and Game Area */}
      {gameState.gameRunning && (
        <div className="absolute top-32 left-0 right-0 bottom-0">
          <div className="relative h-full max-w-6xl mx-auto">
            {/* Scenery - Left Side */}
            {gameState.scenery
              .filter((item) => item.side === "left")
              .map((item) => (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: `calc(50% - ${(gameState.lanes * 120) / 2}px - 100px)`,
                    top: `${item.yPosition}px`,
                  }}
                >
                  {item.type === "tree" ? (
                    // Enhanced Tree
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-16 bg-green-500 rounded-full shadow-lg border-2 border-green-700"></div>
                      <div className="w-3 h-10 bg-amber-700 shadow-md"></div>
                    </div>
                  ) : (
                    // Enhanced Streetlight
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 bg-yellow-300 rounded-full shadow-lg border-2 border-yellow-500"></div>
                      <div className="w-2 h-20 bg-gray-500 shadow-md"></div>
                      <div className="w-4 h-2 bg-gray-600"></div>
                    </div>
                  )}
                </div>
              ))}

            {/* Scenery - Right Side */}
            {gameState.scenery
              .filter((item) => item.side === "right")
              .map((item) => (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${(gameState.lanes * 120) / 2}px + 60px)`,
                    top: `${item.yPosition}px`,
                  }}
                >
                  {item.type === "tree" ? (
                    // Enhanced Tree
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-16 bg-green-500 rounded-full shadow-lg border-2 border-green-700"></div>
                      <div className="w-3 h-10 bg-amber-700 shadow-md"></div>
                    </div>
                  ) : (
                    // Enhanced Streetlight
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 bg-yellow-300 rounded-full shadow-lg border-2 border-yellow-500"></div>
                      <div className="w-2 h-20 bg-gray-500 shadow-md"></div>
                      <div className="w-4 h-2 bg-gray-600"></div>
                    </div>
                  )}
                </div>
              ))}

            {/* Lane dividers */}
            <div className="absolute inset-0 flex justify-center">
              <div className="flex" style={{ width: `${gameState.lanes * 120}px` }}>
                {Array.from({ length: gameState.lanes }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 border-r-4 border-white relative"
                    style={{
                      backgroundColor: "#E5E7EB",
                      width: "120px",
                      height: "100%",
                    }}
                  >
                    {/* Lane center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400 transform -translate-x-1/2 opacity-70"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Falling Letters */}
            {gameState.letters.map((letter) => (
              <div
                key={letter.id}
                className="absolute dyslexic-font font-bold text-4xl flex items-center justify-center bg-white text-black border-4 border-blue-500 z-30"
                style={{
                  left: `calc(50% - ${(gameState.lanes * 120) / 2}px + ${letter.lane * 120 + 10}px)`,
                  width: "100px",
                  height: `${LETTER_SIZE}px`,
                  top: `${letter.yPosition}px`,
                  borderRadius: "12px",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
                }}
              >
                {letter.char}
              </div>
            ))}

            {/* Player Car */}
            <div
              className="absolute bg-red-600 rounded-sm flex items-center justify-center transition-all duration-300 border-2 border-red-800 z-15"
              style={{
                left: `calc(50% - ${(gameState.lanes * 120) / 2}px + ${gameState.playerLane * 120}px + 30px)`,
                width: "60px",
                height: "100px",
                bottom: "50px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.6)",
              }}
            >
              {/* Car body - top view */}
              <div className="relative w-full h-full">
                {/* Main car body */}
                <div className="absolute inset-2 bg-red-700 rounded-sm"></div>
                {/* Windshield */}
                <div className="absolute top-2 left-3 right-3 h-4 bg-cyan-200 rounded-sm opacity-90"></div>
                {/* Rear window */}
                <div className="absolute bottom-2 left-3 right-3 h-4 bg-cyan-200 rounded-sm opacity-90"></div>
                {/* Side mirrors */}
                <div className="absolute top-6 -left-1 w-2 h-3 bg-gray-700 rounded-sm"></div>
                <div className="absolute top-6 -right-1 w-2 h-3 bg-gray-700 rounded-sm"></div>

                {/* Enhanced Tires */}
                <div className="absolute top-1 left-0 w-3 h-5 bg-black rounded-sm border border-gray-600"></div>
                <div className="absolute top-1 right-0 w-3 h-5 bg-black rounded-sm border border-gray-600"></div>
                <div className="absolute bottom-1 left-0 w-3 h-5 bg-black rounded-sm border border-gray-600"></div>
                <div className="absolute bottom-1 right-0 w-3 h-5 bg-black rounded-sm border border-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
