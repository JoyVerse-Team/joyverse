// Game constants
export const CELL_SIZE = 30
export const GAME_SPEED = 2.5 // moves per second 
export const INITIAL_SNAKE_LENGTH = 3

// Colors - VS Code Color Picker Support
export const GAME_COLORS = {
  // Grid colors
  gridTile1: "#5fd41c", // Light green for alternating tiles
  gridTile2: "#bbdf8c", // Light yellow for alternating tiles
  
  // Wall and border colors
  wallBorder: "#654321", // Brown for wall borders
  wallFill: "#8B4513", // Darker brown for wall fill
  
  // Snake colors - gradient from dark blue (head) to light blue (tail)
  snakeHead: "#1565C0", // Dark blue for snake head
  snakeBody: "#42A5F5", // Medium blue for snake body
  snakeTail: "#90CAF9", // Light blue for snake tail
  snakeEyes: "#FFFFFF", // White for snake eyes
  
  // Letter colors
  letterCorrect: "#2196F3", // Blue for correct letters
  letterNext: "#4CAF50", // Green for next letter in sequence
  letterDistractor: "#F44336", // Red for distractor letters
  
  // Background
  gameBackground: "#F5F5F5", // Light gray game background
} as const

// Legacy letter colors for compatibility - all letters same color
export const LETTER_COLORS = {
  correct: GAME_COLORS.letterCorrect,
  next: GAME_COLORS.letterCorrect, // Same color as correct letters
  distractor: GAME_COLORS.letterCorrect, // Same color as correct letters
}

// Helper functions
export function getDistractorLetters(word: string): string[] {
  const distractors: string[] = []
  const letters = word.split("")

  // Create distractor letters based on common confusions (limit to 3-4 letters)
  const targetCount = Math.min(4, Math.max(3, word.length - 1))
  const usedDistractors = new Set<string>()

  for (let i = 0; i < targetCount && i < letters.length; i++) {
    const letter = letters[i]
    let distractor = ""

    switch (letter.toLowerCase()) {
      case "a":
        distractor = "o"
        break
      case "b":
        distractor = "d"
        break
      case "c":
        distractor = "e"
        break
      case "d":
        distractor = "b"
        break
      case "e":
        distractor = "c"
        break
      case "g":
        distractor = "q"
        break
      case "i":
        distractor = "l"
        break
      case "l":
        distractor = "i"
        break
      case "m":
        distractor = "n"
        break
      case "n":
        distractor = "m"
        break
      case "o":
        distractor = "a"
        break
      case "p":
        distractor = "q"
        break
      case "q":
        distractor = "p"
        break
      case "u":
        distractor = "v"
        break
      case "v":
        distractor = "u"
        break
      case "w":
        distractor = "v"
        break
      default:
        // For letters without common confusions, use a random letter
        distractor = String.fromCharCode(97 + Math.floor(Math.random() * 26))
    }

    // Avoid duplicates and letters that appear in the target word
    if (!usedDistractors.has(distractor) && !word.toLowerCase().includes(distractor)) {
      distractors.push(distractor)
      usedDistractors.add(distractor)
    }
  }

  // Fill remaining slots with random letters if needed
  while (distractors.length < targetCount) {
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26))
    if (!usedDistractors.has(randomChar) && !word.toLowerCase().includes(randomChar)) {
      distractors.push(randomChar)
      usedDistractors.add(randomChar)
    }
  }

  return distractors
}

// Function to get snake color based on segment position (gradient effect)
export function getSnakeSegmentColor(index: number, totalLength: number): string {
  if (index === 0) return GAME_COLORS.snakeHead
  if (index === totalLength - 1) return GAME_COLORS.snakeTail
  
  // Calculate gradient position (0 to 1)
  const ratio = index / (totalLength - 1)
  
  // Interpolate between head and tail colors
  const headColor = { r: 0x15, g: 0x65, b: 0xC0 } // #1565C0
  const tailColor = { r: 0x90, g: 0xCA, b: 0xF9 } // #90CAF9
  
  const r = Math.round(headColor.r + (tailColor.r - headColor.r) * ratio)
  const g = Math.round(headColor.g + (tailColor.g - headColor.g) * ratio)
  const b = Math.round(headColor.b + (tailColor.b - headColor.b) * ratio)
  
  return `rgb(${r}, ${g}, ${b})`
}

// Function to find a safe direction away from walls
export function getSafeDirection(head: {x: number, y: number}, currentDirection: string, maxX: number, maxY: number): string {
  const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT']
  const oppositeDirection = {
    'UP': 'DOWN',
    'DOWN': 'UP',
    'LEFT': 'RIGHT',
    'RIGHT': 'LEFT'
  }
  
  // Remove opposite direction to avoid going backwards
  const availableDirections = directions.filter(dir => dir !== oppositeDirection[currentDirection as keyof typeof oppositeDirection])
  
  // Calculate distances to walls for each direction
  const wallDistances = availableDirections.map(direction => {
    let distance = 0
    switch (direction) {
      case 'UP':
        distance = head.y
        break
      case 'DOWN':
        distance = maxY - head.y
        break
      case 'LEFT':
        distance = head.x
        break
      case 'RIGHT':
        distance = maxX - head.x
        break
    }
    return { direction, distance }
  })
  
  // Sort by distance (furthest from wall first)
  wallDistances.sort((a, b) => b.distance - a.distance)
  
  // Return the direction that leads away from the nearest wall
  return wallDistances[0].direction
}
