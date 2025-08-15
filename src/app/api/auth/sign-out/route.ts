import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db, session as sessionTable } from "@/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;

    if (sessionToken) {
      // 從資料庫刪除 session
      await db
        .delete(sessionTable)
        .where(eq(sessionTable.token, sessionToken));
    }

    // 清除 session cookie
    cookieStore.delete('better-auth.session_token');

    return Response.json({ success: true });

  } catch (error) {
    console.error("Sign out failed:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}