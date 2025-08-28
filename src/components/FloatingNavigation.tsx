/**
 * Floating Navigation Component
 * 
 * Provides elegant navigation access without cluttering the memorial interface.
 * Features a subtle menu button that expands to show navigation options.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, FileText, Info, Home } from 'lucide-react'

interface FloatingNavigationProps {
  /** Current page to highlight active state */
  currentPage?: 'memorial' | 'blog' | 'about'
}

export default function FloatingNavigation({ currentPage = 'memorial' }: FloatingNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      id: 'memorial',
      label: 'Memorial',
      href: '/',
      icon: Home,
      description: 'Interactive memorial visualization'
    },
    {
      id: 'blog',
      label: 'News',
      href: '/blog',
      icon: FileText,
      description: 'Latest updates and stories'
    },
    {
      id: 'about',
      label: 'About',
      href: '/about',
      icon: Info,
      description: 'Learn about the project'
    }
  ]

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-12 h-12 rounded-full backdrop-blur-sm border shadow-lg transition-all duration-300
          ${isOpen 
            ? 'bg-gray-900/95 border-gray-600 rotate-90' 
            : 'bg-gray-900/80 border-gray-700/50 hover:bg-gray-900/90 hover:border-gray-600'
          }
        `}
        aria-label="Navigation menu"
      >
        {isOpen ? (
          <X size={20} className="text-white mx-auto" />
        ) : (
          <Menu size={20} className="text-white mx-auto" />
        )}
      </button>

      {/* Navigation Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Items */}
          <div className="absolute top-16 right-0 w-72 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300' 
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg
                      ${isActive 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-gray-800/50 text-gray-400 group-hover:text-gray-300'
                      }
                    `}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-700/50 p-4 bg-gray-900/50">
              <p className="text-xs text-gray-500 text-center">
                Palestine Memorial Project
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
