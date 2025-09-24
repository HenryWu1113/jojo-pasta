import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Menu, Users, Settings } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 管理員導航列 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-orange-600">
                Jojo Pasta 管理後台
              </Link>
              
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    總覽
                  </Button>
                </Link>
                
                <Link href="/admin/menu">
                  <Button variant="ghost" size="sm">
                    <Menu className="w-4 h-4 mr-2" />
                    餐點管理
                  </Button>
                </Link>
                
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    訂單管理
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  回到網站
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export const metadata = {
  title: "管理後台 | Jojo Pasta",
  description: "Jojo Pasta 餐廳管理系統",
};