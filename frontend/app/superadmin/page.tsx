"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { adminAPI } from "@/lib/admin-api"

interface Therapist {
  id: string
  fullName: string
  email: string
  status: "pending" | "approved" | "rejected"
  requestDate: string
  organization?: string
  license?: string
  experience?: string
  bio?: string
}

interface DashboardStats {
  totalTherapists: number
  pendingTherapists: number
  approvedTherapists: number
  rejectedTherapists: number
}

export default function SuperadminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalTherapists: 0,
    pendingTherapists: 0,
    approvedTherapists: 0,
    rejectedTherapists: 0
  })
  const [activeTab, setActiveTab] = useState("pending")
  const [loginError, setLoginError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchTherapists()
      fetchDashboardStats()
    }
  }, [isLoggedIn])

  const checkAuthStatus = async () => {
    try {
      const response = await adminAPI.verifyToken()
      if (response.success) {
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTherapists = async () => {
    try {
      const response = await adminAPI.getTherapists()
      if (response.success) {
        setTherapists(response.therapists)
      }
    } catch (error) {
      console.error('Failed to fetch therapists:', error)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      if (response.success) {
        setStats(response.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setActionLoading("login")

    try {
      const response = await adminAPI.login(email, password)
      if (response.success) {
        setIsLoggedIn(true)
        setEmail("")
        setPassword("")
      } else {
        setLoginError(response.message || "Login failed")
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
      console.error('Login error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = async () => {
    await adminAPI.logout()
    setIsLoggedIn(false)
    setTherapists([])
    setStats({
      totalTherapists: 0,
      pendingTherapists: 0,
      approvedTherapists: 0,
      rejectedTherapists: 0
    })
  }

  const handleApprove = async (therapistId: string) => {
    setActionLoading(therapistId)
    try {
      const response = await adminAPI.approveTherapist(therapistId)
      if (response.success) {
        await fetchTherapists()
        await fetchDashboardStats()
      } else {
        alert(response.message || "Failed to approve therapist")
      }
    } catch (error) {
      alert("Failed to approve therapist")
      console.error('Approve error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (therapistId: string) => {
    setActionLoading(therapistId)
    try {
      const response = await adminAPI.rejectTherapist(therapistId)
      if (response.success) {
        await fetchTherapists()
        await fetchDashboardStats()
      } else {
        alert(response.message || "Failed to reject therapist")
      }
    } catch (error) {
      alert("Failed to reject therapist")
      console.error('Reject error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingTherapists = therapists.filter((t) => t.status === "pending")
  const approvedTherapists = therapists.filter((t) => t.status === "approved")
  const rejectedTherapists = therapists.filter((t) => t.status === "rejected")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-600">Joyverse</CardTitle>
            <CardDescription>Superadmin Dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@joyverse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {loginError}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={actionLoading === "login"}
              >
                {actionLoading === "login" ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Joyverse</h1>
              <span className="ml-2 text-sm text-gray-500">Superadmin Dashboard</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingTherapists}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Approved Therapists</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedTherapists}</div>
              <p className="text-xs text-muted-foreground">Active therapists</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Therapists</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalTherapists}</div>
              <p className="text-xs text-muted-foreground">All registered therapists</p>
            </CardContent>
          </Card>
        </div>

        {/* Therapist Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Therapist Management</CardTitle>
            <CardDescription>Manage therapist access requests and approvals</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending Approval ({pendingTherapists.length})</TabsTrigger>
                <TabsTrigger value="approved">
                  Approved Therapists ({approvedTherapists.length + rejectedTherapists.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                <div className="space-y-4">
                  {pendingTherapists.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No pending requests at the moment</div>
                  ) : (
                    pendingTherapists.map((therapist) => (
                      <Card key={therapist.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{therapist.fullName}</h3>
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{therapist.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Requested: {new Date(therapist.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(therapist.id)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={actionLoading === therapist.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {actionLoading === therapist.id ? "Processing..." : "Approve"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleReject(therapist.id)}
                              disabled={actionLoading === therapist.id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              {actionLoading === therapist.id ? "Processing..." : "Reject"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved" className="mt-6">
                <div className="space-y-4">
                  {[...approvedTherapists, ...rejectedTherapists].length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No processed requests yet</div>
                  ) : (
                    [...approvedTherapists, ...rejectedTherapists]
                      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
                      .map((therapist) => (
                        <Card key={therapist.id} className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{therapist.fullName}</h3>
                                <Badge
                                  variant={therapist.status === "approved" ? "default" : "destructive"}
                                  className={
                                    therapist.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {therapist.status === "approved" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {therapist.status === "approved" ? "Approved" : "Rejected"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{therapist.email}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Requested: {new Date(therapist.requestDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
