import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Maximize, Volume2, VolumeX, RotateCcw } from "lucide-react";

interface VideoPlayerProps {
  channelName: string;
  channelNumber: string;
  streamUrl: string;
  onBack: () => void;
}

export function VideoPlayer({ channelName, channelNumber, streamUrl, onBack }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const openStream = () => {
    window.open(streamUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Channels
          </Button>
          
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 bg-current rounded-full mr-1" />
              LIVE
            </Badge>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                CH {channelNumber} - {channelName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Manchester United vs Arsenal - Premier League
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openStream}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Open Stream
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-2"
          >
            <Maximize className="w-4 h-4" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <Card 
        ref={containerRef}
        className="relative overflow-hidden bg-black"
      >
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            ref={iframeRef}
            src={streamUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${channelName} Live Stream`}
          />
        </div>
        
        {/* Loading overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/80 rounded-lg px-4 py-2">
            <p className="text-white text-sm font-medium">Live Stream</p>
          </div>
        </div>
      </Card>

      {/* Stream Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">MATCH INFO</h3>
          <div className="space-y-1">
            <p className="text-sm"><strong>Date:</strong> 17/08/2025</p>
            <p className="text-sm"><strong>Venue:</strong> Old Trafford</p>
            <p className="text-sm"><strong>Location:</strong> Manchester</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">STREAM QUALITY</h3>
          <div className="space-y-1">
            <p className="text-sm"><strong>Resolution:</strong> HD 1080p</p>
            <p className="text-sm"><strong>Bitrate:</strong> Adaptive</p>
            <p className="text-sm"><strong>Latency:</strong> Low</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">HELP</h3>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              If stream doesn't load, try refreshing or disable ad blocker
            </p>
            <p className="text-xs text-muted-foreground">
              For best experience use Firefox browser
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}