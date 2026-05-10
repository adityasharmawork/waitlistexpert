"use client";

import { cn } from "@/lib/utils";

interface SourceData {
  source: string;
  count: number;
  percentage: number;
}

const sourceColors: Record<string, string> = {
  page: "bg-indigo-500",
  widget: "bg-purple-500",
  embed: "bg-cyan-500",
  referral: "bg-green-500",
  api: "bg-orange-500",
};

const sourceLabels: Record<string, string> = {
  page: "Waitlist Page",
  widget: "Widget",
  embed: "Embed",
  referral: "Referral",
  api: "API",
};

interface SourceBreakdownProps {
  data: SourceData[];
}

export function SourceBreakdown({ data }: SourceBreakdownProps) {
  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-neutral-600 text-sm">
        No signup data yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-neutral-800">
        {data.map((item) => (
          <div
            key={item.source}
            className={cn(
              "transition-all",
              sourceColors[item.source] ?? "bg-neutral-600"
            )}
            style={{ width: `${item.percentage}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item) => (
          <div
            key={item.source}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  sourceColors[item.source] ?? "bg-neutral-600"
                )}
              />
              <span className="text-neutral-300">
                {sourceLabels[item.source] ?? item.source}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 text-xs">
                {item.percentage}%
              </span>
              <span className="font-medium text-neutral-200 tabular-nums w-8 text-right">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
