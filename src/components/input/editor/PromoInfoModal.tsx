// src/components/input/editor/PromoInfoModal.tsx
import * as React from "react";
import Modal from "@/components/modal";
import { fetchPromo, PromoRow } from "./promoInfo/promoInfoShared";
import { PromoMdSection } from "./promoInfo/PromoMdSection";
import { CashbackMemberSection } from "./promoInfo/CashbackMemberSection";
import { CashbackSection } from "./promoInfo/CashbackSection";
import { GiftSection } from "./promoInfo/GiftSection";

interface PromoInfoModalProps {
  show: boolean;
  prdcd: string | null;
  onClose: () => void;
}

export function PromoInfoModal({ show, prdcd, onClose }: PromoInfoModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [cashback, setCashback] = React.useState<PromoRow[]>([]);
  const [gift, setGift] = React.useState<PromoRow[]>([]);
  const [member, setMember] = React.useState<PromoRow[]>([]);
  const [settingHarga, setSettingHarga] = React.useState<PromoRow[]>([]);

  React.useEffect(function loadPromoInfo() {
    if (!show || !prdcd) return;
    let active = true;
    setLoading(true);
    Promise.all([
      fetchPromo("/informasi-promosi/data-promo-cashback", prdcd),
      fetchPromo("/informasi-promosi/data-promo-gift", prdcd),
      fetchPromo("/informasi-promosi/data-cashback-jenismember", prdcd),
      fetchPromo("/informasi-promosi/data-setting-harga", prdcd),
    ])
      .then(function apply(result) {
        if (!active) return;
        setCashback(result[0]);
        setGift(result[1]);
        setMember(result[2] ?? []);
        setSettingHarga(result[3] ?? []);
      })
      .finally(function done() {
        if (active) setLoading(false);
      });
    return function cancel() {
      active = false;
    };
  }, [show, prdcd]);

  return (
    <Modal show={show} onClose={onClose} zIndex={60}>
      <div className="max-h-[85vh] w-[95vw] max-w-4xl space-y-4 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold">Info Promo - {prdcd}</h2>

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat info promo…</p>
        ) : (
          <>
            {/* Promo MD & Cashback Member bersebelahan */}
            <div className="flex flex-col gap-4 lg:flex-row">
              {settingHarga.length > 0 && (
                <PromoMdSection rows={settingHarga} />
              )}
              <CashbackMemberSection rows={member} />
            </div>

            {cashback.length > 0 && <CashbackSection rows={cashback} />}

            {gift.length > 0 && <GiftSection rows={gift} />}
          </>
        )}
      </div>
    </Modal>
  );
}
