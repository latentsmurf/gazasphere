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
    <div className="min-h-screen bg-black text-white">
      {/* Header with Navigation */}
      <header className="border-b border-gray-700 bg-gray-900/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {/* Navigation - Made bigger and more prominent */}
            <nav className="flex items-center gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 transition-colors rounded-lg"
              >
                <Home size={18} />
                <span>Memorial</span>
              </Link>
              <span className="text-gray-500 text-lg">•</span>
              <Link 
                href="/about" 
                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 transition-colors rounded-lg"
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
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors inline-flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Palestine Memorial
            </Link>
            <div className="flex items-center justify-center gap-2 text-gray-400 mt-2">
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
      <footer className="border-t border-gray-700 mt-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">Palestine Memorial</h3>
              <p className="text-gray-400 text-sm">
                Honoring the memory of lives lost in Gaza and the West Bank through interactive visualization and remembrance.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://data.techforpalestine.org" className="hover:text-white transition-colors">Tech for Palestine Data</a></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">News & Updates</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Memorial Visualization</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Donate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Share</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Palestine Memorial. In memory of all lives lost.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
