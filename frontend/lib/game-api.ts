/**
 * Game API Service
 * 
 * This service handles communication between the frontend and backend services
 * for game session management and emotion detection. It interfaces with:
 * 1. Node.js backend (port 5000) - Game logic, session management, difficulty adaptation
 * 2. FastAPI backend (port 8000) - Emotion detection from facial landmarks
 * 
 * The service provides methods for:
 * - Starting game sessions
 * - Submitting emotion data
 * - Detecting emotions from facial landmarks
 * - Managing game difficulty based on emotional state
 */

import { Difficulty } from "@/components/snake-game/word-lists"
import { landmarkEmotionDetector, type LandmarkEmotionData } from "./landmark-emotion-detector"

// Interface for emotion data structure
export interface EmotionData {
  emotion: string // Detected emotion (happy, sad, angry, etc.)
  confidence: number // Confidence score (0-1)
}

// Response interface for game start endpoint
interface StartGameResponse {
  sessionId: string // Unique session identifier
  gameName: string // Name of the game
  success: boolean // Whether the operation succeeded
  message: string // Status message
}

// Response interface for emotion submission endpoint
interface SubmitEmotionResponse {
  next_difficulty: string // Recommended difficulty level
  difficulty_changed: boolean // Whether difficulty was adjusted
  message: string // Status message
}

// Response interface for emotion detection endpoint
interface EmotionDetectionResponse {
  emotion: string // Detected emotion
  confidence: number // Confidence score
}

/**
 * GameApiService class that handles all game-related API calls
 */
class GameApiService {
  // Backend service URLs
  private nodeBackendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://joyverse-l1wm.onrender.com'
  private fastapiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'https://osmium05-landmark-emotion.hf.space'

  /**
   * Starts a new game session for a user
   * @param userId - User identifier
   * @returns Promise resolving to StartGameResponse
   */
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
