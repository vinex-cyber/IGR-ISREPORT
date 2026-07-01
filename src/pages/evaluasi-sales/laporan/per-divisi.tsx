// pages/evaluasi-sales/laporan/per-divisi.tsx
import { useState } from "react";
// components
import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import { useReportPage } from "@/hooks/useReportPage";
import { ReportTable } from "@/components/table/ReportTable";
import ProdukTanggalModal from "@/components/modal/evaluasi-sales/ProdukTanggalModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import LoadingIgr from "@/components/LoadingIgr";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import {
  perDivisiColumns,
  PerDivisiRows,
} from "@/configs/evaluasi-sales/per-divisi-config";
import { buildReport } from "@/utils/reportBuilder";

const PerDivisiPage = () => {
  const config = buildReport<PerDivisiRows>(perDivisiColumns);
  const {
    query,
    isExporting,
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
  } = useReportPage<PerDivisiRows>({
    basePath: "evaluasi-sales",
    reportType: "per-divisi",
    ...config,
  });

  const [selectedRow, setSelectedRow] = useState<PerDivisiRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);
  const [showProdukTanggalModal, setShowProdukTanggalModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);

  const handleOpenProdukTanggalModal = (row: PerDivisiRows) => {
    setSelectedRow(row);
    setShowProdukTanggalModal(true);
  };

  const handleOpenStrukModal = (row: PerDivisiRows) => {
    setSelectedRow(row);
    setShowStrukModal(true);
  };

  const handleOpenProdukModal = (row: PerDivisiRows) => {
    setSelectedRow(row);
    setShowProdukModal(true);
  };

  const actionsRows = [
    {
      label: "Produk Per Tanggal",
      onClick: handleOpenProdukTanggalModal,
      icon: <PackageSearch size={16} />,
    },
    {
      label: "Produk",
      onClick: handleOpenProdukModal,
      icon: <ReceiptText size={16} />,
    },
    {
      label: "Struk",
      onClick: handleOpenStrukModal,
      icon: <FileText size={16} />,
    },
  ];

  return (
    <Layout title={title} branch={query.branch}>
      <section className="space-y-2 p-2">
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
                keyField={(row) => `${row.div}-${row.nama_div}`}
                showRowNumber={true}
                isRefreshing={isRefreshing}
                headerGroups={config.headerGroups}
                // search
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchReset={() => setSearchTerm("")}
                renderActions={(row) => (
                  <RowDropdownMenu
                    label={`${row.div} - ${row.nama_div}`}
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

            {/* Modal Produk Per Tanggal */}
            <ProdukTanggalModal
              show={showProdukTanggalModal}
              onClose={() => setShowProdukTanggalModal(false)}
              startDate={query.startDate as string}
              endDate={query.endDate as string}
              div={selectedRow?.div}
              branch={query.branch as string}
            />

            <ProdukModal
              show={showProdukModal}
              onClose={() => setShowProdukModal(false)}
              startDate={query.startDate as string}
              endDate={query.endDate as string}
              div={selectedRow?.div}
              branch={query.branch as string}
            />

            {/* Modal Struk */}
            <StrukModal
              show={showStrukModal}
              onClose={() => setShowStrukModal(false)}
              startDate={query.startDate as string}
              endDate={query.endDate as string}
              div={selectedRow?.div}
              branch={query.branch as string}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerDivisiPage;
