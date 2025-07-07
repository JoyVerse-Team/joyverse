"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Clock, CheckCircle, XCircle } from "lucide-react"

interface Therapist {
  id: string
  fullName: string
  email: string
  status: "pending" | "approved" | "rejected"
  requestDate: string
}

const mockTherapists: Therapist[] = [
  {
    id: "1",
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    status: "pending",
    requestDate: "2024-01-15",
  },
  {
    id: "2",
    fullName: "Dr. Michael Chen",
    email: "michael.chen@email.com",
    status: "pending",
    requestDate: "2024-01-14",
  },
  {
    id: "3",
    fullName: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    status: "approved",
    requestDate: "2024-01-10",
  },
  {
    id: "4",
    fullName: "Dr. James Wilson",
    email: "james.wilson@email.com",
    status: "approved",
    requestDate: "2024-01-08",
  },
  {
    id: "5",
    fullName: "Dr. Lisa Thompson",
    email: "lisa.thompson@email.com",
    status: "rejected",
    requestDate: "2024-01-12",
  },
  {
    id: "6",
    fullName: "Dr. David Brown",
    email: "david.brown@email.com",
    status: "pending",
    requestDate: "2024-01-16",
  },
]

export default function SuperadminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists)
  const [activeTab, setActiveTab] = useState("pending")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple mock authentication
    if (email && password) {
      setIsLoggedIn(true)
    }
  }

  const handleApprove = (therapistId: string) => {
    setTherapists((prev) =>
      prev.map((therapist) =>
        therapist.id === therapistId ? { ...therapist, status: "approved" as const } : therapist,
      ),
    )
  }

  const handleReject = (therapistId: string) => {
    setTherapists((prev) =>
      prev.map((therapist) =>
        therapist.id === therapistId ? { ...therapist, status: "rejected" as const } : therapist,
      ),
    )
  }

  const pendingTherapists = therapists.filter((t) => t.status === "pending")
  const approvedTherapists = therapists.filter((t) => t.status === "approved")
  const rejectedTherapists = therapists.filter((t) => t.status === "rejected")

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
              <Button type="submit" className="w-full">
                Sign In
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
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
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
              <div className="text-2xl font-bold text-orange-600">{pendingTherapists.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Approved Therapists</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedTherapists.length}</div>
              <p className="text-xs text-muted-foreground">Active therapists</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Therapists</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{therapists.length}</div>
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
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(therapist.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
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
