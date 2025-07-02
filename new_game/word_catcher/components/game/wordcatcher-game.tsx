"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

// Game constants
const EASY_LANES = 3
const MEDIUM_LANES = 4
const HARD_LANES = 5
const ANSWERS_TO_NEXT_LEVEL = 3
const MAX_MISTAKES_PER_LEVEL = 2
const INITIAL_SPEED = 1.2
const SPEED_INCREMENT = 0.2
const LETTER_SIZE = 60

// Difficulty levels
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS]

// Expanded word bank with missing letters organized by difficulty
// Each word is carefully chosen so only ONE letter can complete it correctly
const EASY_WORDS = [
  { word: "CAR", missing: [2], answer: "R" }, // CA_ - only CAR works (not CAB, CAD, etc.)
  { word: "DOG", missing: [2], answer: "G" }, // DO_ - only DOG works 
  { word: "SUN", missing: [2], answer: "N" }, // SU_ - only SUN works
  { word: "BOX", missing: [2], answer: "X" }, // BO_ - only BOX works
  { word: "KEY", missing: [2], answer: "Y" }, // KE_ - only KEY works
  { word: "EGG", missing: [0], answer: "E" }, // _GG - only EGG works
  { word: "ICE", missing: [0], answer: "I" }, // _CE - only ICE works
  { word: "OWL", missing: [0], answer: "O" }, // _WL - only OWL works
  { word: "ZIP", missing: [2], answer: "P" }, // ZI_ - only ZIP works
  { word: "JAR", missing: [0], answer: "J" }, // _AR - only JAR makes sense contextually
]

const MEDIUM_WORDS = [
  { word: "QUIZ", missing: [3], answer: "Z" }, // QUI_ - only QUIZ works
  { word: "JUMP", missing: [3], answer: "P" }, // JUM_ - only JUMP works  
  { word: "KING", missing: [3], answer: "G" }, // KIN_ - only KING works
  { word: "FROG", missing: [3], answer: "G" }, // FRO_ - only FROG works
  { word: "WOLF", missing: [3], answer: "F" }, // WOL_ - only WOLF works
  { word: "FISH", missing: [3], answer: "H" }, // FIS_ - only FISH works
  { word: "DUCK", missing: [3], answer: "K" }, // DUC_ - only DUCK works
  { word: "SOCK", missing: [3], answer: "K" }, // SOC_ - only SOCK works
  { word: "MILK", missing: [3], answer: "K" }, // MIL_ - only MILK works
  { word: "DESK", missing: [3], answer: "K" }, // DES_ - only DESK works
]

const HARD_WORDS = [
  { word: "MONKEY", missing: [5], answer: "Y" }, // MONKE_ - only MONKEY works
  { word: "ROCKET", missing: [5], answer: "T" }, // ROCKE_ - only ROCKET works
  { word: "DRAGON", missing: [5], answer: "N" }, // DRAGO_ - only DRAGON works
  { word: "WIZARD", missing: [5], answer: "D" }, // WIZAR_ - only WIZARD works
  { word: "CASTLE", missing: [5], answer: "E" }, // CASTL_ - only CASTLE works
  { word: "JUNGLE", missing: [5], answer: "E" }, // JUNGL_ - only JUNGLE works
  { word: "BRIDGE", missing: [5], answer: "E" }, // BRIDG_ - only BRIDGE works
  { word: "BASKET", missing: [5], answer: "T" }, // BASKE_ - only BASKET works
  { word: "FRIEND", missing: [5], answer: "D" }, // FRIEN_ - only FRIEND works
  { word: "FLOWER", missing: [5], answer: "R" }, // FLOWE_ - only FLOWER works
  { word: "PUZZLE", missing: [5], answer: "E" }, // PUZZL_ - only PUZZLE works
  { word: "PRINCE", missing: [5], answer: "E" }, // PRINC_ - only PRINCE works
  { word: "KNIGHT", missing: [5], answer: "T" }, // KNIGH_ - only KNIGHT works
  { word: "PALACE", missing: [5], answer: "E" }, // PALAC_ - only PALACE works
  { word: "FOREST", missing: [5], answer: "T" }, // FORES_ - only FOREST works
  { word: "PLANET", missing: [5], answer: "T" }, // PLANE_ - only PLANET works
  { word: "ANIMAL", missing: [5], answer: "L" }, // ANIMA_ - only ANIMAL works
  { word: "GARDEN", missing: [5], answer: "N" }, // GARDE_ - only GARDEN works
  { word: "WINTER", missing: [5], answer: "R" }, // WINTE_ - only WINTER works
]

