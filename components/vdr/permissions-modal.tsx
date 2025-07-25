"use client"

import { useState } from "react"
import type { FileItem, User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X, Plus, Search } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

interface PermissionsModalProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
}

interface Collaborator extends User {
  role: "owner" | "editor" | "viewer" | "download-only"
}

export function PermissionsModal({ file, isOpen, onClose }: PermissionsModalProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { ...mockUsers[0], role: "owner" },
    { ...mockUsers[1], role: "editor" },
    { ...mockUsers[2], role: "viewer" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [settings, setSettings] = useState({
    allowDownloads: true,
    watermarkPreviews: false,
    expirationDate: null as Date | null,
  })

  const availableUsers = mockUsers.filter(
    (user) =>
      !collaborators.some((collab) => collab.id === user.id) &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addCollaborator = (user: User, role: "editor" | "viewer" | "download-only" = "viewer") => {
    setCollaborators((prev) => [...prev, { ...user, role }])
    setSearchQuery("")
  }

  const updateRole = (userId: string, newRole: "owner" | "editor" | "viewer" | "download-only") => {
    setCollaborators((prev) => prev.map((collab) => (collab.id === userId ? { ...collab, role: newRole } : collab)))
  }

  const removeCollaborator = (userId: string) => {
    setCollaborators((prev) => prev.filter((collab) => collab.id !== userId))
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      case "download-only":
        return "outline"
      default:
        return "outline"
    }
  }

  if (!file) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Share "{file.name}"</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Current Collaborators */}
          <div>
            <h3 className="font-medium mb-4">People with access</h3>
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {collaborator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{collaborator.name}</p>
                      <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleBadgeVariant(collaborator.role)}>{collaborator.role}</Badge>
                    {collaborator.role !== "owner" && (
                      <Select
                        value={collaborator.role}
                        onValueChange={(value: any) => updateRole(collaborator.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="download-only">Download Only</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {collaborator.role !== "owner" && (
                      <Button variant="ghost" size="sm" onClick={() => removeCollaborator(collaborator.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add People */}
          <div>
            <h3 className="font-medium mb-4">Add people</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && availableUsers.length > 0 && (
              <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => addCollaborator(user)}
                    className="flex items-center w-full p-3 hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Plus className="h-4 w-4 ml-auto" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Permission Settings */}
          <div>
            <h3 className="font-medium mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-downloads">Allow downloads</Label>
                  <p className="text-sm text-muted-foreground">Let people download this file</p>
                </div>
                <Switch
                  id="allow-downloads"
                  checked={settings.allowDownloads}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allowDownloads: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="watermark-previews">Watermark previews</Label>
                  <p className="text-sm text-muted-foreground">Add watermarks to preview images</p>
                </div>
                <Switch
                  id="watermark-previews"
                  checked={settings.watermarkPreviews}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, watermarkPreviews: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Expiration date</Label>
                  <p className="text-sm text-muted-foreground">Automatically revoke access after this date</p>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40 bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {settings.expirationDate ? formatDate(settings.expirationDate) : "No expiration"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={settings.expirationDate || undefined}
                      onSelect={(date) => setSettings((prev) => ({ ...prev, expirationDate: date || null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
