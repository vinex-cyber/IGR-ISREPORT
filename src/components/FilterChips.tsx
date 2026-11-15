// src/components/FilterChips.tsx
export type FilterChipItem = {
  /** nilai yang dikirim ke onChange */
  key: string;
  label: string;
  count?: number;
  /** kelas warna titik, mis. "bg-red-500" */
  dot?: string;
  /** kelas chip saat aktif (warna status), mis. "bg-red-100 text-red-700" */
  activeClassName?: string;
};

type FilterChipsProps = {
  items: FilterChipItem[];
  /** key aktif, "" = semua */
  value: string;
  onChange: (key: string) => void;
  /** jumlah baris untuk chip "Semua" */
  total: number;
  allLabel?: string;
};

/**
 * Baris chip filter dengan jumlah per status. Chip pertama selalu "Semua".
 */
export function FilterChips({
  items,
  value,
  onChange,
  total,
  allLabel = "Semua",
}: FilterChipsProps) {
  const base =
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors";
  const idle =
    "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`${base} ${
          value === ""
            ? "border-transparent bg-foreground text-background"
            : idle
        }`}>
        {allLabel}
        <span className="tabular-nums opacity-70">{total}</span>
      </button>

      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(active ? "" : item.key)}
            className={`${base} ${
              active
                ? `${item.activeClassName ?? ""} ring-2 ring-inset`
                : idle
            }`}>
            {item.dot ? (
              <span className={`size-1.5 rounded-full ${item.dot}`} />
            ) : null}
            {item.label}
            {typeof item.count === "number" ? (
              <span className="tabular-nums opacity-70">{item.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
