// src/pages/promo-mendatang/index.tsx
import Layout from "@/components/Layout";
import LoadingIgr from "@/components/LoadingIgr";
import ReportHeader from "@/components/ReportHeader";
import { ReportTable } from "@/components/table/ReportTable";
import {
  promoMendatangColumns,
  PromoMendatangRows,
} from "@/configs/informasi-promosi/promo-mendatang-config";
import { useReportPage } from "@/hooks/report/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import { getBranchCookie } from "@/utils/branchCookie";

const PromoMendatangPage = () => {
  const branch = getBranchCookie();

  const config = buildReport<PromoMendatangRows>(promoMendatangColumns);
  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    loading,
    error,
    handleExport,
    isRefreshing,
    isExporting,
    handleRefresh,
  } = useReportPage<PromoMendatangRows>({
    endpoint: "informasi-promosi/data-promo-mendatang",
    reportTitle: "Promo Mendatang",
    paginated: false,
    ...config,
  });

  return (
    <Layout title="Promo Mendatang" branch={branch}>
      <section className="space-y-2 p-2">
        {loading && !isRefreshing ? (
          <LoadingIgr />
        ) : (
          <>
            <ReportHeader
              title="Promo Mendatang"
              periode=""
              onExport={handleExport}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              isExporting={isExporting}
            />

            {error && <p className="text-red-500">{error}</p>}

            {!error && filteredData && (
              <ReportTable
                columns={promoMendatangColumns}
                data={filteredData}
                keyField={(row) => `${row.kd_promo}-${row.plu_promo}`}
                isRefreshing={isRefreshing}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchReset={() => setSearchTerm("")}
                textBody="xxs"
                textHeader="xs"
              />
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default PromoMendatangPage;
