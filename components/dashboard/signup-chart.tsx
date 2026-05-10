"use client";

import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  signups: number;
  referrals: number;
}

interface SignupChartProps {
  data: DataPoint[];
}

export function SignupChart({ data }: SignupChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-neutral-600 text-sm">
        No data yet — check back after your first day of signups.
      </div>
    );
  }

  const maxSignups = Math.max(...data.map((d) => d.signups), 1);
  const chartWidth = 100;
  const chartHeight = 100;
  const padding = { top: 10, right: 5, bottom: 20, left: 5 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const xStep = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  // Generate path for signups line
  const signupPoints = data.map((d, i) => ({
    x: padding.left + (data.length > 1 ? i * xStep : innerWidth / 2),
    y:
      padding.top +
      innerHeight -
      (d.signups / maxSignups) * innerHeight,
  }));

  const signupPath =
    signupPoints.length === 1
      ? ""
      : signupPoints
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");

  // Area fill path
  const areaPath =
    signupPoints.length <= 1
      ? ""
      : `${signupPath} L ${signupPoints[signupPoints.length - 1].x} ${padding.top + innerHeight} L ${signupPoints[0].x} ${padding.top + innerHeight} Z`;

  // Show labels for every ~7th point
  const labelInterval = Math.max(1, Math.floor(data.length / 5));

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-48"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={padding.left}
            y1={padding.top + innerHeight * (1 - pct)}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight * (1 - pct)}
            stroke="#262626"
            strokeWidth="0.3"
          />
        ))}

        {/* Area fill */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#signupGradient)"
            opacity="0.3"
          />
        )}

        {/* Signup line */}
        {signupPath && (
          <path
            d={signupPath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {signupPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1"
            fill="#6366f1"
            className="opacity-0 hover:opacity-100"
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % labelInterval !== 0 && i !== data.length - 1) return null;
          const x = padding.left + (data.length > 1 ? i * xStep : innerWidth / 2);
          const dateLabel = d.date.slice(5); // "MM-DD"
          return (
            <text
              key={i}
              x={x}
              y={chartHeight - 2}
              textAnchor="middle"
              className="fill-neutral-600"
              fontSize="3"
            >
              {dateLabel}
            </text>
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id="signupGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Y-axis labels */}
      <div className="flex justify-between text-[10px] text-neutral-600 px-1 -mt-1">
        <span>0</span>
        <span>{maxSignups}</span>
      </div>
    </div>
  );
}
