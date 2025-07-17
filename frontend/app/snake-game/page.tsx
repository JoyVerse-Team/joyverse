"use client"

import { useEffect, useState, useRef } from "react"
import { SnakeGame } from "@/components/snake-game/snake-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Sparkles, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { gameApiService } from "@/lib/game-api"
import { GameStatus } from "@/components/snake-game/types"
import { useGameSession } from "@/hooks/useGameSession"
import { useAuth } from "@/components/auth-provider"
import "./emotion-backgrounds.css"
import { SaveNotification } from "@/components/SaveNotification"

// Emotion to gradient mapping
const emotionGradients = {
  'disgust': 'emotion-disgust',
  'sad': 'emotion-sad', 
  'angry': 'emotion-angry',
  'fear': 'emotion-fear',
  'neutral': 'emotion-neutral',
  'happy': 'emotion-happy',
  'surprise': 'emotion-surprise'
}

export default function SnakeGamePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { 
    session, 
    isLoading: sessionLoading, 
    error: sessionError,
    startSession, 
    endSession, 
    addEmotionData, 
    completeWord, 
    autoSave 
  } = useGameSession()
  
  const [backgroundEmotion, setBackgroundEmotion] = useState<string>("neutral")
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(1)
  const [lastEmotionUpdate, setLastEmotionUpdate] = useState<string>("")
  const [isProcessingEmotion, setIsProcessingEmotion] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.READY)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [currentEmotion, setCurrentEmotion] = useState<{ emotion: string, confidence: number } | null>(null)
  const [saveNotification, setSaveNotification] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({ show: false, message: '', type: 'info' })
  const emotionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const initialTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const periodicSaveRef = useRef<NodeJS.Timeout | null>(null)
  const currentWordRef = useRef<string>("")
  const currentDifficultyRef = useRef<string>("easy")

  // Helper function to convert difficulty number to string
  const getDifficultyName = (difficultyNum: number): string => {
    switch (difficultyNum) {
      case 1: return "easy"
      case 2: return "medium"
      case 3: return "hard"
      default: return "easy"
    }
  }

  // Function to start emotion detection
  const startEmotionDetection = () => {
    console.log('🚀 Starting emotion detection...')
    
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
    
    // Start periodic save every 30 seconds
    startPeriodicSave()
  }

  // Function to stop emotion detection
  const stopEmotionDetection = () => {
    console.log('🛑 Stopping emotion detection...')
    
    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current)
      emotionIntervalRef.current = null
    }
    if (initialTimeoutRef.current) {
      clearTimeout(initialTimeoutRef.current)
      initialTimeoutRef.current = null
    }
    
    // Stop periodic save
    stopPeriodicSave()
  }

  // Function to start periodic save
  const startPeriodicSave = () => {
    console.log('🕒 Starting periodic save (every 30 seconds)...')
    
    // Clear existing interval
    if (periodicSaveRef.current) {
      clearInterval(periodicSaveRef.current)
    }
    
    // Set up 30-second interval for periodic saves
    periodicSaveRef.current = setInterval(async () => {
      console.log('⏰ Periodic save triggered - saving pending data')
      await savePendingEmotionData()
    }, 30000)
  }

  // Function to stop periodic save
  const stopPeriodicSave = () => {
    if (periodicSaveRef.current) {
      clearInterval(periodicSaveRef.current)
      periodicSaveRef.current = null
      console.log('🛑 Stopped periodic save')
    }
  }
  // Handle game status changes
  const handleGameStatusChange = async (status: GameStatus) => {
    console.log(`Game status changed: ${status}`)
    setGameStatus(status)
    
    if (status === GameStatus.PLAYING) {
      // Only start session if not already active
      if (!session || !session.isActive) {
        await handleGameStart()
      }
      startEmotionDetection()
    } else if (status === GameStatus.GAME_OVER) {
      // Save any pending emotion data before ending the session
      await savePendingEmotionData()
      
      // End session when game is over
      stopEmotionDetection()
      if (session && session.isActive) {
        await endSession()
      }
    } else {
      stopEmotionDetection()
    }
  }

  // Handle emotion updates from the game component
  const handleEmotionUpdate = (emotion: string) => {
    console.log(`Received emotion update from game: ${emotion}`)
    if (emotion in emotionGradients && emotion !== 'surprise') {
      setBackgroundEmotion(emotion)
    }
  }
  
  // Handle current word changes (to track what word we're on)
  const handleCurrentWordChange = (word: string) => {
    currentWordRef.current = word
    console.log(`📝 Current word updated: "${word}"`)
  }
  
  // Function to capture emotion for background update only (not stored until word completion)
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
      
      // Store the current emotion for later use when word is completed
      setCurrentEmotion(emotion)
      console.log('💾 Current emotion stored for later use:', emotion.emotion)
      
      // Only update background if the emotion has a gradient mapping and isn't 'surprise'
      if (emotion.emotion in emotionGradients && emotion.emotion !== 'surprise') {
        console.log(`Updating background from ${backgroundEmotion} to ${emotion.emotion}`)
        setBackgroundEmotion(emotion.emotion)
        console.log(`Background emotion updated: ${emotion.emotion}`)
      } else {
        console.log(`Emotion ${emotion.emotion} not mapped to background gradient`)
      }

      // DON'T store emotion data here - only when word is completed
      console.log('�️ Emotion captured for background update only, will be stored when word is completed')
      
    } catch (error) {
      console.error('Failed to capture emotion for update:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setLastEmotionUpdate(`Error: ${errorMessage} at ${new Date().toLocaleTimeString()}`)
    } finally {
      setIsProcessingEmotion(false)
    }
  }
  
  // Apply background gradient when emotion changes
  useEffect(() => {
    console.log(`Background emotion changing to: ${backgroundEmotion}`)
    
    // Remove any existing emotion classes
    const emotionClasses = ['emotion-disgust', 'emotion-sad', 'emotion-angry', 'emotion-fear', 'emotion-neutral', 'emotion-happy', 'emotion-surprise', 'no-emotion-background']
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
    
    // Add beforeunload event listener to save data when closing browser
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      // Save any pending emotion data before the page unloads
      await savePendingEmotionData()
      
      // Standard beforeunload behavior
      event.preventDefault()
      event.returnValue = ''
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      stopEmotionDetection()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
  // Handle game start
  const handleGameStart = async () => {
    if (!user?.id) {
      console.error('No user found to start game')
      return
    }
    
    // Prevent starting multiple sessions
    if (session && session.isActive) {
      console.log('🎮 Session already active:', session.sessionId)
      return session.sessionId
    }

    if (sessionLoading) {
      console.log('🎮 Session start already in progress')
      return null
    }

    console.log('🎮 Starting new game session...')
    const sessionId = await startSession()
    if (sessionId) {
      console.log('🎮 Game session started successfully:', sessionId)
      setLastSaveTime(new Date())
      return sessionId
    }
    
    console.error('❌ Failed to start game session')
    return null
  }

  // Handle word completion - this is when difficulty should be adjusted AND emotion data stored
  const handleWordComplete = async (word: string) => {
    currentWordRef.current = word
    completeWord(word)
    console.log('🎯 Word completed:', word)
    
    // Store emotion data only when word is completed (not during gameplay)
    if (session && session.isActive && currentEmotion) {
      console.log('📊 Storing emotion data for completed word:', {
        word: word,
        emotion: currentEmotion.emotion,
        confidence: currentEmotion.confidence,
        difficulty: getDifficultyName(currentDifficulty)
      })
      
      const success = await addEmotionData(
        word, 
        currentEmotion, 
        getDifficultyName(currentDifficulty)
      )
      
      if (success) {
        console.log('✅ Emotion data successfully stored for word completion')
        // Clear the current emotion after storing
        setCurrentEmotion(null)
      } else {
        console.error('❌ Failed to store emotion data for word completion')
      }
    } else if (!currentEmotion) {
      console.warn('⚠️ No emotion data available to store for completed word')
    } else {
      console.warn('⚠️ No active session found for emotion data storage')
    }
    
    // Debug: Log current session state
    if (session) {
      console.log('📊 Current session emotion samples:', {
        totalSamples: session.emotionSamples.length,
        samples: session.emotionSamples.map(s => ({
          emotion: s.emotion,
          confidence: s.confidence,
          word: s.word,
          timestamp: s.timestamp
        }))
      })
    }
    
    // Now check if difficulty should be adjusted based on recent emotions
    if (session && session.emotionSamples.length > 0) {
      try {
        // Get the most recent emotion from the session
        const recentEmotions = session.emotionSamples.slice(-3) // Last 3 emotions
        const mostRecentEmotion = recentEmotions[recentEmotions.length - 1]
        
        console.log('🔍 Checking recent emotions for difficulty adjustment:', {
          totalEmotions: session.emotionSamples.length,
          recentEmotions: recentEmotions.map(e => e.emotion),
          mostRecent: mostRecentEmotion?.emotion
        })
        
        if (mostRecentEmotion) {
          const updatedDifficulty = await gameApiService.updateDifficultyBasedOnEmotion(mostRecentEmotion.emotion)
          if (updatedDifficulty.difficulty !== currentDifficulty) {
            setCurrentDifficulty(updatedDifficulty.difficulty)
            console.log(`🎯 Difficulty adjusted after word completion: ${updatedDifficulty.difficultyName} based on recent emotion: ${mostRecentEmotion.emotion}`)
          }
        }
      } catch (error) {
        console.error('Failed to update difficulty after word completion:', error)
      }
    } else {
      console.warn('⚠️ No emotion samples found in session for difficulty adjustment')
    }
  }

  // Function to save any pending emotion data before save/exit
  const savePendingEmotionData = async () => {
    if (session && session.isActive && currentEmotion && currentWordRef.current) {
      console.log('💾 Saving pending emotion data before save/exit:', {
        word: currentWordRef.current,
        emotion: currentEmotion.emotion,
        confidence: currentEmotion.confidence,
        difficulty: getDifficultyName(currentDifficulty)
      })
      
      const success = await addEmotionData(
        currentWordRef.current, 
        currentEmotion, 
        getDifficultyName(currentDifficulty)
      )
      
      if (success) {
        console.log('✅ Pending emotion data saved successfully')
        // Clear the current emotion after storing
        setCurrentEmotion(null)
        
        // Trigger auto-save to ensure the data is persisted
        await autoSave()
        console.log('💾 Triggered auto-save after saving pending emotion data')
        
        return true
      } else {
        console.error('❌ Failed to save pending emotion data')
        return false
      }
    } else if (currentEmotion && !currentWordRef.current) {
      console.warn('⚠️ Current emotion exists but no current word to associate it with')
      return false
    } else {
      console.log('ℹ️ No pending emotion data to save')
      return true
    }
  }

  // Handle manual save
  const handleManualSave = async () => {
    // First save any pending emotion data
    await savePendingEmotionData()
    
    // Then do the regular auto-save
    await autoSave()
    setLastSaveTime(new Date())
    setSaveNotification({ show: true, message: 'Game progress saved!', type: 'success' })
    console.log('💾 Manual save completed with pending data')
  }

  // Show notification when session is created
  useEffect(() => {
    if (session) {
      setSaveNotification({
        show: true,
        message: 'Game session started! Your progress will be auto-saved.',
        type: 'info'
      })
    }
  }, [session])

  return (<div className="min-h-screen relative overflow-hidden">
      {/* Save Notification */}
      <SaveNotification 
        show={saveNotification.show}
        message={saveNotification.message}
        type={saveNotification.type}
        onClose={() => setSaveNotification(prev => ({ ...prev, show: false }))}
      />
      
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

      <div className="container mx-auto px-4 py-8 relative z-10">     
        <div className="mb-6 flex justify-between items-center">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          
          {/* Session Status and Manual Save */}
          <div className="flex items-center gap-4">
            {session && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Session Active
                {lastSaveTime && (
                  <span className="text-white/60">
                    • Last saved: {lastSaveTime.toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
            
            {session && (
              <Button
                onClick={handleManualSave}
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
            )}
          </div>
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
                <SnakeGame 
                  onGameStatusChange={handleGameStatusChange} 
                  onEmotionUpdate={handleEmotionUpdate}
                  onWordComplete={handleWordComplete}
                  onCurrentWordChange={handleCurrentWordChange}
                />
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
