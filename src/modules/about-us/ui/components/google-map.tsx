import { MapPin } from "lucide-react";

export const GoogleMap = () => {
  // 台北101的座標
  const location = {
    lat: 25.033,
    lng: 121.5654,
    address: "台北市信義區信義路五段150號",
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-warm">
        {/* 地圖標題 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-playfair text-xl font-semibold text-foreground">
                餐廳位置
              </h3>
              <p className="text-muted-foreground text-sm">
                {location.address}
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps嵌入 */}
        <div className="relative h-80">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.0123456789!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abb6da9c9e1f%3A0x1206bcf082fd45cc!2sTaipei%20101!5e0!3m2!1sen!2stw!4v1699123456789!5m2!1sen!2stw`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />

          {/* 備用顯示 - 如果iframe無法載入 */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity duration-300">
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-playfair text-lg font-semibold text-foreground mb-2">
                餐廳位置
              </h4>
              <p className="text-muted-foreground text-sm">
                {location.address}
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                座標：{location.lat}, {location.lng}
              </p>
            </div>
          </div>
        </div>

        {/* 底部資訊 */}
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>點擊地圖查看詳細路線</span>
            <a
              href={`https://www.google.com/maps/dir//${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium"
            >
              取得路線指引
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
