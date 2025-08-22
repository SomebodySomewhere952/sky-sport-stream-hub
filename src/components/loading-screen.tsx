import { useEffect, useState } from "react";
import { CheckCircle, Clock, Loader2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

interface LoadingItem {
  id: string;
  name: string;
  status: 'waiting' | 'loading' | 'completed';
  delay: number;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState<LoadingItem[]>([
    { id: 'live-tv', name: 'LIVE TV', status: 'waiting', delay: 0 },
    { id: 'vod', name: 'VOD', status: 'waiting', delay: 800 },
    { id: 'series', name: 'SERIES', status: 'waiting', delay: 1600 },
    { id: 'guide', name: 'EPG GUIDE', status: 'waiting', delay: 2400 }
  ]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  useEffect(() => {
    // Update each item with delays
    items.forEach((item, index) => {
      setTimeout(() => {
        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'loading' } : i
        ));
        
        // Complete after loading for 1.2 seconds
        setTimeout(() => {
          setItems(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: 'completed' } : i
          ));
        }, 1200);
      }, item.delay);
    });

    // Complete the loading screen after all items are done
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000);
    }, 5500);

    // Add Fire TV remote support
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
        event.preventDefault();
        handleSkip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(completeTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background z-40 animate-fade-out" />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-card to-background z-40 flex items-center justify-center">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/20 rotate-45 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-accent/20 rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-primary/30 -rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Update Media Contents
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Loading grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center h-48 transition-all duration-500 hover:bg-card/90"
              style={{ 
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${item.status === 'completed' ? '-4px' : '0'})`,
                boxShadow: item.status === 'completed' ? '0 10px 30px rgba(59,130,246,0.2)' : 'none'
              }}
            >
              {/* Status Icon */}
              <div className="mb-4">
                {item.status === 'waiting' && (
                  <Clock className="w-8 h-8 text-muted-foreground" />
                )}
                {item.status === 'loading' && (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                )}
                {item.status === 'completed' && (
                  <CheckCircle className="w-8 h-8 text-green-500 animate-scale-in" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-center mb-3 uppercase tracking-wide">
                {item.name}
              </h3>

              {/* Status Text */}
              <div className="text-center">
                {item.status === 'waiting' && (
                  <span className="text-muted-foreground text-sm">Waiting...</span>
                )}
                {item.status === 'loading' && (
                  <span className="text-primary text-sm font-medium animate-pulse">Loading...</span>
                )}
                {item.status === 'completed' && (
                  <span className="text-green-500 text-sm font-bold animate-fade-in">Completed!</span>
                )}
              </div>

              {/* Progress bar for loading state */}
              {item.status === 'loading' && (
                <div className="w-full mt-4">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse rounded-full" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-card/60 backdrop-blur-md border border-border/30 rounded-full px-8 py-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-lg font-medium">
              Please wait
              <span className="animate-pulse">......</span>
            </span>
          </div>
        </div>

        {/* Skip hint */}
        <div className="text-center mt-8 opacity-60">
          <span className="text-sm">Press ENTER to skip</span>
        </div>
      </div>
    </div>
  );
}