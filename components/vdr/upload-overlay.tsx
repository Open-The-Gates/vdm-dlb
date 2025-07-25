"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import type { UploadProgress } from "@/types"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadFile } from "@/lib/mock-data"

interface UploadOverlayProps {
  isVisible: boolean
  onClose: () => void
  onUploadComplete: (files: any[]) => void
}

export function UploadOverlay({ isVisible, onClose, onUploadComplete }: UploadOverlayProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newUploads: UploadProgress[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        progress: 0,
        status: "uploading",
      }))

      setUploads((prev) => [...prev, ...newUploads])

      // Simulate upload progress
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const uploadId = newUploads[index].id

        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setUploads((prev) => prev.map((upload) => (upload.id === uploadId ? { ...upload, progress } : upload)))
        }

        try {
          const uploadedFile = await uploadFile(file)
          setUploads((prev) =>
            prev.map((upload) => (upload.id === uploadId ? { ...upload, status: "completed" as const } : upload)),
          )
          return uploadedFile
        } catch (error) {
          setUploads((prev) =>
            prev.map((upload) => (upload.id === uploadId ? { ...upload, status: "error" as const } : upload)),
          )
          throw error
        }
      })

      try {
        const uploadedFiles = await Promise.all(uploadPromises)
        onUploadComplete(uploadedFiles)
      } catch (error) {
        console.error("Upload failed:", error)
      }
    },
    [onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  const clearCompleted = () => {
    setUploads((prev) => prev.filter((upload) => upload.status === "uploading"))
  }

  const hasActiveUploads = uploads.some((upload) => upload.status === "uploading")

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={hasActiveUploads}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag files here or click to browse</p>
                <p className="text-sm text-muted-foreground">Support for multiple files. Maximum 100MB per file.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="border-t">
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Upload Progress</h3>
                {uploads.some((u) => u.status === "completed") && (
                  <Button variant="outline" size="sm" onClick={clearCompleted}>
                    Clear Completed
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {uploads.map((upload) => (
                  <div key={upload.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{upload.name}</span>
                      <div className="flex items-center space-x-2">
                        {upload.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {upload.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <span className="text-muted-foreground">{upload.progress}%</span>
                      </div>
                    </div>
                    <Progress
                      value={upload.progress}
                      className={cn(
                        "h-2",
                        upload.status === "error" && "bg-red-100",
                        upload.status === "completed" && "bg-green-100",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
