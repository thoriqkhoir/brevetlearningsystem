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
            color: "bg-slate-100 text-slate-700 border border-slate-200",
        };
    }

    if (endDate) {
        if (isAfter(now, endDate))
            return {
                key: "finished",
                label: "Selesai",
                color: "bg-rose-100 text-rose-700 border border-rose-200",
            };
        if (isWithinInterval(now, { start: startDate, end: endDate }))
            return {
                key: "ongoing",
                label: "Sedang Berlangsung",
                color: "bg-emerald-100 text-emerald-700 border border-emerald-200",
            };
    } else {
        // Tanpa durasi, setelah mulai dianggap sedang berlangsung
        return {
            key: "ongoing",
            label: "Sedang Berlangsung",
            color: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        };
    }

    return {
        key: "unknown",
        label: "-",
        color: "bg-gray-100 text-gray-500 border border-gray-200",
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
        } catch (error) {
            toast.error("Gagal menyalin kode ujian");
        }
    }

    const canCreateMore =
        typeof user?.max_test !== "number" || tests.length < user.max_test;

    const testsWithStatus = tests.map((test: any) => ({
        ...test,
        status: getStatus(
            test.start_date,
            test.duration,
            test.end_date ?? null,
        ),
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

    return (
        <TeacherLayout>
            <Head title="Daftar Ujian" />
            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Daftar Ujian
                    </h1>
                    <div className="rounded-2xl border bg-sidebar p-5 md:p-8">
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="text-sm text-gray-600">
                                Kelola ujian Anda dalam satu tempat, lengkap
                                dengan status pelaksanaan, pengaturan bank soal,
                                dan aksi cepat.
                            </div>

                            {canCreateMore ? (
                                <Button asChild>
                                    <Link href={route("teacher.createTest")}>
                                        <BookPlus />
                                        Buat Ujian Baru
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" disabled>
                                    Ujian sudah mencapai batas maksimal
                                </Button>
                            )}
                        </div>

                        <div className="mb-5 grid grid-cols-2 gap-2.5 lg:grid-cols-5">
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Total Ujian
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-primary">
                                    {tests.length}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Sedang Berlangsung
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-emerald-700">
                                    {statusSummary.ongoing}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Belum Mulai
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-slate-700">
                                    {statusSummary.upcoming}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Selesai
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-rose-700">
                                    {statusSummary.finished}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Sisa Kuota
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-blue-700">
                                    {remainingQuota ?? "-"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {tests.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    <img
                                        src="/images/empty.svg"
                                        alt="Belum ada ujian"
                                        className="mx-auto mb-4 w-48"
                                    />
                                    Belum ada ujian.
                                </div>
                            )}
                            {testsWithStatus.map((test: any) => {
                                return (
                                    <div
                                        key={test.id}
                                        className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-primary md:text-lg">
                                                    {test.title}
                                                </h3>
                                                {test.description &&
                                                    test.description !==
                                                        "-" && (
                                                        <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">
                                                            {test.description}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyCode(
                                                            test.id,
                                                            test.code,
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition ${copiedCodeId === test.id ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"}`}
                                                >
                                                    <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                                                        Kode
                                                    </span>
                                                    <span className="font-mono text-sm font-bold tracking-widest md:text-[15px]">
                                                        {test.code}
                                                    </span>
                                                    <Copy
                                                        size={13}
                                                        className="opacity-75"
                                                    />
                                                </button>
                                                {copiedCodeId === test.id && (
                                                    <span className="text-[11px] font-medium text-emerald-700">
                                                        Tersalin
                                                    </span>
                                                )}
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${test.status.color}`}
                                                >
                                                    {test.status.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                                            <div className="rounded-lg border bg-slate-50 p-2.5">
                                                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                                    Durasi
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-slate-900">
                                                    <Clock3 size={13} />
                                                    {test.duration
                                                        ? `${test.duration} menit`
                                                        : "Tidak terbatas"}
                                                </p>
                                            </div>
                                            <div className="rounded-lg border bg-slate-50 p-2.5">
                                                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                                    Passing Score
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-slate-900">
                                                    <Target size={13} />
                                                    {test.passing_score || 0}%
                                                </p>
                                            </div>
                                            <div className="rounded-lg border bg-slate-50 p-2.5">
                                                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                                    Bank Soal
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-slate-900 line-clamp-1">
                                                    <Database size={13} />
                                                    {test.question_bank?.name ||
                                                        "-"}
                                                </p>
                                            </div>
                                            <div className="rounded-lg border bg-slate-50 p-2.5">
                                                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                                    Soal Ditampilkan
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-slate-900">
                                                    <ListChecks size={13} />
                                                    {test.questions_to_show ??
                                                        test.question_count ??
                                                        0}
                                                    <span className="text-slate-500 font-normal">
                                                        /{" "}
                                                        {test.question_count ??
                                                            0}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2.5 rounded-lg border border-dashed bg-slate-50/70 p-2.5 text-xs text-gray-600">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <CalendarClock size={13} />
                                                <span className="font-medium text-slate-700">
                                                    Dimulai:
                                                </span>
                                                {formatDateTime(
                                                    test.start_date,
                                                )}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                <CalendarClock size={13} />
                                                <span className="font-medium text-slate-700">
                                                    Ditutup:
                                                </span>
                                                {formatDateTime(test.end_date)}
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2 md:flex">
                                            <Button
                                                variant="outline"
                                                className="w-full md:w-fit text-purple-700 border-purple-200 hover:bg-purple-50 flex items-center gap-1"
                                                disabled={!canCreateMore}
                                                onClick={() => {
                                                    if (!canCreateMore) return;
                                                    router.post(
                                                        route(
                                                            "teacher.duplicateTest",
                                                            test.id,
                                                        ),
                                                    );
                                                }}
                                            >
                                                <Copy size={16} />
                                                Duplikat
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full md:w-fit text-blue-700 border-blue-200 hover:bg-blue-50"
                                                asChild
                                            >
                                                <Link
                                                    href={route(
                                                        "teacher.showTest",
                                                        test.id,
                                                    )}
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full md:w-fit text-yellow-700 border-yellow-200 hover:bg-yellow-50 flex items-center gap-1"
                                                asChild
                                            >
                                                <Link
                                                    href={route(
                                                        "teacher.editTest",
                                                        test.id,
                                                    )}
                                                >
                                                    <Pencil size={16} />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full md:w-fit text-red-700 border-red-200 hover:bg-red-50 flex items-center gap-1"
                                                onClick={() => {
                                                    setSelectedTestId(test.id);
                                                    setOpenDeleteModal(true);
                                                }}
                                            >
                                                <Trash size={16} />
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <ConfirmDialog
                            title="Hapus Ujian"
                            description="Apakah Anda yakin ingin menghapus Ujian ini?"
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onConfirm={handleDeleteSelected}
                        />
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
