"use client"
import React from 'react';
import { useAuth } from '@/components/auth-provider';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Trophy, Gamepad2, Star } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600">Ready to continue your learning journey?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Profile Card */}
              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Joined December 2024</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Games Played</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Score</span>
                    <Badge variant="secondary">1,250</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">3</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Gamepad2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Snake Game</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Gamepad2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Math Quiz</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Games Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Continue Playing
                </CardTitle>
                <CardDescription>
                  Pick up where you left off or try something new
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mb-3"></div>
                    <h3 className="font-semibold mb-1">Snake Game</h3>
                    <p className="text-sm text-gray-600 mb-2">Classic snake game with a twist</p>
                    <Badge variant="outline">Easy</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mb-3"></div>
                    <h3 className="font-semibold mb-1">Word Puzzle</h3>
                    <p className="text-sm text-gray-600 mb-2">Improve your vocabulary</p>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mb-3"></div>
                    <h3 className="font-semibold mb-1">Math Challenge</h3>
                    <p className="text-sm text-gray-600 mb-2">Practice your math skills</p>
                    <Badge variant="outline">Hard</Badge>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Explore All Games
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
