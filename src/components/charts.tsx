"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Hand-rolled SVG charts — small enough that pulling in a charting library
 * would outweigh it. Width comes from a ResizeObserver so charts sit on a
 * real pixel grid (no stretched text or distorted strokes).
 */

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setWidth(el.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

/** Round a min/max span to steps of 1, 2, or 5 so axis ticks stay legible. */
function niceTicks(min: number, max: number, targetCount: number) {
  const span = Math.max(max - min, 0.5);
  const raw = span / targetCount;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  const mult = norm >= 5 ? 5 : norm >= 2.5 ? 2 : 1;
  const step = mult * pow;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;

  const ticks: number[] = [];
  for (let value = lo; value <= hi + 1e-9; value += step) {
    ticks.push(Number(value.toFixed(6)));
  }
  return { lo, hi, ticks };
}

const axisStyle = { fill: "rgb(var(--muted))" } as const;
const gridStyle = { stroke: "rgb(var(--rule))" } as const;

export type TrendPoint = {
  label: string;
  sublabel?: string;
  max: number;
  min: number;
};

/**
 * Two-series temperature band: high and low per day. High points read
 * strongest (fg tone, labels above), low points quiet (muted, below) —
 * matching the board's existing max/min hierarchy, so no legend decree
 * beyond what the cards already do.
 */
export function TempTrendChart({
  points,
  ariaLabel,
  className,
}: {
  points: { label: string; sublabel?: string; max: number; min: number }[];
  ariaLabel: string;
  className?: string;
}) {
  const [ref, width] = useWidth();
  const height = 224;
  const pad = { top: 30, right: 20, bottom: 64, left: 52 };

  if (!width) return <div ref={ref} className={cn("w-full", className)} />;

  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const all = points.flatMap((p) => [p.max, p.min]);
  const { lo, hi, ticks } = niceTicks(Math.min(...all), Math.max(...all), 3);
  const scaleY = (value: number) =>
    pad.top + innerH - ((value - lo) / (hi - lo)) * innerH;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW;
  const scaleX = (index: number) => pad.left + index * stepX;
  const clampX = (x: number) => Math.min(Math.max(x, pad.left + 14), width - pad.right - 14);
  const every = Math.max(1, Math.ceil(56 / stepX));
  // On narrow screens keep value labels aligned with the printed x labels
  // so neighbours never touch; exact values still live in the cards above.
  const valueEvery = stepX < 44 ? every : 1;

  const maxLine = points.map((p, i) => `${scaleX(i)},${scaleY(p.max)}`).join(" ");
  const minLine = points.map((p, i) => `${scaleX(i)},${scaleY(p.min)}`).join(" ");

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <svg width={width} height={height} role="img" aria-label={ariaLabel} className="block">
        {/* horizontal grid + y ticks */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={scaleY(tick)}
              y2={scaleY(tick)}
              style={gridStyle}
            />
            <text
              x={pad.left - 8}
              y={scaleY(tick) + 4}
              textAnchor="end"
              fontSize={10}
              style={axisStyle}
              className="font-data"
            >
              {`${tick}°`}
            </text>
          </g>
        ))}

        {/* high series */}
        <polyline
          points={maxLine}
          style={{ stroke: "rgb(var(--fg))", fill: "none" }}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* low series */}
        <polyline
          points={minLine}
          style={{ stroke: "rgb(var(--muted))", fill: "none" }}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeDasharray="4 3"
        />

        {points.map((p, i) => {
          if (i % valueEvery !== 0) return null;
          // If the label below a low point would collide with the x-axis
          // labels (troughs at the domain floor), render it above instead.
          const minBelowY = scaleY(p.min) + 20;
          const minLabelY = minBelowY > pad.top + innerH + 14 ? scaleY(p.min) - 10 : minBelowY;
          return (
          <g key={`${p.label}-${i}`}>
            <circle
              cx={scaleX(i)}
              cy={scaleY(p.max)}
              r={3}
              style={{ fill: "rgb(var(--fg))" }}
            />
            <text
              x={clampX(scaleX(i))}
              y={scaleY(p.max) - 10}
              textAnchor="middle"
              fontSize={11}
              style={{ fill: "rgb(var(--fg))" }}
              className="font-data"
            >
              {`${p.max}°`}
            </text>
            <circle
              cx={scaleX(i)}
              cy={scaleY(p.min)}
              r={3}
              style={{ fill: "rgb(var(--fg))", stroke: "rgb(var(--bg))" }}
              strokeWidth={1}
            />
            <text
              x={clampX(scaleX(i))}
              y={minLabelY}
              textAnchor="middle"
              fontSize={11}
              style={{ fill: "rgb(var(--muted))" }}
              className="font-data"
            >
              {`${p.min}°`}
            </text>
          </g>
          );
        })}

        {/* x labels */}
        {points.map((p, i) =>
          i % every === 0 ? (
            <text
              key={`x-${p.label}-${i}`}
              x={clampX(scaleX(i))}
              y={height - 44}
              textAnchor="middle"
              fontSize={10}
              style={axisStyle}
              className="font-data"
            >
              {p.label.toUpperCase()}
            </text>
          ) : null,
        )}
        {points.map((p, i) =>
          p.sublabel && i % every === 0 ? (
            <text
              key={`d-${p.label}-${i}`}
              x={clampX(scaleX(i))}
              y={height - 26}
              textAnchor="middle"
              fontSize={10}
              style={axisStyle}
              className="font-data"
            >
              {p.sublabel}
            </text>
          ) : null,
        )}
        <line
          x1={pad.left}
          x2={width - pad.right}
          y1={pad.top + innerH}
          y2={pad.top + innerH}
          style={gridStyle}
        />
      </svg>
    </div>
  );
}

