"use client"

import { useState } from "react"
import type { FileItem, ViewMode, SortField, SortOrder } from "@/types"
import { mockFiles } from "@/lib/mock-data"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

// Components
import { FileTree } from "./file-tree"
import { Header } from "./header"
import { FileGrid } from "./file-grid"
import { FileList } from "./file-list"
import { UploadOverlay } from "./upload-overlay"
import { PreviewDrawer } from "./preview-drawer"
import { PermissionsModal } from "./permissions-modal"
import { BulkActionsToolbar } from "./bulk-actions-toolbar"
import { EmptyState } from "./empty-state"

// UI Components
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Grid, List, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function VirtualDataRoom() {
  // State
  const [files, setFiles] = useState<FileItem[]>(mockFiles)
  const [currentPath, setCurrentPath] = useState("/")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("lastModified")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Modals and overlays
  const [showUploadOverlay, setShowUploadOverlay] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [permissionsFile, setPermissionsFile] = useState<FileItem | null>(null)

  const { theme, setTheme } = useTheme()

  // Filter and sort files
  const filteredFiles = files.filter((file) => {
    // Filter by current path
    const isInCurrentPath = currentPath === "/" ? !file.parentId : file.parentId === getCurrentFolderId()

    // Filter by search query
    const matchesSearch = !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase())

    return isInCurrentPath && matchesSearch
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === "lastModified") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (sortField === "size") {
      aValue = aValue || 0
      bValue = bValue || 0
    } else {
      aValue = String(aValue).toLowerCase()
      bValue = String(bValue).toLowerCase()
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  function getCurrentFolderId(): string | undefined {
    if (currentPath === "/") return undefined
    const folder = files.find((f) => f.path === currentPath && f.type === "folder")
    return folder?.id
  }

  // Handlers
  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    setSelectedFiles(new Set())
  }

  const handleFileSelect = (fileId: string, selected: boolean) => {
    const newSelection = new Set(selectedFiles)
    if (selected) {
      newSelection.add(fileId)
    } else {
      newSelection.delete(fileId)
    }
    setSelectedFiles(newSelection)
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === "folder") {
      handleNavigate(file.path)
    } else {
      setPreviewFile(file)
    }
  }

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === "folder") {
      handleNavigate(file.path)
    }
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleUpload = () => {
    setShowUploadOverlay(true)
  }

  const handleNewFolder = () => {
    const folderName = prompt("Enter folder name:")
    if (folderName) {
      const newFolder: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: folderName,
        type: "folder",
        lastModified: new Date(),
        owner: "Current User",
        permissions: "private",
        path: currentPath === "/" ? `/${folderName}` : `${currentPath}/${folderName}`,
        parentId: getCurrentFolderId(),
      }
      setFiles((prev) => [...prev, newFolder])
    }
  }

  const handleUploadComplete = (uploadedFiles: FileItem[]) => {
    const filesWithPath = uploadedFiles.map((file) => ({
      ...file,
      path: currentPath === "/" ? `/${file.name}` : `${currentPath}/${file.name}`,
      parentId: getCurrentFolderId(),
    }))
    setFiles((prev) => [...prev, ...filesWithPath])
    setShowUploadOverlay(false)
  }

  const handleShare = (file: FileItem) => {
    setPermissionsFile(file)
  }

  // Bulk actions
  const handleBulkDownload = (fileIds: string[]) => {
    console.log("Bulk download:", fileIds)
  }

  const handleBulkShare = (fileIds: string[]) => {
    console.log("Bulk share:", fileIds)
  }

  const handleBulkMove = (fileIds: string[]) => {
    console.log("Bulk move:", fileIds)
  }

  const handleBulkRename = (fileIds: string[]) => {
    console.log("Bulk rename:", fileIds)
  }

  const handleBulkDelete = (fileIds: string[]) => {
    if (confirm(`Delete ${fileIds.length} item(s)?`)) {
      setFiles((prev) => prev.filter((file) => !fileIds.includes(file.id)))
      setSelectedFiles(new Set())
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewFolder: handleNewFolder,
    onUpload: handleUpload,
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
      searchInput?.focus()
    },
  })

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Data Room</h2>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <FileTree files={files} currentPath={currentPath} onNavigate={handleNavigate} />
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <Header
            currentPath={currentPath}
            onNavigate={handleNavigate}
            onUpload={handleUpload}
            onNewFolder={handleNewFolder}
            onSettings={() => console.log("Settings")}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* View Controls */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground">
                {sortedFiles.length} item{sortedFiles.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle pressed={viewMode === "grid"} onPressedChange={() => setViewMode("grid")} aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </Toggle>
              <Toggle pressed={viewMode === "list"} onPressedChange={() => setViewMode("list")} aria-label="List view">
                <List className="h-4 w-4" />
              </Toggle>
            </div>
          </div>

          {/* File Content */}
          <div className="flex-1 overflow-auto">
            {sortedFiles.length === 0 ? (
              <EmptyState onUpload={handleUpload} onNewFolder={handleNewFolder} />
            ) : viewMode === "grid" ? (
              <FileGrid
                files={sortedFiles}
                selectedFiles={selectedFiles}
                onFileSelect={handleFileSelect}
                onFileClick={handleFileClick}
                onFileDoubleClick={handleFileDoubleClick}
              />
            ) : (
              <div className="p-4">
                <FileList
                  files={sortedFiles}
                  selectedFiles={selectedFiles}
                  onFileSelect={handleFileSelect}
                  onFileClick={handleFileClick}
                  onFileDoubleClick={handleFileDoubleClick}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </div>
            )}
          </div>
        </SidebarInset>

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedFiles={selectedFiles}
          files={files}
          onClearSelection={() => setSelectedFiles(new Set())}
          onDownload={handleBulkDownload}
          onShare={handleBulkShare}
          onMove={handleBulkMove}
          onRename={handleBulkRename}
          onDelete={handleBulkDelete}
        />

        {/* Upload Overlay */}
        <UploadOverlay
          isVisible={showUploadOverlay}
          onClose={() => setShowUploadOverlay(false)}
          onUploadComplete={handleUploadComplete}
        />

        {/* Preview Drawer */}
        <PreviewDrawer
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          onShare={handleShare}
        />

        {/* Permissions Modal */}
        <PermissionsModal file={permissionsFile} isOpen={!!permissionsFile} onClose={() => setPermissionsFile(null)} />
      </div>
    </SidebarProvider>
  )
}
