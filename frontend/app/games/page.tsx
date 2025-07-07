"use client"
import React from 'react';
import { useAuth } from '@/components/auth-provider';
import ProtectedRoute from '@/components/protected-route';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Gamepad2, Sparkles, Trophy, Star, ArrowLeft, Target, Heart, Users, Play, Zap, Brain } from 'lucide-react';
import Link from 'next/link';

const games = [
  {
    id: 'snake-game',
    title: 'Snake Word Adventure',
    description: 'Guide the magical snake through enchanted gardens while collecting letters to form powerful words. Master spelling in this thrilling adventure!',
    difficulty: 'Easy',
    category: 'Spelling & Strategy',
    emoji: '🐍',
    gradientFrom: 'from-emerald-400/80',
    gradientTo: 'to-green-600/80',
    glowColor: 'shadow-emerald-500/40',
    route: '/snake-game',
    features: ['Word Formation', 'Strategy', 'Reflex Training'],
    icon: Target,
    bgPattern: 'repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0px, rgba(16, 185, 129, 0.1) 1px, transparent 1px, transparent 12px)'
  },
  {
    id: 'bouncy-letters',
    title: 'Bouncy Letters Challenge',
    description: 'Test your letter recognition skills! Click the falling target letters while avoiding the wrong ones. Perfect for learning letter shapes and improving focus!',
    difficulty: 'Easy',
    category: 'Letter Recognition',
    emoji: '🎯',
    gradientFrom: 'from-orange-400/80',
    gradientTo: 'to-red-600/80',
    glowColor: 'shadow-orange-500/40',
    route: '/bouncy-letters',
    features: ['Letter Recognition', 'Hand-Eye Coordination', 'Focus Training'],
    icon: Heart,
    bgPattern: 'repeating-linear-gradient(-45deg, rgba(251, 146, 60, 0.1) 0px, rgba(251, 146, 60, 0.1) 1px, transparent 1px, transparent 12px)'
  },
];

