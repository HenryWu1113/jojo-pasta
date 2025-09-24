import { NextRequest } from "next/server";

// 簡單的圖片上傳 API
// 在實際應用中，這裡應該整合 Cloudinary 或其他雲端儲存服務
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { success: false, error: "沒有選擇檔案" },
        { status: 400 }
      );
    }

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { success: false, error: "請選擇圖片檔案" },
        { status: 400 }
      );
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { success: false, error: "圖片檔案不能超過 5MB" },
        { status: 400 }
      );
    }

    // TODO: 實際的圖片上傳邏輯
    // 這裡應該整合 Cloudinary 或其他雲端儲存服務
    // 目前返回一個模擬的 URL
    
    // 生成一個模擬的圖片 URL
    const mockUrl = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center`;
    
    return Response.json({
      success: true,
      url: mockUrl,
      message: "圖片上傳成功",
    });

    /* 
    // Cloudinary 整合範例：
    const cloudinary = require('cloudinary').v2;
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "jojo-pasta/menu-items",
          transformation: [
            { width: 800, height: 600, crop: "fill" },
            { quality: "auto" },
            { format: "webp" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return Response.json({
      success: true,
      url: result.secure_url,
      message: "圖片上傳成功",
    });
    */

  } catch (error) {
    console.error("圖片上傳失敗:", error);
    return Response.json(
      { success: false, error: "圖片上傳失敗" },
      { status: 500 }
    );
  }
}