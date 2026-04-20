import { ReactNode } from "react";

// Applies a glossy bevel SVG filter to any child element.
// Minimum for the effect to be visible: font-size >= 3rem, font-weight >= 400.
// Does not work meaningfully on form elements (input, textarea, select).
// Corner directions (NE, NW, SE, SW) combine their two cardinal effects.

type Direction = "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";

interface TextEffectProps {
  children: ReactNode;
  direction?: Direction;
}

const cardinalLights: Record<string, { x: number; y: number }> = {
  N: { x:     0, y: -5000 },
  S: { x:     0, y:  5000 },
  E: { x:  5000, y:     0 },
  W: { x: -5000, y:     0 },
};

// Each direction is one or two cardinals combined
const directionLights: Record<Direction, Array<{ x: number; y: number }>> = {
  N:  [cardinalLights.N],
  S:  [cardinalLights.S],
  E:  [cardinalLights.E],
  W:  [cardinalLights.W],
  NE: [cardinalLights.N, cardinalLights.E],
  NW: [cardinalLights.N, cardinalLights.W],
  SE: [cardinalLights.S, cardinalLights.E],
  SW: [cardinalLights.S, cardinalLights.W],
};

const specularProps = {
  surfaceScale: 5,
  specularConstant: 1.1,
  specularExponent: 32,
  lightingColor: "white",
};

export default function TextEffect({ children, direction = "E" }: TextEffectProps) {
  const lights = directionLights[direction];
  const filterId = `gloss-bevel-${direction}`;
  const isTwoLight = lights.length === 2;

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
        <defs>
          <filter id={filterId} x="-15%" y="-20%" width="130%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />

            <feSpecularLighting in="blur" {...specularProps} result="spec-0">
              <fePointLight x={lights[0].x} y={lights[0].y} z="2000" />
            </feSpecularLighting>

            {isTwoLight && (
              <>
                <feSpecularLighting in="blur" {...specularProps} result="spec-1">
                  <fePointLight x={lights[1].x} y={lights[1].y} z="2000" />
                </feSpecularLighting>
                <feBlend in="spec-0" in2="spec-1" mode="screen" result="spec-0" />
              </>
            )}

            <feComposite in="spec-0" in2="SourceAlpha" operator="in" result="specular" />
            <feBlend in="SourceGraphic" in2="specular" mode="screen" result="lit" />

            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="shadowBlur" />
            <feOffset in="shadowBlur" dx="2" dy="10" result="shadowOffset" />
            <feFlood floodColor="black" floodOpacity="0.35" result="shadowColor" />
            <feComposite in="shadowColor" in2="shadowOffset" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="lit" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <span style={{ filter: `url(#${filterId})`, display: "inline-block", fontSize: "6rem", fontWeight: 700 }}>
        {children}
      </span>
    </>
  );
}
