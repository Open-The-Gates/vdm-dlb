"use client"

import { useState, useEffect } from "react"
import type { FileItem, ActivityEvent } from "@/types"
import { formatFileSize, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Download, Share, Edit, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight, Save } from "lucide-react"
import { fetchPreview, mockActivity } from "@/lib/mock-data"

interface PreviewDrawerProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
  onShare: (file: FileItem) => void
}

function PDFViewer({ fileId }: { fileId: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(5) // Mock
  const [zoom, setZoom] = useState(100)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    fetchPreview(fileId).then(setPreviewUrl)
  }, [fileId])

  return (
    <div className="space-y-4">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="border rounded-lg overflow-hidden bg-white">
        {previewUrl && (
          <img
            src={previewUrl || "/placeholder.svg"}
            alt={`Page ${currentPage}`}
            className="w-full h-auto"
            style={{ transform: `scale(${zoom / 100})` }}
          />
        )}
      </div>
    </div>
  )
}

function ExcelViewer({ fileId }: { fileId: string }) {
  const [activeSheet, setActiveSheet] = useState(0)
  const sheets = ["Sheet1", "Sheet2", "Sheet3"] // Mock

  // Mock Excel data
  const data = [
    ["Name", "Q1", "Q2", "Q3", "Q4", "Total"],
    ["Product A", "$10,000", "$12,000", "$15,000", "$18,000", "$55,000"],
    ["Product B", "$8,000", "$9,500", "$11,000", "$13,500", "$42,000"],
    ["Product C", "$15,000", "$16,500", "$18,000", "$20,000", "$69,500"],
    ["Total", "$33,000", "$38,000", "$44,000", "$51,500", "$166,500"],
  ]

  return (
    <div className="space-y-4">
      {/* Sheet Tabs */}
      <div className="flex space-x-1 border-b">
        {sheets.map((sheet, index) => (
          <button
            key={sheet}
            onClick={() => setActiveSheet(index)}
            className={`px-3 py-2 text-sm rounded-t-lg transition-colors ${
              activeSheet === index ? "bg-background border-t border-l border-r" : "hover:bg-muted"
            }`}
          >
            {sheet}
          </button>
        ))}
      </div>

      {/* Excel Table */}
      <div className="border rounded-lg overflow-auto">
        <table className="w-full text-sm">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? "bg-muted font-medium" : ""}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-r border-b p-2 min-w-[100px]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ActivityFeed({ activities }: { activities: ActivityEvent[] }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Recent Activity</h4>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex space-x-3">
            <img
              src={activity.user.avatar || "/placeholder.svg"}
              alt={activity.user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span> {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PreviewDrawer({ file, isOpen, onClose, onShare }: PreviewDrawerProps) {
  const [description, setDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  useEffect(() => {
    if (file) {
      setDescription(file.description || "")
    }
  }, [file])

  if (!file) return null

  const renderPreview = () => {
    if (file.mimeType?.includes("pdf")) {
      return <PDFViewer fileId={file.id} />
    }

    if (file.mimeType?.includes("spreadsheet") || file.mimeType?.includes("excel")) {
      return <ExcelViewer fileId={file.id} />
    }

    if (file.mimeType?.includes("image") && file.thumbnailUrl) {
      return (
        <div className="border rounded-lg overflow-hidden">
          <img src={file.thumbnailUrl || "/placeholder.svg"} alt={file.name} className="w-full h-auto" />
        </div>
      )
    }

    return (
      <div className="border rounded-lg p-12 text-center">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-muted-foreground">No preview available</p>
        <p className="text-sm text-muted-foreground mt-2">{file.mimeType || "Unknown file type"}</p>
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-none p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="truncate">{file.name}</SheetTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => onShare(file)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Preview */}
              <div>
                <h3 className="font-medium mb-4">Preview</h3>
                {renderPreview()}
              </div>

              <Separator />

              {/* Metadata */}
              <div>
                <h3 className="font-medium mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{file.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{file.mimeType || "Folder"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{file.size ? formatFileSize(file.size) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Owner</p>
                    <p className="font-medium">{file.owner}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(file.lastModified)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Modified</p>
                    <p className="font-medium">{formatDate(file.lastModified)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Path</p>
                    <p className="font-medium text-xs">{file.path}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Version</p>
                    <p className="font-medium">v{file.version || 1}</p>
                  </div>
                </div>

                {/* Tags */}
                {file.tags && file.tags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-muted-foreground text-sm mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {file.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-sm">Description</p>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingDescription(!isEditingDescription)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  {isEditingDescription ? (
                    <div className="space-y-2">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a description..."
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => setIsEditingDescription(false)}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDescription(file.description || "")
                            setIsEditingDescription(false)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{description || "No description available"}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Activity Feed */}
              <ActivityFeed activities={mockActivity} />
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
