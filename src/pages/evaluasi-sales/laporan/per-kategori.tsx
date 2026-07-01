// pages/evaluasi-sales/laporan/per-kategori.tsx
import Layout from "@/components/Layout";
import LoadingIgr from "@/components/LoadingIgr";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import ProdukTanggalModal from "@/components/modal/evaluasi-sales/ProdukTanggalModal";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import ReportHeader from "@/components/ReportHeader";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { ReportTable } from "@/components/table/ReportTable";
import {
  perKategoriColumns,
  PerKategoriRows,
} from "@/configs/evaluasi-sales/per-kategori-config";
import { useReportPage } from "@/hooks/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import { useState } from "react";

const PerKategoriPage = () => {
  const config = buildReport<PerKategoriRows>(perKategoriColumns);
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
    isExporting,
    handleRefresh,
  } = useReportPage<PerKategoriRows>({
    basePath: "evaluasi-sales",
    reportType: "per-kategori",
    ...config,
  });

  const [selectedRow, setSelectedRow] = useState<PerKategoriRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);
  const [showProdukTanggalModal, setShowProdukTanggalModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);

  const handleOpenProdukTanggalModal = (row: PerKategoriRows) => {
    setSelectedRow(row);
    setShowProdukTanggalModal(true);
  };

  const handleOpenStrukModal = (row: PerKategoriRows) => {
    setSelectedRow(row);
    setShowStrukModal(true);
  };

  const handleOpenProdukModal = (row: PerKategoriRows) => {
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
                keyField={(row) => `${row.div}-${row.dept}-${row.kategori}`}
                showRowNumber={true}
                isRefreshing={isRefreshing}
                headerGroups={config.headerGroups}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchReset={() => setSearchTerm("")}
                renderActions={(row) => (
                  <RowDropdownMenu
                    label={
                      <div>
                        <span className="text-xs text-gray-500">
                          Div: {row.div} - Dept: {row.dept}
                        </span>
                        <br />
                        {row.kategori} - {row.nama_kategori}
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

            {/* Modal Produk Per Tanggal */}
            <ProdukTanggalModal
              branch={query.branch as string}
              show={showProdukTanggalModal}
              onClose={() => setShowProdukTanggalModal(false)}
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
            />
            {/* Modal Produk */}
            <ProdukModal
              branch={query.branch as string}
              show={showProdukModal}
              onClose={() => setShowProdukModal(false)}
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
            />

            {/* Modal Struk */}
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
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerKategoriPage;
