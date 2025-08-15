"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/cart-context";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { useState } from "react";

export const CartDrawer = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    setIsOpen(false);
    // 導航到外帶自取頁面會在後續實作
  };

  if (state.items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <CartSummary />
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              購物車
            </SheetTitle>
            <SheetDescription>
              您的購物車目前是空的
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-6">
              還沒有選擇任何商品<br />
              快去看看我們的美味菜單吧！
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/menu">
                瀏覽菜單
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <CartSummary />
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              購物車 ({state.totalItems})
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              清空
            </Button>
          </SheetTitle>
          <SheetDescription>
            檢查您的訂單並準備結帳
          </SheetDescription>
        </SheetHeader>

        {/* 購物車項目列表 */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-0">
            {state.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </ScrollArea>

        {/* 總計和結帳按鈕 */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>總計</span>
            <span className="text-orange-600">
              NT$ {state.totalAmount}
            </span>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600" 
              size="lg"
              onClick={handleCheckout}
              asChild
            >
              <Link href="/takeaway">
                前往結帳 (NT$ {state.totalAmount})
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setIsOpen(false)}
              asChild
            >
              <Link href="/menu">
                繼續購物
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};