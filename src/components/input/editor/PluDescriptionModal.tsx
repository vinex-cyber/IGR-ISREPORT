// src/components/input/editor/PluDescriptionModal.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";

export function PluDescriptionModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (description: string) => void;
}) {
  const [text, setText] = React.useState("");

  return (
    <Modal show={true} zIndex={70} onClose={onCancel}>
      <div className="w-80 space-y-3 p-1">
        <h2 className="text-base font-semibold">Deskripsi tabel?</h2>
        <p className="text-sm text-muted-foreground">
          Opsional: judul yang ditampilkan di atas tabel (mis. &quot;Daftar
          produk Food&quot;).
        </p>
        <input
          type="text"
          value={text}
          autoFocus
          onChange={function handleChange(event) {
            setText(event.target.value);
          }}
          placeholder="Daftar produk Food"
          className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={function saveWithDescription() {
              onConfirm(text);
            }}>
            Simpan dengan deskripsi
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={function saveWithoutDescription() {
              onConfirm("");
            }}>
            Tanpa deskripsi
          </Button>
        </div>
      </div>
    </Modal>
  );
}
