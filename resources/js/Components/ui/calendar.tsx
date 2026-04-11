import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    fromYear?: number;
    toYear?: number;
};

const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    fromYear = 1900,
    toYear = new Date().getFullYear(),
    ...props
}: CalendarProps) {
    const [month, setMonth] = React.useState(
        props.selected instanceof Date ? props.selected : new Date()
    );

    React.useEffect(() => {
        if (props.selected instanceof Date) {
            setMonth(props.selected);
        }
    }, [props.selected]);

    const years = React.useMemo(() => {
        const arr = [];
        for (let y = fromYear; y <= toYear; y++) arr.push(y);
        return arr;
    }, [fromYear, toYear]);

    return (
        <div>
            <div className="flex gap-2 pt-2 justify-center">
                <Select
                    value={String(month.getMonth())}
                    onValueChange={(val) => {
                        const newMonth = new Date(month);
                        newMonth.setMonth(Number(val));
                        setMonth(newMonth);
                    }}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {monthNames.map((name, idx) => (
                                <SelectItem key={idx} value={String(idx)}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    value={String(month.getFullYear())}
                    onValueChange={(val) => {
                        const newMonth = new Date(month);
                        newMonth.setFullYear(Number(val));
                        setMonth(newMonth);
                    }}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <DayPicker
                month={month}
                onMonthChange={setMonth}
                showOutsideDays={showOutsideDays}
                className={cn("p-3", className)}
                classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "hidden",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                        buttonVariants({ variant: "outline" }),
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                        "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: cn(
                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                        props.mode === "range"
                            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                            : "[&:has([aria-selected])]:rounded-md"
                    ),
                    day: cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
                    ),
                    day_range_start: "day-range-start",
                    day_range_end: "day-range-end",
                    day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside:
                        "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle:
                        "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                    ...classNames,
                }}
                components={{
                    IconLeft: ({ className, ...props }) => (
                        <ChevronLeft
                            className={cn("h-4 w-4", className)}
                            {...props}
                        />
                    ),
                    IconRight: ({ className, ...props }) => (
                        <ChevronRight
                            className={cn("h-4 w-4", className)}
                            {...props}
                        />
                    ),
                }}
                {...props}
            />
        </div>
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
