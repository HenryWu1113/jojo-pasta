---
inclusion: fileMatch
fileMatchPattern: 'api/**/*'
---

# API 開發模式

## 標準 API 結構
```typescript
// 統一的回應格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 統一的錯誤處理
export async function handleApiError(error: unknown) {
  console.error('API Error:', error);
  return Response.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

## 資料庫操作模式
- 使用 Drizzle ORM 的 `db.select()`, `db.insert()`, `db.update()`, `db.delete()`
- 所有資料庫操作都要包在 try-catch 中
- 使用 `eq()`, `and()`, `or()` 等 Drizzle 查詢函式
- 利用 TypeScript 型別推斷，避免手動型別定義

## 驗證模式
- 使用 Zod schema 驗證所有輸入
- 在 API 路由開頭就進行驗證
- 回傳具體的驗證錯誤訊息

## Better Auth 整合
- 使用 `auth.api.getSession()` 取得當前 session
- 檢查 session 存在性來判斷是否已登入
- 將 userId 從 session 中提取用於資料庫操作