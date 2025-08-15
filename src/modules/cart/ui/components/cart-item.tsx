"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { CartItem as CartItemType } from "../context/cart-context";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      {/* 商品圖片 */}
      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>

      {/* 商品資訊 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 truncate">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500">
          NT$ {item.price}
        </p>
      </div>

      {/* 數量控制 */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => handleQuantityChange(item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="text-sm font-medium min-w-[2ch] text-center">
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* 小計 */}
      <div className="text-sm font-medium text-gray-900 min-w-[4ch] text-right">
        NT$ {item.price * item.quantity}
      </div>

      {/* 移除按鈕 */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
        onClick={() => onRemove(item.id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};