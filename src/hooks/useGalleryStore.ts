import { create } from 'zustand';
import { EXHIBITIONS, NAVIGATION_NODES, ArtworkData, RoomData, NavigationNode } from '../data/exhibitions';

export type ViewMode = 'perspective' | 'floorplan' | 'walkthrough';

interface GalleryState {
  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Visitor positioning
  visitorPosition: [number, number, number];
  visitorTarget: [number, number, number];
  targetPosition: [number, number, number] | null; // For smooth interpolation
  targetLookAt: [number, number, number] | null;   // For smooth looking direction interpolation
  activeRoomId: string; // 'hallway' or room ID

  // Overlays and UI states
  selectedArtwork: ArtworkData | null;
  instructionsOpen: boolean;
  
  // Guided Tour
  guidedTourActive: boolean;
  currentNodeId: string;

  // Door states: maps roomId -> boolean (true = open, false = closed)
  doorsOpen: Record<string, boolean>;
  
  // Actions
  setVisitorPosition: (pos: [number, number, number]) => void;
  setVisitorTarget: (target: [number, number, number]) => void;
  setActiveRoomId: (id: string) => void;
  setSelectedArtwork: (artwork: ArtworkData | null) => void;
  setInstructionsOpen: (open: boolean) => void;
  toggleDoor: (roomId: string) => boolean;
  setDoorOpen: (roomId: string, isOpen: boolean) => void;
  
  // High-level navigation actions
  navigateToArtwork: (artwork: ArtworkData) => void;
  warpToNode: (nodeId: string) => void;
  warpToRoom: (roomId: string) => void;
  startGuidedTour: () => void;
  pauseGuidedTour: () => void;
  nextTourNode: () => void;
  prevTourNode: () => void;
  resetView: () => void;
  setPerspectiveView: () => void;
  setFloorPlanView: () => void;
  setWalkthroughView: () => void;
  moveToPosition: (position: [number, number, number], lookAt?: [number, number, number]) => void;
  
  // Clear interpolation targets (called once interpolation finishes)
  clearInterpolationTargets: () => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  // Default to the walkthrough mode when entering the website
  viewMode: 'walkthrough',
  setViewMode: (mode) => {
    set({ viewMode: mode, selectedArtwork: null });
    if (mode === 'perspective') {
      get().setPerspectiveView();
    } else if (mode === 'floorplan') {
      get().setFloorPlanView();
    } else {
      get().setWalkthroughView();
    }
  },

  visitorPosition: [6.5, 1.65, 0],
  visitorTarget: [-10, 1.65, 0],
  targetPosition: [6.5, 1.65, 0],
  targetLookAt: [-10, 1.65, 0],
  activeRoomId: 'hallway',

  selectedArtwork: null,
  instructionsOpen: false,

  guidedTourActive: false,
  currentNodeId: 'corridor-east',

  doorsOpen: {
    'room-1': false,
    'room-2': false,
    'room-3': false,
    'room-4': false,
    'room-5': false,
  },

  toggleDoor: (roomId) => {
    const current = get().doorsOpen[roomId] ?? false;
    const next = !current;
    set((state) => ({
      doorsOpen: {
        ...state.doorsOpen,
        [roomId]: next,
      }
    }));
    return next;
  },

  setDoorOpen: (roomId, isOpen) => {
    set((state) => ({
      doorsOpen: {
        ...state.doorsOpen,
        [roomId]: isOpen,
      }
    }));
  },

  setVisitorPosition: (pos) => set({ visitorPosition: pos }),
  setVisitorTarget: (target) => set({ visitorTarget: target }),
  setActiveRoomId: (id) => set({ activeRoomId: id }),
  setSelectedArtwork: (artwork) => {
    if (artwork) {
      // If we are in overview modes, switch to walkthrough mode to inspect the artwork up close
      if (get().viewMode !== 'walkthrough') {
        set({ viewMode: 'walkthrough' });
      }
      // Calculate normal offset vector pointing out of the wall based on artwork rotation
      const nx = Math.sin(artwork.rotation[1]);
      const nz = Math.cos(artwork.rotation[1]);
      const distance = 2.0; // comfortable distance in front of the artwork
      const targetX = artwork.position[0] + nx * distance;
      const targetZ = artwork.position[2] + nz * distance;
      
      set({
        selectedArtwork: artwork,
        targetPosition: [targetX, 1.65, targetZ],
        targetLookAt: [artwork.position[0], artwork.position[1], artwork.position[2]],
        activeRoomId: artwork.room,
        instructionsOpen: false
      });
    } else {
      set({ selectedArtwork: null });
    }
  },
  setInstructionsOpen: (open) => set({ instructionsOpen: open }),

