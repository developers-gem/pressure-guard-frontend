import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlarmClock, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Patient, RepositionLog } from "@/api/types";
import * as api from "@/api/resources";

const TWO_HOURS = 2 * 60 * 60 * 1000;
const POSITIONS = ["Supine", "Left lateral (30°)", "Right lateral (30°)", "Fowler's", "Prone", "Chair — off-loaded"];

interface Props {
  patient: Patient | null;
  refreshPatients: () => Promise<void>;
}

export function RepositionTimer({ patient, refreshPatients }: Props) {
  const [now, setNow] = useState(Date.now());
  const [position, setPosition] = useState(POSITIONS[0]);
  const [staff, setStaff] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<RepositionLog[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!patient) {
      setLogs([]);
      return;
    }
    api.listRepositionLogs(patient.id).then(setLogs).catch(() => toast.error("Could not load turn history"));
  }, [patient?.id]);

  const last = patient?.lastRepositioned ? new Date(patient.lastRepositioned).getTime() : undefined;
  const elapsed = last ? now - last : null;
  const remaining = elapsed !== null ? TWO_HOURS - elapsed : null;
  const pct = elapsed !== null ? Math.min(100, (elapsed / TWO_HOURS) * 100) : 0;
  const overdue = remaining !== null && remaining <= 0;

  useEffect(() => {
    if (!patient || !last) return;
    if (overdue) {
      const key = `notified-${patient.id}-${last}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        toast.warning(`Repositioning due for ${patient.name}`, { description: "2 hours have elapsed since the last turn." });
      }
    }
  }, [overdue, patient, last]);

  const format = (ms: number) => {
    const abs = Math.abs(ms);
    const h = Math.floor(abs / 3_600_000);
    const m = Math.floor((abs % 3_600_000) / 60_000);
    const s = Math.floor((abs % 60_000) / 1000);
    return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const logTurn = async () => {
    if (!patient) return toast.error("Select a patient first");
    if (!staff.trim()) return toast.error("Enter staff name");
    setBusy(true);
    try {
      const entry = await api.createRepositionLog(patient.id, { position, staff: staff.trim(), notes: notes.trim() });
      setLogs((prev) => [entry, ...prev]);
      await refreshPatients();
      setNotes("");
      toast.success("Reposition logged", { description: `${patient.name} → ${position}` });
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not log turn");
    } finally {
      setBusy(false);
    }
  };

  const recentForPatient = useMemo(() => logs.slice(0, 5), [logs]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-3 ${overdue ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
              <AlarmClock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">2-Hour Repositioning Timer</h2>
              <p className="text-sm text-muted-foreground">{patient ? `Tracking ${patient.name} · Room ${patient.room}` : "No patient selected"}</p>
            </div>
          </div>

          <div className="mt-6">
            {last ? (
              <>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{overdue ? "Overdue by" : "Time until next turn"}</div>
                    <div className={`text-4xl font-bold tabular-nums ${overdue ? "text-destructive" : "text-foreground"}`}>{format(remaining ?? 0)}</div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">Last turn: {new Date(last).toLocaleString()}</div>
                </div>
                <Progress value={pct} className="mt-4 h-3" />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No repositioning logged yet. Log the first turn below to start the 2-hour timer.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Log repositioning</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">New position</label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Staff member</label>
              <Input value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="RN name / initials" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Skin observations, pillows used, patient tolerance..." />
            </div>
          </div>
          <Button onClick={logTurn} disabled={!patient || busy} className="mt-4 gap-2">
            <CheckCircle2 className="h-4 w-4" /> Record turn
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-3 font-semibold">Recent turns</h3>
        {recentForPatient.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history for this patient yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentForPatient.map((l) => (
              <li key={l._id} className="border-l-2 border-primary pl-3">
                <div className="text-sm font-medium">{l.position}</div>
                <div className="text-xs text-muted-foreground">{new Date(l.timestamp).toLocaleString()} · {l.staff}</div>
                {l.notes && <div className="mt-1 text-xs text-foreground/80">{l.notes}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
