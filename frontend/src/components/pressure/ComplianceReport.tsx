import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ComplianceSummary } from "@/api/types";
import * as api from "@/api/resources";
import { client } from "@/api/client";

export function ComplianceReport() {
  const [data, setData] = useState<ComplianceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .fetchComplianceSummary()
      .then(setData)
      .catch(() => toast.error("Could not load compliance summary"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000); // auto-refresh every minute
    return () => clearInterval(t);
  }, []);

  const exportCSV = async () => {
    try {
      const res = await client.get("/compliance/export.csv", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pressureguard-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not export CSV");
    }
  };

  if (loading && !data) {
    return <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">Loading compliance data…</div>;
  }
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Patients tracked" value={data.patientsTracked} />
        <Metric label="Turns logged (24h)" value={data.turnsLogged24h} />
        <Metric
          label="24h turn compliance"
          value={`${data.overallCompliance24h}%`}
          tone={data.overallCompliance24h >= 90 ? "success" : data.overallCompliance24h >= 70 ? "warning" : "danger"}
        />
        <Metric label="Skin inspections (7d)" value={data.skinInspections7d} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-3 font-semibold">Compliance by patient (last 24h)</h3>
          {data.complianceByPatient.length === 0 ? (
            <p className="text-sm text-muted-foreground">No patients tracked yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.complianceByPatient.map((r) => (
                <li key={r.patientId}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{r.name} · Room {r.room}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">{r.turns}/12 · {r.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${r.pct >= 90 ? "bg-success" : r.pct >= 70 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${r.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Currently overdue</h3>
              <Badge className={data.overdue.length ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}>{data.overdue.length}</Badge>
            </div>
            {data.overdue.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">All tracked patients within the 2-hour window.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {data.overdue.map((p) => (
                  <li key={p.patientId} className="flex justify-between">
                    <span>{p.name} · Room {p.room}</span>
                    <span className="text-destructive">{p.minutesSinceLastTurn} min since last turn</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">High-risk patients (Braden ≤ 14)</h3>
              <Badge>{data.highRisk.length}</Badge>
            </div>
            {data.highRisk.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No high-risk patients recorded.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {data.highRisk.map((p) => (
                  <li key={p.patientId} className="flex justify-between">
                    <span>{p.name} · Room {p.room}</span>
                    <Badge variant="outline">{p.bradenScore} · {p.bradenRisk}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={exportCSV} variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Download className="h-4 w-4" /> Export raw CSV
        </Button>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: "success" | "warning" | "danger" }) {
  const color = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="rounded-xl border border-t-2 bg-card p-5 shadow-sm" style={{ borderTopColor: "var(--tab-compliance)" }}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-mono mt-1 text-3xl font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
