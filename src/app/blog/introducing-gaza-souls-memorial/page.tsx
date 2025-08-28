/**
 * Blog Post: Introducing Gaza Souls Memorial
 * 
 * First blog post introducing the memorial project with SEO optimization
 */

import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Introducing the Gaza Souls Memorial: A Digital Space for Remembrance',
  description: 'Learn about the creation of this interactive memorial that honors the memory of over 63,000 lives lost in Gaza through innovative data visualization and 3D technology.',
  keywords: 'Gaza memorial, Palestine remembrance, interactive memorial, data visualization, Gaza casualties, digital memorial, Three.js memorial',
  openGraph: {
    title: 'Introducing the Gaza Souls Memorial',
    description: 'A digital space for remembrance honoring lives lost in Gaza',
    type: 'article',
    publishedTime: '2024-01-15T00:00:00.000Z',
    authors: ['Gaza Souls Memorial Team']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Introducing the Gaza Souls Memorial',
    description: 'A digital space for remembrance honoring lives lost in Gaza'
  },
  alternates: {
    canonical: '/blog/introducing-gaza-souls-memorial'
  }
}

export default function BlogPost() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link href="/blog" className="text-primary hover:text-primary/80 flex items-center gap-2">
          ← Back to News
        </Link>
      </nav>

      {/* Featured Image */}
      <div className="mb-8 aspect-video overflow-hidden rounded-lg border border-border bg-card">
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-4xl mb-2">🕯️</div>
            <p className="text-sm">Palestine Memorial - Digital Space for Remembrance</p>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
            Project Updates
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Introducing the Gaza Souls Memorial: A Digital Space for Remembrance
        </h1>
        <div className="flex items-center text-muted-foreground text-sm space-x-4">
          <time dateTime="2024-01-15">January 15, 2024</time>
          <span>•</span>
          <span>5 min read</span>
          <span>•</span>
          <span>Gaza Souls Memorial Team</span>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <p className="text-lg text-muted-foreground mb-0">
            <strong className="text-foreground">In memory of the 63,872 souls lost in Gaza</strong> — The Gaza Souls Memorial represents 
            each life as a point of light in an interactive 3D visualization, creating a space for 
            remembrance, reflection, and understanding of the human cost of conflict.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">A Memorial Born from Data and Compassion</h2>
        
        <p className="text-muted-foreground mb-6">
          The Gaza Souls Memorial emerged from a simple yet profound belief: every life lost deserves to be 
          remembered, honored, and never forgotten. In an age where numbers can become abstract, we sought 
          to create something that would restore the humanity behind the statistics — a digital space where 
          each of the 63,872 documented casualties becomes a individual point of light, a soul that once 
          lived, loved, and dreamed.
        </p>

        <p className="text-gray-300 mb-6">
          This interactive memorial uses cutting-edge web technology to transform data into a living, 
          breathing tribute. Each particle in our 3D visualization represents a real person — with a name, 
          an age, a story. When you hover over a particle, you see their details. When you click, you 
          learn about their life. This is not just data visualization; it&apos;s human visualization.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Technology of Remembrance</h2>

        <p className="text-gray-300 mb-6">
          Built using Three.js and WebGL, the memorial runs entirely in web browsers, making it accessible 
          to anyone with an internet connection. The visualization features:
        </p>

        <ul className="text-gray-300 mb-6 space-y-2">
          <li><strong>Interactive 3D Environment:</strong> Navigate through a sphere of souls with smooth camera controls</li>
          <li><strong>Individual Recognition:</strong> Each particle represents a documented casualty with personal details</li>
          <li><strong>Audio Memorial:</strong> Optional narration speaks each name in Arabic and English</li>
          <li><strong>Visual Effects:</strong> Atmospheric shaders and lighting create a contemplative experience</li>
          <li><strong>Real-time Data:</strong> Information sourced from Tech for Palestine and humanitarian organizations</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">More Than Statistics: Restoring Humanity</h2>

        <p className="text-gray-300 mb-6">
          In conflicts, it&apos;s easy for casualties to become mere numbers in news reports. The Gaza Souls 
          Memorial fights against this dehumanization by presenting each loss as an individual story. 
          When you see 63,872 particles floating in space, each one pulsing with its own light, the 
          scale of loss becomes viscerally apparent in a way that numbers alone cannot convey.
        </p>

        <p className="text-gray-300 mb-6">
          The memorial includes detailed information about each person when available: their name in both 
          Arabic and English, their age, their location, and the date of their passing. For children, 
          we show their young age. For parents, we honor their role. For journalists and medical workers, 
          we acknowledge their service. Each life is presented with the dignity it deserves.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">A Space for Reflection and Action</h2>

        <p className="text-gray-300 mb-6">
          The Gaza Souls Memorial serves multiple purposes: it&apos;s a space for mourning, a tool for education, 
          and a call for justice. Visitors can spend time in contemplation, learning about the human cost 
          of conflict, or sharing the memorial to raise awareness about the situation in Palestine.
        </p>

        <p className="text-gray-300 mb-6">
          We&apos;ve designed the experience to be respectful and non-exploitative. The visual design is 
          contemplative rather than shocking, the interactions are gentle rather than jarring, and the 
          overall tone is one of reverence for the lives lost and hope for a peaceful future.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Looking Forward: Continuous Remembrance</h2>

        <p className="text-gray-300 mb-6">
          The memorial is designed to evolve and grow. As new data becomes available, we update the 
          visualization to ensure accuracy and completeness. We&apos;re also working on additional features 
          including family connections, geographic mapping, and enhanced accessibility options.
        </p>

        <p className="text-gray-300 mb-6">
          Our commitment extends beyond this single project. We believe in the power of technology to 
          foster empathy, promote understanding, and preserve memory. The Gaza Souls Memorial is our 
          contribution to ensuring that these 63,872 souls are never forgotten, and that their stories 
          continue to inspire action toward peace and justice.
        </p>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-white mb-3">Visit the Memorial</h3>
          <p className="text-gray-300 mb-4">
            Experience the Gaza Souls Memorial and honor the memory of lives lost. Take time to reflect, 
            learn individual stories, and share this space of remembrance with others.
          </p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Visit Memorial →
          </Link>
        </div>
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Share this article:</p>
            <div className="flex space-x-4 mt-2">
              <button className="text-gray-400 hover:text-white transition-colors">Twitter</button>
              <button className="text-gray-400 hover:text-white transition-colors">Facebook</button>
              <button className="text-gray-400 hover:text-white transition-colors">LinkedIn</button>
            </div>
          </div>
          <Link 
            href="/blog" 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            More Articles →
          </Link>
        </div>
      </footer>
    </article>
  )
}
