import { useState, forwardRef, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Tv } from "lucide-react";

interface ChannelCardProps {
  name: string;
  number: string;
  description: string;
  isLive?: boolean;
  category: "Sky Sports" | "TNT Sports";
  streamUrl?: string;
  thumbnailUrl?: string;
  onSelect: (channel: { name: string; number: string; streamUrl?: string }) => void;
  isFocused?: boolean;
  tvNavigationId?: string;
}

const categoryColors = {
  "Sky Sports": "bg-blue-600",
  "TNT Sports": "bg-red-600"
};

export const ChannelCard = memo(forwardRef<HTMLDivElement, ChannelCardProps>(({ 
  name, 
  number, 
  description, 
  isLive = true, 
  category,
  streamUrl,
  thumbnailUrl,
  onSelect,
  isFocused: externalFocused = false,
  tvNavigationId 
}, ref) => {
  const [internalFocused, setInternalFocused] = useState(false);
  const isFocused = externalFocused || internalFocused;

  const handleSelect = () => {
    onSelect({ name, number, streamUrl });
  };

  return (
    <Card 
      ref={ref}
      data-tv-id={tvNavigationId}
      role="button"
      aria-selected={isFocused}
      className={`
        performance-optimized relative overflow-hidden cursor-pointer p-0 h-32 w-full tv-focusable
        transition-transform duration-150 ease-out
        hover:scale-105
        focus:scale-102
        bg-card border-border/50
        ${isFocused ? 'ring-2 ring-primary scale-102' : ''}
      `}
      onClick={handleSelect}
      onFocus={() => setInternalFocused(true)}
      onBlur={() => setInternalFocused(false)}
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
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Tv className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-white/80 font-medium">CH {number}</div>
              <h3 className="text-sm font-bold text-white leading-tight">{name}</h3>
            </div>
          </div>
          
          {isLive && (
            <Badge variant="destructive" className="animate-pulse text-xs">
              <div className="w-1.5 h-1.5 bg-current rounded-full mr-1" />
              LIVE
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-white/80 mb-3 flex-1 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge 
            className={`${categoryColors[category]} text-white font-medium px-2 py-0.5 text-xs`}
          >
            {category}
          </Badge>
          
          <div className="flex items-center gap-1.5 text-white">
            <Play className="w-3 h-3" />
            <span className="text-xs font-medium">Watch</span>
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
}));

ChannelCard.displayName = "ChannelCard";