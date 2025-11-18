import { useState, useCallback } from 'react'

export const useConfirm = () => {
  const [confirm, setConfirm] = useState(null)

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirm({
        ...options,
        onConfirm: () => {
          setConfirm(null)
          resolve(true)
        },
        onCancel: () => {
          setConfirm(null)
          resolve(false)
        }
      })
    })
  })

  return {
    confirm,
    showConfirm
  }
}