export default function GamesPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden">
        {/* Dark Glass Morphic Background */}
        <div className="absolute inset-0">
          {/* Base dark gradient - matching other pages */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
          
          {/* Floating glass orbs with glassmorphism */}
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-30"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                 backdropFilter: 'blur(20px)',
                 border: '1px solid rgba(255, 255, 255, 0.1)'
               }}>
          </div>
          <div className="absolute bottom-32 right-32 w-80 h-80 rounded-full blur-3xl opacity-25"
               style={{
                 background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.1))',
                 backdropFilter: 'blur(20px)',
                 border: '1px solid rgba(168, 85, 247, 0.2)'
               }}>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20"
               style={{
                 background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
                 backdropFilter: 'blur(20px)',
                 border: '1px solid rgba(16, 185, 129, 0.2)'
               }}>
          </div>
        </div>

        {/* Glass Morphic Header */}
        <header className="relative z-20"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(20px)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
          <div className="container mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-4">
                <div className="relative">
                  <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                    JoyVerse
                  </div>
                  <div className="absolute -inset-1 rounded-lg blur-sm -z-10"
                       style={{
                         background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                         backdropFilter: 'blur(10px)'
                       }}>
                  </div>
                </div>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(255, 255, 255, 0.2)'
                     }}>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <Users className="w-5 h-5 text-cyan-300" />
                  <span className="font-bold text-white drop-shadow-lg">Welcome, {user?.name}!</span>
                </div>
                <Button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-8">
              {/* Mission Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-xl"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                     backdropFilter: 'blur(20px)',
                     border: '1px solid rgba(255, 255, 255, 0.2)'
                   }}>
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <span className="text-lg font-semibold text-white">Choose Your Adventure</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
                Game Universe
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                Immerse yourself in our premium gaming experience. Each adventure is crafted to challenge your mind while adapting to your emotions and learning style.
              </p>
            </div>

            {/* Games Grid - Dark Glass Morphic Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {games.map((game, index) => (
                <div 
                  key={game.id} 
                  className="group relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-700 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onClick={() => router.push(game.route)}
                >
                  {/* Dynamic background pattern */}
                  <div className="absolute inset-0 opacity-20"
                       style={{ backgroundImage: game.bgPattern }}>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradientFrom} ${game.gradientTo} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${game.glowColor} blur-xl`}></div>
                  
                  <div className="relative z-10 p-8 lg:p-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="text-6xl drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                          {game.emoji}
                        </div>
                        <div className="p-3 rounded-2xl shadow-lg"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                               backdropFilter: 'blur(10px)',
                               border: '1px solid rgba(255, 255, 255, 0.2)'
                             }}>
                          <game.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <span className="text-xs px-4 py-2 rounded-full text-white font-semibold"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                              }}>
                          {game.category}
                        </span>
                        <span className={`text-xs px-4 py-2 rounded-full font-semibold ${
                          game.difficulty === 'Easy' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                            : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        }`}>
                          {game.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-6">
                      <h3 className="text-3xl lg:text-4xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 drop-shadow-lg">
                        {game.title}
                      </h3>
                      
                      <p className="text-gray-300 text-lg leading-relaxed font-medium">
                        {game.description}
                      </p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {game.features.map((feature, i) => (
                          <span key={i} className="px-3 py-1 text-sm rounded-full text-gray-300"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-sm" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400 font-medium">Perfect match for you!</span>
                      </div>
                      
                      {/* Play Button */}
                      <Button 
                        className={`group/btn w-full py-4 text-lg font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 ${game.glowColor}`}
                        style={{
                          background: `linear-gradient(135deg, ${game.gradientFrom.replace('from-', '').replace('/80', '')}, ${game.gradientTo.replace('to-', '').replace('/80', '')})`,
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(game.route);
                        }}
                      >
                        <Play className="w-6 h-6 mr-3 group-hover/btn:scale-110 transition-transform" />
                        Start Adventure
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section - Glass Morphic */}
            <div className="rounded-3xl shadow-2xl p-8 lg:p-12"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                   backdropFilter: 'blur(20px)',
                   border: '1px solid rgba(255, 255, 255, 0.1)'
                 }}>
              <div className="text-center mb-8 space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
                       style={{
                         background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(139, 92, 246, 0.6))',
                         backdropFilter: 'blur(10px)',
                         border: '1px solid rgba(168, 85, 247, 0.3)'
                       }}>
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                    Your Journey
                  </h2>
                </div>
                <p className="text-gray-300 text-xl">Track your progress and celebrate every achievement!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                       backdropFilter: 'blur(15px)',
                       border: '1px solid rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg mb-3">0</div>
                  <div className="text-white font-semibold text-xl mb-1">Games Mastered</div>
                  <div className="text-gray-400 text-sm">Ready to begin your quest!</div>
                </div>
                <div className="text-center rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                       backdropFilter: 'blur(15px)',
                       border: '1px solid rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg mb-3">0</div>
                  <div className="text-white font-semibold text-xl mb-1">Words Discovered</div>
                  <div className="text-gray-400 text-sm">Expand your vocabulary!</div>
                </div>
                <div className="text-center rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                       backdropFilter: 'blur(15px)',
                       border: '1px solid rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg mb-3">0</div>
                  <div className="text-white font-semibold text-xl mb-1">Epic Achievements</div>
                  <div className="text-gray-400 text-sm">Unlock legendary rewards!</div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 text-center">
                <div className="rounded-2xl p-8 shadow-xl"
                     style={{
                       background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.1))',
                       backdropFilter: 'blur(15px)',
                       border: '1px solid rgba(168, 85, 247, 0.3)'
                     }}>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Brain className="w-8 h-8 text-purple-300 animate-pulse" />
                    <span className="text-white font-bold text-2xl">Ready for the Challenge?</span>
                    <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
                  </div>
                  <p className="text-gray-300 text-lg mb-8">Choose your first adventure and begin an extraordinary learning journey tailored just for you!</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => router.push('/snake-game')}
                      className="group px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.6))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: 'white'
                      }}
                    >
                      <Target className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                      Snake Adventure
                    </Button>
                    <Button 
                      onClick={() => router.push('/bouncy-letters')}
                      className="group px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.8), rgba(239, 68, 68, 0.6))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(251, 146, 60, 0.3)',
                        color: 'white'
                      }}
                    >
                      <Heart className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                      Bouncy Letters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
