import React from 'react';
import { Droplet, TreePine, Shield, Crown, Gem, Swords } from 'lucide-react';

const GLYPHS = {
  crimson: Droplet,
  forest: TreePine,
  sapphire: Shield,
  gold: Crown,
  amethyst: Gem,
  copper: Swords,
};

/**
 * Minimalist heraldic badge: white roundel, gold ring frame, colored line glyph.
 * Pass `bare` to render just the glyph (no roundel/frame) for decorative overlays.
 */
export const HeraldryIcon = ({ id, color, size = 32, bare = false, className = '', style }) => {
  const Glyph = GLYPHS[id] || Shield;

  if (bare) {
    return <Glyph size={size} color={color} strokeWidth={2} className={className} style={style} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#F8F1E1] border-2 border-[#D4AF37] shadow-md shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <Glyph size={size * 0.58} color={color} strokeWidth={2.25} />
    </span>
  );
};
