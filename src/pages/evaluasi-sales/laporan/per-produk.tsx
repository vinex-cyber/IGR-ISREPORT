// src/pages/evaluasi-sales/per-produk.tsx

import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import LoadingIgr from "@/components/LoadingIgr";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { FileText } from "lucide-react";
import { buildReport } from "@/utils/reportBuilder";
import {
  perProdukColumns,
  PerProdukRows,
} from "@/configs/evaluasi-sales/per-produk-config";

// ============================================================
// Page
// ============================================================
const PerProdukPage = () => {
  const config = buildReport<PerProdukRows>(perProdukColumns);

  const {
    query,
    searchTerm,
    setSearchTerm,
    filteredData,
    loading,
    error,
    title,
    periode,
    totalRow,
    handleExport,
    isRefreshing,
    handleRefresh,
    // ── Tambahan pagination ──
    // page,
    // setPage,
    // limit,
    // setLimit,
    // total,
    // totalPages,
    isExporting,
  } = useReportPage<PerProdukRows>({
    basePath: "evaluasi-sales",
    reportType: "per-produk",
    // paginated: true, // ← aktifkan pagination
    // defaultLimit: 100, // ← default 100 data per halaman
    ...config,
  });

  // ── Modal state ─────────────────────────────────────────────
  const [selectedRow, setSelectedRow] = useState<PerProdukRows | null>(null);
  const [showStrukModal, setShowStrukModal] = useState(false);

  const handleOpenStrukModal = (row: PerProdukRows) => {
    setSelectedRow(row);
    setShowStrukModal(true);
  };

  const actionsRows = [
    {
      label: "Struk",
      onClick: handleOpenStrukModal,
      icon: <FileText size={16} />,
    },
  ];

  // ── Handler limit ────────────────────────────────────────────

  return (
    <Layout title={title} branch={query.branch}>
      <section className="space-y-4 p-4">
        {loading && !isRefreshing ? (
          <LoadingIgr />
        ) : (
          <>
            {/* ── Header ─────────────────────────────────────── */}
            <ReportHeader
              title={title}
              periode={periode}
              onExport={handleExport}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              isExporting={isExporting}
            />

            {error && <p className="text-red-500">{error}</p>}

            {!error && filteredData && (
              <>
                {/* ── Tabel ──────────────────────────────────── */}
                <ReportTable
                  columns={config.tableColumns}
                  data={filteredData}
                  totalRow={totalRow}
                  keyField="plu"
                  isRefreshing={isRefreshing}
                  showRowNumber={true}
                  headerGroups={config.headerGroups}
                  // search
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onSearchReset={() => setSearchTerm("")}
                  // pagination
                  // page={page}
                  // limit={limit}
                  // total={total}
                  // totalPages={totalPages}
                  // onPageChange={setPage}
                  // onLimitChange={(val) => {
                  //   setLimit(val);
                  //   setPage(1);
                  // }}
                  renderActions={(row) => (
                    <RowDropdownMenu
                      label={
                        <div>
                          <span className="text-xs text-gray-500">
                            Div: {row.div} - Dept: {row.dept} - Kat:{" "}
                            {row.kategori}
                          </span>
                          <br />
                          {row.plu} - {row.nama_produk}
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
              </>
            )}

            {/* ── Modal Struk ────────────────────────────────── */}
            <StrukModal
              branch={query.branch as string}
              show={showStrukModal}
              onClose={() => setShowStrukModal(false)}
              startDate={query.startDate as string}
              endDate={query.endDate as string}
              div={selectedRow?.div as string}
              dept={
                ((selectedRow?.div as string) + selectedRow?.dept) as string
              }
              kat={
                ((selectedRow?.dept as string) +
                  selectedRow?.kategori) as string
              }
              prdcd={selectedRow?.plu}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerProdukPage;
