/**
 * Floating Navigation Component
 * 
 * Provides elegant navigation access without cluttering the memorial interface.
 * Features a compact navigation bar that integrates seamlessly with the memorial.
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FileText, Info, Home, ChevronDown } from 'lucide-react'

interface FloatingNavigationProps {
  /** Current page to highlight active state */
  currentPage?: 'memorial' | 'blog' | 'about' | 'admin'
}

export default function FloatingNavigation({ currentPage = 'memorial' }: FloatingNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigationItems = [
    {
      id: 'memorial',
      label: 'Memorial',
      href: '/',
      icon: Home
    },
    {
      id: 'blog',
      label: 'News',
      href: '/blog',
      icon: FileText
    },
    {
      id: 'about',
      label: 'About',
      href: '/about',
      icon: Info
    }
  ]

  const currentItem = navigationItems.find(item => item.id === currentPage) || navigationItems[0]
  const CurrentIcon = currentItem.icon

  return (
    <div ref={menuRef} className="fixed top-6 left-6 z-10">
      {/* Compact Navigation Bar */}
      <div className="flex items-center gap-2">
        {/* Current Page Indicator */}
        <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
          <CurrentIcon size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">{currentItem.label}</span>
        </div>

        {/* Navigation Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg hover:bg-background/95 transition-colors"
            aria-label="Navigation menu"
          >
            <ChevronDown 
              size={16} 
              className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-12 left-0 w-48 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl overflow-hidden">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 transition-colors duration-200
                      ${isActive 
                        ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
