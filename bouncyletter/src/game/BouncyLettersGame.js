import Phaser from "phaser";

let gameInstance = null;

class BouncyLettersScene extends Phaser.Scene {
  constructor() {
    super("BouncyLetters");
    this.levels = ['b', 'd', 'p', 'q'];
    this.level = 0;
  }

  init(data) {
    this.level = data.level || 0;
    this.targetLetter = this.levels[this.level % this.levels.length];
    this.passedEmotion = data.emotion || "neutral";
    this.score = 0;
    this.misses = 0;
    this.maxLives = 3;
    this.scoreText = null;
    this.livesText = null;
    this.instructionText = null;
    this.letters = null;
  }

  preload() {
    // No need to preload background if it's handled by outer React
  }

  create() {
    this.scoreText = this.add.text(10, 10, "Score: 0", {
      fontSize: "20px",
      color: "#000",
    });

    this.livesText = this.add.text(480, 10, "❤️❤️❤️", {
      fontSize: "20px",
      color: "#ff4d4d",
    });

    this.instructionText = this.add.text(150, 10, `Catch all "${this.targetLetter}"s`, {
      fontSize: "18px",
      color: "#000",
    });

    this.letters = this.add.group();

    // 🟢 Add "Next Letter" button so child controls pace
    this.nextButton = this.add.text(220, 360, "👉 Next Letter", {
      fontSize: "22px",
      backgroundColor: "#add8e6",
      color: "#000",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.nextButton.on("pointerdown", () => {
      this.dropLetter();
    });
  }

  dropLetter() {
    const options = ["b", "d", "p", "q"];
    const letter = Phaser.Utils.Array.GetRandom(options);

    // Allow spawning at any X position (no restriction)
    const x = Phaser.Math.Between(50, 550);

    const text = this.add.text(x, 0, letter, {
      fontSize: "32px",
      color: "#000",
    });

    text.setData("letter", letter);
    text.setData("speed", 0.5); // Slower speed for accessibility
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
    // Prevent letters from falling onto the Next Letter button (button y=360, height ~40)
    // Make letters disappear about 2cm (~75px) above the button
    const fallLimitY = 285; // 2cm above button

    this.letters.getChildren().forEach((letter) => {
      letter.y += letter.getData("speed");

      if (letter.y > fallLimitY) {
        // Only count as a miss if the letter is the target letter
        if (letter.getData("letter") === this.targetLetter) {
          this.misses++;
          this.updateLives();

          if (this.misses >= this.maxLives) {
            this.endGame("Game Over");
          }
        }
        letter.destroy();
      }
    });
  }

  endGame(message) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.rectangle(centerX, centerY, 400, 220, 0xffffff, 0.95).setStrokeStyle(2, 0x000000);

    this.add.text(centerX, centerY - 60, message, {
      fontSize: "32px",
      color: "#ff0000",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 20, `Final Score: ${this.score}`, {
      fontSize: "24px",
      color: "#000",
    }).setOrigin(0.5);

    const replayBtn = this.add.text(centerX, centerY + 30, "🔁 Play Again", {
      fontSize: "22px",
      backgroundColor: "#90ee90",
      color: "#000",
      padding: { x: 10, y: 5 },
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

  gameInstance = new Phaser.Game({
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    parent: containerId,
    transparent: true,
    scene: EmotionScene,
  });

  gameInstance.scene.start("BouncyLetters", { emotion });
};
