"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { authAPI } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        setMessage(response.message || 'Password reset instructions sent!');
        setEmailSent(true);
      } else {
        setMessage(response.message || 'Failed to send reset instructions');
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
            <Link href="/child-login">
              <button className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 backdrop-blur-sm bg-white/20 hover:bg-white/30 rounded-xl border border-white/30 shadow-lg">
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
        {/* Enhanced Glassmorphic Reset Password Card */}
        <div className="w-full max-w-md backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/50 shadow-2xl relative overflow-hidden">
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          
          <div className="relative z-10 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-pink-500/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Reset Password
              </h1>
              <p className="text-gray-700">
                Don't worry! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className="p-4 rounded-2xl backdrop-blur-sm border border-red-300/50 bg-red-100/50 text-red-800">
                    {message}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="backdrop-blur-sm bg-white/30 border-white/40 rounded-xl transition-all duration-300 focus:bg-white/40 focus:border-purple-400/60"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold py-3 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Instructions...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="p-4 rounded-2xl backdrop-blur-sm border border-green-300/50 bg-green-100/50 text-green-800">
                  {message}
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/80 to-emerald-500/80 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-800">Check Your Email!</h3>
                  <p className="text-gray-700">
                    We've sent password reset instructions to your email. 
                    Don't forget to check your spam folder if you don't see it.
                  </p>
                </div>
                
                <Button 
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                    setMessage('');
                  }}
                  className="w-full bg-gradient-to-r from-blue-500/90 to-cyan-500/90 hover:from-blue-600/90 hover:to-cyan-600/90 text-white font-bold py-3 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Send to Different Email
                </Button>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link href="/child-login" className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
