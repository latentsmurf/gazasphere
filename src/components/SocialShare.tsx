'use client'

import { useState, useEffect } from 'react'
import { Share2, Twitter, Facebook, Link, Mail, MessageCircle, ChevronDown, ChevronUp, ChevronRight, Linkedin } from 'lucide-react'

interface SocialShareProps {
  casualtyCount: number
}

export default function SocialShare({ casualtyCount }: SocialShareProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    // Set the share URL after hydration to avoid SSR/client mismatch
    setShareUrl(window.location.href)
  }, [])
  const shareTitle = `Gaza Memorial - Honoring ${casualtyCount.toLocaleString()} Lives Lost`
  const shareText = `Each light represents a life lost. Visit this interactive memorial to honor ${casualtyCount.toLocaleString()} Palestinian souls from Gaza. 🕯️ #GazaMemorial #NeverForget #Palestine #RememberThem`
  const shortText = `Gaza Memorial - ${casualtyCount.toLocaleString()} lives remembered 🕯️`

  const handleCopyLink = async () => {
    try {
      const urlToCopy = shareUrl || window.location.href
      await navigator.clipboard.writeText(urlToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for older browsers
      const urlToCopy = shareUrl || window.location.href
      const textArea = document.createElement('textarea')
      textArea.value = urlToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '')
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
      color: 'hover:bg-green-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shortText)}`,
      color: 'hover:bg-blue-800'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`,
      color: 'hover:bg-gray-600'
    }
  ]

  return (
    <div className="fixed top-4 right-0 h-full z-10">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-0 ${isExpanded ? 'right-80' : 'right-4'} bg-gray-800/90 hover:bg-gray-700 text-white p-2.5 rounded-l-lg transition-all duration-300 shadow-lg border border-gray-600/50 backdrop-blur-sm`}
        title="Share Memorial"
      >
        <div className="flex items-center gap-2">
          <Share2 size={20} />
          {isExpanded ? <ChevronRight size={16} /> : <ChevronRight size={16} className="rotate-180" />}
        </div>
      </button>

      {/* Sidebar Panel */}
      <div className={`h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Share2 size={20} />
                Share Memorial
              </h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Help others discover this memorial honoring {casualtyCount.toLocaleString()} lives
            </p>
          </div>

          {/* Share Content */}
          <div className="p-6 space-y-6">

            {/* Social Share Buttons */}
            <div className="space-y-3">
              <h3 className="text-white font-medium">Share on Social Media</h3>
              <div className="grid grid-cols-1 gap-2">
                {shareLinks.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 bg-gray-800 ${platform.color} text-white rounded-lg transition-colors text-sm`}
                  >
                    <platform.icon size={16} />
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Copy Link */}
            <div className="space-y-3">
              <h3 className="text-white font-medium">Direct Link</h3>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                <Link size={16} />
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>

            {/* Memorial Message */}
            <div className="space-y-3">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-300 text-sm italic text-center">
                  "To live in hearts we leave behind is not to die"
                </p>
                <p className="text-gray-500 text-xs mt-2 text-center">
                  Share to honor their memory
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
