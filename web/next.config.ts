import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Chỉ định thư mục root để tránh cảnh báo
  outputFileTracingRoot: process.cwd(),
  
  // Cấu hình output cho production
  output: 'standalone',
  
  // Các cấu hình khác nếu cần
  eslint: {
    ignoreDuringBuilds: true, // Tạm thời bỏ qua lỗi eslint khi build
  },
  typescript: {
    ignoreBuildErrors: false, // Giữ nguyên để check TypeScript
  },
};

export default nextConfig;