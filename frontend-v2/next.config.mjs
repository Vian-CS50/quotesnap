/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Link', value: '</manifest.json>; rel=manifest' },
          { key: 'X-Theme-Color', value: '#1B4D3E' },
        ],
      },
    ];
  },
  async rewrites() {
    // Only proxy API requests during local development
    // In production, API calls go directly from browser to Render backend
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8341'}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
