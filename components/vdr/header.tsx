"use client"

import { useState, useRef } from "react"
import { Search, Upload, FolderPlus, Settings, Filter, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { buildBreadcrumbs } from "@/lib/utils"

interface HeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
  onUpload: () => void
  onNewFolder: () => void
  onSettings: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({
  currentPath,
  onNavigate,
  onUpload,
  onNewFolder,
  onSettings,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [searchFilters, setSearchFilters] = useState({
    fileType: "",
    dateModified: "",
    owner: "",
  })
  const searchInputRef = useRef<HTMLInputElement>(null)

  const breadcrumbs = buildBreadcrumbs(currentPath)

  const focusSearch = () => {
    searchInputRef.current?.focus()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center">
              {index === 0 ? (
                <button
                  onClick={() => onNavigate(crumb.path)}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  <Home className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <button onClick={() => onNavigate(crumb.path)} className="hover:text-foreground transition-colors">
                    {crumb.name}
                  </button>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Search */}
        <div className="flex items-center space-x-2 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <Filter className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="font-medium">Search Filters</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={false}>PDFs only</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={false}>Images only</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={false}>Modified today</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={false}>My files only</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button onClick={onUpload} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" onClick={onNewFolder} className="gap-2 bg-transparent">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <Button variant="ghost" size="icon" onClick={onSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
