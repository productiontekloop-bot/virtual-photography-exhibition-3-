import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const [running, setRunning] = useState(false);

  // Detect mobile device/touch capabilities
  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth < 1024;
      setIsMobile(hasTouch && isSmall);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isMobile) return null;

  // Helper to trigger simulated keyboard events on the global window context
  const triggerKeyEvent = (type: 'keydown' | 'keyup', code: string) => {
    const event = new KeyboardEvent(type, {
      code,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  const handleTouchStart = (code: string) => {
    triggerKeyEvent('keydown', code);
  };

  const handleTouchEnd = (code: string) => {
    triggerKeyEvent('keyup', code);
  };

  const toggleRun = () => {
    const nextRunning = !running;
    setRunning(nextRunning);
    triggerKeyEvent(nextRunning ? 'keydown' : 'keyup', 'ShiftLeft');
  };

  return (
    <div 
      id="mobile-touch-pad"
      className="absolute bottom-6 left-6 z-50 flex flex-col items-center gap-1.5 md:hidden select-none pointer-events-auto"
    >
      {/* 1. UP BUTTON */}
      <button
        onTouchStart={() => handleTouchStart('KeyW')}
        onTouchEnd={() => handleTouchEnd('KeyW')}
        onMouseDown={() => handleTouchStart('KeyW')}
        onMouseUp={() => handleTouchEnd('KeyW')}
        className="w-12 h-12 rounded bg-[#0F0F0FCC]/78 border border-white/10 text-white flex items-center justify-center active:bg-[#28C7C2] active:text-black transition-colors shadow-md"
        title="Walk Forward"
        aria-label="Walk Forward"
      >
        <ArrowUp size={18} />
      </button>

      {/* 2. HORIZONTAL ROW (LEFT, SPEED/RUN, RIGHT) */}
      <div className="flex items-center gap-1.5">
        {/* Left */}
        <button
          onTouchStart={() => handleTouchStart('KeyA')}
          onTouchEnd={() => handleTouchEnd('KeyA')}
          onMouseDown={() => handleTouchStart('KeyA')}
          onMouseUp={() => handleTouchEnd('KeyA')}
          className="w-12 h-12 rounded bg-[#0F0F0FCC]/78 border border-white/10 text-white flex items-center justify-center active:bg-[#28C7C2] active:text-black transition-colors shadow-md"
          title="Walk Left"
          aria-label="Walk Left"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Sprint Lock */}
        <button
          onClick={toggleRun}
          className={`w-11 h-11 rounded border flex items-center justify-center transition-colors shadow-md ${running ? 'bg-[#FFEB3B] border-[#FFEB3B] text-black font-bold' : 'bg-[#0F0F0FCC]/78 border-white/10 text-white/70'}`}
          title="Toggle Sprint Lock"
          aria-label="Sprint Lock"
        >
          <Zap size={15} fill={running ? "currentColor" : "none"} />
        </button>

        {/* Right */}
        <button
          onTouchStart={() => handleTouchStart('KeyD')}
          onTouchEnd={() => handleTouchEnd('KeyD')}
          onMouseDown={() => handleTouchStart('KeyD')}
          onMouseUp={() => handleTouchEnd('KeyD')}
          className="w-12 h-12 rounded bg-[#0F0F0FCC]/78 border border-white/10 text-white flex items-center justify-center active:bg-[#28C7C2] active:text-black transition-colors shadow-md"
          title="Walk Right"
          aria-label="Walk Right"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* 3. DOWN BUTTON */}
      <button
        onTouchStart={() => handleTouchStart('KeyS')}
        onTouchEnd={() => handleTouchEnd('KeyS')}
        onMouseDown={() => handleTouchStart('KeyS')}
        onMouseUp={() => handleTouchEnd('KeyS')}
        className="w-12 h-12 rounded bg-[#0F0F0FCC]/78 border border-white/10 text-white flex items-center justify-center active:bg-[#28C7C2] active:text-black transition-colors shadow-md"
        title="Walk Backward"
        aria-label="Walk Backward"
      >
        <ArrowDown size={18} />
      </button>
    </div>
  );
}
