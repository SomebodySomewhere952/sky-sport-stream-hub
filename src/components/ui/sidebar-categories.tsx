
import { ChevronRight } from "lucide-react";

interface CategoryItemProps {
  title: string;
  isActive?: boolean;
}

function CategoryItem({ title, isActive = false }: CategoryItemProps) {
  return (
    <button className={`performance-optimized w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors duration-150 group ${
      isActive 
        ? 'bg-primary/20 text-primary border border-primary/30' 
        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`}>
      <span className="font-medium uppercase tracking-wide text-sm">{title}</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}

export function SidebarCategories() {
  return (
    <div className="performance-optimized w-80 bg-card backdrop-blur-none p-6 space-y-3">
      <CategoryItem title="LIVE SPORTS" isActive />
      <CategoryItem title="PREMIER LEAGUE" />
      <CategoryItem title="CHAMPIONS LEAGUE" />
      <CategoryItem title="FOOTBALL HIGHLIGHTS" />
      <CategoryItem title="SKY SPORTS" />
      <CategoryItem title="TNT SPORTS" />
      <CategoryItem title="SPORTS NEWS" />
      <CategoryItem title="MATCH REPLAYS" />
    </div>
  );
}
