import {HeroSection} from "@/components/hero-section";
import {StatsBar} from "@/components/stats-bar";
import {UpgradeTool} from "@/components/upgrade-tool";
import {AccessoriesShowcase} from "@/components/showcast";
import { FeaturedPhones } from "@/components/featured-phones";

export default function Home() {
  return (
      <main className="min-h-screen bg-background">
        <HeroSection />
        <StatsBar />
        <UpgradeTool />
        <AccessoriesShowcase />
        <FeaturedPhones />
      </main>
  );
}
