"use client";

import { useState, useEffect } from "react";

interface UseMenuItemsOptions {
  search?: string;
  category?: string;
  available?: boolean;
  featured?: boolean;
}

export function useMenuItems(options: UseMenuItemsOptions = {}) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (options.search) params.append('search', options.search);
      if (options.category) params.append('category', options.category);
      if (options.available !== undefined) params.append('available', options.available.toString());
      if (options.featured !== undefined) params.append('featured', options.featured.toString());

      const response = await fetch(`/api/admin/menu-items?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('載入餐點失敗');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.data);
      } else {
        throw new Error(data.error || '載入餐點失敗');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入餐點失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMenuItems();
    }, 300); // 防抖動

    return () => clearTimeout(timeoutId);
  }, [options.search, options.category, options.available, options.featured]);

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenuItems,
  };
}