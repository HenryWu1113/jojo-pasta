---
inclusion: manual
---

# 開發效率指導原則

## Context7 整合優先
- **隨時使用 Context7**：在開發過程中主動使用 context7 MCP 工具來獲取相關上下文
- **搜尋相關程式碼**：使用 `search_context` 尋找類似的實作模式和解決方案
- **獲取專案脈絡**：使用 `get_context` 了解當前功能在整個專案中的位置
- **列出可用上下文**：使用 `list_contexts` 探索專案的不同面向和模組

## 程式碼撰寫原則
- 優先使用現有的 shadcn/ui 元件，避免重複造輪子
- 遵循現有的模組結構：`src/modules/[feature]/ui/views/` 和 `src/modules/[feature]/ui/components/`
- 使用 TypeScript 嚴格模式，確保型別安全
- 利用 React Hook Form + Zod 處理所有表單
- 使用 Better Auth 的現有 session 管理，不要重新實作

## 快速開發技巧
- **Context7 優先**：開始任何新功能前，先用 context7 搜尋相關實作
- 複製現有元件結構作為模板（如 menu 模組）
- 重用現有的樣式類別和設計模式
- 使用 sonner 進行所有 toast 通知
- 利用現有的 date-fns 處理時間邏輯
- 使用 Drizzle ORM 的型別安全查詢

## Context7 工作流程
1. **開始新任務**：`list_contexts` 查看專案概況
2. **尋找相似功能**：`search_context` 搜尋相關的實作
3. **理解依賴關係**：`get_context` 獲取相關模組的詳細資訊
4. **持續參考**：開發過程中隨時使用 context7 確保一致性

## 避免的陷阱
- 不要建立新的 CSS 檔案，使用 Tailwind 類別
- 不要重新設計 UI 模式，遵循現有設計系統
- 不要建立複雜的狀態管理，使用 React Context 即可
- 不要忽略錯誤處理，每個 API 呼叫都要有 try-catch
- 不要跳過表單驗證，使用 Zod schema
- **不要忽略 Context7**：每個開發決策前都應該先查詢相關上下文

## 測試策略
- 專注於關鍵業務邏輯測試
- 使用現有的 TypeScript 型別檢查作為第一層測試
- 手動測試購物車和訂單流程
- 確保響應式設計在行動裝置上正常運作
- 使用 context7 搜尋現有的測試模式和最佳實踐