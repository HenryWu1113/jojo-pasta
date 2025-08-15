import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db, user as userTable, session as sessionTable } from "@/db";
import { eq, and, gt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return Response.json({ user: null, session: null });
    }

    // 查詢 session 和 user 資料
    const [sessionData] = await db
      .select({
        sessionId: sessionTable.id,
        userId: sessionTable.userId,
        expiresAt: sessionTable.expiresAt,
        userName: userTable.name,
        userEmail: userTable.email,
        userImage: userTable.image,
      })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(
        and(
          eq(sessionTable.token, sessionToken),
          gt(sessionTable.expiresAt, new Date())
        )
      );

    if (!sessionData) {
      // Session 不存在或已過期，清除 cookie
      cookieStore.delete('better-auth.session_token');
      return Response.json({ user: null, session: null });
    }

    return Response.json({
      user: {
        id: sessionData.userId,
        name: sessionData.userName,
        email: sessionData.userEmail,
        image: sessionData.userImage,
      },
      session: {
        id: sessionData.sessionId,
        expiresAt: sessionData.expiresAt,
      },
    });

  } catch (error) {
    console.error("Session check failed:", error);
    return Response.json({ user: null, session: null }, { status: 500 });
  }
}