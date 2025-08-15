# 設計文件

## 概述

基於現有的 Jojo Pasta 網站架構，設計並實作線上外帶自取系統和 LINE 登入功能。利用現有的 Next.js 15、Better Auth、Drizzle ORM、shadcn/ui 技術堆疊，採用模組化設計方式，確保與現有程式碼風格一致。

## 架構設計

### 整體架構（遵循現有模組結構）
```
src/
├── app/
│   ├── takeaway/          # 外帶自取頁面
│   ├── contact/           # 聯絡我們頁面
│   ├── auth/
│   │   ├── login/         # 登入頁面
│   │   └── callback/      # LINE 登入回調
│   └── api/
│       ├── auth/          # Better Auth API 路由
│       ├── orders/        # 訂單 API
│       └── contact/       # 聯絡表單 API
├── modules/
│   ├── auth/              # 身份驗證模組
│   │   └── ui/
│   │       ├── components/
│   │       └── views/
│   ├── takeaway/          # 外帶自取模組
│   │   └── ui/
│   │       ├── components/
│   │       └── views/
│   ├── contact/           # 聯絡我們模組
│   │   └── ui/
│   │       ├── components/
│   │       └── views/
│   └── cart/              # 購物車模組
│       └── ui/
│           └── components/
├── db/
│   └── schema.ts          # 新增訂單和聯絡表單 schema
└── lib/
    ├── auth.ts            # 更新 Better Auth 配置 (加入 LINE)
    ├── auth-client.ts     # 現有的客戶端配置
    └── validations.ts     # 表單驗證 schema
```

### 資料庫設計

#### 更新 Better Auth Schema 處理 LINE 登入

需要在現有的 user 表格中新增欄位來處理 LINE 登入：

```typescript
// src/db/schema.ts - 更新 user 表格
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  // 新增 LINE 相關欄位
  lineUserId: text("line_user_id").unique(), // LINE User ID
  isVirtualEmail: boolean("is_virtual_email").$defaultFn(() => false), // 標記是否為虛擬電子郵件
  realEmail: text("real_email"), // 用戶稍後綁定的真實電子郵件
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
```

#### LINE 登入流程處理
1. **首次 LINE 登入**：
   - 取得 LINE User ID 和顯示名稱
   - 檢查是否有電子郵件，沒有則生成虛擬電子郵件 (`line_${lineUserId}@jojo-pasta.virtual`)
   - 建立新的 user 記錄，設定 `isVirtualEmail: true` 和 `lineUserId`

2. **後續登入**：
   - 使用 LINE User ID 查找現有用戶
   - 建立新的 session

3. **電子郵件綁定**（可選功能）：
   - 提供介面讓用戶綁定真實電子郵件
   - 更新 `realEmail` 欄位

#### 新增訂單相關資料表

##### 訂單資料表 (orders)
```typescript
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
```

##### 訂單項目資料表 (order_items)
```typescript
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: text("menu_item_id").references(() => menuItems.id, { onDelete: "set null" }), // 關聯到菜單項目
  itemName: text("item_name").notNull(), // 冗余儲存，防止菜單項目被刪除後訂單資料遺失
  itemPrice: text("item_price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: text("subtotal").notNull(),
});
```

##### 餐點資料表 (menu_items)
```typescript
export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // 基本資訊
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(), // 使用 text 儲存 decimal
  category: text("category").notNull(),
  
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
```

##### 餐點分類資料表 (menu_categories)
```typescript
export const menuCategories = pgTable("menu_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(), // 顯示名稱（中文）
  description: text("description"),
  sortOrder: integer("sort_order").$default(() => 0),
  active: boolean("active").$default(() => true),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});
```

##### 聯絡表單資料表 (contact_messages)
```typescript
export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});
```

## 元件設計

### 1. 身份驗證模組 (src/modules/auth/)

#### AuthView (登入頁面)
```typescript
// src/modules/auth/ui/views/auth-view.tsx
export const AuthView = () => {
  // 登入頁面容器，包含 LINE 登入按鈕
}
```

#### 子元件：
- **LineLoginButton** - LINE 登入按鈕元件
- **UserProfile** - 使用者資料顯示
- **LogoutButton** - 登出按鈕

### 2. 購物車系統 (src/modules/cart/)