// Dyslexia confusion sets for distractors
const CONFUSION_SETS: Record<string, string[]> = {
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
  Z: ["X", "Q", "S"], // For Z, use X, Q, S as distractors (not Z itself)
  G: ["C", "Q", "O"],
  F: ["T", "P", "E"],
  K: ["H", "R", "X"],
  T: ["F", "I", "L"],
  R: ["P", "B", "F"],
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
  currentWord: (typeof EASY_WORDS)[0]
  playerLane: number
  letters: Letter[]
  scenery: Scenery[]
  gameRunning: boolean
  feedbackType: "success" | "error" | null
  feedbackMessage: string
  difficulty: DifficultyLevel
  correctAnswersInLevel: number
  mistakesInLevel: number
  gameCompleted: boolean
  showInstructions: boolean
}

export default function WordCatcherGame() {
  // Helper functions
  const getWordBankByDifficulty = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return EASY_WORDS
      case DIFFICULTY_LEVELS.MEDIUM:
        return MEDIUM_WORDS
      case DIFFICULTY_LEVELS.HARD:
        return HARD_WORDS
      default:
        return EASY_WORDS
    }
  }

  const getLanesByDifficulty = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return EASY_LANES
      case DIFFICULTY_LEVELS.MEDIUM:
        return MEDIUM_LANES
      case DIFFICULTY_LEVELS.HARD:
        return HARD_LANES
      default:
        return EASY_LANES
    }
  }

  const getDifficultyName = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return "Easy"
      case DIFFICULTY_LEVELS.MEDIUM:
        return "Medium"
      case DIFFICULTY_LEVELS.HARD:
        return "Hard"
      default:
        return "Easy"
    }
  }

  const getRandomWord = (difficulty: DifficultyLevel) => {
    const wordBank = getWordBankByDifficulty(difficulty)
    return wordBank[Math.floor(Math.random() * wordBank.length)]
  }

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lanes: EASY_LANES,
    speed: INITIAL_SPEED,
    currentWord: EASY_WORDS[0],
    playerLane: 1,
    letters: [],
    scenery: [],
    gameRunning: true,
    feedbackType: null,
    feedbackMessage: "",
    difficulty: DIFFICULTY_LEVELS.EASY,
    correctAnswersInLevel: 0,
    mistakesInLevel: 0,
    gameCompleted: false,
    showInstructions: true,
  })

  const gameLoopRef = useRef<number | undefined>(undefined)
  const letterIdRef = useRef(0)
  const sceneryIdRef = useRef(0)
  const lastLetterSpawnRef = useRef(0)
  const lastScenerySpawnRef = useRef(0)
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Initialize spawn timers when component mounts (since game starts immediately)
  useEffect(() => {
    lastLetterSpawnRef.current = Date.now()
    lastScenerySpawnRef.current = Date.now()
  }, [])

  // Generate distractors for current answer
  const generateDistractors = useCallback((correctAnswer: string, count: number) => {
    const confusionSet = CONFUSION_SETS[correctAnswer] || ["X", "Y", "Q"]
    const distractors: string[] = []

    // Add from confusion set first, but avoid the correct answer
    for (const letter of confusionSet) {
      if (letter !== correctAnswer && !distractors.includes(letter) && distractors.length < count) {
        distractors.push(letter)
      }
    }

    // Add specific safe distractors that won't form valid words
    const safeDistractors = ["Q", "X", "J", "V", "W", "K"].filter(letter => 
      letter !== correctAnswer && !distractors.includes(letter)
    )
    
    // Fill remaining slots with safe distractors
    for (const safeLetter of safeDistractors) {
      if (distractors.length < count) {
        distractors.push(safeLetter)
      }
    }
    
    // If still need more, add random letters (but avoid correct answer)
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
        const newCorrectAnswersInLevel = gameState.correctAnswersInLevel + 1
        
        // Check if we should advance to next difficulty level
        if (newCorrectAnswersInLevel >= ANSWERS_TO_NEXT_LEVEL) {
          let newDifficulty = gameState.difficulty
          let newLanes = gameState.lanes
          let gameCompleted = false
          
          if (gameState.difficulty === DIFFICULTY_LEVELS.EASY) {
            newDifficulty = DIFFICULTY_LEVELS.MEDIUM
            newLanes = MEDIUM_LANES
          } else if (gameState.difficulty === DIFFICULTY_LEVELS.MEDIUM) {
            newDifficulty = DIFFICULTY_LEVELS.HARD
            newLanes = HARD_LANES
          } else if (gameState.difficulty === DIFFICULTY_LEVELS.HARD) {
            // Game completed after 4 correct answers in hard level
            gameCompleted = true
          }
          
          const newWord = getRandomWord(newDifficulty)
          
          setGameState((prev) => ({
            ...prev,
            letters: [], // Clear letters immediately
            score: newScore,
            lanes: newLanes,
            difficulty: newDifficulty,
            speed: prev.speed + SPEED_INCREMENT * 0.1,
            currentWord: newWord,
            correctAnswersInLevel: gameCompleted ? prev.correctAnswersInLevel : 0, // Reset for new level
            mistakesInLevel: gameCompleted ? prev.mistakesInLevel : 0, // Reset for new level
            playerLane: Math.floor(newLanes / 2),
            feedbackType: "success",
            feedbackMessage: gameCompleted ? "Congratulations! Game completed!" : `Level up! Welcome to ${getDifficultyName(newDifficulty)}!`,
            gameCompleted: gameCompleted,
            gameRunning: !gameCompleted, // Stop game if completed
          }))
        } else {
          // Continue in same level
          const newWord = getRandomWord(gameState.difficulty)
          
          setGameState((prev) => ({
            ...prev,
            letters: [], // Clear letters immediately
            score: newScore,
            speed: prev.speed + SPEED_INCREMENT * 0.1,
            currentWord: newWord,
            correctAnswersInLevel: newCorrectAnswersInLevel,
            feedbackType: "success",
            feedbackMessage: "Great job!",
          }))
        }
      } else {
        // Wrong answer
        const newMistakesInLevel = gameState.mistakesInLevel + 1
        
        // Check if we should decrease difficulty or end game
        if (newMistakesInLevel >= MAX_MISTAKES_PER_LEVEL) {
          if (gameState.difficulty === DIFFICULTY_LEVELS.EASY) {
            // Game over if 2 mistakes in easy level
            setGameState((prev) => ({
              ...prev,
              letters: [], // Clear letters immediately
              gameRunning: false,
              feedbackType: "error",
              feedbackMessage: "Game Over! Don't worry, try again!",
            }))
            return
          } else {
            // Decrease difficulty level
            let newDifficulty: DifficultyLevel = gameState.difficulty
            let newLanes = gameState.lanes
            
            if (gameState.difficulty === DIFFICULTY_LEVELS.MEDIUM) {
              newDifficulty = DIFFICULTY_LEVELS.EASY
              newLanes = EASY_LANES
            } else if (gameState.difficulty === DIFFICULTY_LEVELS.HARD) {
              newDifficulty = DIFFICULTY_LEVELS.MEDIUM
              newLanes = MEDIUM_LANES
            }
            
            const newWord = getRandomWord(newDifficulty)
            
            setGameState((prev) => ({
              ...prev,
              letters: [], // Clear letters immediately
              difficulty: newDifficulty,
              lanes: newLanes,
              currentWord: newWord,
              correctAnswersInLevel: 0, // Reset for new level
              mistakesInLevel: 0, // Reset for new level
              playerLane: Math.floor(newLanes / 2),
              feedbackType: "error",
              feedbackMessage: `Don't worry! Moving to ${getDifficultyName(newDifficulty)} level.`,
            }))
          }
        } else {
          // Continue in same level with mistake recorded
          setGameState((prev) => ({
            ...prev,
            letters: [], // Clear letters immediately
            mistakesInLevel: newMistakesInLevel,
            feedbackType: "error",
            feedbackMessage: "Keep trying! You can do it!",
          }))
        }
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
    [gameState.score, gameState.difficulty, gameState.correctAnswersInLevel, gameState.mistakesInLevel, gameState.lanes, gameState.gameRunning],
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
      // Handle instructions dismiss
      if (gameState.showInstructions && e.key === "Enter") {
        e.preventDefault()
        setGameState((prev) => ({
          ...prev,
          showInstructions: false,
        }))
        return
      }

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
  }, [gameState.gameRunning, gameState.lanes, gameState.showInstructions])

  // Start game
  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      gameRunning: true,
      score: 0,
      lanes: EASY_LANES,
      speed: INITIAL_SPEED,
      playerLane: Math.floor(EASY_LANES / 2),
      letters: [],
      scenery: [],
      currentWord: getRandomWord(DIFFICULTY_LEVELS.EASY),
      feedbackType: null,
      feedbackMessage: "",
      difficulty: DIFFICULTY_LEVELS.EASY,
      correctAnswersInLevel: 0,
      mistakesInLevel: 0,
      gameCompleted: false,
      showInstructions: true,
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
      difficulty: DIFFICULTY_LEVELS.EASY,
      correctAnswersInLevel: 0,
      mistakesInLevel: 0,
      gameCompleted: false,
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
      .map((char: string, index: number) => (missing.includes(index) ? "_" : char))
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
            <div className="text-sm">Level: {getDifficultyName(gameState.difficulty)}</div>
            <div className="text-xs text-gray-300">
              Progress: {gameState.correctAnswersInLevel}/{ANSWERS_TO_NEXT_LEVEL} | Mistakes: {gameState.mistakesInLevel}/{MAX_MISTAKES_PER_LEVEL}
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



      {/* Retro Instructions Popup */}
      {gameState.showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="relative bg-black border-4 border-green-500 rounded-lg p-8 max-w-2xl mx-4 text-center shadow-2xl" style={{
            boxShadow: '0 0 20px #00ff00, inset 0 0 20px #00ff0020',
            fontFamily: 'Courier New, monospace'
          }}>
            {/* Retro Header */}
            <div className="mb-6">
              <div className="text-green-500 text-4xl font-bold mb-2" style={{
                textShadow: '0 0 10px #00ff00',
                letterSpacing: '3px'
              }}>
                === WORDCATCHER ===
              </div>
              <div className="text-green-400 text-sm">
                █████████████████████████████████
              </div>
            </div>

            {/* Instructions */}
            <div className="text-green-300 text-left space-y-3 mb-8" style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              <div className="text-yellow-400 font-bold text-center mb-4">
                &gt; MISSION BRIEFING &lt;
              </div>
              
              <div>• Use [←] [→] ARROW KEYS to change lanes</div>
              <div>• Drive forward to CATCH the correct letter</div>
              <div>• Complete the word shown at the top</div>
              
              <div className="text-cyan-400 font-bold mt-4 mb-2">
                &gt; DIFFICULTY SYSTEM &lt;
              </div>
              <div>▼ EASY: 3-letter words, 3 lanes</div>
              <div>▼ MEDIUM: 4-letter words, 4 lanes</div>
              <div>▼ HARD: 5-6 letter words, 5 lanes</div>
              
              <div className="text-red-400 font-bold mt-4 mb-2">
                &gt; PROGRESSION RULES &lt;
              </div>
              <div>★ Get 3 correct answers → LEVEL UP</div>
              <div>✗ Make 2 mistakes → LEVEL DOWN</div>
              <div>☠ 2 mistakes in EASY → GAME OVER</div>
            </div>

            {/* Blinking Enter Prompt */}
            <div className="text-yellow-300 text-xl font-bold animate-pulse" style={{
              textShadow: '0 0 10px #ffff00',
              fontFamily: 'Courier New, monospace'
            }}>
              &gt;&gt; PRESS [ENTER] TO START &lt;&lt;
            </div>

            {/* Retro Border Effect */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-green-400 opacity-50 rounded"></div>
          </div>
        </div>
      )}

      {/* Game Completion Message */}
      {gameState.gameCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center dyslexic-font">
            <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 Congratulations! 🎉</h2>
            <p className="text-lg text-gray-700 mb-4">
              You've completed all difficulty levels!
            </p>
            <p className="text-md text-gray-600 mb-6">
              Final Score: <span className="font-bold text-indigo-900">{gameState.score}</span>
            </p>
            <Button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-3 rounded-full"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Road and Game Area */}
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
      </div>
    )
  }
