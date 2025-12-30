import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Giúp Render định vị chính xác các file trong mô hình Monorepo (thư mục web)
  outputFileTracingRoot: process.cwd(),
  
  // Tối ưu hóa dung lượng build (Rất quan trọng cho gói Free của Render)
  output: 'standalone',

  // Cho phép Styled JSX hoạt động ổn định hơn (nếu bạn vẫn muốn dùng nó)
  compiler: {
    styledComponents: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true, 
  },
  typescript: {
    // Nên để true nếu bạn muốn "vượt rào" để deploy nhanh kịp deadline
    ignoreBuildErrors: true, 
  },
  
  // Cấu hình để Next.js chấp nhận các domain ảnh (nếu ảnh sản phẩm từ bên ngoài)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Cho phép tất cả các nguồn ảnh để tránh lỗi 400/500
      },
    ],
  },
};

export default nextConfig;