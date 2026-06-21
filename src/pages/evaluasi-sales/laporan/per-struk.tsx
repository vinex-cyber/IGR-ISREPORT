import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  } = useReportPage<PerStrukRows>({
    basePath: "evaluasi-sales",
    reportType: "per-struk",
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
    <Layout title={title}>
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
            />

            <div className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="text-sm h-8 bg-red-400 dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-black hover:bg-red-500 text-white shadow-2xl hover:cursor-pointer">
                Reset
              </Button>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Cari..."
              />
            </div>

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
