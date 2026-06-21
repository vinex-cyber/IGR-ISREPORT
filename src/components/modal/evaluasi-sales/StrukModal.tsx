import Modal from "@/components/modal";
import SearchInput from "@/components/SearchInput";
import { useEffect, useMemo, useState } from "react";
import { ReportTable } from "@/components/table/ReportTable";
import { FormatTanggal } from "@/utils/formatTanggal";
import SkeletonTable from "@/components/SkletonTable";
import { buildReport } from "@/utils/reportBuilder";
import {
  perStrukColumns,
  PerStrukRows,
} from "@/configs/evaluasi-sales/per-struk-config";
import { useReportPage } from "@/hooks/useReportPage";
import { ReceiptText } from "lucide-react";
import StrukViewModal from "../ViewStrukModal";
import RowDropdownMenu from "@/components/RowDropdownMenu";

interface Props {
  show: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  branch: string;
  prdcd?: string;
  div?: string;
  dept?: string;
  kat?: string;
  strukSupplier?: string;
  kasir?: string;
}

export default function StrukModal({
  show,
  onClose,
  startDate,
  endDate,
  branch,
  prdcd,
  div,
  dept,
  kat,
  strukSupplier,
  kasir,
}: Props) {
  const config = buildReport<PerStrukRows>(perStrukColumns);

  // ================= QUERY PARAMS =================
  const queryParams = useMemo(
    () => ({
      startDate,
      endDate,
      branch,
      ...(prdcd && { plu: prdcd }),
      ...(div && { div }),
      ...(dept && { dept }),
      ...(kat && { kat }),
      ...(strukSupplier && { strukSupplier }),
      ...(kasir && { kasir }),
    }),
    [startDate, endDate, prdcd, div, dept, kat, strukSupplier, branch, kasir],
  );

  // ================= USE REPORT PAGE =================
  const {
    query,
    searchTerm,
    setSearchTerm,
    filteredData,
    loading,
    error,
    totalRow,
    handleExport,
  } = useReportPage<PerStrukRows>({
    endpoint: "evaluasi-sales", // tetap wajib (dipakai hook internal)
    ...config,
    customFetch: {
      endpoint: "/evaluasi-sales/per-struk",
      queryParams,
      enabled: show, // 🔥 hanya fetch saat modal buka
    },
  });

  const [showViewStrukModal, setShowViewStrukModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PerStrukRows | null>(null);

  useEffect(() => {
    if (!show) {
      setSearchTerm("");
    }
  }, [show, setSearchTerm]);

  const dataClean = filteredData as PerStrukRows[];

  const handleOpenViewStrukModal = (row: PerStrukRows) => {
    setSelectedRow(row);
    setShowViewStrukModal(true);
  };

  const handleCloseViewStrukModal = () => {
    setShowViewStrukModal(false);
  };

  const actionsRows = [
    {
      label: "View Struk",
      onClick: handleOpenViewStrukModal,
      icon: <ReceiptText size={16} />,
    },
  ];

  return (
    <Modal show={show} onClose={onClose}>
      {loading ? (
        <SkeletonTable columns={config.tableColumns.length} rows={5} />
      ) : (
        <div className="space-y-4 max-h-[90vh]">
          <div className="flex justify-between items-center my-2">
            <div>
              <h1 className="text-2xl font-bold text-green-600">
                Detail Struk - {branch}
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
            placeholder="Cari struk..."
          />

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <ReportTable
              columns={config.tableColumns}
              data={dataClean}
              totalRow={totalRow}
              keyField="struk"
              textHeader="sm"
              textBody="sm"
              textFooter="sm"
              headerGroups={config.headerGroups}
              showRowNumber
              renderActions={(row) => (
                <RowDropdownMenu
                  label={
                    <div>
                      <span className="text-xs text-gray-500">
                        Struk: {row.struk}
                      </span>
                      <br />
                      {row.kd_member} - {row.nama_member}
                    </div>
                  }
                  triggerIconOnly={false}
                  actions={actionsRows.map((action) => ({
                    label: action.label,
                    onClick: () => action.onClick(row),
                    icon: action.icon,
                  }))}
                />
              )}
            />
          )}

          <StrukViewModal
            show={showViewStrukModal}
            onClose={handleCloseViewStrukModal}
            tanggal={selectedRow?.tanggal ?? ""}
            station={selectedRow?.station ?? ""}
            kasir={selectedRow?.kasir ?? ""}
            struk={selectedRow?.struk ?? ""}
            branch={query.branch as string}
          />
        </div>
      )}
    </Modal>
  );
}
