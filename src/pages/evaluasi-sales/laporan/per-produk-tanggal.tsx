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
  perProdukTanggalColumns,
  PerProdukTanggalRows,
} from "@/configs/evaluasi-sales/per-produk-tanggal-config";

const PerProdukTanggalPage = () => {
  const config = buildReport<PerProdukTanggalRows>(perProdukTanggalColumns);
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
  } = useReportPage<PerProdukTanggalRows>({
    basePath: "evaluasi-sales",
    reportType: "per-produk-tanggal",
    ...config,
  });

  // State for modal
  // Use a more specific type for selectedRow
  const [selectedRow, setSelectedRow] = useState<PerProdukTanggalRows | null>(
    null,
  );
  const [showStrukModal, setShowStrukModal] = useState(false);

  const handleOpenStrukModal = (row: PerProdukTanggalRows) => {
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
                keyField="plu"
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
            )}

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
              prdcd={selectedRow?.plu}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerProdukTanggalPage;
