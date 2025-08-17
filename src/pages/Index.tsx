import { useState } from "react";
import { TvHeader } from "@/components/ui/tv-header";
import { ChannelGrid } from "@/components/channel-grid";
import { IntroScreen } from "@/components/intro-screen";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TvHeader />
      <main>
        <ChannelGrid />
      </main>
    </div>
  );
};

export default Index;
