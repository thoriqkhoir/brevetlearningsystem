import { Button } from "@/Components/ui/button";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";
import {
    BookOpen,
    BookPlus,
    CalendarClock,
    CheckCircle2,
    Clock4,
    Copy,
    FileText,
    Pencil,
    Timer,
    Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { id } from "date-fns/locale";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";

function getStatus(start: string, end: string) {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isBefore(now, startDate))
        return {
            key: "upcoming",
            label: "Belum Mulai",
            color: "bg-slate-100 text-slate-700 border border-slate-200",
        };
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
    return {
        key: "unknown",
        label: "-",
        color: "bg-gray-100 text-gray-500 border border-gray-200",
    };
}

function parseAccessRights(value: string | null): string[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item) => typeof item === "string");
    } catch {
        return [];
    }
}

function normalizeAccessLabel(access: string) {
    if (access === "efaktur") return "e-Faktur";
    if (access === "ebupot") return "e-Bupot";
    return access;
}

function formatDateRange(start?: string | null, end?: string | null) {
    const startText = start
        ? format(new Date(start), "d MMMM yyyy", { locale: id })
        : "-";
    const endText = end
        ? format(new Date(end), "d MMMM yyyy", { locale: id })
        : "-";
    return `${startText} — ${endText}`;
}

export default function Course({ courses, user }: any) {
    const { flash }: any = usePage().props;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    function handleDeleteSelected() {
        if (selectedCourseId) {
            router.delete(route("teacher.destroyCourse", selectedCourseId));
            setOpenDeleteModal(false);
            setSelectedCourseId(null);
        }
    }

    async function handleCopyCode(courseId: string, code: string) {
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
            setCopiedCodeId(courseId);
            toast.success(`Kode kelas ${code} berhasil disalin`);
            setTimeout(() => {
                setCopiedCodeId((current) =>
                    current === courseId ? null : current,
                );
            }, 1500);
        } catch {
            toast.error("Gagal menyalin kode kelas");
        }
    }

    const canCreateMore =
        typeof user?.max_class !== "number" || courses.length < user.max_class;

    const coursesWithStatus = courses.map((course: any) => ({
        ...course,
        status: getStatus(course.start_date, course.end_date),
        accessItems: parseAccessRights(course.access_rights),
    }));

    const statusSummary = coursesWithStatus.reduce(
        (acc: any, course: any) => {
            acc.schedules += Number(course.course_schedules_count ?? 0);
            acc.tests += Number(course.course_tests_count ?? 0);
            if (course.status.key === "ongoing") acc.ongoing += 1;
            if (course.status.key === "upcoming") acc.upcoming += 1;
            if (course.status.key === "finished") acc.finished += 1;
            return acc;
        },
        { ongoing: 0, upcoming: 0, finished: 0, schedules: 0, tests: 0 },
    );

    const remainingQuota =
        typeof user?.max_class === "number"
            ? Math.max(user.max_class - courses.length, 0)
            : null;

    const statCards = [
        {
            label: "Total Kelas",
            value: courses.length,
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
            label: "Total Jadwal",
            value: statusSummary.schedules,
            color: "text-cyan-700",
            bg: "bg-cyan-50/80 border-cyan-100",
        },
        {
            label: "Total Ujian",
            value: statusSummary.tests,
            color: "text-amber-700",
            bg: "bg-amber-50/80 border-amber-100",
        },
        {
            label: "Sisa Kuota",
            value: remainingQuota ?? "∞",
            color: "text-teal-700",
            bg: "bg-teal-50/80 border-teal-100",
        },
    ];

    return (
        <TeacherLayout>
            <Head title="Daftar Kelas" />

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
                                    Daftar Kelas
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Pantau kelas aktif, jadwal pelaksanaan, akses materi, dan modul dalam satu tampilan ringkas.
                                </p>
                            </div>
                            {canCreateMore ? (
                                <Button asChild>
                                    <Link href={route("teacher.createCourse")}>
                                        <BookPlus className="mr-1" />
                                        Buat Kelas Baru
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" disabled>
                                    Kelas sudah mencapai batas maksimal
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Stat Bar */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
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

                    {/* Course List */}
                    <div className="space-y-4">
                        {courses.length === 0 && (
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 py-16 text-center shadow-sm">
                                <img
                                    src="/images/empty.svg"
                                    alt="Belum ada kelas"
                                    className="mx-auto mb-4 w-40 opacity-70"
                                />
                                <p className="text-base font-semibold text-amber-900">
                                    Belum ada kelas.
                                </p>
                                <p className="mt-1 text-sm text-amber-800/70">
                                    Mulai dengan membuat kelas pertama Anda.
                                </p>
                            </div>
                        )}

                        {coursesWithStatus.map((course: any) => (
                            <div
                                key={course.id}
                                className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-6"
                            >
                                {/* Card Header */}
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-slate-800 md:text-xl">
                                            {course.name}
                                        </h2>
                                        {course.description && course.description !== "-" && (
                                            <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                                                {course.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Copy Code Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleCopyCode(course.id, course.code)}
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all duration-200 ${
                                                copiedCodeId === course.id
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
                                            }`}
                                        >
                                            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                                                Kode
                                            </span>
                                            <span className="font-mono font-bold tracking-widest">
                                                {course.code}
                                            </span>
                                            <Copy size={12} className="opacity-60" />
                                        </button>
                                        {copiedCodeId === course.id && (
                                            <span className="text-[11px] font-medium text-emerald-700">
                                                ✓ Tersalin
                                            </span>
                                        )}

                                        {/* Status Badge */}
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${course.status.color}`}>
                                            {course.status.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Info Chips Row */}
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {course.modules_count > 0 ? (
                                        <Link
                                            href={route("course.modules.index", course.id)}
                                            className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-200 transition-colors"
                                        >
                                            <FileText size={12} />
                                            Modul: {course.modules_count}
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route("course.modules.index", course.id)}
                                            className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-200 transition-colors"
                                        >
                                            Tidak ada modul
                                        </Link>
                                    )}
                                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                                        <CalendarClock size={12} />
                                        Jadwal: {course.course_schedules_count ?? 0}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                        <BookOpen size={12} />
                                        Ujian: {course.course_tests_count ?? 0}
                                    </span>
                                </div>

                                {/* Access Rights */}
                                <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                                        Akses Materi
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {course.accessItems.length > 0 ? (
                                            course.accessItems.map((access: string) => (
                                                <span
                                                    key={access}
                                                    className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800"
                                                >
                                                    {normalizeAccessLabel(access)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="italic text-slate-400 text-sm">
                                                Tidak ada akses materi
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5">
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                        <Timer size={13} className="text-slate-500" />
                                        <span className="font-semibold text-slate-700">
                                            Durasi Kelas:
                                        </span>
                                        {formatDateRange(course.start_date, course.end_date)}
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
                                                route("teacher.duplicateCourse", course.id),
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
                                        <Link href={route("teacher.showCourse", course.id)}>
                                            Lihat Kelas
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-amber-200 text-amber-700 hover:bg-amber-50"
                                        asChild
                                    >
                                        <Link href={route("teacher.editCourse", course.id)}>
                                            <Pencil size={15} />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-rose-200 text-rose-700 hover:bg-rose-50"
                                        onClick={() => {
                                            setSelectedCourseId(course.id);
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
                title="Hapus Kelas"
                description="Apakah Anda yakin ingin menghapus kelas ini?"
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDeleteSelected}
            />
        </TeacherLayout>
    );
}
