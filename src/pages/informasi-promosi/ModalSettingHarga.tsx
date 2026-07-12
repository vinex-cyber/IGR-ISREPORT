// src/pages/informasi-promosi/ModalSettingHarga.tsx
import { useEffect, useState } from "react";
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";
import { Download } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";

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
  branch: string;
  product: SatuanJualItem[];
  onDelete: (pluKey: string) => void;
}

function fmtNum(n: number | string | undefined | null) {
  if (n === undefined || n === null || n === "") return "-";
  const val = typeof n === "string" ? Number(n) : n;
  if (isNaN(val)) return "-";
  return Math.round(val).toLocaleString("en-US");
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
  branch,
  product,
  onDelete,
}: ModalSettingHargaProps) {
  const [displayData, setDisplayData] = useState<SatuanJualItem[]>(product);

  useEffect(
    function syncDisplayData() {
      setDisplayData(product);
    },
    [product],
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Setting Harga - ${branch}`}
      maxWidth="max-w-4xl"
      slideOptions={{
        closeAnimation: "spin",
        openDuration: 1000,
        closeDuration: 1000,
      }}
      contentClassName="p-0"
      headerRight={
        <button
          className="flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/30"
          onClick={handleExport}>
          <Download size={14} />
          Export Excel
        </button>
      }>
      <div className="flex flex-grow flex-col overflow-auto">
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
              {[0, 1, 2, 3].map((i) => (
                <th
                  key={`h${i}`}
                  className="border bg-green-400 p-2 text-center text-xs text-white">
                  {i}
                </th>
              ))}
              {[0, 1, 2, 3].map((i) => (
                <th
                  key={`m${i}`}
                  className="border bg-green-400 p-2 text-center text-xs text-white">
                  {i}
                </th>
              ))}
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
    </BaseModal>
  );
}
