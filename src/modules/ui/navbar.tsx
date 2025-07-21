"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // 確保關閉手機選單當路由改變時
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  // 當點擊外部時關閉選單
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold text-orange-500 cursor-pointer"
              onClick={() => router.push("/")}
            >
              JOJO PASTA
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  首頁
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/menu"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  菜單
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  關於我們
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  聯絡我們
                </Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                asChild
              >
                <Link href="/takeaway">外帶自取</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="inline-flex items-center justify-center p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card rounded-lg mt-2 shadow-soft">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/"
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  首頁
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/menu"
                  className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  菜單
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  關於我們
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                >
                  聯絡我們
                </Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                asChild
              >
                <Link href="/takeaway">外帶自取</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
