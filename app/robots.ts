import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hunt-compare.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/home/',
          '/cadastro/',
          '/detalhe/',
          '/comparar/',
          '/auth/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/registros-publicos',
          '/detalhe-publico/',
        ],
        disallow: [
          '/home/',
          '/cadastro/',
          '/detalhe/',
          '/comparar/',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}