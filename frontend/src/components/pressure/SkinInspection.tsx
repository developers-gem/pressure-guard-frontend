import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import diagram from "@/assets/pressure-ulcer-diagram.jpg";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Patient, SkinInspection as Inspection, WoundPhoto } from "@/api/types";
import * as api from "@/api/resources";
import { WoundPhotos, WoundPhotoHistory } from "./WoundPhotos";

const AREAS = [
  "Sacrum / Coccyx",
  "Left heel",
  "Right heel",
  "Left hip / trochanter",
  "Right hip / trochanter",
  "Shoulder blades",
  "Back of head (occiput)",
  "Left elbow",
  "Right elbow",
  "Left ankle (malleolus)",
  "Right ankle (malleolus)",
  "Ears",
];

const STATUSES = [
  { key: "intact", label: "Intact", color: "bg-success text-success-foreground" },
  { key: "stage1", label: "Stage 1 (non-blanchable erythema)", color: "bg-warning text-warning-foreground" },
  { key: "stage2", label: "Stage 2 (partial thickness)", color: "bg-warning text-warning-foreground" },
  { key: "stage3", label: "Stage 3 (full thickness)", color: "bg-destructive text-destructive-foreground" },
  { key: "stage4", label: "Stage 4 (bone/tendon exposed)", color: "bg-destructive text-destructive-foreground" },
  { key: "dti", label: "Deep tissue injury", color: "bg-destructive text-destructive-foreground" },
  { key: "unstageable", label: "Unstageable", color: "bg-destructive text-destructive-foreground" },
];

interface Props {
  patient: Patient | null;
}

export function SkinInspection({ patient }: Props) {
  const [staff, setStaff] = useState("");
  const [areaState, setAreaState] = useState<Record<string, { status: string; notes: string }>>({});
  const [photos, setPhotos] = useState<WoundPhoto[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!patient) {
      setInspections([]);
      return;
    }
    api.listSkinInspections(patient.id).then(setInspections).catch(() => toast.error("Could not load inspection history"));
  }, [patient?.id]);

  const save = async () => {
    if (!patient) return toast.error("Select a patient first");
    if (!staff.trim()) return toast.error("Enter staff name");
    setBusy(true);
    try {
      const areas = Object.entries(areaState)
        .filter(([, v]) => v.status)
        .map(([area, v]) => ({ area, status: v.status, notes: v.notes || "" }));
      const entry = await api.createSkinInspection(patient.id, { staff: staff.trim(), areas, photos });
      setInspections((prev) => [entry, ...prev]);
      setAreaState({});
      setPhotos([]);
      toast.success("Skin inspection saved");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not save inspection");
    } finally {
      setBusy(false);
    }
  };

  const historyForPatient = inspections.slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold tracking-tight">Head-to-Toe Skin Inspection</h2>
          <p className="text-sm text-muted-foreground">Assess bony prominences and high-risk areas. Reference the diagram at right.</p>
          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Inspecting staff</label>
            <Input value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="RN name / initials" className="max-w-sm" />
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="divide-y">
            {AREAS.map((area) => {
              const state = areaState[area] ?? { status: "", notes: "" };
              const activeStatus = STATUSES.find((s) => s.key === state.status);
              return (
                <div key={area} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{area}</div>
                    {activeStatus && <Badge className={activeStatus.color}>{activeStatus.label}</Badge>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setAreaState({ ...areaState, [area]: { ...state, status: s.key } })}
                        className={`rounded-full border px-3 py-1 text-xs transition ${state.status === s.key ? "border-[var(--tab-skin)] bg-[var(--tab-skin-soft)] text-[var(--tab-skin)]" : "hover:bg-muted"}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {state.status && state.status !== "intact" && (
                    <Textarea
                      className="mt-2"
                      value={state.notes}
                      onChange={(e) => setAreaState({ ...areaState, [area]: { ...state, notes: e.target.value } })}
                      placeholder="Size, exudate, odor, surrounding skin, interventions..."
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <WoundPhotos photos={photos} onChange={setPhotos} label="Photos for this inspection" locationPresets={AREAS} />

        <div className="flex justify-end">
          <Button onClick={save} disabled={!patient || busy}>Save inspection</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <img
            src={diagram}
            alt="Common pressure ulcer locations on the human body — sacrum, heels, hips, elbows, shoulder blades, and back of head"
            width={1280}
            height={960}
            className="h-auto w-full"
            loading="lazy"
          />
          <div className="p-4 text-xs text-muted-foreground">Pressure ulcers most commonly develop over bony prominences from prolonged pressure, friction, and shear.</div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-3 font-semibold">Recent inspections</h3>
          {historyForPatient.length === 0 ? (
            <p className="text-sm text-muted-foreground">No prior inspections for this patient.</p>
          ) : (
            <ul className="space-y-3">
              {historyForPatient.map((h) => {
                const issues = h.areas.filter((a) => a.status && a.status !== "intact");
                return (
                  <li key={h._id} className="border-l-2 border-[var(--tab-skin)] pl-3">
                    <div className="text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleString()} · {h.staff}</div>
                    <div className="text-sm">{issues.length === 0 ? "All areas intact" : `${issues.length} finding${issues.length > 1 ? "s" : ""}`}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <WoundPhotoHistory
          entries={inspections.map((h) => ({ id: h._id, timestamp: h.timestamp, photos: h.photos, label: h.staff }))}
          title="Skin photo history"
        />
      </div>
    </div>
  );
}
