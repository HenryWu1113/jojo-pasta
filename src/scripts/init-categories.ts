import { initializeDefaultCategories } from "@/lib/menu-db-utils";

async function main() {
  try {
    console.log('開始初始化預設分類...');
    await initializeDefaultCategories();
    console.log('預設分類初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('初始化失敗:', error);
    process.exit(1);
  }
}

main();