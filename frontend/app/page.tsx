"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Stars, Gamepad2, UserCheck, ChevronDown, Check, Camera, Brain, Gamepad, Smile, Users, Palette, Play, Shield, Zap, Target, BookOpen, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useLoading } from "@/hooks/useLoading"
import Loader from "@/components/Loader"
import { useAuth } from "@/components/auth-provider"

export default function HomePage() {
  console.log('🏠 HomePage component rendering...');
  
  const router = useRouter()
  const { navigateWithLoadingState, isLoading } = useLoading()
  const { user, isAuthenticated, loading, logout, loginDemo } = useAuth()

  console.log('🏠 HomePage - Initial state:', { 
    user: user?.name, 
    isAuthenticated, 
    loading
  });

  // Debug logging
  useEffect(() => {
    console.log('HomePage - Auth state changed:', { isAuthenticated, user: user?.name, loading });
    console.log('HomePage - Full auth object:', { user, isAuthenticated, loading });
  }, [isAuthenticated, user, loading]);

  // Force loading to false after 3 seconds if stuck
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.log('⚠️ Auth loading timeout - continuing without auth');
        // Force continue by treating as if loading is false
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  // Navigation handlers
  const handleLogin = () => navigateWithLoadingState('login', '/role-selection')
  const handleSignup = () => navigateWithLoadingState('signup', '/role-selection')
  const handleGamesClick = () => navigateWithLoadingState('games', '/games')
  const handleDashboardClick = () => navigateWithLoadingState('dashboard', '/dashboard')
  const handleProfileClick = () => navigateWithLoadingState('profile', '/profile')
  const handleHeaderLogin = () => navigateWithLoadingState('headerLogin', '/role-selection')
  const handleHeaderSignup = () => navigateWithLoadingState('headerSignup', '/role-selection')
  
  const handleDiscoverMore = () => {
    const discoverSection = document.getElementById("discover-more")
    if (discoverSection) {
      discoverSection.scrollIntoView({ behavior: "smooth" })
    }
  }
  
  const handleLogout = async () => {
    try {
      await logout()
      console.log('User logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Auth loading with timeout
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/30 shadow-2xl p-8">
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles - Fixed positions to avoid hydration mismatch */}
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
            { left: '40%', top: '85%', delay: '1.8s', duration: '3.6s' },
            { left: '85%', top: '10%', delay: '0.7s', duration: '4.8s' },
            { left: '25%', top: '90%', delay: '2.5s', duration: '3.3s' },
            { left: '75%', top: '65%', delay: '1.3s', duration: '4.3s' },
            { left: '45%', top: '35%', delay: '0.9s', duration: '5.2s' },
            { left: '65%', top: '75%', delay: '2.1s', duration: '3.9s' },
            { left: '35%', top: '55%', delay: '1.7s', duration: '4.7s' },
            { left: '55%', top: '40%', delay: '0.4s', duration: '3.4s' },
            { left: '95%', top: '85%', delay: '2.3s', duration: '5.1s' },
            { left: '5%', top: '65%', delay: '1.1s', duration: '4.1s' },
            { left: '80%', top: '20%', delay: '1.9s', duration: '3.7s' }
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
          <div className="space-y-10">            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 shadow-xl">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Empowering Every Learner</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Transform
                </span>
                <span className="block bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Learning
                </span>
                <span className="block bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Together
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl leading-relaxed font-medium drop-shadow-lg bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Empower children with dyslexia through AI-powered games, emotional intelligence, and personalized learning experiences.
              </p>
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
                    className="group px-12 py-6 text-xl font-bold backdrop-blur-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-2xl border border-white/30 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <Gamepad2 className="w-6 h-6 mr-4 group-hover:rotate-12 transition-transform" />
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

          {/* Right Content - Homepage Animation Video */}
          <div className="relative h-[500px] lg:h-[600px] w-full">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="metadata"
              onError={(e) => {
                console.error('Video failed to load:', e);
                // Hide video and show fallback
                const video = e.target as HTMLVideoElement;
                video.style.display = 'none';
                const fallback = video.parentElement?.querySelector('.video-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
              onLoadStart={() => {
                console.log('New video started loading...');
              }}
              onCanPlay={() => {
                console.log('New video can start playing');
              }}
              onLoadedData={() => {
                console.log('New video data loaded successfully');
              }}
            >
              <source src="/Homepage animation.mp4?v=2" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Fallback content if video fails */}
            <div className="video-fallback absolute inset-0 hidden items-center justify-center">
              <div className="text-center space-y-6">
                <div className="text-8xl lg:text-9xl">🎮</div>
                <div className="space-y-3">
                  <h3 className="text-3xl lg:text-4xl font-bold text-white">Interactive Learning</h3>
                  <p className="text-white/80 text-lg">Engaging games that make learning fun!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button 
          onClick={handleDiscoverMore}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 animate-bounce hover:scale-110 transition-all duration-300 cursor-pointer"
        >
          <span className="text-sm font-medium">Discover More</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Discover More Section */}
      <section id="discover-more" className="relative z-10 py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-20">
            
            {/* Section Header */}
            <div className="text-center space-y-6">
              <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                Our Mission
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Breaking barriers and unlocking potential through innovative technology designed specifically for children with dyslexia.
              </p>
            </div>

            {/* Our Goal */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 flex items-center justify-center shadow-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Our Goal</h3>
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed">
                    To create a world where every child with dyslexia can learn, grow, and thrive without barriers. 
                    We believe that with the right tools and support, every child can unlock their full potential 
                    and develop a lifelong love for learning.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Boost confidence and self-esteem",
                      "Develop essential literacy skills",
                      "Foster independence in learning",
                      "Connect families with expert support"
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-white/90">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-white/30 shadow-xl">
                    <div className="text-center space-y-4">
                      <Heart className="w-16 h-16 text-pink-300 mx-auto animate-pulse" />
                      <h4 className="text-2xl font-bold text-white">Every Child Matters</h4>
                      <p className="text-white/80">
                        We're committed to making learning accessible, enjoyable, and effective for children with dyslexia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Solution */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-white/30 shadow-xl">
                    <div className="text-center space-y-4">
                      <Lightbulb className="w-16 h-16 text-yellow-300 mx-auto animate-pulse" />
                      <h4 className="text-2xl font-bold text-white">Innovation Meets Care</h4>
                      <p className="text-white/80">
                        Cutting-edge AI technology combined with evidence-based learning approaches.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 flex items-center justify-center shadow-xl">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Our Solution</h3>
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed">
                    JoyVerse combines advanced artificial intelligence with evidence-based learning methodologies 
                    to create personalized, adaptive learning experiences that respond to each child's unique needs, 
                    emotions, and learning pace.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Brain, title: "AI Adaptation", desc: "Smart algorithms adjust difficulty in real-time" },
                      { icon: Camera, title: "Emotion Detection", desc: "Facial recognition monitors engagement levels" },
                      { icon: Gamepad, title: "Game-Based Learning", desc: "Fun, interactive experiences that motivate" },
                      { icon: Users, title: "Expert Support", desc: "Professional therapists guide the journey" }
                    ].map((solution, index) => (
                      <div key={index} className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <solution.icon className="w-8 h-8 text-cyan-300 mb-2" />
                        <h5 className="font-bold text-white text-sm mb-1">{solution.title}</h5>
                        <p className="text-xs text-white/70">{solution.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Interactive Learning Experience
                </h3>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Discover how our innovative features create engaging, personalized learning journeys.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Gamepad2,
                    title: "Interactive Games",
                    description: "Engaging word games like Snake Adventure that make spelling and reading fun while building essential literacy skills.",
                    color: "from-blue-500/70 to-cyan-500/70",
                    features: ["Word Snake", "Spelling Quests", "Reading Adventures", "Vocabulary Builders"]
                  },
                  {
                    icon: Brain,
                    title: "AI Adaptation",
                    description: "Advanced machine learning algorithms that understand each child's learning patterns and adjust content difficulty in real-time.",
                    color: "from-purple-500/70 to-pink-500/70",
                    features: ["Real-time Difficulty Adjustment", "Personalized Content", "Learning Pattern Analysis", "Progress Tracking"]
                  },
                  {
                    icon: Camera,
                    title: "Emotion Detection",
                    description: "Facial expression recognition technology that monitors engagement and adjusts the experience based on the child's emotional state.",
                    color: "from-green-500/70 to-emerald-500/70",
                    features: ["Mood Recognition", "Engagement Monitoring", "Stress Detection", "Adaptive Response"]
                  },
                  {
                    icon: Users,
                    title: "Therapist Dashboard",
                    description: "Comprehensive tools for therapists to monitor progress, customize learning paths, and provide targeted support.",
                    color: "from-orange-500/70 to-red-500/70",
                    features: ["Progress Analytics", "Custom Learning Paths", "Session Reports", "Parent Communication"]
                  },
                  {
                    icon: Shield,
                    title: "Safe Environment",
                    description: "A secure, child-friendly platform with privacy protection and content moderation to ensure a safe learning space.",
                    color: "from-indigo-500/70 to-blue-500/70",
                    features: ["Privacy Protection", "Content Moderation", "Secure Data", "Child-Safe Design"]
                  },
                  {
                    icon: Smile,
                    title: "Positive Reinforcement",
                    description: "Celebration-focused approach with rewards, achievements, and encouragement to build confidence and motivation.",
                    color: "from-pink-500/70 to-rose-500/70",
                    features: ["Achievement Badges", "Progress Celebrations", "Positive Feedback", "Confidence Building"]
                  }
                ].map((feature, index) => (
                  <div key={index} className="backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl mb-6`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-white/80 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span className="text-sm text-white/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-8 py-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-white">
                Ready to Transform Learning?
              </h3>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Join thousands of families and therapists who are already using JoyVerse to unlock every child's potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleSignup}
                  disabled={isLoading('signup')}
                  size="lg"
                  className="group px-8 py-4 text-lg font-bold backdrop-blur-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white rounded-2xl border border-white/30 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                  Start Your Journey
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
              </div>
            </div>
          </div>
        </div>
      </section>

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
