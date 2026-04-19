import { motion } from "motion/react";

// Colour utilities
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function deriveColors(bg: string) {
  const [r, g, b] = parseHex(bg);
  const c = (v: number) => Math.max(0, Math.min(255, v));
  return {
    light: `rgb(${c(r + 50)},${c(g + 45)},${c(b + 40)})`,
    dark: `rgb(${c(r - 52)},${c(g - 60)},${c(b - 68)})`,
  };
}

function makeShadows(bg: string) {
  const { light, dark } = deriveColors(bg);
  const s = (a: number, b: number) =>
    [
      ` ${a}px  ${a}px ${b}px ${light} inset`,
      `-${a}px -${a}px ${b}px ${dark}  inset`,
      ` ${a * 2}px  ${a * 2}px ${b * 2.5}px ${dark}`,
      `-${a * 2}px -${a * 2}px ${b * 2.5}px ${light}`,
    ].join(", ");

  return { peak: s(2, 5), resting: s(1.5, 4) };
}

// Motion component cache

const cache = new Map<React.ElementType, React.ElementType>();
function toMotion(as: React.ElementType) {
  if (!cache.has(as)) cache.set(as, motion.create(as as never));
  return cache.get(as)!;
}

// Types

type NeuShadowProps<C extends React.ElementType = "div"> = {
  as?: C;
  bg?: string;
  entry?: boolean;
  delay?: number;
} & Omit<React.ComponentPropsWithoutRef<C>, "as">;

//Component

export default function NeuShadow<C extends React.ElementType = "div">({
  as = "div" as C,
  bg = "#e8d9c0",
  entry = true,
  delay = 0,
  style,
  ...rest
}: NeuShadowProps<C>) {
  const Component = toMotion(as);
  const { peak, resting } = makeShadows(bg);

  return (
    <Component
      initial={{ boxShadow: entry ? "none" : resting }}
      animate={{ boxShadow: entry ? ["none", "none", peak, resting] : resting }}
      transition={
        entry
          ? { duration: 1, times: [0, 0.4, 0.6, 0.8], ease: "linear", delay }
          : { duration: 0 }
      }
      style={{ backgroundColor: bg, ...style }}
      {...(rest as Record<string, unknown>)}
    />
  );
}
