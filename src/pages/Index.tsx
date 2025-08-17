import { TvHeader } from "@/components/ui/tv-header";
import { ChannelGrid } from "@/components/channel-grid";

const Index = () => {
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
