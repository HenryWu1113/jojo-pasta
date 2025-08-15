"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/cart-context";

interface CartSummaryProps {
  onClick?: () => void;
}

export const CartSummary = ({ onClick }: CartSummaryProps) => {
  const { state } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="relative p-2 hover:bg-orange-50"
    >
      <ShoppingCart className="h-5 w-5 text-muted-foreground" />
      {state.totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600"
        >
          {state.totalItems > 99 ? "99+" : state.totalItems}
        </Badge>
      )}
      <span className="sr-only">
        購物車，{state.totalItems} 個商品
      </span>
    </Button>
  );
};