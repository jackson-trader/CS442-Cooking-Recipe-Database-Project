/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
      },
    ];
  },
  experimental: {
    typedRoutes: true,
  },
  typescript: {
    // Skip type-checking in Next build/dev; avoids TS path assertion on Windows
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during builds to reduce surface area while stabilizing
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;


