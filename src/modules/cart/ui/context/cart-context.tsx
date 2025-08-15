"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

// 購物車項目介面
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  description?: string;
}

// 購物車狀態介面
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// 購物車動作類型
type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_FROM_STORAGE"; payload: CartItem[] };

// 購物車 Context 介面
interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// 初始狀態
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// 計算總計的輔助函式
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

// Reducer 函式
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // 如果商品已存在，增加數量
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 如果是新商品，添加到購物車
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload.id);
      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        // 如果數量為 0 或負數，移除商品
        const newItems = state.items.filter((item) => item.id !== action.payload.id);
        const totals = calculateTotals(newItems);
        return {
          items: newItems,
          ...totals,
        };
      }

      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }

    case "CLEAR_CART": {
      return initialState;
    }

    case "LOAD_FROM_STORAGE": {
      const totals = calculateTotals(action.payload);
      return {
        items: action.payload,
        ...totals,
      };
    }

    default:
      return state;
  }
};

// 建立 Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage 鍵名
const CART_STORAGE_KEY = "jojo-pasta-cart";

// Provider 元件
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 從 localStorage 載入購物車資料
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        dispatch({ type: "LOAD_FROM_STORAGE", payload: parsedCart });
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  // 儲存購物車資料到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [state.items]);

  // 動作函式
  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 自定義 Hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};