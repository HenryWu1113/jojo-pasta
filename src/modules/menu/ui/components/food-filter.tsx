"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface FoodFilterProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredItemsCount: number;
  categories: string[];
}

export const FoodFilter = ({
  searchText,
  setSearchText,
  selectedCategory,
  setSelectedCategory,
  filteredItemsCount,
  categories,
}: FoodFilterProps) => {
  return (
    <div className="mb-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* 搜尋框 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜尋菜品名稱或描述..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 bg-white/50 border-orange-200 focus:border-primary"
            />
          </div>

          {/* 類別篩選 */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2 mr-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                分類：
              </span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white/50 border-black/10 text-foreground hover:bg-orange-500/10"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* 搜尋結果統計 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            找到{" "}
            <span className="font-semibold text-primary">
              {filteredItemsCount}
            </span>{" "}
            項結果
            {searchText && ` - 搜尋關鍵字：「${searchText}」`}
            {selectedCategory !== "全部" && ` - 分類：「${selectedCategory}」`}
          </p>
        </div>
      </div>
    </div>
  );
};
