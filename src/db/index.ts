import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

// 匯出所有 schema 以便在其他地方使用
export * from "./schema";
