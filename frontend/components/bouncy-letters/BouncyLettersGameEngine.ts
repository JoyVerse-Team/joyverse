import * as Phaser from "phaser";

let gameInstance: Phaser.Game | null = null;

// Global emotion state that can be updated from React component
interface GlobalEmotionState {
  currentEmotion: string;
  onEmotionChange: (() => void) | null;
}

const globalEmotionState: GlobalEmotionState = {
  currentEmotion: 'neutral',
  onEmotionChange: null
};

// Function to update emotion from React component
export const updateGameEmotion = (emotion: string, callback?: () => void): void => {
  globalEmotionState.currentEmotion = emotion;
  globalEmotionState.onEmotionChange = callback || null;
  console.log(`Game emotion updated to: ${emotion}`);
};

class BouncyLettersScene extends Phaser.Scene {
  private levels: string[] = ['b', 'd', 'p', 'q', 'e']; // 5 levels with specific letters
  private currentLevel: number = 0;
  private targetCatches: number = 5; // Must catch 5 of each letter
  private gameStarted: boolean = false;
  private emotionColors: Record<string, string> = {
    'happy': '#FFD700',
    'sad': '#4682B4',
    'neutral': '#808080',
    'surprise': '#FF6347',
    'angry': '#DC143C',
    'fear': '#4B0082',
    'disgust': '#9ACD32'
  };
  
  private targetLetter: string = '';
  private passedEmotion: string = '';
  private currentEmotion: string = '';
  private score: number = 0;
  private misses: number = 0;
  private maxLives: number = 3;
  private scoreText: Phaser.GameObjects.Text | null = null;
  private livesText: Phaser.GameObjects.Text | null = null;
  private instructionText: Phaser.GameObjects.Text | null = null;
  private letters: Phaser.GameObjects.Group | null = null;
  private emotionIndicator: Phaser.GameObjects.Text | null = null;
  private levelText: Phaser.GameObjects.Text | null = null;
  private startScreenGroup: Phaser.GameObjects.Group | null = null;
  private gameWidth: number = 0;
  private gameHeight: number = 0;
  private letterFontSize: number = 0;
  private baseFontSize: number = 0;
  private buttonFontSize: number = 0;
  private nextButton: Phaser.GameObjects.Text | null = null;
  private popupGroup: Phaser.GameObjects.Group | null = null;

  constructor() {
    super("BouncyLetters");
  }

  init(data: { level?: number; emotion?: string }): void {
    this.currentLevel = data.level || 0;
    this.targetLetter = this.levels[this.currentLevel % this.levels.length];
    this.passedEmotion = data.emotion || "neutral";
    this.currentEmotion = this.passedEmotion;
    this.score = 0;
    this.misses = 0;
    this.maxLives = 3;
    this.scoreText = null;
    this.livesText = null;
    this.instructionText = null;
    this.letters = null;
    this.emotionIndicator = null;
    this.levelText = null;
    this.startScreenGroup = null;
    this.gameStarted = false;
  }

  preload(): void {
    // No need to preload background if it's handled by outer React
  }

  create(): void {
    // Get game dimensions for responsive positioning
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    
    // Calculate responsive font sizes - making letters bigger
    const baseFontSize = Math.min(gameWidth, gameHeight) * 0.045; // Increased from 0.035
    const buttonFontSize = Math.min(gameWidth, gameHeight) * 0.05; // Increased from 0.04
    const letterFontSize = Math.min(gameWidth, gameHeight) * 0.12; // Increased from 0.08 - Much bigger letters!
    
    // Store dimensions for other methods
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.letterFontSize = letterFontSize;
    this.baseFontSize = baseFontSize;
    this.buttonFontSize = buttonFontSize;
    
    // Add emotion-based background tint
    this.updateEmotionEffects();
    
    // Start game directly without start screen
    this.startGame();
  }

