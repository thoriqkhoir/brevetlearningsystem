import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { CalendarClock, GraduationCap, NotebookPen } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect } from "react";
import toast from "react-hot-toast";

function parseLocalDateTime(value?: string | null) {
    if (!value) return null;

    const normalized = String(value).trim();

    const matched = normalized.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/,
    );

    if (!matched) {
        const parsed = new Date(normalized);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    return new Date(
        Number(matched[1]),
        Number(matched[2]) - 1,
        Number(matched[3]),
        Number(matched[4]),
        Number(matched[5]),
        Number(matched[6] ?? 0),
    );
}

function getStatus(start?: string | null, end?: string | null) {
    const now = new Date();
    const startDate = parseLocalDateTime(start);
    const endDate = parseLocalDateTime(end);

    if (startDate && now < startDate) {
        return {
            label: "Belum Mulai",
            color: "text-slate-700 bg-slate-100 border border-slate-200",
        };
    }

    if (endDate && now > endDate) {
        return {
            label: "Selesai",
            color: "text-rose-700 bg-rose-100 border border-rose-200",
        };
    }

    return {
        label: "Sedang Berlangsung",
        color: "text-emerald-700 bg-emerald-100 border border-emerald-200",
    };
}

function formatLocalDateTime(value?: string | null) {
    const date = parseLocalDateTime(value);
    if (!date) return "-";

    return format(date, "d MMMM yyyy, HH:mm", { locale: id });
}

function formatDateRange(start?: string | null, end?: string | null) {
    const startDate = parseLocalDateTime(start);
    const endDate = parseLocalDateTime(end);

    const startText = startDate
        ? format(startDate, "d MMMM yyyy", { locale: id })
        : "-";
    const endText = endDate
        ? format(endDate, "d MMMM yyyy", { locale: id })
        : "-";

    return `${startText} - ${endText}`;
}

