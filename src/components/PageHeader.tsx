// src/components/PageHeader.tsx
import type { ComponentType, ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  /** baris kecil di bawah judul, mis. "Cabang IGRCPG · 7.991 PLU" */
  subtitle?: ReactNode;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** aksi di kanan (tombol, select cabang, dll) */
  children?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? (
          <span className="rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 p-2.5 text-white shadow-lg shadow-sky-500/20">
            <Icon className="size-5" aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold sm:text-lg">{title}</h1>
          {subtitle ? (
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {children ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
