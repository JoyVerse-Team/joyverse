"use client"
import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Stars, Gamepad2, UserCheck, ChevronDown, Check, Camera, Brain, Gamepad, Smile, Users, Palette, Play, Shield, Zap, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useLoading } from "@/hooks/useLoading"
import Loader from "@/components/Loader"
import { useAuth } from "@/components/auth-provider"

export default function HomePage() {
  const router = useRouter()
  const { navigateWithLoadingState, isLoading } = useLoading()
  const { user, isAuthenticated, loading, logout, loginDemo } = useAuth()

  // Debug logging
  useEffect(() => {
    console.log('HomePage - Auth state changed:', { isAuthenticated, user: user?.name, loading });
  }, [isAuthenticated, user, loading]);

  // Navigation handlers
  const handleLogin = () => navigateWithLoadingState('login', '/child-login')
  const handleSignup = () => navigateWithLoadingState('signup', '/child-login')
  const handleGamesClick = () => navigateWithLoadingState('games', '/games')
  const handleDashboardClick = () => navigateWithLoadingState('dashboard', '/dashboard')
  const handleProfileClick = () => navigateWithLoadingState('profile', '/profile')
  const handleHeaderLogin = () => navigateWithLoadingState('headerLogin', '/child-login')
  const handleHeaderSignup = () => navigateWithLoadingState('headerSignup', '/role-selection')
  
  const handleLogout = async () => {
    try {
      await logout()
      console.log('User logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
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

      {/* Ultra-modern Glassmorphic Header */}
      <header className="relative z-20 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            {/* Logo with enhanced styling */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                  JoyVerse
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-lg blur-sm -z-10"></div>
              </div>
              <div className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white rounded-full border border-white/30 shadow-lg">
                v2.0 Beta
              </div>
            </div>

            {/* Navigation with enhanced buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-white/20 to-white/10 rounded-2xl border border-white/30 shadow-xl">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <UserCheck className="w-5 h-5 text-cyan-300" />
                    <span className="font-bold text-white drop-shadow-lg">Welcome, {user?.name}!</span>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    className="px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600/90 hover:to-pink-600/90 text-white font-bold rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleHeaderLogin}
                    disabled={isLoading('headerLogin')}
                    className="px-6 py-3 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isLoading('headerLogin') ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Login
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleHeaderSignup}
                    disabled={isLoading('headerSignup')}
                    className="px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isLoading('headerSignup') ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Join Now
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Design */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 shadow-xl">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Award-Winning Learning Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Transform
                </span>
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Learning
                </span>
                <span className="block bg-gradient-to-r from-pink-300 via-red-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Together
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-medium drop-shadow-lg">
                Empower children with dyslexia through <span className="text-cyan-300 font-bold">AI-powered games</span>, 
                <span className="text-purple-300 font-bold"> emotional intelligence</span>, and 
                <span className="text-pink-300 font-bold"> personalized learning</span> experiences.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Brain, text: "AI-Powered", color: "from-cyan-500/80 to-blue-500/80" },
                { icon: Heart, text: "Emotion-Aware", color: "from-pink-500/80 to-red-500/80" },
                { icon: Shield, text: "Safe & Secure", color: "from-green-500/80 to-emerald-500/80" },
                { icon: Users, text: "Therapist Support", color: "from-purple-500/80 to-indigo-500/80" }
              ].map((feature, index) => (
                <div key={index} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                  <feature.icon className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              {!isAuthenticated ? (
                <>
                  <Button 
                    onClick={handleSignup}
                    disabled={isLoading('signup')}
                    size="lg"
                    className="group px-8 py-4 text-lg font-bold backdrop-blur-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white rounded-2xl border border-white/30 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    {isLoading('signup') ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Starting Adventure...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                        Start Your Journey
                        <ChevronDown className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={loginDemo}
                    variant="outline"
                    size="lg"
                    className="group px-8 py-4 text-lg font-bold backdrop-blur-xl bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Try Demo
                  </Button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Button 
                    onClick={handleGamesClick}
                    disabled={isLoading('games')}
                    size="lg"
                    className="group px-8 py-4 text-lg font-bold backdrop-blur-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-2xl border border-white/30 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <Gamepad2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Play Games
                  </Button>

                  <Button 
                    onClick={handleDashboardClick}
                    disabled={isLoading('dashboard')}
                    size="lg"
                    className="group px-8 py-4 text-lg font-bold backdrop-blur-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-2xl border border-white/30 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <Users className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Interactive Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8 hover:shadow-3xl transform hover:scale-105 transition-all duration-500">
              {/* Glowing border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              
              <div className="relative space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 shadow-xl">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Learning Made Magical</h3>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Gamepad, title: "Interactive Games", desc: "Engaging gameplay", color: "from-blue-500/70 to-cyan-500/70" },
                    { icon: Brain, title: "AI Adaptation", desc: "Smart learning", color: "from-purple-500/70 to-pink-500/70" },
                    { icon: Camera, title: "Emotion Detection", desc: "Mood awareness", color: "from-green-500/70 to-emerald-500/70" },
                    { icon: Smile, title: "Positive Vibes", desc: "Joy-focused", color: "from-yellow-500/70 to-orange-500/70" }
                  ].map((feature, index) => (
                    <div key={index} className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                      <feature.icon className="w-6 h-6 text-white mb-2" />
                      <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                      <p className="text-xs text-white/80">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex justify-around pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-300">1K+</div>
                    <div className="text-xs text-white/70">Happy Kids</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300">50+</div>
                    <div className="text-xs text-white/70">Therapists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-300">99%</div>
                    <div className="text-xs text-white/70">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-xl animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-xl animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full shadow-xl animate-pulse"></div>
          </div>
        </div>
      </main>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-sm font-medium">Discover More</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Enhanced Loading Overlay */}
      {(isLoading('login') || isLoading('signup') || isLoading('games') || isLoading('dashboard') || isLoading('profile') || isLoading('headerLogin') || isLoading('headerSignup')) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/30 shadow-2xl p-8">
            <Loader />
          </div>
        </div>
      )}
    </div>
  )
}
