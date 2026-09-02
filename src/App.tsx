import VirtualGallery from './components/gallery/VirtualGallery';
import GalleryToolbar from './components/ui/GalleryToolbar';
import GuidedTourControls from './components/ui/GuidedTourControls';
import LoadingScreen from './components/ui/LoadingScreen';
import MobileControls from './components/ui/MobileControls';
import HelpOverlay from './components/ui/HelpOverlay';

export default function App() {
  return (
    <div id="app-root" className="w-screen h-screen relative bg-[#ECECE9] overflow-hidden select-none">
      {/* 1. Immersive 3D WebGL Canvas Scene (Central Corridor + 5 themed rooms) */}
      <VirtualGallery />

      {/* 2. Sleek Editorial Onboarding Loading Screen */}
      <LoadingScreen />

      {/* 3. Navigation Controls Floating Toolbar (Top-Left, Center, Top-Right) */}
      <GalleryToolbar />

      {/* 4. Guided Tour Playback Controls Panel (Bottom-Center) */}
      <GuidedTourControls />

      {/* 5. Mobile Virtual Joysticks & Sprint locks (Bottom-Left) */}
      <MobileControls />

      {/* 6. Onboarding Temporary Key Controls Guide Overlay */}
      <HelpOverlay />
    </div>
  );
}
