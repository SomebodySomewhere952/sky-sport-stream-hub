import { useEffect, useState } from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  useEffect(() => {
    // Start logo fade-in animation after a brief delay
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    // Auto-complete intro after 3 seconds
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade-out to complete
    }, 3500);

    // Add Fire TV remote support for intro screen
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
        event.preventDefault();
        handleSkip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, handleSkip]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center animate-fade-out">
        <div className={`transition-all duration-1000 ${logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img 
            src="/lovable-uploads/6dd9b86e-b150-49c9-8ff2-5609ecc9bc3a.png" 
            alt="127 Football Live Logo" 
            className="w-64 h-64 object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-background to-background" />
      
      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center">
        <div 
          className={`transition-all duration-2000 ease-out ${
            logoVisible 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-75 translate-y-8'
          }`}
        >
          <img 
            src="/lovable-uploads/6dd9b86e-b150-49c9-8ff2-5609ecc9bc3a.png" 
            alt="127 Football Live Logo" 
            className="w-64 h-64 object-contain filter drop-shadow-2xl"
          />
        </div>
        
        {/* Subtle glow effect */}
        <div 
          className={`absolute inset-0 transition-opacity duration-2000 ${
            logoVisible ? 'opacity-30' : 'opacity-0'
          }`}
        >
          <div className="w-64 h-64 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />
        </div>
      </div>


      {/* Loading indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${
        logoVisible ? 'opacity-50' : 'opacity-0'
      }`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}