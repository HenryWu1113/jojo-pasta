import { NextRequest } from "next/server";
import { generateLineAuthUrl, generateState } from "@/lib/line-auth-utils";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // 生成 state 參數防止 CSRF 攻擊
    const state = generateState();
    
    // 將 state 儲存在 cookie 中以便後續驗證
    const cookieStore = await cookies();
    cookieStore.set('line_auth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 分鐘
    });

    // 生成 LINE 授權 URL
    const authUrl = generateLineAuthUrl(state);

    // 重導向到 LINE 授權頁面
    return Response.redirect(authUrl);
  } catch (error) {
    console.error('LINE auth redirect failed:', error);
    return Response.redirect('/auth/error?error=line_auth_failed');
  }
}