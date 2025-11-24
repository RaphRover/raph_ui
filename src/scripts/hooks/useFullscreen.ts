import { useState, useEffect, useCallback } from 'react';

export type FullscreenHook = {
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
  isSupported: boolean;
};

export default function useFullscreen(): FullscreenHook {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isSupported =
    typeof document !== 'undefined' && 'fullscreenEnabled' in document;

  useEffect(() => {
    if (!isSupported) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isSupported]);

  const toggleFullscreen = useCallback(async () => {
    if (!isSupported) {
      console.warn('[useFullscreen] Fullscreen API not supported');
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('[useFullscreen] Error toggling fullscreen:', err);
    }
  }, [isSupported]);

  return { isFullscreen, toggleFullscreen, isSupported };
}
