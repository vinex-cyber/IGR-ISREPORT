// src/components/form/evaluasisales/PeriodeSales.tsx
import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card"
import { Control, useController } from "react-hook-form"
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// ✅ parse string "YYYY-MM-DD" jadi Date di local time (tanpa UTC shift)
function parseLocalDate(str: string): Date {
    const [year, month, day] = str.split("-").map(Number)
    return new Date(year, month - 1, day) // langsung Date lokal
}

// ✅ format Date → "YYYY-MM-DD" berdasarkan local time
function formatLocalDate(date: Date | undefined): string {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

type PeriodeSalesProps = {
    control: Control<FilterDetailStrukInput>
}

const PeriodeSales = ({ control }: PeriodeSalesProps) => {
    const { field: startField } = useController({ control, name: "startDate" })
    const { field: endField } = useController({ control, name: "endDate" })

    return (
        <CardFieldset className="relative border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">Periode</CardTitleLegend>
            <CardContent>
                <DateRangePicker

                    value={{
                        from: startField.value ? parseLocalDate(startField.value) : undefined,
                        to: endField.value ? parseLocalDate(endField.value) : undefined,
                    }}
                    onChange={(range) => {
                        startField.onChange(range?.from ? formatLocalDate(range.from) : "")
                        endField.onChange(range?.to ? formatLocalDate(range.to) : "")
                    }}
                />
            </CardContent>
        </CardFieldset>
    )
}

export default PeriodeSales
