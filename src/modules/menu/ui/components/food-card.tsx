"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChefHat, Clock } from "lucide-react";
import Image from "next/image";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  rating: number;
  category: string;
  cookTime: string;
  image: string;
  featured: boolean;
}

interface FoodCardProps {
  items: MenuItem[];
}

export const FoodCard = ({ items }: FoodCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      義大利麵: "bg-primary/10 text-primary",
      炸物: "bg-orange-100 text-orange-600",
      飲料: "bg-accent/10 text-accent",
      點心: "bg-yellow-100 text-yellow-700",
      沙拉: "bg-green-100 text-green-600",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-muted text-muted-foreground"
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {items.map((item, index) => {
        const isFeatured = item.featured;

        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* 背景圖片 - 統一高度 */}
            <div className="relative h-80 bg-gradient-to-br from-primary/20 to-accent/20">
              <Image
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                width={500}
                height={500}
              />

              {/* 漸層遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* 浮動標籤 */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <Badge
                  className={`${getCategoryColor(item.category)} backdrop-blur-sm`}
                >
                  {item.category}
                </Badge>
                {isFeatured && (
                  <Badge className="bg-yellow-400 text-black backdrop-blur-sm">
                    <ChefHat className="w-3 h-3 mr-1" />
                    主廚推薦
                  </Badge>
                )}
              </div>

              {/* 評分和時間 */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-xs font-medium">
                    {item.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Clock className="w-3 h-3 text-white" />
                  <span className="text-white text-xs">{item.cookTime}</span>
                </div>
              </div>

              {/* 主要內容 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3
                    className={`font-playfair font-bold text-white mb-2 ${isFeatured ? "text-2xl md:text-3xl" : "text-xl"}`}
                  >
                    {item.name}
                  </h3>

                  <p
                    className={`text-white/90 mb-4 leading-relaxed ${isFeatured ? "text-base" : "text-sm"} line-clamp-2 group-hover:line-clamp-none transition-all duration-300`}
                  >
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div
                      className={`font-bold text-yellow-400 font-playfair ${isFeatured ? "text-3xl" : "text-2xl"}`}
                    >
                      NT${item.price}
                    </div>

                    <Button
                      size={isFeatured ? "default" : "sm"}
                      className="bg-white/10 hover:bg-white hover:text-primary backdrop-blur-sm border border-white/20 transform transition-all duration-300 group-hover:scale-110"
                    >
                      加入訂單
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
