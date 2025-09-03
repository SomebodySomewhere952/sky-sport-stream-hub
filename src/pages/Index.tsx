
import { useState, useEffect } from "react";
import { TopNavigation } from "@/components/ui/top-navigation";
import { SidebarCategories } from "@/components/ui/sidebar-categories";
import { ModernChannelGrid } from "@/components/modern-channel-grid";
import { IntroScreen } from "@/components/intro-screen";
import { LoadingScreen } from "@/components/loading-screen";
import { FireTvNavigationProvider } from "@/hooks/use-fire-tv-navigation";
import { FireTvNavigationWrapper } from "@/components/fire-tv-navigation-wrapper";
import { isTvDevice } from "@/utils/device-detection";

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
    <FireTvNavigationProvider>
      <div className="min-h-screen bg-background">
        <FireTvNavigationWrapper sectionId="header" sectionName="Header Navigation" priority={0}>
          <TopNavigation />
        </FireTvNavigationWrapper>
        
        <div className="flex">
          <FireTvNavigationWrapper sectionId="sidebar" sectionName="Sidebar Categories" priority={1}>
            <SidebarCategories />
          </FireTvNavigationWrapper>
          
          <FireTvNavigationWrapper sectionId="main" sectionName="Channel Grid" priority={2}>
            <ModernChannelGrid />
          </FireTvNavigationWrapper>
        </div>
        
        {/* Fire TV Remote Instructions for users */}
        {isTvDevice() && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs opacity-75">
            <div>🎮 Use D-Pad to navigate</div>
            <div>⏎ SELECT to choose</div>
            <div>← BACK to go back</div>
            <div>🏠 HOME for main menu</div>
          </div>
        )}
      </div>
    </FireTvNavigationProvider>
  );
};

export default Index;
