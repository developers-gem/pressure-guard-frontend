import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import type { Patient, BradenScores } from "@/api/types";
import * as api from "@/api/resources";

const CATEGORIES: { key: keyof BradenScores; label: string; desc: string; options: { score: number; label: string; desc: string }[] }[] = [
  {
    key: "sensory",
    label: "Sensory Perception",
    desc: "Ability to respond meaningfully to pressure-related discomfort",
    options: [
      { score: 1, label: "Completely limited", desc: "Unresponsive to painful stimuli" },
      { score: 2, label: "Very limited", desc: "Responds only to painful stimuli" },
      { score: 3, label: "Slightly limited", desc: "Responds to verbal commands, some sensory deficit" },
      { score: 4, label: "No impairment", desc: "Responds to verbal commands, no deficit" },
    ],
  },
  {
    key: "moisture",
    label: "Moisture",
    desc: "Degree to which skin is exposed to moisture",
    options: [
      { score: 1, label: "Constantly moist", desc: "Skin kept moist almost constantly" },
      { score: 2, label: "Very moist", desc: "Linen must be changed at least once a shift" },
      { score: 3, label: "Occasionally moist", desc: "Extra linen change once/day" },
      { score: 4, label: "Rarely moist", desc: "Skin usually dry, routine changes" },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    desc: "Degree of physical activity",
    options: [
      { score: 1, label: "Bedfast", desc: "Confined to bed" },
      { score: 2, label: "Chairfast", desc: "Cannot bear own weight" },
      { score: 3, label: "Walks occasionally", desc: "Very short distances, with assistance" },
      { score: 4, label: "Walks frequently", desc: "Outside room at least twice a day" },
    ],
  },
  {
    key: "mobility",
    label: "Mobility",
    desc: "Ability to change and control body position",
    options: [
      { score: 1, label: "Completely immobile", desc: "Does not make any changes without assistance" },
      { score: 2, label: "Very limited", desc: "Occasional slight changes, unable to independently reposition" },
      { score: 3, label: "Slightly limited", desc: "Frequent slight changes independently" },
      { score: 4, label: "No limitations", desc: "Major and frequent changes without assistance" },
    ],
  },
  {
    key: "nutrition",
    label: "Nutrition",
    desc: "Usual food intake pattern",
    options: [
      { score: 1, label: "Very poor", desc: "Never eats a complete meal, NPO or clear liquids" },
      { score: 2, label: "Probably inadequate", desc: "Rarely eats a complete meal" },
      { score: 3, label: "Adequate", desc: "Eats over half of most meals" },
      { score: 4, label: "Excellent", desc: "Eats most of every meal, no supplementation needed" },
    ],
  },
  {
    key: "friction",
    label: "Friction & Shear",
    desc: "Assistance needed in moving; sliding on sheets",
    options: [
      { score: 1, label: "Problem", desc: "Requires moderate to maximum assistance in moving" },
      { score: 2, label: "Potential problem", desc: "Moves feebly, some sliding occurs" },
      { score: 3, label: "No apparent problem", desc: "Moves independently, sufficient muscle strength" },
    ],
  },
];

function riskLevel(total: number): { level: string; tone: "success" | "warning" | "danger"; guidance: string } {
  if (total >= 19) return { level: "No risk", tone: "success", guidance: "Continue routine skin care and daily inspection." };
  if (total >= 15) return { level: "Mild risk", tone: "warning", guidance: "Reposition q2h, moisture management, heel protection." };
  if (total >= 13) return { level: "Moderate risk", tone: "warning", guidance: "Reposition q2h with 30° lateral, pressure-redistribution surface." };
  if (total >= 10) return { level: "High risk", tone: "danger", guidance: "Aggressive turning schedule, specialty mattress, nutrition consult." };
  return { level: "Very high risk", tone: "danger", guidance: "Full pressure redistribution, dietician + wound care consult, q1-2h turns." };
}

interface Props {
  patient: Patient | null;
  refreshPatients: () => Promise<void>;
}

export function BradenScale({ patient, refreshPatients }: Props) {
  const [scores, setScores] = useState<Partial<BradenScores>>({});
  const [staff, setStaff] = useState("");
  const [busy, setBusy] = useState(false);

  const totalKeys = CATEGORIES.map((c) => c.key);
  const complete = totalKeys.every((k) => scores[k] !== undefined);
  const total = totalKeys.reduce((s, k) => s + (scores[k] ?? 0), 0);
  const result = complete ? riskLevel(total) : null;

  const save = async () => {
    if (!patient) return toast.error("Select a patient first");
    if (!staff.trim()) return toast.error("Enter staff name");
    if (!complete || !result) return toast.error("Complete all categories");
    setBusy(true);
    try {
      await api.createBradenAssessment(patient.id, staff.trim(), scores as BradenScores);
      await refreshPatients();
      toast.success(`Braden score saved for ${patient.name}`, { description: `${total} — ${result.level}` });
      setScores({});
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not save assessment");
    } finally {
      setBusy(false);
    }
  };

  const toneClass = (tone?: string) =>
    tone === "success" ? "bg-success text-success-foreground" :
    tone === "warning" ? "bg-warning text-warning-foreground" :
    tone === "danger" ? "bg-destructive text-destructive-foreground" : "";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Braden Scale Assessment</h2>
            <p className="text-sm text-muted-foreground">Total range 6–23. Lower scores = higher risk of pressure injury.</p>
            <div className="mt-3 max-w-xs">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Assessing staff</label>
              <Input value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="RN name / initials" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Current total</div>
            <div className="text-3xl font-bold tabular-nums">{complete ? total : "—"}</div>
            {result && <Badge className={`mt-1 ${toneClass(result.tone)}`}>{result.level}</Badge>}
          </div>
        </div>
        {result && (
          <p className="mt-3 rounded-lg bg-muted/60 p-3 text-sm">
            <span className="font-medium">Recommended actions: </span>{result.guidance}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((c) => (
          <div key={c.key} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-3">
              <div className="font-semibold">{c.label}</div>
              <div className="text-xs text-muted-foreground">{c.desc}</div>
            </div>
            <div className="space-y-2">
              {c.options.map((o) => {
                const active = scores[c.key] === o.score;
                return (
                  <button
                    key={o.score}
                    type="button"
                    onClick={() => setScores({ ...scores, [c.key]: o.score })}
                    className={`w-full rounded-lg border p-3 text-left transition ${active ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "hover:bg-muted/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{o.label}</span>
                      <Badge variant="outline">{o.score}</Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{o.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={!complete || !patient || busy}>Save assessment</Button>
      </div>
    </div>
  );
}
