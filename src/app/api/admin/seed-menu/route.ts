import { createMenuItem } from "@/lib/menu-db-utils";

const sampleMenuItems = [
  {
    name: "經典義式肉醬麵",
    description: "手工製作新鮮義大利麵條，搭配傳統波隆納肉醬",
    price: "380",
    category: "pasta",
    cookTime: "15分鐘",
    rating: "4.8",
    featured: false,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    tags: ["經典", "肉醬"],
    allergens: ["麩質"],
  },
  {
    name: "奶油培根蛋麵",
    description: "濃郁奶油醬汁配上香脆培根，經典羅馬風味",
    price: "420",
    category: "pasta",
    cookTime: "12分鐘",
    rating: "4.9",
    featured: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    tags: ["奶油", "培根", "推薦"],
    allergens: ["麩質", "蛋", "奶"],
  },
  {
    name: "黃金洋蔥圈",
    description: "酥脆外皮包裹甜美洋蔥，配上特製蒜香醬",
    price: "180",
    category: "fried",
    cookTime: "8分鐘",
    rating: "4.5",
    featured: false,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    tags: ["酥脆", "洋蔥"],
    allergens: ["麩質"],
  },
  {
    name: "提拉米蘇",
    description: "經典義式甜點，層層疊疊的咖啡香與奶香",
    price: "180",
    category: "desserts",
    cookTime: "即享",
    rating: "4.9",
    featured: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    tags: ["甜點", "咖啡", "經典"],
    allergens: ["蛋", "奶"],
  },
  {
    name: "經典義式濃縮咖啡",
    description: "香濃醇厚的義式濃縮，咖啡愛好者的首選",
    price: "80",
    category: "drinks",
    cookTime: "3分鐘",
    rating: "4.8",
    featured: false,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    tags: ["咖啡", "濃縮"],
    allergens: [],
  },
];

export async function POST() {
  try {
    const results = [];
    
    for (const item of sampleMenuItems) {
      try {
        const created = await createMenuItem(item);
        results.push(created);
      } catch (error) {
        console.error(`建立餐點 ${item.name} 失敗:`, error);
      }
    }

    return Response.json({
      success: true,
      message: `成功建立 ${results.length} 個餐點`,
      data: results,
    });
  } catch (error) {
    console.error('建立範例餐點失敗:', error);
    return Response.json(
      { success: false, error: '建立範例餐點失敗' },
      { status: 500 }
    );
  }
}