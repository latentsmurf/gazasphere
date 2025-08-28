/**
 * Simple CMS Data Layer
 * 
 * Provides data management for blog posts and site content.
 * In a production app, this would connect to a database.
 */

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  status: 'draft' | 'published' | 'scheduled'
  publishDate: string
  createdAt: string
  updatedAt: string
  author: string
  image?: string
  imageAlt?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  views: number
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  socialMedia: {
    twitter?: string
    facebook?: string
    linkedin?: string
  }
  analytics: {
    googleAnalyticsId?: string
  }
  memorial: {
    totalCasualties: number
    lastUpdated: string
    dataSources: string[]
  }
}

// Mock data store - in production, this would be a database
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Introducing the Gaza Souls Memorial: A Digital Space for Remembrance',
    slug: 'introducing-gaza-souls-memorial',
    excerpt: 'Learn about the creation of this interactive memorial that honors the memory of over 63,000 lives lost in Gaza through innovative data visualization.',
    content: `# Introducing the Gaza Souls Memorial

**In memory of the 63,872 souls lost in Gaza** — The Gaza Souls Memorial represents each life as a point of light in an interactive 3D visualization, creating a space for remembrance, reflection, and understanding of the human cost of conflict.

## A Memorial Born from Data and Compassion

The Gaza Souls Memorial emerged from a simple yet profound belief: every life lost deserves to be remembered, honored, and never forgotten. In an age where numbers can become abstract, we sought to create something that would restore the humanity behind the statistics — a digital space where each of the 63,872 documented casualties becomes a individual point of light, a soul that once lived, loved, and dreamed.

This interactive memorial uses cutting-edge web technology to transform data into a living, breathing tribute. Each particle in our 3D visualization represents a real person — with a name, an age, a story. When you hover over a particle, you see their details. When you click, you learn about their life. This is not just data visualization; it's human visualization.

## The Technology of Remembrance

Built using Three.js and WebGL, the memorial runs entirely in web browsers, making it accessible to anyone with an internet connection. The visualization features:

- **Interactive 3D Environment:** Navigate through a sphere of souls with smooth camera controls
- **Individual Recognition:** Each particle represents a documented casualty with personal details
- **Audio Memorial:** Optional narration speaks each name in Arabic and English
- **Visual Effects:** Atmospheric shaders and lighting create a contemplative experience
- **Real-time Data:** Information sourced from Tech for Palestine and humanitarian organizations

## More Than Statistics: Restoring Humanity

In conflicts, it's easy for casualties to become mere numbers in news reports. The Gaza Souls Memorial fights against this dehumanization by presenting each loss as an individual story. When you see 63,872 particles floating in space, each one pulsing with its own light, the scale of loss becomes viscerally apparent in a way that numbers alone cannot convey.

The memorial includes detailed information about each person when available: their name in both Arabic and English, their age, their location, and the date of their passing. For children, we show their young age. For parents, we honor their role. For journalists and medical workers, we acknowledge their service. Each life is presented with the dignity it deserves.

## A Space for Reflection and Action

The Gaza Souls Memorial serves multiple purposes: it's a space for mourning, a tool for education, and a call for justice. Visitors can spend time in contemplation, learning about the human cost of conflict, or sharing the memorial to raise awareness about the situation in Palestine.

We've designed the experience to be respectful and non-exploitative. The visual design is contemplative rather than shocking, the interactions are gentle rather than jarring, and the overall tone is one of reverence for the lives lost and hope for a peaceful future.`,
    category: 'Project Updates',
    status: 'published',
    publishDate: '2024-01-15',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    author: 'Gaza Memorial Team',
    image: '/blog/memorial-intro.jpg',
    imageAlt: 'Interactive 3D memorial visualization showing particles representing lives lost',
    seoTitle: 'Introducing the Gaza Souls Memorial: A Digital Space for Remembrance',
    seoDescription: 'Learn about the creation of this interactive memorial that honors the memory of over 63,000 lives lost in Gaza through innovative data visualization.',
    seoKeywords: 'Gaza memorial, Palestine remembrance, interactive memorial, data visualization',
    views: 1250
  },
  {
    id: '2',
    title: 'The Technology Behind the Memorial: Three.js and WebGL Visualization',
    slug: 'technology-behind-memorial',
    excerpt: 'Discover how we used cutting-edge web technologies to create an immersive 3D memorial experience that runs in any web browser.',
    content: `# The Technology Behind the Memorial

Building a memorial that honors 63,872 individual lives required innovative technology that could handle massive datasets while maintaining the dignity and respect each soul deserves. Here's how we built it.

## The Technical Challenge

Creating an interactive memorial for over 63,000 individuals presents unique technical challenges. Each person needs to be represented individually, with their own data, position, and interactive capabilities. Traditional web technologies would struggle with this scale, which is why we turned to WebGL and Three.js.

The memorial needed to be:

- **Performant:** Smooth 60fps rendering with 63,000+ particles
- **Interactive:** Individual hover and click detection for each particle
- **Accessible:** Works across devices and browsers
- **Respectful:** Dignified presentation without exploitation
- **Scalable:** Ability to add more data as it becomes available

## Core Technologies

### Technology Stack

**Frontend**
- Three.js: 3D rendering and scene management
- React Three Fiber: React integration for Three.js
- Next.js 15: Full-stack React framework
- TypeScript: Type safety and developer experience
- Tailwind CSS: Utility-first styling

**Graphics & Audio**
- WebGL: Hardware-accelerated graphics
- GLSL Shaders: Custom particle effects
- Web Audio API: Immersive audio experience
- Canvas API: 2D overlays and UI elements
- Zustand: State management

## Performance Optimizations

Rendering 63,000+ interactive particles at 60fps requires aggressive optimization:

### GPU-Accelerated Rendering
All particle calculations happen on the GPU using custom GLSL shaders. This moves computation from the CPU to the graphics card, enabling smooth performance even with massive datasets.

### Instanced Geometry
Instead of creating 63,000 individual objects, we use instanced geometry to render all particles in a single draw call, dramatically reducing the performance overhead.

### Level of Detail (LOD)
Particles far from the camera use simplified rendering, while nearby particles get full detail. This ensures performance while maintaining visual quality where it matters most.`,
    category: 'Technology',
    status: 'published',
    publishDate: '2024-01-10',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    author: 'Technical Team',
    image: '/blog/technology-stack.jpg',
    imageAlt: 'Code visualization showing Three.js and WebGL implementation',
    seoTitle: 'The Technology Behind the Gaza Souls Memorial: Three.js and WebGL Visualization',
    seoDescription: 'Discover how we built an interactive 3D memorial using Three.js, WebGL, and modern web technologies.',
    seoKeywords: 'Three.js memorial, WebGL visualization, Gaza memorial technology, interactive 3D memorial',
    views: 890
  }
]

