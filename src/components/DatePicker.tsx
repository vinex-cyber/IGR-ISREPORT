"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Calendar22Props = {
    label?: string;
    value?: string; // Format yyyy-MM-dd
    onChange?: (val: string) => void; // Output: yyyy-MM-dd
};

export function Calendar22({ label = "Pilih Tanggal", value, onChange }: Calendar22Props) {
    const [open, setOpen] = React.useState(false);
    const parsedDate = React.useMemo(() => (value ? new Date(value) : undefined), [value]);
    const [date, setDate] = React.useState<Date | undefined>(parsedDate);

    React.useEffect(function syncDateFromValue() {
        setDate(parsedDate);
    }, [value, parsedDate]);

    const handleSelect = (selected: Date | undefined) => {
        setDate(selected);
        setOpen(false);
        if (selected && onChange) {
            const yyyy = selected.getFullYear();
            const mm = (selected.getMonth() + 1).toString().padStart(2, "0");
            const dd = selected.getDate().toString().padStart(2, "0");
            onChange(`${yyyy}-${mm}-${dd}`); // backend format
        }
    };

    return (
        <div className="flex flex-col space-y-1">
            <Label htmlFor="date" className="p-1">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="justify-between font-normal"
                    >
                        {date ? format(date, "dd-MMM-yyyy", { locale: id }) : "Pilih tanggal"}
                        <CalendarDays />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={handleSelect}
                        locale={id}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