  updateEmotionEffects(): void {
    // Update emotion from global state
    if (globalEmotionState.currentEmotion !== this.currentEmotion) {
      this.currentEmotion = globalEmotionState.currentEmotion;
      
      // Update emotion indicator if it exists
      if (this.emotionIndicator) {
        this.emotionIndicator.setText(`Emotion: ${this.currentEmotion}`);
        this.emotionIndicator.setColor(this.emotionColors[this.currentEmotion] || "#000");
      }
      
      console.log(`Game emotion updated to: ${this.currentEmotion}`);
    }
  }

  dropLetter(): void {
    if (!this.gameStarted) return;
    
    // Keep original letter generation but increase frequency of target letter
    const options = ["b", "d", "p", "q"];
    let letter: string;
    
    // Reduce frequency of target letter - 40% chance for target, 60% for others
    if (Math.random() < 0.4) {
      letter = this.targetLetter;
    } else {
      letter = Phaser.Utils.Array.GetRandom(options);
    }

    // Use responsive positioning - spawn across the width minus margins
    const x = Phaser.Math.Between(50, this.gameWidth - 50);

    const text = this.add.text(x, 0, letter, {
      fontSize: `${this.letterFontSize}px`,
      color: "#000",
      fontStyle: "bold",
    });

    text.setData("letter", letter);
    text.setData("speed", Math.min(this.gameWidth, this.gameHeight) * 0.0015); // Responsive speed
    text.setInteractive({ useHandCursor: true });

    text.on("pointerdown", () => {
      if (letter === this.targetLetter) {
        text.setColor("green");
        this.score++;
        if (this.scoreText) {
          this.scoreText.setText(`Score: ${this.score}/${this.targetCatches}`);
        }
        if (this.instructionText) {
          this.instructionText.setText(`Catch "${this.targetLetter}" (${this.score}/${this.targetCatches})`);
        }

        const monkey = document.getElementById("monkey");
        if (monkey) {
          monkey.classList.add("dance");
          setTimeout(() => monkey.classList.remove("dance"), 600);
        }
        
        // Check if level is completed (caught 5 of the target letter)
        if (this.score >= this.targetCatches) {
          this.completeLevel();
        }
      } else {
        text.setColor("red");
        this.misses++;
        this.updateLives();
      }

      this.time.delayedCall(300, () => {
        text.destroy();
      });

      // End game if lives are finished
      if (this.misses >= this.maxLives) {
        this.endGame("Don't worry! Learning takes practice and you're doing great!");
      }
    });

    if (this.letters) {
      this.letters.add(text);
    }
  }

  updateLives(): void {
    const hearts = ["", "❤️", "❤️❤️", "❤️❤️❤️"];
    if (this.livesText) {
      this.livesText.setText(hearts[Math.max(0, this.maxLives - this.misses)]);
    }
  }

  update(): void {
    // Check for emotion changes and update effects
    this.updateEmotionEffects();

    // Only update letters if game is started
    if (!this.gameStarted) return;

    // Update falling letters
    if (this.letters) {
      this.letters.children.entries.forEach((letter) => {
        const letterObj = letter as Phaser.GameObjects.Text;
        letterObj.y += letterObj.getData("speed");
        if (letterObj.y > this.gameHeight) {
          // Check if it was a target letter that fell off - lose a life
          if (letterObj.getData("letter") === this.targetLetter) {
            this.misses++;
            this.updateLives();
            
            // End game if lives are finished
            if (this.misses >= this.maxLives) {
              this.gameStarted = false; // Stop the game immediately
              this.endGame("Don't worry! Learning takes practice and you're doing great!");
              return;
            }
          }
          
          this.letters?.remove(letterObj);
          letterObj.destroy();
        }
      });
    }
  }

