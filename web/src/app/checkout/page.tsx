"use client";

import { useMemo, useState, Suspense } from "react"; // 1. Thêm Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/mock/products";
import { calcTotals } from "@/lib/checkout";

// --- Icons (GIỮ NGUYÊN) ---
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-green-500 mx-auto" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" className="text-green-100 fill-green-50" stroke="none" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Utility Functions (GIỮ NGUYÊN) ---
function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// 2. CHUYỂN LOGIC CHÍNH VÀO ĐÂY (GIỮ NGUYÊN 100% CODE CỦA BẠN)
function CheckoutForm() {
  const sp = useSearchParams();
  const router = useRouter();

  const itemsParam = sp.get("items") || "";
  const parsed = useMemo(() => {
    const list = itemsParam.split(",").map((p) => p.trim()).filter(Boolean)
      .map((pair) => {
        const [slug, qty] = pair.split(":");
        return { slug, quantity: Math.max(parseInt(qty || "1", 10), 1) };
      });
    return list.map((it) => {
        const p = PRODUCTS.find((x) => x.slug === it.slug);
        return p ? { ...it, product: p } : null;
      }).filter(Boolean) as { slug: string; quantity: number; product: (typeof PRODUCTS)[number] }[];
  }, [itemsParam]);

  const totals = useMemo(() => calcTotals(parsed.map((x) => ({ price: x.product.price, quantity: x.quantity })), ""), [parsed]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState("cod");
  const [note, setNote] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!parsed.length) return setError("Giỏ hàng trống.");
    if (!name || !addr) return setError("Vui lòng nhập đủ thông tin.");

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockOrder = {
        id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        customerName: name,
        total: totals.total,
        createdAt: new Date().toLocaleString("vi-VN")
      };
      setResult(mockOrder); 
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen pb-20">
      {/* ... GIỮ NGUYÊN TOÀN BỘ PHẦN RETURN JSX CŨ CỦA BẠN TỪ ĐÂY ĐẾN HẾT ... */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-green-50 p-6 text-center border-b border-green-100">
              <div className="mb-4 transform scale-125">
                <CheckIcon />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-1">Đặt hàng thành công!</h2>
              <p className="text-green-600 text-sm">Cảm ơn bạn đã mua sắm tại Shoply</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-mono font-bold text-gray-900">{result.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-gray-500">Khách hàng</span>
                <span className="font-medium">{result.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-gray-500">Tổng thanh toán</span>
                <span className="font-bold text-xl text-red-600">{formatVND(result.total)}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 text-center">
                Đơn hàng xác nhận lúc: {result.createdAt}
              </div>
            </div>
            <div className="p-6 pt-0 flex flex-col gap-3">
              <button onClick={() => router.push("/")} className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1">Tiếp tục mua sắm</button>
              <button onClick={() => setResult(null)} className="w-full py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors font-medium">Đóng thông báo</button>
            </div>
          </div>
        </div>
      )}

      <section className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
            <h2 className="font-semibold text-lg border-b pb-2">Thông tin giao hàng</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={phone} onChange={e => setPhone(e.target.value)} placeholder="VD: 0909..." />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
              <textarea required rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={addr} onChange={e => setAddr(e.target.value)} placeholder="Địa chỉ..." />
            </div>
            <div className="space-y-1">
               <label className="text-sm font-medium text-gray-700">Ghi chú</label>
               <input className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" value={note} onChange={e => setNote(e.target.value)} placeholder="Lời nhắn..." />
            </div>
            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-300 font-medium">Quay lại</button>
               <button type="submit" disabled={submitting || parsed.length === 0} className="flex-1 bg-black text-white rounded-xl py-3 font-bold">
                 {submitting ? "Đang xử lý..." : `Thanh toán ${formatVND(totals.total)}`}
               </button>
            </div>
          </form>
        </div>

        <aside className="h-fit space-y-6">
          <div className="bg-gray-50 p-5 rounded-2xl border">
            <h3 className="font-bold text-gray-900 mb-4">Đơn hàng của bạn</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {parsed.map((x) => (
                <div key={x.slug} className="flex gap-3 items-start">
                   <div className="w-16 h-16 bg-white rounded-lg border flex-shrink-0 overflow-hidden relative">
                      <img src={x.product.images?.[0] || "/placeholder.png"} alt="" className="w-full h-full object-cover"/>
                      <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">{x.quantity}</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{x.product.title}</p>
                      <p className="text-sm font-semibold mt-1">{formatVND(x.product.price)}</p>
                   </div>
                </div>
              ))}
            </div>
            <div className="border-t my-4 pt-4 flex justify-between items-center">
               <span className="font-bold text-gray-900">Tổng cộng</span>
               <span className="font-bold text-2xl text-black">{formatVND(totals.total)}</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

// 3. COMPONENT CHÍNH ĐỂ EXPORT (FIX LỖI BUILD)
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Đang tải trang thanh toán...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}