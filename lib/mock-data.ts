import type { FileItem, User, ActivityEvent } from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Financial Reports",
    type: "folder",
    lastModified: new Date("2024-01-15"),
    owner: "John Doe",
    permissions: "shared",
    path: "/Financial Reports",
    parentId: undefined,
  },
  {
    id: "2",
    name: "Legal Documents",
    type: "folder",
    lastModified: new Date("2024-01-10"),
    owner: "Jane Smith",
    permissions: "private",
    path: "/Legal Documents",
    parentId: undefined,
  },
  {
    id: "3",
    name: "Q4_2023_Report.pdf",
    type: "file",
    size: 2048576,
    lastModified: new Date("2024-01-14"),
    owner: "John Doe",
    permissions: "shared",
    mimeType: "application/pdf",
    path: "/Financial Reports/Q4_2023_Report.pdf",
    parentId: "1",
    version: 3,
    tags: ["quarterly", "financial"],
    description: "Q4 2023 financial performance report",
  },
  {
    id: "4",
    name: "Budget_Analysis.xlsx",
    type: "file",
    size: 1024000,
    lastModified: new Date("2024-01-12"),
    owner: "Jane Smith",
    permissions: "shared",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    path: "/Financial Reports/Budget_Analysis.xlsx",
    parentId: "1",
    version: 1,
    tags: ["budget", "analysis"],
  },
  {
    id: "5",
    name: "Company_Logo.png",
    type: "file",
    size: 512000,
    lastModified: new Date("2024-01-08"),
    owner: "Mike Johnson",
    permissions: "public",
    mimeType: "image/png",
    thumbnailUrl: "/placeholder.svg?height=200&width=200",
    path: "/Company_Logo.png",
    parentId: undefined,
    version: 2,
  },
  {
    id: "6",
    name: "Contract_Template.docx",
    type: "file",
    size: 256000,
    lastModified: new Date("2024-01-05"),
    owner: "Jane Smith",
    permissions: "private",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    path: "/Legal Documents/Contract_Template.docx",
    parentId: "2",
    version: 1,
  },
]

export const mockActivity: ActivityEvent[] = [
  {
    id: "1",
    type: "upload",
    user: mockUsers[0],
    timestamp: new Date("2024-01-15T10:30:00"),
    description: "Uploaded Q4_2023_Report.pdf",
  },
  {
    id: "2",
    type: "permission_change",
    user: mockUsers[1],
    timestamp: new Date("2024-01-14T15:45:00"),
    description: "Changed permissions to shared",
  },
  {
    id: "3",
    type: "comment",
    user: mockUsers[2],
    timestamp: new Date("2024-01-13T09:15:00"),
    description: 'Added comment: "Please review the revenue projections"',
  },
]

// Mock async functions
export const uploadFile = async (file: File): Promise<FileItem> => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: "file",
    size: file.size,
    lastModified: new Date(),
    owner: "Current User",
    permissions: "private",
    mimeType: file.type,
    path: `/${file.name}`,
    version: 1,
  }
}

export const fetchPreview = async (fileId: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return "/placeholder.svg?height=600&width=800"
}
