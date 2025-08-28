/**
 * Dynamic Blog Post Page - Renders individual blog posts
 * 
 * Fetches blog post data from CMS and renders with proper SEO
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/cms'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Palestine Memorial'
    }
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
      images: post.image ? [
        {
          url: post.image,
          alt: post.imageAlt || post.title
        }
      ] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined
    },
    alternates: {
      canonical: `/blog/${post.slug}`
    }
  }
}

// Generate static params for all published posts
export async function generateStaticParams() {
  const posts = getBlogPosts({ status: 'published' })
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Calculate read time based on content length
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

// Simple markdown to HTML converter (basic implementation)
const markdownToHtml = (markdown: string): string => {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-foreground mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mt-8 mb-6">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="text-muted-foreground mb-2">$1</li>')
    .replace(/(<li.*<\/li>)/g, '<ul class="space-y-2 mb-6 ml-6 list-disc">$1</ul>')
    
    // Paragraphs
    .replace(/^(?!<[h|u|l])(.+)$/gim, '<p class="text-muted-foreground mb-6">$1</p>')
    
    // Line breaks
    .replace(/\n/g, '<br />')
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const readTime = calculateReadTime(post.content)
  const htmlContent = markdownToHtml(post.content)

  return (
    <article className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link href="/blog" className="text-primary hover:text-primary/80 flex items-center gap-2">
          ← Back to News
        </Link>
      </nav>

      {/* Featured Image */}
      {post.image && (
        <div className="mb-8 aspect-video overflow-hidden rounded-lg border border-border bg-card">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">📰</div>
              <p className="text-sm">{post.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
            {post.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-muted-foreground text-sm space-x-4">
          <time dateTime={post.publishDate}>
            {new Date(post.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>•</span>
          <span>{readTime}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        {post.excerpt && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <p className="text-lg text-muted-foreground mb-0">
              {post.excerpt}
            </p>
          </div>
        )}

        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-foreground mb-3">Visit the Memorial</h3>
          <p className="text-muted-foreground mb-4">
            Experience the Palestine Memorial and honor the memory of lives lost. Take time to reflect, 
            learn individual stories, and share this space of remembrance with others.
          </p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            Visit Memorial →
          </Link>
        </div>
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Share this article:</p>
            <div className="flex space-x-4 mt-2">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Facebook
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <Link 
            href="/blog" 
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            More Articles →
          </Link>
        </div>
      </footer>
    </article>
  )
}
