import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db, user } from "@/db";
import { eq } from "drizzle-orm";

export async function checkAdminAuth(request: NextRequest) {
  try {
    // 取得當前 session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return {
        isAdmin: false,
        error: "未登入",
        status: 401,
      };
    }

    // 查詢用戶是否為管理員
    const [userData] = await db
      .select({ isAdmin: user.isAdmin })
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userData?.isAdmin) {
      return {
        isAdmin: false,
        error: "權限不足",
        status: 403,
      };
    }

    return {
      isAdmin: true,
      user: session.user,
    };
  } catch (error) {
    console.error("檢查管理員權限失敗:", error);
    return {
      isAdmin: false,
      error: "權限檢查失敗",
      status: 500,
    };
  }
}

// 建立管理員權限檢查的高階函式
export function withAdminAuth(handler: (request: NextRequest, context: any) => Promise<Response>) {
  return async (request: NextRequest, context: any) => {
    const authResult = await checkAdminAuth(request);
    
    if (!authResult.isAdmin) {
      return Response.json(
        { 
          success: false, 
          error: authResult.error || "權限不足" 
        },
        { status: authResult.status || 403 }
      );
    }

    // 將用戶資訊添加到 context
    context.user = authResult.user;
    
    return handler(request, context);
  };
}