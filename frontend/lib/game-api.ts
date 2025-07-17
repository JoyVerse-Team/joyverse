// API service for game session management and emotion detection
// This service communicates with both the Node.js backend (for game logic) 
// and the FastAPI backend (for emotion detection)

import { Difficulty } from "@/components/snake-game/word-lists"
import { landmarkEmotionDetector, type LandmarkEmotionData } from "./landmark-emotion-detector"

export interface EmotionData {
  emotion: string
  confidence: number
}

interface StartGameResponse {
  sessionId: string
  gameName: string
  success: boolean
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

  async endGame(sessionId: string, durationSeconds?: number): Promise<void> {
    try {
      const body: any = { sessionId }
      if (durationSeconds !== undefined) {
        body.durationSeconds = durationSeconds
      }

      const response = await fetch(`${this.nodeBackendUrl}/api/game/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to end game: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error ending game:', error)
      throw error
    }
  }

  async detectEmotion(landmarks: number[]): Promise<EmotionData> {
    try {
      const response = await fetch(`${this.fastapiUrl}/detect_emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ landmarks: landmarks }),
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
  // Capture emotion using landmark-based detection
  async captureAndDetectEmotion(): Promise<EmotionData> {
    try {
      console.log('Using landmark-based emotion detection');
      
      // Use the landmark detector for proper emotion detection
      const landmarkResult = await landmarkEmotionDetector.captureAndDetectEmotion();
      
      return {
        emotion: landmarkResult.emotion,
        confidence: landmarkResult.confidence
      }
    } catch (error) {
      console.error('Error capturing and detecting emotion:', error)
      
      // Return a mock emotion for now so the game doesn't break
      return {
        emotion: 'neutral',
        confidence: 0.5
      }
    }
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

  // New method to submit emotion data with updated session schema
  async submitEmotionData(
    userId: string,
    sessionId: string,
    emotion: EmotionData,
    word: string,
    difficulty: string
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
          word,
          difficulty,
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
