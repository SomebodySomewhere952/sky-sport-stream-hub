import { ChannelCard } from "@/components/ui/channel-card";
import { VideoPlayer } from "@/components/video-player";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Channel {
  name: string;
  number: string;
  description: string;
  category: "Premier League" | "Football" | "Cricket" | "F1" | "Golf" | "News" | "Sky Sports" | "TNT Sports";
  streamUrl?: string;
  thumbnailUrl?: string;
  isLive: boolean;
}

const skyChannels: Channel[] = [
  {
    name: "Man United vs Arsenal",
    number: "401",
    description: "Live Premier League match - Old Trafford",
    category: "Premier League",
    streamUrl: "https://fstv.online/match/manchester-united-vs-arsenal-football-1378977",
    thumbnailUrl: "/lovable-uploads/fdb7f44b-2abf-43ce-8086-d2d002bf1501.png",
    isLive: true
  },
  // Sky Sports Channels
  {
    name: "Sky Sports Premier League",
    number: "402",
    description: "Premier League matches and analysis",
    category: "Sky Sports",
    isLive: true
  },
  {
    name: "Sky Sports Football",
    number: "403", 
    description: "Football coverage from around the world",
    category: "Sky Sports",
    isLive: true
  },
  {
    name: "Sky Sports Main Event",
    number: "404",
    description: "Major sporting events and highlights",
    category: "Sky Sports",
    isLive: true
  },
  // TNT Sports Channels
  {
    name: "TNT Sport 1",
    number: "410",
    description: "Premium sports entertainment",
    category: "TNT Sports",
    isLive: true
  },
  {
    name: "TNT Sport 2", 
    number: "411",
    description: "Live sports coverage",
    category: "TNT Sports",
    isLive: true
  },
  {
    name: "TNT Sport 3",
    number: "412", 
    description: "Sports action and events",
    category: "TNT Sports",
    isLive: true
  },
  {
    name: "TNT Sport 4",
    number: "413",
    description: "Extended sports programming",
    category: "TNT Sports", 
    isLive: true
  },
  {
    name: "TNT Sport 5",
    number: "414",
    description: "Sports highlights and analysis",
    category: "TNT Sports",
    isLive: true
  }
];

export function ChannelGrid() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const handleChannelSelect = (channel: { name: string; number: string; streamUrl?: string }) => {
    const fullChannel = skyChannels.find(c => c.number === channel.number);
    if (fullChannel) {
      setSelectedChannel(fullChannel);
      
      // Show toast notification
      toast({
        title: `Opening ${channel.name}`,
        description: `Channel ${channel.number} - Loading live stream...`,
      });

      // If it's channel 401, show the video player
      if (channel.number === "401") {
        setShowVideoPlayer(true);
        
        setTimeout(() => {
          toast({
            title: "Stream Ready",
            description: `Now watching ${channel.name} live!`,
          });
        }, 1500);
      } else {
        // For other channels, just show the selection info
        console.log(`Opening stream: ${channel.streamUrl}`);
        
        setTimeout(() => {
          toast({
            title: "Stream Ready",
            description: `Now watching ${channel.name} live!`,
          });
        }, 2000);
      }
    }
  };

  const handleBackToChannels = () => {
    setShowVideoPlayer(false);
    setSelectedChannel(null);
  };

  // Show video player for channel 401
  if (showVideoPlayer && selectedChannel?.number === "401") {
    return (
      <VideoPlayer
        channelName={selectedChannel.name}
        channelNumber={selectedChannel.number}
        onBack={handleBackToChannels}
      />
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">Live Channels</h2>
        <p className="text-xl text-muted-foreground">
          Choose from Sky Sports, TNT Sports and live matches
        </p>
      </div>

      {/* Channel grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skyChannels.map((channel) => (
          <ChannelCard
            key={channel.number}
            name={channel.name}
            number={channel.number}
            description={channel.description}
            category={channel.category}
            isLive={channel.isLive}
            streamUrl={channel.streamUrl}
            thumbnailUrl={channel.thumbnailUrl}
            onSelect={handleChannelSelect}
          />
        ))}
      </div>

      {/* Selected channel info */}
      {selectedChannel && (
        <div className="mt-12 p-6 bg-primary/10 rounded-xl border border-primary/20">
          <h3 className="text-2xl font-bold text-primary mb-2">
            Now Loading: {selectedChannel.name}
          </h3>
          <p className="text-muted-foreground">
            Channel {selectedChannel.number} - {selectedChannel.description}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-sports-red rounded-full animate-pulse" />
            <span className="text-sm font-medium">Live Stream Starting...</span>
          </div>
        </div>
      )}
    </div>
  );
}