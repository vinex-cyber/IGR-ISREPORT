// src/pages/inventory/monitoring-po-stock-produk/index.tsx
import { useMemo, useState } from "react";

import {
  AlertTriangle,
  Boxes,
  Download,
  Eraser,
  Package,
  RefreshCw,
  Search,
  Truck,
  Wand2,
  Zap,
} from "lucide-react";

import Layout from "@/components/Layout";
import { FilterChips } from "@/components/FilterChips";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import {
  MONITOR_STATUS,
  MONITOR_STATUS_ORDER,
  ProductMonitorCard,
  getMonitorStatus,
  type MonitorStatus,
} from "@/components/inventory/ProductMonitorCard";
import { StatCard } from "@/components/inventory/StatCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DATABASE_OPTIONS } from "@/configs/database-options";
import {
  monitoringPoStockProdukColumns,
  MonitoringPoStockProdukRows,
} from "@/configs/inventory/monitoring-po-stock-produk/monitoring-po-stock-produk-config";
import { useFetchData } from "@/hooks/data/useFetchData";
import { useReportPage } from "@/hooks/report/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import type { DefaultBranchPageProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";

export const getServerSideProps = getDefaultBranchServerSideProps;

const PAGE_SIZE = 50;
const PO_MATI_KET = ["PO mati / Kdlwarsa", "PO Alokasi / Mati"];
const FAST_MOVING_TAGS = ["E", "S", "D", "L"];

// chip filter: status monitoring, atau bucket khusus fast moving tanpa PO
type FilterKey = MonitorStatus | "fast-no-po" | "";

function isPoMati(row: MonitoringPoStockProdukRows) {
  return PO_MATI_KET.some((ket) => row.ket?.includes(ket));
}

function isFastMoving(row: MonitoringPoStockProdukRows) {
  return FAST_MOVING_TAGS.includes(row.tag);
}

/** Fast moving yang belum ada PO jalan dan stoknya masih di bawah PKM. */
function isFastMovingDeficit(
  row: MonitoringPoStockProdukRows,
  poJalan: number,
) {
  if (!isFastMoving(row) || poJalan !== 0) return false;
  return (Number(row.stock) || 0) + poJalan - (Number(row.pkm) || 0) < 0;
}

