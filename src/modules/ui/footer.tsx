"use client";

import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="font-playfair text-2xl font-bold mb-4">
              JOJO PASTA
            </h3>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              正宗義大利風味餐廳，致力於為您帶來最地道的義式美食體驗。
              每一道料理都是我們對美食藝術的完美詮釋。
            </p>
            <div className="flex space-x-4">
              <a
                target="_blank"
                href="https://www.instagram.com/jo_jo_pasta/?igsh=MWpueGo4MXFnOXY4dg%3D%3D#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">
              快速連結
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  首頁
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  菜單
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  關於我們
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">
              聯絡資訊
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0" />
                <span className="text-white/80 text-sm">
                  新北市新店區新和街 39 號
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white shrink-0" />
                <span className="text-white/80 text-sm">(02) 2345-6789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white shrink-0" />
                <span className="text-white/80 text-sm">jojo@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">© 2024 JOJO PASTA. 版權所有</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              隱私政策
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              服務條款
            </a>
            <a
              target="_blank"
              href="https://www.google.com/maps/place/23159%E6%96%B0%E5%8C%97%E5%B8%82%E6%96%B0%E5%BA%97%E5%8D%80%E6%96%B0%E5%92%8C%E8%A1%9739%E8%99%9F/@24.9850635,121.5186028,19z/data=!3m1!4b1!4m6!3m5!1s0x3468020de63602d7:0xaefbf03948355898!8m2!3d24.9850623!4d121.5192465!16s%2Fg%2F11vjtcshp2?authuser=0&entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              網站地圖
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
