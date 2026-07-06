import Layout from "@/components/Layout";
import LoadingIgr from "@/components/LoadingIgr";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import {
  masterLokasiColumns,
  type MasterLokasiRows,
} from "@/configs/inventory/master-lokasi/laporan-config";

const MasterLokasiLaporanPage = () => {
  const config = buildReport<MasterLokasiRows>(masterLokasiColumns);

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
    endpoint: "inventory/master-lokasi",
    paginated: true,
    reportTitle: "Master Lokasi",
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
                  `${(row as MasterLokasiRows).prd_prdcd}-${(row as MasterLokasiRows).alamat}`
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

export default MasterLokasiLaporanPage;