  endGame(message: string): void {
    this.gameStarted = false;
    
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    // Responsive dialog sizing
    const dialogWidth = Math.min(this.gameWidth * 0.85, 500);
    const dialogHeight = Math.min(this.gameHeight * 0.6, 300);
    const titleFontSize = Math.min(this.gameWidth, this.gameHeight) * 0.055; // Increased from 0.04
    const messageFontSize = Math.min(this.gameWidth, this.gameHeight) * 0.045; // Increased from 0.035
    const buttonFontSize = Math.min(this.gameWidth, this.gameHeight) * 0.035; // Increased from 0.025

    // Create retro-style background with gradient effect
    const bgRect = this.add.rectangle(centerX, centerY, dialogWidth, dialogHeight, 0x2E86C1, 0.95);
    bgRect.setStrokeStyle(6, 0xF39C12);
    
    // Add inner border for retro effect
    const innerRect = this.add.rectangle(centerX, centerY, dialogWidth - 20, dialogHeight - 20, 0x3498DB, 0.8);
    innerRect.setStrokeStyle(3, 0xE74C3C);

    // Encouraging title with retro styling
    const titleText = this.add.text(centerX, centerY - 80, "🌟 YOU'RE AMAZING! 🌟", {
      fontSize: `${titleFontSize}px`,
      color: "#FFD700",
      fontStyle: "bold",
      fontFamily: "Courier New, monospace", // Retro font
      stroke: "#000000",
      strokeThickness: 2,
      shadow: { offsetX: 3, offsetY: 3, color: "#000000", blur: 0, fill: true }
    }).setOrigin(0.5);

    // Encouraging message specifically for dyslexic children
    const encouragingMessage = this.add.text(centerX, centerY - 20, 
      "Great job trying! Every mistake helps\nyou learn and grow stronger.\nYou've got this, superstar! 💪", {
      fontSize: `${messageFontSize}px`,
      color: "#FFFFFF",
      fontStyle: "bold",
      fontFamily: "Courier New, monospace", // Retro font
      align: "center",
      lineSpacing: 8,
      stroke: "#000000",
      strokeThickness: 1,
      wordWrap: { width: dialogWidth - 60 }
    }).setOrigin(0.5);

    // Score with positive framing
    const scoreText = this.add.text(centerX, centerY + 40, `Letters caught: ${this.score} 🎯`, {
      fontSize: `${messageFontSize * 0.9}px`,
      color: "#E8F8F5",
      fontStyle: "bold",
      fontFamily: "Courier New, monospace",
      stroke: "#000000",
      strokeThickness: 1,
    }).setOrigin(0.5);

    // Retro-style replay button
    const replayBtn = this.add.text(centerX, centerY + 85, "🚀 TRY AGAIN 🚀", {
      fontSize: `${buttonFontSize}px`,
      backgroundColor: "#E74C3C",
      color: "#FFFFFF",
      fontFamily: "Courier New, monospace",
      fontStyle: "bold",
      padding: { x: 20, y: 12 },
      stroke: "#000000",
      strokeThickness: 2,
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 0, fill: true }
    }).setOrigin(0.5);

    replayBtn.setInteractive({ useHandCursor: true });

    // Add hover effect for the button
    replayBtn.on('pointerover', () => {
      replayBtn.setScale(1.1);
      replayBtn.setBackgroundColor("#C0392B");
    });

    replayBtn.on('pointerout', () => {
      replayBtn.setScale(1.0);
      replayBtn.setBackgroundColor("#E74C3C");
    });

