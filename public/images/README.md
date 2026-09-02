# Virtual Gallery - Image Asset Folders

This directory contains the organized folder structure for all exhibition rooms and the central corridor.
To customize the gallery, you can replace any dummy image with your own JPG, PNG, or WebP photo using the matching filename.

---

## 📁 Folder Structure & Mapping

```
public/images/
├── hallway/      # 5 Artworks along the Central Corridor
│   ├── art-1.jpg # South Wall (Foreground approaching Room 1)
│   ├── art-2.jpg # South Wall (Mid-corridor beside Room 2)
│   ├── art-3.jpg # West Wall (Beside Room 5 door)
│   ├── art-4.jpg # North Wall (Mid-corridor beside Room 4)
│   └── art-5.jpg # North Wall (Foreground approaching Room 3)
│
├── room-1/       # 11 Artworks in Room 1 (Urban Vistas & Modern Metropolis)
│   ├── art-1.jpg to art-3.jpg   (East Wall)
│   ├── art-4.jpg to art-6.jpg   (South Wall)
│   ├── art-7.jpg to art-9.jpg   (West Wall)
│   └── art-10.jpg to art-11.jpg (North Wall)
│
├── room-2/       # 11 Artworks in Room 2 (Light & Shadow Dynamics)
│   ├── art-1.jpg to art-3.jpg   (West Wall)
│   ├── art-4.jpg to art-6.jpg   (South Wall)
│   ├── art-7.jpg to art-9.jpg   (East Wall)
│   └── art-10.jpg to art-11.jpg (North Wall)
│
├── room-3/       # 11 Artworks in Room 3 (Geometric Structures & Forms)
│   ├── art-1.jpg to art-3.jpg   (East Wall)
│   ├── art-4.jpg to art-6.jpg   (North Wall)
│   ├── art-7.jpg to art-9.jpg   (West Wall)
│   └── art-10.jpg to art-11.jpg (South Wall)
│
├── room-4/       # 11 Artworks in Room 4 (Abstract Textures & Materials)
│   ├── art-1.jpg to art-3.jpg   (West Wall)
│   ├── art-4.jpg to art-6.jpg   (North Wall)
│   ├── art-7.jpg to art-9.jpg   (East Wall)
│   └── art-10.jpg to art-11.jpg (South Wall)
│
└── room-5/       # 11 Artworks in Room 5 (Nature, Solitude & Atmospheres)
    ├── art-1.jpg to art-4.jpg   (West Wall)
    ├── art-5.jpg to art-6.jpg   (South Wall)
    ├── art-7.jpg to art-8.jpg   (North Wall)
    └── art-9.jpg to art-11.jpg  (East Wall)
```

---

## 💡 Replacement Instructions

1. **Formats Supported**: `.jpg`, `.jpeg`, `.png`, `.webp` (or Unsplash URLs).
2. **Recommended Dimensions**: 
   - Landscape: `1200 × 800 px` or `1600 × 1060 px`
   - Portrait: `800 × 1200 px` or `1060 × 1600 px`
3. **Updating Titles / Captions**: You can edit the titles, artist names, descriptions, or dimensions anytime in `/src/data/exhibitions.ts` and `/src/components/gallery/CentralHallway.tsx`.
