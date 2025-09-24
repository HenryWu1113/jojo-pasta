import { db, orders, orderItems, contactMessages, user, menuItems, menuCategories } from "@/db";
import { eq, and, desc, asc } from "drizzle-orm";

// 訂單相關操作
export async function createOrder(orderData: {
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupTime: Date;
  totalAmount: string;
  specialNotes?: string;
  items: Array<{
    itemName: string;
    itemPrice: string;
    quantity: number;
    subtotal: string;
  }>;
}) {
  try {
    // 建立訂單
    const [order] = await db.insert(orders).values({
      orderNumber: orderData.orderNumber,
      userId: orderData.userId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      pickupTime: orderData.pickupTime,
      totalAmount: orderData.totalAmount,
      specialNotes: orderData.specialNotes,
    }).returning();

    // 建立訂單項目
    if (orderData.items.length > 0) {
      await db.insert(orderItems).values(
        orderData.items.map(item => ({
          orderId: order.id,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }))
      );
    }

    return order;
  } catch (error) {
    console.error('建立訂單失敗:', error);
    throw new Error('建立訂單失敗');
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));

    if (!order) return null;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return { ...order, items };
  } catch (error) {
    console.error('查詢訂單失敗:', error);
    throw new Error('查詢訂單失敗');
  }
}

export async function getUserOrders(userId: string) {
  try {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('查詢用戶訂單失敗:', error);
    throw new Error('查詢用戶訂單失敗');
  }
}

// 聯絡表單操作
export async function createContactMessage(messageData: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  try {
    const [message] = await db.insert(contactMessages).values(messageData).returning();
    return message;
  } catch (error) {
    console.error('建立聯絡訊息失敗:', error);
    throw new Error('建立聯絡訊息失敗');
  }
}

// LINE 登入相關操作
export async function findUserByLineId(lineUserId: string) {
  try {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.lineUserId, lineUserId));
    
    return existingUser || null;
  } catch (error) {
    console.error('查詢 LINE 用戶失敗:', error);
    throw new Error('查詢 LINE 用戶失敗');
  }
}

export async function createLineUser(userData: {
  name: string;
  email: string;
  image?: string;
  lineUserId: string;
  isVirtualEmail: boolean;
}) {
  try {
    const [newUser] = await db.insert(user).values({
      id: crypto.randomUUID(),
      ...userData,
    }).returning();
    
    return newUser;
  } catch (error) {
    console.error('建立 LINE 用戶失敗:', error);
    throw new Error('建立 LINE 用戶失敗');
  }
}

// 工具函式
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `JJ${timestamp}${random}`;
}

export function generateVirtualEmail(lineUserId: string): string {
  return `line_${lineUserId}@jojo-pasta.virtual`;
}

export function isVirtualEmail(email: string): boolean {
  return email.endsWith('@jojo-pasta.virtual');
}

// 餐點管理相關操作
export async function getAllMenuItems() {
  try {
    return await db
      .select({
        id: menuItems.id,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        categoryId: menuItems.categoryId,
        categoryName: menuCategories.displayName,
        cookTime: menuItems.cookTime,
        rating: menuItems.rating,
        featured: menuItems.featured,
        available: menuItems.available,
        image: menuItems.image,
        images: menuItems.images,
        allergens: menuItems.allergens,
        tags: menuItems.tags,
        sortOrder: menuItems.sortOrder,
        createdAt: menuItems.createdAt,
        updatedAt: menuItems.updatedAt,
      })
      .from(menuItems)
      .leftJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
      .orderBy(asc(menuItems.sortOrder), asc(menuItems.name));
  } catch (error) {
    console.error('取得菜單項目失敗:', error);
    throw new Error('取得菜單項目失敗');
  }
}

export async function getMenuItemById(id: string) {
  try {
    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id));
    
    return item || null;
  } catch (error) {
    console.error('取得菜單項目失敗:', error);
    throw new Error('取得菜單項目失敗');
  }
}

export async function createMenuItem(itemData: {
  name: string;
  description: string;
  price: string;
  categoryId: string;
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
}) {
  try {
    const [newItem] = await db.insert(menuItems).values({
      ...itemData,
      images: itemData.images ? JSON.stringify(itemData.images) : null,
      allergens: itemData.allergens ? JSON.stringify(itemData.allergens) : null,
      tags: itemData.tags ? JSON.stringify(itemData.tags) : null,
    }).returning();
    
    return newItem;
  } catch (error) {
    console.error('建立菜單項目失敗:', error);
    throw new Error('建立菜單項目失敗');
  }
}

export async function updateMenuItem(id: string, itemData: Partial<{
  name: string;
  description: string;
  price: string;
  categoryId: string;
  cookTime: string;
  rating: string;
  featured: boolean;
  available: boolean;
  image: string;
  images: string[];
  allergens: string[];
  tags: string[];
  sortOrder: number;
}>) {
  try {
    const updateData = {
      ...itemData,
      images: itemData.images ? JSON.stringify(itemData.images) : undefined,
      allergens: itemData.allergens ? JSON.stringify(itemData.allergens) : undefined,
      tags: itemData.tags ? JSON.stringify(itemData.tags) : undefined,
      updatedAt: new Date(),
    };

    // 移除 undefined 值
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const [updatedItem] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    
    return updatedItem;
  } catch (error) {
    console.error('更新菜單項目失敗:', error);
    throw new Error('更新菜單項目失敗');
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return true;
  } catch (error) {
    console.error('刪除菜單項目失敗:', error);
    throw new Error('刪除菜單項目失敗');
  }
}

// 餐點分類相關操作
export async function getAllMenuCategories() {
  try {
    return await db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.active, true))
      .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.displayName));
  } catch (error) {
    console.error('取得菜單分類失敗:', error);
    throw new Error('取得菜單分類失敗');
  }
}

export async function createMenuCategory(categoryData: {
  name: string;
  displayName: string;
  description?: string;
  sortOrder?: number;
}) {
  try {
    const [newCategory] = await db.insert(menuCategories).values(categoryData).returning();
    return newCategory;
  } catch (error) {
    console.error('建立菜單分類失敗:', error);
    throw new Error('建立菜單分類失敗');
  }
}

// 初始化預設分類
export async function initializeDefaultCategories() {
  try {
    const existingCategories = await getAllMenuCategories();
    
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
    throw new Error('初始化預設分類失敗');
  }
}