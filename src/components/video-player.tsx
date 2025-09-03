import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Maximize, Volume2, VolumeX, RotateCcw, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useTvNavigationSection, useFireTvNavigation } from "@/hooks/use-fire-tv-navigation";
import { isTvDevice } from "@/utils/device-detection";

interface VideoPlayerProps {
  channelName: string;
  channelNumber: string;
  streamUrl: string;
  onBack: () => void;
}

export function VideoPlayer({ channelName, channelNumber, streamUrl, onBack }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { navigateToSection } = useFireTvNavigation();

  const { registerItem, unregisterItem } = useTvNavigationSection({
    id: 'player',
    name: 'Video Player Controls',
    priority: 0,
    defaultFocus: 'back-button'
  });

  // Register Fire TV navigation items for video controls
  useEffect(() => {
    const controlItems = [
      { id: 'back-button', row: 0, col: 0 },
      { id: 'play-pause', row: 0, col: 1 },
      { id: 'rewind', row: 0, col: 2 },
      { id: 'fast-forward', row: 0, col: 3 },
      { id: 'fullscreen', row: 0, col: 4 }
    ];

    controlItems.forEach(item => {
      registerItem({
        id: item.id,
        element: null,
        section: 'player',
        row: item.row,
        col: item.col,
        focusable: true,
        onSelect: () => {
          switch (item.id) {
            case 'back-button':
              handleBack();
              break;
            case 'play-pause':
              togglePlayPause();
              break;
            case 'rewind':
              handleRewind();
              break;
            case 'fast-forward':
              handleFastForward();
              break;
            case 'fullscreen':
              toggleFullscreen();
              break;
          }
        },
        onBack: () => {
          if (item.id === 'back-button') {
            handleBack();
          }
        }
      });
    });

    return () => {
      controlItems.forEach(item => {
        unregisterItem(item.id);
      });
    };
  }, [registerItem, unregisterItem]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      if (isFullscreen) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    resetControlsTimeout();
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  const handleBack = () => {
    navigateToSection('main');
    onBack();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Send message to iframe if possible
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: isPlaying ? 'pause' : 'play'
      }, '*');
    }
  };

  const handleRewind = () => {
    // Send rewind command to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'rewind'
      }, '*');
    }
  };

  const handleFastForward = () => {
    // Send fast forward command to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'fastforward'
      }, '*');
    }
  };

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
      // Show controls when any key is pressed
      setShowControls(true);
      
      if (e.key === 'Escape') {
        handleBack();
      }
    };

    // Listen for Fire TV media control events
    const handleFireTvMediaControl = (event: CustomEvent) => {
      const { buttonType } = event.detail;
      
      switch (buttonType) {
        case 'PLAY_PAUSE':
          togglePlayPause();
          break;
        case 'REWIND':
          handleRewind();
          break;
        case 'FAST_FORWARD':
          handleFastForward();
          break;
        case 'BACK':
          handleBack();
          break;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('firetv-play_pause', handleFireTvMediaControl as EventListener);
    document.addEventListener('firetv-rewind', handleFireTvMediaControl as EventListener);
    document.addEventListener('firetv-fast_forward', handleFireTvMediaControl as EventListener);
    document.addEventListener('firetv-back', handleFireTvMediaControl as EventListener);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('firetv-play_pause', handleFireTvMediaControl as EventListener);
      document.removeEventListener('firetv-rewind', handleFireTvMediaControl as EventListener);
      document.removeEventListener('firetv-fast_forward', handleFireTvMediaControl as EventListener);
      document.removeEventListener('firetv-back', handleFireTvMediaControl as EventListener);
    };
  }, [onBack]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      data-media-player
      onMouseMove={() => setShowControls(true)}
    >
      {/* Overlay Controls */}
      {(!isFullscreen || showControls) && (
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              data-tv-id="back-button"
              variant="secondary"
              size="sm"
              onClick={handleBack}
              className={`flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white border-white/20 tv-focusable ${isTvDevice() ? 'tv-button' : ''}`}
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
                <h1 className={`text-xl font-bold ${isTvDevice() ? 'tv-text' : ''}`}>
                  CH {channelNumber} - {channelName}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Media Controls for Fire TV */}
            {isTvDevice() && (
              <>
                <Button
                  data-tv-id="rewind"
                  variant="secondary"
                  size="sm"
                  onClick={handleRewind}
                  className="flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white border-white/20 tv-focusable tv-button"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  data-tv-id="play-pause"
                  variant="secondary"
                  size="sm"
                  onClick={togglePlayPause}
                  className="flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white border-white/20 tv-focusable tv-button"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  data-tv-id="fast-forward"
                  variant="secondary"
                  size="sm"
                  onClick={handleFastForward}
                  className="flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white border-white/20 tv-focusable tv-button"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </>
            )}
            
            <Button
              data-tv-id="fullscreen"
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className={`flex items-center gap-2 bg-black/70 hover:bg-black/90 text-white border-white/20 tv-focusable ${isTvDevice() ? 'tv-button' : ''}`}
            >
              <Maximize className="w-4 h-4" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Fire TV Remote Instructions */}
      {isTvDevice() && showControls && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs opacity-75">
          <div>⏯️ PLAY/PAUSE to toggle</div>
          <div>⏪ REWIND button</div>
          <div>⏩ FAST FORWARD button</div>
          <div>← BACK to exit</div>
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