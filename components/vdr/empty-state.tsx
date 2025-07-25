"use client"

import { Button } from "@/components/ui/button"
import { Upload, FolderPlus } from "lucide-react"

interface EmptyStateProps {
  onUpload: () => void
  onNewFolder: () => void
}

export function EmptyState({ onUpload, onNewFolder }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="w-32 h-32 mb-6 opacity-50">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          <rect x="40" y="60" width="120" height="80" rx="8" fill="url(#emptyGradient)" />
          <rect x="60" y="40" width="80" height="60" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="80" cy="60" r="8" fill="#e2e8f0" />
          <rect x="95" y="75" width="30" height="4" rx="2" fill="#e2e8f0" />
          <rect x="95" y="85" width="20" height="4" rx="2" fill="#e2e8f0" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold mb-2">This folder is empty</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Get started by uploading files or creating a new folder. You can also drag and drop files anywhere to upload
        them.
      </p>

      <div className="flex space-x-3">
        <Button onClick={onUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
        <Button variant="outline" onClick={onNewFolder} className="gap-2 bg-transparent">
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </div>
    </div>
  )
}
