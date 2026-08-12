import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Patient, FootAssessment, WoundPhoto } from "@/api/types";
import * as api from "@/api/resources";
import { WoundPhotos, WoundPhotoHistory } from "./WoundPhotos";

const WAGNER = [
  { grade: 0, label: "At-risk foot, no ulcer" },
  { grade: 1, label: "Superficial ulcer" },
  { grade: 2, label: "Deep ulcer to tendon/capsule" },
  { grade: 3, label: "Deep ulcer with abscess/osteomyelitis" },
  { grade: 4, label: "Localized gangrene (toe/forefoot)" },
  { grade: 5, label: "Extensive gangrene of foot" },
];

interface Props {
  patient: Patient | null;
}

type FormState = {
  staff: string;
  side: "Left" | "Right" | "Both";
  wagnerGrade: number;
  size: string;
  location: string;
  drainage: string;
  pulses: string;
  sensation: string;
  notes: string;
};

const INITIAL: FormState = {
  staff: "",
  side: "Left",
  wagnerGrade: 0,
  size: "",
  location: "",
  drainage: "None",
  pulses: "Palpable",
  sensation: "Intact (10g monofilament)",
  notes: "",
};

export function FootUlcer({ patient }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [photos, setPhotos] = useState<WoundPhoto[]>([]);
  const [assessments, setAssessments] = useState<FootAssessment[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!patient) {
      setAssessments([]);
      return;
    }
    api.listFootAssessments(patient.id).then(setAssessments).catch(() => toast.error("Could not load foot assessment history"));
  }, [patient?.id]);

  const save = async () => {
    if (!patient) return toast.error("Select a patient first");
    if (!form.staff.trim()) return toast.error("Enter staff name");
    setBusy(true);
    try {
      const entry = await api.createFootAssessment(patient.id, { ...form, staff: form.staff.trim(), photos });
      setAssessments((prev) => [entry, ...prev]);
      setPhotos([]);
      toast.success("Foot assessment saved");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not save assessment");
    } finally {
      setBusy(false);
    }
  };

  const gradeTone = (g: number) =>
    g <= 1 ? "bg-success text-success-foreground" : g <= 2 ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold tracking-tight">Diabetic Foot Ulcer Monitoring</h2>
          <p className="text-sm text-muted-foreground">Weekly Wagner grading, neurovascular check, and wound description.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Assessing staff</label>
              <Input value={form.staff} onChange={(e) => setForm({ ...form, staff: e.target.value })} placeholder="RN / MD name" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Foot</label>
              <Select value={form.side} onValueChange={(v) => setForm({ ...form, side: v as FormState["side"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Right">Right</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Wagner Grade</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {WAGNER.map((w) => (
                  <button
                    key={w.grade}
                    type="button"
                    onClick={() => setForm({ ...form, wagnerGrade: w.grade })}
                    className={`rounded-lg border p-3 text-left text-sm transition ${form.wagnerGrade === w.grade ? "border-[var(--tab-foot)] bg-[var(--tab-foot-soft)] ring-2 ring-[var(--tab-foot)]/30" : "hover:bg-muted/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Grade {w.grade}</span>
                      <Badge className={gradeTone(w.grade)}>{w.grade}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{w.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Ulcer location</label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. plantar 1st MTH" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Size (L × W × D cm)</label>
              <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="2.1 × 1.4 × 0.3" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Drainage</label>
              <Select value={form.drainage} onValueChange={(v) => setForm({ ...form, drainage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["None", "Serous", "Serosanguinous", "Sanguinous", "Purulent"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Pedal pulses</label>
              <Select value={form.pulses} onValueChange={(v) => setForm({ ...form, pulses: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Palpable", "Diminished", "Doppler only", "Absent"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Protective sensation</label>
              <Select value={form.sensation} onValueChange={(v) => setForm({ ...form, sensation: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Intact (10g monofilament)", "Reduced", "Absent — high risk"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes & interventions</label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Offloading, dressing, antibiotics, referrals..." />
            </div>
          </div>

          <div className="mt-4">
            <WoundPhotos
              photos={photos}
              onChange={setPhotos}
              compact
              label="Foot ulcer photos"
              locationPresets={[
                "Left plantar 1st MTH", "Right plantar 1st MTH", "Left plantar 5th MTH", "Right plantar 5th MTH",
                "Left heel", "Right heel", "Left great toe", "Right great toe",
                "Left lateral malleolus", "Right lateral malleolus", "Left medial malleolus", "Right medial malleolus",
                "Dorsum left foot", "Dorsum right foot",
              ]}
              defaultLocation={form.location ? `${form.side} ${form.location}` : ""}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={save} disabled={busy || !patient}>Save foot assessment</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 font-semibold">Trend</h3>
        {assessments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assessments yet for this patient.</p>
        ) : (
          <ul className="space-y-3">
            {assessments.slice(0, 6).map((h) => (
              <li key={h._id} className="border-l-2 border-[var(--tab-foot)] pl-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{h.side} · {h.location || "—"}</div>
                  <Badge className={gradeTone(h.wagnerGrade)}>Grade {h.wagnerGrade}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleString()} · {h.staff}</div>
                <div className="text-xs text-foreground/80">Size {h.size || "—"} · {h.drainage} drainage</div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          <WoundPhotoHistory
            entries={assessments.map((h) => ({ id: h._id, timestamp: h.timestamp, photos: h.photos, label: `${h.side} · Grade ${h.wagnerGrade}` }))}
            title="Foot photo history"
          />
        </div>
      </div>
    </div>
  );
}
