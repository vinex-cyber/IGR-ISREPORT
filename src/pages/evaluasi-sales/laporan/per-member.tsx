// pages/per-member.tsx

import Layout from "@/components/Layout";
import ReportHeader from "@/components/ReportHeader";
import SearchInput from "@/components/SearchInput";
import { ReportTable } from "@/components/table/ReportTable";
import { useReportPage } from "@/hooks/useReportPage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import LoadingIgr from "@/components/LoadingIgr";
import RowDropdownMenu from "@/components/RowDropdownMenu";
import { ReceiptText } from "lucide-react";

import { buildReport } from "@/utils/reportBuilder";
import {
  perMemberColumns,
  MemberRows,
} from "@/configs/evaluasi-sales/per-member-config";

const PerMemberPage = () => {
  // 🔥 semua config auto dari sini
  const config = buildReport<MemberRows>(perMemberColumns);

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
  } = useReportPage<MemberRows>({
    basePath: "evaluasi-sales",
    reportType: "per-member",
    ...config,
  });

  const [selectedRow, setSelectedRow] = useState<MemberRows | null>(null);
  const [showProdukModal, setShowProdukModal] = useState(false);

  const handleOpenProdukModal = (row: MemberRows) => {
    setSelectedRow(row);
    setShowProdukModal(true);
  };
  const handleReset = () => setSearchTerm("");

  return (
    <Layout title={title}>
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
                onClick={handleReset}
                className="text-sm h-8 bg-red-400 hover:bg-red-500 text-white">
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
                keyField={(row) => `${row.kd_member}-${row.outlet}`}
                showRowNumber={true}
                textHeader="sm"
                textFooter="sm"
                textBody="xs"
                isRefreshing={isRefreshing}
                headerGroups={config.headerGroups}
                renderActions={(row) => (
                  <RowDropdownMenu
                    label={
                      <div>
                        <span className="text-xs text-gray-500">
                          Kode: {row.kd_member}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          Nama: {row.nama_member}
                        </span>
                      </div>
                    }
                    actions={[
                      {
                        label: "Produk",
                        onClick: () => handleOpenProdukModal(row),
                        icon: <ReceiptText size={16} />,
                      },
                    ]}
                  />
                )}
              />
            )}

            <ProdukModal
              branch={query.branch as string}
              show={showProdukModal && !!selectedRow}
              onClose={() => setShowProdukModal(false)}
              startDate={query.startDate as string}
              endDate={query.endDate as string}
              noMember={selectedRow?.kd_member || ""}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default PerMemberPage;
