/**
 * Admin Blog Management - Blog post management interface
 * 
 * Provides CRUD operations for blog posts with search,
 * filtering, and bulk actions.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  FileText
} from 'lucide-react'

// Mock blog posts data - in a real app this would come from your database/API
const mockBlogPosts = [
  {
    id: '1',
    title: 'Introducing the Gaza Souls Memorial: A Digital Space for Remembrance',
    slug: 'introducing-gaza-souls-memorial',
    status: 'published',
    author: 'Admin User',
    category: 'Project Updates',
    publishDate: '2024-01-15',
    views: 1250,
    image: '/blog/memorial-intro.jpg'
  },
  {
    id: '2',
    title: 'The Technology Behind the Memorial: Three.js and WebGL Visualization',
    slug: 'technology-behind-memorial',
    status: 'published',
    author: 'Admin User',
    category: 'Technology',
    publishDate: '2024-01-10',
    views: 890,
    image: '/blog/technology-stack.jpg'
  },
  {
    id: '3',
    title: 'Data Sources and Methodology: Ensuring Accurate Remembrance',
    slug: 'data-sources-methodology',
    status: 'draft',
    author: 'Admin User',
    category: 'Data & Research',
    publishDate: '2024-01-05',
    views: 0,
    image: null
  },
  {
    id: '4',
    title: 'The Importance of Digital Memorials in Modern Conflict Documentation',
    slug: 'importance-digital-memorials',
    status: 'published',
    author: 'Admin User',
    category: 'Perspective',
    publishDate: '2024-01-01',
    views: 567,
    image: null
  }
]

const categories = ['All', 'Project Updates', 'Technology', 'Data & Research', 'Perspective', 'Features', 'Community']
const statuses = ['All', 'Published', 'Draft', 'Scheduled']

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(mockBlogPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesStatus = selectedStatus === 'All' || post.status === selectedStatus.toLowerCase()
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === filteredPosts.length 
        ? [] 
        : filteredPosts.map(post => post.id)
    )
  }

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(post => post.id !== postId))
      setSelectedPosts(prev => prev.filter(id => id !== postId))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
      setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)))
      setSelectedPosts([])
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content and articles</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-accent/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1 bg-destructive/20 text-destructive hover:bg-destructive/30 rounded text-sm transition-colors"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/50 border-b border-border">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Post</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Author</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Views</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b border-border hover:bg-accent/30">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {post.image ? (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-accent rounded border border-border flex items-center justify-center">
                          <FileText size={16} className="text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-foreground line-clamp-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{post.category}</td>
                  <td className="p-4 text-sm text-muted-foreground">{post.author}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{post.views}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="View Post"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Post"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No posts found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination would go here in a real app */}
    </div>
  )
}
