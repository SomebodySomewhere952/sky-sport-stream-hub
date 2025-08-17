import { ChannelCard } from "@/components/ui/channel-card";
import { VideoPlayer } from "@/components/video-player";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
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
  // Sky Sports Channels
  {
    name: "Sky Sports Premier League",
    number: "402",
    description: "Premier League matches and analysis",
    category: "Sky Sports",
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
    thumbnailUrl: "/lovable-uploads/5d44c577-2418-4006-af3e-0ae97ef525ec.png",
    isLive: true
  },
  // TNT Sports Channels
  {
    name: "TNT Sport 1",
    number: "410",
    description: "Premium sports entertainment",
    category: "TNT Sports",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 2", 
    number: "411",
    description: "Live sports coverage",
    category: "TNT Sports",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 3",
    number: "412", 
    description: "Sports action and events",
    category: "TNT Sports",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 4",
    number: "413",
    description: "Extended sports programming",
    category: "TNT Sports",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  },
  {
    name: "TNT Sport 5",
    number: "414",
    description: "Sports highlights and analysis",
    category: "TNT Sports",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  }
];

export function ChannelGrid() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  
  
  // Calculate grid layout
  const GRID_COLS = 4;
  const skyChannelsData = skyChannels.filter(channel => channel.category === "Sky Sports");
  const tntChannelsData = skyChannels.filter(channel => channel.category === "TNT Sports");
  
  // Create navigation items for TV remote - treat all channels as one continuous sequence
  const navigationItems: NavigationItem[] = useMemo(() => {
    const items: NavigationItem[] = [];
    const allChannels = [...skyChannelsData, ...tntChannelsData];
    
    // Create a single continuous sequence for better navigation
    allChannels.forEach((channel, index) => {
      const row = Math.floor(index / GRID_COLS);
      const col = index % GRID_COLS;
      const channelType = channel.category === "Sky Sports" ? "sky" : "tnt";
      
      items.push({
        id: `${channelType}-${channel.number}`,
        element: null,
        row,
        col
      });
    });
    
    return items;
  }, [skyChannelsData, tntChannelsData]);

  const { currentFocus, setFocus } = useTvNavigation({
    items: navigationItems,
    gridCols: GRID_COLS,
    onSelect: (id) => {
      const channelNumber = id.split('-')[1];
      const allChannels = [...skyChannelsData, ...tntChannelsData];
      const channel = allChannels.find(c => c.number === channelNumber);
      if (channel) {
        handleChannelSelect(channel);
      }
    }
  });

  const handleChannelSelect = (channel: { name: string; number: string; streamUrl?: string }) => {
    const fullChannel = skyChannels.find(c => c.number === channel.number);
    if (fullChannel) {
      setSelectedChannel(fullChannel);
      
      // Show toast notification
      toast({
        title: `Opening ${channel.name}`,
        description: `Channel ${channel.number} - Loading live stream...`,
      });

      // Show selection info
      console.log(`Opening stream: ${channel.streamUrl}`);
      
      setTimeout(() => {
        toast({
          title: "Stream Ready",
          description: `Now watching ${channel.name} live!`,
        });
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">Live Channels</h2>
        <p className="text-xl text-muted-foreground">
          Choose from Sky Sports and TNT Sports
        </p>
      </div>

      {/* Sky Sports Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-foreground mb-6">Sky Sports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skyChannelsData.map((channel) => (
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
              isFocused={currentFocus === `sky-${channel.number}`}
              tvNavigationId={`sky-${channel.number}`}
            />
          ))}
        </div>
      </div>

      {/* TNT Sports Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-foreground mb-6">TNT Sports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tntChannelsData.map((channel) => (
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
              isFocused={currentFocus === `tnt-${channel.number}`}
              tvNavigationId={`tnt-${channel.number}`}
            />
          ))}
        </div>
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