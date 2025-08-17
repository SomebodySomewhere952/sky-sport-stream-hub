import { ChannelCard } from "@/components/ui/channel-card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Channel {
  name: string;
  number: string;
  description: string;
  category: "Premier League" | "Football" | "Cricket" | "F1" | "Golf" | "News";
  streamUrl?: string;
  isLive: boolean;
}

const skyChannels: Channel[] = [
  {
    name: "Sky Sports Premier League",
    number: "401",
    description: "Live Premier League matches, highlights, and analysis",
    category: "Premier League",
    streamUrl: "https://your-stream-url-1.m3u8",
    isLive: true
  },
  {
    name: "Sky Sports Football",
    number: "402", 
    description: "Championship, League One, Two and international football",
    category: "Football",
    streamUrl: "https://your-stream-url-2.m3u8",
    isLive: true
  },
  {
    name: "Sky Sports Main Event",
    number: "403",
    description: "The biggest sporting events live",
    category: "Premier League",
    streamUrl: "https://your-stream-url-3.m3u8",
    isLive: true
  },
  {
    name: "Sky Sports Cricket",
    number: "404",
    description: "Live cricket from around the world",
    category: "Cricket",
    streamUrl: "https://your-stream-url-4.m3u8",
    isLive: true
  },
  {
    name: "Sky Sports F1",
    number: "405",
    description: "Every F1 race live plus practice and qualifying",
    category: "F1",
    streamUrl: "https://your-stream-url-5.m3u8",
    isLive: true
  },
  {
    name: "Sky Sports Golf",
    number: "406",
    description: "Major championships and PGA Tour events",
    category: "Golf",
    streamUrl: "https://your-stream-url-6.m3u8",
    isLive: true
  },
  {
    name: "Sky Sports News",
    number: "407",
    description: "Breaking sports news and updates 24/7",
    category: "News",
    streamUrl: "https://your-stream-url-7.m3u8",
    isLive: true
  },
  {
    name: "Sky Sports Arena",
    number: "408",
    description: "Live rugby, netball, and other premium sports",
    category: "Football",
    streamUrl: "https://your-stream-url-8.m3u8",
    isLive: true
  }
];

export function ChannelGrid() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const handleChannelSelect = (channel: { name: string; number: string; streamUrl?: string }) => {
    const fullChannel = skyChannels.find(c => c.number === channel.number);
    if (fullChannel) {
      setSelectedChannel(fullChannel);
      
      // Show toast notification
      toast({
        title: `Opening ${channel.name}`,
        description: `Channel ${channel.number} - Loading live stream...`,
      });

      // In a real app, this would open the stream
      console.log(`Opening stream: ${channel.streamUrl}`);
      
      // Simulate stream opening with a delay
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
        <h2 className="text-4xl font-bold text-foreground mb-2">Select Channel</h2>
        <p className="text-xl text-muted-foreground">
          Choose from our selection of live Sky Sports channels
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