let siteSettings: SiteSettings = {
  siteName: 'Palestine Memorial',
  siteDescription: 'Honoring the memory of lives lost in Gaza and the West Bank through interactive visualization and remembrance.',
  siteUrl: 'https://palestine-memorial.org',
  socialMedia: {
    twitter: '@PalestineMemorial',
    facebook: 'PalestineMemorial',
    linkedin: 'palestine-memorial'
  },
  analytics: {
    googleAnalyticsId: 'GA-XXXXXXXXX'
  },
  memorial: {
    totalCasualties: 63872,
    lastUpdated: '2024-01-15',
    dataSources: [
      'Tech for Palestine',
      'Gaza Ministry of Health',
      'Palestinian Centre for Human Rights',
      'Al Mezan Center for Human Rights'
    ]
  }
}

// Blog post operations
export const getBlogPosts = (filters?: {
  status?: string
  category?: string
  limit?: number
  offset?: number
}): BlogPost[] => {
  let filtered = [...blogPosts]

  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter(post => post.status === filters.status)
  }

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter(post => post.category === filters.category)
  }

  // Sort by publish date, newest first
  filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

  if (filters?.limit) {
    const offset = filters.offset || 0
    filtered = filtered.slice(offset, offset + filters.limit)
  }

  return filtered
}

export const getBlogPost = (id: string): BlogPost | null => {
  return blogPosts.find(post => post.id === id) || null
}

export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  return blogPosts.find(post => post.slug === slug) || null
}

export const createBlogPost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>): BlogPost => {
  const newPost: BlogPost = {
    ...postData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0
  }

  blogPosts.push(newPost)
  return newPost
}

export const updateBlogPost = (id: string, updates: Partial<BlogPost>): BlogPost | null => {
  const index = blogPosts.findIndex(post => post.id === id)
  if (index === -1) return null

  blogPosts[index] = {
    ...blogPosts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  return blogPosts[index]
}

export const deleteBlogPost = (id: string): boolean => {
  const index = blogPosts.findIndex(post => post.id === id)
  if (index === -1) return false

  blogPosts.splice(index, 1)
  return true
}

export const incrementPostViews = (id: string): void => {
  const post = getBlogPost(id)
  if (post) {
    post.views++
  }
}

// Site settings operations
export const getSiteSettings = (): SiteSettings => {
  return { ...siteSettings }
}

export const updateSiteSettings = (updates: Partial<SiteSettings>): SiteSettings => {
  siteSettings = { ...siteSettings, ...updates }
  return siteSettings
}

// Utility functions
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const getPostStats = () => {
  const totalPosts = blogPosts.length
  const publishedPosts = blogPosts.filter(post => post.status === 'published').length
  const draftPosts = blogPosts.filter(post => post.status === 'draft').length
  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0)

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews
  }
}
