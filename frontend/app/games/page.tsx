"use client"
import React from 'react';
import { useAuth } from '@/components/auth-provider';
import ProtectedRoute from '@/components/protected-route';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Sparkles, Trophy, Star, ArrowLeft, Target, Heart, Users } from 'lucide-react';
import Link from 'next/link';

const games = [
  {
    id: 'snake-game',
    title: 'Snake Word Adventure',
    description: 'Guide the snake to collect letters and spell words while avoiding obstacles!',
    difficulty: 'Easy',
    category: 'Spelling',
    emoji: '🐍',
    color: 'from-green-500/70 to-emerald-500/70',
    route: '/snake-game'
  },
  {
    id: 'spelling-game',
    title: 'Magic Spelling Quest',
    description: 'Cast spells by spelling words correctly in this magical adventure!',
    difficulty: 'Medium',
    category: 'Spelling',
    emoji: '✨',
    color: 'from-purple-500/70 to-pink-500/70',
    route: '/spelling-game'
  },
  {
    id: 'memory-game',
    title: 'Memory Palace',
    description: 'Train your memory with fun patterns and sequences!',
    difficulty: 'Easy',
    category: 'Memory',
    emoji: '🧠',
    color: 'from-blue-500/70 to-cyan-500/70',
    route: '/memory-game'
  },
  {
    id: 'reading-game',
    title: 'Story Adventure',
    description: 'Go on reading adventures and make choices that shape the story!',
    difficulty: 'Medium',
    category: 'Reading',
    emoji: '📚',
    color: 'from-orange-500/70 to-red-500/70',
    route: '/reading-game'
  }
];

export default function GamesPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Animated Background - Matching Homepage */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[
              { left: '10%', top: '20%', delay: '0s', duration: '3s' },
              { left: '80%', top: '30%', delay: '1s', duration: '4s' },
              { left: '30%', top: '60%', delay: '2s', duration: '5s' },
              { left: '70%', top: '80%', delay: '0.5s', duration: '3.5s' },
              { left: '50%', top: '15%', delay: '1.5s', duration: '4.5s' },
              { left: '20%', top: '70%', delay: '0.8s', duration: '3.8s' },
              { left: '90%', top: '50%', delay: '2.2s', duration: '4.2s' },
              { left: '15%', top: '45%', delay: '1.2s', duration: '3.2s' },
              { left: '60%', top: '25%', delay: '0.3s', duration: '5.5s' },
              { left: '40%', top: '85%', delay: '1.8s', duration: '3.6s' }
            ].map((particle, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration
                }}
              />
            ))}
          </div>
        </div>

        {/* Header - Matching Homepage Style */}
        <header className="relative z-20 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-2xl">
          <div className="container mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-4">
                <div className="relative">
                  <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                    JoyVerse
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-lg blur-sm -z-10"></div>
                </div>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-white/20 to-white/10 rounded-2xl border border-white/30 shadow-xl">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <Users className="w-5 h-5 text-cyan-300" />
                  <span className="font-bold text-white drop-shadow-lg">Welcome, {user?.name}!</span>
                </div>
                <Button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 shadow-xl">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Choose Your Adventure</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                Game Collection
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                Pick a game that excites you and start your learning journey. Each game adapts to your emotions and learning style!
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {games.map((game) => (
                <Card 
                  key={game.id} 
                  className="group backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-500 cursor-pointer relative overflow-hidden"
                  onClick={() => router.push(game.route)}
                >
                  {/* Enhanced gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-5xl drop-shadow-lg">{game.emoji}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs backdrop-blur-xl bg-white/20 px-3 py-1.5 rounded-full text-white font-semibold border border-white/30">
                          {game.category}
                        </span>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                          game.difficulty === 'Easy' 
                            ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                            : 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                        }`}>
                          {game.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl lg:text-3xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 drop-shadow-lg mb-4">
                      {game.title}
                    </CardTitle>
                    
                    <CardDescription className="text-white/80 text-lg leading-relaxed font-medium">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 p-8 pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-sm" />
                        ))}
                        <span className="text-sm text-white/70 ml-3 font-medium">Perfect for you!</span>
                      </div>
                      
                      <Button 
                        className="group/btn px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(game.route);
                        }}
                      >
                        <Gamepad2 className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                        Play Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Section */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 lg:p-12">
              <div className="text-center mb-8 space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/80 to-purple-500/80 flex items-center justify-center shadow-xl">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                    Your Progress
                  </h2>
                </div>
                <p className="text-white/80 text-lg">Keep playing to unlock new achievements and build your skills!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg mb-3">0</div>
                  <div className="text-white/90 font-semibold text-lg">Games Played</div>
                  <div className="text-white/60 text-sm mt-1">Start your first adventure!</div>
                </div>
                <div className="text-center backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg mb-3">0</div>
                  <div className="text-white/90 font-semibold text-lg">Words Learned</div>
                  <div className="text-white/60 text-sm mt-1">Build your vocabulary!</div>
                </div>
                <div className="text-center backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg mb-3">0</div>
                  <div className="text-white/90 font-semibold text-lg">Achievements</div>
                  <div className="text-white/60 text-sm mt-1">Unlock amazing rewards!</div>
                </div>
              </div>

              {/* Motivation Section */}
              <div className="mt-8 text-center">
                <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/30 shadow-xl">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-pink-300 animate-pulse" />
                    <span className="text-white font-bold text-lg">Ready to Start Learning?</span>
                    <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
                  </div>
                  <p className="text-white/80 mb-6">Choose any game above to begin your personalized learning adventure!</p>
                  <Button 
                    onClick={() => router.push('/snake-game')}
                    className="group px-8 py-4 text-lg font-bold backdrop-blur-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-2xl border border-white/30 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <Gamepad2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Start with Snake Adventure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
