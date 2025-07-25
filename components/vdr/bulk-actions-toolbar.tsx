"use client"

import type { FileItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Share, Trash2, Edit, Move, X } from "lucide-react"

interface BulkActionsToolbarProps {
  selectedFiles: Set<string>
  files: FileItem[]
  onClearSelection: () => void
  onDownload: (fileIds: string[]) => void
  onShare: (fileIds: string[]) => void
  onMove: (fileIds: string[]) => void
  onRename: (fileIds: string[]) => void
  onDelete: (fileIds: string[]) => void
}

export function BulkActionsToolbar({
  selectedFiles,
  files,
  onClearSelection,
  onDownload,
  onShare,
  onMove,
  onRename,
  onDelete,
}: BulkActionsToolbarProps) {
  if (selectedFiles.size === 0) return null

  const selectedFileIds = Array.from(selectedFiles)
  const selectedCount = selectedFiles.size

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-card border rounded-2xl shadow-2xl p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
            </span>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onDownload(selectedFileIds)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => onShare(selectedFileIds)}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => onMove(selectedFileIds)}>
              <Move className="h-4 w-4 mr-2" />
              Move
            </Button>
            {selectedCount === 1 && (
              <Button variant="outline" size="sm" onClick={() => onRename(selectedFileIds)}>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(selectedFileIds)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
