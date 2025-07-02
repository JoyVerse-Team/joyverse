"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserCheck, Sparkles, Heart, Stars } from 'lucide-react';
import { loginWithEmail } from '@/lib/auth';
import { useAuth } from '@/components/auth-provider';

export default function TherapistLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');    try {
      // Use backend MongoDB authentication
      const result = await loginWithEmail(formData.email, formData.password);
      
      if (result.success && result.user) {
        // Backend auth will automatically update the auth state
        setMessage('Access granted. Welcome to your dashboard!');
          setTimeout(() => {
          router.push('/'); // Redirect to homepage where they'll see the logged in state
        }, 1500);
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark Theme Background - Matching Homepage */}
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
            { left: '50%', top: '15%', delay: '1.5s', duration: '4.5s' }
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

      {/* Dark Glassmorphic Header */}
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
              <Link href="/role-selection?action=login">
                <button className="px-6 py-3 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Choose Role
                </button>
              </Link>
              <Link href="/role-selection?action=signup">
                <button className="px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
        {/* Dark Glassmorphic Login Card */}
        <div className="w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl border border-white/20 shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/80 to-green-500/80 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <UserCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                Therapist Portal 👩‍⚕️
              </h1>
              <p className="text-white/80 font-medium">
                Access your professional dashboard and student insights
              </p>
            </div>

            {message && (
              <Alert className={`mb-6 backdrop-blur-sm border ${
                message.includes('granted') 
                  ? 'bg-green-500/20 border-green-400/50 text-green-200' 
                  : 'bg-red-500/20 border-red-400/50 text-red-200'
              }`}>
                <AlertDescription className="text-center font-medium">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">Professional Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60"
                  placeholder="Enter your professional email"
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
                  className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60"
                  placeholder="Enter your secure password"
                />
                {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remember: !!checked }))}
                  className="backdrop-blur-sm bg-white/10 border-white/20"
                />
                <Label htmlFor="remember" className="text-sm text-white/70">
                  Keep me signed in
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500/90 to-green-500/90 hover:from-blue-600/90 hover:to-green-600/90 text-white font-bold py-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  '📊 Access Dashboard'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300">
                Forgot your password?
              </Link>
              
              <div className="text-white/70 text-sm">
                New therapist?{' '}
                <Link href="/therapist-signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300">
                  Request Access
                </Link>
              </div>
              
              <div className="pt-4 border-t border-white/20">
                <Link href="/role-selection?action=login" className="text-white/60 hover:text-white/80 text-sm transition-colors duration-300">
                  ← Choose Different Role
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
