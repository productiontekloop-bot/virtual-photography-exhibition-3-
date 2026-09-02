import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useGalleryStore } from '../../hooks/useGalleryStore';

export default function GuidedTourControls() {
  const {
    guidedTourActive,
    startGuidedTour,
    pauseGuidedTour,
    nextTourNode,
    prevTourNode,
    resetView
  } = useGalleryStore();

  return (
    <div 
      id="guided-tour-controls"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded bg-[#0F0F0FCC]/78 border border-white/10 shadow-lg text-white font-sans text-xs animate-in slide-in-from-bottom duration-300"
    >
      {/* 1. Reset/Restart Tour */}
      <button
        onClick={resetView}
        className="w-8 h-8 rounded hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all active:scale-90"
        title="Reset position & looking angle"
        aria-label="Reset position"
      >
        <RotateCcw size={15} />
      </button>

      {/* Divider */}
      <div className="w-[1px] h-4 bg-white/10" />

      {/* 2. Previous Location Node */}
      <button
        onClick={prevTourNode}
        className="w-8 h-8 rounded hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all active:scale-90"
        title="Previous exhibition location"
        aria-label="Previous location"
      >
        <ChevronLeft size={17} />
      </button>

      {/* 3. Play / Pause Automatic Guided Tour */}
      {guidedTourActive ? (
        <button
          onClick={pauseGuidedTour}
          className="px-3 h-8 rounded bg-[#28C7C2] hover:bg-[#20b0ac] text-black font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider transition-all active:scale-95"
          title="Pause Automatic Guided Tour"
          aria-label="Pause Guided Tour"
        >
          <Pause size={12} fill="currentColor" />
          <span>Tour Active</span>
        </button>
      ) : (
        <button
          onClick={startGuidedTour}
          className="px-3 h-8 rounded hover:bg-white/10 text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider transition-all active:scale-95"
          title="Start Guided Museum Tour"
          aria-label="Start Guided Tour"
        >
          <Play size={12} fill="currentColor" />
          <span>Guided Tour</span>
        </button>
      )}

      {/* 4. Next Location Node */}
      <button
        onClick={nextTourNode}
        className="w-8 h-8 rounded hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all active:scale-90"
        title="Next exhibition location"
        aria-label="Next location"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}
