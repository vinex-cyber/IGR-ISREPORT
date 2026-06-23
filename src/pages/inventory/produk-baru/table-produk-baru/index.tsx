import Layout from "@/components/Layout";
import LoadingIgr from "@/components/LoadingIgr";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { Button } from "@/components/ui/button";
import {
  ProdukBaruRows,
  produkBaruColumns,
} from "@/configs/produk-baru/produk-baru-config";
import { useReportPage } from "@/hooks/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import { useRouter } from "next/router";

const ProdukBaruPage = () => {
  const router = useRouter();

  const branchQuery = router.query.branch;

  const branch =
    typeof branchQuery === "string"
      ? branchQuery
      : Array.isArray(branchQuery)
        ? branchQuery[0]
        : "";

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
    handleRefresh,
  } = useReportPage<ProdukBaruRows>({
    endpoint: "inventory/produk-baru",
    reportTitle,
    ...config,
  });

  return (
    <Layout title={title}>
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
                placeholder="Search..."
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {!error && filteredData && (
              <ReportTable
                columns={produkBaruColumns}
                data={filteredData}
                keyField={(row) => row.plu}
                showRowNumber
                isRefreshing={isRefreshing}
              />
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default ProdukBaruPage;
