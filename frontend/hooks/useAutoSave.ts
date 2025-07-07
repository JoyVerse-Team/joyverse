import { useEffect, useRef, useCallback } from 'react'
import { gameApiService } from '@/lib/game-api'

interface SessionData {
  sessionId: string
  userId: string
  wordsCompleted: number
  emotionSamples: Array<{
    word: string
    emotion: string
    confidence: number
    difficulty: string
    timestamp: Date
  }>
  startTime: Date
  lastSaveTime: Date
}

export interface UseAutoSaveOptions {
  sessionData: SessionData | null
  onSaveError?: (error: Error) => void
  onSaveSuccess?: () => void
  saveInterval?: number // milliseconds, default 30 seconds
  enabled?: boolean
}

export function useAutoSave({
  sessionData,
  onSaveError,
  onSaveSuccess,
  saveInterval = 30000, // 30 seconds
  enabled = true
}: UseAutoSaveOptions) {
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSaveRef = useRef<Date | null>(null)
  const isUnloadingRef = useRef(false)

  // Function to save session data
  const saveSessionData = useCallback(async (data: SessionData, isManual = false) => {
    if (!data || !enabled) return

    try {
      console.log(`🔄 ${isManual ? 'Manual' : 'Auto'} saving session data...`, {
        sessionId: data.sessionId,
        wordsCompleted: data.wordsCompleted,
        emotionSamples: data.emotionSamples.length
      })

      // Calculate duration
      const durationSeconds = Math.floor((new Date().getTime() - data.startTime.getTime()) / 1000)

      // Save to backend
      await gameApiService.endGame(data.sessionId, durationSeconds)

      lastSaveRef.current = new Date()
      onSaveSuccess?.()
      
      console.log('✅ Session data saved successfully')
    } catch (error) {
      console.error('❌ Failed to save session data:', error)
      onSaveError?.(error as Error)
    }
  }, [enabled, onSaveError, onSaveSuccess])

  // Auto-save effect
  useEffect(() => {
    if (!sessionData || !enabled) {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
        saveIntervalRef.current = null
      }
      return
    }

    // Set up auto-save interval
    saveIntervalRef.current = setInterval(() => {
      if (!isUnloadingRef.current) {
        saveSessionData(sessionData, false)
      }
    }, saveInterval)

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
        saveIntervalRef.current = null
      }
    }
  }, [sessionData, saveInterval, enabled, saveSessionData])

  // Handle page unload/close
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (sessionData && enabled) {
        isUnloadingRef.current = true
        
        // Try to save data synchronously
        try {
          // Use sendBeacon for more reliable data sending on page unload
          const durationSeconds = Math.floor((new Date().getTime() - sessionData.startTime.getTime()) / 1000)
          
          navigator.sendBeacon(
            `${process.env.NEXT_PUBLIC_API_URL}/game/end`,
            JSON.stringify({
              sessionId: sessionData.sessionId,
              durationSeconds
            })
          )
        } catch (error) {
          console.error('Failed to save data on page unload:', error)
        }

        // Show warning to user
        event.preventDefault()
        event.returnValue = 'Your game progress will be saved. Are you sure you want to leave?'
        return event.returnValue
      }
    }

    const handleUnload = () => {
      if (sessionData && enabled) {
        isUnloadingRef.current = true
        
        // Final attempt to save using sendBeacon
        try {
          const durationSeconds = Math.floor((new Date().getTime() - sessionData.startTime.getTime()) / 1000)
          
          navigator.sendBeacon(
            `${process.env.NEXT_PUBLIC_API_URL}/game/end`,
            JSON.stringify({
              sessionId: sessionData.sessionId,
              durationSeconds
            })
          )
        } catch (error) {
          console.error('Failed to save data on unload:', error)
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionData && enabled) {
        // Page is being hidden (tab switched, minimized, etc.)
        saveSessionData(sessionData, true)
      }
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [sessionData, enabled, saveSessionData])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (sessionData && enabled) {
        saveSessionData(sessionData, true)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [sessionData, enabled, saveSessionData])

  // Manual save function
  const manualSave = useCallback(() => {
    if (sessionData) {
      return saveSessionData(sessionData, true)
    }
    return Promise.resolve()
  }, [sessionData, saveSessionData])

  return {
    manualSave,
    lastSaveTime: lastSaveRef.current,
    isAutoSaveEnabled: enabled
  }
}
