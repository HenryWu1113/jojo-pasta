import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Clock, Heart, Award } from "lucide-react";

export const FeaturesView = () => {
  const features = [
    {
      icon: ChefHat,
      title: "專業主廚",
      description: "來自義大利的資深主廚，擁有豐富的傳統料理經驗",
    },
    {
      icon: Clock,
      title: "新鮮現做",
      description: "每份餐點都是現點現做，確保最佳的口感與品質",
    },
    {
      icon: Heart,
      title: "用心調味",
      description: "嚴選頂級食材，每一道調味都經過精心調配",
    },
    {
      icon: Award,
      title: "品質保證",
      description: "獲得多項美食獎項認證，品質值得信賴",
    },
  ];

  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            為什麼選擇我們
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            我們堅持使用最優質的食材，結合傳統工藝與現代創新，為您呈現最完美的義大利美食體驗
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
