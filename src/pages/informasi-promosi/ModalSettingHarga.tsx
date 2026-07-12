// src/pages/informasi-promosi/ModalSettingHarga.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModalSlide } from "@/hooks/animation/useModalSlide";
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";
import { Download, X } from "lucide-react";

interface SatuanJualItem {
  plu: string;
  deskripsi: string;
  satuan: string;
  acost: number;
  hrg: number;
  tag: string;
  settingHarga: number | null;
  settingMargin: string | null;
}

interface ModalSettingHargaProps {
  isOpen: boolean;
  onClose: () => void;
  product: SatuanJualItem[];
  onDelete: (pluKey: string) => void;
}

function fmtNum(n: number | string | undefined | null) {
  if (n === undefined || n === null || n === "") return "-";
  const num = typeof n === "string" ? Number(n) : n;
  if (isNaN(num)) return "-";
  return Math.round(num).toLocaleString("en-US");
}

function getCurrentDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function ModalSettingHarga({
  isOpen,
  onClose,
  product,
  onDelete,
}: ModalSettingHargaProps) {
  const [displayData, setDisplayData] = useState<SatuanJualItem[]>(product);
  const { overlayRef, contentRef, handleClose } = useModalSlide({
    isOpen,
    closeAnimation: "spin",
    openDuration: 1000,
    closeDuration: 1000,
  });

  useEffect(
    function syncDisplayData() {
      setDisplayData(product);
    },
    [product],
  );

  useEffect(
    function closeOnEscape() {
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") handleClose(onClose);
      }
      document.addEventListener("keydown", handleKeyDown);
      return function removeEventListener() {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [onClose, handleClose],
  );

  useEffect(
    function lockBodyScroll() {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      }
      return function unlockBodyScroll() {
        document.body.style.overflow = "";
      };
    },
    [isOpen],
  );

  if (!isOpen || !displayData || displayData.length === 0) return null;

  const groupedData: {
    [key: string]: {
      desk?: string;
      harga0?: number | null;
      harga1?: number | null;
      harga2?: number | null;
      harga3?: number | null;
      mrg0?: string | null;
      mrg1?: string | null;
      mrg2?: string | null;
      mrg3?: string | null;
    };
  } = {};

  displayData.forEach((item) => {
    const pluKey = item.plu.slice(0, 6);
    const lastDigit = item.plu.slice(-1);

    if (!groupedData[pluKey]) {
      groupedData[pluKey] = {};
    }

    if (!groupedData[pluKey].desk) {
      groupedData[pluKey].desk = item.deskripsi;
    }

    if (lastDigit === "0") {
      groupedData[pluKey].harga0 = item.settingHarga;
      groupedData[pluKey].mrg0 = item.settingMargin;
    } else if (lastDigit === "1") {
      groupedData[pluKey].harga1 = item.settingHarga;
      groupedData[pluKey].mrg1 = item.settingMargin;
    } else if (lastDigit === "2") {
      groupedData[pluKey].harga2 = item.settingHarga;
      groupedData[pluKey].mrg2 = item.settingMargin;
    } else if (lastDigit === "3") {
      groupedData[pluKey].harga3 = item.settingHarga;
      groupedData[pluKey].mrg3 = item.settingMargin;
    }
  });

  const handleDelete = (pluKey: string) => {
    const newData = displayData.filter(
      (item) => item.plu.slice(0, 6) !== pluKey,
    );
    setDisplayData(newData);
    onDelete(pluKey);
  };

  const handleExport = async () => {
    const headers = [
      "#",
      "Plu",
      "Deskripsi",
      "Satuan",
      "Acost",
      "Harga",
      "Hrg 0",
      "Hrg 1",
      "Hrg 2",
      "Hrg 3",
      "Mrg 0",
      "Mrg 1",
      "Mrg 2",
      "Mrg 3",
    ];

    const rows = Object.keys(groupedData).map((pluKey, index) => {
      const firstItem = displayData.find(
        (item) => item.plu.slice(0, 6) === pluKey,
      );
      return [
        index + 1,
        pluKey + "0",
        groupedData[pluKey].desk || "-",
        firstItem?.satuan || "-",
        fmtNum(firstItem?.acost),
        fmtNum(firstItem?.hrg),
        fmtNum(groupedData[pluKey].harga0),
        fmtNum(groupedData[pluKey].harga1),
        fmtNum(groupedData[pluKey].harga2),
        fmtNum(groupedData[pluKey].harga3),
        groupedData[pluKey].mrg0 || "-",
        groupedData[pluKey].mrg1 || "-",
        groupedData[pluKey].mrg2 || "-",
        groupedData[pluKey].mrg3 || "-",
      ];
    });

    const columns = headers.map((h) => ({
      label: h,
      isNumeric: !["#", "Plu", "Satuan"].includes(h),
    }));

    await exportToStyledExcel({
      title: "Setting Harga",
      columns,
      rows,
      fileName: `Setting Harga ${getCurrentDate()}.xlsx`,
    });
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end justify-end bg-black/60 opacity-0 sm:items-center sm:justify-center"
      onClick={() => handleClose(onClose)}>
      <div
        ref={contentRef}
        className="flex h-full w-full max-w-4xl flex-col bg-white p-6 shadow-2xl opacity-0 sm:h-auto sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Setting Harga</h2>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
              onClick={handleExport}>
              <Download size={14} />
              Export Excel
            </button>
            <button
              className="flex items-center gap-1 rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
              onClick={() => handleClose(onClose)}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="mb-2 flex-grow overflow-y-auto border shadow-xl">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="text-xs">
                <th
                  className="border bg-blue-400 p-2 text-center text-white"
                  rowSpan={2}>
                  #
                </th>
                <th
                  className="border bg-blue-400 p-2 text-center text-white"
                  rowSpan={2}>
                  Plu
                </th>
                <th
                  className="border bg-blue-400 p-2 text-center text-white"
                  rowSpan={2}>
                  Deskripsi
                </th>
                <th
                  className="border bg-blue-400 p-2 text-center text-white"
                  rowSpan={2}>
                  Satuan
                </th>
                <th
                  className="border bg-blue-400 p-2 text-center text-white"
                  rowSpan={2}>
                  Acost
                </th>
                <th
                  className="border bg-blue-400 p-2 text-center text-white"
                  rowSpan={2}>
                  Harga
                </th>
                <th
                  className="border bg-green-400 p-2 text-center text-white"
                  colSpan={4}>
                  Setting Harga
                </th>
                <th
                  className="border bg-green-400 p-2 text-center text-white"
                  colSpan={4}>
                  Setting Margin
                </th>
                <th
                  className="border bg-blue-400 p-2 text-center text-white"
                  rowSpan={2}>
                  Action
                </th>
              </tr>
              <tr className="text-xs">
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  0
                </th>
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  1
                </th>
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  2
                </th>
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  3
                </th>
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  0
                </th>
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  1
                </th>
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  2
                </th>
                <th className="border bg-green-400 p-2 text-center text-white text-xs">
                  3
                </th>
              </tr>
            </thead>
            <tbody className="text-xxs">
              {Object.keys(groupedData).map((pluKey, index) => {
                const firstItem = displayData.find(
                  (item) => item.plu.slice(0, 6) === pluKey,
                );
                return (
                  <tr key={pluKey} className="border text-xxs">
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">{firstItem?.plu}</td>
                    <td className="border p-2 whitespace-nowrap">
                      {groupedData[pluKey].desk || "-"}
                    </td>
                    <td className="border p-2">{firstItem?.satuan || "-"}</td>
                    <td className="border p-2 text-right">
                      {fmtNum(firstItem?.acost)}
                    </td>
                    <td className="border p-2 text-right">
                      {fmtNum(firstItem?.hrg)}
                    </td>
                    <td className="border p-2 text-right">
                      {fmtNum(groupedData[pluKey].harga0)}
                    </td>
                    <td className="border p-2 text-right">
                      {fmtNum(groupedData[pluKey].harga1)}
                    </td>
                    <td className="border p-2 text-right">
                      {fmtNum(groupedData[pluKey].harga2)}
                    </td>
                    <td className="border p-2 text-right">
                      {fmtNum(groupedData[pluKey].harga3)}
                    </td>
                    <td className="border p-2 text-right">
                      {groupedData[pluKey].mrg0 || "-"}
                    </td>
                    <td className="border p-2 text-right">
                      {groupedData[pluKey].mrg1 || "-"}
                    </td>
                    <td className="border p-2 text-right">
                      {groupedData[pluKey].mrg2 || "-"}
                    </td>
                    <td className="border p-2 text-right">
                      {groupedData[pluKey].mrg3 || "-"}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        className="rounded bg-blue-500 p-2 text-xs font-bold text-white hover:bg-blue-700"
                        onClick={() => handleDelete(pluKey)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body,
  );
}