export default function CourseTestDetail({
    course,
    courseTest,
    teacher,
    attemptHistory = [],
    lastAttempt = null,
    activeCourseTestId = null,
}: any) {
    const { flash }: any = usePage().props;
    const status = getStatus(courseTest?.start_date, courseTest?.end_date);
    const questionsShown =
        Number(courseTest?.questions_to_show ?? 0) > 0
            ? Number(courseTest?.questions_to_show)
            : Number(courseTest?.question_count ?? 0) > 0
              ? Number(courseTest?.question_count)
              : "Semua";
    const startDate = parseLocalDateTime(courseTest?.start_date);
    const endDate = parseLocalDateTime(courseTest?.end_date);
    const now = new Date();
    const isClosed = endDate ? now >= endDate : false;
    const notStarted = startDate ? now < startDate : false;
    const isActive = activeCourseTestId === courseTest?.id;
    const hasOtherActive =
        activeCourseTestId && activeCourseTestId !== courseTest?.id;
    const bestAttempt =
        attemptHistory.length > 0
            ? [...attemptHistory].sort((a: any, b: any) => {
                  const scoreDiff =
                      Number(b?.score ?? 0) - Number(a?.score ?? 0);
                  if (scoreDiff !== 0) return scoreDiff;

                  const bTime = b?.submitted_at
                      ? new Date(b.submitted_at).getTime()
                      : 0;
                  const aTime = a?.submitted_at
                      ? new Date(a.submitted_at).getTime()
                      : 0;

                  return bTime - aTime;
              })[0]
            : null;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    return (
        <AuthenticatedLayout>
            <Head title={`Ujian Kelas - ${courseTest?.title ?? "Ujian"}`} />

            <div className="py-8 mx-auto lg:px-4">
                <div className="max-w-7xl mx-auto p-4 space-y-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("courses")}>
                                    Daftar Kelas
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link href={route("courses.detail", course.id)}>
                                    {course?.name || "Detail Kelas"}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {courseTest?.title || "Ujian Kelas"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-primary">
                                Ujian Kelas: {courseTest?.title}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Detail ini termasuk dalam kelas{" "}
                                <span className="font-semibold text-primary">
                                    {course?.name || "-"}
                                </span>
                                .
                            </p>
                        </div>

                        <Button variant="outline" asChild>
                            <Link href={route("courses.detail", course.id)}>
                                Kembali ke Detail Kelas
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow space-y-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                                >
                                    {status.label}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold">
                                    <GraduationCap className="mr-1 h-3.5 w-3.5" />
                                    Bagian dari kelas {course?.name || "-"}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Pengajar:{" "}
                                    <span className="font-medium text-gray-700">
                                        {teacher?.name ?? "-"}
                                    </span>
                                </span>
                            </div>

                            <div>
                                {bestAttempt ? (
                                    <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                            bestAttempt.passed
                                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                                : "border-rose-200 bg-rose-100 text-rose-700"
                                        }`}
                                    >
                                        Nilai Terbaik: {bestAttempt.score} ({" "}
                                        {bestAttempt.passed
                                            ? "Lulus"
                                            : "Tidak lulus"}
                                        )
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        Nilai Terbaik: -
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm md:text-base">
                            {courseTest?.description ||
                                "Tidak ada deskripsi ujian."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg border p-3 bg-slate-50/70">
                                <div className="text-gray-500">Kelas</div>
                                <div className="font-semibold text-gray-800">
                                    {course?.name || "-"}
                                </div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-gray-500">Jumlah Soal</div>
                                <div className="font-semibold text-gray-800">
                                    {questionsShown}
                                </div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-gray-500">Durasi</div>
                                <div className="font-semibold text-gray-800">
                                    {courseTest?.duration
                                        ? `${courseTest.duration} menit`
                                        : "-"}
                                </div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-gray-500">
                                    Nilai Terbaik
                                </div>
                                <div className="font-semibold text-gray-800">
                                    {bestAttempt
                                        ? `${bestAttempt.score} (${bestAttempt.passed ? "Lulus" : "Tidak lulus"})`
                                        : "-"}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-dashed bg-slate-50/70 p-3 text-sm text-gray-700">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <CalendarClock size={14} />
                                <span className="font-medium">
                                    Mulai Ujian:
                                </span>
                                {formatLocalDateTime(courseTest?.start_date)}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <CalendarClock size={14} />
                                <span className="font-medium">
                                    Selesai Ujian:
                                </span>
                                {formatLocalDateTime(courseTest?.end_date)}
                            </div>
                        </div>

                        <div className="pt-1">
                            <Button
                                disabled={
                                    status.label !== "Sedang Berlangsung" ||
                                    Boolean(hasOtherActive)
                                }
                                onClick={() => {
                                    router.post(
                                        route("courses.courseTests.start", [
                                            course.id,
                                            courseTest.id,
                                        ]),
                                    );
                                }}
                            >
                                <NotebookPen className="mr-2 h-4 w-4" />
                                {isActive
                                    ? "Lanjutkan Ujian"
                                    : lastAttempt
                                      ? "Ulangi Mengerjakan"
                                      : "Mulai Ujian"}
                            </Button>
                            {hasOtherActive && (
                                <p className="mt-2 text-xs text-red-600">
                                    Anda memiliki ujian kelas aktif lain.
                                    Selesaikan terlebih dahulu sebelum memulai
                                    ujian ini.
                                </p>
                            )}
                            {!hasOtherActive && notStarted && (
                                <p className="mt-2 text-xs text-red-600">
                                    Ujian kelas belum mulai.
                                </p>
                            )}
                            {!hasOtherActive && isClosed && (
                                <p className="mt-2 text-xs text-red-600">
                                    Ujian kelas sudah ditutup.
                                </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                Anda dapat mengerjakan ulang selama ujian masih
                                berlangsung.
                            </p>
                        </div>

                        {attemptHistory.length > 0 && (
                            <div className="rounded-lg border bg-white p-3">
                                <p className="text-sm font-semibold text-slate-800 mb-2">
                                    Riwayat Sesi Ujian
                                </p>
                                <div className="space-y-2">
                                    {attemptHistory.map(
                                        (attempt: any, idx: number) => (
                                            <div
                                                key={attempt.id}
                                                className="flex flex-col gap-2 rounded-md border p-2.5 md:flex-row md:items-center md:justify-between"
                                            >
                                                <div className="text-sm text-slate-700">
                                                    <span className="font-medium">
                                                        Sesi{" "}
                                                        {attemptHistory.length -
                                                            idx}
                                                    </span>
                                                    <span className="mx-2 text-slate-400">
                                                        •
                                                    </span>
                                                    Skor: {attempt.score}
                                                    <span className="mx-2 text-slate-400">
                                                        •
                                                    </span>
                                                    {attempt.passed
                                                        ? "Lulus"
                                                        : "Tidak lulus"}
                                                    {attempt.submitted_at && (
                                                        <>
                                                            <span className="mx-2 text-slate-400">
                                                                •
                                                            </span>
                                                            {formatLocalDateTime(
                                                                attempt.submitted_at,
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            "courses.courseTests.result",
                                                            [
                                                                course.id,
                                                                courseTest.id,
                                                                attempt.id,
                                                            ],
                                                        )}
                                                    >
                                                        Lihat Hasil
                                                    </Link>
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
