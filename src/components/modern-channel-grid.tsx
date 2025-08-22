
import { ChannelCard } from "@/components/ui/channel-card";
import { VideoPlayer } from "@/components/video-player";
import { useState, useMemo } from "react";
import { useTvNavigation, NavigationItem } from "@/hooks/use-tv-navigation";

interface Channel {
  name: string;
  number: string;
  description: string;
  category: "Sky Sports" | "TNT Sports";
  streamUrl?: string;
  thumbnailUrl?: string;
  isLive: boolean;
}

const skyChannels: Channel[] = [
  {
    name: "Sky Sports Premier League",
    number: "402",
    description: "Premier League matches and analysis",
    category: "Sky Sports",
    streamUrl: "https://embedsforlife.online/embed/b81dcecb-79b8-11f0-8a44-bc2411b21e0d",
    thumbnailUrl: "/lovable-uploads/64e172a6-3e48-4a2a-9a56-3e6b0700bb21.png",
    isLive: true
  },
  {
    name: "Sky Sports Football",
    number: "403", 
    description: "Football coverage from around the world",
    category: "Sky Sports",
    thumbnailUrl: "/lovable-uploads/64e172a6-3e48-4a2a-9a56-3e6b0700bb21.png",
    isLive: true
  },
  {
    name: "Sky Sports Main Event",
    number: "404",
    description: "Major sporting events and highlights",
    category: "Sky Sports",
    streamUrl: "https://embedsforlife.online/embed/5eb26fd6-7b05-11f0-8a44-bc2411b21e0d",
    thumbnailUrl: "/lovable-uploads/5d44c577-2418-4006-af3e-0ae97ef525ec.png",
    isLive: true
  },
  {
    name: "TNT Sport 1",
    number: "410",
    description: "Premium sports entertainment",
    category: "TNT Sports",
    streamUrl: "https://embedsforlife.online/embed/0d8c4afe-3bc4-11f0-afb1-ecf4bbdafde4",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 2", 
    number: "411",
    description: "Live sports coverage",
    category: "TNT Sports",
    streamUrl: "https://embedsforlife.online/embed/48508494-3e9e-11f0-afb1-ecf4bbdafde4",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 3",
    number: "412", 
    description: "Sports action and events",
    category: "TNT Sports",
    streamUrl: "https://embedsforlife.online/embed/48508a47-3e9e-11f0-afb1-ecf4bbdafde4",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 4",
    number: "413",
    description: "Extended sports programming",
    category: "TNT Sports",
    streamUrl: "https://embedsforlife.online/embed/48508e24-3e9e-11f0-afb1-ecf4bbdafde4",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 5",
    number: "414",
    description: "Sports highlights and analysis",
    category: "TNT Sports",
    streamUrl: "https://embedsforlife.online/embed/485091d0-3e9e-11f0-afb1-ecf4bbdafde4",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  }
];

export function ModernChannelGrid() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  
  const GRID_COLS = 4;
  const skyChannelsData = skyChannels.filter(channel => channel.category === "Sky Sports");
  const tntChannelsData = skyChannels.filter(channel => channel.category === "TNT Sports");
  
  const navigationItems: NavigationItem[] = useMemo(() => {
    const items: NavigationItem[] = [];
    const allChannels = [...skyChannelsData, ...tntChannelsData];
    
    allChannels.forEach((channel, index) => {
      const channelType = channel.category === "Sky Sports" ? "sky" : "tnt";
      
      items.push({
        id: `${channelType}-${channel.number}`,
        element: null,
        row: Math.floor(index / GRID_COLS),
        col: index % GRID_COLS
      });
    });
    
    return items;
  }, [skyChannelsData, tntChannelsData]);

  const { currentFocus, setFocus } = useTvNavigation({
    items: navigationItems,
    gridCols: GRID_COLS
  });

  const handleChannelSelect = (channel: { name: string; number: string; streamUrl?: string }) => {
    const fullChannel = skyChannels.find(c => c.number === channel.number);
    if (fullChannel) {
      setSelectedChannel(fullChannel);
      
      if (fullChannel.streamUrl) {
        setShowVideoPlayer(true);
      }

      console.log(`Opening stream: ${channel.streamUrl}`);
    }
  };

  if (showVideoPlayer && selectedChannel?.streamUrl) {
    return (
      <VideoPlayer
        channelName={selectedChannel.name}
        channelNumber={selectedChannel.number}
        streamUrl={selectedChannel.streamUrl}
        onBack={() => {
          setShowVideoPlayer(false);
          setSelectedChannel(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Live Sports Channels</h2>
        <p className="text-muted-foreground">Premium sports content available 24/7</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[...skyChannelsData, ...tntChannelsData].map((channel, index) => {
          const channelType = channel.category === "Sky Sports" ? "sky" : "tnt";
          return (
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
              isFocused={currentFocus === `${channelType}-${channel.number}`}
              tvNavigationId={`${channelType}-${channel.number}`}
            />
          );
        })}
      </div>
    </div>
  );
}
