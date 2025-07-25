"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react"
import type { FileItem } from "@/types"
import { cn } from "@/lib/utils"

interface FileTreeProps {
  files: FileItem[]
  currentPath: string
  onNavigate: (path: string) => void
}

interface TreeNodeProps {
  item: FileItem
  level: number
  isExpanded: boolean
  onToggle: () => void
  onNavigate: (path: string) => void
  isActive: boolean
}

function TreeNode({ item, level, isExpanded, onToggle, onNavigate, isActive }: TreeNodeProps) {
  if (item.type !== "folder") return null

  return (
    <div>
      <button
        onClick={() => {
          onToggle()
          onNavigate(item.path)
        }}
        className={cn(
          "flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          "group",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
        )}
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
        ) : (
          <Folder className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
        )}
        <span className="truncate">{item.name}</span>
      </button>
    </div>
  )
}

export function FileTree({ files, currentPath, onNavigate }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const buildTree = (parentId?: string, level = 0): React.ReactNode[] => {
    return files
      .filter((file) => file.parentId === parentId && file.type === "folder")
      .map((folder) => {
        const isExpanded = expandedFolders.has(folder.id)
        const isActive = currentPath === folder.path

        return (
          <div key={folder.id}>
            <TreeNode
              item={folder}
              level={level}
              isExpanded={isExpanded}
              onToggle={() => toggleFolder(folder.id)}
              onNavigate={onNavigate}
              isActive={isActive}
            />
            {isExpanded && <div>{buildTree(folder.id, level + 1)}</div>}
          </div>
        )
      })
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => onNavigate("/")}
        className={cn(
          "flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
          currentPath === "/" && "bg-sidebar-accent text-sidebar-accent-foreground",
        )}
      >
        <FolderOpen className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
        <span>Home</span>
      </button>
      {buildTree()}
    </div>
  )
}
