import { useState } from "react";
import { MapPin } from "lucide-react";

/** A single clickable body region on the SVG diagram. */
interface Region {
  id: string;
  label: string;
  view: "anterior" | "posterior";
  cx: number;
  cy: number;
  r?: number;
}

/**
 * Coordinates are tuned for a 220 (w) x 460 (h) SVG viewBox per view.
 * Anterior and posterior views are rendered side by side.
 */
const REGIONS: Region[] = [
  // Anterior
  { id: "a-forehead", label: "Forehead", view: "anterior", cx: 110, cy: 32, r: 7 },
  { id: "a-ear-l", label: "Left ear", view: "anterior", cx: 132, cy: 45, r: 5 },
  { id: "a-ear-r", label: "Right ear", view: "anterior", cx: 88, cy: 45, r: 5 },
  { id: "a-shoulder-l", label: "Left shoulder", view: "anterior", cx: 152, cy: 92, r: 8 },
  { id: "a-shoulder-r", label: "Right shoulder", view: "anterior", cx: 68, cy: 92, r: 8 },
  { id: "a-elbow-l", label: "Left elbow", view: "anterior", cx: 172, cy: 175, r: 7 },
  { id: "a-elbow-r", label: "Right elbow", view: "anterior", cx: 48, cy: 175, r: 7 },
  { id: "a-iliac-l", label: "Left iliac crest", view: "anterior", cx: 138, cy: 210, r: 7 },
  { id: "a-iliac-r", label: "Right iliac crest", view: "anterior", cx: 82, cy: 210, r: 7 },
  { id: "a-trochanter-l", label: "Left trochanter", view: "anterior", cx: 148, cy: 238, r: 7 },
  { id: "a-trochanter-r", label: "Right trochanter", view: "anterior", cx: 72, cy: 238, r: 7 },
  { id: "a-knee-l", label: "Left knee", view: "anterior", cx: 130, cy: 320, r: 8 },
  { id: "a-knee-r", label: "Right knee", view: "anterior", cx: 90, cy: 320, r: 8 },
  { id: "a-shin-l", label: "Left shin (pretibial)", view: "anterior", cx: 130, cy: 370, r: 7 },
  { id: "a-shin-r", label: "Right shin (pretibial)", view: "anterior", cx: 90, cy: 370, r: 7 },
  { id: "a-malleolus-l", label: "Left lateral malleolus", view: "anterior", cx: 140, cy: 420, r: 6 },
  { id: "a-malleolus-r", label: "Right lateral malleolus", view: "anterior", cx: 80, cy: 420, r: 6 },
  { id: "a-toes-l", label: "Left toes", view: "anterior", cx: 130, cy: 445, r: 6 },
  { id: "a-toes-r", label: "Right toes", view: "anterior", cx: 90, cy: 445, r: 6 },
  // Posterior
  { id: "p-occiput", label: "Occiput", view: "posterior", cx: 110, cy: 32, r: 7 },
  { id: "p-scapula-l", label: "Left scapula", view: "posterior", cx: 82, cy: 110, r: 8 },
  { id: "p-scapula-r", label: "Right scapula", view: "posterior", cx: 138, cy: 110, r: 8 },
  { id: "p-spine", label: "Spine (T-spine)", view: "posterior", cx: 110, cy: 145, r: 7 },
  { id: "p-elbow-l", label: "Left elbow", view: "posterior", cx: 48, cy: 175, r: 7 },
  { id: "p-elbow-r", label: "Right elbow", view: "posterior", cx: 172, cy: 175, r: 7 },
  { id: "p-sacrum", label: "Sacrum", view: "posterior", cx: 110, cy: 232, r: 9 },
  { id: "p-ischium-l", label: "Left ischial tuberosity", view: "posterior", cx: 92, cy: 250, r: 7 },
  { id: "p-ischium-r", label: "Right ischial tuberosity", view: "posterior", cx: 128, cy: 250, r: 7 },
  { id: "p-trochanter-l", label: "Left trochanter", view: "posterior", cx: 72, cy: 238, r: 6 },
  { id: "p-trochanter-r", label: "Right trochanter", view: "posterior", cx: 148, cy: 238, r: 6 },
  { id: "p-popliteal-l", label: "Left popliteal (back of knee)", view: "posterior", cx: 90, cy: 322, r: 6 },
  { id: "p-popliteal-r", label: "Right popliteal (back of knee)", view: "posterior", cx: 130, cy: 322, r: 6 },
  { id: "p-calf-l", label: "Left calf", view: "posterior", cx: 90, cy: 370, r: 7 },
  { id: "p-calf-r", label: "Right calf", view: "posterior", cx: 130, cy: 370, r: 7 },
  { id: "p-achilles-l", label: "Left Achilles", view: "posterior", cx: 90, cy: 410, r: 5 },
  { id: "p-achilles-r", label: "Right Achilles", view: "posterior", cx: 130, cy: 410, r: 5 },
  { id: "p-heel-l", label: "Left heel", view: "posterior", cx: 90, cy: 440, r: 7 },
  { id: "p-heel-r", label: "Right heel", view: "posterior", cx: 130, cy: 440, r: 7 },
];

