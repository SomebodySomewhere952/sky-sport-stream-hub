import { Badge } from "@/components/ui/badge";
import { Zap, Trophy, Users, Calendar, TrendingUp } from "lucide-react";

export function TvHeader() {
  return (
    <header className="relative bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-md border-b border-border/30 shadow-lg">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and branding */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-xl overflow-hidden border border-primary/20">
                <img src="/lovable-uploads/6dd9b86e-b150-49c9-8ff2-5609ecc9bc3a.png" alt="127 Football Live Logo" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                127 SPORTS
              </h1>
              <p className="text-muted-foreground font-medium tracking-wide">
                Premium Football Streaming Hub
              </p>
            </div>
          </div>

          {/* Sports Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Trophy className="w-4 h-4" />
                <span>Matches</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Users className="w-4 h-4" />
                <span>Teams</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                <span>Stats</span>
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-sm bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20">
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Live
            </Badge>
            <div className="text-right space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Platform</div>
              <div className="text-sm font-bold text-foreground">FireTV Ready</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced gradient lines */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-red-500 to-primary opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </header>
  );
}