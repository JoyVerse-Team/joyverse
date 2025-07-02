"use client"

import { useEffect, useState, useRef } from "react"
import { SnakeGame } from "@/components/snake-game/snake-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { gameApiService } from "@/lib/game-api"
import { GameStatus } from "@/components/snake-game/types"
import "./emotion-backgrounds.css"

// Emotion to gradient mapping
const emotionGradients = {
  'frustration': 'emotion-frustration',
  'sadness': 'emotion-sadness', 
  'anger': 'emotion-anger',
  'fear': 'emotion-fear',
  'neutral': 'emotion-neutral',
  'happy': 'emotion-happy'
}

export default function SnakeGamePage() {
  const router = useRouter()
  const [backgroundEmotion, setBackgroundEmotion] = useState<string>("neutral")
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(1)
  const [lastEmotionUpdate, setLastEmotionUpdate] = useState<string>("")
  const [isProcessingEmotion, setIsProcessingEmotion] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.READY)
  const emotionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const initialTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to start emotion detection
  const startEmotionDetection = () => {
    console.log('Starting emotion detection...')
    
    // Clear any existing intervals
    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current)
    }
    if (initialTimeoutRef.current) {
      clearTimeout(initialTimeoutRef.current)
    }

    // Initial emotion capture after a short delay (10 seconds)
    initialTimeoutRef.current = setTimeout(() => {
      captureEmotionForUpdate()
    }, 10000)
    
    // Set up interval for emotion detection every 10 seconds
    emotionIntervalRef.current = setInterval(() => {
      captureEmotionForUpdate()
    }, 10000)
  }

  // Function to stop emotion detection
  const stopEmotionDetection = () => {
    console.log('Stopping emotion detection...')
    
    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current)
      emotionIntervalRef.current = null
    }
    if (initialTimeoutRef.current) {
      clearTimeout(initialTimeoutRef.current)
      initialTimeoutRef.current = null
    }
  }
  // Handle game status changes
  const handleGameStatusChange = (status: GameStatus) => {
    console.log(`Game status changed: ${status}`)
    setGameStatus(status)
    
    if (status === GameStatus.PLAYING) {
      startEmotionDetection()
    } else {
      stopEmotionDetection()
    }
  }

  // Handle emotion updates from the game component
  const handleEmotionUpdate = (emotion: string) => {
    console.log(`Received emotion update from game: ${emotion}`)
    if (emotion in emotionGradients && emotion !== 'surprised') {
      setBackgroundEmotion(emotion)
    }
  }
  // Function to capture emotion for both background and difficulty update
  const captureEmotionForUpdate = async () => {
    if (isProcessingEmotion) {
      console.log('Emotion processing already in progress, skipping...')
      return
    }

    setIsProcessingEmotion(true)
    try {
      console.log('Starting emotion capture...')
      const emotion = await gameApiService.captureAndDetectEmotion()
      console.log(`Emotion detected: ${emotion.emotion} (confidence: ${emotion.confidence})`)
      
      setLastEmotionUpdate(`${emotion.emotion} (${(emotion.confidence * 100).toFixed(1)}%) at ${new Date().toLocaleTimeString()}`)
        // Only update background if the emotion has a gradient mapping and isn't 'surprised'
      if (emotion.emotion in emotionGradients && emotion.emotion !== 'surprised') {
        console.log(`Updating background from ${backgroundEmotion} to ${emotion.emotion}`)
        setBackgroundEmotion(emotion.emotion)
        console.log(`Background emotion updated: ${emotion.emotion}`)
      } else {
        console.log(`Emotion ${emotion.emotion} not mapped to background gradient`)
      }

      // Update difficulty based on emotion
      try {
        const updatedDifficulty = await gameApiService.updateDifficultyBasedOnEmotion(emotion.emotion)
        setCurrentDifficulty(updatedDifficulty.difficulty)
        console.log(`Difficulty updated: ${updatedDifficulty.difficulty} (${updatedDifficulty.difficultyName}) based on emotion: ${emotion.emotion}`)
      } catch (difficultyError) {
        console.error('Failed to update difficulty:', difficultyError)
      }    } catch (error) {
      console.error('Failed to capture emotion for update:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setLastEmotionUpdate(`Error: ${errorMessage} at ${new Date().toLocaleTimeString()}`)
    } finally {
      setIsProcessingEmotion(false)
    }  }
  
  // Apply background gradient when emotion changes
  useEffect(() => {
    console.log(`Background emotion changing to: ${backgroundEmotion}`)
    
    // Remove any existing emotion classes
    const emotionClasses = ['emotion-frustration', 'emotion-sadness', 'emotion-anger', 'emotion-fear', 'emotion-neutral', 'emotion-happy', 'no-emotion-background']
    emotionClasses.forEach(className => {
      document.body.classList.remove(className)
    })
    
    // Force remove any inline styles that might interfere
    document.body.style.background = ''
    document.body.style.backgroundImage = ''
    document.body.style.backgroundSize = ''
    document.body.style.animation = ''
    
    // Add the new emotion class
    const emotionClass = `emotion-${backgroundEmotion}`
    document.body.classList.add(emotionClass)
    console.log(`Applied background class: ${emotionClass}`)
    
    // Force reflow to ensure styles are applied
    document.body.offsetHeight
    
    // Cleanup function to remove emotion classes on unmount
    return () => {
      emotionClasses.forEach(className => {
        document.body.classList.remove(className)
      })
      document.body.classList.add('no-emotion-background')
    }
  }, [backgroundEmotion])
  // Cleanup emotion detection on unmount and initialize default background
  useEffect(() => {
    // Set default background on mount
    setBackgroundEmotion("neutral")
    
    return () => {
      stopEmotionDetection()
    }
  }, [])
  return (<div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30 blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-15 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-25 blur-xl animate-bounce delay-500"></div>
        
        {/* Floating decorative icons */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Star className="w-6 h-6 text-yellow-400 fill-current opacity-60" />
        </div>
        <div className="absolute top-32 right-20 animate-pulse">
          <Sparkles className="w-5 h-5 text-pink-400 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-1000">
          <Star className="w-5 h-5 text-blue-400 fill-current opacity-60" />
        </div>
        <div className="absolute top-40 right-40 animate-pulse delay-500">
          <Sparkles className="w-6 h-6 text-purple-400 opacity-60" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">          {/* Back Button */}        
        <div className="mb-6">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </div>{/* Game Title */}
       {/* Game Container */}
        <div className="flex justify-center">
          <div className="relative group">            {/* Glass card container */}
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl"></div>
              
              {/* Static border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 opacity-20 blur-sm -z-10"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <SnakeGame onGameStatusChange={handleGameStatusChange} onEmotionUpdate={handleEmotionUpdate} />
              </div>
            </div>
            
            {/* Static outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl -z-20 opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
