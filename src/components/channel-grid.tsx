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
    streamUrl: "https://embedsforlife.online/embed/78cf7998-3cda-11f0-afb1-ecf4bbdafde4",
    thumbnailUrl: "/lovable-uploads/813e172d-9942-44f6-9249-16293b387d7e.png",
    isLive: true
  }
];

export function ChannelGrid() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  
  // Single column layout for TV navigation
  const GRID_COLS = 1;
  const skyChannelsData = skyChannels.filter(channel => channel.category === "Sky Sports");
  const tntChannelsData = skyChannels.filter(channel => channel.category === "TNT Sports");
  
  // Create navigation items for TV remote - single column layout
  const navigationItems: NavigationItem[] = useMemo(() => {
    const items: NavigationItem[] = [];
    const allChannels = [...skyChannelsData, ...tntChannelsData];
    
    // Single column - each channel gets its own row
    allChannels.forEach((channel, index) => {
      const channelType = channel.category === "Sky Sports" ? "sky" : "tnt";
      
      items.push({
        id: `${channelType}-${channel.number}`,
        element: null,
        row: index,
        col: 0
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
      
      // Auto-start stream for TNT Sport 5 or any channel with streamUrl
      if (fullChannel.streamUrl) {
        window.open(fullChannel.streamUrl, '_blank');
        
        toast({
          title: `Starting ${channel.name}`,
          description: `Channel ${channel.number} - Stream opening in new tab...`,
        });
      } else {
        // Show toast notification for channels without stream
        toast({
          title: `Opening ${channel.name}`,
          description: `Channel ${channel.number} - Loading live stream...`,
        });

        setTimeout(() => {
          toast({
            title: "Stream Ready",
            description: `Now watching ${channel.name} live!`,
          });
        }, 2000);
      }

      // Show selection info
      console.log(`Opening stream: ${channel.streamUrl}`);
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
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Sky Sports</h3>
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
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
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">TNT Sports</h3>
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
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