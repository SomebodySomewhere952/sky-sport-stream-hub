import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Tv } from "lucide-react";

interface ChannelCardProps {
  name: string;
  number: string;
  description: string;
  isLive?: boolean;
  category: "Premier League" | "Football" | "Cricket" | "F1" | "Golf" | "News";
  streamUrl?: string;
  thumbnailUrl?: string;
  onSelect: (channel: { name: string; number: string; streamUrl?: string }) => void;
}

const categoryColors = {
  "Premier League": "bg-primary",
  "Football": "bg-sports-red",
  "Cricket": "bg-sports-green", 
  "F1": "bg-sports-orange",
  "Golf": "bg-accent",
  "News": "bg-secondary"
};

export function ChannelCard({ 
  name, 
  number, 
  description, 
  isLive = true, 
  category,
  streamUrl,
  thumbnailUrl,
  onSelect 
}: ChannelCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = () => {
    onSelect({ name, number, streamUrl });
  };

  return (
    <Card 
      className={`
        relative overflow-hidden cursor-pointer p-0 h-48
        transition-all duration-200 ease-out
        hover:scale-105 hover:shadow-2xl
        focus:scale-105 focus:shadow-2xl focus:ring-4 focus:ring-tv-focus/50
        bg-card border-border/50 backdrop-blur-sm
        ${isFocused ? 'ring-4 ring-tv-focus/50 animate-glow-pulse' : ''}
      `}
      onClick={handleSelect}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      tabIndex={0}
    >
      {/* Background thumbnail */}
      {thumbnailUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-white/80 font-medium">CH {number}</div>
              <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
            </div>
          </div>
          
          {isLive && (
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 bg-current rounded-full mr-1" />
              LIVE
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 mb-4 flex-1 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge 
            className={`${categoryColors[category]} text-white font-medium px-3 py-1`}
          >
            {category}
          </Badge>
          
          <div className="flex items-center gap-2 text-white">
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Watch</span>
          </div>
        </div>
      </div>

      {/* Hover/Focus overlay */}
      <div className={`
        absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-200
        ${isFocused ? 'opacity-100' : 'hover:opacity-100'}
      `} />
    </Card>
  );
}