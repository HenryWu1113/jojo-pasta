import { initializeDefaultCategories } from "@/lib/menu-db-utils";

export async function POST() {
  try {
    await initializeDefaultCategories();
    return Response.json({ 
      success: true, 
      message: "預設分類初始化完成" 
    });
  } catch (error) {
    console.error('初始化分類失敗:', error);
    return Response.json(
      { 
        success: false, 
        error: "初始化分類失敗" 
      },
      { status: 500 }
    );
  }
}