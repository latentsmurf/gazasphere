/**
 * Blog Index Page - Main blog listing with SEO optimization
 * 
 * Displays a list of blog posts and news updates about the Gaza Souls Memorial
 * project with proper SEO structure and metadata.
 */

import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'News & Updates | Gaza Souls Memorial',
  description: 'Latest news, updates, and stories about the Gaza Souls Memorial project, Palestine conflict, and remembering the lives lost in Gaza.',
  keywords: 'Gaza news, Palestine updates, memorial project, Gaza casualties, remembrance, human rights, conflict documentation',
  openGraph: {
    title: 'News & Updates | Gaza Souls Memorial',
    description: 'Stay updated with the latest news about the Gaza Souls Memorial project and Palestine',
    type: 'website',
  },
  alternates: {
    canonical: '/blog'
  }
}

// Blog post data structure with image support
interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  slug: string
  image?: string
  imageAlt?: string
}

import { getBlogPosts } from '@/lib/cms'

// Get blog posts from CMS
const getBlogPostsData = () => {
  return getBlogPosts({ status: 'published' })
}

// Calculate read time based on content length
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

// Get blog posts from CMS and add calculated fields
const blogPosts: BlogPost[] = getBlogPostsData().map(post => ({
  ...post,
  date: post.publishDate,
  readTime: calculateReadTime(post.content)
}))

const categories = ['All', 'Project Updates', 'Technology', 'Data & Research', 'Perspective', 'Features', 'Community']

export default function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          News & Updates
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Stay informed about the Palestine Memorial project, latest developments in Gaza and the West Bank, 
          and stories of remembrance that matter.
        </p>
      </section>

      {/* Category Filter */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border border-gray-700 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors text-sm hover:bg-blue-400/10"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl"
          >
            {/* Featured Image */}
            {post.image && (
              <div className="aspect-video overflow-hidden bg-gray-800 border border-gray-700 rounded-t-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📰</div>
                    <p className="text-xs">{post.category}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Category Badge */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-400/20 text-blue-400 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-gray-400 mb-4 line-clamp-3 text-sm">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Newsletter Signup */}
      <section className="mt-16 text-center bg-gray-900 border border-gray-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Subscribe to receive updates about the Palestine Memorial project and important news about Gaza and the West Bank.
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
          />
          <button className="px-6 py-2 bg-blue-400 hover:bg-blue-300 text-black rounded-lg font-medium transition-colors">
            Subscribe
          </button>
        </div>
      </section>

      {/* SEO Content */}
      <section className="mt-16 prose prose-invert max-w-none">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Our News Coverage</h2>
          <div className="text-gray-400 space-y-4">
            <p>
              The Palestine Memorial news section provides comprehensive coverage of the ongoing situation in Gaza and the West Bank, 
              updates about our memorial project, and stories that honor the memory of those we've lost. Our commitment 
              is to accurate, respectful, and meaningful reporting that serves the cause of peace and justice.
            </p>
            <p>
              We cover topics including casualty documentation, humanitarian efforts, technological innovations in 
              memorial creation, community responses, and the broader context of the Palestine-Israel conflict. 
              Each article is researched thoroughly and written with the utmost respect for the lives and stories we represent.
            </p>
            <p>
              Our data comes from verified sources including Tech for Palestine, humanitarian organizations, 
              and official reports. We believe in transparency and provide source information for all statistics 
              and claims made in our coverage.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
