"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "./image-upload";

// 表單驗證 schema
const menuItemSchema = z.object({
  name: z.string().min(1, "餐點名稱為必填").max(100, "餐點名稱不能超過 100 字元"),
  description: z.string().min(1, "餐點描述為必填").max(500, "餐點描述不能超過 500 字元"),
  price: z.string().min(1, "價格為必填"),
  category: z.string().min(1, "分類為必填"),
  cookTime: z.string().optional(),
  rating: z.string().optional(),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
  image: z.string().optional(),
  tags: z.string().optional(), // 以逗號分隔的字串
  allergens: z.string().optional(), // 以逗號分隔的字串
  sortOrder: z.number().optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  item?: any; // 編輯時的現有資料
  onClose: () => void;
  categories: Array<{ name: string; displayName: string }>;
}

export const MenuItemForm = ({ item, onClose, categories }: MenuItemFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!item;

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || "",
      category: item?.category || "",
      cookTime: item?.cookTime || "",
      rating: item?.rating || "0",
      featured: item?.featured || false,
      available: item?.available !== undefined ? item.available : true,
      image: item?.image || "",
      tags: item?.tags?.join(", ") || "",
      allergens: item?.allergens?.join(", ") || "",
      sortOrder: item?.sortOrder || 0,
    },
  });

  const onSubmit = async (data: MenuItemFormData) => {
    setIsSubmitting(true);
    try {
      // 處理標籤和過敏原（轉換為陣列）
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        allergens: data.allergens ? data.allergens.split(",").map(allergen => allergen.trim()).filter(Boolean) : [],
        rating: data.rating || "0",
        sortOrder: data.sortOrder || 0,
      };

      const url = isEditing 
        ? `/api/admin/menu-items/${item.id}`
        : `/api/admin/menu-items`;
      
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || (isEditing ? "餐點更新成功" : "餐點建立成功"));
        onClose();
      } else {
        alert(result.error || "操作失敗");
      }
    } catch (error) {
      console.error("提交表單失敗:", error);
      alert("操作失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 標題和返回按鈕 */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "編輯餐點" : "新增餐點"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "修改餐點資訊" : "建立新的菜單項目"}
            </p>
          </div>
        </div>

        {/* 表單 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 餐點名稱 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>餐點名稱 *</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入餐點名稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 價格 */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>價格 *</FormLabel>
                    <FormControl>
                      <Input placeholder="例：280" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 餐點描述 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>餐點描述 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="描述這道餐點的特色、食材等..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 分類 */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分類 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇分類" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 製作時間 */}
              <FormField
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>製作時間</FormLabel>
                    <FormControl>
                      <Input placeholder="例：15分鐘" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 圖片上傳 */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 標籤 */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>標籤</FormLabel>
                    <FormControl>
                      <Input placeholder="辣, 素食, 招牌" {...field} />
                    </FormControl>
                    <FormDescription>
                      用逗號分隔多個標籤
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 過敏原 */}
              <FormField
                control={form.control}
                name="allergens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>過敏原</FormLabel>
                    <FormControl>
                      <Input placeholder="麩質, 蛋, 奶" {...field} />
                    </FormControl>
                    <FormDescription>
                      用逗號分隔多個過敏原
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 選項 */}
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>推薦餐點</FormLabel>
                      <FormDescription>
                        在首頁和菜單中突出顯示
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>可供應</FormLabel>
                      <FormDescription>
                        取消勾選將暫停供應此餐點
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* 提交按鈕 */}
            <div className="flex items-center gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting
                  ? "處理中..."
                  : isEditing
                  ? "更新餐點"
                  : "建立餐點"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};