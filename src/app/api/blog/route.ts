/**
 * Blog API Routes - CRUD operations for blog posts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, createBlogPost, BlogPost } from '@/lib/cms'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const category = searchParams.get('category') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const posts = getBlogPosts({ status, category, limit, offset })

    return NextResponse.json({
      success: true,
      data: posts,
      total: posts.length
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, content, category' },
        { status: 400 }
      )
    }

    // Create the blog post
    const postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'> = {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: body.excerpt || '',
      content: body.content,
      category: body.category,
      status: body.status || 'draft',
      publishDate: body.publishDate || new Date().toISOString().split('T')[0],
      author: body.author || 'Admin',
      image: body.image,
      imageAlt: body.imageAlt,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords
    }

    const newPost = createBlogPost(postData)

    return NextResponse.json({
      success: true,
      data: newPost
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
