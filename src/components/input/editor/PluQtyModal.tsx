// src/components/input/editor/PluQtyModal.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";

export function PluQtyModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (qty: number | null) => void;
}) {
  const [text, setText] = React.useState("");

  const parsedQty = React.useMemo(
    function parseQty() {
      const value = Number(text);
      if (!text.trim() || Number.isNaN(value) || value <= 0) return null;
      return value;
    },
    [text],
  );

  return (
    <Modal show={true} zIndex={70} onClose={onCancel}>
      <div className="w-80 space-y-3 p-1">
        <h2 className="text-base font-semibold">Qty produk?</h2>
        <p className="text-sm text-muted-foreground">
          Opsional: isi jumlah (qty). Bila diisi, kolom Qty &amp; Total Harga
          akan ditampilkan pada tabel. Kosongkan untuk tanpa qty.
        </p>
        <input
          type="number"
          min={0}
          value={text}
          autoFocus
          onChange={function handleChange(event) {
            setText(event.target.value);
          }}
          placeholder="Contoh: 10"
          className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={function saveWithQty() {
              onConfirm(parsedQty);
            }}>
            Lanjutkan
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={function saveWithoutQty() {
              onConfirm(null);
            }}>
            Tanpa qty
          </Button>
        </div>
      </div>
    </Modal>
  );
}
