import { LineLoginButton } from "../components/line-login-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthView = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">
            歡迎來到 JOJO PASTA
          </CardTitle>
          <p className="text-muted-foreground">
            登入以享受更好的訂餐體驗
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <LineLoginButton />
          <div className="text-center text-sm text-muted-foreground">
            登入即表示您同意我們的服務條款和隱私政策
          </div>
        </CardContent>
      </Card>
    </div>
  );
};