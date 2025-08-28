/**
 * Blog Layout - SEO-optimized layout for news and blog content
 * 
 * Provides structured layout for blog posts with proper SEO meta tags,
 * navigation, and content organization to improve search engine visibility.
 * Updated to match the main UI design system with consistent dark theme.
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Home, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'News & Updates | Palestine Memorial',
  description: 'Latest news, updates, and stories about the Palestine Memorial project, Gaza, and remembering the lives lost.',
  keywords: 'Gaza, Palestine, memorial, news, updates, remembrance, human rights, conflict, peace',
  openGraph: {
    title: 'News & Updates | Palestine Memorial',
    description: 'Latest news and updates about the Palestine Memorial project',
    type: 'website',
    siteName: 'Palestine Memorial'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Updates | Palestine Memorial',
    description: 'Latest news and updates about the Palestine Memorial project'
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Navigation */}
      <header className="border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {/* Navigation - Made bigger and more prominent */}
            <nav className="flex items-center gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/20 transition-colors rounded-lg"
              >
                <Home size={18} />
                <span>Memorial</span>
              </Link>
              <span className="text-muted-foreground text-lg">•</span>
              <Link 
                href="/about" 
                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/20 transition-colors rounded-lg"
              >
                <Info size={18} />
                <span>About</span>
              </Link>
            </nav>
            
            {/* Spacer for balance */}
            <div></div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Palestine Memorial
            </Link>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
              <FileText size={16} />
              <span>News & Updates</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer - Matching main UI style */}
      <footer className="border-t border-border mt-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">Palestine Memorial</h3>
              <p className="text-muted-foreground text-sm">
                Honoring the memory of lives lost in Gaza and the West Bank through interactive visualization and remembrance.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://data.techforpalestine.org" className="hover:text-foreground transition-colors">Tech for Palestine Data</a></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">News & Updates</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">Memorial Visualization</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Donate</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Share</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Palestine Memorial. In memory of all lives lost.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
