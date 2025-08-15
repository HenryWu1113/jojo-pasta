"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface LogoutButtonProps {
  onLogout?: () => void;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
}

export const LogoutButton = ({ 
  onLogout, 
  variant = "ghost", 
  size = "sm" 
}: LogoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // 呼叫 Better Auth 登出 API
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // 清除本地狀態
        if (onLogout) {
          onLogout();
        }
        // 重新載入頁面或重導向
        window.location.href = "/";
      } else {
        console.error("登出失敗");
      }
    } catch (error) {
      console.error("登出錯誤:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "登出中..." : "登出"}
    </Button>
  );
};