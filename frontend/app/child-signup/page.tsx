"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Gamepad2, Sparkles, Heart, Stars } from 'lucide-react';
import { signupWithEmail } from '@/lib/auth';
import { useAuth } from '@/components/auth-provider';
import Loader from '@/components/Loader';

export default function ChildSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    therapistUID: ''
  });  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 5 || parseInt(formData.age) > 18) {
      newErrors.age = 'Age must be between 5 and 18';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.therapistUID.trim()) {
      newErrors.therapistUID = 'Therapist ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const result = await signupWithEmail({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'child',
        age: parseInt(formData.age),
        gender: formData.gender,
        therapistUID: formData.therapistUID
      });
        if (result.success && result.user) {
        // Update the auth context with the new user
        login(result.user);
        setMessage('Account created successfully! Welcome to JoyVerse! 🎉');
        
        // Immediate redirect without delay
        router.replace('/');
      } else {
        setMessage(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Signup failed. Please try again.');
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
              <Link href="/child-login">
                <button className="px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90 text-white font-bold rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
        {/* Dark Glassmorphic Signup Card */}
        <div className="w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl border border-white/20 shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/80 to-emerald-500/80 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                Join the Adventure! 🎮
              </h1>
              <p className="text-white/80 font-medium">
                Create your account and start learning with fun games
              </p>
            </div>

            {message && (
              <Alert className={`mb-6 backdrop-blur-sm border ${
                message.includes('successfully') 
                  ? 'bg-green-500/20 border-green-400/50 text-green-200' 
                  : 'bg-red-500/20 border-red-400/50 text-red-200'
              }`}>
                <AlertDescription className="text-center font-medium">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/90 font-medium">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white/90 font-medium">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60"
                    placeholder="Age"
                    min="5"
                    max="18"
                  />
                  {errors.age && <p className="text-red-300 text-sm mt-1">{errors.age}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-white/90 font-medium">Gender</Label>
                  <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                    <SelectTrigger className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60">
                      <SelectValue placeholder="Select" className="text-white/50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-300 text-sm mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="therapistUID" className="text-white/90 font-medium">Therapist ID</Label>
                <Input
                  id="therapistUID"
                  name="therapistUID"
                  type="text"
                  value={formData.therapistUID}
                  onChange={handleChange}
                  className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60"
                  placeholder="Enter your therapist's ID"
                />
                {errors.therapistUID && <p className="text-red-300 text-sm mt-1">{errors.therapistUID}</p>}
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
                  placeholder="Create a password"
                />
                {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/90 font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="backdrop-blur-sm bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-300 focus:bg-white/20 focus:border-cyan-400/60"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500/90 to-emerald-500/90 hover:from-green-600/90 hover:to-emerald-600/90 text-white font-bold py-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  '🎮 Start My Adventure!'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-white/70 text-sm">
                Already have an account?{' '}
                <Link href="/child-login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300">
                  Login Here
                </Link>
              </div>
              
              <div className="pt-4 border-t border-white/20">
                <Link href="/role-selection?action=signup" className="text-white/60 hover:text-white/80 text-sm transition-colors duration-300">
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
