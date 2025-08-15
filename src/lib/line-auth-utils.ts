import { findUserByLineId, createLineUser } from "@/lib/db-utils";
import { auth } from "@/lib/auth";

// LINE API 相關常數
const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const LINE_PROFILE_URL = "https://api.line.me/v2/profile";
const LINE_AUTH_URL = "https://access.line.me/oauth2/v2.1/authorize";

// LINE 登入相關介面
export interface LineTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  email?: string;
}

// 虛擬電子郵件生成
export function generateVirtualEmail(lineUserId: string): string {
  return `line_${lineUserId}@jojo-pasta.virtual`;
}

export function isVirtualEmail(email: string): boolean {
  return email.endsWith('@jojo-pasta.virtual');
}

// 生成 LINE 授權 URL
export function generateLineAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CLIENT_ID!,
    redirect_uri: process.env.LINE_REDIRECT_URI!,
    state,
    scope: 'profile openid',
  });

  return `${LINE_AUTH_URL}?${params.toString()}`;
}

// 生成隨機 state 參數
export function generateState(): string {
  return crypto.randomUUID();
}

// 用授權碼換取 access token
export async function exchangeCodeForToken(code: string): Promise<LineTokenResponse> {
  const response = await fetch(LINE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.LINE_REDIRECT_URI!,
      client_id: process.env.LINE_CLIENT_ID!,
      client_secret: process.env.LINE_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('LINE token exchange failed:', error);
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

// 取得 LINE 用戶資料
export async function getLineProfile(accessToken: string): Promise<LineProfile> {
  const response = await fetch(LINE_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('LINE profile fetch failed:', error);
    throw new Error('Failed to fetch LINE profile');
  }

  return response.json();
}

// 處理 LINE 用戶登入或註冊
export async function handleLineUser(lineProfile: LineProfile) {
  try {
    // 檢查是否已存在用戶
    let user = await findUserByLineId(lineProfile.userId);

    if (user) {
      // 現有用戶，直接返回
      return user;
    }

    // 新用戶，建立帳號
    const email = lineProfile.email || generateVirtualEmail(lineProfile.userId);
    
    user = await createLineUser({
      name: lineProfile.displayName,
      email,
      image: lineProfile.pictureUrl,
      lineUserId: lineProfile.userId,
      isVirtualEmail: !lineProfile.email,
    });

    return user;
  } catch (error) {
    console.error('Handle LINE user failed:', error);
    throw new Error('Failed to handle LINE user');
  }
}

// 建立 Better Auth session
export async function createAuthSession(userId: string, request: Request) {
  try {
    // 使用 Better Auth 建立 session
    const session = await auth.api.signInSocial({
      body: {
        providerId: 'line',
        userId,
      },
      headers: request.headers,
    });

    return session;
  } catch (error) {
    console.error('Create auth session failed:', error);
    throw new Error('Failed to create auth session');
  }
}

// 驗證 state 參數（防止 CSRF 攻擊）
export function validateState(receivedState: string, storedState: string): boolean {
  return receivedState === storedState;
}