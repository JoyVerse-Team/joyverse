"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { wordLists, Difficulty } from "./word-lists"
import {
  Direction,
  GameStatus,
  type Point,
  type SnakeGameProps,
  type SnakeGameState,
  type LetterItem,
} from "@/components/snake-game/types"
import {
  CELL_SIZE,
  INITIAL_SNAKE_LENGTH,
  LETTER_COLORS,
  GAME_COLORS,
  getDistractorLetters,
  getSnakeSegmentColor,
  getSafeDirection,
} from "@/components/snake-game/constants"

// Constants for game speed and input handling
const GAME_SPEED = 4 // Balanced speed for smooth movement
const INPUT_QUEUE_SIZE = 2 // Keep last 2 moves for responsive turning

// Add this near the top of the file with other utilities
const isValidDirectionChange = (currentDirection: Direction, newDirection: Direction): boolean => {
  // Prevent 180-degree turns
  return !(
    (currentDirection === Direction.UP && newDirection === Direction.DOWN) ||
    (currentDirection === Direction.DOWN && newDirection === Direction.UP) ||
    (currentDirection === Direction.LEFT && newDirection === Direction.RIGHT) ||
    (currentDirection === Direction.RIGHT && newDirection === Direction.LEFT)
  );
};

export function useSnakeGame({ canvasRef, onWordComplete, onLifeLoss, paused }: SnakeGameProps & { paused?: boolean }) {
  const [gameState, setGameState] = useState<SnakeGameState>({
    snake: [],
    direction: Direction.RIGHT,
    nextDirection: Direction.RIGHT,
    targetWord: '',
    collectedLetters: "",
    letters: [],
    wordsCompleted: 0,
    lives: 3,
    gameStatus: GameStatus.INTRO, // Start with intro screen
    difficulty: 'level1' as Difficulty
  })

  const TOTAL_WORDS = 10;
  const gameLoopRef = useRef<number | null>(null)
  const lastRenderTimeRef = useRef<number>(0)
  const gameStateRef = useRef<SnakeGameState>(gameState)
  const inputQueueRef = useRef<Direction[]>([]) // Add input queue to handle quick keypresses

  // Keep gameStateRef in sync with gameState
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // Get a random word based on current difficulty only
  const getRandomWord = useCallback((forceDifficulty?: Difficulty) => {
    // Use forced difficulty or current difficulty from state
    const difficulty = forceDifficulty || gameStateRef.current.difficulty;
    const words = wordLists[difficulty];
    const randomIndex = Math.floor(Math.random() * words.length);
    
    return words[randomIndex];
  }, []);

  // Generate letters for the game
  const generateLetters = useCallback((word: string, canvas: HTMLCanvasElement | null): LetterItem[] => {
    if (!canvas) return []

    const letters: LetterItem[] = []
    const usedPositions: Set<string> = new Set()
    const maxX = Math.floor(canvas.width / CELL_SIZE) - 1
    const maxY = Math.floor(canvas.height / CELL_SIZE) - 1
    
    // Helper function to get a random position
    const getRandomPosition = (): { x: number, y: number } => {
      let x, y, posKey
      do {
        x = Math.floor(Math.random() * (maxX - 2)) + 1
        y = Math.floor(Math.random() * (maxY - 2)) + 1
        posKey = `${x},${y}`
      } while (usedPositions.has(posKey))
      
      usedPositions.add(posKey)
      return { x, y }
    }

    // Add correct letters
    const wordLetters = word.split("")
    for (let i = 0; i < wordLetters.length; i++) {
      const position = getRandomPosition()
      
      letters.push({
        letter: wordLetters[i],
        position,
        isCorrect: true,
        isNextInSequence: i === 0, // Only first letter is next in sequence initially
        color: LETTER_COLORS.correct,
        wordIndex: i,
      })
    }

    // Add 5 distractor letters
    const distractors = getDistractorLetters(word).slice(0, 5)
    for (const letter of distractors) {
      const position = getRandomPosition()
      
      letters.push({
        letter,
        position,
        isCorrect: false,
        isNextInSequence: false,
        color: LETTER_COLORS.correct,
        wordIndex: undefined,
      })
    }

    return letters
  }, [])

  // Initialize or restart the game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Always start with level1
    const word = getRandomWord('level1')
    
    // Create initial snake
    const centerX = Math.floor(canvas.width / CELL_SIZE / 2)
    const centerY = Math.floor(canvas.height / CELL_SIZE / 2)

    const snake: Point[] = []
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      snake.push({ x: centerX - i, y: centerY })
    }

    // Generate letters for the word
    const letters = generateLetters(word, canvas)

    setGameState(prev => ({
      ...prev,
      snake,
      direction: Direction.RIGHT,
      nextDirection: Direction.RIGHT,
      targetWord: word,
      collectedLetters: "",
      letters,
      lives: 3,
      wordsCompleted: 0,
      gameStatus: GameStatus.PLAYING,
      difficulty: 'level1'
    }))
  }, [canvasRef, generateLetters, getRandomWord])

  // Draw game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentState = gameStateRef.current

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid background with alternating colors
    const gridCols = Math.floor(canvas.width / CELL_SIZE)
    const gridRows = Math.floor(canvas.height / CELL_SIZE)
    
    for (let col = 0; col < gridCols; col++) {
      for (let row = 0; row < gridRows; row++) {
        const isEvenTile = (col + row) % 2 === 0
        ctx.fillStyle = isEvenTile ? GAME_COLORS.gridTile1 : GAME_COLORS.gridTile2
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        
        // Add subtle grid lines
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
        ctx.lineWidth = 0.5
        ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      }
    }

    // Draw snake with gradient colors
    currentState.snake.forEach((segment, index) => {
      const segmentColor = getSnakeSegmentColor(index, currentState.snake.length)
      
      // Draw main segment
      ctx.fillStyle = segmentColor
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

      // Add border to segment
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
      ctx.lineWidth = 1
      ctx.strokeRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

      // Draw eyes on head
      if (index === 0) {
        const eyeRadius = CELL_SIZE / 8
        const eyeOffset = CELL_SIZE / 4

        let leftEyeX, leftEyeY, rightEyeX, rightEyeY

        switch (currentState.direction) {
          case Direction.UP:
            leftEyeX = segment.x * CELL_SIZE + eyeOffset
            leftEyeY = segment.y * CELL_SIZE + eyeOffset
            rightEyeX = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset
            rightEyeY = segment.y * CELL_SIZE + eyeOffset
            break
          case Direction.DOWN:
            leftEyeX = segment.x * CELL_SIZE + eyeOffset
            leftEyeY = segment.y * CELL_SIZE + CELL_SIZE - eyeOffset
            rightEyeX = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset
            rightEyeY = segment.y * CELL_SIZE + CELL_SIZE - eyeOffset
            break
          case Direction.LEFT:
            leftEyeX = segment.x * CELL_SIZE + eyeOffset
            leftEyeY = segment.y * CELL_SIZE + eyeOffset
            rightEyeX = segment.x * CELL_SIZE + eyeOffset
            rightEyeY = segment.y * CELL_SIZE + CELL_SIZE - eyeOffset
            break
          case Direction.RIGHT:
            leftEyeX = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset
            leftEyeY = segment.y * CELL_SIZE + eyeOffset
            rightEyeX = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset
            rightEyeY = segment.y * CELL_SIZE + CELL_SIZE - eyeOffset
            break
          default:
            leftEyeX = segment.x * CELL_SIZE + eyeOffset
            leftEyeY = segment.y * CELL_SIZE + eyeOffset
            rightEyeX = segment.x * CELL_SIZE + CELL_SIZE - eyeOffset
            rightEyeY = segment.y * CELL_SIZE + eyeOffset
        }

        // Draw eyes with black border
        ctx.fillStyle = GAME_COLORS.snakeEyes
        
        // Left eye
        ctx.beginPath()
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 1
        ctx.stroke()
        
        // Right eye
        ctx.beginPath()
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })

    // Draw letters
    currentState.letters.forEach((letter) => {
      const centerX = letter.position.x * CELL_SIZE + CELL_SIZE / 2
      const centerY = letter.position.y * CELL_SIZE + CELL_SIZE / 2
      const radius = CELL_SIZE / 2 - 2
      
      // Draw letter circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = letter.isNextInSequence ? LETTER_COLORS.next : letter.color
      ctx.fill()

      // Add circle border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw letter text
      ctx.fillStyle = "white"
      ctx.font = `bold ${CELL_SIZE * 0.7}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      
      // Add text shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      
      ctx.fillText(letter.letter.toUpperCase(), centerX, centerY)
      
      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    })
  }, [canvasRef])

  // Process the input queue
  const processInputQueue = useCallback(() => {
    if (inputQueueRef.current.length > 0) {
      const nextDirection = inputQueueRef.current[0]
      const currentState = gameStateRef.current
      
      // Check if this is a valid move
      const isValidMove = (
        (nextDirection === Direction.UP && currentState.direction !== Direction.DOWN) ||
        (nextDirection === Direction.DOWN && currentState.direction !== Direction.UP) ||
        (nextDirection === Direction.LEFT && currentState.direction !== Direction.RIGHT) ||
        (nextDirection === Direction.RIGHT && currentState.direction !== Direction.LEFT)
      )

      if (isValidMove) {
        setGameState(prev => ({
          ...prev,
          direction: nextDirection,
          nextDirection: nextDirection
        }))
      }
      
      // Remove the processed input
      inputQueueRef.current = inputQueueRef.current.slice(1)
    }
  }, [])

  // Game loop with optimized movement
  const gameLoop = useCallback(
    (currentTime: number) => {
      const currentState = gameStateRef.current

      if (currentState.gameStatus !== GameStatus.PLAYING) {
        if (currentState.gameStatus !== GameStatus.GAME_OVER) {
          gameLoopRef.current = requestAnimationFrame(gameLoop)
        }
        return
      }

      const secondsSinceLastRender = (currentTime - lastRenderTimeRef.current) / 1000
      if (secondsSinceLastRender < 1 / GAME_SPEED) {
        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return
      }

      lastRenderTimeRef.current = currentTime

      // Process any queued inputs before moving
      processInputQueue()

      // Update game state
      const newSnake = [...currentState.snake]
      const head = { ...newSnake[0] }

      // Move snake head based on current direction
      switch (currentState.direction) {
        case Direction.UP:
          head.y -= 1
          break
        case Direction.DOWN:
          head.y += 1
          break
        case Direction.LEFT:
          head.x -= 1
          break
        case Direction.RIGHT:
          head.x += 1
          break
      }

      // Handle boundary wrapping
      const canvas = canvasRef.current
      if (!canvas) {
        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return
      }

      const maxX = Math.floor(canvas.width / CELL_SIZE) - 1
      const maxY = Math.floor(canvas.height / CELL_SIZE) - 1

      if (head.x < 0) head.x = maxX
      else if (head.x > maxX) head.x = 0

      if (head.y < 0) head.y = maxY
      else if (head.y > maxY) head.y = 0

      // Add new head
      newSnake.unshift(head)

      // Check letter collision
      const letterIndex = currentState.letters.findIndex(
        letter => letter.position.x === head.x && letter.position.y === head.y
      )

      if (letterIndex !== -1) {
        const letter = currentState.letters[letterIndex]
        const nextNeededLetter = currentState.targetWord[currentState.collectedLetters.length]
        
        const isRepeatedLetter = letter.isCorrect && 
          letter.letter === nextNeededLetter &&
          currentState.targetWord.indexOf(letter.letter) !== 
          currentState.targetWord.lastIndexOf(letter.letter)
        
        const isValidRepeatedLetter = isRepeatedLetter && 
          currentState.collectedLetters.length > 0 && 
          currentState.targetWord.substring(0, currentState.collectedLetters.length) === 
          currentState.collectedLetters && 
          letter.letter === nextNeededLetter

        const isCorrectNextLetter = letter.isCorrect && 
          (letter.letter === nextNeededLetter || isValidRepeatedLetter)

        if (isCorrectNextLetter) {
          // Keep tail (grow) when collecting correct letter
          const newLetters = currentState.letters.filter((_, i) => i !== letterIndex)
          const newCollectedLetters = currentState.collectedLetters + letter.letter

          if (newCollectedLetters.length === currentState.targetWord.length) {
            const newWordsCompleted = currentState.wordsCompleted + 1
            
            // Call onWordComplete callback with the completed word
            onWordComplete?.(currentState.targetWord)
            
            if (newWordsCompleted >= TOTAL_WORDS) {
              setGameState(prev => ({
                ...prev,
                snake: newSnake,
                letters: newLetters,
                collectedLetters: newCollectedLetters,
                wordsCompleted: newWordsCompleted,
                gameStatus: GameStatus.GAME_OVER,
                gameWon: true
              }))
              return
            }

            // Start next word with random difficulty and restore lives
            const nextWord = getRandomWord()
            const nextWordLetters = generateLetters(nextWord, canvas)
            setGameState(prev => ({
              ...prev,
              snake: newSnake,
              targetWord: nextWord,
              collectedLetters: "",
              letters: nextWordLetters,
              wordsCompleted: newWordsCompleted,
              lives: 3 // Regenerate hearts
            }))
          } else {
            // Update next letter in sequence
            const nextLetterAfterThis = currentState.targetWord[newCollectedLetters.length]
            const updatedLetters = newLetters.map(l => ({
              ...l,
              isNextInSequence: l.isCorrect && l.letter === nextLetterAfterThis
            }))

            setGameState(prev => ({
              ...prev,
              snake: newSnake,
              letters: updatedLetters,
              collectedLetters: newCollectedLetters
            }))
          }
        } else {
          // Wrong letter hit
          newSnake.pop() // Remove tail when hitting wrong letter
          const newLives = currentState.lives - 1
          
          if (newLives <= 0) {
            setGameState(prev => ({
              ...prev,
              snake: newSnake,
              lives: newLives,
              gameStatus: GameStatus.GAME_OVER
            }))
            return
          }

          // Get new position for the letter
          const newPosition = {
            x: Math.floor(Math.random() * (maxX - 2)) + 1,
            y: Math.floor(Math.random() * (maxY - 2)) + 1
          }

          const updatedLetters = [...currentState.letters]
          updatedLetters[letterIndex] = {
            ...letter,
            position: newPosition
          }

          setGameState(prev => ({
            ...prev,
            snake: newSnake,
            letters: updatedLetters,
            lives: newLives
          }))

          if (onLifeLoss) {
            onLifeLoss()
          }
        }
      } else {
        // No collision, remove tail
        newSnake.pop()
        setGameState(prev => ({
          ...prev,
          snake: newSnake
        }))
      }

      drawGame()
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    },
    [canvasRef, drawGame, generateLetters, getRandomWord, onLifeLoss, processInputQueue]
  )

  // Process direction change immediately
  const changeDirection = useCallback((newDirection: Direction) => {
    const currentState = gameStateRef.current
    
    // Check if this is a valid move
    const isValidMove = (
      (newDirection === Direction.UP && currentState.direction !== Direction.DOWN) ||
      (newDirection === Direction.DOWN && currentState.direction !== Direction.UP) ||
      (newDirection === Direction.LEFT && currentState.direction !== Direction.RIGHT) ||
      (newDirection === Direction.RIGHT && currentState.direction !== Direction.LEFT)
    )

    if (isValidMove) {
      // Update direction immediately
      gameStateRef.current = {
        ...currentState,
        direction: newDirection,
        nextDirection: newDirection
      }
      setGameState(gameStateRef.current)
    }
  }, [])

  // Handle keyboard input with immediate response
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentState = gameStateRef.current
      
      // Prevent default for game keys
      const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "s", "S", "a", "A", "d", "D", " "]
      if (gameKeys.includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (currentState.gameStatus !== GameStatus.PLAYING) return

      // Handle direction changes
      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          changeDirection(Direction.UP)
          break
        case "arrowdown":
        case "s":
          changeDirection(Direction.DOWN)
          break
        case "arrowleft":
        case "a":
          changeDirection(Direction.LEFT)
          break
        case "arrowright":
        case "d":
          changeDirection(Direction.RIGHT)
          break
        case " ":
          const newStatus = currentState.gameStatus === GameStatus.PLAYING ? 
            GameStatus.PAUSED : GameStatus.PLAYING
          
          setGameState(prev => ({
            ...prev,
            gameStatus: newStatus
          }))

          if (newStatus === GameStatus.PLAYING) {
            lastRenderTimeRef.current = performance.now()
            gameLoopRef.current = requestAnimationFrame(gameLoop)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [changeDirection])

  // Start game function - simplified to just start the game
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridWidth = Math.floor(canvas.width / CELL_SIZE);
    const gridHeight = Math.floor(canvas.height / CELL_SIZE);
    
    // Initialize snake in the middle of the canvas
    const initialSnake: Point[] = [];
    const startX = Math.floor(gridWidth / 4);
    const startY = Math.floor(gridHeight / 2);
    
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({ x: startX - i, y: startY });
    }

    // Get initial word
    const words = wordLists['level1'];
    const initialWord = words[Math.floor(Math.random() * words.length)];

    setGameState({
      snake: initialSnake,
      direction: Direction.RIGHT,
      nextDirection: Direction.RIGHT,
      targetWord: initialWord,
      collectedLetters: "",
      letters: initialWord.split('').map((letter: string, index: number) => ({
        letter,
        position: {
          x: Math.floor(Math.random() * (gridWidth - 2)) + 1,
          y: Math.floor(Math.random() * (gridHeight - 2)) + 1
        },
        isCorrect: true,
        isNextInSequence: index === 0,
        color: index === 0 ? LETTER_COLORS.next : LETTER_COLORS.correct,
        wordIndex: index
      })),
      lives: 3,
      wordsCompleted: 0,
      gameStatus: GameStatus.PLAYING,
      difficulty: 'level1' as Difficulty
    });

    startGameLoop();
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const { key } = event;
      const currentStatus = gameStateRef.current.gameStatus;

      // Handle Enter key for intro screen
      if (currentStatus === GameStatus.INTRO && key === 'Enter') {
        event.preventDefault();
        startGame();
        return;
      }

      // Only handle movement keys when playing
      if (currentStatus !== GameStatus.PLAYING) return;

      switch (key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          setGameState(prev => ({
            ...prev,
            nextDirection: Direction.UP
          }));
          break;
        case 'arrowdown':
        case 's':
          setGameState(prev => ({
            ...prev,
            nextDirection: Direction.DOWN
          }));
          break;
        case 'arrowleft':
        case 'a':
          setGameState(prev => ({
            ...prev,
            nextDirection: Direction.LEFT
          }));
          break;
        case 'arrowright':
        case 'd':
          setGameState(prev => ({
            ...prev,
            nextDirection: Direction.RIGHT
          }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [startGame]);

  // Start game
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }

    initGame()
    lastRenderTimeRef.current = performance.now()
    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop, initGame])

  // Restart game
  const restartGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }

    initGame()
    lastRenderTimeRef.current = performance.now()
    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop, initGame])

  // Pause game
  const pauseGame = useCallback(() => {
    const newState = { ...gameStateRef.current, gameStatus: GameStatus.PAUSED }
    setGameState(newState)
    gameStateRef.current = newState
  }, [])

  // Resume game
  const resumeGame = useCallback(() => {
    const newState = { ...gameStateRef.current, gameStatus: GameStatus.PLAYING }
    setGameState(newState)
    gameStateRef.current = newState

    lastRenderTimeRef.current = performance.now()
    if (!gameLoopRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
  }, [gameLoop])

  // Pause/resume game loop based on paused prop
  useEffect(() => {
    if (paused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    } else if (gameStateRef.current.gameStatus === GameStatus.PLAYING) {
      if (!gameLoopRef.current) {
        lastRenderTimeRef.current = performance.now();
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    }
  }, [paused, gameStateRef.current.gameStatus]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [])

  // Adjust difficulty based on emotion - this is the ONLY way difficulty changes
  const adjustDifficultyByEmotion = useCallback((emotion: string) => {
    const currentDifficulty = gameStateRef.current.difficulty;
    let newDifficulty: Difficulty;

    // Emotion-based difficulty rules:
    // happy = increase by 1 level
    // neutral = stay at current level  
    // anything else = decrease by 1 level
    
    const normalizedEmotion = emotion.toLowerCase();
    
    if (normalizedEmotion === 'happy' || normalizedEmotion === 'joy') {
      // Increase difficulty by 1 level
      switch (currentDifficulty) {
        case 'level1': newDifficulty = 'level2'; break;
        case 'level2': newDifficulty = 'level3'; break;
        case 'level3': newDifficulty = 'level4'; break;
        case 'level4': newDifficulty = 'level4'; break; // Stay at max
        default: newDifficulty = 'level1';
      }
    } else if (normalizedEmotion === 'neutral') {
      // Stay at current level
      newDifficulty = currentDifficulty;
    } else {
      // Decrease difficulty by 1 level (for sad, angry, fear, frustrated, etc.)
      switch (currentDifficulty) {
        case 'level1': newDifficulty = 'level1'; break; // Stay at min
        case 'level2': newDifficulty = 'level1'; break;
        case 'level3': newDifficulty = 'level2'; break;
        case 'level4': newDifficulty = 'level3'; break;
        default: newDifficulty = 'level1';
      }
    }

    console.log(`Emotion: ${emotion} | Current: ${currentDifficulty} | New: ${newDifficulty}`);

    // Update difficulty in state
    setGameState(prev => ({
      ...prev,
      difficulty: newDifficulty
    }));

    return newDifficulty;
  }, []);

  // Adjust difficulty (placeholder for future AI integration)
  const adjustDifficulty = useCallback(
    (settings: {
      speed?: number
      distractorCount?: number
      backgroundColor?: string
    }) => {
      console.log("Adjusting difficulty with settings:", settings)
      // This function will be implemented later when integrating with the Transformer model
    },
    [],
  )

  return {
    ...gameState,
    startGame,
    restartGame,
    pauseGame,
    resumeGame,
    adjustDifficulty,
    adjustDifficultyByEmotion,
  }
}

// Helper function to create distractor letters
const createDistractorLetters = (word: string, gridWidth: number, gridHeight: number, snake: Point[]): LetterItem[] => {
  const letters: LetterItem[] = [];
  const wordLetters = word.split('');
  
  // Create letter items for each letter in the word
  for (let i = 0; i < wordLetters.length; i++) {
    // Generate random position that doesn't overlap with snake
    let position: Point;
    do {
      position = {
        x: Math.floor(Math.random() * (gridWidth - 2)) + 1,
        y: Math.floor(Math.random() * (gridHeight - 2)) + 1
      };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));

    letters.push({
      letter: wordLetters[i],
      position,
      isCorrect: true,
      isNextInSequence: i === 0,
      color: i === 0 ? LETTER_COLORS.next : LETTER_COLORS.correct,
      wordIndex: i
    });
  }

  // Add some distractor letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numDistractors = Math.min(5, gridWidth * gridHeight - wordLetters.length - snake.length);
  
  for (let i = 0; i < numDistractors; i++) {
    let position: Point;
    do {
      position = {
        x: Math.floor(Math.random() * (gridWidth - 2)) + 1,
        y: Math.floor(Math.random() * (gridHeight - 2)) + 1
      };
    } while (
      snake.some(segment => segment.x === position.x && segment.y === position.y) ||
      letters.some(item => item.position.x === position.x && item.position.y === position.y)
    );

    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    letters.push({
      letter: randomLetter,
      position,
      isCorrect: false,
      isNextInSequence: false,
      color: LETTER_COLORS.distractor
    });
  }

  return letters;
};
