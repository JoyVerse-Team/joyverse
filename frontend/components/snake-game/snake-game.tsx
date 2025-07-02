"use client"

import { useEffect, useRef, useState } from "react"
import { useSnakeGame } from "@/components/snake-game/use-snake-game"
import { GameStatus } from "@/components/snake-game/types"
import { Button } from "@/components/ui/button"
import { gameApiService, type EmotionData } from "../../lib/game-api"
import { Difficulty } from "@/components/snake-game/word-lists"
import "@/app/fonts.css"

interface SnakeGameComponentProps {
  onGameStatusChange?: (status: GameStatus) => void
  onEmotionUpdate?: (emotion: string) => void
}

// Simple dialog component for popups
const GameDialog = ({ children, show }: { children: React.ReactNode; show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative shadow-xl">
        {children}
      </div>
    </div>
  );
};

// Add a retro font dialog for popups with snake mascot
const RetroDialog = ({ children, show, vibrant = false }: { children: React.ReactNode; show: boolean; vibrant?: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-6 max-w-lg mx-4 relative shadow-2xl font-retro border-4 ${vibrant ? 'bg-gradient-to-br from-yellow-200 via-pink-200 to-green-200 border-pink-500 animate-pulse' : 'bg-white border-green-600'}`}>        {/* Mr. Snake Mascot - Even bigger and more prominent */}
        <div className="absolute -top-32 -left-32 z-10">
          <div className="w-48 h-48 flex items-center justify-center">
            <img 
              src="/snake-mascot.png.png" 
              alt="Mr. Snake - Friendly Learning Mascot" 
              className="w-44 h-44 object-contain drop-shadow-2xl"
              onError={(e) => {
                // Fallback to emoji if the image fails to load
                console.log('Mr. Snake mascot image failed to load, using fallback');
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="bg-gradient-to-br from-green-200 to-green-300 rounded-full w-40 h-40 flex items-center justify-center shadow-2xl border-4 border-green-400">
                      <span class="text-7xl">🐍</span>
                      <div class="absolute top-6 left-6 text-4xl">🤓</div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>        {/* Speech bubble tail pointing to Mr. Snake */}
        <div className={`absolute -top-8 left-20 w-12 h-12 transform rotate-45 ${vibrant ? 'bg-yellow-200 border-pink-500' : 'bg-white border-green-600'} border-l-4 border-t-4`}></div>
        <div className="pt-4 pl-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export function SnakeGame({ onGameStatusChange, onEmotionUpdate }: SnakeGameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // UI State
  const [showTutorial, setShowTutorial] = useState<boolean>(false)
  const [showLifeLossPopup, setShowLifeLossPopup] = useState<boolean>(false)
  const [lifeLossResume, setLifeLossResume] = useState<boolean>(false)
  const [gamePausedForLifeLoss, setGamePausedForLifeLoss] = useState<boolean>(false)
  
  // Emotion Detection State
  const [showEmotionDetection, setShowEmotionDetection] = useState<boolean>(false)
  const [currentEmotion, setCurrentEmotion] = useState<string>("")
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>("easy")
  const [isCapturingEmotion, setIsCapturingEmotion] = useState<boolean>(false)
  
  // Refs
  const lifeLossRef = useRef<boolean>(false)
  
  // For now, use a placeholder user ID. In a real app, this would come from authentication
  const userId = "user123"
  
  const { 
    gameStatus, 
    lives, 
    wordsCompleted, 
    targetWord, 
    collectedLetters, 
    difficulty,
    startGame, 
    restartGame, 
    pauseGame, 
    resumeGame   
  } = useSnakeGame({
    canvasRef,
    onLifeLoss: () => {
      setShowLifeLossPopup(true)
      setLifeLossResume(false)
      setGamePausedForLifeLoss(true)
      lifeLossRef.current = true
    },
    paused: gamePausedForLifeLoss,
  })

  // Function to capture emotion for completed round
  const captureEmotionForRound = async () => {
    if (isCapturingEmotion) return
    
    setIsCapturingEmotion(true)
    try {
      const emotion = await gameApiService.captureAndDetectEmotion()
      setCurrentEmotion(emotion.emotion)
      console.log(`Captured emotion: ${emotion.emotion} with confidence ${emotion.confidence}`)
      
      // Notify parent component about the emotion update
      onEmotionUpdate?.(emotion.emotion)
    } catch (error) {
      console.error('Failed to capture emotion:', error)
    } finally {
      setIsCapturingEmotion(false)
    }
  }

  // Update current difficulty when the game state changes
  useEffect(() => {
    if (difficulty !== currentDifficulty) {
      setCurrentDifficulty(difficulty)
    }
  }, [difficulty])

  // Notify parent when game status changes
  useEffect(() => {
    onGameStatusChange?.(gameStatus)
  }, [gameStatus, onGameStatusChange])

  // Trigger emotion capture when only one letter is left to collect
  useEffect(() => {
    const lettersLeft = targetWord.length - collectedLetters.length
    if (lettersLeft === 1 && gameStatus === GameStatus.PLAYING && !isCapturingEmotion) {
      console.log('Only one letter left - triggering emotion capture for difficulty adjustment')
      captureEmotionForRound()
    }
  }, [collectedLetters.length, targetWord.length, gameStatus, isCapturingEmotion])

  // Listen for Enter on intro to show tutorial
  useEffect(() => {
    if (gameStatus === GameStatus.INTRO && !showTutorial) {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault()
          setShowTutorial(true)
        }
      }
      window.addEventListener("keydown", handleEnter)
      return () => window.removeEventListener("keydown", handleEnter)
    }
  }, [gameStatus, showTutorial])

  // Listen for Enter on tutorial to start game
  useEffect(() => {
    if (showTutorial) {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault()
          setShowTutorial(false)
          startGame()
        }
      }
      window.addEventListener("keydown", handleEnter)
      return () => window.removeEventListener("keydown", handleEnter)
    }
  }, [showTutorial, startGame])

  // Listen for Enter on life loss popup to resume game
  useEffect(() => {
    if (showLifeLossPopup) {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault()
          setShowLifeLossPopup(false)
          setLifeLossResume(true)
        }
      }
      window.addEventListener("keydown", handleEnter)
      return () => window.removeEventListener("keydown", handleEnter)
    }
  }, [showLifeLossPopup])

  // Resume game after life loss popup
  useEffect(() => {
    if (lifeLossResume) {
      setGamePausedForLifeLoss(false)
      lifeLossRef.current = false
      setLifeLossResume(false)
    }
  }, [lifeLossResume])

  // Listen for spacebar to pause/resume game
  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.PAUSED) {
      const handleSpacebar = (e: KeyboardEvent) => {
        if (e.code === "Space" || e.key === " ") {
          e.preventDefault()
          if (gameStatus === GameStatus.PLAYING) {
            pauseGame()
          } else if (gameStatus === GameStatus.PAUSED) {
            resumeGame()
          }
        }
      }
      window.addEventListener("keydown", handleSpacebar)
      return () => window.removeEventListener("keydown", handleSpacebar)
    }
  }, [gameStatus, pauseGame, resumeGame])

  // Rest of your component JSX would go here...
  return (    <div className="flex flex-col items-center">
      {/* Two-row layout for game info */}
      <div className="mb-6 w-full max-w-4xl">        {/* Top row - Target Word (left) and Lives (right) */}
        <div className="flex items-center justify-between mb-4">
          {/* Target Word Section - Top Left */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-800">Target:</span>
            <span className="text-xl font-bold text-blue-600 bg-blue-100/30 backdrop-blur-sm px-2 py-1 rounded-md border border-blue-300/50">{targetWord}</span>
          </div>
            {/* Tries Section - Top Right */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">Tries:</span>
            <div className="flex gap-1">
              {Array(lives).fill("💙").map((heart, index) => (
                <span key={index} className="text-2xl animate-pulse">{heart}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom row - Letter Progress centered */}
        <div className="flex justify-center">
          <div className="flex gap-1">
            {targetWord.split("").map((letter, index) => (
              <div
                key={index}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-all duration-300
                  ${index < collectedLetters.length 
                    ? "bg-green-400/40 backdrop-blur-sm text-green-800 shadow-md transform scale-110 border border-green-500/50" 
                    : "bg-gray-200/30 backdrop-blur-sm text-gray-600 border border-dashed border-gray-400/50"}`}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-lg"
          width={800}
          height={550}
        />        {/* Intro Popup with Mr. Snake mascot */}
        <RetroDialog show={gameStatus === GameStatus.INTRO && !showTutorial}>
          <div className="text-center">
            <h2 className="text-3xl mb-4 text-green-600">🐍 Hello there, awesome friend!</h2>
            <p className="text-xl mb-4 text-gray-700">I'm <strong>Mr. Snake</strong>, your learning buddy! 🤓</p>
            <p className="text-lg mb-6 text-gray-600">I'm super excited to help you learn words together! You're going to do amazing!</p>
            <p className="text-lg text-green-600 animate-pulse mt-4">Press ENTER to meet me!</p>
          </div>
        </RetroDialog>        {/* Instructions Popup with Mr. Snake mascot */}
        <RetroDialog show={showTutorial}>
          <div className="text-center">
            <h3 className="text-2xl mb-4 text-green-700">🐍 Let's Play Together!</h3>
            <p className="text-lg mb-4 text-gray-800">Hi! I'm <strong>Mr. Snake</strong> and here's how we'll have fun learning:</p>
            <ul className="text-lg mb-6 text-gray-800 space-y-3 text-left">
              <li>🎮 <b>Move me around</b> with WASD keys or Arrow Keys</li>
              <li>🌟 <b>Help me collect letters</b> in the right order to spell words</li>
              <li>💙 <b>You have 3 tries</b> - don't worry, I believe in you!</li>
              <li>🎯 <b>We're a great team!</b> Let's spell words together!</li>
            </ul>
            <p className="text-lg text-green-600 animate-pulse">Press ENTER and let's start our adventure!</p>
          </div>
        </RetroDialog>        {/* Life Loss Popup with encouraging Mr. Snake */}
        <RetroDialog show={showLifeLossPopup} vibrant>
          <div className="text-center">
            <h3 className="text-3xl mb-4 text-purple-600 font-bold drop-shadow-lg">🐍 Hey, no worries!</h3>
            <p className="text-lg mb-4 text-gray-900 font-semibold">That's totally okay, my friend! 💙<br/>Mr. Snake says: Every try makes you stronger and smarter!</p>
            <p className="text-lg mb-4 text-green-700 font-bold">You're doing such a great job learning with me!</p>
            <p className="text-lg text-green-700 font-bold animate-pulse">Press ENTER and let's keep going together!</p>
          </div>
        </RetroDialog>        {/* Game Over State with encouraging Mr. Snake */}
        {gameStatus === GameStatus.GAME_OVER && (
          <RetroDialog show={true}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-600">🐍 You're Amazing!</h2>
              <p className="text-lg mb-4 text-gray-800">
                Wow! Look how much you tried! 🌟<br/>
                Mr. Snake is so proud of how hard you worked!
              </p>
              <p className="text-lg mb-6 text-purple-600 font-semibold">
                Every attempt makes you a better reader! Want to try another adventure with Mr. Snake?
              </p>
              <Button
                onClick={restartGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full"
              >
                🐍 Let's Play Again with Mr. Snake!
              </Button>
            </div>
          </RetroDialog>
        )}
      </div>      {/* Game Controls */}
      <div className="mt-4 space-x-4">
        {gameStatus === GameStatus.PLAYING && (
          <>
            <Button onClick={pauseGame}>
              Pause
            </Button>
            <Button 
              onClick={restartGame}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Restart
            </Button>
          </>
        )}
        {gameStatus === GameStatus.PAUSED && (
          <>
            <Button onClick={resumeGame}>
              Resume
            </Button>
            <Button 
              onClick={restartGame}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Restart
            </Button>
          </>
        )}
      </div>
    </div>
  );
}