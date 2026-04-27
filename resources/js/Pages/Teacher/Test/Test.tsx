import { Button } from "@/Components/ui/button";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";
import {
    BookPlus,
    CalendarClock,
    Clock3,
    Copy,
    Database,
    GraduationCap,
    ListChecks,
    Pencil,
    Target,
    Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { id } from "date-fns/locale";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";

function getStatus(
    start: string,
    durationMinutes?: number,
    end?: string | null,
) {
    const now = new Date();
    const startDate = new Date(start);
    const hasDuration =
        typeof durationMinutes === "number" && durationMinutes > 0;
    const endDate = end
        ? new Date(end)
        : hasDuration
          ? new Date(startDate.getTime() + durationMinutes * 60 * 1000)
          : null;

    if (isBefore(now, startDate)) {
        return {
            key: "upcoming",
            label: "Belum Mulai",
            color: "border border-slate-200 bg-slate-100 text-slate-700",
        };
    }

    if (endDate) {
        if (isAfter(now, endDate))
            return {
                key: "finished",
                label: "Selesai",
                color: "border border-rose-200 bg-rose-100 text-rose-700",
            };
        if (isWithinInterval(now, { start: startDate, end: endDate }))
            return {
                key: "ongoing",
                label: "Sedang Berlangsung",
                color: "border border-emerald-200 bg-emerald-100 text-emerald-700",
            };
    } else {
        return {
            key: "ongoing",
            label: "Sedang Berlangsung",
            color: "border border-emerald-200 bg-emerald-100 text-emerald-700",
        };
    }

    return {
        key: "unknown",
        label: "-",
        color: "border border-gray-200 bg-gray-100 text-gray-500",
    };
}

function formatDateTime(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    return `${format(date, "d MMMM yyyy", { locale: id })} • ${format(date, "HH:mm", { locale: id })}`;
}

export default function Test({ tests = [], user }: any) {
    const { flash }: any = usePage().props;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    function handleDeleteSelected() {
        if (selectedTestId) {
            router.delete(route("teacher.destroyTest", selectedTestId));
            setOpenDeleteModal(false);
            setSelectedTestId(null);
        }
    }

    async function handleCopyCode(testId: string, code: string) {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(code);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setCopiedCodeId(testId);
            toast.success(`Kode ujian ${code} berhasil disalin`);
            setTimeout(() => {
                setCopiedCodeId((current) =>
                    current === testId ? null : current,
                );
            }, 1500);
        } catch {
            toast.error("Gagal menyalin kode ujian");
        }
    }

    const canCreateMore =
        typeof user?.max_test !== "number" || tests.length < user.max_test;

    const testsWithStatus = tests.map((test: any) => ({
        ...test,
        status: getStatus(test.start_date, test.duration, test.end_date ?? null),
    }));

    const statusSummary = testsWithStatus.reduce(
        (acc: any, test: any) => {
            if (test.status.key === "ongoing") acc.ongoing += 1;
            if (test.status.key === "upcoming") acc.upcoming += 1;
            if (test.status.key === "finished") acc.finished += 1;
            return acc;
        },
        { ongoing: 0, upcoming: 0, finished: 0 },
    );

    const remainingQuota =
        typeof user?.max_test === "number"
            ? Math.max(user.max_test - tests.length, 0)
            : null;

    const statCards = [
        {
            label: "Total Ujian",
            value: tests.length,
            color: "text-teal-700",
            bg: "bg-teal-50/80 border-teal-100",
        },
        {
            label: "Sedang Berlangsung",
            value: statusSummary.ongoing,
            color: "text-emerald-700",
            bg: "bg-emerald-50/80 border-emerald-100",
        },
        {
            label: "Belum Mulai",
            value: statusSummary.upcoming,
            color: "text-slate-700",
            bg: "bg-slate-50/80 border-slate-200",
        },
        {
            label: "Selesai",
            value: statusSummary.finished,
            color: "text-rose-700",
            bg: "bg-rose-50/80 border-rose-100",
        },
        {
            label: "Sisa Kuota",
            value: remainingQuota ?? "∞",
            color: "text-amber-700",
            bg: "bg-amber-50/80 border-amber-100",
        },
    ];

    return (
        <TeacherLayout>
            <Head title="Daftar Ujian" />

            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_40%)]" />

                <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">

                    {/* Page Header */}
                    <div className="mb-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                    Teacher Portal
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold text-slate-800 md:text-3xl">
                                    Daftar Ujian
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Kelola ujian Anda — status pelaksanaan, pengaturan bank soal, dan aksi cepat dalam satu tempat.
                                </p>
                            </div>
                            {canCreateMore ? (
                                <Button asChild>
                                    <Link href={route("teacher.createTest")}>
                                        <BookPlus size={16} />
                                        Buat Ujian Baru
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" disabled>
                                    Ujian sudah mencapai batas maksimal
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Stat Bar */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {statCards.map((s) => (
                            <div
                                key={s.label}
                                className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md ${s.bg}`}
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    {s.label}
                                </p>
                                <p className={`mt-1 text-xl font-bold ${s.color}`}>
                                    {s.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Test List */}
                    <div className="space-y-4">
                        {tests.length === 0 && (
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 py-16 text-center shadow-sm">
                                <img
                                    src="/images/empty.svg"
                                    alt="Belum ada ujian"
                                    className="mx-auto mb-4 w-40 opacity-70"
                                />
                                <p className="text-base font-semibold text-amber-900">
                                    Belum ada ujian.
                                </p>
                                <p className="mt-1 text-sm text-amber-800/70">
                                    Mulai dengan membuat ujian pertama Anda.
                                </p>
                            </div>
                        )}

                        {testsWithStatus.map((test: any) => (
                            <div
                                key={test.id}
                                className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-6"
                            >
                                {/* Card Header */}
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-slate-800 md:text-xl">
                                            {test.title}
                                        </h2>
                                        {test.description && test.description !== "-" && (
                                            <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                                                {test.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Copy Code Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleCopyCode(test.id, test.code)}
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all duration-200 ${
                                                copiedCodeId === test.id
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
                                            }`}
                                        >
                                            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                                                Kode
                                            </span>
                                            <span className="font-mono font-bold tracking-widest">
                                                {test.code}
                                            </span>
                                            <Copy size={12} className="opacity-60" />
                                        </button>
                                        {copiedCodeId === test.id && (
                                            <span className="text-[11px] font-medium text-emerald-700">
                                                ✓ Tersalin
                                            </span>
                                        )}

                                        {/* Status Badge */}
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${test.status.color}`}>
                                            {test.status.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    <div className="rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                                            Durasi
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                                            <Clock3 size={13} className="text-teal-600" />
                                            {test.duration
                                                ? `${test.duration} menit`
                                                : "Tidak terbatas"}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                                            Passing Score
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                                            <Target size={13} className="text-amber-600" />
                                            {test.passing_score || 0}%
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
                                            Bank Soal
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800 line-clamp-1">
                                            <Database size={13} className="text-cyan-600 shrink-0" />
                                            {test.question_bank?.name || "-"}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                            Soal Ditampilkan
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                                            <ListChecks size={13} className="text-slate-500" />
                                            {test.questions_to_show ?? test.question_count ?? 0}
                                            <span className="font-normal text-slate-500">
                                                / {test.question_count ?? 0}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Schedule Info */}
                                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                                    <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarClock size={13} className="text-slate-500 shrink-0" />
                                            <span className="font-semibold text-slate-700">Dimulai:</span>
                                            {formatDateTime(test.start_date)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarClock size={13} className="text-slate-500 shrink-0" />
                                            <span className="font-semibold text-slate-700">Ditutup:</span>
                                            {formatDateTime(test.end_date)}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
                                        disabled={!canCreateMore}
                                        onClick={() => {
                                            if (!canCreateMore) return;
                                            router.post(
                                                route("teacher.duplicateTest", test.id),
                                            );
                                        }}
                                    >
                                        <Copy size={15} />
                                        Duplikat
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto"
                                        asChild
                                    >
                                        <Link href={route("teacher.showTest", test.id)}>
                                            <GraduationCap size={15} />
                                            Lihat Detail
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-amber-200 text-amber-700 hover:bg-amber-50"
                                        asChild
                                    >
                                        <Link href={route("teacher.editTest", test.id)}>
                                            <Pencil size={15} />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-rose-200 text-rose-700 hover:bg-rose-50"
                                        onClick={() => {
                                            setSelectedTestId(test.id);
                                            setOpenDeleteModal(true);
                                        }}
                                    >
                                        <Trash size={15} />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                title="Hapus Ujian"
                description="Apakah Anda yakin ingin menghapus Ujian ini?"
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDeleteSelected}
            />
        </TeacherLayout>
    );
}
