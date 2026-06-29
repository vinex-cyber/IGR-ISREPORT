// components/ReportHeader.tsx
import ButtonExportExcel from "./ButtonExportExcel";
import ButtonRefresh from "./ButtonRefresh";

interface ReportHeaderProps {
  title: string;
  periode: string;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isExporting?: boolean; // ← tambah ini, opsional agar laporan lama tidak error
}

const ReportHeader = ({
  title,
  periode,
  onExport,
  onRefresh,
  isRefreshing,
  isExporting = false, // ← default false
}: ReportHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold text-green-600">📊 Laporan {title}</h1>
      <p>{periode}</p>
    </div>
    <div className="flex gap-2 items-center">
      <ButtonExportExcel
        handleExport={onExport}
        isExporting={isExporting} // ← teruskan ke button
      />
      <ButtonRefresh
        disabled={isRefreshing}
        onClick={onRefresh}
        isRefreshing={isRefreshing}
      />
    </div>
  </div>
);

export default ReportHeader;
