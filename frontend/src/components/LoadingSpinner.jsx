import React from 'react'

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      <span className="sr-only">{message}</span>
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  )
}