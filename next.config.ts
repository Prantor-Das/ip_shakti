import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't3.ftcdn.net' },
      { protocol: 'https', hostname: 't4.ftcdn.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'images-cdn.reedsy.com' },
      { protocol: 'https', hostname: 'img.magnific.com' },
      { protocol: 'https', hostname: 'www.webopedia.com' },
      { protocol: 'https', hostname: 'cdn.exoticindia.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'thumb.wikimedia.org' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' data: https://cdnjs.cloudflare.com; img-src 'self' data: https://t3.ftcdn.net https://t4.ftcdn.net https://images.unsplash.com https://encrypted-tbn0.gstatic.com https://cdn.pixabay.com https://images-cdn.reedsy.com https://img.magnific.com https://www.webopedia.com https://cdn.exoticindia.com https://i.ytimg.com https://thumb.wikimedia.org; media-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Next 16 requires inline hydration/style support unless a nonce is threaded through the full document.
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(self)' },
        ],
      },
    ];
  },
};

export default nextConfig;
