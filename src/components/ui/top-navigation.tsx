
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export function TopNavigation() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-card/50 backdrop-blur-md border-b border-border/30">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
          <img src="/lovable-uploads/6dd9b86e-b150-49c9-8ff2-5609ecc9bc3a.png" alt="127 Sports" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl font-bold">127 SPORTS</span>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center gap-2">
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:bg-primary/90">
          Channels
        </button>
        <button className="px-6 py-2 bg-muted/50 text-muted-foreground rounded-full font-medium transition-all hover:bg-muted hover:text-foreground">
          Movies
        </button>
        <button className="px-6 py-2 bg-muted/50 text-muted-foreground rounded-full font-medium transition-all hover:bg-muted hover:text-foreground">
          Series
        </button>
        <button className="px-6 py-2 bg-muted/50 text-muted-foreground rounded-full font-medium transition-all hover:bg-muted hover:text-foreground">
          Radio
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <Badge variant="outline" className="px-3 py-1 bg-green-500/10 border-green-500/30 text-green-400">
          Subscription Expires: Never
        </Badge>
        <div className="text-right space-y-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Logged In As</div>
          <div className="text-sm font-bold text-foreground">Admin</div>
        </div>
      </div>
    </nav>
  );
}
