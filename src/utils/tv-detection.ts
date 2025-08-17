/**
 * Utility functions for detecting Fire TV and other TV devices
 */

export function isFireTv(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('afts') || // Fire TV Stick
         userAgent.includes('aftb') || // Fire TV Box  
         userAgent.includes('aftm') || // Fire TV
         userAgent.includes('aft');    // General Fire TV
}

export function isTvDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return isFireTv() || 
         window.screen.width >= 1920 || // Large screens
         userAgent.includes('tv') ||
         userAgent.includes('smarttv') ||
         userAgent.includes('webos') ||     // LG Smart TV
         userAgent.includes('tizen') ||     // Samsung Smart TV
         userAgent.includes('roku');        // Roku
}

export function getTvDeviceType(): 'fire-tv' | 'smart-tv' | 'large-screen' | 'desktop' {
  if (isFireTv()) return 'fire-tv';
  if (isTvDevice()) return 'smart-tv';
  if (window.screen.width >= 1920) return 'large-screen';
  return 'desktop';
}

export function isTvRemoteInputAvailable(): boolean {
  // Check if we're on a device that likely uses remote input
  return isTvDevice() || window.screen.width >= 1920;
}