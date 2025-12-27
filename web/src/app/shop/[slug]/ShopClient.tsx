"use client";

import AddToCartButton from "@/features/cart/AddToCartButton";

export default function ShopClient({ slug }: { slug: string }) {
  return (
    <div>
      <h1>Chi tiết sản phẩm: {slug}</h1>
      <AddToCartButton product={{
              _id: "",
              title: "",
              slug: "",
              price: 0,
              images: [],
              stock: 0,
              rating: undefined,
              brand: undefined,
              variants: undefined,
              description: undefined,
              category: undefined
          }} />
    </div>
  );
}
