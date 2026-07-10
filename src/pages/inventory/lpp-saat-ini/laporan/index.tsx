import { useRouter } from "next/router";
import { useMemo } from "react";
import Layout from "@/components/Layout";
import LoadingIgr from "@/components/LoadingIgr";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/report/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import { perDivisiColumns } from "@/configs/lpp-saat-ini/per-divisi-config";
import { perDepartementColumns } from "@/configs/lpp-saat-ini/per-departement-config";
import { perKategoryColumns } from "@/configs/lpp-saat-ini/per-kategory-config";
import { perProdukColumns } from "@/configs/lpp-saat-ini/per-produk-config";

const LppSaatIniLaporanPage = () => {
  const router = useRouter();
  const report =
    typeof router.query.selectedReport === "string"
      ? router.query.selectedReport
      : "per-divisi";

  const config = useMemo(() => {
    switch (report) {
      case "per-departement":
        return buildReport(perDepartementColumns);
      case "per-kategory":
        return buildReport(perKategoryColumns);
      case "per-produk":
        return buildReport(perProdukColumns);
      default:
        return buildReport(perDivisiColumns);
    }
  }, [report]);

  const {
    query,
    searchTerm,
    setSearchTerm,
    filteredData,
    loading,
    error,
    title,
    periode,
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
    basePath: "inventory/lpp-saat-ini",
    reportType: report,
    paginated: true,
    ...config,
  });

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
                keyField={(row) =>
                  `${(row as Record<string, unknown>).st_prdcd ?? (row as Record<string, unknown>).st_div}`
                }
                showRowNumber
                isRefreshing={isRefreshing}
                headerGroups={config.headerGroups}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchReset={() => setSearchTerm("")}
                page={page}
                limit={limit}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default LppSaatIniLaporanPage;
