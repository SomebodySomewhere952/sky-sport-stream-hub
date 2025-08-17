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
    streamUrl: "https://embedsforlife.online/embed/5eb26fd6-7b05-11f0-8a44-bc2411b21e0d",
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
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  
  // Single row layout for TV navigation (left/right only)
  const GRID_COLS = skyChannels.length;
  const skyChannelsData = skyChannels.filter(channel => channel.category === "Sky Sports");
  const tntChannelsData = skyChannels.filter(channel => channel.category === "TNT Sports");
  
  // Create navigation items for TV remote - single row layout
  const navigationItems: NavigationItem[] = useMemo(() => {
    const items: NavigationItem[] = [];
    const allChannels = [...skyChannelsData, ...tntChannelsData];
    
    // Single row - each channel gets its own column (left/right navigation only)
    allChannels.forEach((channel, index) => {
      const channelType = channel.category === "Sky Sports" ? "sky" : "tnt";
      
      items.push({
        id: `${channelType}-${channel.number}`,
        element: null,
        row: 0,
        col: index
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
      
      // Show video player for channels with stream URL
      if (fullChannel.streamUrl) {
        setShowVideoPlayer(true);
        
        toast({
          title: `Starting ${channel.name}`,
          description: `Channel ${channel.number} - Stream loading...`,
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

  // Show video player if selected
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
    <div className="container mx-auto px-8 py-8">
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">Live Channels</h2>
        <p className="text-xl text-muted-foreground">
          Choose from Sky Sports and TNT Sports
        </p>
      </div>

      {/* All Channels in Single Row */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max px-4">
          {[...skyChannelsData, ...tntChannelsData].map((channel, index) => {
            const channelType = channel.category === "Sky Sports" ? "sky" : "tnt";
            return (
              <div key={channel.number} className="flex-shrink-0">
                <ChannelCard
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
              </div>
            );
          })}
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