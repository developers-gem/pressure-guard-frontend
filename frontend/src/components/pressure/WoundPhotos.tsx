import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, X, ZoomIn, MapPin, Filter, PersonStanding, ChevronDown, ChevronUp, Pencil, Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { WoundPhoto } from "@/api/types";
import * as api from "@/api/resources";
import { apiOrigin } from "@/api/client";
import { BodyDiagramPicker } from "./BodyDiagramPicker";

interface Props {
  photos: WoundPhoto[];
  onChange: (photos: WoundPhoto[]) => void;
  label?: string;
  compact?: boolean;
  locationPresets?: string[];
  defaultLocation?: string;
}

const DATALIST_ID = "wound-body-locations";

export function photoSrc(p: WoundPhoto) {
  // Uploaded photo URLs are relative (e.g. /uploads/xyz.jpg) — resolve against the API origin.
  return p.url.startsWith("http") ? p.url : `${apiOrigin()}${p.url}`;
}

export function WoundPhotos({ photos, onChange, label = "Wound photos", compact = false, locationPresets = [], defaultLocation = "" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [zoom, setZoom] = useState<WoundPhoto | null>(null);
  const [caption, setCaption] = useState("");
  const [bodyLocation, setBodyLocation] = useState(defaultLocation);
  const [diagramOpen, setDiagramOpen] = useState(true);
  const [retagging, setRetagging] = useState<WoundPhoto | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!bodyLocation.trim()) {
      toast.error("Tag a body location before uploading");
      return;
    }
    setUploading(true);
    try {
      const next: WoundPhoto[] = [...photos];
      for (const file of Array.from(files)) {
        try {
          const url = await api.uploadPhoto(file);
          next.unshift({
            url,
            caption: caption.trim(),
            bodyLocation: bodyLocation.trim(),
            timestamp: new Date().toISOString(),
          });
        } catch {
          toast.error(`Could not upload ${file.name}`);
        }
      }
      onChange(next);
      setCaption("");
      if (inputRef.current) inputRef.current.value = "";
      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added · ${bodyLocation.trim()}`);
    } finally {
      setUploading(false);
    }
  };

  const remove = (url: string) => onChange(photos.filter((p) => p.url !== url));
  const retag = (url: string, location: string) => {
    onChange(photos.map((p) => (p.url === url ? { ...p, bodyLocation: location } : p)));
    setRetagging(null);
    toast.success(`Photo retagged · ${location}`);
  };

  return (
    <div className={compact ? "" : "rounded-xl border bg-card p-5 shadow-sm"}>
      {!compact && (
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{label}</h3>
          <span className="text-xs text-muted-foreground">{photos.length} on record</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Body location <span className="text-destructive">*</span>
            </label>
            <Input
              list={locationPresets.length ? DATALIST_ID : undefined}
              value={bodyLocation}
              onChange={(e) => setBodyLocation(e.target.value)}
              placeholder="e.g. Sacrum, Right heel, L plantar 1st MTH"
            />
            {locationPresets.length > 0 && (
              <datalist id={DATALIST_ID}>
                {locationPresets.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            )}
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Caption (optional)</label>
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Stage 2, post-dressing" />
          </div>
          <input ref={inputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
            Add photo
          </Button>
        </div>

        <button type="button" onClick={() => setDiagramOpen((o) => !o)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <PersonStanding className="h-3.5 w-3.5" />
          {diagramOpen ? "Hide body diagram" : "Tag on body diagram"}
          {diagramOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {diagramOpen && <BodyDiagramPicker value={bodyLocation} onSelect={setBodyLocation} extraPresets={locationPresets} />}
      </div>

      {photos.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No photos yet. Tag a body location, then capture or upload images.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p) => (
            <li key={p.url} className="group relative overflow-hidden rounded-lg border bg-muted">
              <button type="button" onClick={() => setZoom(p)} className="block w-full" aria-label="View photo">
                <img src={photoSrc(p)} alt={p.bodyLocation || p.caption || "Wound photo"} className="aspect-square w-full object-cover transition group-hover:opacity-90" loading="lazy" />
              </button>
              <button type="button" onClick={() => setRetagging(p)} className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium text-primary-foreground shadow hover:bg-primary">
                <MapPin className="h-3 w-3" />
                <span className="max-w-[110px] truncate">{p.bodyLocation || "Untagged"}</span>
                <Pencil className="h-2.5 w-2.5 opacity-80" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] text-white">
                <div>{p.timestamp && new Date(p.timestamp).toLocaleString()}</div>
                {p.caption && <div className="truncate">{p.caption}</div>}
              </div>
              <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button type="button" onClick={() => setRetagging(p)} className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80" aria-label="Retag location">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => setZoom(p)} className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80" aria-label="Zoom">
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => remove(p.url)} className="rounded-full bg-destructive/90 p-1 text-destructive-foreground hover:bg-destructive" aria-label="Remove">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {retagging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setRetagging(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={photoSrc(retagging)} alt={retagging.bodyLocation || "Wound photo"} className="h-16 w-16 rounded-md border object-cover" />
                <div>
                  <div className="text-sm font-semibold">Retag body location</div>
                  <div className="text-xs text-muted-foreground">Currently: {retagging.bodyLocation || "Untagged"}</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setRetagging(null)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <BodyDiagramPicker value={retagging.bodyLocation} onSelect={(loc) => retag(retagging.url, loc)} extraPresets={locationPresets} />
            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Or type a location</label>
                <Input
                  defaultValue={retagging.bodyLocation ?? ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (v) retag(retagging.url, v);
                    }
                  }}
                  placeholder="e.g. Sacrum"
                />
              </div>
              <span className="pb-2 text-xs text-muted-foreground">Press Enter to save</span>
            </div>
          </div>
        </div>
      )}

      {zoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setZoom(null)}>
          <div className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={photoSrc(zoom)} alt={zoom.caption || "Wound photo"} className="max-h-[80vh] w-auto rounded-lg" />
            <div className="mt-2 flex items-center justify-between text-sm text-white">
              <div>
                {zoom.bodyLocation && (
                  <div className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                    <MapPin className="h-3 w-3" /> {zoom.bodyLocation}
                  </div>
                )}
                <div className="font-medium">{zoom.caption || "No caption"}</div>
                <div className="text-xs text-white/70">{zoom.timestamp && new Date(zoom.timestamp).toLocaleString()}</div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setZoom(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface HistoryProps {
  entries: { id: string; timestamp: string; photos?: WoundPhoto[]; label?: string }[];
  title?: string;
}

export function WoundPhotoHistory({ entries, title = "Photo history" }: HistoryProps) {
  const [zoom, setZoom] = useState<WoundPhoto | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const withPhotos = entries.filter((e) => e.photos && e.photos.length > 0);

  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    for (const e of withPhotos) {
      for (const p of e.photos ?? []) set.add(p.bodyLocation || "(untagged)");
    }
    return Array.from(set).sort();
  }, [withPhotos]);

  const filterMatch = (p: WoundPhoto) => {
    if (locationFilter === "all") return true;
    if (locationFilter === "(untagged)") return !p.bodyLocation;
    return p.bodyLocation === locationFilter;
  };

  const filteredEntries = withPhotos.map((e) => ({ ...e, photos: (e.photos ?? []).filter(filterMatch) })).filter((e) => e.photos.length > 0);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        {availableLocations.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="rounded-md border bg-background px-2 py-1 text-xs">
              <option value="all">All locations</option>
              {availableLocations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {filteredEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{withPhotos.length === 0 ? "No wound photos on record for this patient yet." : "No photos match this location filter."}</p>
      ) : (
        <ul className="space-y-4">
          {filteredEntries.map((e) => (
            <li key={e.id}>
              <div className="mb-2 text-xs text-muted-foreground">
                {new Date(e.timestamp).toLocaleString()}
                {e.label ? ` · ${e.label}` : ""}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {e.photos.map((p) => (
                  <button key={p.url} type="button" onClick={() => setZoom(p)} className="group relative overflow-hidden rounded-md border bg-muted" aria-label={p.bodyLocation || p.caption || "View photo"}>
                    <img src={photoSrc(p)} alt={p.bodyLocation || p.caption || "Wound photo"} className="aspect-square w-full object-cover" loading="lazy" />
                    {p.bodyLocation && <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-0.5 text-left text-[10px] text-white">{p.bodyLocation}</span>}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
      {zoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setZoom(null)}>
          <div className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={photoSrc(zoom)} alt={zoom.caption || "Wound photo"} className="max-h-[80vh] w-auto rounded-lg" />
            <div className="mt-2 flex items-center justify-between text-sm text-white">
              <div>
                {zoom.bodyLocation && (
                  <div className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                    <MapPin className="h-3 w-3" /> {zoom.bodyLocation}
                  </div>
                )}
                <div className="font-medium">{zoom.caption || "No caption"}</div>
                <div className="text-xs text-white/70">{zoom.timestamp && new Date(zoom.timestamp).toLocaleString()}</div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setZoom(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
