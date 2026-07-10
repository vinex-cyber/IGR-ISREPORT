// src/pages/informasi-promosi/KartuProduk.tsx
import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";

export default function KartuProduk() {
  const ctn = useAnimeCounter({ to: 2067, duration: 1200 });
  const pcs = useAnimeCounter({ to: 14, duration: 800 });
  const sales = useAnimeCounter({ to: 565186, duration: 1200 });

  return (
    <div className="flex flex-col rounded-lg border bg-gray-50 shadow-xl h-full">
      <div className="flex flex-1 flex-col">
        <div className="grid grid-cols-3 border-b">
          <div className="border-r">
            <div className="grid grid-cols-2 border-b">
              <div className="border-r bg-gray-200 p-1 text-xxs font-medium">
                PLU IGR
              </div>
              <div className="p-1 text-xxs">0060410</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="border-r bg-gray-200 p-1 text-xxs font-medium">
                PLU OMI
              </div>
              <div className="p-1 text-xxs">0060410</div>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-center p-1">
            <h1 className="text-center text-xs font-bold leading-tight">
              INDOMIE MIE GORENG PLUS SPECIAL PCK 80g
            </h1>
          </div>
        </div>

        <div className="flex border-b text-center">
          <div className="flex-1 border-r p-2">
            <h1 className="text-lg font-semibold">Stock</h1>
          </div>
          <div className="flex flex-1 items-center justify-center border-r p-2 text-lg font-semibold">
            {ctn.value.toLocaleString()} Ctn
          </div>
          <div className="flex flex-1 items-center justify-center p-2 text-lg font-semibold">
            {pcs.value} Pcs
          </div>
        </div>

        <div className="flex border-b text-center text-xxs">
          <div className="flex-1 border-r p-1 font-medium">Avg Sales</div>
          <div className="flex flex-1 items-center justify-center border-r p-1">
            {sales.value.toLocaleString()}
          </div>
          <div className="flex-1 border-r p-1 font-medium">Pb Out</div>
          <div className="flex flex-1 items-center justify-center p-1 text-red-500">
            0
          </div>
        </div>

        <div className="border-b p-2 text-center text-xxs">
          (1) - FOOD, (08) - INSTANT FOOD, (01) - INSTANT NOODLE PACK
        </div>

        <div className="flex justify-center gap-1 border-b p-1">
          {["Sales", "Lokasi", "So Ic", "Pb", "BTB"].map((btn) => (
            <button
              key={btn}
              className="btn-hover rounded bg-blue-500 px-2 py-0.5 text-xxs text-white">
              {btn}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-200 p-0.5 text-center text-xxs">IGR+K.IGR</div>
    </div>
  );
}
