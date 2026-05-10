export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  spring: [0.34, 1.56, 0.64, 1],
  outCubic: [0.33, 1, 0.68, 1],
} as const;

export const duration = {
  instant: 0.08,
  fast: 0.15,
  normal: 0.25,
  medium: 0.35,
  slow: 0.5,
  cinematic: 0.8,
} as const;

