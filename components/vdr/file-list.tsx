"use client"

import type React from "react"
import type { FileItem, SortField, SortOrder } from "@/types"
import { formatFileSize, formatDate, getFileIcon, cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Share, Trash2, Edit, Lock, Globe, Users } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FileListProps {
  files: FileItem[]
  selectedFiles: Set<string>
  onFileSelect: (fileId: string, selected: boolean) => void
  onFileClick: (file: FileItem) => void
  onFileDoubleClick: (file: FileItem) => void
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

function SortButton({
  field,
  currentField,
  currentOrder,
  onSort,
  children,
}: {
  field: SortField
  currentField: SortField
  currentOrder: SortOrder
  onSort: (field: SortField) => void
  children: React.ReactNode
}) {
  const isActive = field === currentField

  return (
    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium justify-start" onClick={() => onSort(field)}>
      {children}
      {isActive ? (
        currentOrder === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  )
}

function FileRow({
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
        return <Lock className="h-4 w-4 text-red-500" />
      case "shared":
        return <Users className="h-4 w-4 text-blue-500" />
      case "public":
        return <Globe className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow
          className={cn("cursor-pointer hover:bg-muted/50", isSelected && "bg-muted")}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
        >
          <TableCell className="w-12">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} onClick={(e) => e.stopPropagation()} />
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{file.type === "folder" ? "📁" : getFileIcon(file.mimeType)}</div>
              <div>
                <p className="font-medium">{file.name}</p>
                {file.tags && file.tags.length > 0 && (
                  <div className="flex space-x-1 mt-1">
                    {file.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TableCell>
          <TableCell>{file.size ? formatFileSize(file.size) : "—"}</TableCell>
          <TableCell>{formatDate(file.lastModified)}</TableCell>
          <TableCell>{file.owner}</TableCell>
          <TableCell>
            <div className="flex items-center">{getPermissionIcon()}</div>
          </TableCell>
        </TableRow>
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

export function FileList({
  files,
  selectedFiles,
  onFileSelect,
  onFileClick,
  onFileDoubleClick,
  sortField,
  sortOrder,
  onSort,
}: FileListProps) {
  return (
    <div className="rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedFiles.size > 0 && selectedFiles.size === files.length}
                indeterminate={selectedFiles.size > 0 && selectedFiles.size < files.length}
                onCheckedChange={(checked) => {
                  files.forEach((file) => {
                    onFileSelect(file.id, !!checked)
                  })
                }}
              />
            </TableHead>
            <TableHead>
              <SortButton field="name" currentField={sortField} currentOrder={sortOrder} onSort={onSort}>
                Name
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="size" currentField={sortField} currentOrder={sortOrder} onSort={onSort}>
                Size
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="lastModified" currentField={sortField} currentOrder={sortOrder} onSort={onSort}>
                Last Modified
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="owner" currentField={sortField} currentOrder={sortOrder} onSort={onSort}>
                Owner
              </SortButton>
            </TableHead>
            <TableHead>Permissions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              isSelected={selectedFiles.has(file.id)}
              onSelect={(selected) => onFileSelect(file.id, selected)}
              onClick={() => onFileClick(file)}
              onDoubleClick={() => onFileDoubleClick(file)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
