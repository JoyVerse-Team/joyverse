"use client"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Gamepad2, UserCheck, Sparkles, Heart, Stars, Play, Target, Brain, Users, Shield } from 'lucide-react'
import { Suspense } from 'react'

function RoleSelectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action') || 'login' // 'login' or 'signup'

  const handleChildSelection = () => {
    router.push(`/child-${action}`)
  }

  const handleTherapistSelection = () => {
    router.push(`/therapist-${action}`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background - Matching Homepage */}
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
            { left: '65%', top: '75%', delay: '2.1s', duration: '3.9s' }
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
            <Link href="/" className="flex items-center gap-4">
              <div className="relative">
                <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                  JoyVerse
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-lg blur-sm -z-10"></div>
              </div>
              <div className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white rounded-full border border-white/30 shadow-lg">
                v2.0 Beta
              </div>
            </Link>
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/role-selection?action=login">
                <button className="px-6 py-3 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Play className="w-4 h-4 mr-2 inline" />
                  Login
                </button>
              </Link>
              <Link href="/role-selection?action=signup">
                <button className="px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-5xl mx-auto">
            
            {/* Mission Badge */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 shadow-xl mb-6">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Choose Your Role</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
                <span className="block bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                  {action === 'login' ? 'Welcome Back!' : 'Join JoyVerse!'}
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-medium drop-shadow-lg max-w-3xl mx-auto">
                {action === 'login' 
                  ? 'Choose your account type to continue your <span class="text-cyan-300 font-bold">learning journey</span>'
                  : 'Select your role to get started with <span class="text-purple-300 font-bold">personalized learning</span> experiences'
                }
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Child Option */}
              <button
                onClick={handleChildSelection}
                className="group backdrop-blur-2xl bg-white/10 hover:bg-white/20 rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/80 to-purple-500/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border border-white/40 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Gamepad2 className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    I'm a Child 🌟
                  </h3>
                  
                  <p className="text-lg text-white/80 leading-relaxed mb-6">
                    Ready to play fun games and learn in a magical way! 
                    Start your adventure with <span className="text-cyan-300 font-bold">JoyVerse learning games</span>.
                  </p>
                  
                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {[
                      { icon: Brain, text: "Smart Games", color: "from-cyan-500/60 to-blue-500/60" },
                      { icon: Heart, text: "Fun Learning", color: "from-pink-500/60 to-red-500/60" }
                    ].map((feature, index) => (
                      <div key={index} className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} backdrop-blur-xl border border-white/30 shadow-lg`}>
                        <feature.icon className="w-3 h-3 text-white" />
                        <span className="text-xs font-bold text-white">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 text-cyan-300 font-bold text-lg">
                    <Play className="w-5 h-5" />
                    <span>{action === 'login' ? 'Continue Playing' : 'Start Your Journey'}</span>
                  </div>
                </div>
              </button>

              {/* Therapist Option */}
              <button
                onClick={handleTherapistSelection}
                className="group backdrop-blur-2xl bg-white/10 hover:bg-white/20 rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-indigo-400/10 to-blue-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/80 to-indigo-500/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border border-white/40 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    I'm a Therapist 👩‍⚕️
                  </h3>
                  
                  <p className="text-lg text-white/80 leading-relaxed mb-6">
                    Access professional tools to monitor progress, analyze emotions, 
                    and support your students' <span className="text-purple-300 font-bold">learning journey</span>.
                  </p>
                  
                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {[
                      { icon: Shield, text: "Professional Tools", color: "from-purple-500/60 to-indigo-500/60" },
                      { icon: Users, text: "Student Support", color: "from-indigo-500/60 to-blue-500/60" }
                    ].map((feature, index) => (
                      <div key={index} className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} backdrop-blur-xl border border-white/30 shadow-lg`}>
                        <feature.icon className="w-3 h-3 text-white" />
                        <span className="text-xs font-bold text-white">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 text-purple-300 font-bold text-lg">
                    <Users className="w-5 h-5" />
                    <span>{action === 'login' ? 'Access Dashboard' : 'Join as Professional'}</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-12">
              <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors duration-300 hover:scale-105 transform">
                <span>←</span>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function RoleSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RoleSelectionContent />
    </Suspense>
  )
}
