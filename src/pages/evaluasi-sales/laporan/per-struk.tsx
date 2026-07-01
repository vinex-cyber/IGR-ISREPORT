// src/pages/evaluasi-sales/laporan/per-struk.tsx
import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { ReceiptText } from "lucide-react";
import { buildReport } from "@/utils/reportBuilder";
import {
  perStrukColumns,
  PerStrukRows,
} from "@/configs/evaluasi-sales/per-struk-config";
import StrukViewModal from "@/components/modal/ViewStrukModal";

const PerProdukPage = () => {
  const config = buildReport<PerStrukRows>(perStrukColumns);

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
    // page,
    // setPage,
    // limit,
    // setLimit,
    // total,
    // totalPages,
    isExporting,
  } = useReportPage<PerStrukRows>({
    basePath: "evaluasi-sales",
    reportType: "per-struk",
    paginated: true, // ← aktifkan pagination
    defaultLimit: 100, // ← default 100 data per halaman
    ...config,
  });
  // State for modal
  // Use a more specific type for selectedRow
  const [selectedRow, setSelectedRow] = useState<PerStrukRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);

  const handleOpenProdukModal = (row: PerStrukRows) => {
    setSelectedRow(row);
    setShowProdukModal(true);
  };

  const handleOpenStrukModal = (row: PerStrukRows) => {
    setSelectedRow(row);
    setShowStrukModal(true);
  };

  const handleCloseStrukModal = () => {
    setShowStrukModal(false);
  };

  const actionsRows = [
    {
      label: "Produk",
      onClick: handleOpenProdukModal,
      icon: <ReceiptText size={16} />,
    },

    {
      label: "View Struk",
      onClick: handleOpenStrukModal,
      icon: <ReceiptText size={16} />,
    },
  ];

  return (
    <Layout title={title} branch={query.branch}>
      <section className="space-y-4 p-4">
        {loading && !isRefreshing ? (
          <LoadingIgr />
        ) : (
          <>
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
              <ReportTable
                columns={config.tableColumns}
                data={filteredData}
                totalRow={totalRow}
                keyField="struk"
                showRowNumber={true}
                textHeader="sm"
                textFooter="sm"
                textBody="xs"
                isRefreshing={isRefreshing}
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

            {/* Modal detail */}
            <ProdukModal
              show={showProdukModal}
              onClose={() => setShowProdukModal(false)}
              startDate={query.startDate as string}
              endDate={query.endDate as string}
              struk={selectedRow?.struk || ""}
              branch={query.branch as string}
            />

            <StrukViewModal
              branch={query.branch as string}
              show={showStrukModal}
              onClose={handleCloseStrukModal}
              tanggal={selectedRow?.tanggal ?? ""}
              station={selectedRow?.station ?? ""}
              kasir={selectedRow?.kasir ?? ""}
              struk={selectedRow?.struk ?? ""}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerProdukPage;
