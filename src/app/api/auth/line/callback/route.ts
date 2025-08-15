import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { 
  exchangeCodeForToken, 
  getLineProfile, 
  handleLineUser,
  validateState 
} from "@/lib/line-auth-utils";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  console.log('LINE callback route called');
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    console.log('Callback params:', { code: code?.substring(0, 10) + '...', state, error });

    // 檢查是否有錯誤
    if (error) {
      console.error('LINE auth error:', error);
      const errorUrl = new URL('/auth/error?error=line_auth_denied', request.url);
      return Response.redirect(errorUrl.toString());
    }

    // 檢查必要參數
    if (!code || !state) {
      console.error('Missing code or state parameter');
      const errorUrl = new URL('/auth/error?error=missing_parameters', request.url);
      return Response.redirect(errorUrl.toString());
    }

    // 驗證 state 參數
    const cookieStore = await cookies();
    const storedState = cookieStore.get('line_auth_state')?.value;
    
    if (!storedState || !validateState(state, storedState)) {
      console.error('Invalid state parameter');
      const errorUrl = new URL('/auth/error?error=invalid_state', request.url);
      return Response.redirect(errorUrl.toString());
    }

    // 清除 state cookie
    cookieStore.delete('line_auth_state');

    // 1. 用授權碼換取 access token
    const tokenResponse = await exchangeCodeForToken(code);

    // 2. 取得 LINE 用戶資料
    const lineProfile = await getLineProfile(tokenResponse.access_token);

    // 3. 處理用戶登入或註冊
    const user = await handleLineUser(lineProfile);

    // 4. 建立或更新 account 記錄
    const { db, session: sessionTable, account: accountTable } = await import("@/db");
    
    // 檢查是否已有 LINE account 記錄
    const { eq } = await import("drizzle-orm");
    const [existingAccount] = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.accountId, lineProfile.userId));

    if (!existingAccount) {
      // 建立新的 account 記錄
      await db.insert(accountTable).values({
        id: crypto.randomUUID(),
        accountId: lineProfile.userId, // LINE User ID
        providerId: 'line',
        userId: user.id,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        idToken: tokenResponse.id_token,
        accessTokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
        scope: 'profile openid',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // 更新現有的 account 記錄
      await db
        .update(accountTable)
        .set({
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          idToken: tokenResponse.id_token,
          accessTokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
          updatedAt: new Date(),
        })
        .where(eq(accountTable.id, existingAccount.id));
    }

    // 5. 建立 Better Auth session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 天

    // 儲存 session 到資料庫
    await db.insert(sessionTable).values({
      id: sessionToken,
      userId: user.id,
      expiresAt,
      token: sessionToken,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // 設定 session cookie
    cookieStore.set('better-auth.session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    // 重導向到首頁或原本要去的頁面
    const redirectUrl = searchParams.get('redirect') || '/';
    const fullRedirectUrl = new URL(redirectUrl, request.url).toString();
    return Response.redirect(fullRedirectUrl);

  } catch (error) {
    console.error('LINE callback error:', error);
    const errorUrl = new URL('/auth/error?error=callback_failed', request.url);
    return Response.redirect(errorUrl.toString());
  }
}