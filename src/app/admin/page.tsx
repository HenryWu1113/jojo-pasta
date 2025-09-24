import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">管理後台總覽</h1>
        <p className="text-gray-600 mt-2">歡迎使用 Jojo Pasta 管理系統</p>
      </div>

      {/* 快速操作卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">餐點管理</CardTitle>
            <Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">管理菜單</div>
            <p className="text-xs text-muted-foreground">
              新增、編輯和管理餐點項目
            </p>
            <Link href="/admin/menu">
              <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                進入餐點管理
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">訂單管理</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">處理訂單</div>
            <p className="text-xs text-muted-foreground">
              查看和管理客戶訂單
            </p>
            <Link href="/admin/orders">
              <Button className="w-full mt-4" variant="outline">
                進入訂單管理
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">客戶管理</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">用戶資料</div>
            <p className="text-xs text-muted-foreground">
              管理客戶資訊和權限
            </p>
            <Link href="/admin/users">
              <Button className="w-full mt-4" variant="outline">
                進入客戶管理
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總餐點數</CardTitle>
            <Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              +-- 本月新增
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日訂單</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              +-- 較昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">註冊用戶</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              +-- 本月新增
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">營收</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NT$ --</div>
            <p className="text-xs text-muted-foreground">
              +--% 較上月
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 快速提示 */}
      <Card>
        <CardHeader>
          <CardTitle>快速開始</CardTitle>
          <CardDescription>
            開始使用管理系統的建議步驟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">1. 前往餐點管理新增您的菜單項目</p>
            <p className="text-sm">2. 設定餐點分類和價格</p>
            <p className="text-sm">3. 上傳餐點圖片</p>
            <p className="text-sm">4. 檢查訂單管理功能</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "管理後台 | Jojo Pasta",
  description: "Jojo Pasta 餐廳管理系統總覽",
};