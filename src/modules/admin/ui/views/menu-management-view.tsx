"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { MenuItemList } from "../components/menu-item-list";
import { MenuItemForm } from "../components/menu-item-form";
import { useMenuItems } from "../hooks/use-menu-items";
import { useMenuCategories } from "../hooks/use-menu-categories";

export const MenuManagementView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { menuItems, loading, error, refetch } = useMenuItems({
    search: searchTerm,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const { categories } = useMenuCategories();

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    refetch(); // 重新載入資料
  };

  if (showForm) {
    return (
      <MenuItemForm
        item={editingItem}
        onClose={handleFormClose}
        categories={categories}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* 標題和新增按鈕 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">餐點管理</h1>
            <p className="text-gray-600 mt-2">管理您的菜單項目</p>
          </div>
          <Button onClick={handleCreateNew} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            新增餐點
          </Button>
        </div>

        {/* 搜尋和篩選 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜尋餐點名稱或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="選擇分類" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分類</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 餐點列表 */}
        <MenuItemList
          items={menuItems}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onRefetch={refetch}
        />
      </div>
    </div>
  );
};