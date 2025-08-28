/**
 * Admin Blog Post Editor - Create new blog post
 * 
 * Rich text editor for creating new blog posts with
 * image upload, SEO settings, and publishing options.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X,
  Settings
} from 'lucide-react'

interface BlogPostData {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  status: 'draft' | 'published' | 'scheduled'
  publishDate: string
  image: string
  imageAlt: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

const categories = ['Project Updates', 'Technology', 'Data & Research', 'Perspective', 'Features', 'Community']

export default function NewBlogPost() {
  const [postData, setPostData] = useState<BlogPostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Project Updates',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    image: '',
    imageAlt: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  })

  const [showSeoSettings, setShowSeoSettings] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    setPostData(prev => ({
      ...prev,
      title,
      slug,
      seoTitle: title || prev.seoTitle
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a cloud service or your server
      const imageUrl = URL.createObjectURL(file)
      setPostData(prev => ({
        ...prev,
        image: imageUrl,
        imageAlt: prev.imageAlt || `Image for ${prev.title}`
      }))
    }
  }

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true)
    
    try {
      // In a real app, you'd send this to your API
      const dataToSave = {
        ...postData,
        status,
        updatedAt: new Date().toISOString()
      }
      
      console.log('Saving post:', dataToSave)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert(`Post ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`)
    } catch (error) {
      alert('Error saving post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blog"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Posts
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create New Post</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSeoSettings(!showSeoSettings)}
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
          >
            <Settings size={16} />
            SEO
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving || !postData.title.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
          >
            <Eye size={16} />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-card border border-border rounded-lg p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Post Title
            </label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              className="w-full px-4 py-3 text-xl bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            {postData.slug && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  URL Slug
                </label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>/blog/</span>
                  <input
                    type="text"
                    value={postData.slug}
                    onChange={(e) => setPostData(prev => ({ ...prev, slug: e.target.value }))}
                    className="bg-transparent border-none outline-none text-foreground"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="bg-card border border-border rounded-lg p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Featured Image
            </label>
            
            {postData.image ? (
              <div className="relative">
                <img 
                  src={postData.image} 
                  alt={postData.imageAlt}
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={() => setPostData(prev => ({ ...prev, image: '', imageAlt: '' }))}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                <p className="text-muted-foreground mb-2">Upload featured image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  Choose File
                </label>
              </div>
            )}
            
            {postData.image && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={postData.imageAlt}
                  onChange={(e) => setPostData(prev => ({ ...prev, imageAlt: e.target.value }))}
                  placeholder="Describe the image for accessibility..."
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-card border border-border rounded-lg p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Excerpt
            </label>
            <textarea
              value={postData.excerpt}
              onChange={(e) => setPostData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Write a brief summary of your post..."
              rows={3}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-card border border-border rounded-lg p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Content
            </label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your post content here... (Markdown supported)"
              rows={20}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Supports Markdown formatting. Use **bold**, *italic*, # headings, etc.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Publish Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={postData.status}
                  onChange={(e) => setPostData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={postData.publishDate}
                  onChange={(e) => setPostData(prev => ({ ...prev, publishDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={postData.category}
                  onChange={(e) => setPostData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground focus:border-primary focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          {showSeoSettings && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={postData.seoTitle}
                    onChange={(e) => setPostData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="SEO optimized title..."
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={postData.seoDescription}
                    onChange={(e) => setPostData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="SEO meta description..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={postData.seoKeywords}
                    onChange={(e) => setPostData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3..."
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
