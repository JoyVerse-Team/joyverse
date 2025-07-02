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
import { Loader2, UserPlus, Sparkles, Heart, Stars, Shield } from 'lucide-react';
import { signupWithEmail } from '@/lib/auth';

export default function SignupPage() {  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    therapistUID: '',
    terms: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    
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
    
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 5 || parseInt(formData.age) > 18) {
      newErrors.age = 'Age must be between 5 and 18 years';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
      if (!formData.therapistUID) {
      newErrors.therapistUID = 'Therapist ID is required';
    } else if (!/^[0-9a-fA-F]{24}$/.test(formData.therapistUID)) {
      newErrors.therapistUID = 'Therapist ID must be a 24-character hexadecimal string';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
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
      const result = await signupWithEmail({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'user', // Default role for general signup
        age: parseInt(formData.age),
        gender: formData.gender,
        therapistUID: formData.therapistUID
      });
      
      if (result.success) {
        setMessage('Account created successfully! Please check your email to verify your account.');
        
        setTimeout(() => {
          router.push('/dashboard'); // Redirect to dashboard since they're now logged in
        }, 3000);
      } else {
        setMessage(result.message || 'Signup failed');
      }
    } catch (error) {
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
              <button className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 backdrop-blur-sm bg-white/20 hover:bg-white/30 rounded-xl border border-white/30 shadow-lg">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white font-medium rounded-xl backdrop-blur-sm border border-white/40 shadow-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
        {/* Enhanced Glassmorphic Signup Card */}
        <div className="w-full max-w-md backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/50 shadow-2xl relative overflow-hidden">
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          
          <div className="relative z-10 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Join Joy-Verse
              </h1>
              <p className="text-gray-700">
                Create your account to get started
              </p>
            </div>            
            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
                  message.includes('successfully') 
                    ? 'border-green-300/50 bg-green-100/50 text-green-800' 
                    : 'border-red-300/50 bg-red-100/50 text-red-800'
                }`}>
                  {message}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  className={`backdrop-blur-sm bg-white/30 border-white/40 rounded-xl transition-all duration-300 focus:bg-white/40 focus:border-purple-400/60 ${
                    errors.fullName ? 'border-red-500/60 bg-red-50/30' : ''
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>              
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
                  placeholder="Enter your email"
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
                placeholder="Create a password"
              />
              <p className="text-xs text-gray-600">
                At least 8 characters with uppercase, lowercase, and number
              </p>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className={`backdrop-blur-sm bg-white/30 border-white/40 rounded-xl transition-all duration-300 focus:bg-white/40 focus:border-purple-400/60 ${
                  errors.confirmPassword ? 'border-red-500/60 bg-red-50/30' : ''
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
              <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
              <Input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={loading}
                min="5"
                max="18"
                className={`backdrop-blur-sm bg-white/30 border-white/40 rounded-xl transition-all duration-300 focus:bg-white/40 focus:border-purple-400/60 ${
                  errors.age ? 'border-red-500/60 bg-red-50/30' : ''
                }`}
                placeholder="Enter your age (5-18)"
              />
              {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.gender ? 'border-red-500' : ''}`}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>
              <div className="space-y-2">
              <Label htmlFor="therapistUID">Therapist ID</Label>
              <Input
                type="text"
                id="therapistUID"
                name="therapistUID"
                value={formData.therapistUID}
                onChange={handleChange}
                disabled={loading}
                className={errors.therapistUID ? 'border-red-500' : ''}
                placeholder="e.g., 6852586bd1242044d0686343"
              />
              <p className="text-xs text-gray-500">
                This should be a 24-character ID provided by your assigned therapist
              </p>
              {errors.therapistUID && <p className="text-sm text-red-500">{errors.therapistUID}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, terms: !!checked }))
                  }
                  disabled={loading}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
            </div>
              <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold py-3 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>              
              <div className="text-center text-sm text-gray-700">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
