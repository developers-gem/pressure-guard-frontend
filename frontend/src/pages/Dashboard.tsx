import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, LogOut, RefreshCw, ClipboardList, Activity, Scan, Footprints } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { Patient } from "@/api/types";
import * as api from "@/api/resources";
import { PatientBar } from "@/components/pressure/PatientBar";
import { RepositionTimer } from "@/components/pressure/RepositionTimer";
import { BradenScale } from "@/components/pressure/BradenScale";
import { SkinInspection } from "@/components/pressure/SkinInspection";
import { FootUlcer } from "@/components/pressure/FootUlcer";
import { ComplianceReport } from "@/components/pressure/ComplianceReport";

/**
 * Each module gets a fixed accent color, styled like the colored index
 * tabs on a paper patient chart (Vitals/Skin/Wound dividers). The color
 * shows as a small dot on every tab and fills the tab when active, so the
 * same color identifies that module's data everywhere else in the app.
 */
const MODULE_TABS = [
  { value: "repositioning", label: "Repositioning", icon: RefreshCw, color: "var(--tab-reposition)" },
  { value: "braden", label: "Braden Scale", icon: Activity, color: "var(--tab-braden)" },
  { value: "skin", label: "Skin Inspection", icon: Scan, color: "var(--tab-skin)" },
  { value: "foot", label: "Diabetic Foot", icon: Footprints, color: "var(--tab-foot)" },
  { value: "compliance", label: "Compliance", icon: ClipboardList, color: "var(--tab-compliance)" },
] as const;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const list = await api.listPatients();
      setPatients(list);
      if (!currentId && list.length) setCurrentId(list[0].id);
    } catch {
      toast.error("Could not load patients");
    } finally {
      setLoading(false);
    }
  }, [currentId]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPatient = useMemo(() => patients.find((p) => p.id === currentId) ?? null, [patients, currentId]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-tight tracking-tight">PressureGuard</div>
              <div className="text-xs text-muted-foreground">Pressure Injury Prevention · Nursing Homes & Hospitals</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div className="hidden text-sm sm:block">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.credentials || user?.role}</div>
            </div>
            <Button variant="outline" size="icon" onClick={refresh} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={logout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <PatientBar patients={patients} refresh={refresh} currentId={currentId} setCurrentId={setCurrentId} />

        <Tabs defaultValue="repositioning">
          <TabsList className="h-auto flex-wrap gap-1 bg-secondary/60 p-1.5">
            {MODULE_TABS.map(({ value, label, icon: Icon, color }) => (
              <TabsTrigger
                key={value}
                value={value}
                style={{ ["--tab-color" as string]: color }}
                className="gap-1.5 rounded-md border border-transparent data-[state=active]:!border-[var(--tab-color)] data-[state=active]:!bg-[var(--tab-color)] data-[state=active]:!text-white data-[state=active]:!shadow-none"
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="repositioning" className="mt-4">
            <RepositionTimer patient={currentPatient} refreshPatients={refresh} />
          </TabsContent>
          <TabsContent value="braden" className="mt-4">
            <BradenScale patient={currentPatient} refreshPatients={refresh} />
          </TabsContent>
          <TabsContent value="skin" className="mt-4">
            <SkinInspection patient={currentPatient} />
          </TabsContent>
          <TabsContent value="foot" className="mt-4">
            <FootUlcer patient={currentPatient} />
          </TabsContent>
          <TabsContent value="compliance" className="mt-4">
            <ComplianceReport />
          </TabsContent>
        </Tabs>

        {!loading && patients.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">Add your first patient above to get started.</p>
        )}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        For clinical workflow support only. Not a substitute for professional medical judgment. Not a certified medical device.
      </footer>
    </div>
  );
}
