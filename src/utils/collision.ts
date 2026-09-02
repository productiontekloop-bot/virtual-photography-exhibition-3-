/**
 * Geometric collision system for the 5-room modern virtual photography exhibition.
 * Restricts player movement to Room 1, 2, 3, 4, 5, central corridor, and connecting doorways.
 * Doors block movement when closed, and allow passage when opened.
 */
import { useGalleryStore } from '../hooks/useGalleryStore';

function isDoorPassable(roomId: string): boolean {
  const doorsOpen = useGalleryStore.getState().doorsOpen;
  if (!doorsOpen) return false;
  return Boolean(doorsOpen[roomId]);
}

export function checkCollision(x: number, z: number, currentX?: number, currentZ?: number): { x: number; z: number } {
  const pad = 0.45; // Camera clearance padding from walls

  // Global outer perimeter bounds
  let nx = Math.max(-18 + pad, Math.min(18 - pad, x));
  let nz = Math.max(-18 + pad, Math.min(18 - pad, z));

  // If current position is provided, strictly enforce boundaries of current room & doorway passages
  if (currentX !== undefined && currentZ !== undefined) {
    const currentRoom = getRoomIdFromPosition(currentX, currentZ);

    if (currentRoom === 'room-5') {
      // Room 5 outer bounds
      nx = Math.max(-18 + pad, nx);
      nz = Math.max(-18 + pad, Math.min(18 - pad, nz));
      // Door to hallway at X = -10, Z = 0
      const canPass = isDoorPassable('room-5');
      const inDoorway = Math.abs(currentZ - 0) < 0.85 && Math.abs(z - 0) < 0.85;
      if (inDoorway && canPass) {
        nx = Math.min(18 - pad, nx); // Can walk through open door into hallway
      } else {
        nx = Math.min(-10 - pad, nx); // Blocked by solid wall or closed door
      }
      return { x: nx, z: nz };
    }

    if (currentRoom === 'hallway') {
      // East perimeter
      nx = Math.min(18 - pad, nx);

      // West wall at X = -10: Door to Room 5 at Z = 0
      if (nx < -10 + pad) {
        const canPass = isDoorPassable('room-5');
        const inRoom5Door = Math.abs(currentZ - 0) < 0.85 && Math.abs(z - 0) < 0.85;
        if (inRoom5Door && canPass) {
          nx = Math.max(-18 + pad, nx);
        } else {
          nx = -10 + pad;
        }
      }

      // North wall at Z = -3.2: Door to Room 4 (X = -3) and Room 3 (X = 11)
      if (nz < -3.2 + pad) {
        const canPass4 = isDoorPassable('room-4');
        const canPass3 = isDoorPassable('room-3');
        const inRoom4Door = Math.abs(currentX - (-3)) < 0.85 && Math.abs(x - (-3)) < 0.85;
        const inRoom3Door = Math.abs(currentX - 11) < 0.85 && Math.abs(x - 11) < 0.85;
        if ((inRoom4Door && canPass4) || (inRoom3Door && canPass3)) {
          nz = Math.max(-18 + pad, nz);
        } else {
          nz = -3.2 + pad;
        }
      }

      // South wall at Z = +3.2: Door to Room 2 (X = -3) and Room 1 (X = 11)
      if (nz > 3.2 - pad) {
        const canPass2 = isDoorPassable('room-2');
        const canPass1 = isDoorPassable('room-1');
        const inRoom2Door = Math.abs(currentX - (-3)) < 0.85 && Math.abs(x - (-3)) < 0.85;
        const inRoom1Door = Math.abs(currentX - 11) < 0.85 && Math.abs(x - 11) < 0.85;
        if ((inRoom2Door && canPass2) || (inRoom1Door && canPass1)) {
          nz = Math.min(18 - pad, nz);
        } else {
          nz = 3.2 - pad;
        }
      }

      return { x: nx, z: nz };
    }

    if (currentRoom === 'room-4') {
      // Solid walls on West (X = -10), East (X = 4), North (Z = -18)
      nx = Math.max(-10 + pad, Math.min(4 - pad, nx));
      nz = Math.max(-18 + pad, nz);

      // South wall at Z = -3.2: Door to hallway at X = -3
      if (nz > -3.2 - pad) {
        const canPass = isDoorPassable('room-4');
        const inDoor = Math.abs(currentX - (-3)) < 0.85 && Math.abs(x - (-3)) < 0.85;
        if (inDoor && canPass) {
          nz = Math.min(3.2 - pad, nz);
        } else {
          nz = -3.2 - pad;
        }
      }
      return { x: nx, z: nz };
    }

    if (currentRoom === 'room-3') {
      // Solid walls on West (X = 4), East (X = 18), North (Z = -18)
      nx = Math.max(4 + pad, Math.min(18 - pad, nx));
      nz = Math.max(-18 + pad, nz);

      // South wall at Z = -3.2: Door to hallway at X = 11
      if (nz > -3.2 - pad) {
        const canPass = isDoorPassable('room-3');
        const inDoor = Math.abs(currentX - 11) < 0.85 && Math.abs(x - 11) < 0.85;
        if (inDoor && canPass) {
          nz = Math.min(3.2 - pad, nz);
        } else {
          nz = -3.2 - pad;
        }
      }
      return { x: nx, z: nz };
    }

    if (currentRoom === 'room-2') {
      // Solid walls on West (X = -10), East (X = 4), South (Z = 18)
      nx = Math.max(-10 + pad, Math.min(4 - pad, nx));
      nz = Math.min(18 - pad, nz);

      // North wall at Z = 3.2: Door to hallway at X = -3
      if (nz < 3.2 + pad) {
        const canPass = isDoorPassable('room-2');
        const inDoor = Math.abs(currentX - (-3)) < 0.85 && Math.abs(x - (-3)) < 0.85;
        if (inDoor && canPass) {
          nz = Math.max(-3.2 + pad, nz);
        } else {
          nz = 3.2 + pad;
        }
      }
      return { x: nx, z: nz };
    }

    if (currentRoom === 'room-1') {
      // Solid walls on West (X = 4), East (X = 18), South (Z = 18)
      nx = Math.max(4 + pad, Math.min(18 - pad, nx));
      nz = Math.min(18 - pad, nz);

      // North wall at Z = 3.2: Door to hallway at X = 11
      if (nz < 3.2 + pad) {
        const canPass = isDoorPassable('room-1');
        const inDoor = Math.abs(currentX - 11) < 0.85 && Math.abs(x - 11) < 0.85;
        if (inDoor && canPass) {
          nz = Math.max(-3.2 + pad, nz);
        } else {
          nz = 3.2 + pad;
        }
      }
      return { x: nx, z: nz };
    }
  }

  // Fallback if current position was not provided (e.g. initial spawn placement)
  // 1. Room 5 (Long Left Gallery: X < -10)
  if (nx < -10) {
    nx = Math.max(-18 + pad, Math.min(-10 - pad, nx));
    nz = Math.max(-18 + pad, Math.min(18 - pad, nz));
    if (x > -10 - pad) {
      if (Math.abs(z - 0) < 0.85 && isDoorPassable('room-5')) {
        nx = x;
      } else {
        nx = -10 - pad;
      }
    }
    return { x: nx, z: nz };
  }

  // 2. Central Corridor (-10 <= X <= 18, -3.2 <= Z <= 3.2)
  if (nz >= -3.2 && nz <= 3.2) {
    if (nx < -10 + pad) {
      if (Math.abs(nz - 0) < 0.85 && isDoorPassable('room-5')) {
        nx = Math.max(-18 + pad, nx);
      } else {
        nx = -10 + pad;
      }
    }

    if (nz < -3.2 + pad) {
      const inRoom4Door = Math.abs(nx - (-3)) < 0.85 && isDoorPassable('room-4');
      const inRoom3Door = Math.abs(nx - 11) < 0.85 && isDoorPassable('room-3');
      if (inRoom4Door || inRoom3Door) {
        nz = z;
      } else {
        nz = -3.2 + pad;
      }
    }

    if (nz > 3.2 - pad) {
      const inRoom2Door = Math.abs(nx - (-3)) < 0.85 && isDoorPassable('room-2');
      const inRoom1Door = Math.abs(nx - 11) < 0.85 && isDoorPassable('room-1');
      if (inRoom2Door || inRoom1Door) {
        nz = z;
      } else {
        nz = 3.2 - pad;
      }
    }

    return { x: nx, z: nz };
  }

  // 3. Top Rooms (Z < -3.2)
  if (nz < -3.2) {
    nz = Math.max(-18 + pad, nz);
    if (nz > -3.2 - pad) {
      const inRoom4Door = Math.abs(nx - (-3)) < 0.85 && isDoorPassable('room-4');
      const inRoom3Door = Math.abs(nx - 11) < 0.85 && isDoorPassable('room-3');
      if (inRoom4Door || inRoom3Door) {
        nz = z;
      } else {
        nz = -3.2 - pad;
      }
    }

    if (nx < 4) {
      nx = Math.max(-10 + pad, Math.min(4 - pad, nx));
    } else {
      nx = Math.max(4 + pad, Math.min(18 - pad, nx));
    }

    return { x: nx, z: nz };
  }

  // 4. Bottom Rooms (Z > 3.2)
  if (nz > 3.2) {
    nz = Math.min(18 - pad, nz);
    if (nz < 3.2 + pad) {
      const inRoom2Door = Math.abs(nx - (-3)) < 0.85 && isDoorPassable('room-2');
      const inRoom1Door = Math.abs(nx - 11) < 0.85 && isDoorPassable('room-1');
      if (inRoom2Door || inRoom1Door) {
        nz = z;
      } else {
        nz = 3.2 + pad;
      }
    }

    if (nx < 4) {
      nx = Math.max(-10 + pad, Math.min(4 - pad, nx));
    } else {
      nx = Math.max(4 + pad, Math.min(18 - pad, nx));
    }

    return { x: nx, z: nz };
  }

  return { x: nx, z: nz };
}

export function getRoomIdFromPosition(x: number, z: number): string {
  if (x < -10) {
    return 'room-5';
  }
  if (z >= -3.2 && z <= 3.2) {
    return 'hallway';
  }
  if (z < -3.2) {
    return x < 4 ? 'room-4' : 'room-3';
  }
  return x < 4 ? 'room-2' : 'room-1';
}
