// components/ReportHeader.tsx
import { useRouter } from "next/router";

import ButtonExportExcel from "./ButtonExportExcel";
import ButtonRefresh from "./ButtonRefresh";
import { Button } from "./ui/button";

interface ReportHeaderProps {
  title: string;
  periode: string;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isExporting?: boolean;
}

const ReportHeader = ({
  title,
  periode,
  onExport,
  onRefresh,
  isRefreshing,
  isExporting = false,
}: ReportHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-green-600">
          📊 Laporan {title}
        </h1>

        <p>{periode}</p>

        <Button
          variant="outline"
          size="sm"
          className="hover:cursor-pointer"
          onClick={() => router.back()}>
          ← Kembali
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <ButtonExportExcel handleExport={onExport} isExporting={isExporting} />

        <ButtonRefresh
          disabled={isRefreshing}
          onClick={onRefresh}
          isRefreshing={isRefreshing}
        />
      </div>
    </div>
  );
};

export default ReportHeader;