#### CartProvider (Context)
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContext {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}
```

#### 購物車元件
- **CartSummary** - 購物車摘要（顯示在導航列）
- **CartDrawer** - 購物車側邊欄
- **CartItem** - 購物車項目元件

### 3. 外帶自取頁面模組 (src/modules/takeaway/)

#### TakeawayView
```typescript
// src/modules/takeaway/ui/views/takeaway-view.tsx
export const TakeawayView = () => {
  // 主要的外帶自取頁面容器
  // 包含購物車檢視、顧客資訊表單、時間選擇
}
```

#### 子元件 (src/modules/takeaway/ui/components/)：
- **CartReview** - 購物車檢視和編輯
- **CustomerForm** - 顧客資訊表單（已登入用戶自動填入）
- **TimeSlotPicker** - 取餐時間選擇
- **OrderSummary** - 訂單摘要
- **OrderConfirmation** - 訂單確認頁面

### 4. 聯絡我們頁面模組 (src/modules/contact/)

#### ContactView
```typescript
// src/modules/contact/ui/views/contact-view.tsx
export const ContactView = () => {
  // 聯絡我們頁面容器
  // 包含聯絡表單和餐廳資訊
}
```

#### 子元件 (src/modules/contact/ui/components/)：
- **ContactForm** - 聯絡表單（已登入用戶自動填入姓名和電子郵件）
- **ContactInfo** - 餐廳聯絡資訊
- **LocationMap** - 地圖元件（重用 about-us 的 GoogleMap）

### 5. 使用者體驗增強模組 (src/modules/ui/)

#### BackToTop 元件
```typescript
// src/modules/ui/back-to-top.tsx
export const BackToTop = () => {
  // 回到頂部按鈕元件
  // 包含滾動偵測、動畫效果、平滑滾動
}
```

#### 設計特色：
- **創意動畫**：使用義大利麵主題的圖示（如叉子、麵條）
- **彈跳效果**：按鈕出現時有彈跳動畫
- **懸停效果**：滑鼠懸停時旋轉或放大
- **顏色主題**：使用品牌橘色 (#f97316)
- **響應式設計**：行動裝置上適當的大小和位置

## 介面設計

### 身份驗證流程
1. **導航列** → 顯示登入/使用者頭像
2. **登入頁面** → LINE 登入按鈕
3. **LINE 授權** → 重導向到 LINE 登入
4. **回調處理** → 自動建立/更新使用者資料
5. **登入成功** → 重導向回原頁面

### 購物車流程
1. **菜單頁面** → 加入購物車按鈕
2. **購物車摘要** → 顯示在導航列（使用 Badge 顯示數量）
3. **購物車抽屜** → 點擊摘要開啟側邊欄
4. **外帶頁面** → 完整的訂單流程

### 外帶自取流程
1. **購物車檢視** → 確認商品和數量
2. **登入檢查** → 未登入用戶提示登入（可選）
3. **顾客資訊** → 已登入自動填入，未登入手動填寫
4. **時間選擇** → 可用的取餐時間段
5. **訂單確認** → 最終確認和提交
6. **完成頁面** → 訂單編號和取餐資訊

### 時間段邏輯
- 營業時間：11:30-22:00 (週一至週日)
- 週五週六延長至 23:00
- 最短準備時間：30 分鐘
- 時間段間隔：15 分鐘
- 考慮當前時間和製作時間

### 使用者體驗增強
- **已登入用戶**：自動填入個人資訊，查看訂單歷史
- **訪客用戶**：仍可正常訂餐，但需手動填寫資訊
- **購物車持久化**：使用 localStorage 保存購物車狀態
- **響應式設計**：所有元件都支援行動裝置

## Better Auth 配置更新

### LINE 登入自定義實作

由於 Better Auth 沒有內建 LINE 登入支援，且 LINE 不強制要求電子郵件，我們需要自定義實作：

#### 解決方案：
1. **自動生成虛擬電子郵件**：為沒有電子郵件的 LINE 用戶生成唯一的虛擬電子郵件
2. **LINE ID 作為主要識別**：使用 LINE User ID 作為唯一識別符
3. **後續電子郵件綁定**：允許用戶稍後綁定真實電子郵件

#### 更新的 Better Auth 配置
```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // 不使用內建的 socialProviders，改用自定義實作
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
```

#### 自定義 LINE 登入 API
```typescript
// src/app/api/auth/line/route.ts
export async function GET(request: Request) {
  // 處理 LINE 登入重導向
  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.LINE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINE_REDIRECT_URI!)}&state=${generateState()}&scope=profile%20openid`;
  
  return Response.redirect(lineAuthUrl);
}

// src/app/api/auth/line/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // 1. 用 code 換取 access token
  // 2. 用 access token 取得 LINE 用戶資料
  // 3. 檢查用戶是否已存在
  // 4. 如果不存在，建立新用戶（生成虛擬電子郵件）
  // 5. 建立 Better Auth session
}
```

#### 虛擬電子郵件生成策略
```typescript
// src/lib/line-auth-utils.ts
export function generateVirtualEmail(lineUserId: string): string {
  // 使用 LINE User ID 生成唯一的虛擬電子郵件
  return `line_${lineUserId}@jojo-pasta.virtual`;
}

export function isVirtualEmail(email: string): boolean {
  return email.endsWith('@jojo-pasta.virtual');
}
```

