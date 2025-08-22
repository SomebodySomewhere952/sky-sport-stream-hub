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

  // Auto-enter fullscreen when component mounts for TV-like experience
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fallback if fullscreen not supported
        console.log('Fullscreen not supported');
      });
    }
  }, []);

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Overlay Controls - only show when not in fullscreen */}
      {!isFullscreen && (
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-current rounded-full mr-1" />
                LIVE
              </Badge>
              <div className="text-white">
                <h1 className="text-xl font-bold">
                  CH {channelNumber} - {channelName}
                </h1>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white border-white/20"
          >
            <Maximize className="w-4 h-4" />
            Fullscreen
          </Button>
        </div>
      )}

      {/* Video Player - Full Screen */}
      <div 
        ref={containerRef}
        className="w-full h-full"
      >
        <iframe
          ref={iframeRef}
          src={`${streamUrl}?autoplay=1&muted=0&controls=1`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title={`${channelName} Live Stream`}
        />
      </div>
    </div>
  );
}