export type CurvePoint = { label: string; value: number };

/**
 * Filled area curve for dense hourly readings. Extremes are annotated
 * (value + hour) instead of forcing labels on all 24 points, and only
 * every 6th hour is ticked.
 */
export function ExtremesCurveChart({
  points,
  ariaLabel,
  formatPoint,
  formatTick,
  className,
}: {
  points: CurvePoint[];
  ariaLabel: string;
  formatPoint: (value: number) => string;
  formatTick: (value: number) => string;
  className?: string;
}) {
  const [ref, width] = useWidth();
  const height = 200;
  const pad = { top: 40, right: 20, bottom: 40, left: 44 };

  if (!width || points.length < 2) {
    return <div ref={ref} className={cn("w-full", className)} />;
  }

  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const values = points.map((p) => p.value);
  const { lo, hi, ticks } = niceTicks(Math.min(...values), Math.max(...values), 3);
  const scaleY = (value: number) =>
    pad.top + innerH - ((value - lo) / (hi - lo)) * innerH;
  const scaleX = (index: number) => pad.left + (index * innerW) / (points.length - 1);
  const baseY = pad.top + innerH;

  const linePath = points.map((p, i) => `${i ? "L" : "M"}${scaleX(i)},${scaleY(p.value)}`).join(" ");
  const areaPath = `${linePath} L${scaleX(points.length - 1)},${baseY} L${scaleX(0)},${baseY} Z`;

  const maxIdx = values.indexOf(Math.max(...values));
  const minIdx = values.indexOf(Math.min(...values));
  const clampX = (x: number) => Math.min(Math.max(x, pad.left + 8), width - pad.right - 8);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <svg width={width} height={height} role="img" aria-label={ariaLabel} className="block">
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={scaleY(tick)}
              y2={scaleY(tick)}
              style={gridStyle}
            />
            <text
              x={pad.left - 8}
              y={scaleY(tick) + 4}
              textAnchor="end"
              fontSize={10}
              style={axisStyle}
              className="font-data"
            >
              {formatTick(tick)}
            </text>
          </g>
        ))}
        {ticks.length > 0 ? (
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={baseY}
            y2={baseY}
            style={gridStyle}
          />
        ) : null}

        {/* sea fills the plot area under the curve */}
        <path
          d={areaPath}
          style={{ fill: "rgb(var(--signal-teal) / 0.14)", stroke: "none" }}
        />
        <path
          d={linePath}
          style={{ stroke: "rgb(var(--signal-teal))", fill: "none" }}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* extreme readings */}
        {[
          {
            point: points[maxIdx],
            value: values[maxIdx],
            above: true,
            key: "max",
          },
          {
            point: points[minIdx],
            value: values[minIdx],
            above: false,
            key: "min",
          },
        ].map(({ point, value, above, key }) => {
          const px = clampX(scaleX(points.indexOf(point)));
          const py = scaleY(value);
          return (
            <g key={key}>
              <circle
                cx={px}
                cy={py}
                r={3.5}
                style={{
                  fill: "rgb(var(--signal-teal))",
                  stroke: "rgb(var(--card))",
                }}
                strokeWidth={1.5}
              />
              <text
                x={px}
                y={above ? py - 22 : py + 22}
                textAnchor="middle"
                fontSize={11}
                style={{ fill: "rgb(var(--fg))" }}
                className="font-data"
              >
                {formatPoint(value)}
              </text>
              <text
                x={px}
                y={above ? py - 10 : py + 34}
                textAnchor="middle"
                fontSize={9}
                style={axisStyle}
                className="font-data"
              >
                {point.label}
              </text>
            </g>
          );
        })}

        {/* hourly ticks */}
        {points.map((p, i) =>
          i % 6 === 0 ? (
            <text
              key={`x-${p.label}`}
              x={clampX(scaleX(i))}
              y={height - 16}
              textAnchor="middle"
              fontSize={10}
              style={axisStyle}
              className="font-data"
            >
              {p.label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

export function ChartLegend({ items }: { items: { label: string; swatch: ReactNode }[] }) {
  return (
    <div
      role="list"
      className="flex flex-wrap items-center gap-x-4 gap-y-1 font-data text-[11px] uppercase tracking-[0.1em] text-[rgb(var(--muted))]"
    >
      {items.map((item) => (
        <span key={item.label} role="listitem" className="flex items-center gap-1.5">
          <span aria-hidden className="flex h-2 w-2 shrink-0">
            {item.swatch}
          </span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
