/**
 * About Page - Information about the Gaza Souls Memorial project
 * 
 * Provides detailed information about the project, its mission, and methodology
 * with proper SEO optimization for better search engine visibility.
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { Home, FileText, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Gaza Souls Memorial - Honoring Lives Lost in Palestine',
  description: 'Learn about the Gaza Souls Memorial project, our mission to honor the 63,872 lives lost in Gaza through interactive data visualization and digital remembrance.',
  keywords: 'Gaza memorial about, Palestine memorial project, Gaza casualties memorial, digital remembrance, interactive memorial, Gaza victims, Palestine conflict memorial',
  openGraph: {
    title: 'About Gaza Souls Memorial',
    description: 'Honoring 63,872 lives lost in Gaza through interactive digital memorial',
    type: 'website',
  },
  alternates: {
    canonical: '/about'
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Navigation */}
      <header className="border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Home size={16} />
                <span className="text-sm font-medium">Memorial</span>
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                href="/blog" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText size={16} />
                <span className="text-sm font-medium">News</span>
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
              <Info size={16} />
              <span>About the Project</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About Palestine Memorial
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A digital space dedicated to honoring the memory of 63,872 lives lost in Gaza, 
            transforming data into a living memorial that preserves the humanity behind the statistics.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  The Gaza Souls Memorial exists to ensure that every life lost in Gaza is remembered, 
                  honored, and never forgotten. In a world where casualties can become mere statistics, 
                  we restore the humanity behind each number.
                </p>
                <p>
                  Through innovative data visualization and interactive technology, we create a space 
                  for reflection, education, and remembrance that transcends traditional memorials.
                </p>
                <p>
                  Our goal is not just to document loss, but to foster empathy, promote understanding, 
                  and inspire action toward peace and justice.
                </p>
              </div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Key Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Lives Remembered:</span>
                  <span className="text-2xl font-bold text-white">63,872</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Children (0-17):</span>
                  <span className="text-xl font-bold text-red-400">19,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Women:</span>
                  <span className="text-xl font-bold text-purple-400">12,500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Medical Staff:</span>
                  <span className="text-xl font-bold text-green-400">1,590+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Journalists:</span>
                  <span className="text-xl font-bold text-blue-400">245+</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Data sourced from Tech for Palestine and humanitarian organizations
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Data Collection</h3>
              <p className="text-gray-400">
                We gather verified casualty data from reliable sources including Tech for Palestine, 
                humanitarian organizations, and official reports.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Visualization</h3>
              <p className="text-gray-400">
                Each person becomes a particle in our 3D memorial space, with individual details 
                preserved and accessible through interaction.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Remembrance</h3>
              <p className="text-gray-400">
                Visitors can explore individual stories, listen to names being spoken, 
                and spend time in contemplation and reflection.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Technology & Accessibility</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Built With</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Three.js & WebGL:</strong> 3D visualization and rendering</li>
                  <li>• <strong>Next.js & React:</strong> Modern web framework</li>
                  <li>• <strong>TypeScript:</strong> Type-safe development</li>
                  <li>• <strong>GLSL Shaders:</strong> Custom visual effects</li>
                  <li>• <strong>Web Audio API:</strong> Immersive audio experience</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Accessibility Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Keyboard Navigation:</strong> Full keyboard support</li>
                  <li>• <strong>Screen Reader Compatible:</strong> ARIA labels and descriptions</li>
                  <li>• <strong>Multilingual:</strong> Arabic and English support</li>
                  <li>• <strong>Performance Optimized:</strong> Works on various devices</li>
                  <li>• <strong>Responsive Design:</strong> Mobile and desktop friendly</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Data Sources & Methodology</h2>
          <div className="space-y-6 text-gray-300">
            <p>
              The Gaza Souls Memorial is committed to accuracy and transparency in our data presentation. 
              We source our information from multiple verified and reliable sources:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Primary Sources</h3>
                <ul className="space-y-2">
                  <li>• <a href="https://data.techforpalestine.org" className="text-blue-400 hover:text-blue-300">Tech for Palestine</a> - Comprehensive casualty database</li>
                  <li>• Gaza Ministry of Health - Official casualty reports</li>
                  <li>• Palestinian Centre for Human Rights - Documentation and verification</li>
                  <li>• Al Mezan Center for Human Rights - Field documentation</li>
                </ul>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Verification Process</h3>
                <ul className="space-y-2">
                  <li>• Cross-reference multiple sources</li>
                  <li>• Verify names and personal details</li>
                  <li>• Regular updates as new data becomes available</li>
                  <li>• Transparent methodology documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gray-900/30 border border-gray-800 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Honor Their Memory
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Visit the memorial to pay your respects, learn individual stories, and reflect on the 
            human cost of conflict. Each soul deserves to be remembered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Visit Memorial
            </Link>
            <Link 
              href="/blog" 
              className="px-8 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
            >
              Read Our News
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Gaza Souls Memorial. In memory of all lives lost.</p>
            <p className="mt-2 text-sm">
              Built with respect, remembrance, and hope for peace.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

