import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is required to allow requests from the Supabase Studio environment.
    allowedDevOrigins: [
        'https://6000-firebase-studio-1754636616361.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
