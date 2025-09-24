import { db } from "@/db";
import { menuItems, menuCategories } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

// 餐點分類相關函式
export async function getAllCategories() {
  return await db
    .select()
    .from(menuCategories)
    .where(eq(menuCategories.active, true))
    .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.displayName));
}

export async function getCategoryById(id: string) {
  const result = await db
    .select()
    .from(menuCategories)
    .where(eq(menuCategories.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function createCategory(data: {
  name: string;
  displayName: string;
  description?: string;
  sortOrder?: number;
}) {
  const result = await db
    .insert(menuCategories)
    .values({
      ...data,
      sortOrder: data.sortOrder || 0,
    })
    .returning();
  
  return result[0];
}

// 餐點相關函式
export async function getAllMenuItems() {
  return await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      categoryId: menuItems.categoryId,
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
      categoryName: menuCategories.name,
      categoryDisplayName: menuCategories.displayName,
    })
    .from(menuItems)
    .leftJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
    .where(eq(menuItems.available, true))
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.name));
}

export async function getMenuItemsByCategory(categoryId: string) {
  return await db
    .select()
    .from(menuItems)
    .where(and(
      eq(menuItems.categoryId, categoryId),
      eq(menuItems.available, true)
    ))
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.name));
}

export async function getFeaturedMenuItems() {
  return await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      categoryId: menuItems.categoryId,
      cookTime: menuItems.cookTime,
      rating: menuItems.rating,
      featured: menuItems.featured,
      available: menuItems.available,
      image: menuItems.image,
      images: menuItems.images,
      allergens: menuItems.allergens,
      tags: menuItems.tags,
      sortOrder: menuItems.sortOrder,
      categoryName: menuCategories.name,
      categoryDisplayName: menuCategories.displayName,
    })
    .from(menuItems)
    .leftJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
    .where(and(
      eq(menuItems.featured, true),
      eq(menuItems.available, true)
    ))
    .orderBy(asc(menuItems.sortOrder), asc(menuItems.name));
}

export async function getMenuItemById(id: string) {
  const result = await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      categoryId: menuItems.categoryId,
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
      createdBy: menuItems.createdBy,
      categoryName: menuCategories.name,
      categoryDisplayName: menuCategories.displayName,
    })
    .from(menuItems)
    .leftJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
    .where(eq(menuItems.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function createMenuItem(data: {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  cookTime?: string;
  rating?: string;
  featured?: boolean;
  available?: boolean;
  image?: string;
  images?: string;
  allergens?: string;
  tags?: string;
  sortOrder?: number;
  createdBy?: string;
}) {
  const result = await db
    .insert(menuItems)
    .values({
      ...data,
      rating: data.rating || "0",
      featured: data.featured || false,
      available: data.available !== false, // 預設為 true
      sortOrder: data.sortOrder || 0,
    })
    .returning();
  
  return result[0];
}

export async function updateMenuItem(id: string, data: {
  name?: string;
  description?: string;
  price?: string;
  categoryId?: string;
  cookTime?: string;
  rating?: string;
  featured?: boolean;
  available?: boolean;
  image?: string;
  images?: string;
  allergens?: string;
  tags?: string;
  sortOrder?: number;
}) {
  const result = await db
    .update(menuItems)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(menuItems.id, id))
    .returning();
  
  return result[0] || null;
}

export async function deleteMenuItem(id: string) {
  const result = await db
    .delete(menuItems)
    .where(eq(menuItems.id, id))
    .returning();
  
  return result[0] || null;
}

// 管理員專用函式（包含不可用的餐點）
export async function getAllMenuItemsForAdmin() {
  return await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      price: menuItems.price,
      categoryId: menuItems.categoryId,
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
      createdBy: menuItems.createdBy,
      categoryName: menuCategories.name,
      categoryDisplayName: menuCategories.displayName,
    })
    .from(menuItems)
    .leftJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
    .orderBy(desc(menuItems.createdAt));
}

export async function getAllCategoriesForAdmin() {
  return await db
    .select()
    .from(menuCategories)
    .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.displayName));
}