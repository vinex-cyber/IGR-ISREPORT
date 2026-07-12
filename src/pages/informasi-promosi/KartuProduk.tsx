// src/pages/informasi-promosi/KartuProduk.tsx
import { useState } from "react";
import { useFetchData } from "@/hooks/data/useFetchData";
import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { Button } from "@/components/ui/button";
import ModalSalesKartuProduk from "./modal/ModalSalesKartuProduk";
import ModalLokasi from "./modal/ModalLokasi";
import ModalSoIc from "./modal/ModalSoIc";
import ModalPbPoBtb from "./modal/ModalPbPoBtb";
import ModalBtb from "./modal/ModalBtb";

interface KartuProdukRow {
  prd_prdcd: string;
  prc_pluomi: string | null;
  prd_deskripsipanjang: string;
  prd_stock: string;
  prd_frac: string;
  avg_sales: string | null;
  flag: string | null;
  prd_kodedivisi: string;
  div_namadivisi: string;
  prd_kodedepartement: string;
  dep_namadepartement: string;
  prd_kodekategoribarang: string;
  kat_namakategori: string;
  pb_out: string | null;
}

interface KartuProdukProps {
  plu?: string;
  branch?: string;
}

export default function KartuProduk({ plu, branch }: KartuProdukProps) {
  const { data, loading, error } = useFetchData<KartuProdukRow[]>({
    endpoint: "/informasi-promosi/data-produk",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const row = data?.[0];

  const stock = row ? Number(row.prd_stock) : 0;
  const frac = row ? Number(row.prd_frac) : 1;
  const ctn = frac > 0 ? Math.floor((stock - (stock % frac)) / frac) : stock;
  const pcs = frac > 0 ? stock % frac : 0;
  const avg = row ? Number(row.avg_sales ?? 0) : 0;

  const ctnCount = useAnimeCounter({ to: ctn, duration: 1200 });
  const pcsCount = useAnimeCounter({ to: pcs, duration: 800 });
  const salesCount = useAnimeCounter({ to: avg, duration: 1200 });

  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isLokasiOpen, setIsLokasiOpen] = useState(false);
  const [isSoIcOpen, setIsSoIcOpen] = useState(false);
  const [isPbOpen, setIsPbOpen] = useState(false);
  const [isBtbOpen, setIsBtbOpen] = useState(false);

  const title = !plu
    ? "Pilih PLU untuk melihat detail"
    : row?.prd_deskripsipanjang
      ? row.prd_deskripsipanjang
      : loading
        ? "Memuat..."
        : error
          ? "Gagal memuat"
          : "Produk tidak ditemukan";
  const onClick = (buttonText: string) => {
    if (buttonText === "Sales") {
      setIsSalesOpen(true);
    } else if (buttonText === "Lokasi") {
      setIsLokasiOpen(true);
    } else if (buttonText === "So Ic") {
      setIsSoIcOpen(true);
    } else if (buttonText === "Pb") {
      setIsPbOpen(true);
    } else if (buttonText === "BTB") {
      setIsBtbOpen(true);
    }
  };

  return (
    <div className="flex flex-col rounded-lg border bg-gray-50 shadow-xl h-full dark:bg-gray-800 dark:text-gray-200">
      <div className="flex flex-1 flex-col">
        <div className="grid grid-cols-3 border-b">
          <div className="border-r">
            <div className="grid grid-cols-2 border-b">
              <div className="border-r bg-gray-200 p-1 text-xxs font-medium dark:bg-gray-700 dark:text-gray-200">
                PLU IGR
              </div>
              <div className="p-1 text-xxs">{row?.prd_prdcd ?? "-"}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="border-r bg-gray-200 p-1 text-xxs font-medium dark:bg-gray-700 dark:text-gray-200">
                PLU OMI
              </div>
              <div className="p-1 text-xxs">{row?.prc_pluomi ?? "-"}</div>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-center p-1">
            <h1 className="text-center text-xs font-bold leading-tight">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex border-b text-center">
          <div className="flex-1 border-r p-2">
            <h1 className="text-lg font-semibold">Stock</h1>
          </div>
          <div className="flex flex-1 items-center justify-center border-r p-2 text-lg font-semibold">
            {ctnCount.value.toLocaleString()} Ctn
          </div>
          <div className="flex flex-1 items-center justify-center p-2 text-lg font-semibold">
            {pcsCount.value} Pcs
          </div>
        </div>

        <div className="flex border-b text-center text-xxs">
          <div className="flex-1 border-r p-1 font-medium">Avg Sales</div>
          <div className="flex flex-1 items-center justify-center border-r p-1">
            {salesCount.value.toLocaleString()}
          </div>
          <div className="flex-1 border-r p-1 font-medium">Pb Out</div>
          <div className="flex flex-1 items-center justify-center p-1 text-red-500">
            {row?.pb_out ? Number(row.pb_out).toLocaleString() : 0}
          </div>
        </div>

        <div className="border-b p-2 text-center text-xxs">
          ({row?.prd_kodedivisi ?? "-"}) - {row?.div_namadivisi ?? "-"}, (
          {row?.prd_kodedepartement ?? "-"}) - {row?.dep_namadepartement ?? "-"}
          , ({row?.prd_kodekategoribarang ?? "-"}) -{" "}
          {row?.kat_namakategori ?? "-"}
        </div>

        <div className="flex justify-center gap-1 border-b p-1">
          {["Sales", "Lokasi", "So Ic", "Pb", "BTB"].map((btn) => (
            <Button
              key={btn}
              variant="default"
              size="sm"
              onClick={() => onClick(btn)}
              className="h-4 btn-hover !text-xxs bg-blue-400 text-white hover:cursor-pointer dark:bg-accent dark:text-accent-foreground">
              {btn}
            </Button>
          ))}
        </div>
      </div>
      <div className="bg-gray-200 p-0.5 text-center text-xxs dark:bg-gray-700 dark:text-gray-200">
        {row?.flag ?? "IGR+K.IGR"}
      </div>

      <ModalSalesKartuProduk
        isOpen={isSalesOpen}
        onClose={() => setIsSalesOpen(false)}
        plu={plu ?? ""}
        branch={branch ?? ""}
        namaProduk={row?.prd_deskripsipanjang ?? ""}
      />

      <ModalLokasi
        isOpen={isLokasiOpen}
        onClose={() => setIsLokasiOpen(false)}
        plu={plu ?? ""}
        branch={branch ?? ""}
        namaProduk={row?.prd_deskripsipanjang ?? ""}
      />

      <ModalSoIc
        isOpen={isSoIcOpen}
        onClose={() => setIsSoIcOpen(false)}
        plu={plu ?? ""}
        branch={branch ?? ""}
        namaProduk={row?.prd_deskripsipanjang ?? ""}
      />

      <ModalPbPoBtb
        isOpen={isPbOpen}
        onClose={() => setIsPbOpen(false)}
        plu={plu ?? ""}
        branch={branch ?? ""}
        namaProduk={row?.prd_deskripsipanjang ?? ""}
      />

      <ModalBtb
        isOpen={isBtbOpen}
        onClose={() => setIsBtbOpen(false)}
        plu={plu ?? ""}
        branch={branch ?? ""}
        namaProduk={row?.prd_deskripsipanjang ?? ""}
      />
    </div>
  );
}
