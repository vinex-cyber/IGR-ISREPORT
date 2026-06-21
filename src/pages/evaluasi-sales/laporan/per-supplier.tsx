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
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import { buildReport } from "@/utils/reportBuilder";
import {
  perSupplierColumns,
  PerSupplierRows,
} from "@/configs/evaluasi-sales/per-supplier-config";

const PerSupplierPage = () => {
  const config = buildReport<PerSupplierRows>(perSupplierColumns);
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
  } = useReportPage<PerSupplierRows>({
    basePath: "evaluasi-sales",
    reportType: "per-supplier",
    ...config,
  });

  // State for modal
  // Use a more specific type for selectedRow
  const [selectedRow, setSelectedRow] = useState<PerSupplierRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);

  const handleOpenProdukModal = (row: PerSupplierRows) => {
    setSelectedRow(row);
    setShowProdukModal(true);
  };

  const handleOpenStrukModal = (row: PerSupplierRows) => {
    setSelectedRow(row);
    setShowStrukModal(true);
  };

  const actionsRows = [
    {
      label: "Produk",
      onClick: handleOpenProdukModal,
      icon: <ReceiptText size={16} />,
    },
    {
      label: "Struk",
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
                keyField="kode_supplier"
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
                          Supplier: {row.kode_supplier}
                        </span>
                        <br />
                        {row.kode_supplier} - {row.nama_supplier}
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
              kode_supplier={selectedRow?.kode_supplier || ""}
            />

            {/* Modal Struk */}
            <StrukModal
              show={showStrukModal}
              onClose={() => setShowStrukModal(false)}
              startDate={query.startDate as string}
              endDate={query.endDate as string}
              strukSupplier={selectedRow?.kode_supplier || ""}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerSupplierPage;