    replayBtn.on("pointerdown", () => {
      this.scene.restart({ emotion: this.passedEmotion, level: 0 });
    });
  }

  startGame(): void {
    if (this.gameStarted) return;
    
    this.gameStarted = true;
    
    // Initialize game UI directly
    this.initializeGameUI();
  }

  initializeGameUI(): void {
    this.scoreText = this.add.text(20, 20, `Score: 0/${this.targetCatches}`, {
      fontSize: `${this.baseFontSize}px`,
      color: "#000",
      fontStyle: "bold",
    });

    this.livesText = this.add.text(this.gameWidth - 120, 20, "❤️❤️❤️", {
      fontSize: `${this.baseFontSize}px`,
      color: "#ff4d4d",
    });

    this.levelText = this.add.text(20, 50, `Level: ${this.currentLevel + 1}/5`, {
      fontSize: `${this.baseFontSize}px`,
      color: "#000",
      fontStyle: "bold",
    });

    this.instructionText = this.add.text(this.gameWidth / 2, 20, `Catch "${this.targetLetter}" (${this.score}/${this.targetCatches})`, {
      fontSize: `${this.baseFontSize}px`,
      color: "#000",
      fontStyle: "bold",
    }).setOrigin(0.5, 0);

    // Add emotion indicator
    this.emotionIndicator = this.add.text(this.gameWidth / 2, 50, `Emotion: ${this.currentEmotion}`, {
      fontSize: `${this.baseFontSize * 0.8}px`,
      color: this.emotionColors[this.currentEmotion] || "#000",
      fontStyle: "bold",
    }).setOrigin(0.5, 0);

    this.letters = this.add.group();

    // Position "Next Letter" button at bottom center with responsive sizing
    this.nextButton = this.add.text(this.gameWidth / 2, this.gameHeight - 60, "👉 Next Letter", {
      fontSize: `${this.buttonFontSize}px`,
      backgroundColor: "#add8e6",
      color: "#000",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.nextButton.on("pointerdown", () => {
      this.dropLetter();
    });
  }

  completeLevel(): void {
    // Stop the game temporarily
    this.gameStarted = false;
    
    // Clear any remaining letters
    if (this.letters) {
      this.letters.children.entries.forEach((letter) => {
        letter.destroy();
      });
      this.letters.clear();
    }
    
    // Show level completion popup
    this.showLevelCompletePopup();
  }

  showLevelCompletePopup(): void {
    const centerX = this.gameWidth / 2;
    const centerY = this.gameHeight / 2;
    
    // Create popup group
    this.popupGroup = this.add.group();
    
    // Retro-style popup background with double border
    const popupBg = this.add.rectangle(centerX, centerY, this.gameWidth * 0.8, this.gameHeight * 0.5, 0x2E86C1, 0.95);
    popupBg.setStrokeStyle(6, 0xF39C12);
    this.popupGroup.add(popupBg);
    
    // Inner border for retro effect
    const innerBg = this.add.rectangle(centerX, centerY, this.gameWidth * 0.75, this.gameHeight * 0.45, 0x3498DB, 0.8);
    innerBg.setStrokeStyle(3, 0xE74C3C);
    this.popupGroup.add(innerBg);
    
    // Popup message with dyslexia-friendly encouragement
    let message = "🎉 FANTASTIC WORK! 🎉\nYou're becoming a letter champion!\nReady for the next adventure?";
    if (this.currentLevel >= 4) {
      message = "🏆 INCREDIBLE! YOU DID IT! 🏆\nYou completed all levels!\nYou're a reading superhero!";
    }
    
    const messageText = this.add.text(centerX, centerY - 30, message, {
      fontSize: `${this.baseFontSize * 1.3}px`, // Increased from 1.1
      color: "#FFD700",
      fontStyle: "bold",
      fontFamily: "Courier New, monospace", // Retro font
      align: "center",
      lineSpacing: 6,
      stroke: "#000000",
      strokeThickness: 2,
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 0, fill: true },
      wordWrap: { width: this.gameWidth * 0.7 }
    }).setOrigin(0.5);
    this.popupGroup.add(messageText);
    
    // Add "Press ENTER" instruction with retro styling
    const enterText = this.add.text(centerX, centerY + 50, "Press ENTER to continue ⚡", {
      fontSize: `${this.baseFontSize * 1.1}px`, // Increased from 0.9
      color: "#FFFFFF",
      fontStyle: "bold",
      fontFamily: "Courier New, monospace",
      align: "center",
      stroke: "#000000",
      strokeThickness: 1,
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 0, fill: true }
    }).setOrigin(0.5);
    this.popupGroup.add(enterText);
    
    // Create confetti effect
    this.createConfettiEffect();
    
    // Remove any existing Enter key listeners first
    this.input.keyboard?.removeAllListeners('keydown-ENTER');
    
    // Listen for Enter key to proceed - use once to prevent multiple triggers
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.nextLevel();
    });
  }

  nextLevel(): void {
    // Remove popup immediately and completely
    if (this.popupGroup) {
      this.popupGroup.clear(true, true);
      this.popupGroup.destroy();
      this.popupGroup = null;
    }
    
    // Remove any remaining Enter key listeners
    this.input.keyboard?.removeAllListeners('keydown-ENTER');
    
    if (this.currentLevel >= 4) {
      // Restart game from level 1
      this.scene.restart({ emotion: this.passedEmotion, level: 0 });
    } else {
      // Go to next level
      this.currentLevel++;
      this.targetLetter = this.levels[this.currentLevel];
      this.score = 0;
      this.misses = 0;
      
      // Update UI immediately
      if (this.levelText) {
        this.levelText.setText(`Level: ${this.currentLevel + 1}/5`);
      }
      if (this.scoreText) {
        this.scoreText.setText(`Score: ${this.score}/${this.targetCatches}`);
      }
      if (this.instructionText) {
        this.instructionText.setText(`Catch "${this.targetLetter}" (${this.score}/${this.targetCatches})`);
      }
      this.updateLives();
      
      // Restart game immediately
      this.gameStarted = true;
    }
  }

  createConfettiEffect(): void {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080];
    const confettiPieces: Phaser.GameObjects.Rectangle[] = [];
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, this.gameWidth);
      const y = Phaser.Math.Between(-100, -50);
      const color = Phaser.Utils.Array.GetRandom(colors);
      
      const confetti = this.add.rectangle(x, y, 8, 8, color);
      confetti.setData('velocityX', Phaser.Math.Between(-2, 2));
      confetti.setData('velocityY', Phaser.Math.Between(2, 5));
      confetti.setData('rotationSpeed', Phaser.Math.Between(-0.1, 0.1));
      
      confettiPieces.push(confetti);
    }
    
    // Animate confetti falling
    const confettiTimer = this.time.addEvent({
      delay: 16, // ~60fps
      callback: () => {
        confettiPieces.forEach((piece, index) => {
          if (piece.active) {
            piece.x += piece.getData('velocityX');
            piece.y += piece.getData('velocityY');
            piece.rotation += piece.getData('rotationSpeed');
            
            // Remove confetti that has fallen off screen
            if (piece.y > this.gameHeight + 50) {
              piece.destroy();
              confettiPieces.splice(index, 1);
            }
          }
        });
        
        // Stop timer when all confetti is gone
        if (confettiPieces.length === 0) {
          confettiTimer.destroy();
        }
      },
      repeat: -1
    });
  }
}

export const startBouncyLettersGame = (containerId: string, emotion: string = "neutral", onScoreCallback?: () => void): void => {
  class EmotionScene extends BouncyLettersScene {
    private onScore?: () => void;

    constructor() {
      super();
      this.onScore = onScoreCallback;
    }
  }

  if (gameInstance) {
    gameInstance.destroy(true);
  }

  // Get container dimensions for full screen sizing
  const container = document.getElementById(containerId);
  const containerWidth = container ? container.offsetWidth : 600;
  const containerHeight = container ? container.offsetHeight : 400;

  gameInstance = new Phaser.Game({
    type: Phaser.AUTO,
    width: containerWidth,
    height: containerHeight,
    parent: containerId,
    backgroundColor: '#87CEEB',
    scene: EmotionScene,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: containerWidth,
      height: containerHeight
    }
  });

  gameInstance.scene.start("BouncyLetters", { emotion, level: 0 });
};
