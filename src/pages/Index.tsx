
import { useState } from "react";
import { TopNavigation } from "@/components/ui/top-navigation";
import { SidebarCategories } from "@/components/ui/sidebar-categories";
import { ModernChannelGrid } from "@/components/modern-channel-grid";
import { IntroScreen } from "@/components/intro-screen";
import { LoadingScreen } from "@/components/loading-screen";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'loading' | 'main'>('intro');

  const handleIntroComplete = () => {
    setCurrentScreen('loading');
  };

  const handleLoadingComplete = () => {
    setCurrentScreen('main');
  };

  if (currentScreen === 'intro') {
    return <IntroScreen onComplete={handleIntroComplete} />;
  }

  if (currentScreen === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="flex">
        <SidebarCategories />
        <ModernChannelGrid />
      </div>
    </div>
  );
};

export default Index;
