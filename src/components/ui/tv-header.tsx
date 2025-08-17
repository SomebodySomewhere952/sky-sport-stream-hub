import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export function TvHeader() {
  return (
    <header className="relative bg-card/50 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and branding */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/lovable-uploads/58c339d4-c3f5-4920-ae97-9dd7593c45a0.png" alt="127 Streaming Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">127</h1>
              <p className="text-muted-foreground">Live Sports Streaming</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2 text-sports-green" />
              Connected
            </Badge>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">FireTV</div>
              <div className="text-lg font-semibold text-foreground">Ready to Stream</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-sports" />
    </header>
  );
}