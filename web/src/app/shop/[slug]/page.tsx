"use client"; // [QUAN TRỌNG] Thêm dòng này để hỗ trợ style-jsx và các tương tác client

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";
import { use } from "react"; // Sử dụng để giải nén params trong Client Component

interface Props {
  params: Promise<{ slug: string }>;
}

// Lưu ý: Metadata phải được xử lý riêng hoặc chuyển vào một file layout/page server
// Vì đây là Client Component, chúng ta sẽ tập trung vào phần hiển thị.

export default function ProductDetailPage({ params }: Props) {
  // Giải nén params bằng React.use() vì params là một Promise
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) return notFound();

  const image = product.images?.[0] ?? "/placeholder.png";
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <main className="py-8 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* HÌNH ẢNH */}
          <div className="overflow-hidden rounded-2xl border shadow-sm group bg-white">
            <Image
              src={image}
              alt={product.title}
              width={640}
              height={640}
              priority // Ưu tiên load ảnh sản phẩm
              className="
                w-full h-auto object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
            />
          </div>

          {/* THÔNG TIN */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Mã sản phẩm: {product.slug}
            </p>

            <p className="mt-4 text-3xl font-extrabold text-[#8B1E1E]">
              {formatVND(product.price)}
            </p>

            {isOutOfStock ? (
              <p className="mt-2 text-red-600 font-medium">Hết hàng</p>
            ) : (
              <p className="mt-2 text-green-600 font-medium">
                Còn {product.stock} sản phẩm
              </p>
            )}

            {/* ACTION */}
            <div className="mt-6 flex gap-4 flex-wrap items-center">

              {/* ADD TO CART */}
              <div
                className="
                  h-11 rounded-full
                  border border-[#8B1E1E]
                  hover:bg-[#8B1E1E]/10
                  transition-colors
                  flex items-center overflow-hidden
                "
              >
                <AddToCartButton
                  product={product}
                  disabled={isOutOfStock}
                  fullWidth={false}
                />
              </div>

              {/* BUY NOW */}
              {isOutOfStock ? (
                <button
                  disabled
                  className="
                    h-11 px-6 rounded-full
                    bg-gray-300 text-gray-500
                    cursor-not-allowed
                  "
                >
                  Mua ngay
                </button>
              ) : (
                <Link
                  href={`/checkout?items=${product.slug}:1`}
                  className="
                    h-11 px-6 rounded-full
                    bg-[#8B1E1E] text-white font-semibold
                    hover:bg-[#6f1717]
                    active:scale-95
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                    flex items-center justify-center
                  "
                >
                  Mua ngay
                </Link>
              )}

              {/* BACK */}
              <Link
                href="/shop"
                className="
                  h-11 px-6 rounded-full
                  border border-gray-300
                  text-gray-700
                  hover:bg-gray-50
                  transition-colors
                  flex items-center
                "
              >
                ← Quay lại Shop
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Sửa style jsx để đảm bảo build không lỗi */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}