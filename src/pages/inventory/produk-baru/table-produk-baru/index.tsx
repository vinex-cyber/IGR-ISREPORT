// src/pages/inventory/produk-baru/table-produk-baru/index.tsx
import Layout from "@/components/Layout";
import LoadingIgr from "@/components/LoadingIgr";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import {
  ProdukBaruRows,
  produkBaruColumns,
} from "@/configs/produk-baru/produk-baru-config";
import { useReportPage } from "@/hooks/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import { getBranchCookie } from "@/utils/branchCookie";

const ProdukBaruPage = () => {
  const branch = getBranchCookie();
  const reportTitle = branch ? `Produk Baru - ${branch}` : "Produk Baru";

  const config = buildReport<ProdukBaruRows>(produkBaruColumns);
  const {
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
  } = useReportPage<ProdukBaruRows>({
    endpoint: "inventory/produk-baru",
    reportTitle,
    paginated: true,
    ...config,
  });

  return (
    <Layout title={title} branch={branch}>
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
                columns={produkBaruColumns}
                data={filteredData}
                keyField={(row) => row.plu}
                showRowNumber
                isRefreshing={isRefreshing}
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

export default ProdukBaruPage;
