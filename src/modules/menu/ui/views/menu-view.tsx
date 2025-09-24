"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { FoodFilter } from "../components/food-filter";
import { FoodCard } from "../components/food-card";
import { usePublicMenuItems } from "../hooks/use-public-menu-items";
import { usePublicMenuCategories } from "../hooks/use-public-menu-categories";

export const MenuView = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const { categories: dbCategories } = usePublicMenuCategories();

  // 建立分類映射
  const categoryMap = useMemo(() => {
    const map = new Map();
    dbCategories.forEach(cat => {
      map.set(cat.displayName, cat.name);
    });
    return map;
  }, [dbCategories]);

  // 建立分類列表，包含"全部"選項
  const categories = useMemo(() => {
    const categoryNames = dbCategories.map(cat => cat.displayName);
    return ["全部", ...categoryNames];
  }, [dbCategories]);

  // 使用 API 資料，將顯示名稱轉換為資料庫名稱
  const { menuItems, loading, error } = usePublicMenuItems({
    search: searchText,
    category: selectedCategory === "全部" ? undefined : categoryMap.get(selectedCategory),
  });

  // 由於搜尋和篩選已在 API 層處理，直接使用 menuItems
  const filteredItems = menuItems;

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

        {/* 載入狀態 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">載入菜單中...</p>
            </div>
          </div>
        )}

        {/* 錯誤狀態 */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">載入失敗: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              重新載入
            </Button>
          </div>
        )}

        {/* 卡片佈局 */}
        {!loading && !error && <FoodCard items={filteredItems} />}
      </div>
    </main>
  );
};
