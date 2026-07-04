import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ilounge.ua',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**', // Разрешаем все пути для этого домена
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;