"use client"
import React from "react"

export default function TestPage() {
  console.log('🧪 Test page rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-lg">If you can see this, the basic page structure works!</p>
      </div>
    </div>
  )
}
