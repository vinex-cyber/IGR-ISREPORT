
import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type DateRangePickerProps = {
    value?: DateRange
    onChange?: (range: DateRange | undefined) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(value)
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date>(value?.from ?? new Date())
    const [activeShortcut, setActiveShortcut] = React.useState<string | null>(null)

    const years = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i)
    const months = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("default", { month: "long" })
    )

    React.useEffect(() => {
        setDate(value)
    }, [value])

    const handleSelect = (range: DateRange | undefined) => {
        setDate(range)
        setActiveShortcut(null)
    }

    const setShortcut = (range: DateRange, key: string) => {
        setDate(range)
        setActiveShortcut(key)
    }

    const handleApply = () => {
        onChange?.(date)
        setOpen(false)
    }

    const handleReset = () => {
        setDate(undefined)
        setActiveShortcut(null)
        onChange?.(undefined)
        setOpen(false)
    }

    return (
        <div className={cn("grid gap-2")}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "min-w-[200px] justify-start text-left font-bold",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd-MM-yyyy")} s/d{" "}
                                    {format(date.to, "dd-MM-yyyy")}
                                </>
                            ) : (
                                format(date.from, "dd-MM-yyyy")
                            )
                        ) : (
                            <span>Pilih rentang tanggal</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 space-y-2" align="start">
                    {/* 🔼 Dropdown Bulan & Tahun */}
                    <div className="flex items-center justify-center gap-2 px-2">
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={month.getMonth()}
                            onChange={(e) =>
                                setMonth(new Date(month.getFullYear(), Number(e.target.value)))
                            }
                        >
                            {months.map((m, i) => (
                                <option key={m} value={i}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={month.getFullYear()}
                            onChange={(e) =>
                                setMonth(new Date(Number(e.target.value), month.getMonth()))
                            }
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 📅 Calendar */}
                    <Calendar
                        month={month}
                        onMonthChange={setMonth}
                        mode="range"
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />

                    {/* 🔽 Shortcut di bawah */}
                    <div className="flex gap-2 flex-wrap px-2 pt-2 border-t">
                        <Button
                            size="sm"
                            className={cn(
                                "rounded-full px-3 py-1 text-xs",
                                activeShortcut === "today"
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            )}
                            onClick={() =>
                                setShortcut({ from: new Date(), to: new Date() }, "today")
                            }
                        >
                            Today
                        </Button>
                        <Button
                            size="sm"
                            className={cn(
                                "rounded-full px-3 py-1 text-xs",
                                activeShortcut === "7days"
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            )}
                            onClick={() =>
                                setShortcut(
                                    { from: subDays(new Date(), 6), to: new Date() },
                                    "7days"
                                )
                            }
                        >
                            Last 7 Days
                        </Button>
                        <Button
                            size="sm"
                            className={cn(
                                "rounded-full px-3 py-1 text-xs",
                                activeShortcut === "30days"
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            )}
                            onClick={() =>
                                setShortcut(
                                    { from: subDays(new Date(), 29), to: new Date() },
                                    "30days"
                                )
                            }
                        >
                            Last 30 Days
                        </Button>
                        <Button
                            size="sm"
                            className={cn(
                                "rounded-full px-3 py-1 text-xs",
                                activeShortcut === "thisMonth"
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            )}
                            onClick={() =>
                                setShortcut(
                                    { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
                                    "thisMonth"
                                )
                            }
                        >
                            This Month
                        </Button>
                        <Button
                            size="sm"
                            className={cn(
                                "rounded-full px-3 py-1 text-xs",
                                activeShortcut === "lastMonth"
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            )}
                            onClick={() => {
                                const lastMonthDate = subMonths(new Date(), 1)
                                setShortcut(
                                    {
                                        from: startOfMonth(lastMonthDate),
                                        to: endOfMonth(lastMonthDate),
                                    },
                                    "lastMonth"
                                )
                            }}
                        >
                            Last Month
                        </Button>
                    </div>

                    {/* 🔽 Reset & Apply */}
                    <div className="flex justify-between gap-2 px-2 pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
