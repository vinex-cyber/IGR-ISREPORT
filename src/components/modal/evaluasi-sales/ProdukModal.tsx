import Modal from "@/components/modal";
import SearchInput from "@/components/SearchInput";
import { useEffect, useMemo } from "react";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/report/useReportPage";
import { FormatTanggal } from "@/utils/formatTanggal";
import SkeletonTable from "@/components/SkletonTable";
import { buildReport } from "@/utils/reportBuilder";
import {
  perProdukColumns,
  PerProdukRows,
} from "@/configs/evaluasi-sales/per-produk-config";

interface Props {
  show: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  div?: string;
  dept?: string;
  kat?: string;
  prdcd?: string;
  struk?: string;
  kode_supplier?: string;
  kasir?: string;
  noMember?: string;
  branch: string;
}

export default function ProdukModal({
  show,
  onClose,
  startDate,
  endDate,
  div,
  dept,
  kat,
  prdcd,
  struk,
  kode_supplier,
  kasir,
  noMember,
  branch,
}: Props) {
  const config = buildReport<PerProdukRows>(perProdukColumns);

  // ================= QUERY PARAMS =================
  const queryParams = useMemo(
    () => ({
      startDate,
      endDate,
      branch,
      ...(div && { div }),
      ...(dept && { dept }),
      ...(kat && { kat }),
      ...(prdcd && { plu: prdcd }),
      ...(struk && { struk }),
      ...(kode_supplier && { kode_supplier }),
      ...(kasir && { kasir }),
      ...(noMember && { noMember }),
    }),
    [
      startDate,
      endDate,
      div,
      dept,
      kat,
      prdcd,
      struk,
      kode_supplier,
      kasir,
      noMember,
      branch,
    ],
  );

  // ================= USE REPORT PAGE =================
  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    loading,
    error,
    totalRow,
    handleExport,
  } = useReportPage<PerProdukRows>({
    basePath: "evaluasi-sales", // tetap wajib (dipakai hook internal)
    ...config,
    customFetch: {
      endpoint: "/evaluasi-sales/per-produk",
      queryParams,
      enabled: show, // 🔥 hanya fetch saat modal buka
    },
  });

  useEffect(function resetSearchOnClose() {
    if (!show) {
      setSearchTerm("");
    }
  }, [show, setSearchTerm]);

  const dataClean = filteredData as PerProdukRows[];
  return (
    <Modal show={show} onClose={onClose}>
      {loading ? (
        <SkeletonTable rows={10} columns={config.tableColumns.length} />
      ) : (
        <div className="space-y-4 max-h-[90vh]">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-600">
                Detail Produk - {branch}
              </h1>
              <p>
                {FormatTanggal(startDate)} s/d {FormatTanggal(endDate)}
              </p>
            </div>

            <button
              onClick={handleExport}
              className="text-sm text-blue-600 hover:underline">
              Export
            </button>
          </div>

          {/* SEARCH */}
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Cari Produk..."
          />

          {error && <p className="text-red-500">{error}</p>}

          {/* TABLE */}
          {!error && (
            <ReportTable
              columns={config.tableColumns}
              headerGroups={config.headerGroups}
              data={dataClean}
              totalRow={totalRow}
              showRowNumber={true}
              keyField={(row) =>
                `${row.div}${row.dept}${row.kategori}${row.plu}`
              }
            />
          )}
        </div>
      )}
    </Modal>
  );
}
