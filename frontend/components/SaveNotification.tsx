import { useState, useEffect } from 'react'
import { Check, AlertCircle, Save } from 'lucide-react'

interface SaveNotificationProps {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
  onClose: () => void
}

export function SaveNotification({ message, type, show, onClose }: SaveNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000) // Auto-hide after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const icons = {
    success: <Check className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Save className="w-5 h-5 text-blue-500" />
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border backdrop-blur-sm ${bgColors[type]}`}>
        {icons[type]}
        <span className="text-sm font-medium text-gray-700">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}
