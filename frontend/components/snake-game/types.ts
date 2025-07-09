import type { RefObject } from "react"
import { Difficulty } from "./word-lists"

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export enum GameStatus {
  INTRO = "INTRO",
  TUTORIAL = "TUTORIAL",
  READY = "READY",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
}

export interface Point {
  x: number
  y: number
}

export interface LetterItem {
  letter: string
  position: Point
  isCorrect: boolean
  isNextInSequence: boolean
  color: string
  wordIndex?: number // Index in the target word (for correct letters)
}

export interface SnakeGameState {
  snake: Point[]
  direction: Direction
  nextDirection: Direction
  targetWord: string
  collectedLetters: string
  letters: LetterItem[]
  lives: number
  wordsCompleted: number
  gameStatus: GameStatus
  difficulty: Difficulty
  gameWon?: boolean
}

export interface SnakeGameProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  initialWord?: string
  onWordComplete?: (word: string) => void
  onLifeLoss?: () => void
}
