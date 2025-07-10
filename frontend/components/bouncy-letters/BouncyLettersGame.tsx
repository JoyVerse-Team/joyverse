"use client"
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Trophy, Star } from 'lucide-react';
import { gameApiService } from '@/lib/game-api';

// Emotion to background mapping
const emotionBackgrounds: Record<string, string> = {
  'happy': '/bouncy_public/assets/backgrounds/bg_sad.png',
  'neutral': '/bouncy_public/assets/backgrounds/bg_neutal.png', // Note: keeping original typo
  'sad': '/bouncy_public/assets/backgrounds/bg_happy.png',
  'surprise': '/bouncy_public/assets/backgrounds/bg_surprise.png',
  'angry': '/bouncy_public/assets/backgrounds/bg_neutal.png', // fallback to neutral
  'fear': '/bouncy_public/assets/backgrounds/bg_sad.png', // fallback to sad
  'disgust': '/bouncy_public/assets/backgrounds/bg_neutal.png' // fallback to neutral
};

export default function BouncyLettersGame() {
  const monkeyRef = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [currentBackground, setCurrentBackground] = useState(emotionBackgrounds['neutral']);
  const [isEmotionDetecting, setIsEmotionDetecting] = useState(false);
  const [lastEmotionUpdate, setLastEmotionUpdate] = useState<string>("");
  const [isProcessingEmotion, setIsProcessingEmotion] = useState<boolean>(false);
  const emotionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to change background based on emotion
  const changeBackgroundForEmotion = (emotion: string) => {
    const newBackground = emotionBackgrounds[emotion] || emotionBackgrounds['neutral'];
    if (newBackground !== currentBackground) {
      setCurrentBackground(newBackground);
      setCurrentEmotion(emotion);
      console.log(`Background changed to: ${emotion} - ${newBackground}`);
      
      // Also update the game engine
      import('./BouncyLettersGameEngine').then(({ updateGameEmotion }) => {
        updateGameEmotion(emotion);
      });
    }
  };

  // Function to start emotion detection
  const startEmotionDetection = () => {
    console.log('Starting emotion detection for bouncy letters...');
    setIsEmotionDetecting(true);
    
    // Clear any existing intervals
    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current);
    }

    // Start emotion detection every 5 seconds
    emotionIntervalRef.current = setInterval(() => {
      captureEmotionForBackground();
    }, 5000);

    // Initial emotion capture after 2 seconds
    setTimeout(() => {
      captureEmotionForBackground();
    }, 2000);
  };

  // Function to stop emotion detection
  const stopEmotionDetection = () => {
    console.log('Stopping emotion detection...');
    setIsEmotionDetecting(false);
    
    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current);
      emotionIntervalRef.current = null;
    }
  };

  // Function to capture emotion and update background
  const captureEmotionForBackground = async () => {
    if (isProcessingEmotion) {
      console.log('Emotion processing already in progress, skipping...');
      return;
    }

    setIsProcessingEmotion(true);
    try {
      console.log('Capturing emotion for background update...');
      const emotion = await gameApiService.captureAndDetectEmotion();
      console.log(`Emotion detected: ${emotion.emotion} (confidence: ${emotion.confidence})`);
      
      setLastEmotionUpdate(`${emotion.emotion} (${(emotion.confidence * 100).toFixed(1)}%) at ${new Date().toLocaleTimeString()}`);
      
      // Update background if emotion changed and confidence is high enough
      if (emotion.confidence > 0.6 && emotion.emotion !== currentEmotion) {
        changeBackgroundForEmotion(emotion.emotion);
      }
      
    } catch (error) {
      console.error('Failed to capture emotion:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLastEmotionUpdate(`Error: ${errorMessage} at ${new Date().toLocaleTimeString()}`);
    } finally {
      setIsProcessingEmotion(false);
    }
  };

  useEffect(() => {
    // Import the game engine dynamically
    const loadGame = async () => {
      const { startBouncyLettersGame, updateGameEmotion } = await import('./BouncyLettersGameEngine');
      
      // Initialize emotion state in game engine
      updateGameEmotion(currentEmotion);
      
      startBouncyLettersGame("phaser-container", currentEmotion, () => {
        if (monkeyRef.current) {
          monkeyRef.current.classList.add("monkey-dance");
          setTimeout(() => {
            if (monkeyRef.current) {
              monkeyRef.current.classList.remove("monkey-dance");
            }
          }, 600);
        }
      });
    };
    
    loadGame();
    
    // Start emotion detection when game loads
    startEmotionDetection();
    
    // Cleanup on unmount
    return () => {
      stopEmotionDetection();
    };
  }, []);

  // Effect to update game emotion when currentEmotion changes
  useEffect(() => {
    // Update game engine emotion when emotion changes
    import('./BouncyLettersGameEngine').then(({ updateGameEmotion }) => {
      updateGameEmotion(currentEmotion);
    });
  }, [currentEmotion]);

  // Cleanup effect for emotion detection
  useEffect(() => {
    return () => {
      stopEmotionDetection();
    };
  }, []);

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 ease-in-out emotion-${currentEmotion}`}
      id="bouncy-container"
      style={{
        backgroundImage: `url('${currentBackground}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black text-white drop-shadow-2xl">
              Bouncy Letters
            </div>
            <div className="flex items-center gap-1">
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/games')}
              className="px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Games
            </Button>
          </div>
        </div>
      </header>

      <img
        src="/assets/animals/owl.png"
        alt="owl"
        className="absolute top-20 left-8 w-40 h-40 z-20 animate-bounce"
        style={{ animationDuration: '3s' }}
      />

      <img
        ref={monkeyRef}
        src="/assets/animals/monkey.png"
        alt="monkey"
        className="absolute bottom-8 left-8 w-40 h-40 z-20 transition-transform duration-300"
        style={{
          animation: 'monkey-dance 0.6s ease-in-out',
        }}
      />

      <img
        src="/assets/animals/turtle.png"
        alt="turtle"
        className="absolute bottom-8 right-8 w-40 h-40 z-20"
      />

      {/* Phaser Game Container */}
      <div
        id="phaser-container"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden shadow-xl z-10"
        style={{
          width: "600px",
          height: "400px",
          backgroundColor: "#FFF3B0",
          border: "4px solid #3cb371",
          boxShadow: "0 0 25px rgba(0, 128, 0, 0.6)"
        }}
      />

      {/* Instructions Panel */}
      <div className="absolute top-20 right-4 p-4 rounded-xl shadow-lg z-20 max-w-xs bg-white/90 backdrop-blur-md">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          How to Play
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Click the "Next Letter" button to drop letters</li>
          <li>• Click only the target letters shown at the top</li>
          <li>• Avoid clicking wrong letters</li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes monkey-dance {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          75% { transform: scale(1.1) rotate(-5deg); }
        }
        
        .monkey-dance {
          animation: monkey-dance 0.6s ease-in-out;
        }

        /* Enhanced background transition */
        #bouncy-container {
          transition: background-image 1s ease-in-out;
        }

        /* Emotion panel animations */
        .emotion-panel {
          backdrop-filter: blur(10px);
          animation: slideInLeft 0.5s ease-out;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Button hover effects */
        .emotion-button {
          transition: all 0.2s ease-in-out;
        }

        .emotion-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* Phaser container enhancement */
        #phaser-container {
          transition: box-shadow 0.3s ease-in-out;
        }

        /* Emotion-based glow effects */
        .emotion-happy #phaser-container {
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        }

        .emotion-sad #phaser-container {
          box-shadow: 0 0 30px rgba(70, 130, 180, 0.6);
        }

        .emotion-surprise #phaser-container {
          box-shadow: 0 0 30px rgba(255, 99, 71, 0.6);
        }

        .emotion-neutral #phaser-container {
          box-shadow: 0 0 25px rgba(60, 179, 113, 0.6);
        }
      `}</style>
    </div>
  );
}
