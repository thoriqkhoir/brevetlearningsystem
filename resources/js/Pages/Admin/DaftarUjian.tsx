import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Input } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { CalendarIcon, NotebookPen, RefreshCcw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type FilterState = {
    search: string;
    teacher_id: string;
    status: string;
    start_date_from: string;
    start_date_to: string;
    end_date_from: string;
    end_date_to: string;
};

const defaultFilters: FilterState = {
    search: "",
    teacher_id: "",
    status: "",
    start_date_from: "",
    start_date_to: "",
    end_date_from: "",
    end_date_to: "",
};

const toYmd = (date: Date) => {
    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000,
    );

    return localDate.toISOString().slice(0, 10);
};

const parseYmd = (value: string) => {
    if (!value) {
        return undefined;
    }

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
        return undefined;
    }

    return new Date(year, month - 1, day);
};

const formatFilterDateLabel = (value: string) => {
    const date = parseYmd(value);

    if (!date) {
        return "";
    }

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const getTestStatus = (test: any) => {
    const now = new Date();
    const startDate = test?.start_date ? new Date(test.start_date) : null;
    const endDate = test?.end_date ? new Date(test.end_date) : null;

    if (
        !startDate ||
        !endDate ||
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
    ) {
        return {
            label: "Tanpa Jadwal",
            className: "bg-gray-100 text-gray-700",
        };
    }

    if (now < startDate) {
        return {
            label: "Belum Mulai",
            className: "bg-orange-100 text-orange-700",
        };
    }

    if (now > endDate) {
        return {
            label: "Selesai",
            className: "bg-fuchsia-100 text-fuchsia-700",
        };
    }

    return {
        label: "Berlangsung",
        className: "bg-emerald-100 text-emerald-700",
    };
};

const normalizeFilterPayload = (filters: FilterState) => {
    return Object.fromEntries(
        Object.entries(filters).filter(
            ([, value]) => String(value).trim() !== "",
        ),
    );
};

export default function DaftarUjian({ tests, teachers, filters = {} }: any) {
    const [filterState, setFilterState] = useState<FilterState>({
        ...defaultFilters,
        ...filters,
    });
    const isFirstRender = useRef(true);
    const skipAutoFilter = useRef(false);

    const cards = tests?.data ?? [];

    const hasActiveFilter = useMemo(
        () =>
            Object.values(filterState).some(
                (value) => String(value).trim() !== "",
            ),
        [filterState],
    );

    const applyFilters = (nextFilters: FilterState) => {
        router.get(route("admin.tests"), normalizeFilterPayload(nextFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (skipAutoFilter.current) {
            skipAutoFilter.current = false;
            return;
        }

        const debounce = window.setTimeout(() => {
            applyFilters(filterState);
        }, 350);

        return () => window.clearTimeout(debounce);
    }, [filterState]);

    const setFilterValue = (key: keyof FilterState, value: string) => {
        setFilterState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetFilter = () => {
        skipAutoFilter.current = true;
        setFilterState(defaultFilters);
        applyFilters(defaultFilters);
    };

    return (
        <AdminLayout>
            <Head title="Daftar Ujian" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Daftar Ujian
                    </h1>
                    <p className="text-sm text-gray-500">
                        Daftar seluruh ujian yang dibuat pemateri beserta
                        informasi pemateri dan status pelaksanaan.
                    </p>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
                            <div className="xl:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        value={filterState.search}
                                        onChange={(event) =>
                                            setFilterValue(
                                                "search",
                                                event.target.value,
                                            )
                                        }
                                        className="pl-9"
                                        placeholder="Cari nama ujian atau kode"
                                    />
                                </div>
                            </div>
                            <div>
                                <Select
                                    value={filterState.teacher_id || "all"}
                                    onValueChange={(value) =>
                                        setFilterValue(
                                            "teacher_id",
                                            value === "all" ? "" : value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Pemateri" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Pemateri
                                        </SelectItem>
                                        {teachers.map((teacher: any) => (
                                            <SelectItem
                                                key={teacher.id}
                                                value={teacher.id}
                                            >
                                                {teacher.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Select
                                    value={filterState.status || "all"}
                                    onValueChange={(value) =>
                                        setFilterValue(
                                            "status",
                                            value === "all" ? "" : value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="ongoing">
                                            Berlangsung
                                        </SelectItem>
                                        <SelectItem value="upcoming">
                                            Belum Mulai
                                        </SelectItem>
                                        <SelectItem value="finished">
                                            Selesai
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2 xl:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 font-medium">
                                        Rentang Tanggal Mulai
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !filterState.start_date_from &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filterState.start_date_from
                                                        ? formatFilterDateLabel(
                                                              filterState.start_date_from,
                                                          )
                                                        : "Mulai dari"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={parseYmd(
                                                        filterState.start_date_from,
                                                    )}
                                                    onSelect={(date) =>
                                                        setFilterValue(
                                                            "start_date_from",
                                                            date
                                                                ? toYmd(date)
                                                                : "",
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !filterState.start_date_to &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filterState.start_date_to
                                                        ? formatFilterDateLabel(
                                                              filterState.start_date_to,
                                                          )
                                                        : "Mulai sampai"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={parseYmd(
                                                        filterState.start_date_to,
                                                    )}
                                                    onSelect={(date) =>
                                                        setFilterValue(
                                                            "start_date_to",
                                                            date
                                                                ? toYmd(date)
                                                                : "",
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 font-medium">
                                        Rentang Tanggal Selesai
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !filterState.end_date_from &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filterState.end_date_from
                                                        ? formatFilterDateLabel(
                                                              filterState.end_date_from,
                                                          )
                                                        : "Selesai dari"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={parseYmd(
                                                        filterState.end_date_from,
                                                    )}
                                                    onSelect={(date) =>
                                                        setFilterValue(
                                                            "end_date_from",
                                                            date
                                                                ? toYmd(date)
                                                                : "",
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !filterState.end_date_to &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {filterState.end_date_to
                                                        ? formatFilterDateLabel(
                                                              filterState.end_date_to,
                                                          )
                                                        : "Selesai sampai"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={parseYmd(
                                                        filterState.end_date_to,
                                                    )}
                                                    onSelect={(date) =>
                                                        setFilterValue(
                                                            "end_date_to",
                                                            date
                                                                ? toYmd(date)
                                                                : "",
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 xl:col-span-4 flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetFilter}
                                    disabled={!hasActiveFilter}
                                >
                                    Reset Filter
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-yellow-400 text-primary hover:bg-yellow-400/90 hover:text-primary"
                                    onClick={() => applyFilters(filterState)}
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {cards.length === 0 && (
                                <div className="text-gray-400 text-center col-span-3 py-8">
                                    <img
                                        src="/images/empty.svg"
                                        alt="Belum ada ujian yang ditemukan"
                                        className="mx-auto mb-4 w-48"
                                    />
                                    Belum ada ujian yang ditemukan.
                                </div>
                            )}

                            {cards.map((test: any) => {
                                const status = getTestStatus(test);

                                return (
                                    <div
                                        key={test.id}
                                        className="rounded-xl bg-white border shadow p-5 flex flex-col gap-2 hover:shadow-lg transition"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-lg font-bold text-primary line-clamp-2">
                                                {test.title}
                                            </h3>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono shrink-0">
                                                {test.code}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {test.description || "-"}
                                        </p>

                                        <div className="text-xs text-gray-600">
                                            <span className="font-medium">
                                                Pemateri:
                                            </span>{" "}
                                            {test.user?.name || "-"}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            <span className="font-medium">
                                                Jadwal:
                                            </span>{" "}
                                            {formatDateTime(test.start_date)} -{" "}
                                            {formatDateTime(test.end_date)}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                            <span>
                                                <span className="font-medium">
                                                    Durasi:
                                                </span>{" "}
                                                {typeof test.duration ===
                                                "number"
                                                    ? `${test.duration} menit`
                                                    : "-"}
                                            </span>
                                            <span>
                                                <span className="font-medium">
                                                    KKM:
                                                </span>{" "}
                                                {typeof test.passing_score ===
                                                "number"
                                                    ? test.passing_score
                                                    : "-"}
                                            </span>
                                            <span>
                                                <span className="font-medium">
                                                    Peserta:
                                                </span>{" "}
                                                {test.participants_count ?? 0}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${status.className}`}
                                            >
                                                {status.label}
                                            </span>
                                        </div>

                                        <Button
                                            variant="outline"
                                            asChild
                                            className="mt-2 w-fit text-blue-700 border-blue-200 hover:bg-blue-50"
                                        >
                                            <Link
                                                href={route(
                                                    "admin.showTeacherTest",
                                                    {
                                                        id: test.teacher_id,
                                                        testId: test.id,
                                                    },
                                                )}
                                            >
                                                <NotebookPen className="h-4 w-4" />
                                                Lihat Detail
                                            </Link>
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>

                        {tests?.links?.length > 3 && (
                            <div className="flex flex-wrap items-center gap-2 mt-6">
                                {tests.links.map((link: any, index: number) => {
                                    const key = `${link.label}-${index}`;
                                    const label = String(link.label)
                                        .replace("&laquo;", "«")
                                        .replace("&raquo;", "»");

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={key}
                                                className="px-3 py-1.5 rounded border text-sm text-gray-400"
                                            >
                                                {label}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={key}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            className={`px-3 py-1.5 rounded border text-sm ${
                                                link.active
                                                    ? "bg-primary text-white border-primary"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
