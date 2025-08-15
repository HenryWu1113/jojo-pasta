import { db, orders, orderItems, contactMessages, user } from "@/db";
import { eq, and, desc } from "drizzle-orm";

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