export default function MonitoringStockPoProdukPage({
  defaultBranch,
}: DefaultBranchPageProps) {
  const [branch, setBranch] = useState(defaultBranch);
  const [divFilter, setDivFilter] = useState("");
  const [filterKey, setFilterKey] = useState<FilterKey>("");
  // pagination lokal: 8000 kartu sekaligus bikin render berat
  const [page, setPage] = useState(1);
  // input qty PB per PLU (estimasi, dalam PCS)
  const [pbQty, setPbQty] = useState<Record<string, string>>({});
  const [minOrderWarnings, setMinOrderWarnings] = useState<
    MonitoringPoStockProdukRows[]
  >([]);

  // daftar divisi (kode -> nama) untuk label filter
  const { data: divisiData } = useFetchData<
    { div_kodedivisi: string; div_namadivisi: string }[]
  >({ endpoint: "/select-divisi" });
  const namaDivisi = useMemo(
    function buildNamaDivisi() {
      return Object.fromEntries(
        (divisiData ?? []).map((d) => [d.div_kodedivisi, d.div_namadivisi]),
      );
    },
    [divisiData],
  );

  const config = buildReport<MonitoringPoStockProdukRows>(
    monitoringPoStockProdukColumns,
  );
  const {
    data,
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    isRefreshing,
    handleRefresh,
  } = useReportPage<MonitoringPoStockProdukRows>({
    endpoint: "inventory/monitoring-po-stock-produk",
    reportTitle: "Monitoring Stock PO Produk",
    paginated: false,
    ...config,
  });

  const rawData = data ?? [];

  const enrich = (rows: MonitoringPoStockProdukRows[]) =>
    Array.from(new Map(rows.map((row) => [row.plu, row])).values()).map(
      (row) => ({
        ...row,
        nama_div: namaDivisi[String(row.div)] ?? String(row.div),
      }),
    );

  const allUniquePluRows = enrich(rawData);
  const filteredUniquePluRows = enrich(filteredData ?? []);

  const uniquePluCount = allUniquePluRows.length;

  const divisiOptions = Array.from(
    new Set(allUniquePluRows.map((row) => String(row.div))),
  ).sort();

  const tableData = divFilter
    ? filteredUniquePluRows.filter((row) => String(row.div) === divFilter)
    : filteredUniquePluRows;

  const poLiveByPlu = new Map<string, number>();
  for (const row of rawData) {
    if (row.po_out == null || isPoMati(row)) continue;
    poLiveByPlu.set(
      row.plu,
      (poLiveByPlu.get(row.plu) ?? 0) + Number(row.po_out),
    );
  }

  // KPI mencakup seluruh PLU di bawah PKM, termasuk yang sudah OOS.
  const defisitPkm = allUniquePluRows.filter((row) => {
    const stock = Number(row.stock) || 0;
    const po = poLiveByPlu.get(row.plu) ?? 0;
    return stock + po < (Number(row.pkm) || 0);
  }).length;

  // fast moving tanpa PO: hanya yang defisit, satu definisi untuk KPI & chip
  const fastNoPoCount = allUniquePluRows.filter((row) =>
    isFastMovingDeficit(row, poLiveByPlu.get(row.plu) ?? 0),
  ).length;

  const poOutRows = rawData.filter(
    (row) => row.po_out != null && !isPoMati(row),
  );
  const totalPoOut = new Set(poOutRows.map((r) => r.plu)).size;

  // Satu perhitungan per PLU: status, defisit, saran PB, cakupan stok vs PKM
  const viewRows = tableData.map((row) => {
    const stock = Number(row.stock) || 0;
    const po = poLiveByPlu.get(String(row.plu)) ?? 0;
    const pkm = Number(row.pkm) || 0;
    const deficit = stock + po - pkm;

    return {
      row,
      stock,
      po,
      pkm,
      deficit,
      status: getMonitorStatus(stock, po, pkm),
      fastNoPo: isFastMovingDeficit(row, po),
      saranPcs: deficit < 0 ? Math.abs(deficit) : 0,
      salesPerDay: Math.round((Number(row.avgsls_qty) || 0) / 30),
      coverage:
        pkm > 0 ? Math.min(100, Math.round(((stock + po) / pkm) * 100)) : 100,
    };
  });

  const statusCount = Object.fromEntries(
    MONITOR_STATUS_ORDER.map((key) => [key, 0]),
  ) as Record<MonitorStatus, number>;
  for (const item of viewRows) {
    statusCount[item.status] += 1;
  }
  // Defisit PKM adalah filter kondisi, sehingga turut mencakup kartu OOS
  // bila stok + PO jalannya masih di bawah PKM.
  statusCount.defisit = viewRows.filter((item) => item.deficit < 0).length;

  const shownRows =
    filterKey === "fast-no-po"
      ? viewRows.filter((item) => item.fastNoPo)
      : filterKey === "defisit"
        ? viewRows.filter((item) => item.deficit < 0)
        : filterKey
          ? viewRows.filter((item) => item.status === filterKey)
          : viewRows;

  const totalPages = Math.max(1, Math.ceil(shownRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = shownRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const isFiltered = Boolean(divFilter || filterKey || searchTerm);

  // isi Qty PB dengan saran untuk PLU pada hasil filter tanpa menghapus input lain.
  const handleAutoInputPb = () => {
    setPbQty(function fillSuggestedPb(previousPbQty) {
      return {
        ...previousPbQty,
        ...Object.fromEntries(
          shownRows
            .filter((item) => item.saranPcs > 0)
            .map((item) => [String(item.row.plu), String(item.saranPcs)]),
        ),
      };
    });
  };

  const handleResetPb = () => setPbQty({});

  function downloadCsv(fileName: string, content: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportDraftPb() {
    const draftPb = allUniquePluRows
      .map((row) => ({
        plu: `#${String(row.plu).padStart(7, "0")}`,
        qtyPb: Number(pbQty[String(row.plu)]),
      }))
      .filter((row) => row.qtyPb > 0);

    if (draftPb.length === 0) return;

    downloadCsv(
      "LOV DRAFT PB.csv",
      ["PLU", ...draftPb.map((row) => row.plu)].join("\r\n"),
    );
    downloadCsv(
      "DRAFT QTY PB.csv",
      [
        "PLU,QTY_IN_PCS",
        ...draftPb.map((row) => `${row.plu},${row.qtyPb}`),
      ].join("\r\n"),
    );
  }

  function handleExportDraftPb() {
    const warnings = allUniquePluRows.filter((row) => {
      const qtyPb = Number(pbQty[String(row.plu)]);
      const minOrder = Number(row.minorder);
      return qtyPb > 0 && minOrder > 0 && qtyPb < minOrder;
    });

    if (warnings.length > 0) {
      setMinOrderWarnings(warnings);
      return;
    }

    exportDraftPb();
  }

  function handleUseMinOrder() {
    setPbQty(function applyMinimumOrder(previousPbQty) {
      return {
        ...previousPbQty,
        ...Object.fromEntries(
          minOrderWarnings.map((row) => [
            String(row.plu),
            String(Number(row.minorder)),
          ]),
        ),
      };
    });
    setMinOrderWarnings([]);
  }

  return (
    <Layout title="Monitoring PO & Stock Produk" branch={branch}>
      <PageHeader
        title="Monitoring PO & Stock Produk"
        icon={Boxes}
        subtitle={
          <>
            Cabang{" "}
            <span className="font-semibold text-foreground">{branch}</span> ·{" "}
            {uniquePluCount.toLocaleString("id-ID")} PLU dipantau
          </>
        }>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Muat ulang data cabang aktif">
          <RefreshCw
            className={isRefreshing ? "animate-spin" : undefined}
            aria-hidden
          />
          Muat ulang
        </Button>

        <SettingsDatabase
          value={branch}
          onChange={setBranch}
          options={DATABASE_OPTIONS}
        />
      </PageHeader>

      {/* KPI */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          tone="sky"
          label="Total PLU Aktif"
          value={uniquePluCount}
          hint="PLU unik cabang ini"
        />
        <StatCard
          icon={AlertTriangle}
          tone="rose"
          label="Defisit PKM"
          value={defisitPkm}
          hint="Stok + PO jalan di bawah PKM"
        />
        <StatCard
          icon={Zap}
          tone="amber"
          label="Fast Moving tanpa PO"
          value={fastNoPoCount}
          hint="Tag E / S / D / L"
        />
        <StatCard
          icon={Truck}
          tone="emerald"
          label="PO Sedang Jalan"
          value={totalPoOut}
          hint="PO mati tidak dihitung"
        />
      </div>

      {/* Filter */}
      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari PLU / nama / supplier / monitoring..."
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <select
              value={divFilter}
              onChange={(e) => {
                setDivFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter divisi"
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-ring lg:w-64">
              <option value="">
                Semua Divisi ({allUniquePluRows.length} PLU)
              </option>
              {divisiOptions.map((div) => (
                <option key={div} value={div}>
                  {div} - {namaDivisi[div] ?? div} (
                  {allUniquePluRows.filter((r) => String(r.div) === div).length}{" "}
                  PLU)
                </option>
              ))}
            </select>
          </div>

          {/* Filter chips */}
          <div className="mt-2 flex flex-wrap items-center gap-2 lg:ml-auto">
            <FilterChips
              value={filterKey}
              total={viewRows.length}
              onChange={(key) => {
                setFilterKey(key as FilterKey);
                setPage(1);
              }}
              items={[
                ...MONITOR_STATUS_ORDER.map((key) => ({
                  key,
                  label: MONITOR_STATUS[key].label,
                  count: statusCount[key],
                  dot: MONITOR_STATUS[key].meter,
                  activeClassName: MONITOR_STATUS[key].badge,
                })),
                {
                  key: "fast-no-po",
                  label: "Fast Moving tanpa PO",
                  count: viewRows.filter((item) => item.fastNoPo).length,
                  dot: "bg-violet-500",
                  activeClassName:
                    "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30",
                },
              ]}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>
              Menampilkan{" "}
              <strong className="tabular-nums text-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, shownRows.length)}
              </strong>{" "}
              dari {shownRows.length.toLocaleString("id-ID")} PLU
              {shownRows.length !== viewRows.length
                ? ` (total ${viewRows.length.toLocaleString("id-ID")})`
                : ""}
            </span>
            {isFiltered ? (
              <button
                type="button"
                onClick={() => {
                  setFilterKey("");
                  setDivFilter("");
                  setSearchTerm("");
                  setPage(1);
                }}
                className="cursor-pointer rounded-full border border-border/60 px-2 py-0.5 font-medium text-foreground hover:bg-muted">
                Reset filter
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-sm sm:grid-cols-2 xl:w-48 xl:grid-cols-1">
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoInputPb}
              title="Isi semua Qty PB dengan nilai Saran PB (PLU yang tampil)"
              className="h-9 w-full gap-1.5 border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold text-white shadow-sm shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 focus-visible:ring-amber-400/50">
              <Wand2 aria-hidden />
              Auto Input PB
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetPb}
              title="Kosongkan semua Qty PB"
              className="h-9 w-full gap-1.5 border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600 shadow-sm hover:bg-rose-100 hover:text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20">
              <Eraser aria-hidden />
              Reset Input PB
            </Button>
          </div>

          <div className="w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportDraftPb}
              disabled={!Object.values(pbQty).some((qty) => Number(qty) > 0)}
              title="Ekspor CSV PLU dengan Qty PB terisi"
              className="h-9 w-full gap-1.5 border-transparent bg-gradient-to-r from-sky-500 to-cyan-500 text-xs font-semibold text-white shadow-sm shadow-sky-500/20 hover:from-sky-600 hover:to-cyan-600 focus-visible:ring-sky-400/50">
              <Download aria-hidden />
              Export Draft PB
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={minOrderWarnings.length > 0}
        onOpenChange={function closeMinimumOrderWarning(open) {
          if (!open) setMinOrderWarnings([]);
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qty PB di bawah minimum order</DialogTitle>
            <DialogDescription>
              {minOrderWarnings.length} PLU memiliki Qty PB lebih kecil dari
              minimum order. Sesuaikan sebelum ekspor draft PB.
            </DialogDescription>
          </DialogHeader>

          <ul className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2 text-sm">
            {minOrderWarnings.map((row) => (
              <li
                key={row.plu}
                className="flex items-center justify-between gap-3 rounded px-2 py-1.5 odd:bg-muted/50">
                <div className="min-w-0">
                  <span className="font-mono text-xs">#{row.plu}</span>
                  <p className="truncate text-xs text-muted-foreground" title={row.nama_barang}>
                    {row.nama_barang}
                  </p>
                </div>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {Number(pbQty[String(row.plu)]).toLocaleString("id-ID")} /{" "}
                  {Number(row.minorder).toLocaleString("id-ID")} pcs
                </span>
              </li>
            ))}
          </ul>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={function closeMinimumOrderWarning() {
                setMinOrderWarnings([]);
              }}>
              Periksa lagi
            </Button>
            <Button type="button" onClick={handleUseMinOrder}>
              Isi sesuai min. order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Daftar produk */}
      {loading ? (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-card p-10 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" aria-hidden />
          Memuat data...
        </div>
      ) : error ? (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </div>
      ) : shownRows.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border/60 bg-card p-10 text-center">
          <Package className="size-8 text-muted-foreground/40" aria-hidden />
          <p className="text-sm font-medium">Tidak ada PLU yang cocok</p>
          <p className="text-xs text-muted-foreground">
            Ubah kata kunci, divisi, atau status filter.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {pageRows.map((item, idx) => {
            const {
              row,
              stock,
              po,
              pkm,
              deficit,
              status,
              saranPcs,
              salesPerDay,
              coverage,
            } = item;
            const plu = String(row.plu);

            return (
              <ProductMonitorCard
                key={plu}
                rank={(currentPage - 1) * PAGE_SIZE + idx + 1}
                plu={plu}
                divLabel={`${row.div} · ${row.nama_div}`}
                name={String(row.nama_barang)}
                tag={row.tag}
                supplier={row.nama_supplier}
                monitoring={row.mpl_namamonitoring}
                status={status}
                coverage={coverage}
                metrics={[
                  { label: "Stok", value: stock.toLocaleString("id-ID") },
                  { label: "PO jalan", value: po.toLocaleString("id-ID") },
                  { label: "PKM", value: pkm.toLocaleString("id-ID") },
                  {
                    label: deficit < 0 ? "Defisit" : "Surplus",
                    value: Math.abs(deficit).toLocaleString("id-ID"),
                    tone:
                      deficit < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    label: "Sales/hari",
                    value: salesPerDay.toLocaleString("id-ID"),
                  },
                  { label: "DSI", value: `${Number(row.dsi) || 0} hr` },
                ]}
                actions={
                  <>
                    {saranPcs > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPbQty((prev) => ({
                            ...prev,
                            [plu]: String(saranPcs),
                          }))
                        }
                        title="Isi Qty PB dengan saran"
                        className="h-auto flex-col items-start gap-0 border-amber-300 bg-amber-50 px-2 py-1 text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20">
                        <span className="text-[9px] font-medium uppercase tracking-wide opacity-80">
                          Saran PB
                        </span>
                        <span className="text-[11px] font-bold leading-tight tabular-nums">
                          {saranPcs.toLocaleString("id-ID")} pcs
                        </span>
                      </Button>
                    ) : (
                      <p className="hidden text-[10px] text-muted-foreground lg:block lg:text-center">
                        Stok + PO sudah cukup
                      </p>
                    )}

                    <div className="w-full">
                      <label className="flex w-full items-center gap-1.5">
                        <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                          Qty PB
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={pbQty[plu] ?? ""}
                          onChange={(e) =>
                            setPbQty((prev) => ({
                              ...prev,
                              [plu]: e.target.value,
                            }))
                          }
                          placeholder="0"
                          className="h-7 w-full min-w-0 rounded-md border border-input bg-background px-1.5 text-[11px] tabular-nums shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      <p className="mt-0.5 text-[9px] text-muted-foreground">
                        Min order{" "}
                        <strong className="tabular-nums text-foreground">
                          {Number(row.minorder)
                            ? Number(row.minorder).toLocaleString("id-ID")
                            : "-"}
                        </strong>
                      </p>
                    </div>
                  </>
                }
              />
            );
          })}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </Layout>
  );
}
