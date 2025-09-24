import { NextRequest } from "next/server";
import { db, user } from "@/db";
import { eq } from "drizzle-orm";

// 簡單的 API 來設定管理員權限（僅用於開發測試）
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, error: "請提供電子郵件" },
        { status: 400 }
      );
    }

    // 更新用戶為管理員
    const [updatedUser] = await db
      .update(user)
      .set({ isAdmin: true })
      .where(eq(user.email, email))
      .returning();

    if (!updatedUser) {
      return Response.json(
        { success: false, error: "找不到該用戶" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: `用戶 ${email} 已設為管理員`,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error('設定管理員失敗:', error);
    return Response.json(
      { success: false, error: '設定管理員失敗' },
      { status: 500 }
    );
  }
}