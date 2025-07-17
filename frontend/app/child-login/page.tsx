"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Gamepad2, Sparkles, Heart, Stars, Play, ArrowLeft, Shield, Users } from 'lucide-react';
import { authAPI } from '@/lib/auth';
import { useAuth } from '@/components/auth-provider';
import Loader from '@/components/Loader';

export default function ChildLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();

  // Redirect to homepage if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      console.log('User authenticated, redirecting to homepage:', user);
      setTimeout(() => {
        router.replace('/');
      }, 500);
    }
  }, [isAuthenticated, user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      console.log('handleSubmit: Attempting login with backend API for:', formData.email);
      const result = await authAPI.login(formData.email, formData.password);
      
      if (result.success && result.user) {
        console.log('handleSubmit: Backend login successful:', result.user);
        setMessage('Login successful! Welcome back! 🎉');
        login(result.user);
        
        setTimeout(() => {
          console.log('handleSubmit: Redirecting to homepage...');
          router.replace('/');
        }, 1000);
      } else {
        console.log('handleSubmit: Backend login failed:', result.message);
        setMessage(result.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('handleSubmit: Backend login error:', error);
      setMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Ultra-modern Glassmorphic Header */}
      <header className="relative z-20 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                JoyVerse
              </div>
            </Link>
            <Link href="/" className="flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          
          {/* Login Card */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/30 shadow-2xl p-8">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur opacity-30 -z-10"></div>
            
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 shadow-xl">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Welcome Back!
                </h1>
                <p className="text-white/80 leading-relaxed">
                  Ready to continue your learning adventure?
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <Alert className={`backdrop-blur-xl ${
                    message.includes('Welcome') || message.includes('successful') 
                      ? 'bg-green-500/20 border-green-400/50 text-green-100' 
                      : 'bg-red-500/20 border-red-400/50 text-red-100'
                  } rounded-2xl border shadow-xl`}>
                    <AlertDescription className="text-center font-medium">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder:text-white/60 shadow-xl focus:bg-white/30 focus:border-white/50 transition-all duration-300 rounded-xl"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 font-medium">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder:text-white/60 shadow-xl focus:bg-white/30 focus:border-white/50 transition-all duration-300 rounded-xl"
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remember: !!checked }))}
                    className="backdrop-blur-xl bg-white/20 border-white/40 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-400"
                  />
                  <Label htmlFor="remember" className="text-sm text-white/80">
                    Remember me for next time
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl border border-white/30 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 min-h-[3.5rem] flex items-center justify-center"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <>
                      <Gamepad2 className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                      Start Playing!
                    </>
                  )}
                </Button>
              </form>

              {/* Links Section */}
              <div className="space-y-6 pt-4">
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/forgot-password" 
                    className="text-center text-white/80 hover:text-white text-sm font-medium transition-colors duration-300 backdrop-blur-xl bg-white/10 hover:bg-white/20 py-3 px-4 rounded-xl border border-white/20 hover:border-white/30 shadow-lg"
                  >
                    Forgot your password?
                  </Link>
                  
                  <div className="text-center backdrop-blur-xl bg-white/10 py-4 px-6 rounded-xl border border-white/20 shadow-lg">
                    <span className="text-white/80 text-sm">New to JoyVerse? </span>
                    <Link 
                      href="/child-signup" 
                      className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors duration-300"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  <Link 
                    href="/role-selection?action=login" 
                    className="flex items-center justify-center gap-2 text-white/60 hover:text-white/90 text-sm transition-colors duration-300 backdrop-blur-xl bg-white/5 hover:bg-white/10 py-3 px-4 rounded-xl border border-white/10 hover:border-white/20 shadow-lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Choose Different Role
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
