/**
 * Robots.txt Generation for SEO
 * 
 * Provides instructions to search engine crawlers
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://gazasouls.com/sitemap.xml', // Update with actual domain
  }
}

