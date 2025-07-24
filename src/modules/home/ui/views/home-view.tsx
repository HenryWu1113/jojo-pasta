import { FirstSectionView } from "../components/first-section-view";
import { RecommendationView } from "../components/recommendation-view";
import { FeaturesView } from "../components/features-view";

export const HomeView = () => {
  return (
    <main className="flex flex-col justify-center min-h-screen">
      <FirstSectionView />
      <RecommendationView />
      <FeaturesView />
    </main>
  );
};
