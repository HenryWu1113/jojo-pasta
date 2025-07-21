"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import heroImage from "@/assets/images/hero-pasta.jpg";
import Link from "next/link";
import AnimatedNumbers from "react-animated-numbers";

export const FirstSectionView = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          width={1920}
          height={1080}
          src={heroImage}
          objectFit="cover"
          alt="美味義大利麵"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-500 text-yellow-500"
                />
              ))}
            </div>
          </div>

          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            平價義式
            <span className="text-yellow-500 block">奢華體驗</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl font-inter">
            從義大利傳統手工製麵到創新現代口味，每一口都是對美食的致敬。
            使用最新鮮的食材，為您帶來最地道的義大利風味。
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              size="lg"
              className="group bg-orange-500 hover:bg-orange-600"
              asChild
            >
              <Link href="#recommend">
                主廚推薦
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white bg-transparent hover:bg-white hover:text-primary"
              asChild
            >
              <Link href="/menu">查看菜單</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white font-playfair">
                <AnimatedNumbers animateToNumber={8} />+
              </div>
              <div className="text-white/80 text-sm">年經驗</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white font-playfair">
                <AnimatedNumbers animateToNumber={50} />+
              </div>
              <div className="text-white/80 text-sm">義式料理</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white font-playfair">
                <AnimatedNumbers animateToNumber={999} />+
              </div>
              <div className="text-white/80 text-sm">滿意顧客</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
