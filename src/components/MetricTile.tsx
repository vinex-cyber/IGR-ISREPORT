// src/components/MetricTile.tsx
type MetricTileProps = {
  label: string;
  value: string;
  /** kelas warna nilai, mis. "text-red-600" */
  tone?: string;
};

/** Kotak kecil label + nilai untuk daftar metrik di dalam kartu. */
export function MetricTile({ label, value, tone }: MetricTileProps) {
  return (
    <div className="rounded-md bg-muted/50 px-1.5 py-0.5 ring-1 ring-inset ring-border/40">
      <dt className="text-[9px] uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`text-[11px] font-semibold leading-tight tabular-nums ${
          tone ?? "text-foreground"
        }`}>
        {value}
      </dd>
    </div>
  );
}
