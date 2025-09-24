"use client";

import { useState, useEffect } from "react";

export function useMenuCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/menu-categories');
      
      if (!response.ok) {
        throw new Error('載入分類失敗');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        throw new Error(data.error || '載入分類失敗');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入分類失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}