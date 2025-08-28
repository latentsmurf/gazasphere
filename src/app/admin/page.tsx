/**
 * Admin Dashboard - Main admin panel overview
 * 
 * Provides overview of site statistics, recent activity,
 * and quick access to content management tools.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp,
  Plus,
  Edit,
  Calendar,
  BarChart3
} from 'lucide-react'

// Mock data - in a real app this would come from your database/API
const mockStats = {
  totalPosts: 12,
  totalViews: 15420,
  totalUsers: 3,
  monthlyViews: 4230
}

const mockRecentPosts = [
  {
    id: '1',
    title: 'Introducing the Gaza Souls Memorial',
    status: 'published',
    views: 1250,
    date: '2024-01-15',
    author: 'Admin'
  },
  {
    id: '2',
    title: 'Technology Behind the Memorial',
    status: 'published',
    views: 890,
    date: '2024-01-10',
    author: 'Admin'
  },
  {
    id: '3',
    title: 'Data Sources and Methodology',
    status: 'draft',
    views: 0,
    date: '2024-01-08',
    author: 'Admin'
  }
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats)
  const [recentPosts, setRecentPosts] = useState(mockRecentPosts)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to the Palestine Memorial admin panel</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Posts</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalPosts}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="text-primary" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Views</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Eye className="text-primary" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Active Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="text-primary" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Monthly Views</p>
              <p className="text-2xl font-bold text-foreground">{stats.monthlyViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="text-primary" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Posts</h2>
            <Link 
              href="/admin/blog"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{post.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.views} views
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <Link 
                  href={`/admin/blog/${post.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              href="/admin/blog/new"
              className="flex items-center gap-3 p-3 bg-accent/50 hover:bg-accent rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Create New Blog Post</span>
            </Link>
            <Link 
              href="/admin/media"
              className="flex items-center gap-3 p-3 bg-accent/50 hover:bg-accent rounded-lg transition-colors"
            >
              <FileText size={18} />
              <span>Manage Media Library</span>
            </Link>
            <Link 
              href="/admin/settings"
              className="flex items-center gap-3 p-3 bg-accent/50 hover:bg-accent rounded-lg transition-colors"
            >
              <BarChart3 size={18} />
              <span>Site Settings</span>
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Site Status</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Backup</span>
              <span className="text-foreground text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
