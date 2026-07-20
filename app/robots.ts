import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/checkout/',
        '/cart/',
        '/login/',
        '/signup/',
        '/verify-email/',
        '/order-confirmed/'
      ],
    },
    sitemap: 'https://goglossy.co.ke/sitemap.xml',
  }
}
