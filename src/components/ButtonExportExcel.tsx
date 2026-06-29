// src/components/ButtonExportExcel.tsx
import { RiFileExcel2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonExportExcelProps {
  handleExport: () => void;
  className?: string;
  isExporting?: boolean; // ← tambah ini
}

const ButtonExportExcel = ({
  handleExport,
  className,
  isExporting = false,
}: ButtonExportExcelProps) => {
  return (
    <Button
      variant="outline"
      disabled={isExporting} // ← disable saat export
      onClick={handleExport} // ← pindah onClick ke Button, bukan span
      className={`hover:cursor-pointer ${className ? ` ${className}` : "mb-4 bg-green-400 hover:bg-green-500 dark:bg-green-400 dark:hover:bg-green-500"}`}
      size="sm">
      <span className="flex items-center gap-2">
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <RiFileExcel2Line />
            Export to Excel
          </>
        )}
      </span>
    </Button>
  );
};

export default ButtonExportExcel;
