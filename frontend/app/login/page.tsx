"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Sparkles, Heart, Stars } from 'lucide-react';
import { loginWithEmail } from '@/lib/auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);  const [message, setMessage] = useState('');
    const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
      try {
      // Use backend MongoDB authentication
      const result = await loginWithEmail(formData.email, formData.password);
      
      if (result.success && result.user) {
        // Backend auth will automatically update the auth state
        setMessage('Login successful! Redirecting...');
        
        setTimeout(() => {
          // Redirect based on user role
          if (result.user!.role === 'therapist') {
            router.push('/dashboard'); // Therapist dashboard
          } else {
            router.push('/dashboard'); // User dashboard
          }
        }, 1500);
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Enhanced Magical Glassmorphism Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-300/60 via-pink-300/50 to-blue-300/60">
        {/* Enhanced Floating background shapes with more opacity */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-br from-blue-400/40 to-green-400/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-72 h-72 bg-gradient-to-br from-pink-400/40 to-purple-400/40 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-br from-green-400/40 to-blue-400/40 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Additional ambient light effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse delay-300"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse delay-800"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <div className="w-6 h-6 text-purple-400/60">✦</div>
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float-delayed">
          <div className="w-5 h-5 text-pink-400/60">❤</div>
        </div>
        <div className="absolute bottom-1/3 left-1/5 animate-float-slow">
          <div className="w-7 h-7 text-blue-400/60">✨</div>
        </div>
      </div>

      {/* Enhanced Glassmorphic Header */}
      <header className="relative z-20 backdrop-blur-xl bg-white/30 border-b border-white/40 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              JoyVerse
            </div>
          </Link>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="px-6 py-2 text-purple-700 font-medium bg-white/40 hover:bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg transition-all duration-300">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-medium rounded-xl backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
        {/* Enhanced Glassmorphic Login Card */}
        <div className="w-full max-w-md backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/50 shadow-2xl relative overflow-hidden">
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          
          <div className="relative z-10 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-700">
                Sign in to your Joy-Verse account
              </p>
            </div>            
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
                  message.includes('successful') 
                    ? 'border-green-300/50 bg-green-100/50 text-green-800' 
                    : 'border-red-300/50 bg-red-100/50 text-red-800'
                }`}>
                  {message}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`backdrop-blur-sm bg-white/30 border-white/40 rounded-xl transition-all duration-300 focus:bg-white/40 focus:border-purple-400/60 ${
                    errors.email ? 'border-red-500/60 bg-red-50/30' : ''
                  }`}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`backdrop-blur-sm bg-white/30 border-white/40 rounded-xl transition-all duration-300 focus:bg-white/40 focus:border-purple-400/60 ${
                    errors.password ? 'border-red-500/60 bg-red-50/30' : ''
                  }`}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, remember: !!checked }))
                    }
                    disabled={loading}
                    className="border-white/40 bg-white/20 backdrop-blur-sm"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-700">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold py-3 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-700">
                Don't have an account?{' '}
                <Link href="/signup" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
