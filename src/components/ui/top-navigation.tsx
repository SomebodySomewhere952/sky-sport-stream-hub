
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useTvNavigationSection } from "@/hooks/use-fire-tv-navigation";
import { isTvDevice } from "@/utils/device-detection";
import { useEffect } from "react";

export function TopNavigation() {
  const navigationItems = [
    { title: "Channels", isActive: true },
    { title: "Movies" },
    { title: "Series" },
    { title: "Radio" }
  ];

  const { registerItem, unregisterItem } = useTvNavigationSection({
    id: 'header',
    name: 'Header Navigation',
    priority: 0,
    defaultFocus: 'nav-0'
  });

  useEffect(() => {
    navigationItems.forEach((item, index) => {
      registerItem({
        id: `nav-${index}`,
        element: null,
        section: 'header',
        row: 0,
        col: index,
        focusable: true,
        onSelect: () => {
          console.log(`Selected navigation: ${item.title}`);
        }
      });
    });

    // Register search button
    registerItem({
      id: 'search-button',
      element: null,
      section: 'header',
      row: 0,
      col: navigationItems.length,
      focusable: true,
      onSelect: () => {
        console.log('Search activated');
      }
    });

    return () => {
      navigationItems.forEach((_, index) => {
        unregisterItem(`nav-${index}`);
      });
      unregisterItem('search-button');
    };
  }, [registerItem, unregisterItem]);

  return (
    <nav className={`performance-optimized flex items-center justify-between px-8 py-4 bg-card backdrop-blur-none border-b border-border/30 ${isTvDevice() ? 'tv-safe-area' : ''}`}>
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
          <img src="/lovable-uploads/6dd9b86e-b150-49c9-8ff2-5609ecc9bc3a.png" alt="127 Sports" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl font-bold tv-text">127 SPORTS</span>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center gap-2">
        {navigationItems.map((item, index) => (
          <button 
            key={item.title}
            data-tv-id={`nav-${index}`}
            className={`px-6 py-2 rounded-full font-medium transition-all tv-focusable ${
              item.isActive
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            } ${isTvDevice() ? 'tv-button tv-text' : ''}`}
            tabIndex={0}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button 
          data-tv-id="search-button"
          className={`w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors tv-focusable ${isTvDevice() ? 'tv-button' : ''}`}
          tabIndex={0}
        >
          <Search className="w-5 h-5" />
        </button>
        <Badge variant="outline" className="px-3 py-1 bg-green-500/10 border-green-500/30 text-green-400">
          Subscription Expires: Never
        </Badge>
        <div className="text-right space-y-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Logged In As</div>
          <div className={`text-sm font-bold text-foreground ${isTvDevice() ? 'tv-text' : ''}`}>Admin</div>
        </div>
      </div>
    </nav>
  );
}
