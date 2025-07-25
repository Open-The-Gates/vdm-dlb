"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  onNewFolder?: () => void
  onUpload?: () => void
  onSearch?: () => void
}

export function useKeyboardShortcuts({ onNewFolder, onUpload, onSearch }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey

      if (event.key === "n" && !isCtrlOrCmd) {
        event.preventDefault()
        onNewFolder?.()
      } else if (event.key === "u" && !isCtrlOrCmd) {
        event.preventDefault()
        onUpload?.()
      } else if (event.key === "f" && isCtrlOrCmd) {
        event.preventDefault()
        onSearch?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onNewFolder, onUpload, onSearch])
}
