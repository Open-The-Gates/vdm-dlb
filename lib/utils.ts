import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getFileIcon(mimeType?: string): string {
  if (!mimeType) return "📄"

  if (mimeType.includes("pdf")) return "📕"
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊"
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝"
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📊"
  if (mimeType.includes("image")) return "🖼️"
  if (mimeType.includes("video")) return "🎥"
  if (mimeType.includes("audio")) return "🎵"

  return "📄"
}

export function buildBreadcrumbs(path: string): Array<{ name: string; path: string }> {
  if (path === "/") return [{ name: "Home", path: "/" }]

  const segments = path.split("/").filter(Boolean)
  const breadcrumbs = [{ name: "Home", path: "/" }]

  let currentPath = ""
  segments.forEach((segment) => {
    currentPath += `/${segment}`
    breadcrumbs.push({ name: segment, path: currentPath })
  })

  return breadcrumbs
}