/** Simple stylised body outline shared by both views. */
function BodyOutline() {
  return (
    <g
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
      strokeWidth={1.2}
      className="pointer-events-none"
    >
      {/* Head */}
      <ellipse cx={110} cy={38} rx={22} ry={26} />
      {/* Neck */}
      <rect x={102} y={60} width={16} height={10} rx={3} />
      {/* Torso */}
      <path d="M70,74 Q110,68 150,74 L156,200 Q110,210 64,200 Z" />
      {/* Hips */}
      <path d="M64,200 Q110,215 156,200 L152,258 Q110,270 68,258 Z" />
      {/* Arms */}
      <path d="M70,80 Q52,120 48,180 Q46,210 54,215 Q60,180 66,140 Z" />
      <path d="M150,80 Q168,120 172,180 Q174,210 166,215 Q160,180 154,140 Z" />
      {/* Legs */}
      <path d="M72,258 Q78,340 86,420 L96,455 L82,455 Q74,400 68,258 Z" />
      <path d="M148,258 Q142,340 134,420 L124,455 L138,455 Q146,400 152,258 Z" />
      {/* Feet */}
      <ellipse cx={87} cy={452} rx={12} ry={5} />
      <ellipse cx={133} cy={452} rx={12} ry={5} />
    </g>
  );
}

interface Props {
  value?: string;
  onSelect: (label: string) => void;
  /** Optional extra presets (e.g. "L plantar 1st MTH") rendered as chips below the diagram. */
  extraPresets?: string[];
}

export function BodyDiagramPicker({ value, onSelect, extraPresets = [] }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const renderView = (view: "anterior" | "posterior") => (
    <div className="flex flex-col items-center">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {view === "anterior" ? "Anterior" : "Posterior"}
      </div>
      <svg
        viewBox="0 0 220 470"
        role="img"
        aria-label={`${view} body diagram`}
        className="h-64 w-auto sm:h-72"
      >
        <BodyOutline />
        {REGIONS.filter((r) => r.view === view).map((r) => {
          const selected = value === r.label;
          const isHover = hover === r.id;
          return (
            <g key={r.id}>
              <circle
                cx={r.cx}
                cy={r.cy}
                r={(r.r ?? 6) + 3}
                fill="transparent"
                onClick={() => onSelect(r.label)}
                onMouseEnter={() => setHover(r.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
                aria-label={r.label}
              >
                <title>{r.label}</title>
              </circle>
              <circle
                cx={r.cx}
                cy={r.cy}
                r={r.r ?? 6}
                fill={selected ? "hsl(var(--primary))" : isHover ? "hsl(var(--primary) / 0.6)" : "hsl(var(--primary) / 0.25)"}
                stroke={selected ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.7)"}
                strokeWidth={selected ? 2 : 1}
                className="pointer-events-none transition"
              />
              {selected && (
                <circle
                  cx={r.cx}
                  cy={r.cy}
                  r={(r.r ?? 6) + 4}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  className="pointer-events-none"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs font-medium text-muted-foreground">
          Tap a site to tag this photo
        </div>
        <div className="flex min-h-[22px] items-center gap-1 text-xs">
          {value ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              <MapPin className="h-3 w-3" /> {value}
            </span>
          ) : (
            <span className="text-muted-foreground">No site selected</span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-4">
        {renderView("anterior")}
        {renderView("posterior")}
      </div>
      {extraPresets.length > 0 && (
        <div className="mt-3 border-t pt-2">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Quick tags
          </div>
          <div className="flex flex-wrap gap-1">
            {extraPresets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onSelect(p)}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] transition ${
                  value === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
