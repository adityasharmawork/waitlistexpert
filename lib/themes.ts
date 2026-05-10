export type ThemeId = "minimal-light" | "minimal-dark" | "premium-dark" | "stealth";

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  description: string;
  bg: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  fontClass: string; // Tailwind font class
  headingWeight: string;
  counterSize: string;
  layout: "centered" | "left-aligned";
  showGradient: boolean;
  gradientClass: string;
}

export const themes: Record<ThemeId, ThemeConfig> = {
  "minimal-light": {
    id: "minimal-light",
    label: "Minimal Light",
    description: "Clean and bright — generous whitespace, sharp typography",
    bg: "bg-white",
    text: "text-neutral-900",
    textMuted: "text-neutral-500",
    textSubtle: "text-neutral-400",
    inputBg: "bg-neutral-50",
    inputBorder: "border-neutral-200",
    inputText: "text-neutral-900",
    inputPlaceholder: "placeholder:text-neutral-400",
    buttonBg: "bg-neutral-900",
    buttonText: "text-white",
    buttonHover: "hover:bg-neutral-800",
    cardBg: "bg-neutral-50",
    cardBorder: "border-neutral-200",
    accentText: "text-neutral-900",
    badgeBg: "bg-neutral-100",
    badgeText: "text-neutral-600",
    fontClass: "font-sans",
    headingWeight: "font-semibold",
    counterSize: "text-5xl",
    layout: "centered",
    showGradient: false,
    gradientClass: "",
  },
  "minimal-dark": {
    id: "minimal-dark",
    label: "Minimal Dark",
    description: "Sleek dark mode — the Vercel/Linear aesthetic",
    bg: "bg-neutral-950",
    text: "text-neutral-100",
    textMuted: "text-neutral-400",
    textSubtle: "text-neutral-600",
    inputBg: "bg-neutral-900",
    inputBorder: "border-neutral-800",
    inputText: "text-white",
    inputPlaceholder: "placeholder:text-neutral-600",
    buttonBg: "bg-white",
    buttonText: "text-neutral-900",
    buttonHover: "hover:bg-neutral-200",
    cardBg: "bg-neutral-900",
    cardBorder: "border-neutral-800",
    accentText: "text-white",
    badgeBg: "bg-neutral-800",
    badgeText: "text-neutral-400",
    fontClass: "font-sans",
    headingWeight: "font-semibold",
    counterSize: "text-5xl",
    layout: "centered",
    showGradient: false,
    gradientClass: "",
  },
  "premium-dark": {
    id: "premium-dark",
    label: "Premium Dark",
    description: "Rich gradients, glowing accents — premium product feel",
    bg: "bg-[#09090b]",
    text: "text-white",
    textMuted: "text-neutral-400",
    textSubtle: "text-neutral-600",
    inputBg: "bg-white/5",
    inputBorder: "border-white/10",
    inputText: "text-white",
    inputPlaceholder: "placeholder:text-neutral-500",
    buttonBg: "bg-gradient-to-r from-indigo-500 to-purple-500",
    buttonText: "text-white",
    buttonHover: "hover:from-indigo-400 hover:to-purple-400",
    cardBg: "bg-white/5",
    cardBorder: "border-white/10",
    accentText: "text-indigo-400",
    badgeBg: "bg-indigo-500/10",
    badgeText: "text-indigo-400",
    fontClass: "font-sans",
    headingWeight: "font-bold",
    counterSize: "text-6xl",
    layout: "centered",
    showGradient: true,
    gradientClass:
      "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]",
  },
  stealth: {
    id: "stealth",
    label: "Stealth",
    description: "Terminal-inspired — monospace, raw, developer-native",
    bg: "bg-black",
    text: "text-green-400",
    textMuted: "text-green-600",
    textSubtle: "text-green-900",
    inputBg: "bg-green-950/30",
    inputBorder: "border-green-900/50",
    inputText: "text-green-300",
    inputPlaceholder: "placeholder:text-green-800",
    buttonBg: "bg-green-500",
    buttonText: "text-black",
    buttonHover: "hover:bg-green-400",
    cardBg: "bg-green-950/20",
    cardBorder: "border-green-900/30",
    accentText: "text-green-400",
    badgeBg: "bg-green-500/10",
    badgeText: "text-green-500",
    fontClass: "font-mono",
    headingWeight: "font-bold",
    counterSize: "text-6xl",
    layout: "left-aligned",
    showGradient: true,
    gradientClass:
      "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.08),transparent_50%)]",
  },
};

export function getTheme(id: ThemeId): ThemeConfig {
  return themes[id] ?? themes["minimal-dark"];
}
