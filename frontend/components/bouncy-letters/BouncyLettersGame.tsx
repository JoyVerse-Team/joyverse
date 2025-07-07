"use client"
import { useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Trophy, Star } from 'lucide-react';

export default function BouncyLettersGame() {
  const monkeyRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Import the game engine dynamically
    const loadGame = async () => {
      const { startBouncyLettersGame } = await import('./BouncyLettersGameEngine');
      startBouncyLettersGame("phaser-container", "neutral", () => {
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
  }, []);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      id="bouncy-container"
      style={{
        backgroundImage: "url('/assets/backgrounds/bg_happy.png')",
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
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current drop-shadow-lg" />
              ))}
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
            <Button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>
      {/* Animal Characters */}
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
      <div className="absolute top-20 right-8 p-4 rounded-xl shadow-lg z-20 max-w-xs bg-white/90 backdrop-blur-md">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          How to Play
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Click the "Next Letter" button to drop letters</li>
          <li>• Click only the target letters shown at the top</li>
          <li>• Avoid clicking wrong letters</li>
          <li>• You have 3 lives (hearts)</li>
          <li>• Get the highest score possible!</li>
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
      `}</style>
    </div>
  );
}
