import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Smooth progress bar simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.random() * 15;
        return Math.min(100, Math.floor(prev + step));
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Small timeout to let visitor admire the loading logo, then fade out
      const fadeTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 500);

      // Entirely unmount loading screen from the DOM after animation completes (500ms transition)
      const removeTimeout = setTimeout(() => {
        setShouldRender(false);
      }, 1000);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [progress]);

  if (!shouldRender) return null;

  return (
    <div 
      id="loading-screen"
      className={`fixed inset-0 z-[200] bg-[#FDFBF7] flex flex-col items-center justify-center p-8 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Editorial Branding Logo Stack */}
      <div className="flex flex-col items-center gap-2 mb-10 text-center select-none">
        <span className="font-serif italic text-4xl md:text-5xl font-medium tracking-tight text-[#111111]">
          Photography
        </span>
        <span className="font-sans text-[11px] font-normal tracking-[0.45em] text-[#555555] uppercase mt-1 pl-[0.45em]">
          YVES ADES RETROSPECTIVE
        </span>
      </div>

      {/* Progress metrics and animated slider */}
      <div className="w-full max-w-[200px] flex flex-col items-center gap-2 font-sans">
        <div className="w-full h-[2px] bg-neutral-100 overflow-hidden rounded">
          <div 
            className="h-full bg-[#28C7C2] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between w-full text-[10px] text-[#555555] tracking-widest font-medium uppercase mt-1">
          <span>Curating...</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Curatorial Credit */}
      <div className="absolute bottom-8 text-[9px] text-neutral-400 font-sans tracking-[0.2em] uppercase font-medium">
        Yves Ades Gallery Retrospective • Basel 2026
      </div>
    </div>
  );
}
