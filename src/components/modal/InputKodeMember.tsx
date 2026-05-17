// Compenents/modal/InputKodeMember.tsx
import { daftarMemberColumns, DaftarMemberRows } from "@/configs/input/daftar-memberConfig";
import { GenericLookupModal } from "./GenericLookupModal";
import { useFormContext } from "react-hook-form";

interface Props {
    show: boolean;
    onClose: () => void;
    noMember?: boolean;
    namaMember?: boolean;
}

export default function InputKodeMemberModal({ show, onClose, noMember, namaMember }: Props) {
    const { setValue, watch } = useFormContext();
    // 🔥 ambil branch dari form
    const branch = watch("branch");

    const onSelect = (row: DaftarMemberRows) => {
        if (noMember) {
            setValue("noMember", row.cus_kodemember);
        }
        if (namaMember) {
            setValue("namaMember", row.cus_namamember);
        }
    };

    return (
        <GenericLookupModal<DaftarMemberRows>
            show={show}
            onClose={onClose}
            endpoint={`/api/daftar-member?branch=${branch}`} // ⚠️ API harus return ALL data
            columns={daftarMemberColumns}
            title="Pilih Member"
            onSelect={onSelect}
        />
    );
}