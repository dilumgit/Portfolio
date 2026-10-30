/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable gzip/brotli compression for all responses
  compress: true,

  // Optimise large icon/animation library imports (tree-shaking)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
  },

  images: {
    // Prefer modern AVIF format (smaller), fall back to WebP
    formats: ['image/avif', 'image/webp'],
    // Cache optimised images for 1 week in the CDN
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
