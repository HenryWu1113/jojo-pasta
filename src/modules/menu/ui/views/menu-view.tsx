"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { FoodFilter } from "../components/food-filter";
import { FoodCard } from "../components/food-card";

export const MenuView = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const menuItems = [
    // 義大利麵類
    {
      name: "經典義式肉醬麵",
      description: "手工製作新鮮義大利麵條，搭配傳統波隆納肉醬",
      price: "380",
      rating: 4.8,
      category: "義大利麵",
      cookTime: "15分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "奶油培根蛋麵",
      description: "濃郁奶油醬汁配上香脆培根，經典羅馬風味",
      price: "420",
      rating: 4.9,
      category: "義大利麵",
      cookTime: "12分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: true,
    },
    {
      name: "蒜香辣椒義大利麵",
      description: "簡單卻不平凡的經典搭配，香蒜與辣椒的完美結合",
      price: "320",
      rating: 4.7,
      category: "義大利麵",
      cookTime: "10分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "白醬蘑菇筆管麵",
      description: "新鮮蘑菇搭配濃郁白醬，口感豐富層次分明",
      price: "360",
      rating: 4.6,
      category: "義大利麵",
      cookTime: "18分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "海鮮墨魚麵",
      description: "新鮮海鮮配上墨魚汁，視覺與味覺的雙重享受",
      price: "480",
      rating: 4.9,
      category: "義大利麵",
      cookTime: "20分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: true,
    },
    {
      name: "松露野菇義大利麵",
      description: "頂級松露搭配多種野菇，奢華美味體驗",
      price: "580",
      rating: 5.0,
      category: "義大利麵",
      cookTime: "25分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: true,
    },
    {
      name: "青醬雞肉義大利麵",
      description: "新鮮羅勒青醬配上嫩煎雞胸肉，香氣迷人",
      price: "390",
      rating: 4.7,
      category: "義大利麵",
      cookTime: "16分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "番茄海鮮義大利麵",
      description: "新鮮番茄醬汁搭配蝦仁蛤蜊，酸甜開胃",
      price: "450",
      rating: 4.8,
      category: "義大利麵",
      cookTime: "18分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },

    // 炸物類
    {
      name: "黃金洋蔥圈",
      description: "酥脆外皮包裹甜美洋蔥，配上特製蒜香醬",
      price: "180",
      rating: 4.5,
      category: "炸物",
      cookTime: "8分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "香酥薯條",
      description: "外酥內軟的比利時薯條，撒上海鹽和迷迭香",
      price: "120",
      rating: 4.6,
      category: "炸物",
      cookTime: "6分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "義式炸雞翅",
      description: "香草醃製炸雞翅，外皮金黃酥脆內肉鮮嫩",
      price: "250",
      rating: 4.7,
      category: "炸物",
      cookTime: "12分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "起司薯球",
      description: "外酥內軟的馬鈴薯球，內餡滿滿起司絲",
      price: "160",
      rating: 4.4,
      category: "炸物",
      cookTime: "7分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "炸花枝圈",
      description: "新鮮花枝圈裹上酥脆麵衣，配檸檬汁享用",
      price: "220",
      rating: 4.6,
      category: "炸物",
      cookTime: "10分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },

    // 飲料類
    {
      name: "經典義式濃縮咖啡",
      description: "香濃醇厚的義式濃縮，咖啡愛好者的首選",
      price: "80",
      rating: 4.8,
      category: "飲料",
      cookTime: "3分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "卡布奇諾",
      description: "濃縮咖啡配上綿密奶泡，經典義式咖啡",
      price: "120",
      rating: 4.7,
      category: "飲料",
      cookTime: "5分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "拿鐵咖啡",
      description: "香醇咖啡與牛奶的完美融合，口感順滑",
      price: "110",
      rating: 4.6,
      category: "飲料",
      cookTime: "4分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "英式伯爵紅茶",
      description: "經典伯爵紅茶，佛手柑香氣濃郁迷人",
      price: "90",
      rating: 4.5,
      category: "飲料",
      cookTime: "5分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "日式抹茶拿鐵",
      description: "濃郁抹茶配上香醇牛奶，和風與義式的結合",
      price: "130",
      rating: 4.7,
      category: "飲料",
      cookTime: "6分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "檸檬蜂蜜茶",
      description: "清香檸檬配上天然蜂蜜，清爽解膩",
      price: "100",
      rating: 4.4,
      category: "飲料",
      cookTime: "4分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "氣泡水",
      description: "清爽氣泡水，配檸檬片或薄荷葉",
      price: "60",
      rating: 4.2,
      category: "飲料",
      cookTime: "1分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },

    // 點心類
    {
      name: "提拉米蘇",
      description: "經典義式甜點，層層疊疊的咖啡香與奶香",
      price: "180",
      rating: 4.9,
      category: "點心",
      cookTime: "即享",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: true,
    },
    {
      name: "義式奶酪",
      description: "絲滑奶酪配上新鮮莓果醬，口感清爽",
      price: "150",
      rating: 4.6,
      category: "點心",
      cookTime: "即享",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "檸檬塔",
      description: "酸甜檸檬卡仕達配上酥脆塔皮，清香怡人",
      price: "160",
      rating: 4.7,
      category: "點心",
      cookTime: "即享",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "巧克力熔岩蛋糕",
      description: "溫熱巧克力蛋糕，切開流出濃郁巧克力醬",
      price: "200",
      rating: 4.8,
      category: "點心",
      cookTime: "8分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "義式冰淇淋",
      description: "手工製作的義式冰淇淋，香草、巧克力、草莓三選一",
      price: "120",
      rating: 4.5,
      category: "點心",
      cookTime: "即享",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "司康餅",
      description: "英式司康餅配奶油果醬，下午茶的最佳選擇",
      price: "100",
      rating: 4.3,
      category: "點心",
      cookTime: "即享",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },

    // 沙拉類
    {
      name: "凱薩沙拉",
      description: "新鮮羅馬生菜配經典凱薩醬，撒上帕馬森起司",
      price: "280",
      rating: 4.5,
      category: "沙拉",
      cookTime: "5分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "義式蕃茄莫札瑞拉",
      description: "新鮮番茄配水牛莫札瑞拉，淋上初榨橄欖油",
      price: "320",
      rating: 4.7,
      category: "沙拉",
      cookTime: "3分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
    {
      name: "綜合堅果沙拉",
      description: "時令蔬果配核桃杏仁，健康美味兼具",
      price: "250",
      rating: 4.4,
      category: "沙拉",
      cookTime: "5分鐘",
      image:
        "https://res.cloudinary.com/dxnin6pf6/image/upload/v1714232821/tehmuqpaviskp4oqbwnh.jpg",
      featured: false,
    },
  ];

  const categories = ["全部", "義大利麵", "炸物", "飲料", "點心", "沙拉"];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory =
        selectedCategory === "全部" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  return (
    <main className="flex flex-col justify-center min-h-screen mt-[64px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 mt-5">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            精選菜單
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            從經典傳統到創新口味，每一道料理都是我們對義大利美食文化的詮釋
          </p>
        </div>

        {/* 篩選功能區 */}
        <FoodFilter
          searchText={searchText}
          setSearchText={setSearchText}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredItemsCount={filteredItems.length}
          categories={categories}
        />

        {/* 卡片佈局 */}
        <FoodCard items={filteredItems} />
      </div>
    </main>
  );
};
