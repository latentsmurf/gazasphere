/**
 * Admin Layout - Protected admin panel layout
 * 
 * Provides secure layout for admin panel with authentication,
 * navigation, and content management tools.
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Settings, 
  FileText, 
  Users, 
  BarChart3, 
  Image, 
  Home,
  Shield,
  LogOut
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Panel | Palestine Memorial',
  description: 'Content management system for Palestine Memorial',
  robots: {
    index: false,
    follow: false,
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin" 
                className="text-xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Shield size={20} />
                Admin Panel
              </Link>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Palestine Memorial CMS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Home size={16} />
                View Site
              </Link>
              <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin" 
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <BarChart3 size={18} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/blog" 
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <FileText size={18} />
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/media" 
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Image size={18} />
                  Media Library
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/users" 
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Users size={18} />
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/settings" 
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Settings size={18} />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
