"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Users, Play } from "lucide-react"

export default function HomePage() {
  console.log('🏠 Simplified HomePage rendering...');
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>

      {/* Header */}
      <header className="relative z-20 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              JoyVerse
            </div>
            <div className="flex items-center gap-4">
              <Button className="px-6 py-3 bg-white/20 text-white rounded-2xl">
                <Play className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-10">
            <h1 className="text-6xl lg:text-7xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Transform
              </span>
              <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
                Learning
              </span>
              <span className="block bg-gradient-to-r from-pink-300 via-red-300 to-yellow-300 bg-clip-text text-transparent">
                Together
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-medium">
              Empower children with dyslexia through AI-powered games, emotional intelligence, and personalized learning experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button 
                size="lg"
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl"
              >
                <Sparkles className="w-5 h-5 mr-3" />
                Start Your Journey
              </Button>
            </div>
          </div>

          {/* Right Content - Simple Animation Placeholder */}
          <div className="relative h-[500px] lg:h-[600px] w-full">
            <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute top-0 left-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg transform rotate-12 animate-bounce shadow-xl flex items-center justify-center text-white font-bold text-sm">
                    J
                  </div>
                  <div className="absolute top-8 right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg transform -rotate-12 animate-bounce delay-300 shadow-xl flex items-center justify-center text-white font-bold text-sm">
                    O
                  </div>
                  <div className="absolute bottom-8 left-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg transform rotate-6 animate-bounce delay-500 shadow-xl flex items-center justify-center text-white font-bold text-sm">
                    Y
                  </div>
                  <div className="absolute bottom-0 right-6 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg transform -rotate-6 animate-bounce delay-700 shadow-xl flex items-center justify-center text-white font-bold text-sm">
                    ✨
                  </div>
                  <div className="absolute inset-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-2xl flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold text-xl">JoyVerse Learning</p>
                  <p className="text-white/80 text-sm">Where Learning Meets Joy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
