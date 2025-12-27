/**
 * Product Detail Page
 * Hiển thị chi tiết sản phẩm với hình ảnh, giá, và nút mua hàng
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";

// ===== METADATA GENERATION =====
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return {
    title: product
      ? `${product.title} — Highland Coffee`
      : "Sản phẩm — Highland Coffee",
    description: product
      ? `Mua ${product.title} với giá ${formatVND(product.price)} tại Highland Coffee`
      : "Khám phá các sản phẩm chất lượng cao tại Highland Coffee",
  };
}

// ===== MAIN COMPONENT =====
export default async function ProductDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  // Return 404 if product not found
  if (!product) return notFound();

  // Product data
  const image = product.images?.[0] ?? "/placeholder.png";
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <main className="py-8 animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

            {/* ===== PRODUCT IMAGE ===== */}
            <div className="overflow-hidden rounded-2xl border shadow-sm group bg-white">
              <Image
                src={image}
                alt={product.title}
                width={640}
                height={640}
                priority
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* ===== PRODUCT INFO ===== */}
            <div className="bg-white rounded-2xl border shadow-sm p-6 lg:p-8 flex flex-col">
              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Product Code */}
              <p className="mt-2 text-sm text-gray-500">
                Mã sản phẩm: <span className="font-medium">{product.slug}</span>
              </p>

              {/* Price */}
              <p className="mt-6 text-4xl font-extrabold text-[#8B1E1E]">
                {formatVND(product.price)}
              </p>

              {/* Stock Status */}
              {isOutOfStock ? (
                <p className="mt-2 text-red-600 font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                  Hết hàng
                </p>
              ) : (
                <p className="mt-2 text-green-600 font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                  Còn {product.stock} sản phẩm
                </p>
              )}

              {/* Description (if available) */}
              {product.description && (
                <div className="mt-6 pt-6 border-t">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Mô tả sản phẩm
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto pt-8 flex gap-3 flex-wrap">

                {/* Add to Cart Button */}
                <div className="flex-1 min-w-[160px]">
                  <div className="h-12 rounded-full border-2 border-[#8B1E1E] hover:bg-[#8B1E1E]/10 transition-colors">
                    <AddToCartButton
                      product={product}
                      disabled={isOutOfStock}
                      fullWidth={false}
                    />
                  </div>
                </div>

                {/* Buy Now Button */}
                {isOutOfStock ? (
                  <button
                    disabled
                    className="flex-1 min-w-[160px] h-12 px-6 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed font-semibold"
                    aria-label="Sản phẩm đã hết hàng"
                  >
                    Mua ngay
                  </button>
                ) : (
                  <Link
                    href={`/checkout?items=${product.slug}:1`}
                    className="flex-1 min-w-[160px] h-12 px-6 rounded-full bg-[#8B1E1E] text-white font-semibold hover:bg-[#6f1717] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                    aria-label="Mua ngay sản phẩm này"
                  >
                    Mua ngay
                  </Link>
                )}
              </div>

              {/* Back to Shop Link */}
              <div className="mt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="Quay lại trang shop"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại Shop
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ===== ANIMATIONS ===== */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
