// src/pages/evaluasi-sales/laporan/[reportType].tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { getBranchCookie } from "@/utils/branchCookie";
import LoadingIgr from "@/components/LoadingIgr";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import LaporanModals from "@/components/evaluasi-sales/LaporanModals";
import { useReportPage } from "@/hooks/report/useReportPage";
import { buildReport } from "@/utils/reportBuilder";

import {
  REPORT_CONFIG,
  type ModalType,
  type ActionItem,
} from "@/configs/evaluasi-sales/laporan";

const LaporanPage = () => {
  const router = useRouter();
  const reportType = (router.query.reportType as string) || "per-divisi";
  const reportDef = REPORT_CONFIG[reportType] || REPORT_CONFIG["per-divisi"];

  const config = buildReport(reportDef.columns);

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
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
  } = useReportPage({
    basePath: "evaluasi-sales",
    reportType,
    paginated: reportDef.paginated,
    defaultLimit: reportDef.defaultLimit,
    ...config,
  });

  const branch = getBranchCookie();

  const [selectedRow, setSelectedRow] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRow(null);
  };

  return (
    <Layout title={title} branch={branch}>
      <section className={reportDef.sectionClass || "space-y-4 p-4"}>
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
                keyField={reportDef.keyField}
                showRowNumber
                isRefreshing={isRefreshing}
                headerGroups={config.headerGroups}
                textHeaderGroup="xs"
                textHeader="xs"
                textBody="xxs"
                textFooter="xs"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchReset={() => setSearchTerm("")}
                page={page}
                limit={limit}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                onLimitChange={setLimit}
                renderActions={(r) => (
                  <RowDropdownMenu
                    label={reportDef.rowLabel(r)}
                    triggerIconOnly={false}
                    actions={reportDef.actions.map((a: ActionItem) => ({
                      label: a.label,
                      onClick: () => {
                        setSelectedRow(r);
                        setActiveModal(a.modal);
                      },
                      icon: a.icon,
                    }))}
                  />
                )}
              />
            )}

            <LaporanModals
              reportType={reportType}
              activeModal={activeModal}
              row={selectedRow}
              query={query}
              branch={branch}
              onClose={closeModal}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default LaporanPage;
