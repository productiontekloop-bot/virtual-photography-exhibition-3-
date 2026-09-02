import { useState, useEffect } from 'react';
import { 
  Maximize, 
  Minimize, 
  HelpCircle,
  Eye,
  Compass,
  Footprints
} from 'lucide-react';
import { useGalleryStore } from '../../hooks/useGalleryStore';

export default function GalleryToolbar() {
  const {
    viewMode,
    setViewMode,
    instructionsOpen,
    activeRoomId,
    setInstructionsOpen,
    warpToRoom
  } = useGalleryStore();

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Monitor browser fullscreen state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Toggle standard browser fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen request denied.', e);
    }
  };

  return (
    <>
      {/* Top Left Navigation Mode Pills */}
      <div 
        id="gallery-view-modes"
        className="absolute top-4 left-4 z-50 flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-lg shadow-md border border-neutral-200"
      >
        <button
          onClick={() => setViewMode('walkthrough')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
            viewMode === 'walkthrough' 
              ? 'bg-neutral-900 text-white shadow-sm' 
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
          title="First-Person Walkthrough"
        >
          <Footprints size={13} />
          <span className="hidden sm:inline">Walkthrough</span>
        </button>
      </div>

      {/* Top Center Quick Room Teleporters */}
      <div 
        id="gallery-room-pills"
        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-lg shadow-md border border-neutral-200 text-xs font-medium"
      >
        <span className="px-2 text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
          Rooms
        </span>
        {[1, 2, 3, 4, 5].map((num) => {
          const roomId = `room-${num}`;
          const isActive = activeRoomId === roomId;
          return (
            <button
              key={num}
              onClick={() => warpToRoom(roomId)}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-[#C4A875] text-white font-bold shadow-sm' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              title={`Jump to Room ${num}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Top Right Utility Toolbar */}
      <div 
        id="gallery-toolbar"
        className="absolute top-4 right-4 z-50 flex items-center gap-2 transition-all duration-300"
      >
        {/* Help Controls */}
        <button
          id="btn-help"
          onClick={() => setInstructionsOpen(!instructionsOpen)}
          className={`w-9 h-9 rounded-md bg-white/90 backdrop-blur-md hover:bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center transition-all shadow-sm active:scale-95 ${
            instructionsOpen ? 'ring-2 ring-neutral-900 bg-white' : ''
          }`}
          title="Controls Guide [H]"
        >
          <HelpCircle size={15} />
        </button>

        {/* Fullscreen */}
        <button
          id="btn-fullscreen"
          onClick={toggleFullscreen}
          className="w-9 h-9 rounded-md bg-white/90 backdrop-blur-md hover:bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center transition-all shadow-sm active:scale-95 hidden sm:flex"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
        </button>
      </div>
    </>
  );
}
