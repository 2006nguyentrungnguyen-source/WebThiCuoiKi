import type { Product } from "@/types/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu"];
const SIZES = ["S", "M", "L", "XL"];
const BRANDS = ["Acme", "Contoso", "Umbra", "Nova"];

const CUSTOM_NAMES = [
  "Trà sữa trân châu đen", "Trà sữa trân châu trắng", "Trà sữa trân châu hoàng kim",
  "Trà sữa truyền thống", "Trà sữa ít đường", "Trà sữa không đường",
  "Trà sữa socola", "Trà sữa caramel", "Trà sữa bạc hà", "Trà sữa vani",
  "Trà sữa matcha", "Trà sữa hồng trà", "Trà sữa lục trà", "Trà sữa ô long",
  "Trà sữa trà đen", "Trà sữa trà xanh", "Trà sữa hoa nhài", "Trà sữa Earl Grey",
  "Trà sữa kem cheese", "Trà sữa macchiato", "Trà sữa pudding trứng",
  "Trà sữa pudding socola", "Trà sữa flan", "Trà sữa sương sáo",
  "Trà sữa thạch cà phê", "Trà sữa thạch trái cây", "Trà sữa dâu",
  "Trà sữa xoài", "Trà sữa đào", "Trà sữa vải", "Trà sữa kiwi",
  "Trà sữa chuối", "Trà sữa việt quất", "Trà sữa dưa lưới",
  "Trà sữa trân châu + pudding", "Trà sữa trân châu + thạch phô mai",
  "Trà sữa 3Q", "Trà sữa trân châu đường đen", "Trà sữa full topping",
  "Trà sữa trân châu mini", "Trà sữa gạo rang", "Trà sữa khoai môn",
  "Trà sữa khoai lang tím", "Trà sữa dừa", "Trà sữa hạnh nhân",
  "Trà sữa mè đen", "Trà sữa yến mạch", "Trà sữa sầu riêng",
  "Trà sữa phô mai tươi", "Trà sữa kem trứng",
  // Thêm 10 sản phẩm mới cho đủ 60
  "Trà sữa nướng", "Trà sữa hạt dẻ", "Trà sữa hạt sen", 
  "Trà sữa bí đao", "Trà sữa sâm dứa", "Trà sữa khúc bạch",
  "Trà sữa thạch củ năng", "Trà sữa nếp cẩm", "Trà sữa đậu biếc",
  "Trà sữa ngũ cốc"
];

export const PRODUCTS: Product[] = Array.from({ length: 60 }, (_, i) => {
  const n = i + 1;
  const title = CUSTOM_NAMES[i] ?? `Sản phẩm #${n}`; 
  
  // Tạo slug sạch hơn (xử lý dấu tiếng Việt và ký tự đặc biệt)
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt như +
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    _id: `p${n}`,
    title,
    slug,
    price: 30000 + (n % 5) * 5000, // Giá dao động từ 30k - 50k
    // Nếu bạn có đủ 60 ảnh thì i + 1, nếu không nó sẽ quay vòng lại ảnh cũ
    images: [`/anh/${n <= 60 ? n : "placeholder"}.jpg`],
    stock: n % 10 === 0 ? 0 : ((n * 7) % 25) + 1,
    rating: (n % 3) + 3, // Rating từ 3 đến 5 sao
    brand: BRANDS[n % BRANDS.length],
    variants: [{ color: COLORS[n % COLORS.length], size: SIZES[n % SIZES.length] }],
    description: `Thưởng thức hương vị tuyệt vời của ${title}. Nguyên liệu tự nhiên, quy trình chế biến đảm bảo vệ sinh an toàn thực phẩm.`,
    category: n % 2 ? "fashion" : "accessories", // Bạn có thể đổi thành "milktea" nếu muốn
  } satisfies Product;
});