export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: number
  lastModified: Date
  owner: string
  permissions: "private" | "shared" | "public"
  mimeType?: string
  thumbnailUrl?: string
  path: string
  version?: number
  tags?: string[]
  description?: string
  parentId?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

export interface Permission {
  userId: string
  role: "owner" | "editor" | "viewer" | "download-only"
}

export interface ActivityEvent {
  id: string
  type: "upload" | "comment" | "permission_change" | "download" | "rename"
  user: User
  timestamp: Date
  description: string
}

export interface UploadProgress {
  id: string
  name: string
  progress: number
  status: "uploading" | "completed" | "error"
}

export type ViewMode = "grid" | "list"
export type SortField = "name" | "size" | "lastModified" | "owner"
export type SortOrder = "asc" | "desc"
