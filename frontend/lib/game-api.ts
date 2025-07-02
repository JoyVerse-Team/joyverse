// API service for game session management and emotion detection
// This service communicates with both the Node.js backend (for game logic) 
// and the FastAPI backend (for emotion detection)

import { Difficulty } from "@/components/snake-game/word-lists"

export interface EmotionData {
  emotion: string
  confidence: number
}

interface StartGameResponse {
  session_id: string
  initial_difficulty: string
  message: string
}

interface SubmitEmotionResponse {
  next_difficulty: string
  difficulty_changed: boolean
  message: string
}

interface EmotionDetectionResponse {
  emotion: string
  confidence: number
}

class GameApiService {
  private nodeBackendUrl = 'http://localhost:5000'
  private fastapiUrl = 'http://localhost:8000'

  async startGame(userId: string): Promise<StartGameResponse> {
    try {
      const response = await fetch(`${this.nodeBackendUrl}/api/game/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to start game: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error starting game:', error)
      throw error
    }
  }

  async submitEmotion(
    userId: string,
    sessionId: string,
    emotion: EmotionData,
    roundNumber: number,
    word: string,
    timeTaken: number
  ): Promise<SubmitEmotionResponse> {
    try {
      const response = await fetch(`${this.nodeBackendUrl}/api/game/emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionId,
          emotion: emotion.emotion,
          confidence: emotion.confidence,
          roundNumber,
          word,
          timeTaken,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit emotion: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error submitting emotion:', error)
      throw error
    }
  }

  async endGame(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.nodeBackendUrl}/api/game/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to end game: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error ending game:', error)
      throw error    }
  }

  async detectEmotion(imageData: string): Promise<EmotionData> {
    try {
      const response = await fetch(`${this.fastapiUrl}/detect_emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        throw new Error(`FastAPI server returned ${response.status}: ${response.statusText}`)
      }

      const result: EmotionDetectionResponse = await response.json()
      return {
        emotion: result.emotion,
        confidence: result.confidence,
      }
    } catch (error) {
      console.error('Error detecting emotion:', error)
      throw error // Don't use mock data, let the error propagate
    }
  }
  // Helper method to capture webcam image and detect emotion
  async captureAndDetectEmotion(): Promise<EmotionData> {
    // Get video stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    const video = document.createElement('video')
    video.srcObject = stream
    video.play()

    // Wait for video to be ready
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve
    })

    // Capture frame
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg').split(',')[1]

    // Stop video stream
    stream.getTracks().forEach(track => track.stop())

    // Detect emotion using FastAPI - no fallback, throw error if it fails
    return await this.detectEmotion(imageData)
  }

  // Update difficulty based on emotion (for real-time difficulty adaptation)
  async updateDifficultyBasedOnEmotion(emotion: string): Promise<{ difficulty: number, difficultyName: string }> {
    try {
      const response = await fetch(`${this.nodeBackendUrl}/api/game/update-difficulty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update difficulty: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        difficulty: this.difficultyNameToNumber(result.difficulty),
        difficultyName: result.difficulty
      }
    } catch (error) {
      console.error('Error updating difficulty based on emotion:', error)
      throw error
    }
  }

  // Submit emotion with automatic session management
  async submitEmotionToSession(
    userId: string,
    emotion: EmotionData,
    word?: string,
    roundNumber?: number
  ): Promise<{ sessionId: string, difficulty: number, difficultyName: string }> {
    try {
      const response = await fetch(`${this.nodeBackendUrl}/api/game/submit-emotion-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          emotion: emotion.emotion,
          confidence: emotion.confidence,
          word,
          roundNumber,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit emotion: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        sessionId: result.sessionId,
        difficulty: this.difficultyNameToNumber(result.difficulty),
        difficultyName: result.difficultyName
      }
    } catch (error) {
      console.error('Error submitting emotion to session:', error)
      throw error
    }
  }

  // Get current active session for user
  async getCurrentSession(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.nodeBackendUrl}/api/game/current-session/${userId}`)

      if (!response.ok) {
        throw new Error(`Failed to get current session: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting current session:', error)
      throw error
    }
  }

  // Capture emotion and submit to session in one call
  async captureAndSubmitEmotion(
    userId: string, 
    word?: string, 
    roundNumber?: number
  ): Promise<{ emotion: EmotionData, sessionData: any }> {
    try {
      // First capture the emotion
      const emotion = await this.captureAndDetectEmotion()
      
      // Then submit it to the session
      const sessionData = await this.submitEmotionToSession(userId, emotion, word, roundNumber)
      
      return {
        emotion,
        sessionData
      }
    } catch (error) {
      console.error('Error capturing and submitting emotion:', error)
      throw error
    }
  }

  // Helper to convert difficulty name to number
  private difficultyNameToNumber(difficultyName: string): number {
    switch (difficultyName.toLowerCase()) {
      case 'easy': return 1
      case 'medium': return 2
      case 'hard': return 3
      default: return 2 // default to medium
    }
  }
}

export const gameApiService = new GameApiService()
