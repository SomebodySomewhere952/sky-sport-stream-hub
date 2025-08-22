
import { useState } from "react";
import { TopNavigation } from "@/components/ui/top-navigation";
import { SidebarCategories } from "@/components/ui/sidebar-categories";
import { ModernChannelGrid } from "@/components/modern-channel-grid";
import { IntroScreen } from "@/components/intro-screen";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
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
