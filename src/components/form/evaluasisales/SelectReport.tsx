// src/components/form/evaluasisales/SelectReport.tsx
import { Controller, Control } from "react-hook-form"
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk"
import SelectReportType from "@/components/SelectType"
import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card"

type SelectReportProps = {
    control: Control<FilterDetailStrukInput>
}

const SelectReport = ({ control }: SelectReportProps) => {
    const reportOptions = [
        { label: "Per Divisi", value: "per-divisi" },
        { label: "Per Departement", value: "per-departement" },
        { label: "Per Kategori", value: "per-kategori" },
        { label: "Per Produk", value: "per-produk" },
        { label: "Per Produk Tanggal", value: "per-produk-tanggal" },
        { label: "Per Tanggal", value: "per-tanggal" },
        { label: "Per Struk", value: "per-struk" },
        { label: "Per Kasir", value: "per-kasir" },
        { label: "Per Member", value: "per-member" },
        { label: "Per Group Member", value: "per-group-member" },
        { label: "Per Supplier", value: "per-supplier" },
        { label: "Per Bulan", value: "per-bulan" },
    ]

    return (
        <CardFieldset className="border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">
                Jenis Laporan
            </CardTitleLegend>
            <CardContent className="space-y-2">
                <Controller
                    control={control}
                    name="selectedReport"
                    render={({ field }) => (
                        <SelectReportType
                            value={field.value || ""}
                            onChange={field.onChange}
                            options={reportOptions}
                        />
                    )}
                />
            </CardContent>
        </CardFieldset>
    )
}

export default SelectReport
