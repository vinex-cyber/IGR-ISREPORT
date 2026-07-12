// src/pages/informasi-promosi/TabelSettingHarga.tsx
import { stagger } from "animejs";
import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";
import { useCallback, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { FormatTanggal } from "@/utils/formatTanggal";
import ModalSettingHarga from "../modal/ModalSettingHarga";
import { formatNumber } from "@/utils/formatNumber";

interface SettingHargaRow {
  prd_prdcd: string;
  prd_unit: string;
  prd_frac: string;
  prd_avgcost: string;
  prd_hrgjual: string;
  prd_deskripsipanjang: string;
  prd_kodetag: string;
  prmd_hrgjual: number | null;
  prmd_tglawal: string | null;
  prmd_tglakhir: string | null;
  prmd_flag_pos: string | null;
  prmd_flag_klik: string | null;
  prmd_flag_spi: string | null;
  prd_flagbkp1: string;
  prd_flagbkp2: string;
  settingHarga: number | null;
  settingMargin: string | null;
}

interface MappedRow {
  plu: string;
  deskripsi: string;
  satuan: string;
  acost: number;
  hrg: number;
  mrg: number;
  tag: string;
  promohrg: number;
  promomrg: number;
  awal: string;
  akhir: string;
  flag_pos: string | null;
  flag_klik: string | null;
  flag_spi: string | null;
  flagbkp1: string;
  flagbkp2: string;
  settingHarga: number | null;
  settingMargin: string | null;
}

const COL_SPAN = 13;

function toNetto(hrg: number, flagbkp1: string, flagbkp2: string): number {
  if (flagbkp1 === "Y" && flagbkp2 === "Y") return (hrg / 11.1) * 10;
  return hrg;
}

function calculateMargin(hargaNetto: number, avgCost: number): string {
  if (!hargaNetto || !avgCost || hargaNetto === 0) return "";
  const margin = ((hargaNetto - avgCost) / hargaNetto) * 100;
  return margin.toFixed(2);
}

function mapRow(row: SettingHargaRow): MappedRow {
  const acost = Number(row.prd_avgcost ?? 0);
  const hrg = Number(row.prd_hrgjual ?? 0);
  const hrgNetto = toNetto(hrg, row.prd_flagbkp1, row.prd_flagbkp2);
  const mrg = Number(calculateMargin(hrgNetto, acost) || 0);

  const promohrg = Number(row.prmd_hrgjual ?? 0);
  const promohrgNetto = toNetto(promohrg, row.prd_flagbkp1, row.prd_flagbkp2);
  const promomrg = Number(calculateMargin(promohrgNetto, acost) || 0);

  return {
    plu: row.prd_prdcd,
    deskripsi: row.prd_deskripsipanjang ?? "-",
    satuan: `${row.prd_unit} / ${row.prd_frac}`,
    acost: Math.round(acost),
    hrg: Math.round(hrg),
    mrg,
    tag: row.prd_kodetag ?? "-",
    promohrg: Math.round(promohrg),
    promomrg,
    awal: FormatTanggal(row.prmd_tglawal) || "-",
    akhir: FormatTanggal(row.prmd_tglakhir) || "-",
    flag_pos: row.prmd_flag_pos,
    flag_klik: row.prmd_flag_klik,
    flag_spi: row.prmd_flag_spi,
    flagbkp1: row.prd_flagbkp1,
    flagbkp2: row.prd_flagbkp2,
    settingHarga: row.settingHarga,
    settingMargin: row.settingMargin,
  };
}

function fmtNum(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function EmptyRow({ label }: { label: string }) {
  return (
    <tr>
      <td
        colSpan={COL_SPAN}
        className="border p-2 text-center text-xxs text-gray-400 dark:text-gray-300">
        {label}
      </td>
    </tr>
  );
}

function TableHead() {
  const cls = "border px-0.5 py-0.5 text-center text-white";

  return (
    <thead>
      <tr>
        <th className={`${cls} bg-blue-400`} rowSpan={2}>#</th>
        <th className={`${cls} bg-blue-400`} rowSpan={2}>Satuan</th>
        <th className={`${cls} bg-blue-400`} rowSpan={2}>Acost</th>
        <th className={`${cls} bg-blue-400`} rowSpan={2}>Hrg</th>
        <th className={`${cls} bg-blue-400`} rowSpan={2}>Mrg</th>
        <th className={`${cls} bg-blue-400`} rowSpan={2}>Tag</th>
        <th className={`${cls} bg-green-400`} colSpan={4}>Promo MD</th>
        <th className={`${cls} bg-red-400`} colSpan={2}>Setting</th>
        <th className={`${cls} bg-blue-400`} rowSpan={2}>Action</th>
      </tr>
      <tr>
        {["Hrg", "Mrg", "Awal", "Akhir"].map((h) => (
          <th key={h} className={`${cls} bg-green-400`}>{h}</th>
        ))}
        {["Hrg", "Mrg"].map((h) => (
          <th key={h} className={`${cls} bg-red-400`}>{h}</th>
        ))}
      </tr>
    </thead>
  );
}

interface RowProps {
  r: MappedRow;
  hargaInput: string;
  onInputChange: (prd: MappedRow, value: string) => void;
  onAdd: (prd: MappedRow) => void;
  onReset: (plu: string) => void;
}

function Row({ r, hargaInput, onInputChange, onAdd, onReset }: RowProps) {
  const lastDigit = r.plu.slice(-1);
  const acost = useAnimeCounter({ to: r.acost, duration: 1200 });
  const hrg = useAnimeCounter({ to: r.hrg, duration: 1200 });
  const mrg = useAnimeCounter({ to: Math.round(r.mrg * 100), duration: 1000 });
  const promohrg = useAnimeCounter({ to: r.promohrg, duration: 1200 });
  const promomrg = useAnimeCounter({
    to: Math.round(r.promomrg * 100),
    duration: 1000,
  });

  const hargaBaru = Number(hargaInput || 0);
  const hargaBaruNetto = toNetto(hargaBaru, r.flagbkp1, r.flagbkp2);
  const settingMargin =
    hargaBaru > 0
      ? calculateMargin(hargaBaruNetto, r.acost)
      : promomrg.value > 0
        ? (promomrg.value / 100).toFixed(2)
        : (mrg.value / 100).toFixed(2);

  const promoLine =
    promohrg.value > 0 && !r.flag_pos && !r.flag_klik && !r.flag_spi;
  const strike = promoLine ? "text-muted-foreground line-through" : "";
  const nowrap = "whitespace-nowrap border p-0.5";

  return (
    <tr className="row-setting-harga border">
      <td className="border p-0.5 text-center">{lastDigit}</td>
      <td className={`${nowrap} text-center`}>{r.satuan}</td>
      <td className={`${nowrap} text-right`}>{fmtNum(acost.value)}</td>
      <td className={`${nowrap} text-right`}>{fmtNum(hrg.value)}</td>
      <td className="border p-0.5 text-right">
        {(mrg.value / 100).toFixed(2)}
      </td>
      <td className="border p-0.5 text-center">{r.tag}</td>
      <td className={`${nowrap} text-right ${strike}`}>
        {fmtNum(promohrg.value)}
      </td>
      <td className={`border p-0.5 text-right ${strike}`}>
        {(promomrg.value / 100).toFixed(2)}
      </td>
      <td className={`${nowrap} text-center ${strike}`}>{r.awal}</td>
      <td className={`${nowrap} text-center ${strike}`}>{r.akhir}</td>
      <td className="border p-0.5 text-center">
        <input
          className={`w-14 text-right text-xxs dark:text-gray-200 ${hargaInput ? "bg-green-200" : ""}`}
          value={hargaInput ? formatNumber(Number(hargaInput)) : ""}
          onChange={(e) => onInputChange(r, e.target.value)}
        />
      </td>
      <td className="border p-0.5 text-center">{settingMargin}</td>
      <td className="border p-0.5 text-center">
        <div className="flex items-center justify-center gap-0.5">
          <button
            className={`${hargaInput ? "bg-blue-500 hover:bg-blue-700 hover:cursor-pointer" : "cursor-not-allowed bg-gray-500"} rounded p-0.5 text-white`}
            onClick={() => onAdd(r)}
            disabled={!hargaInput}>
            <Save size={12} />
          </button>
          {hargaInput && (
            <>
              <span className="text-gray-300">|</span>
              <button
                className="cursor-pointer rounded bg-red-500 p-0.5 text-white hover:bg-red-700"
                onClick={() => onReset(r.plu)}>
                <RotateCcw size={12} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

interface TabelSettingHargaProps {
  plu?: string;
  branch: string;
}

export default function TabelSettingHarga({ plu, branch }: TabelSettingHargaProps) {
  const { data, loading } = useFetchData<SettingHargaRow[]>({
    endpoint: "/informasi-promosi/data-setting-harga",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const [hargaInput, setHargaInput] = useState<Record<string, string>>({});
  const [itemsToEdit, setItemsToEdit] = useState<MappedRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputHargaChange = (prd: MappedRow, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setHargaInput((prev) => ({ ...prev, [prd.plu]: numericValue }));
  };

  const handleAdd = useCallback(
    (prd: MappedRow) => {
      const settingHarga = Number(hargaInput[prd.plu] || 0);
      const netto = toNetto(settingHarga, prd.flagbkp1, prd.flagbkp2);
      const settingMargin = calculateMargin(netto, prd.acost);
      const newItem = { ...prd, settingHarga, settingMargin };

      setItemsToEdit((prev) => {
        const idx = prev.findIndex((item) => item.plu === prd.plu);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = newItem;
          return next;
        }
        return [...prev, newItem];
      });
    },
    [hargaInput],
  );

  const handleDeleteProduct = useCallback((pluKey: string) => {
    setItemsToEdit((prev) =>
      prev.filter((item) => item.plu.slice(0, 6) !== pluKey),
    );
  }, []);

  const handleResetSingle = useCallback((pluKey: string) => {
    setHargaInput((prev) => {
      const next = { ...prev };
      delete next[pluKey];
      return next;
    });
  }, []);

  const rows = data ? data.map(mapRow) : [];

  useAnimeOnScroll(
    ".table-setting-harga",
    {
      opacity: [0, 1],
      y: [12, 0],
      duration: 600,
      ease: "outQuad",
      delay: stagger(60),
    },
    { threshold: 0.3, triggerOnce: true, childSelector: ".row-setting-harga" },
  );

  const tableClass =
    "table-setting-harga overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200";

  return (
    <>
      <div className={tableClass}>
        {!plu && (
          <div className="my-1 flex justify-end">
            <span className="rounded bg-blue-500 px-2 py-0.5 text-xxs font-bold text-white">
              View Setting Harga
            </span>
          </div>
        )}

        {plu && (
          <div className="my-1 flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded bg-blue-500 px-2 py-0.5 text-xxs font-bold text-white hover:cursor-pointer hover:bg-blue-700">
              View Setting Harga
            </button>
          </div>
        )}

        <table className="w-full text-xxs">
          <TableHead />
          <tbody>
            {!plu ? (
              <EmptyRow label="Pilih PLU untuk melihat setting harga" />
            ) : loading ? (
              <EmptyRow label="Memuat..." />
            ) : rows.length === 0 ? (
              <EmptyRow label="Tidak ada data" />
            ) : (
              rows.map((r) => (
                <Row
                  key={r.plu}
                  r={r}
                  hargaInput={hargaInput[r.plu] || ""}
                  onInputChange={handleInputHargaChange}
                  onAdd={handleAdd}
                  onReset={handleResetSingle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalSettingHarga
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        branch={branch}
        product={itemsToEdit}
        onDelete={handleDeleteProduct}
      />
    </>
  );
}
