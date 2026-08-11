import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Patient } from "@/api/types";
import * as api from "@/api/resources";

interface Props {
  patients: Patient[];
  refresh: () => Promise<void>;
  currentId: string | null;
  setCurrentId: (id: string | null) => void;
}

export function PatientBar({ patients, refresh, currentId, setCurrentId }: Props) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [busy, setBusy] = useState(false);

  const addPatient = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const p = await api.createPatient({ name: name.trim(), room: room.trim() || "—" });
      await refresh();
      setCurrentId(p.id);
      setName("");
      setRoom("");
      toast.success(`${p.name} added`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not add patient");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!currentId) return;
    if (!confirm("Remove this patient? This does not delete their historical records.")) return;
    setBusy(true);
    try {
      await api.deletePatient(currentId);
      await refresh();
      setCurrentId(patients.find((p) => p.id !== currentId)?.id ?? null);
      toast.success("Patient removed");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not remove patient");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Active patient</label>
          <Select value={currentId ?? ""} onValueChange={(v) => setCurrentId(v)}>
            <SelectTrigger>
              <SelectValue placeholder={patients.length ? "Select patient" : "No patients yet"} />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — Room {p.room}
                  {p.bradenRisk ? ` · ${p.bradenRisk}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">New patient name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mary Johnson" className="w-48" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Room</label>
            <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="204B" className="w-24" />
          </div>
          <Button onClick={addPatient} disabled={busy} className="gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
          {currentId && (
            <Button variant="outline" onClick={remove} disabled={busy} className="gap-1 text-destructive">
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
