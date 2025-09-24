import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  // LINE 登入相關欄位
  lineUserId: text("line_user_id").unique(),
  isVirtualEmail: boolean("is_virtual_email").$defaultFn(() => false),
  realEmail: text("real_email"),
  // 管理員權限
  isAdmin: boolean("is_admin").$defaultFn(() => false),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// 訂單資料表
export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // 可選，支援訪客訂單
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  pickupTime: timestamp("pickup_time").notNull(),
  totalAmount: text("total_amount").notNull(), // 使用 text 儲存 decimal
  specialNotes: text("special_notes"),
  status: text("status").$default(() => "pending").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// 餐點分類資料表
export const menuCategories = pgTable("menu_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(), // 英文名稱，用於程式邏輯
  displayName: text("display_name").notNull(), // 顯示名稱（中文）
  description: text("description"),
  sortOrder: integer("sort_order").$default(() => 0),
  active: boolean("active").$default(() => true),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// 餐點資料表
export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // 基本資訊
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(), // 使用 text 儲存 decimal
  category: text("category").notNull(), // 使用分類名稱而非 ID，更靈活
  
  // 詳細資訊
  cookTime: text("cook_time"), // 如 "15分鐘"
  rating: text("rating").$default(() => "0"), // 使用 text 儲存 decimal
  featured: boolean("featured").$default(() => false),
  available: boolean("available").$default(() => true),
  
  // 媒體和標籤
  image: text("image"), // 主要圖片 URL
  images: text("images"), // JSON 陣列格式儲存多張圖片
  allergens: text("allergens"), // JSON 陣列格式儲存過敏原
  tags: text("tags"), // JSON 陣列格式儲存標籤
  
  // 管理資訊
  sortOrder: integer("sort_order").$default(() => 0),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
  createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
});

// 訂單項目資料表
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: text("menu_item_id").references(() => menuItems.id, { onDelete: "set null" }), // 關聯到菜單項目
  itemName: text("item_name").notNull(), // 冗余儲存，防止菜單項目被刪除後訂單資料遺失
  itemPrice: text("item_price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: text("subtotal").notNull(),
});

// 聯絡表單資料表
export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});
