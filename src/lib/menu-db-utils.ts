import { db, menuItems, menuCategories, user } from "@/db";
import { eq, and, desc, asc, like, or } from "drizzle-orm";

// 餐點相關介面
export interface CreateMenuItemData {
  name: string;
  description: string;
  price: string;
  category: string;
  cookTime?: string;
  rating?: string;
  featured?: boolean;
  available?: boolean;
  image?: string;
  images?: string[];
  allergens?: string[];
  tags?: string[];
  sortOrder?: number;
  createdBy?: string;
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {
  id: string;
}

export interface MenuItemFilters {
  category?: string;
  available?: boolean;
  featured?: boolean;
  search?: string;
}

// 餐點 CRUD 操作
export async function createMenuItem(data: CreateMenuItemData) {
  try {
    const [menuItem] = await db.insert(menuItems).values({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      cookTime: data.cookTime,
      rating: data.rating || "0",
      featured: data.featured || false,
      available: data.available !== undefined ? data.available : true,
      image: data.image,
      images: data.images ? JSON.stringify(data.images) : null,
      allergens: data.allergens ? JSON.stringify(data.allergens) : null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      sortOrder: data.sortOrder || 0,
      createdBy: data.createdBy,
    }).returning();

    return menuItem;
  } catch (error) {
    console.error('建立餐點失敗:', error);
    throw new Error('建立餐點失敗');
  }
}

export async function getMenuItems(filters?: MenuItemFilters) {
  try {
    let query = db.select().from(menuItems);

    // 建立條件陣列
    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(menuItems.category, filters.category));
    }

    if (filters?.available !== undefined) {
      conditions.push(eq(menuItems.available, filters.available));
    }

    if (filters?.featured !== undefined) {
      conditions.push(eq(menuItems.featured, filters.featured));
    }

    if (filters?.search) {
      conditions.push(
        or(
          like(menuItems.name, `%${filters.search}%`),
          like(menuItems.description, `%${filters.search}%`)
        )
      );
    }

    // 應用條件
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // 排序
    const items = await query.orderBy(asc(menuItems.sortOrder), asc(menuItems.name));

    // 解析 JSON 欄位
    return items.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
      allergens: item.allergens ? JSON.parse(item.allergens) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
    }));
  } catch (error) {
    console.error('查詢餐點失敗:', error);
    throw new Error('查詢餐點失敗');
  }
}

export async function getMenuItemById(id: string) {
  try {
    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id));

    if (!item) return null;

    // 解析 JSON 欄位
    return {
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
      allergens: item.allergens ? JSON.parse(item.allergens) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
    };
  } catch (error) {
    console.error('查詢餐點失敗:', error);
    throw new Error('查詢餐點失敗');
  }
}

export async function updateMenuItem(data: UpdateMenuItemData) {
  try {
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // 處理 JSON 欄位
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }
    if (data.allergens) {
      updateData.allergens = JSON.stringify(data.allergens);
    }
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }

    // 移除 id 欄位
    delete updateData.id;

    const [updatedItem] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, data.id))
      .returning();

    return updatedItem;
  } catch (error) {
    console.error('更新餐點失敗:', error);
    throw new Error('更新餐點失敗');
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const [deletedItem] = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();

    return deletedItem;
  } catch (error) {
    console.error('刪除餐點失敗:', error);
    throw new Error('刪除餐點失敗');
  }
}

// 分類相關操作
export async function createMenuCategory(data: {
  name: string;
  displayName: string;
  description?: string;
  sortOrder?: number;
}) {
  try {
    const [category] = await db.insert(menuCategories).values({
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      sortOrder: data.sortOrder || 0,
    }).returning();

    return category;
  } catch (error) {
    console.error('建立分類失敗:', error);
    throw new Error('建立分類失敗');
  }
}

export async function getMenuCategories(activeOnly = true) {
  try {
    let query = db.select().from(menuCategories);

    if (activeOnly) {
      query = query.where(eq(menuCategories.active, true));
    }

    return await query.orderBy(asc(menuCategories.sortOrder), asc(menuCategories.displayName));
  } catch (error) {
    console.error('查詢分類失敗:', error);
    throw new Error('查詢分類失敗');
  }
}

// 初始化預設分類
export async function initializeDefaultCategories() {
  try {
    const existingCategories = await getMenuCategories(false);
    
    if (existingCategories.length === 0) {
      const defaultCategories = [
        { name: 'pasta', displayName: '義大利麵', sortOrder: 1 },
        { name: 'fried', displayName: '炸物', sortOrder: 2 },
        { name: 'drinks', displayName: '飲料', sortOrder: 3 },
        { name: 'desserts', displayName: '點心', sortOrder: 4 },
        { name: 'salads', displayName: '沙拉', sortOrder: 5 },
      ];

      for (const category of defaultCategories) {
        await createMenuCategory(category);
      }

      console.log('預設分類建立完成');
    }
  } catch (error) {
    console.error('初始化預設分類失敗:', error);
  }
}