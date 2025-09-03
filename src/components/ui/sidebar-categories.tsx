
import { ChevronRight } from "lucide-react";
import { useTvNavigationSection } from "@/hooks/use-fire-tv-navigation";
import { isTvDevice } from "@/utils/device-detection";
import { useEffect } from "react";

interface CategoryItemProps {
  title: string;
  isActive?: boolean;
  tvNavigationId?: string;
  onSelect?: () => void;
}

function CategoryItem({ title, isActive = false, tvNavigationId, onSelect }: CategoryItemProps) {
  return (
    <button 
      data-tv-id={tvNavigationId}
      className={`performance-optimized w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors duration-150 group tv-focusable ${
        isActive 
          ? 'bg-primary/20 text-primary border border-primary/30' 
          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      } ${isTvDevice() ? 'tv-button' : ''}`}
      onClick={onSelect}
      tabIndex={0}
    >
      <span className="font-medium uppercase tracking-wide text-sm tv-text">{title}</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}

export function SidebarCategories() {
  const categories = [
    { title: "LIVE SPORTS", isActive: true },
    { title: "PREMIER LEAGUE" },
    { title: "CHAMPIONS LEAGUE" },
    { title: "FOOTBALL HIGHLIGHTS" },
    { title: "SKY SPORTS" },
    { title: "TNT SPORTS" },
    { title: "SPORTS NEWS" },
    { title: "MATCH REPLAYS" }
  ];

  const { registerItem, unregisterItem } = useTvNavigationSection({
    id: 'sidebar',
    name: 'Sidebar Categories',
    priority: 1,
    defaultFocus: 'category-0'
  });

  useEffect(() => {
    categories.forEach((category, index) => {
      const itemId = `category-${index}`;
      
      registerItem({
        id: itemId,
        element: null, // Will be set by the button element
        section: 'sidebar',
        row: index,
        col: 0,
        focusable: true,
        onSelect: () => {
          console.log(`Selected category: ${category.title}`);
          // Could implement category filtering here
        }
      });
    });

    return () => {
      categories.forEach((_, index) => {
        unregisterItem(`category-${index}`);
      });
    };
  }, [registerItem, unregisterItem]);

  return (
    <div className={`performance-optimized w-80 bg-card backdrop-blur-none p-6 space-y-3 ${isTvDevice() ? 'tv-safe-area' : ''}`}>
      {categories.map((category, index) => (
        <CategoryItem 
          key={category.title}
          title={category.title} 
          isActive={category.isActive}
          tvNavigationId={`category-${index}`}
          onSelect={() => console.log(`Selected: ${category.title}`)}
        />
      ))}
    </div>
  );
}