### 環境變數設定
```env
# .env.local
LINE_CLIENT_ID=your_line_channel_id
LINE_CLIENT_SECRET=your_line_channel_secret
LINE_REDIRECT_URI=http://localhost:3000/api/auth/line/callback
```

## API 設計

### 身份驗證 API 路由

#### Better Auth 內建路由：
- `POST /api/auth/sign-out` - 登出
- `GET /api/auth/session` - 取得當前 session

#### 自定義 LINE 登入路由：
- `GET /api/auth/line` - 重導向到 LINE 授權頁面
- `GET /api/auth/line/callback` - 處理 LINE 登入回調
- `POST /api/auth/line/bind-email` - 綁定真實電子郵件（可選）

#### LINE 登入實作細節
```typescript
// src/app/api/auth/line/callback/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // 1. 用授權碼換取 access token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code!,
        redirect_uri: process.env.LINE_REDIRECT_URI!,
        client_id: process.env.LINE_CLIENT_ID!,
        client_secret: process.env.LINE_CLIENT_SECRET!,
      }),
    });
    
    // 2. 取得用戶資料
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    // 3. 處理用戶建立或登入邏輯
    const lineProfile = await profileResponse.json();
    const existingUser = await findUserByLineId(lineProfile.userId);
    
    if (existingUser) {
      // 現有用戶登入
      await createSession(existingUser.id);
    } else {
      // 建立新用戶
      const email = lineProfile.email || generateVirtualEmail(lineProfile.userId);
      const newUser = await createUser({
        name: lineProfile.displayName,
        email,
        image: lineProfile.pictureUrl,
        lineUserId: lineProfile.userId,
        isVirtualEmail: !lineProfile.email,
      });
      await createSession(newUser.id);
    }
    
    return Response.redirect('/');
  } catch (error) {
    return Response.redirect('/auth/error');
  }
}
```

### 訂單 API

#### POST /api/orders
```typescript
// 建立新訂單
interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupTime: string;
  items: CartItem[];
  specialNotes?: string;
  userId?: string; // 來自 session，如果已登入
}

interface CreateOrderResponse {
  success: boolean;
  orderNumber: string;
  estimatedTime: string;
}
```

#### GET /api/orders/[orderNumber]
```typescript
// 查詢訂單狀態
interface OrderStatusResponse {
  orderNumber: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  estimatedTime: string;
  items: OrderItem[];
}
```

#### GET /api/orders/user/[userId]
```typescript
// 取得使用者的訂單歷史（需要登入）
interface UserOrdersResponse {
  orders: {
    orderNumber: string;
    status: string;
    totalAmount: string;
    pickupTime: string;
    createdAt: string;
  }[];
}
```

### 聯絡表單 API

#### POST /api/contact
```typescript
interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}
```

## 資料驗證

### 使用 Zod 進行表單驗證

#### 訂單驗證
```typescript
const orderSchema = z.object({
  customerName: z.string().min(2, "姓名至少需要 2 個字元"),
  customerPhone: z.string().regex(/^09\d{8}$/, "請輸入有效的手機號碼"),
  customerEmail: z.string().email("請輸入有效的電子郵件").optional(),
  pickupTime: z.string().datetime("請選擇有效的取餐時間"),
  specialNotes: z.string().max(200, "備註不能超過 200 字元").optional()
});
```

#### 聯絡表單驗證
```typescript
const contactSchema = z.object({
  name: z.string().min(2, "姓名至少需要 2 個字元"),
  email: z.string().email("請輸入有效的電子郵件"),
  subject: z.string().max(100, "主旨不能超過 100 字元").optional(),
  message: z.string().min(10, "訊息至少需要 10 個字元").max(1000, "訊息不能超過 1000 字元")
});
```

## 錯誤處理

### 前端錯誤處理
- 表單驗證錯誤顯示
- API 請求失敗處理
- 網路連線問題提示
- 使用 sonner 顯示 toast 通知

### 後端錯誤處理
- 資料庫連線錯誤
- 驗證失敗回應
- 系統錯誤記錄
- 適當的 HTTP 狀態碼

## 測試策略

### 單元測試
- 購物車邏輯測試
- 表單驗證測試
- API 端點測試

### 整合測試
- 完整訂單流程測試
- 資料庫操作測試
- 表單提交測試

### 使用者體驗測試
- 響應式設計測試
- 無障礙功能測試
- 效能測試

## 效能考量

### 前端優化
- 使用 React.memo 避免不必要的重新渲染
- 購物車狀態使用 localStorage 持久化
- 圖片懶載入和優化

### 後端優化
- 資料庫查詢優化
- API 回應快取
- 錯誤日誌記錄

## 安全性

### 資料保護
- 輸入資料驗證和清理
- SQL 注入防護（Drizzle ORM 提供）
- XSS 攻擊防護

### 隱私保護
- 顧客資料加密儲存
- 符合個資法規範
- 安全的 API 端點