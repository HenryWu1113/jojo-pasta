import { NextRequest } from "next/server";
import { getMenuItemById, updateMenuItem, deleteMenuItem } from "@/lib/menu-db-utils";
import { withAdminAuth } from "@/lib/admin-auth";
import { z } from "zod";

// 更新餐點的驗證 schema
const updateMenuItemSchema = z.object({
  name: z.string().min(1, "餐點名稱為必填").max(100, "餐點名稱不能超過 100 字元").optional(),
  description: z.string().min(1, "餐點描述為必填").max(500, "餐點描述不能超過 500 字元").optional(),
  price: z.string().min(1, "價格為必填").optional(),
  category: z.string().min(1, "分類為必填").optional(),
  cookTime: z.string().optional(),
  rating: z.string().optional(),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  image: z.string().url("請提供有效的圖片 URL").optional().or(z.literal("")),
  images: z.array(z.string().url()).optional(),
  allergens: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
});

// GET - 取得單一餐點
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuItem = await getMenuItemById(params.id);

    if (!menuItem) {
      return Response.json(
        { success: false, error: '餐點不存在' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: menuItem });
  } catch (error) {
    console.error('取得餐點失敗:', error);
    return Response.json(
      { success: false, error: '取得餐點失敗' },
      { status: 500 }
    );
  }
}

// PUT - 更新餐點
export const PUT = withAdminAuth(async (
  request: NextRequest,
  context: any
) => {
  try {
    const { params } = context;
    const body = await request.json();
    
    // 驗證輸入資料
    const validationResult = updateMenuItemSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          error: '資料驗證失敗',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // 檢查餐點是否存在
    const existingItem = await getMenuItemById(params.id);
    if (!existingItem) {
      return Response.json(
        { success: false, error: '餐點不存在' },
        { status: 404 }
      );
    }

    const updateData = {
      id: params.id,
      ...validationResult.data,
    };

    const updatedMenuItem = await updateMenuItem(updateData);

    return Response.json({
      success: true,
      message: '餐點更新成功',
      data: updatedMenuItem,
    });
  } catch (error) {
    console.error('更新餐點失敗:', error);
    return Response.json(
      { success: false, error: '更新餐點失敗' },
      { status: 500 }
    );
  }
});

// DELETE - 刪除餐點
export const DELETE = withAdminAuth(async (
  request: NextRequest,
  context: any
) => {
  try {
    const { params } = context;

    // 檢查餐點是否存在
    const existingItem = await getMenuItemById(params.id);
    if (!existingItem) {
      return Response.json(
        { success: false, error: '餐點不存在' },
        { status: 404 }
      );
    }

    await deleteMenuItem(params.id);

    return Response.json({
      success: true,
      message: '餐點刪除成功',
    });
  } catch (error) {
    console.error('刪除餐點失敗:', error);
    return Response.json(
      { success: false, error: '刪除餐點失敗' },
      { status: 500 }
    );
  }
});