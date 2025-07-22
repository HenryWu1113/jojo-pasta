import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const RecommendationView = () => {
  const menuItems = [
    {
      name: "經典義式肉醬麵",
      description: "手工製作新鮮義大利麵條，搭配傳統波隆納肉醬",
      price: "380",
      rating: 4.8,
      category: "經典",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "奶油培根蛋麵",
      description: "濃郁奶油醬汁配上香脆培根，經典羅馬風味",
      price: "420",
      rating: 4.9,
      category: "人氣",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "蒜香辣椒義大利麵",
      description: "簡單卻不平凡的經典搭配，香蒜與辣椒的完美結合",
      price: "320",
      rating: 4.7,
      category: "經典",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "白醬蘑菇筆管麵",
      description: "新鮮蘑菇搭配濃郁白醬，口感豐富層次分明",
      price: "360",
      rating: 4.6,
      category: "素食",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "海鮮墨魚麵",
      description: "新鮮海鮮配上墨魚汁，視覺與味覺的雙重享受",
      price: "480",
      rating: 4.9,
      category: "海鮮",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "松露野菇義大利麵",
      description: "頂級松露搭配多種野菇，奢華美味體驗",
      price: "580",
      rating: 5.0,
      category: "頂級",
      image: "/placeholder.svg?height=300&width=300",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      經典: "bg-red-500/10 text-red-500",
      人氣: "bg-orange-500/10 text-orange-500",
      素食: "bg-green-500/10 text-green-500",
      海鮮: "bg-blue-500/10 text-blue-500",
      頂級: "bg-yellow-500/10 text-yellow-500",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-muted text-muted-foreground"
    );
  };

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            精選菜單
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            從經典傳統到創新口味，每一道料理都是我們對義大利美食文化的詮釋
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-red-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  width={500}
                  height={500}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-golden-yellow text-golden-yellow" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                  {item.name}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-primary font-playfair">
                    NT${item.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg" asChild>
            <Link href="/menu">查看完整菜單</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
