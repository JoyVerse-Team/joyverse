import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield } from 'lucide-react';

export default function TermsPage() {
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
            <Link href="/signup">
              <button className="px-6 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 backdrop-blur-sm bg-white/20 hover:bg-white/30 rounded-xl border border-white/30 shadow-lg">
                Back to Signup
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Glassmorphic Terms Card */}
          <div className="backdrop-blur-2xl bg-white/40 rounded-3xl border border-white/50 shadow-2xl relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-pink-500/80 rounded-2xl flex items-center justify-center shadow-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Terms of Service
                  </h1>
                  <p className="text-gray-700 font-medium">Last updated: December 2024</p>
                </div>
              </div>

              <div className="prose max-w-none space-y-8">
                <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using Joy-Verse, you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use License</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Permission is granted to temporarily download one copy of Joy-Verse materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You are responsible for safeguarding the password and for all activities that occur under your account. 
                    You agree not to disclose your password to any third party and to take sole responsibility for activities under your account.
                  </p>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. We collect and process information about you and your use of our service 
                    in accordance with our Privacy Policy. This includes information necessary to provide our educational services 
                    and ensure child safety.
                  </p>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Child Safety</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Joy-Verse is designed specifically for children with dyslexia. We maintain strict safeguarding policies 
                    and comply with child protection regulations. All interactions are monitored and content is age-appropriate.
                  </p>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall Joy-Verse or its suppliers be liable for any damages arising out of the use or inability 
                    to use the materials on our website, even if authorized representatives have been notified orally or in writing.
                  </p>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-2xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at: support@joyverse.com
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-bold px-8 py-3 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Signup
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
