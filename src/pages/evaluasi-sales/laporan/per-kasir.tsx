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
import {
  PerKasirRows,
  perKasirColumns,
} from "@/configs/evaluasi-sales/per-kasir-config";
import { buildReport } from "@/utils/reportBuilder";

const PerProdukPage = () => {
  const config = buildReport<PerKasirRows>(perKasirColumns);
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
  } = useReportPage<PerKasirRows>({
    basePath: "evaluasi-sales",
    reportType: "per-kasir",
    ...config,
  });
  // State for modal
  // Use a more specific type for selectedRow
  const [selectedRow, setSelectedRow] = useState<PerKasirRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);

  const handleOpenProdukModal = (row: PerKasirRows) => {
    setSelectedRow(row);
    setShowProdukModal(true);
  };

  const actionsRows = [
    {
      label: "Produk",
      onClick: handleOpenProdukModal,
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
                keyField="kasir"
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
                          Kasir: {row.kasir}
                        </span>
                        <br />
                        {row.nama_kasir}
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
              kasir={selectedRow?.kasir || ""}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerProdukPage;
