import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import ProdukTanggalModal from "@/components/modal/evaluasi-sales/ProdukTanggalModal";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";
import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { buildReport } from "@/utils/reportBuilder";
import {
  perTanggalColumns,
  PerTanggalRows,
} from "@/configs/evaluasi-sales/per-tanggal-config";

const PerTanggalPage = () => {
  const config = buildReport<PerTanggalRows>(perTanggalColumns);
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
  } = useReportPage<PerTanggalRows>({
    basePath: "evaluasi-sales",
    reportType: "per-tanggal",
    ...config,
  });

  const convertToISODate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const [selectedRow, setSelectedRow] = useState<PerTanggalRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);
  const [showProdukTanggalModal, setShowProdukTanggalModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);

  const handleOpenProdukTanggalModal = (row: PerTanggalRows) => {
    setSelectedRow(row);
    setShowProdukTanggalModal(true);
  };

  const handleOpenStrukModal = (row: PerTanggalRows) => {
    setSelectedRow(row);
    setShowStrukModal(true);
  };

  const handleOpenProdukModal = (row: PerTanggalRows) => {
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
                keyField="tanggal"
                showRowNumber={true}
                isRefreshing={isRefreshing}
                textHeader="sm"
                textFooter="sm"
                headerGroups={config.headerGroups}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchReset={() => setSearchTerm("")}
                renderActions={(row) => (
                  <RowDropdownMenu
                    label={`Tgl: ${row.tanggal}`}
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
              startDate={
                selectedRow?.tanggal
                  ? convertToISODate(selectedRow.tanggal)
                  : ""
              }
              endDate={
                selectedRow?.tanggal
                  ? convertToISODate(selectedRow.tanggal)
                  : ""
              }
            />

            <ProdukModal
              branch={query.branch as string}
              show={showProdukModal}
              onClose={() => setShowProdukModal(false)}
              startDate={
                selectedRow?.tanggal
                  ? convertToISODate(selectedRow.tanggal)
                  : ""
              }
              endDate={
                selectedRow?.tanggal
                  ? convertToISODate(selectedRow.tanggal)
                  : ""
              }
            />

            {/* Modal Struk */}
            <StrukModal
              branch={query.branch as string}
              show={showStrukModal}
              onClose={() => setShowStrukModal(false)}
              startDate={
                selectedRow?.tanggal
                  ? convertToISODate(selectedRow.tanggal)
                  : ""
              }
              endDate={
                selectedRow?.tanggal
                  ? convertToISODate(selectedRow.tanggal)
                  : ""
              }
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerTanggalPage;
