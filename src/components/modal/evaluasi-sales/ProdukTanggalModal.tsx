import Modal from "@/components/modal";
import SearchInput from "@/components/SearchInput";
import { useEffect, useMemo } from "react";
import { FormatTanggal } from "@/utils/formatTanggal";
import { buildReport } from "@/utils/reportBuilder";
import {
  perProdukTanggalColumns,
  PerProdukTanggalRows,
} from "@/configs/evaluasi-sales/per-produk-tanggal-config";
import { useReportPage } from "@/hooks/useReportPage";
import { ReportTable } from "@/components/table/ReportTable";
import SkeletonTable from "@/components/SkletonTable";

interface Props {
  show: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  div?: string;
  dept?: string;
  kat?: string;
  prdcd?: string;
  branch: string;
}

export default function ProdukTanggalModal({
  show,
  onClose,
  startDate,
  endDate,
  div,
  dept,
  kat,
  prdcd,
  branch,
}: Props) {
  const config = buildReport<PerProdukTanggalRows>(perProdukTanggalColumns);

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
    }),
    [startDate, endDate, div, dept, kat, prdcd, branch],
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
  } = useReportPage<PerProdukTanggalRows>({
    basePath: "evaluasi-sales", // tetap wajib (dipakai hook internal)
    ...config,
    customFetch: {
      endpoint: "evaluasi-sales/per-produk-tanggal",
      queryParams,
      enabled: show,
    },
  });

  useEffect(function resetSearchOnClose() {
    if (!show) {
      setSearchTerm("");
    }
  }, [show, setSearchTerm]);

  const dataClean = filteredData as PerProdukTanggalRows[];

  return (
    <Modal show={show} onClose={onClose}>
      {loading ? (
        <SkeletonTable rows={5} columns={config.tableColumns.length} />
      ) : (
        <div className="space-y-4 max-h-[90vh]">
          <div className="flex justify-between items-center my-2">
            <div>
              <h1 className="text-2xl font-bold text-green-600">
                Detail Produk Per Tanggal - {branch}
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

          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Cari Produk..."
          />

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <ReportTable
              columns={config.tableColumns}
              data={dataClean}
              totalRow={totalRow}
              keyField={(row) =>
                `${row.tanggal}${row.div}${row.dept}${row.kategori}${row.plu}`
              }
              headerGroups={config.headerGroups}
            />
          )}
        </div>
      )}
    </Modal>
  );
}
