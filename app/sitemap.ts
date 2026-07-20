import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://goglossy.co.ke'
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/faqs',
    '/privacy-policy',
    '/refund-policy',
    '/reviews',
    '/shipping-policy',
    '/shop',
    '/terms',
    '/track'
  ]

  const sitemapEntries = routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return sitemapEntries
}
