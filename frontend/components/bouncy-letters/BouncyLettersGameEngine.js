import * as Phaser from "phaser";

let gameInstance = null;

// Global emotion state that can be updated from React component
let globalEmotionState = {
  currentEmotion: 'neutral',
  onEmotionChange: null
};

// Function to update emotion from React component
export const updateGameEmotion = (emotion, callback) => {
  globalEmotionState.currentEmotion = emotion;
  globalEmotionState.onEmotionChange = callback;
  console.log(`Game emotion updated to: ${emotion}`);
};

class BouncyLettersScene extends Phaser.Scene {
  constructor() {
    super("BouncyLetters");
    this.levels = ['b', 'd', 'p', 'q'];
    this.level = 0;
    this.emotionColors = {
      'happy': '#FFD700',
      'sad': '#4682B4', 
      'neutral': '#808080',
      'surprise': '#FF6347',
      'angry': '#DC143C',
      'fear': '#4B0082',
      'disgust': '#9ACD32'
    };
  }

  init(data) {
    this.level = data.level || 0;
    this.targetLetter = this.levels[this.level % this.levels.length];
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
  }

  preload() {
    // No need to preload background if it's handled by outer React
  }

  create() {
    // Get game dimensions for responsive positioning
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    
    // Calculate responsive font sizes
    const baseFontSize = Math.min(gameWidth, gameHeight) * 0.025;
    const buttonFontSize = Math.min(gameWidth, gameHeight) * 0.03;
    const letterFontSize = Math.min(gameWidth, gameHeight) * 0.04;
    
    // Add emotion-based background tint
    this.updateEmotionEffects();
    
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: `${baseFontSize}px`,
      color: "#000",
      fontStyle: "bold",
    });

    this.livesText = this.add.text(gameWidth - 120, 20, "❤️❤️❤️", {
      fontSize: `${baseFontSize}px`,
      color: "#ff4d4d",
    });

    this.instructionText = this.add.text(gameWidth / 2, 20, `Catch all "${this.targetLetter}"s`, {
      fontSize: `${baseFontSize}px`,
      color: "#000",
      fontStyle: "bold",
    }).setOrigin(0.5, 0);

    // Add emotion indicator
    this.emotionIndicator = this.add.text(gameWidth / 2, 50, `Emotion: ${this.currentEmotion}`, {
      fontSize: `${baseFontSize * 0.8}px`,
      color: this.emotionColors[this.currentEmotion] || "#000",
      fontStyle: "bold",
    }).setOrigin(0.5, 0);

    this.letters = this.add.group();

    // Position "Next Letter" button at bottom center with responsive sizing
    this.nextButton = this.add.text(gameWidth / 2, gameHeight - 60, "👉 Next Letter", {
      fontSize: `${buttonFontSize}px`,
      backgroundColor: "#add8e6",
      color: "#000",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.nextButton.on("pointerdown", () => {
      this.dropLetter();
    });
    
    // Store dimensions for other methods
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.letterFontSize = letterFontSize;
  }

  updateEmotionEffects() {
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

  dropLetter() {
    const options = ["b", "d", "p", "q"];
    const letter = Phaser.Utils.Array.GetRandom(options);

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
        this.scoreText.setText(`Score: ${this.score}`);

        const monkey = document.getElementById("monkey");
        if (monkey) {
          monkey.classList.add("dance");
          setTimeout(() => monkey.classList.remove("dance"), 600);
        }
      } else {
        text.setColor("red");
        this.misses++;
        this.updateLives();
      }

      this.time.delayedCall(300, () => {
        text.destroy();
      });

      if (this.misses >= this.maxLives) {
        this.endGame("Game Over");
      }
    });

    this.letters.add(text);
  }

  updateLives() {
    const hearts = ["", "❤️", "❤️❤️", "❤️❤️❤️"];
    this.livesText.setText(hearts[Math.max(0, this.maxLives - this.misses)]);
  }

  update() {
    // Check for emotion changes and update effects
    this.updateEmotionEffects();

    // Update falling letters
    this.letters.children.entries.forEach((letter) => {
      letter.y += letter.getData("speed");
      if (letter.y > this.gameHeight) {
        this.letters.remove(letter);
        letter.destroy();
      }
    });
  }

  endGame(message) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    // Responsive dialog sizing
    const dialogWidth = Math.min(this.gameWidth * 0.8, 400);
    const dialogHeight = Math.min(this.gameHeight * 0.4, 220);
    const titleFontSize = Math.min(this.gameWidth, this.gameHeight) * 0.035;
    const scoreFontSize = Math.min(this.gameWidth, this.gameHeight) * 0.025;
    const buttonFontSize = Math.min(this.gameWidth, this.gameHeight) * 0.02;

    this.add.rectangle(centerX, centerY, dialogWidth, dialogHeight, 0xffffff, 0.95).setStrokeStyle(2, 0x000000);

    this.add.text(centerX, centerY - 60, message, {
      fontSize: `${titleFontSize}px`,
      color: "#ff0000",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 20, `Final Score: ${this.score}`, {
      fontSize: `${scoreFontSize}px`,
      color: "#000",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const replayBtn = this.add.text(centerX, centerY + 30, "🔁 Play Again", {
      fontSize: `${buttonFontSize}px`,
      backgroundColor: "#90ee90",
      color: "#000",
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5);

    replayBtn.setInteractive({ useHandCursor: true });

    replayBtn.on("pointerdown", () => {
      this.scene.restart({ emotion: this.passedEmotion, level: this.level + 1 });
    });
  }
}

export const startBouncyLettersGame = (containerId, emotion = "neutral", onScoreCallback) => {
  class EmotionScene extends BouncyLettersScene {
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
  const containerWidth = container ? container.offsetWidth : window.innerWidth;
  const containerHeight = container ? container.offsetHeight : window.innerHeight;

  gameInstance = new Phaser.Game({
    type: Phaser.AUTO,
    width: containerWidth,
    height: containerHeight,
    parent: containerId,
    transparent: true,
    scene: EmotionScene,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: containerWidth,
      height: containerHeight
    }
  });

  gameInstance.scene.start("BouncyLetters", { emotion });
};
