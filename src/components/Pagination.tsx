// src/components/Pagination.tsx
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** tampilkan teks "Halaman x dari y" */
  showLabel?: boolean;
};

// nomor halaman: 1 … current-1 current current+1 … last (maks 7 tombol)
function pageItems(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = Array.from(
    new Set([1, total, current - 1, current, current + 1]),
  )
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out: (number | "...")[] = [];
  let prev = 0;
  for (const p of wanted) {
    if (prev && p - prev > 1) out.push("...");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  showLabel = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-1 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-[11px] text-muted-foreground">
      {showLabel ? (
        <span>
          Halaman{" "}
          <strong className="tabular-nums text-foreground">{page}</strong> dari{" "}
          {totalPages.toLocaleString("id-ID")}
        </span>
      ) : (
        <span />
      )}

      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}>
          Sebelumnya
        </Button>

        {pageItems(page, totalPages).map((item, i) =>
          item === "..." ? (
            <span key={`gap-${i}`} className="px-1">
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={item === page ? "default" : "outline"}
              size="sm"
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className="w-8 px-0 tabular-nums">
              {item}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}>
          Berikutnya
        </Button>
      </div>
    </div>
  );
}
