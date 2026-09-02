import { useMemo } from 'react';
import { Text } from '@react-three/drei';

interface ExhibitionHeadingProps {
  title: string;
  subtitle: string;
  themeColor: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const GALLERY_THEMES: Record<string, { displayTitle: string; displaySubtitle: string }> = {
  FRAGMENTS: {
    displayTitle: 'FRAGMENTS / "NATOCCOLS"',
    displaySubtitle: '"In abstraction, the image is a mirror.\nWhat you see is shaped by what you bring."',
  },
  NATURE: {
    displayTitle: 'NATURE / "ORGANICS"',
    displaySubtitle: '"In nature, we find the quiet order of things.\nAn organic geometry whispered in the wind."',
  },
  THRESHOLDS: {
    displayTitle: 'THRESHOLDS / "PASSAGES"',
    displaySubtitle: '"A door left open is an invitation to dream.\nBetween the light and shadow, we find the way."',
  },
  ARCHITECTURE: {
    displayTitle: 'ARCHITECTURE / "SPACES"',
    displaySubtitle: '"Human hands carving space out of silence.\nLines of steel and concrete framing the sky."',
  },
  PORTRAITS: {
    displayTitle: 'PORTRAITS / "PEOPLE"',
    displaySubtitle: '"Every face is a map of journeys taken.\nA silent conversation across time and space."',
  },
  URBAN: {
    displayTitle: 'URBAN / "CHRONICLES"',
    displaySubtitle: '"The city never sleeps, it only remembers.\nA symphony of concrete, lights, and shadows."',
  }
};

export default function ExhibitionHeading({ title, subtitle, position, rotation }: ExhibitionHeadingProps) {
  const upperTitle = title.toUpperCase();
  const theme = useMemo(() => {
    return GALLERY_THEMES[upperTitle] || {
      displayTitle: `${upperTitle} / "CURATIONS"`,
      displaySubtitle: `"${subtitle}"`
    };
  }, [upperTitle, subtitle]);

  return (
    <group position={position} rotation={rotation}>
      {/* PRIMARY TITLE - Printed directly on the clean gallery plaster wall */}
      <Text
        position={[0, 0.22, 0.015]}
        fontSize={0.16}
        color="#1E1E1C"
        anchorX="center"
        anchorY="middle"
        fontWeight={500}
        letterSpacing={0.12}
        maxWidth={2.2}
        textAlign="center"
      >
        {theme.displayTitle}
      </Text>

      {/* SECONDARY CURATORIAL SUBTITLE - Clean, elegant typography with generous margins */}
      <Text
        position={[0, -0.12, 0.015]}
        fontSize={0.065}
        color="#2E2E2C"
        anchorX="center"
        anchorY="middle"
        fontWeight={400}
        lineHeight={1.4}
        letterSpacing={0.02}
        maxWidth={2.0}
        textAlign="center"
      >
        {theme.displaySubtitle}
      </Text>
    </group>
  );
}
