"use client"
import type { FileItem } from "@/types"
import { formatFileSize, formatDate, getFileIcon, cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Download, Share, Trash2, Edit, Lock, Globe, Users } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"

interface FileGridProps {
  files: FileItem[]
  selectedFiles: Set<string>
  onFileSelect: (fileId: string, selected: boolean) => void
  onFileClick: (file: FileItem) => void
  onFileDoubleClick: (file: FileItem) => void
}

function FileCard({
  file,
  isSelected,
  onSelect,
  onClick,
  onDoubleClick,
}: {
  file: FileItem
  isSelected: boolean
  onSelect: (selected: boolean) => void
  onClick: () => void
  onDoubleClick: () => void
}) {
  const getPermissionIcon = () => {
    switch (file.permissions) {
      case "private":
        return <Lock className="h-3 w-3 text-red-500" />
      case "shared":
        return <Users className="h-3 w-3 text-blue-500" />
      case "public":
        return <Globe className="h-3 w-3 text-green-500" />
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "group relative p-4 rounded-2xl border bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer",
            isSelected && "ring-2 ring-primary bg-accent",
          )}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          {/* Selection checkbox */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} onClick={(e) => e.stopPropagation()} />
          </div>

          {/* Permission indicator */}
          <div className="absolute top-2 right-2">{getPermissionIcon()}</div>

          {/* File preview/icon */}
          <div className="flex flex-col items-center space-y-3">
            {file.type === "folder" ? (
              <div className="w-16 h-16 flex items-center justify-center text-4xl">📁</div>
            ) : file.thumbnailUrl ? (
              <img
                src={file.thumbnailUrl || "/placeholder.svg"}
                alt={file.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center text-4xl">{getFileIcon(file.mimeType)}</div>
            )}

            {/* File info */}
            <div className="text-center space-y-1 w-full">
              <p className="font-medium text-sm truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                {file.size && <span>{formatFileSize(file.size)}</span>}
                <span>•</span>
                <span>{formatDate(file.lastModified)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{file.owner}</p>
            </div>

            {/* Tags */}
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {file.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {file.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{file.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Download className="h-4 w-4 mr-2" />
          Download
        </ContextMenuItem>
        <ContextMenuItem>
          <Share className="h-4 w-4 mr-2" />
          Share
        </ContextMenuItem>
        <ContextMenuItem>
          <Edit className="h-4 w-4 mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function FileGrid({ files, selectedFiles, onFileSelect, onFileClick, onFileDoubleClick }: FileGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={selectedFiles.has(file.id)}
          onSelect={(selected) => onFileSelect(file.id, selected)}
          onClick={() => onFileClick(file)}
          onDoubleClick={() => onFileDoubleClick(file)}
        />
      ))}
    </div>
  )
}
