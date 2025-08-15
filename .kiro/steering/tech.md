# 技術堆疊

## 框架與執行環境
- **Next.js 15.4.2** - 具有 App Router 的 React 框架
- **React 19.1.0** - UI 函式庫
- **TypeScript 5** - 型別安全的 JavaScript
- **Node.js** - 執行環境

## 資料庫與 ORM
- **PostgreSQL** - 主要資料庫 (透過 Neon serverless)
- **Drizzle ORM** - 型別安全的資料庫工具包
- **Drizzle Kit** - 資料庫遷移和管理工具

## 身份驗證
- **Better Auth 1.3.4** - 現代化身份驗證函式庫

## UI 與樣式
- **Tailwind CSS 4** - Utility-first CSS 框架
- **shadcn/ui** - 基於 Radix UI 的可重用元件庫
- **Radix UI** - 無頭式、無障礙 UI 原語
- **Lucide React** - 圖示庫
- **next-themes** - 主題切換支援

## 表單與驗證
- **React Hook Form** - 表單狀態管理
- **Zod** - 結構驗證
- **@hookform/resolvers** - 表單驗證整合

## 開發工具
- **ESLint** - 程式碼檢查 (含 Next.js 和 Prettier 配置)
- **Prettier** - 程式碼格式化
- **Turbopack** - 快速開發打包工具

## 常用指令

### 開發
```bash
npm run dev          # 啟動開發伺服器 (使用 Turbopack)
npm run build        # 建置正式版本
npm run start        # 啟動正式伺服器
```

### 程式碼品質
```bash
npm run lint         # 執行 ESLint
npm run format       # 使用 Prettier 格式化程式碼
npm run format:check # 檢查程式碼格式
```

### 資料庫
```bash
npm run db:push      # 推送結構變更到資料庫
npm run db:studio    # 開啟 Drizzle Studio 進行資料庫管理
```

## 專案配置
- 使用 `@/*` 路徑別名來匯入 src 目錄
- 支援來自 Cloudinary 的遠端圖片
- 透過 `.env` 管理環境變數
- 嚴格的 TypeScript 配置，目標為 ES2017