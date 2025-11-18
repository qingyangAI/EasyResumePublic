import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type, duration })
  })

  const hideToast = useCallback(() => {
    setToast(null)
  })

  const success = useCallback((message, duration) => {
    showToast(message, 'success', duration)
  })

  const showError = useCallback((message, duration) => {
    showToast(message, 'error', duration)
  })

  const warning = useCallback((message, duration) => {
    showToast(message, 'warning', duration)
  })

  const info = useCallback((message, duration) => {
    showToast(message, 'info', duration)
  })

  return {
    toast,
    showToast,
    hideToast,
    success,
    error: showError,
    warning,
    info
  }
}

