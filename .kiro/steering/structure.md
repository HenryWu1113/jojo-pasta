# 專案結構

## 根目錄
```
├── .env                 # 環境變數
├── .gitignore          # Git 忽略規則
├── .prettierrc         # Prettier 配置
├── components.json     # shadcn/ui 配置
├── drizzle.config.ts   # Drizzle ORM 配置
├── next.config.ts      # Next.js 配置
├── package.json        # 相依套件和腳本
├── tsconfig.json       # TypeScript 配置
└── postcss.config.mjs  # PostCSS 配置
```

## 原始碼目錄 (`src/`)

### App Router (`src/app/`)
- **Next.js 13+ App Router 結構**
- `layout.tsx` - 根佈局元件
- `page.tsx` - 首頁元件
- `globals.css` - 全域樣式和 Tailwind 匯入
- 基於路由的資料夾：
  - `about/` - 關於我們頁面
  - `api/` - API 路由
  - `menu/` - 菜單相關頁面

### 元件 (`src/components/`)
- `ui/` - shadcn/ui 元件 (自動產生)
- 按功能組織的可重用 React 元件

### 資料庫 (`src/db/`)
- `index.ts` - 資料庫連線設定
- `schema.ts` - Drizzle 結構定義

### Hooks (`src/hooks/`)
- 自訂 React hooks
- `use-mobile.ts` - 行動裝置偵測 hook

### 函式庫 (`src/lib/`)
- `auth.ts` - 身份驗證配置
- `auth-client.ts` - 客戶端身份驗證工具
- `utils.ts` - 工具函式 (cn 等)

### 模組 (`src/modules/`)
- **基於功能的組織**
- `about-us/` - 關於頁面元件
- `home/` - 首頁元件
- `menu/` - 菜單相關元件
- `ui/` - 共用 UI 元件

### 資源 (`src/assets/`)
- `images/` - 靜態圖片資源

## 主要慣例

### 匯入別名
- 所有 src 目錄匯入都使用 `@/*`
- 範例：`import { Button } from "@/components/ui/button"`

### 元件組織
- UI 元件放在 `src/components/ui/` (由 shadcn/ui 管理)
- 功能元件放在 `src/modules/[feature]/`
- 共用元件放在 `src/components/`

### 檔案命名
- 檔案和資料夾使用 kebab-case
- React 元件匯出使用 PascalCase
- Hooks 使用 camelCase，以 "use" 開頭

### 模組結構
- 每個模組應該是自包含的
- 將相關的元件、hooks 和工具組合在一起
- 適當時從 index 檔案匯出主要元件