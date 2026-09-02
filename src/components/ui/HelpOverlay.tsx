import { useEffect } from 'react';
import { Keyboard, MousePointer, Compass, X } from 'lucide-react';
import { useGalleryStore } from '../../hooks/useGalleryStore';

export default function HelpOverlay() {
  const instructionsOpen = useGalleryStore((state) => state.instructionsOpen);
  const setInstructionsOpen = useGalleryStore((state) => state.setInstructionsOpen);

  // Auto-hide instructions on any WASD keyboard press
  useEffect(() => {
    if (!instructionsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
      if (keys.includes(e.code)) {
        setInstructionsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [instructionsOpen, setInstructionsOpen]);

  if (!instructionsOpen) return null;

  return (
    <div 
      id="onboarding-overlay"
      className="absolute inset-0 z-40 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-6 select-none pointer-events-auto font-sans text-white animate-in fade-in duration-300"
      onClick={() => setInstructionsOpen(false)}
    >
      {/* Onboarding Dialog Card */}
      <div 
        className="w-full max-w-sm bg-black/90 border border-white/10 rounded-lg p-6 md:p-8 flex flex-col gap-6 text-center shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          onClick={() => setInstructionsOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-all active:scale-95"
          title="Dismiss guide"
        >
          <X size={15} />
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#28C7C2] font-bold">
            Virtual Walkthrough
          </span>
          <h2 className="text-lg font-semibold tracking-wide uppercase text-white font-sans">
            Gallery Navigation
          </h2>
          <div className="h-[1px] w-8 bg-white/25 mt-1" />
        </div>

        {/* Instructions Columns */}
        <div className="flex flex-col gap-4 text-left text-xs text-white/80">
          {/* Mouse/Touch instruction */}
          <div className="flex items-start gap-3 bg-white/5 p-2.5 rounded border border-white/5">
            <MousePointer size={15} className="mt-0.5 text-[#28C7C2] shrink-0" />
            <div>
              <strong className="text-white">Look Around:</strong> Drag your mouse anywhere (or swipe on touchscreen) to rotate the camera.
            </div>
          </div>

          {/* Keyboard instruction */}
          <div className="flex items-start gap-3 bg-white/5 p-2.5 rounded border border-white/5">
            <Keyboard size={15} className="mt-0.5 text-[#28C7C2] shrink-0" />
            <div>
              <strong className="text-white">Walk / Roam:</strong> Use <kbd className="px-1 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] font-mono">W</kbd> <kbd className="px-1 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] font-mono">A</kbd> <kbd className="px-1 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] font-mono">S</kbd> <kbd className="px-1 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] font-mono">D</kbd> keys.
            </div>
          </div>

          {/* Footprints instruction */}
          <div className="flex items-start gap-3 bg-white/5 p-2.5 rounded border border-white/5">
            <Compass size={15} className="mt-0.5 text-[#28C7C2] shrink-0" />
            <div>
              <strong className="text-white">Point and Click:</strong> Click circular turquoise hotspots on the floor to smoothly drift directly to that perspective.
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => setInstructionsOpen(false)}
          className="w-full h-10 rounded bg-[#28C7C2] hover:bg-[#20b0ac] text-black font-semibold text-xs tracking-wider uppercase transition-all active:scale-95 shadow-md mt-1"
        >
          Start Exploring
        </button>

        {/* Dismiss label */}
        <p className="text-[10px] text-white/40 font-medium">
          (Guide closes automatically when you walk or rotate)
        </p>
      </div>
    </div>
  );
}
