"use client";

import { getTheme, type ThemeId } from "@/lib/themes";
import { cn, formatNumber } from "@/lib/utils";
import { Users, ArrowRight } from "lucide-react";

interface ThemePreviewProps {
  name: string;
  tagline: string;
  theme: ThemeId;
}

export function ThemePreview({ name, tagline, theme: themeId }: ThemePreviewProps) {
  const theme = getTheme(themeId);
  const isAligned = theme.layout === "left-aligned";

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-neutral-800 h-full flex flex-col relative",
        theme.bg,
        theme.text,
        theme.fontClass
      )}
    >
      {theme.showGradient && (
        <div className={cn("pointer-events-none", theme.gradientClass)} />
      )}

      <div
        className={cn(
          "flex-1 flex flex-col justify-center p-8 relative z-10",
          isAligned ? "items-start" : "items-center text-center"
        )}
      >
        <h2
          className={cn(
            "text-xl md:text-2xl tracking-tight leading-tight",
            theme.headingWeight
          )}
        >
          {name || "Your Product"}
        </h2>
        <p className={cn("text-sm mt-2", theme.textMuted)}>
          {tagline || "Describe what you're building"}
        </p>

        <div className="flex items-center gap-2 mt-5">
          <Users className={cn("w-3.5 h-3.5", theme.accentText)} />
          <span className={cn("text-2xl", theme.headingWeight)}>
            {formatNumber(0)}
          </span>
          <span className={cn("text-xs", theme.textMuted)}>
            {themeId === "stealth" ? "in queue" : "people waiting"}
          </span>
        </div>

        <div className={cn("mt-5 w-full", !isAligned && "max-w-xs")}>
          <div
            className={cn(
              "w-full px-3 py-2 rounded-lg border text-xs mb-2",
              theme.inputBg,
              theme.inputBorder,
              theme.textSubtle
            )}
          >
            {themeId === "stealth" ? "email@example.com" : "you@example.com"}
          </div>
          <div
            className={cn(
              "w-full px-3 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1",
              theme.buttonBg,
              theme.buttonText
            )}
          >
            {themeId === "stealth" ? (
              "$ join --waitlist"
            ) : (
              <>
                Join the waitlist
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "px-8 pb-4 relative z-10",
          !isAligned && "text-center"
        )}
      >
        <span className={cn("text-[10px]", theme.textSubtle)}>
          {themeId === "stealth"
            ? "// powered by waitlist.expert"
            : "Built with waitlist.expert →"}
        </span>
      </div>
    </div>
  );
}
