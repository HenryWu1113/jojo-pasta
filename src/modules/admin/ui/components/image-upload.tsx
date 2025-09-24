"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片檔案");
      return;
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("圖片檔案不能超過 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // 建立 FormData
      const formData = new FormData();
      formData.append("file", file);

      // 上傳到 Cloudinary 或其他服務
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("上傳失敗");
      }

      const data = await response.json();
      
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        throw new Error(data.error || "上傳失敗");
      }
    } catch (error) {
      console.error("圖片上傳失敗:", error);
      alert("圖片上傳失敗，請稍後再試");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">\n      <Label>餐點圖片</Label>\n      \n      {value ? (\n        <div className="relative">\n          <div className="relative w-full h-48 rounded-lg overflow-hidden border">\n            <Image\n              src={value}\n              alt="餐點圖片"\n              fill\n              className="object-cover"\n              sizes="(max-width: 768px) 100vw, 400px"\n            />\n          </div>\n          <Button\n            type="button"\n            variant="destructive"\n            size="sm"\n            className="absolute top-2 right-2"\n            onClick={onRemove}\n            disabled={disabled}\n          >\n            <X className="w-4 h-4" />\n          </Button>\n        </div>\n      ) : (\n        <div className="space-y-4">\n          {/* 拖放上傳區域 */}\n          <div\n            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"\n            onDrop={handleDrop}\n            onDragOver={handleDragOver}\n          >\n            <div className="flex flex-col items-center gap-4">\n              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">\n                <ImageIcon className="w-6 h-6 text-gray-400" />\n              </div>\n              <div>\n                <p className="text-sm text-gray-600 mb-2">\n                  拖放圖片到此處，或點擊選擇檔案\n                </p>\n                <Button\n                  type="button"\n                  variant="outline"\n                  onClick={() => fileInputRef.current?.click()}\n                  disabled={disabled || isUploading}\n                >\n                  <Upload className="w-4 h-4 mr-2" />\n                  {isUploading ? "上傳中..." : "選擇檔案"}\n                </Button>\n              </div>\n              <p className="text-xs text-gray-500">\n                支援 JPG, PNG, GIF 格式，檔案大小不超過 5MB\n              </p>\n            </div>\n          </div>\n\n          {/* URL 輸入 */}\n          <div className="flex gap-2">\n            <Input\n              placeholder="或輸入圖片 URL"\n              value={urlInput}\n              onChange={(e) => setUrlInput(e.target.value)}\n              disabled={disabled}\n            />\n            <Button\n              type="button"\n              variant="outline"\n              onClick={handleUrlSubmit}\n              disabled={disabled || !urlInput.trim()}\n            >\n              使用 URL\n            </Button>\n          </div>\n        </div>\n      )}\n\n      {/* 隱藏的檔案輸入 */}\n      <input\n        ref={fileInputRef}\n        type="file"\n        accept="image/*"\n        onChange={handleFileSelect}\n        className="hidden"\n        disabled={disabled}\n      />\n    </div>\n  );\n};