  setPerspectiveView: () => {
    set({
      viewMode: 'perspective',
      targetPosition: [-15, 27, 29],
      targetLookAt: [3, 0, -2],
      selectedArtwork: null,
      guidedTourActive: false
    });
  },

  setFloorPlanView: () => {
    set({
      viewMode: 'floorplan',
      targetPosition: [0, 40, 0.01],
      targetLookAt: [0, 0, 0],
      selectedArtwork: null,
      guidedTourActive: false
    });
  },

  setWalkthroughView: () => {
    set({
      viewMode: 'walkthrough',
      targetPosition: [6.5, 1.65, 0],
      targetLookAt: [-10, 1.65, 0],
      visitorPosition: [6.5, 1.65, 0],
      visitorTarget: [-10, 1.65, 0],
      activeRoomId: 'hallway',
      currentNodeId: 'corridor-east',
      selectedArtwork: null
    });
  },

  navigateToArtwork: (artwork: ArtworkData) => {
    if (get().viewMode !== 'walkthrough') {
      set({ viewMode: 'walkthrough' });
    }
    // Calculate normal offset vector pointing out of the wall based on artwork rotation
    const nx = Math.sin(artwork.rotation[1]);
    const nz = Math.cos(artwork.rotation[1]);
    const distance = Math.max(1.8, Math.max(artwork.width, artwork.height) * 1.15);
    const targetX = artwork.position[0] + nx * distance;
    const targetY = 1.65;
    const targetZ = artwork.position[2] + nz * distance;

    set({
      selectedArtwork: null,
      targetPosition: [targetX, targetY, targetZ],
      targetLookAt: [artwork.position[0], artwork.position[1], artwork.position[2]],
      activeRoomId: artwork.room || 'hallway',
      instructionsOpen: false
    });
  },

  warpToNode: (nodeId) => {
    const node = NAVIGATION_NODES.find(n => n.id === nodeId);
    if (node) {
      set({
        viewMode: 'walkthrough',
        targetPosition: node.position,
        targetLookAt: node.cameraTarget,
        currentNodeId: nodeId,
        activeRoomId: node.room || 'hallway',
        instructionsOpen: false
      });
    }
  },

  warpToRoom: (roomId) => {
    if (roomId === 'hallway' || roomId === 'entrance') {
      get().warpToNode('corridor-east');
      return;
    }
    const room = EXHIBITIONS.find(r => r.id === roomId);
    if (room) {
      set({
        viewMode: 'walkthrough',
        targetPosition: [room.centerPosition[0], 1.65, room.centerPosition[2]],
        targetLookAt: [room.centerPosition[0], 1.65, room.centerPosition[2] - 4],
        activeRoomId: roomId,
        instructionsOpen: false
      });
    }
  },

  startGuidedTour: () => {
    set({ guidedTourActive: true, instructionsOpen: false, viewMode: 'walkthrough' });
    const current = get().currentNodeId;
    if (current === 'entrance' || current === 'corridor-east') {
      get().warpToNode('corridor-east');
    } else {
      get().warpToNode(current);
    }
  },

  pauseGuidedTour: () => {
    set({ guidedTourActive: false });
  },

  nextTourNode: () => {
    const currentId = get().currentNodeId;
    const currentNode = NAVIGATION_NODES.find(n => n.id === currentId);
    if (currentNode && currentNode.nextId) {
      get().warpToNode(currentNode.nextId);
    } else {
      get().warpToNode('entrance');
    }
  },

  prevTourNode: () => {
    const currentId = get().currentNodeId;
    const currentNode = NAVIGATION_NODES.find(n => n.id === currentId);
    if (currentNode && currentNode.prevId) {
      get().warpToNode(currentNode.prevId);
    } else {
      get().warpToNode('room-2-center');
    }
  },

  resetView: () => {
    set({
      viewMode: 'walkthrough',
      targetPosition: [6.5, 1.65, 0],
      targetLookAt: [-10, 1.65, 0],
      visitorPosition: [6.5, 1.65, 0],
      visitorTarget: [-10, 1.65, 0],
      currentNodeId: 'corridor-east',
      activeRoomId: 'hallway',
      guidedTourActive: false,
      selectedArtwork: null
    });
  },

  moveToPosition: (position, lookAt) => {
    set({
      targetPosition: position,
      targetLookAt: lookAt || null,
      instructionsOpen: false
    });
  },

  clearInterpolationTargets: () => {
    set({ targetPosition: null, targetLookAt: null });
  }
}));
