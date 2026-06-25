import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";
import { FileText, ReceiptText } from "lucide-react";
import RowDropdownMenu from "@/components/RowDropdownMenu";

import {
  PerBulanRows,
  perBulanColumns,
} from "@/configs/evaluasi-sales/per-bulan-config";
import { buildReport } from "@/utils/reportBuilder";

const PerBulanPage = () => {
  const config = buildReport<PerBulanRows>(perBulanColumns);
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
  } = useReportPage<PerBulanRows>({
    basePath: "evaluasi-sales",
    reportType: "per-bulan",
    ...config,
  });

  const [selectedRow, setSelectedRow] = useState<PerBulanRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);

  const getMonthRange = (
    monthYear?: string,
  ): { startDate: string; endDate: string } => {
    if (!monthYear) {
      return { startDate: "", endDate: "" };
    }

    const [monthStr, yearStr] = monthYear.split("-");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year)) {
      return { startDate: "", endDate: "" };
    }

    const startDate = new Date(year, month - 1, 1); // awal bulan
    const endDate = new Date(year, month, 0); // akhir bulan

    const formatLocalDate = (date: Date): string => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    return {
      startDate: formatLocalDate(startDate),
      endDate: formatLocalDate(endDate),
    };
  };

  const monthRange = getMonthRange(selectedRow?.bulan);

  const handleOpenStrukModal = (row: PerBulanRows) => {
    setSelectedRow(row);
    setShowStrukModal(true);
  };

  const handleOpenProdukModal = (row: PerBulanRows) => {
    setSelectedRow(row);
    setShowProdukModal(true);
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
            />

            <div className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="text-sm h-8 bg-red-400 hover:bg-red-500 text-white shadow hover:cursor-pointer">
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
                keyField="bulan"
                showRowNumber={true}
                isRefreshing={isRefreshing}
                textHeader="sm"
                textFooter="sm"
                headerGroups={config.headerGroups}
                renderActions={(row) => (
                  <RowDropdownMenu
                    label={`Tgl: ${row.bulan}`}
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

            {/* Modal Produk */}
            <ProdukModal
              show={showProdukModal && !!selectedRow}
              onClose={() => setShowProdukModal(false)}
              startDate={monthRange.startDate}
              endDate={monthRange.endDate}
              branch={query.branch as string}
            />

            {/* Modal Struk */}
            <StrukModal
              show={showStrukModal && !!selectedRow}
              onClose={() => setShowStrukModal(false)}
              startDate={monthRange.startDate}
              endDate={monthRange.endDate}
              branch={query.branch as string}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerBulanPage;
