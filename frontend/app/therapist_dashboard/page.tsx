"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Eye, User, Clock, BookOpen, Calendar, X, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { localDataService, type Therapist, type Student, type GameSession, type WeeklyData } from "@/lib/therapist-api"


const getEmotionColor = (emotion: string) => {
  const colors: { [key: string]: string } = {
    Happy: "bg-green-100 text-green-800",
    Sad: "bg-blue-100 text-blue-800",
    Frustrated: "bg-orange-100 text-orange-800",
    Confident: "bg-emerald-100 text-emerald-800",
    Excited: "bg-pink-100 text-pink-800",
    Anxious: "bg-amber-100 text-amber-800",
    Focused: "bg-cyan-100 text-cyan-800",
    Overwhelmed: "bg-gray-100 text-gray-800",
    Curious: "bg-indigo-100 text-indigo-800",
    Proud: "bg-purple-100 text-purple-800",
  }
  return colors[emotion] || "bg-gray-100 text-gray-800"
}

const getDifficultyColor = (difficulty: string) => {
  const colors: { [key: string]: string } = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }
  return colors[difficulty] || "bg-gray-100 text-gray-800"
}

export default function Dashboard() {
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedStudentSessions, setSelectedStudentSessions] = useState<GameSession[]>([])
  const [showStudentDetail, setShowStudentDetail] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  // Add new state for session emotion drill-down
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null)
  const [sessionEmotions, setSessionEmotions] = useState<any>(null)
  const [showSessionDetail, setShowSessionDetail] = useState(false)
  const [isLoadingEmotions, setIsLoadingEmotions] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedTherapist = localStorage.getItem("therapist")
    if (storedTherapist) {
      setTherapist(JSON.parse(storedTherapist))
      loadDashboardData()
    } else {
      router.push("/")
    }
  }, [router])

  const loadDashboardData = async () => {
    setIsLoading(true)

    try {
      const storedTherapist = localStorage.getItem("therapist")
      if (!storedTherapist) {
        throw new Error('No therapist found')
      }

      const therapist = JSON.parse(storedTherapist)
      const dashboardData = await localDataService.getDashboardData(therapist.id)
      
      setStudents(dashboardData.students)
      setRecentSessions(dashboardData.recentSessions)
      setWeeklyData(dashboardData.weeklyStats)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("therapist")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }
 
  const handleViewStudent = async (studentId: string) => {
    // Find the student data
    const student = students.find((s) => s.id === studentId)
    if (student) {
      setSelectedStudent(student)
      try {
        const sessions = await localDataService.getStudentSessions(studentId)
        setSelectedStudentSessions(sessions)
        setShowStudentDetail(true)
      } catch (error) {
        console.error('Error loading student sessions:', error)
        toast({
          title: "Error",
          description: "Failed to load student sessions. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const handleViewSessionEmotions = async (session: any) => {
    setIsLoadingEmotions(true)
    try {
      const emotions = await localDataService.getSessionEmotions(session.id)
      setSelectedSession(session)
      setSessionEmotions(emotions)
      setShowSessionDetail(true)
    } catch (error) {
      console.error('Error loading session emotions:', error)
      toast({
        title: "Error",
        description: "Failed to load session emotion data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingEmotions(false)
    }
  }

  if (!therapist || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">Joyverse</h1>
              <Badge variant="secondary" className="text-sm">
                Therapist Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Therapist {therapist.name}</h2>
          <p className="text-gray-600">Monitor your students' progress through educational word games</p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 border-0"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription className="text-sm">ID: {student.id}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{student.totalSessions}</div>
                        <div className="text-xs text-gray-600">Sessions</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{student.averageTime}m</div>
                        <div className="text-xs text-gray-600">Avg Time</div>
                      </div>
                    </div>

                    {/* Recent Emotions */}
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-700">Recent Emotions</div>
                      <div className="flex flex-wrap gap-1">
                        {student.recentEmotions.slice(0, 3).map((emotion, index) => (
                          <Badge key={index} className={`text-xs ${getEmotionColor(emotion)}`}>
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Last Session */}
                    <div className="text-sm text-gray-600">
                      Last session: {new Date(student.lastSession).toLocaleDateString()}
                    </div>

                    {/* View Details Button */}
                    <Button
                      onClick={() => handleViewStudent(student.id)}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold border-2 border-transparent hover:border-purple-300 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-6">
              {recentSessions.map((session) => (
                <Card key={session.id} className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Session {session.sessionNumber} - {session.gameTitle}
                          </h3>
                          <p className="text-sm text-gray-600">{session.studentName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{session.totalTime}m total</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Session Summary */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-600">{session.roundsPlayed || 0}</div>
                            <div className="text-sm text-gray-600">Rounds Played</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">{session.totalSamples || 0}</div>
                            <div className="text-sm text-gray-600">Emotion Samples</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">{session.totalTime}m</div>
                            <div className="text-sm text-gray-600">Duration</div>
                          </div>
                        </div>
                      </div>

                      {/* View Emotions Button */}
                      <div className="flex justify-center">
                        <Button
                          onClick={() => handleViewSessionEmotions(session)}
                          disabled={isLoadingEmotions}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-2"
                        >
                          {isLoadingEmotions ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Loading...
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              View Emotion Details
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {weeklyData.map((day, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{day.sessions.length}</div>
                        <div className="text-xs text-gray-600">Sessions</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{day.totalTime}m</div>
                        <div className="text-xs text-gray-600">Total Time</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Emotions</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(day.emotionSummary).map(([emotion, count]) => (
                          <Badge key={emotion} className={`text-xs ${getEmotionColor(emotion)}`}>
                            {emotion} ({count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Student Detail Modal */}
        {showStudentDetail && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                    <p className="text-purple-100">Student ID: {selectedStudent.id}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowStudentDetail(false)
                      setShowHistory(false)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {!showHistory ? (
                    <>
                      {/* Student Overview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Student Overview</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-600 mb-1">
                                {selectedStudent.totalSessions}
                              </div>
                              <div className="text-sm text-gray-600">Total Sessions</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {selectedStudent.averageTime}m
                              </div>
                              <div className="text-sm text-gray-600">Average Time</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                              <div className="text-sm text-gray-600 mb-2">Recent Emotions</div>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {selectedStudent.recentEmotions.slice(0, 3).map((emotion, index) => (
                                  <Badge key={index} className={`text-xs ${getEmotionColor(emotion)}`}>
                                    {emotion}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Sessions Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5" />
                            <span>Recent Sessions</span>
                          </CardTitle>
                          <CardDescription>Latest gaming sessions overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedStudentSessions.slice(0, 3).map((session) => (
                              <div key={session.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm font-semibold">
                                      Session {session.sessionNumber}
                                    </div>
                                    <span className="font-medium text-gray-800">{session.gameTitle}</span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(session.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">
                                      {session.roundsPlayed || 0} rounds completed
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {session.totalSamples || 0} emotion samples
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() => handleViewSessionEmotions(session)}
                                      disabled={isLoadingEmotions}
                                      size="sm"
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Emotions
                                    </Button>
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{session.totalTime}m total</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* History Button */}
                      <div className="flex justify-center">
                        <Button
                          onClick={() => setShowHistory(true)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          View Complete History
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* History View */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Complete Session History</h3>
                        <Button onClick={() => setShowHistory(false)} variant="outline" size="sm">
                          Back to Overview
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {selectedStudentSessions.map((session) => (
                          <Card key={session.id} className="border-2 border-purple-200">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-lg font-bold">
                                    Session {session.sessionNumber}
                                  </div>
                                  <span className="text-lg font-semibold text-gray-800">{session.gameTitle}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Button
                                    onClick={() => handleViewSessionEmotions(session)}
                                    disabled={isLoadingEmotions}
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    {isLoadingEmotions ? 'Loading...' : 'View Emotions'}
                                  </Button>
                                  <div className="text-sm text-gray-500">
                                    {new Date(session.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                              {/* Session Summary */}
                              <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                                  <div>
                                    <div className="text-lg font-bold text-blue-600">{session.roundsPlayed || 0}</div>
                                    <div className="text-xs text-gray-600">Rounds</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-green-600">{session.totalSamples || 0}</div>
                                    <div className="text-xs text-gray-600">Emotion Samples</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-purple-600">{session.totalTime}m</div>
                                    <div className="text-xs text-gray-600">Duration</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-orange-600">{session.rounds?.length || 0}</div>
                                    <div className="text-xs text-gray-600">Words Completed</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {session.rounds.map((round) => (
                                  <div key={round.roundNumber} className="border rounded-lg p-4 bg-gray-50">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                      <div className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold">
                                        Round {round.roundNumber}
                                      </div>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {round.words && round.words.map((word: any, wordIndex: number) => (
                                        <div
                                          key={wordIndex}
                                          className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                                        >
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-2">
                                                <Target className="h-4 w-4 text-purple-600" />
                                                <span className="font-mono font-bold text-purple-700 text-lg">
                                                  {word.word}
                                                </span>
                                              </div>
                                              <Badge className={`text-xs ${getDifficultyColor(word.difficulty)}`}>
                                                {word.difficulty}
                                              </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <Badge className={`text-xs ${getEmotionColor(word.emotion)}`}>
                                                {word.emotion}
                                              </Badge>
                                              <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3 text-green-600" />
                                                <span className="text-sm font-semibold text-green-700">
                                                  {word.timeSpent}m
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Emotion Detail Modal */}
        {showSessionDetail && selectedSession && sessionEmotions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Session Emotion Analysis</h2>
                    <p className="text-indigo-100">
                      {selectedSession.gameTitle} - {selectedSession.studentName}
                    </p>
                    <p className="text-indigo-100 text-sm">
                      {new Date(selectedSession.timestamp).toLocaleDateString()} - {selectedSession.totalTime}m total
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowSessionDetail(false)
                      setSelectedSession(null)
                      setSessionEmotions(null)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Session Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>Session Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {sessionEmotions.roundsPlayed || 0}
                          </div>
                          <div className="text-sm text-gray-600">Rounds Played</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {sessionEmotions.totalEmotionSamples || 0}
                          </div>
                          <div className="text-sm text-gray-600">Emotion Samples</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {Math.round((sessionEmotions.durationSeconds || 0) / 60)}m
                          </div>
                          <div className="text-sm text-gray-600">Total Duration</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {sessionEmotions.gameName || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-600">Game Type</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emotion Samples */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Emotion Sampling Timeline</span>
                      </CardTitle>
                      <CardDescription>
                        Chronological view of emotions detected during gameplay
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {sessionEmotions.emotionSamples && sessionEmotions.emotionSamples.length > 0 ? (
                        <div className="space-y-3">
                          {sessionEmotions.emotionSamples.map((sample: any, index: number) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-semibold">
                                    Sample {sample.order}
                                  </div>
                                  {sample.word && (
                                    <div className="flex items-center space-x-2">
                                      <Target className="h-4 w-4 text-purple-600" />
                                      <span className="font-mono font-bold text-purple-700 text-lg">
                                        {sample.word}
                                      </span>
                                      {sample.difficulty && (
                                        <Badge className={`text-xs ${getDifficultyColor(sample.difficulty)}`}>
                                          {sample.difficulty}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Badge className={`${getEmotionColor(sample.emotion)}`}>
                                    {sample.emotion}
                                  </Badge>
                                  {sample.confidence && (
                                    <div className="text-sm text-gray-600">
                                      {Math.round(sample.confidence * 100)}% confidence
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-500 mb-2">No emotion samples recorded</div>
                          <div className="text-sm text-gray-400">
                            This session may not have completed emotion detection.
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Emotion Summary */}
                  {sessionEmotions.emotionSamples && sessionEmotions.emotionSamples.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5" />
                          <span>Emotion Summary</span>
                        </CardTitle>
                        <CardDescription>
                          Distribution of emotions detected during this session
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const emotionCounts: { [key: string]: number } = {};
                            sessionEmotions.emotionSamples.forEach((sample: any) => {
                              emotionCounts[sample.emotion] = (emotionCounts[sample.emotion] || 0) + 1;
                            });
                            return Object.entries(emotionCounts).map(([emotion, count]) => (
                              <Badge key={emotion} className={`${getEmotionColor(emotion)} text-sm px-3 py-1`}>
                                {emotion} ({count})
                              </Badge>
                            ));
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
