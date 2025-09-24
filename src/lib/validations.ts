import { z } from "zod";

// 餐點表單驗證 schema
export const menuItemSchema = z.object({
  name: z
    .string()
    .min(2, "餐點名稱至少需要 2 個字元")
    .max(100, "餐點名稱不能超過 100 字元"),
  
  description: z
    .string()
    .min(10, "餐點描述至少需要 10 個字元")
    .max(500, "餐點描述不能超過 500 字元"),
  
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "請輸入有效的價格格式（如：380 或 380.50）")
    .refine((val) => parseFloat(val) > 0, "價格必須大於 0"),
  
  categoryId: z
    .string()
    .min(1, "請選擇餐點分類"),
  
  cookTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+分鐘$/.test(val),
      "製作時間格式應為「15分鐘」"
    ),
  
  rating: z
    .string()
    .optional()
    .refine(
      (val) => !val || (/^\d(\.\d)?$/.test(val) && parseFloat(val) >= 0 && parseFloat(val) <= 5),
      "評分應為 0-5 之間的數字"
    ),
  
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  
  image: z
    .string()
    .url("請輸入有效的圖片 URL")
    .optional()
    .or(z.literal("")),
  
  images: z
    .array(z.string().url("請輸入有效的圖片 URL"))
    .optional(),
  
  allergens: z
    .array(z.string().min(1, "過敏原不能為空"))
    .optional(),
  
  tags: z
    .array(z.string().min(1, "標籤不能為空"))
    .optional(),
  
  sortOrder: z
    .number()
    .int("排序必須為整數")
    .min(0, "排序不能為負數")
    .optional(),
});

// 餐點分類表單驗證 schema
export const menuCategorySchema = z.object({
  name: z
    .string()
    .min(2, "分類名稱至少需要 2 個字元")
    .max(50, "分類名稱不能超過 50 字元")
    .regex(/^[a-z-]+$/, "分類名稱只能包含小寫字母和連字符"),
  
  displayName: z
    .string()
    .min(2, "顯示名稱至少需要 2 個字元")
    .max(50, "顯示名稱不能超過 50 字元"),
  
  description: z
    .string()
    .max(200, "描述不能超過 200 字元")
    .optional(),
  
  sortOrder: z
    .number()
    .int("排序必須為整數")
    .min(0, "排序不能為負數")
    .optional(),
});

// 訂單表單驗證 schema
export const orderSchema = z.object({
  customerName: z
    .string()
    .min(2, "姓名至少需要 2 個字元")
    .max(50, "姓名不能超過 50 字元"),
  
  customerPhone: z
    .string()
    .regex(/^09\d{8}$/, "請輸入有效的手機號碼格式（09xxxxxxxx）"),
  
  customerEmail: z
    .string()
    .email("請輸入有效的電子郵件")
    .optional()
    .or(z.literal("")),
  
  pickupTime: z
    .string()
    .datetime("請選擇有效的取餐時間"),
  
  specialNotes: z
    .string()
    .max(200, "備註不能超過 200 字元")
    .optional(),
});

// 聯絡表單驗證 schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "姓名至少需要 2 個字元")
    .max(50, "姓名不能超過 50 字元"),
  
  email: z
    .string()
    .email("請輸入有效的電子郵件"),
  
  subject: z
    .string()
    .max(100, "主旨不能超過 100 字元")
    .optional(),
  
  message: z
    .string()
    .min(10, "訊息至少需要 10 個字元")
    .max(1000, "訊息不能超過 1000 字元"),
});

// TypeScript 類型匯出
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type MenuCategoryFormData = z.infer<typeof menuCategorySchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;