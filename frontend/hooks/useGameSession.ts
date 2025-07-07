import { useState, useCallback, useRef, useEffect } from 'react'
import { gameApiService, EmotionData } from '@/lib/game-api'
import { useAuth } from '@/components/auth-provider'

interface EmotionSample {
  word: string
  emotion: string
  confidence: number
  difficulty: string
  timestamp: Date
}

interface GameSession {
  sessionId: string
  userId: string
  gameName: string
  startTime: Date
  wordsCompleted: number
  emotionSamples: EmotionSample[]
  isActive: boolean
}

export function useGameSession() {
  const { user } = useAuth()
  const [session, setSession] = useState<GameSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Auto-save session data every 30 seconds
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null)

  // Start a new game session
  const startSession = useCallback(async (): Promise<string | null> => {
    if (!user?.id) {
      setError('User not authenticated')
      return null
    }

    // Prevent starting multiple sessions
    if (session && session.isActive) {
      console.warn('⚠️ Active session already exists')
      return session.sessionId
    }

    if (isLoading) {
      console.warn('⚠️ Session start already in progress')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await gameApiService.startGame(user.id)
      
      const newSession: GameSession = {
        sessionId: response.sessionId,
        userId: user.id,
        gameName: response.gameName || 'Snake Word Game',
        startTime: new Date(),
        wordsCompleted: 0,
        emotionSamples: [],
        isActive: true
      }

      setSession(newSession)
      
      return newSession.sessionId
    } catch (error) {
      console.error('❌ Failed to start game session:', error)
      setError(error instanceof Error ? error.message : 'Failed to start session')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, session, isLoading])

  // Add emotion data to session
  const addEmotionData = useCallback(async (
    word: string,
    emotion: EmotionData,
    difficulty: string
  ): Promise<boolean> => {
    if (!session || !session.isActive) {
      console.warn('⚠️ No active session to add emotion data to')
      return false
    }

    console.log('🔄 Submitting emotion data to backend...', {
      sessionId: session.sessionId,
      userId: session.userId,
      word,
      emotion: emotion.emotion,
      confidence: emotion.confidence,
      difficulty
    })

    try {
      // Submit to backend
      const response = await gameApiService.submitEmotionData(
        session.userId,
        session.sessionId,
        emotion,
        word,
        difficulty
      )

      console.log('📤 Backend response:', response)

      // Update local session state
      const emotionSample: EmotionSample = {
        word,
        emotion: emotion.emotion,
        confidence: emotion.confidence,
        difficulty,
        timestamp: new Date()
      }

      setSession(prev => {
        if (!prev) return prev
        const updatedSession = {
          ...prev,
          emotionSamples: [...prev.emotionSamples, emotionSample]
        }
        console.log('📊 Updated local session with emotion sample. Total samples:', updatedSession.emotionSamples.length)
        return updatedSession
      })

      return true
    } catch (error) {
      console.error('❌ Failed to add emotion data:', error)
      setError(error instanceof Error ? error.message : 'Failed to add emotion data')
      return false
    }
  }, [session])

  // Complete a word
  const completeWord = useCallback((word: string) => {
    if (!session) return

    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        wordsCompleted: prev.wordsCompleted + 1
      }
    })
  }, [session])

  // End session manually
  const endSession = useCallback(async (): Promise<boolean> => {
    if (!session) {
      console.warn('⚠️ No active session to end')
      return false
    }

    try {
      const durationSeconds = Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000)
      await gameApiService.endGame(session.sessionId, durationSeconds)
      
      setSession(prev => prev ? { ...prev, isActive: false } : null)
      
      return true
    } catch (error) {
      console.error('❌ Failed to end game session:', error)
      setError(error instanceof Error ? error.message : 'Failed to end session')
      return false
    }
  }, [session])

  // Auto-save session data
  const autoSave = useCallback(async () => {
    if (!session || !session.isActive) return

    try {
      const durationSeconds = Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000)
      
      // Use sendBeacon for reliability
      const data = JSON.stringify({
        sessionId: session.sessionId,
        durationSeconds
      })

      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${process.env.NEXT_PUBLIC_API_URL}/game/end`, data)
      } else {
        // Fallback to regular fetch
        await gameApiService.endGame(session.sessionId, durationSeconds)
      }
    } catch (error) {
      console.error('❌ Auto-save failed:', error)
    }
  }, [session])

  // Set up auto-save and cleanup
  useEffect(() => {
    if (session && session.isActive) {
      // Auto-save every 30 seconds
      autoSaveInterval.current = setInterval(autoSave, 30000)
      
      // Save on page unload
      const handleUnload = () => autoSave()
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        autoSave()
        e.preventDefault()
        e.returnValue = 'Your game progress will be saved. Are you sure you want to leave?'
        return e.returnValue
      }
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          autoSave()
        }
      }

      window.addEventListener('unload', handleUnload)
      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        if (autoSaveInterval.current) {
          clearInterval(autoSaveInterval.current)
        }
        window.removeEventListener('unload', handleUnload)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [session, autoSave])

  return {
    session,
    isLoading,
    error,
    startSession,
    endSession,
    addEmotionData,
    completeWord,
    autoSave
  }
}
