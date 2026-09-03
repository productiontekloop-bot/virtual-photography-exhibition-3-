import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { useGalleryStore } from '../../hooks/useGalleryStore';
import { checkCollision, getRoomIdFromPosition } from '../../utils/collision';

// Pre-allocated scratch vectors to avoid garbage collection spikes
const scratchPosTarget = new Vector3();
const scratchLookTarget = new Vector3();
const scratchDir = new Vector3();
const scratchTargetDir = new Vector3();
const scratchOrbitPosition = new Vector3();
const scratchFloorplanPosition = new Vector3(0, 42, 0.01);
const scratchFloorplanLookAt = new Vector3(0, 0, 0);

export default function PlayerController() {
  const { camera, gl, invalidate } = useThree();
  
  const viewMode = useGalleryStore((state) => state.viewMode);
  const selectedArtwork = useGalleryStore((state) => state.selectedArtwork);

  // Keyboard state
  const keys = useRef<{ [key: string]: boolean }>({
    KeyW: false, KeyS: false, KeyA: false, KeyD: false,
    ShiftLeft: false, ShiftRight: false
  });

  // First-person camera looking state (yaw = left/right, pitch = up/down)
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const dragStartPosition = useRef({ x: 0, y: 0 });

  // Orbit state for perspective/floorplan modes
  const orbitTheta = useRef(-0.6);
  const orbitPhi = useRef(0.85);
  const orbitRadius = useRef(42);
  const orbitCenter = useRef(new Vector3(1, 0, 0));

  // Touch look on mobile
  const previousTouchPosition = useRef({ x: 0, y: 0 });

  // LookAt target interpolation helper
  const currentLookAt = useRef(new Vector3(3, 0, -2));

  // Guided tour timer tracking
  const tourTimer = useRef<number>(0);

  // Store sync rate controller
  const lastStoreUpdate = useRef<number>(0);

  // Initialize camera position from store on mount
  useEffect(() => {
    const state = useGalleryStore.getState();
    if (state.targetPosition) {
      camera.position.set(...state.targetPosition);
    } else {
      camera.position.set(...state.visitorPosition);
    }
    if (state.targetLookAt) {
      currentLookAt.current.set(...state.targetLookAt);
    } else {
      currentLookAt.current.set(...state.visitorTarget);
    }
    camera.lookAt(currentLookAt.current);

    scratchDir.copy(currentLookAt.current).sub(camera.position).normalize();
    yaw.current = Math.atan2(-scratchDir.x, -scratchDir.z);
    pitch.current = Math.asin(scratchDir.y);
  }, [camera]);

  // Handle keyboard events (walkthrough mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedArtwork) return;
      const code = e.code;
      if (code in keys.current) {
        keys.current[code] = true;
        invalidate();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (code in keys.current) {
        keys.current[code] = false;
        invalidate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedArtwork]);

  // Handle Mouse Drag (both walkthrough look and overview orbit)
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (selectedArtwork) return;
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      dragStartPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || selectedArtwork) return;

      if (Math.hypot(e.clientX - dragStartPosition.current.x, e.clientY - dragStartPosition.current.y) < 4) {
        return;
      }

      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      if (viewMode === 'walkthrough') {
        const sensitivity = 0.003;
        yaw.current -= deltaX * sensitivity;
        pitch.current -= deltaY * sensitivity;
        pitch.current = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, pitch.current));
      } else if (viewMode === 'perspective') {
        orbitTheta.current -= deltaX * 0.005;
        orbitPhi.current = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, orbitPhi.current + deltaY * 0.005));
      }

      invalidate();

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (viewMode === 'perspective' || viewMode === 'floorplan') {
        orbitRadius.current = Math.max(20, Math.min(65, orbitRadius.current + e.deltaY * 0.03));
      }
    };

    const domElement = gl.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
    };
  }, [gl, selectedArtwork, viewMode]);

  // Handle Touch Events for Mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (selectedArtwork) return;
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousTouchPosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        dragStartPosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || selectedArtwork || e.touches.length !== 1) return;

      if (Math.hypot(e.touches[0].clientX - dragStartPosition.current.x, e.touches[0].clientY - dragStartPosition.current.y) < 4) {
        return;
      }

      const deltaX = e.touches[0].clientX - previousTouchPosition.current.x;
      const deltaY = e.touches[0].clientY - previousTouchPosition.current.y;

      if (viewMode === 'walkthrough') {
        const sensitivity = 0.005;
        yaw.current -= deltaX * sensitivity;
        pitch.current -= deltaY * sensitivity;
        pitch.current = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, pitch.current));
      } else if (viewMode === 'perspective') {
        orbitTheta.current -= deltaX * 0.007;
        orbitPhi.current = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, orbitPhi.current + deltaY * 0.007));
      }

      invalidate();

      previousTouchPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const domElement = gl.domElement;
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    domElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl, selectedArtwork, viewMode]);

  // Frame Update Loop
  useFrame((state, delta) => {
    const store = useGalleryStore.getState();
    const {
      targetPosition,
      targetLookAt,
      guidedTourActive,
      nextTourNode,
    } = store;

    // 1. HANDLE SMOOTH WARPING INTERPOLATION
    if (targetPosition) {
      scratchPosTarget.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      camera.position.lerp(scratchPosTarget, 0.06);

      if (targetLookAt) {
        scratchLookTarget.set(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
        currentLookAt.current.lerp(scratchLookTarget, 0.06);
        camera.lookAt(currentLookAt.current);
      }

      // Check arrival
      if (camera.position.distanceTo(scratchPosTarget) < 0.12) {
        camera.position.copy(scratchPosTarget);
        if (targetLookAt) {
          currentLookAt.current.set(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
          camera.lookAt(currentLookAt.current);

          scratchDir.copy(currentLookAt.current).sub(camera.position).normalize();
          yaw.current = Math.atan2(-scratchDir.x, -scratchDir.z);
          pitch.current = Math.asin(scratchDir.y);
        }

        store.setVisitorPosition([camera.position.x, camera.position.y, camera.position.z]);
        store.setVisitorTarget([currentLookAt.current.x, currentLookAt.current.y, currentLookAt.current.z]);
        const arrivedRoom = getRoomIdFromPosition(camera.position.x, camera.position.z);
        if (store.activeRoomId !== arrivedRoom) {
          store.setActiveRoomId(arrivedRoom);
        }
        store.clearInterpolationTargets();
      }
      invalidate();
      return;
    }

    // 2. OVERVIEW MODES (Perspective / Floorplan)
    if (viewMode === 'perspective' && !selectedArtwork) {
      if (isDragging.current) {
        const x = orbitCenter.current.x + orbitRadius.current * Math.sin(orbitPhi.current) * Math.sin(orbitTheta.current);
        const y = orbitRadius.current * Math.cos(orbitPhi.current);
        const z = orbitCenter.current.z + orbitRadius.current * Math.sin(orbitPhi.current) * Math.cos(orbitTheta.current);
        scratchOrbitPosition.set(x, y, z);
        camera.position.lerp(scratchOrbitPosition, 0.15);
        camera.lookAt(orbitCenter.current);
        invalidate();
      }
      return;
    }

    if (viewMode === 'floorplan' && !selectedArtwork) {
      camera.position.lerp(scratchFloorplanPosition, 0.1);
      camera.lookAt(scratchFloorplanLookAt);
      if (camera.position.distanceTo(scratchFloorplanPosition) > 0.05) invalidate();
      return;
    }

    // 3. GUIDED TOUR PLAYBACK TICKER
    if (guidedTourActive && !selectedArtwork) {
      tourTimer.current += delta;
      if (tourTimer.current > 6.5) {
        tourTimer.current = 0;
        nextTourNode();
      }
      invalidate();
    } else {
      tourTimer.current = 0;
    }

    // 4. HANDLE FREE ROAMING KEYBOARD MOVEMENT (Walkthrough mode)
    if (selectedArtwork || viewMode !== 'walkthrough') return;

    const speedMultiplier = keys.current.ShiftLeft || keys.current.ShiftRight ? 4.5 : 2.6;
    const moveStep = speedMultiplier * delta;

    let moveX = 0;
    let moveZ = 0;

    if (keys.current.KeyW) moveZ += 1;
    if (keys.current.KeyS) moveZ -= 1;
    if (keys.current.KeyA) moveX -= 1;
    if (keys.current.KeyD) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      const normX = moveX / length;
      const normZ = moveZ / length;

      const sinYaw = Math.sin(yaw.current);
      const cosYaw = Math.cos(yaw.current);

      const worldMoveX = (-sinYaw * normZ + cosYaw * normX) * moveStep;
      const worldMoveZ = (-cosYaw * normZ - sinYaw * normX) * moveStep;

      const proposedX = camera.position.x + worldMoveX;
      const proposedZ = camera.position.z + worldMoveZ;

      const verifiedPos = checkCollision(proposedX, proposedZ, camera.position.x, camera.position.z);

      camera.position.x = verifiedPos.x;
      camera.position.y = 1.65;
      camera.position.z = verifiedPos.z;
      invalidate();
    }

    // 5. APPLY VIEW ROTATION (YAW / PITCH)
    scratchTargetDir.set(
      -Math.sin(yaw.current) * Math.cos(pitch.current),
      Math.sin(pitch.current),
      -Math.cos(yaw.current) * Math.cos(pitch.current)
    ).normalize();

    currentLookAt.current.copy(camera.position).add(scratchTargetDir);
    camera.lookAt(currentLookAt.current);

    if (isDragging.current) invalidate();

    // Sync player coordinates to store
    const now = state.clock.getElapsedTime();
    if (now - lastStoreUpdate.current > 0.1) {
      lastStoreUpdate.current = now;
      store.setVisitorPosition([camera.position.x, camera.position.y, camera.position.z]);
      store.setVisitorTarget([currentLookAt.current.x, currentLookAt.current.y, currentLookAt.current.z]);
      const arrivedRoom = getRoomIdFromPosition(camera.position.x, camera.position.z);
      if (store.activeRoomId !== arrivedRoom) {
        store.setActiveRoomId(arrivedRoom);
      }
    }
  });

  return null;
}
