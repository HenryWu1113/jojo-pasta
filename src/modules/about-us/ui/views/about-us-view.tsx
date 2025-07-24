"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, MapPin, Clock, Phone } from "lucide-react";
import { GoogleMap } from "../components/google-map";
// import PhotoCarousel from './PhotoCarousel';

export const AboutUsView = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story Section */}
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-6">
              我們的故事
            </h2>

            <div className="mb-6">
              <Quote className="w-8 h-8 text-primary mb-4" />
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                「每一道義大利麵都承載著家族的記憶與傳統」
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              Bella Pasta 由來自義大利托斯卡納的 Marco 主廚於 2008 年創立。
              秉持著對義大利傳統美食的熱愛，我們堅持使用最頂級的進口食材，
              結合家族傳承的製麵工藝，為每位顧客帶來最道地的義式體驗。
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              從手工製作的新鮮義大利麵條到精心調配的經典醬汁，
              每一個細節都體現了我們對品質的堅持與對美食的敬意。
            </p>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              了解更多
            </Button>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                      餐廳位置
                    </h3>
                    <p className="text-muted-foreground">
                      台北市信義區信義路五段 150 號<br />
                      台北 101 購物中心 B1
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                      營業時間
                    </h3>
                    <p className="text-muted-foreground">
                      週一至週日：11:30 - 22:00
                      <br />
                      週五週六：11:30 - 23:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                      聯絡電話
                    </h3>
                    <p className="text-muted-foreground">
                      (02) 2345-6789
                      <br />
                      LINE ID: @bellapasta
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 照片輪播區 */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
              餐廳環境
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              讓我們帶您一窺 Bella Pasta 的溫馨環境與美食製作過程
            </p>
          </div>
          {/* <PhotoCarousel /> */}
        </div>

        {/* Google地圖區 */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
              交通位置
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              位於台北101購物中心，交通便利，歡迎您的光臨
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <GoogleMap />
          </div>
        </div>
      </div>
    </section>
  );
};
