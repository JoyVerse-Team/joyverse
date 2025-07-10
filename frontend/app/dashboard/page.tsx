"use client"
import React from 'react';
import { useAuth } from '@/components/auth-provider';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Trophy, Gamepad2, Star, Play, Zap, Target, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        </div>

        <Navbar />
        
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl lg:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Welcome back, {user?.name}!
                </span>
              </h1>
              <p className="text-xl text-white/90 font-medium">Ready to continue your amazing learning journey? 🚀</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Profile Card */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 flex items-center justify-center shadow-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Profile</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-300" />
                    <span className="text-white/90 text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-300" />
                    <span className="text-white/90 text-sm">Member since Dec 2024</span>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 flex items-center justify-center shadow-xl">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Level 3</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">XP Points</span>
                    <span className="text-2xl font-bold text-green-300">1,250</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-white/70">75% to next level</p>
                </div>
              </div>

              {/* Games Played Card */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 flex items-center justify-center shadow-xl">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Games</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Played</span>
                    <span className="text-2xl font-bold text-purple-300">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Wins</span>
                    <span className="text-2xl font-bold text-pink-300">35</span>
                  </div>
                </div>
              </div>

              {/* Achievements Card */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500/80 to-orange-500/80 flex items-center justify-center shadow-xl">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Badges</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Earned</span>
                    <span className="text-2xl font-bold text-yellow-300">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Streak</span>
                    <span className="text-2xl font-bold text-orange-300">5 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Continue Playing */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  Continue Playing
                </h2>
                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold py-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Gamepad2 className="w-5 h-5 mr-3" />
                    Snake Adventure
                    <Badge className="ml-auto bg-green-500/80 text-white">Level 3</Badge>
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-500/80 to-cyan-500/80 hover:from-blue-600/90 hover:to-cyan-600/90 text-white font-bold py-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <BookOpen className="w-5 h-5 mr-3" />
                    Word Puzzles
                    <Badge className="ml-auto bg-blue-500/80 text-white">New!</Badge>
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">Snake Game</h4>
                        <p className="text-white/70 text-sm">Completed Level 3 • +50 XP</p>
                      </div>
                      <span className="text-white/60 text-xs">2h ago</span>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500/80 to-orange-500/80 flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">Achievement Unlocked!</h4>
                        <p className="text-white/70 text-sm">Speed Reader Badge</p>
                      </div>
                      <span className="text-white/60 text-xs">1d ago</span>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/80 to-cyan-500/80 flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">Daily Goal</h4>
                        <p className="text-white/70 text-sm">Completed 30 min session</p>
                      </div>
                      <span className="text-white/60 text-xs">2d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explore Games Section */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-white" />
                </div>
                Explore Games
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500/80 to-emerald-500/80 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Snake Adventure</h3>
                  <p className="text-white/70 text-sm mb-4">Classic snake game with educational words</p>
                  <Badge className="bg-green-500/80 text-white">Easy</Badge>
                </div>
                
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Bouncy Letters</h3>
                  <p className="text-white/70 text-sm mb-4">Bouncing past letter confusion</p>
                  <Badge className="bg-yellow-500/80 text-white">Medium</Badge>
                </div>
                
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500/80 to-red-500/80 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Word Puzzles</h3>
                  <p className="text-white/70 text-sm mb-4">Improve vocabulary and spelling skills</p>
                  <Badge className="bg-red-500/80 text-white">Hard</Badge>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold px-8 py-4 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Play className="w-5 h-5 mr-3" />
                  Explore All Games
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
