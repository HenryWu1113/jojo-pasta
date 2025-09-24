import { NextRequest } from "next/server";
import { createMenuItem, getMenuItems } from "@/lib/menu-db-utils";
import { withAdminAuth } from "@/lib/admin-auth";
import { z } from "zod";

// 建立餐點的驗證 schema
const createMenuItemSchema = z.object({
  name: z.string().min(1, "餐點名稱為必填").max(100, "餐點名稱不能超過 100 字元"),
  description: z.string().min(1, "餐點描述為必填").max(500, "餐點描述不能超過 500 字元"),
  price: z.string().min(1, "價格為必填"),
  category: z.string().min(1, "分類為必填"),
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

// GET - 取得所有餐點
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const available = searchParams.get('available') ? searchParams.get('available') === 'true' : undefined;
    const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;
    const search = searchParams.get('search') || undefined;

    const menuItems = await getMenuItems({
      category,
      available,
      featured,
      search,
    });

    return Response.json({ success: true, data: menuItems });
  } catch (error) {
    console.error('取得餐點列表失敗:', error);
    return Response.json(
      { success: false, error: '取得餐點列表失敗' },
      { status: 500 }
    );
  }
});

// POST - 建立新餐點
export const POST = withAdminAuth(async (request: NextRequest, context: any) => {
  try {
    const body = await request.json();
    
    // 驗證輸入資料
    const validationResult = createMenuItemSchema.safeParse(body);
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

    const menuItemData = {
      ...validationResult.data,
      createdBy: context.user.id,
    };

    const newMenuItem = await createMenuItem(menuItemData);

    return Response.json(
      {
        success: true,
        message: '餐點建立成功',
        data: newMenuItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('建立餐點失敗:', error);
    return Response.json(
      { success: false, error: '建立餐點失敗' },
      { status: 500 }
    );
  }
});