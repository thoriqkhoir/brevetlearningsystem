import { Button } from "@/Components/ui/button";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";
import {
    BookPlus,
    CalendarClock,
    Copy,
    FileText,
    Pencil,
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

    return `${startText} • ${endText}`;
}

export default function Course({ courses, user }: any) {
    const { flash }: any = usePage().props;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null,
    );
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

    return (
        <TeacherLayout>
            <Head title="Daftar Kelas" />
            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Daftar Kelas
                    </h1>
                    <div className="rounded-2xl border bg-sidebar p-5 md:p-8">
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="text-sm text-gray-600">
                                Pantau kelas aktif, jadwal pelaksanaan, akses
                                materi, dan modul dalam satu tampilan ringkas.
                            </div>

                            {canCreateMore ? (
                                <Button asChild>
                                    <Link href={route("teacher.createCourse")}>
                                        <BookPlus />
                                        Buat Kelas Baru
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" disabled>
                                    Kelas sudah mencapai batas maksimal
                                </Button>
                            )}
                        </div>

                        <div className="mb-5 grid grid-cols-2 gap-2.5 lg:grid-cols-7">
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Total Kelas
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-primary">
                                    {courses.length}
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
                                    Total Jadwal
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-indigo-700">
                                    {statusSummary.schedules}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Total Ujian
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-amber-700">
                                    {statusSummary.tests}
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
                            {courses.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    <img
                                        src="/images/empty.svg"
                                        alt="Belum ada kelas"
                                        className="mx-auto mb-4 w-48"
                                    />
                                    <p>Belum ada kelas.</p>
                                </div>
                            )}
                            {coursesWithStatus.map((course: any) => {
                                return (
                                    <div
                                        key={course.id}
                                        className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-primary md:text-lg">
                                                    {course.name}
                                                </h3>
                                                {course.description &&
                                                    course.description !==
                                                        "-" && (
                                                        <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">
                                                            {course.description}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyCode(
                                                            course.id,
                                                            course.code,
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition ${copiedCodeId === course.id ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"}`}
                                                >
                                                    <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                                                        Kode
                                                    </span>
                                                    <span className="font-mono text-sm font-bold tracking-widest md:text-[15px]">
                                                        {course.code}
                                                    </span>
                                                    <Copy
                                                        size={13}
                                                        className="opacity-75"
                                                    />
                                                </button>
                                                {copiedCodeId === course.id && (
                                                    <span className="text-[11px] font-medium text-emerald-700">
                                                        Tersalin
                                                    </span>
                                                )}

                                                {course.modules_count > 0 ? (
                                                    <Link
                                                        href={route(
                                                            "course.modules.index",
                                                            course.id,
                                                        )}
                                                        className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700"
                                                    >
                                                        <FileText
                                                            className="mr-1"
                                                            size={13}
                                                        />{" "}
                                                        Modul :{" "}
                                                        {course.modules_count}
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={route(
                                                            "course.modules.index",
                                                            course.id,
                                                        )}
                                                        className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700"
                                                    >
                                                        Tidak ada modul
                                                    </Link>
                                                )}

                                                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                                                    <CalendarClock
                                                        className="mr-1"
                                                        size={13}
                                                    />
                                                    Jadwal :{" "}
                                                    {course.course_schedules_count ??
                                                        0}
                                                </span>

                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                                                    <FileText
                                                        className="mr-1"
                                                        size={13}
                                                    />
                                                    Ujian :{" "}
                                                    {course.course_tests_count ??
                                                        0}
                                                </span>

                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${course.status.color}`}
                                                >
                                                    {course.status.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 rounded-lg border bg-slate-50 p-2.5">
                                            <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                                Akses Materi
                                            </p>
                                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                {course.accessItems.length >
                                                0 ? (
                                                    course.accessItems.map(
                                                        (access: string) => (
                                                            <span
                                                                key={access}
                                                                className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700"
                                                            >
                                                                {normalizeAccessLabel(
                                                                    access,
                                                                )}
                                                            </span>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="italic text-gray-400">
                                                        Tidak ada akses materi
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2.5 rounded-lg border border-dashed bg-slate-50/70 p-2.5 text-xs text-gray-600">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <CalendarClock size={13} />
                                                <span className="font-medium text-slate-700">
                                                    Durasi Pengerjaan:
                                                </span>
                                                {formatDateRange(
                                                    course.start_date,
                                                    course.end_date,
                                                )}
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
                                                            "teacher.duplicateCourse",
                                                            course.id,
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
                                                        "teacher.showCourse",
                                                        course.id,
                                                    )}
                                                >
                                                    Lihat Kelas
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full md:w-fit text-yellow-700 border-yellow-200 hover:bg-yellow-50 flex items-center gap-1"
                                                asChild
                                            >
                                                <Link
                                                    href={route(
                                                        "teacher.editCourse",
                                                        course.id,
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
                                                    setSelectedCourseId(
                                                        course.id,
                                                    );
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
                            title="Hapus Kelas"
                            description="Apakah Anda yakin ingin menghapus kelas ini?"
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
