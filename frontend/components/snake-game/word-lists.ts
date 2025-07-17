/**
 * Word Lists for Snake Game
 * 
 * This file contains word lists organized by difficulty levels for the Snake Word Game.
 * The words are carefully selected to be age-appropriate and progressively challenging.
 * 
 * Difficulty Levels:
 * - Level 1: Simple 3-letter words (suitable for ages 3-5)
 * - Level 2: 4-letter words with common vocabulary (ages 5-7)
 * - Level 3: 5-letter words with moderate complexity (ages 7-9)
 * - Level 4: Longer words with advanced vocabulary (ages 9+)
 * 
 * Word Selection Criteria:
 * - Age-appropriate vocabulary
 * - Common words that children encounter daily
 * - Phonetically simple for easier pronunciation
 * - Progressively increasing letter count and complexity
 * - Positive or neutral connotations (avoiding scary/negative words)
 */

export const wordLists = {
  // Level 1: Simple 3-letter words for beginners
  level1: [
    'cat', 'dog', 'pig', 'bat', 'hat', // Animals and objects
    'rat', 'cup', 'sun', 'box', 'map'  // Common household items
  ],
  
  // Level 2: 4-letter words with familiar vocabulary
  level2: [
    'bird', 'cake', 'door', 'fish', 'lamp', // Nature and home items
    'moon', 'star', 'tree', 'book', 'rain'  // Educational and nature words
  ],
  
  // Level 3: 5-letter words with moderate complexity
  level3: [
    'apple', 'snake', 'house', 'bread', 'plant', // Food and nature
    'smile', 'beach', 'clock', 'phone', 'water'  // Emotions and everyday items
  ],
  
  // Level 4: Longer words with advanced vocabulary
  level4: [
    'elephant', 'keyboard', 'computer', 'rainbow', 'butterfly', // Animals and technology
    'mountain', 'sunshine', 'adventure', 'fantastic', 'creative'  // Nature and positive concepts
  ]
};

// Type definition for difficulty levels
export type Difficulty = 'level1' | 'level2' | 'level3' | 'level4';

/**
 * Helper function to get words for a specific difficulty level
 * @param difficulty - The difficulty level to get words for
 * @returns Array of words for the specified difficulty
 */
export function getWordsForDifficulty(difficulty: Difficulty): string[] {
  return wordLists[difficulty] || wordLists.level1;
}

/**
 * Helper function to get a random word from a specific difficulty level
 * @param difficulty - The difficulty level to get a word from
 * @returns Random word from the specified difficulty
 */
export function getRandomWordFromDifficulty(difficulty: Difficulty): string {
  const words = getWordsForDifficulty(difficulty);
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Helper function to get the next difficulty level
 * @param currentDifficulty - Current difficulty level
 * @returns Next difficulty level or same if already at max
 */
export function getNextDifficulty(currentDifficulty: Difficulty): Difficulty {
  const levels: Difficulty[] = ['level1', 'level2', 'level3', 'level4'];
  const currentIndex = levels.indexOf(currentDifficulty);
  return levels[currentIndex + 1] || currentDifficulty;
}

/**
 * Helper function to get the previous difficulty level
 * @param currentDifficulty - Current difficulty level
 * @returns Previous difficulty level or same if already at min
 */
export function getPreviousDifficulty(currentDifficulty: Difficulty): Difficulty {
  const levels: Difficulty[] = ['level1', 'level2', 'level3', 'level4'];
  const currentIndex = levels.indexOf(currentDifficulty);
  return levels[currentIndex - 1] || currentDifficulty;
}
