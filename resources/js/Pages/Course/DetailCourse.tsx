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
import { DoorOpen, FileText } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import FakturKeluaran from "./CourseResults/FakturKeluaran";
import FakturMasukan from "./CourseResults/FakturMasukan";
import Bupot from "./CourseResults/Bupot";
import SPT from "./CourseResults/SPT";
import ReturKeluaran from "./CourseResults/ReturKeluaran";
import ReturMasukan from "./CourseResults/ReturMasukan";
import DokumenKeluaran from "./CourseResults/DokumenKeluaran";
import DokumenMasukan from "./CourseResults/DokumenMasukan";
import ReturDokumenKeluaran from "./CourseResults/ReturDokumenKeluaran";
import ReturDokumenMasukan from "./CourseResults/ReturDokumenMasukan";
import StudentCourseSubmissionsSection from "@/Components/layout/Submission/StudentCourseSubmissionsSection";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function parseLocalDate(value?: string | null) {
    if (!value) return null;
    const match = String(value).match(
        /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/,
    );
    if (!match) return null;
    return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6] ?? 0),
    );
}

function formatLocalDateTime(value?: string | null) {
    const date = parseLocalDate(value);
    if (!date) return value || "-";

    const day = date.getDate();
    const months = [
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
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}.${minutes} WIB`;
}

function getStatus(start: string, end: string) {
    const now = new Date();
    const startDate = parseLocalDate(start) || new Date(0);
    const endDate = parseLocalDate(end) || new Date(0);

    if (now < startDate)
        return { label: "Belum Mulai", color: "text-gray-500 bg-gray-100" };
    if (now > endDate)
        return { label: "Selesai", color: "text-red-700 bg-red-100" };
    if (now >= startDate && now <= endDate)
        return {
            label: "Sedang Berlangsung",
            color: "text-green-700 bg-green-100",
        };
    return { label: "-", color: "text-gray-400 bg-gray-50" };
}

export default function DetailCourse({
    course,
    pivot,
    teacher,
    courseSchedules = [],
    courseSubmissions = [],
    courseTests = [],
    active_course_id,
    fakturs,
    returs,
    others,
    returOthers,
    bupots,
    spts,
    courseResults,
}: any) {
    const { flash }: any = usePage().props;
    const status = getStatus(course.start_date, course.end_date);
    const isActive = active_course_id === course.id;
    const hasOtherActive = active_course_id && active_course_id !== course.id;

    const calculateAverageScore = () => {
        if (!courseResults || courseResults.length === 0) return null;

        const validScores = courseResults
            .filter(
                (result: any) =>
                    result.score !== null && result.score !== undefined,
            )
            .map((result: any) => parseFloat(result.score));

        if (validScores.length === 0) return null;

        const average =
            validScores.reduce((sum: number, score: number) => sum + score, 0) /
            validScores.length;
        return Math.round(average * 100) / 100;
    };

    const averageScore = calculateAverageScore();

    useEffect(() => {
        if (flash?.success) {
            toast.dismiss();
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.dismiss();
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Kelas - ${course.name}`} />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("courses")}>
                                    Daftar Kelas
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Kelas {course.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {course.has_active_remedial && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800 flex items-start gap-3 shadow-sm mt-2">
                            <span className="text-xl leading-none">⚠️</span>
                            <div>
                                <h4 className="font-semibold text-rose-900 mb-1">Informasi Ujian Remedial</h4>
                                <p>
                                    Anda memiliki ujian remedial aktif yang perlu diselesaikan di kelas ini.
                                    {!isActive ? (
                                        <> Silakan klik tombol <strong>Mulai Mengerjakan</strong> di bawah untuk membuka akses pengerjaan remedial.</>
                                    ) : (
                                        <> Akses kelas aktif. Silakan pilih tab <strong>Ujian Kelas</strong> di bawah untuk mulai mengerjakan ujian remedial.</>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-primary mb-1">
                                Kelas {course.name}
                            </h1>
                            <div className="text-sm text-gray-500">
                                Pengajar :{" "}
                                <span className="font-semibold text-primary">
                                    {teacher?.name || "-"}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Institusi :{" "}
                                <span className="font-semibold text-primary">
                                    {teacher?.institution || "-"}
                                </span>
                            </div>
                            <div
                                className={`mt-2 w-fit px-2 py-1 rounded text-xs font-semibold ${status.color}`}
                            >
                                Kelas {status.label}
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                            {!isActive ? (
                                <Button
                                    onClick={() =>
                                        router.post(
                                            route("courses.start", course.id),
                                        )
                                    }
                                    variant="outline"
                                    className="text-green-700 bg-green-50 border-green-400 hover:bg-green-100 hover:text-green-700"
                                    disabled={
                                        (status.label !== "Sedang Berlangsung" && !course.has_active_remedial) ||
                                        hasOtherActive
                                    }
                                >
                                    Mulai Mengerjakan
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:text-orange-700"
                                    onClick={() =>
                                        router.post(route("courses.stop"))
                                    }
                                >
                                    Hentikan Pengerjaan
                                </Button>
                            )}
                            {status.label === "Sedang Berlangsung" ? (
                                hasOtherActive && (
                                    <div className="text-sm md:text-right text-red-600 mt-1">
                                        Anda memiliki kelas aktif lain.
                                        <br />
                                        Selesaikan kelas tersebut terlebih
                                        dahulu sebelum mengerjakan kelas ini.
                                    </div>
                                )
                            ) : (
                                <div className="text-sm md:text-right mt-1">
                                    {status.label === "Belum Mulai" && (
                                        <div className="text-red-600">
                                            Kelas belum mulai.
                                            <br />
                                            Tunggu waktu mulai kelas untuk dapat
                                            mengerjakan.
                                        </div>
                                    )}
                                    {status.label === "Selesai" && (
                                        course.has_active_remedial ? (
                                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-800 text-left md:text-right max-w-sm">
                                                <p className="font-semibold mb-0.5">⚠️ Perlu Remedial</p>
                                                <p>
                                                    Terdapat ujian remedial yang perlu Anda kerjakan pada kelas ini.
                                                    {course.remedial_deadline && (
                                                        <> Batas akhir pengumpulan: <br /><span className="font-semibold">{new Date(course.remedial_deadline).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</span>.</>
                                                    )}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-red-600">
                                                Kelas sudah selesai.
                                                <br />
                                                Anda tidak dapat mengerjakan kelas
                                                ini lagi.
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-white border shadow p-6 flex flex-col gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-2">
                            <div className="col-span-1 md:col-span-2">
                                <Button
                                    variant="outline"
                                    className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    asChild
                                >
                                    <Link
                                        href={route(
                                            "course.showModules",
                                            course.id,
                                        )}
                                    >
                                        <FileText size={16} />
                                        Lihat Modul ({course.modules_count || 0}
                                        )
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex-1">
                                <div className="text-sm text-gray-500">
                                    Deskripsi
                                </div>
                                <div className="font-medium text-gray-700 mb-2">
                                    {course.description || "-"}
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Durasi Pengerjaan
                                    </div>
                                    <div className="font-medium text-gray-700">
                                        {course.start_date
                                            ? new Date(
                                                  course.start_date,
                                              ).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                        {" - "}
                                        {course.end_date
                                            ? new Date(
                                                  course.end_date,
                                              ).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Nilai Anda
                                    </span>
                                    <div className="font-mono text-lg font-bold text-primary">
                                        {averageScore !== null ? (
                                            averageScore
                                        ) : (
                                            <span className="italic text-gray-400">
                                                Belum dinilai
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Feedback
                                    </span>
                                    <div className="text-gray-700">
                                        {pivot?.feedback ? (
                                            pivot.feedback
                                        ) : (
                                            <span className="italic text-gray-400">
                                                Belum ada feedback
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tugas / Submission Kelas Siswa */}
                    <StudentCourseSubmissionsSection
                        courseId={course.id}
                        courseSubmissions={courseSubmissions}
                    />

                    <div className="rounded-xl bg-white border shadow p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-primary">
                            Jadwal Kelas & Ujian Kelas
                        </h2>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Jadwal Kelas ({courseSchedules.length})
                            </h3>
                            {courseSchedules.length > 0 ? (
                                <div className="space-y-2">
                                    {courseSchedules.map((schedule: any) => (
                                        <div
                                            key={schedule.id}
                                            className="rounded-lg border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {schedule.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatLocalDateTime(
                                                        schedule.scheduled_at,
                                                    )}
                                                </div>
                                            </div>
                                            {schedule.zoom_link ? (
                                                <a
                                                    href={schedule.zoom_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-medium text-blue-700 hover:underline"
                                                >
                                                    Buka Link Meeting
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">
                                                    Link meeting belum tersedia
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Belum ada jadwal kelas.
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Ujian Kelas ({courseTests.length})
                            </h3>
                            {courseTests.length > 0 ? (
                                <div className="space-y-2">
                                    {courseTests.map((courseTest: any) => {
                                        const isRemedialMode = !!courseTest?.is_remedial_mode;
                                        const maxAttempts = Number(
                                            courseTest?.max_attempts ?? 0,
                                        );
                                        const usedAttempts = Number(
                                            courseTest?.attempts_used ?? 0,
                                        );
                                        const isUnlimited = isRemedialMode
                                            ? (courseTest?.remedial_status !== 'passed')
                                            : maxAttempts <= 0;
                                        const progress = isUnlimited
                                            ? 100
                                            : maxAttempts > 0
                                              ? Math.min(
                                                    100,
                                                    Math.round(
                                                        (usedAttempts /
                                                            maxAttempts) *
                                                            100,
                                                    ),
                                                )
                                              : 0;
                                        const attemptStatus = isRemedialMode
                                            ? (courseTest?.remedial_status === 'passed'
                                                ? {
                                                      label: "Lulus Remedial",
                                                      text: "text-emerald-700 bg-emerald-100",
                                                      bar: "bg-emerald-500",
                                                  }
                                                : {
                                                      label: "Remedial Aktif",
                                                      text: "text-rose-700 bg-rose-100",
                                                      bar: "bg-rose-500",
                                                  })
                                            : (isUnlimited
                                                ? {
                                                      label: "Tanpa batas",
                                                      text: "text-blue-700 bg-blue-100",
                                                      bar: "bg-blue-500",
                                                  }
                                                : usedAttempts <= 0
                                                  ? {
                                                        label: "Belum mengerjakan",
                                                        text: "text-emerald-700 bg-emerald-100",
                                                        bar: "bg-emerald-500",
                                                    }
                                                  : usedAttempts >= maxAttempts
                                                    ? {
                                                          label: "Habis",
                                                          text: "text-rose-700 bg-rose-100",
                                                          bar: "bg-rose-500",
                                                      }
                                                    : {
                                                          label: "Mengerjakan sebagian",
                                                          text: "text-amber-700 bg-amber-100",
                                                          bar: "bg-amber-500",
                                                      });
                                        const showScore =
                                            courseTest?.show_score ?? true;
                                        const bestAttemptLabel = courseTest
                                            ?.best_attempt?.passed
                                            ? "Lulus"
                                            : "Tidak lulus";

                                        return (
                                            <div
                                                key={courseTest.id}
                                                className="rounded-xl border bg-slate-50/60 p-4"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                                    <div>
                                                        <div className="font-semibold text-gray-800 text-base flex flex-wrap items-center gap-2">
                                                            {courseTest.title}
                                                            {isRemedialMode && (
                                                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-rose-700 bg-rose-100 border border-rose-200">
                                                                    Remedial
                                                                </span>
                                                            )}
                                                            {Boolean(courseTest.requires_submission) && (
                                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                                                    courseTest.submission?.status === 'approved'
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                        : courseTest.submission?.status === 'pending_review'
                                                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                        : courseTest.submission?.status === 'rejected'
                                                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                                }`}>
                                                                    {courseTest.submission?.status === 'approved'
                                                                        ? '✓ Tugas Disetujui'
                                                                        : courseTest.submission?.status === 'pending_review'
                                                                        ? '⏳ Tugas Pending'
                                                                        : courseTest.submission?.status === 'rejected'
                                                                        ? '✕ Tugas Ditolak'
                                                                        : 'Wajib Tugas'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="md:self-start">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "courses.courseTests.detail",
                                                                    [
                                                                        course.id,
                                                                        courseTest.id,
                                                                    ],
                                                                )}
                                                            >
                                                                Lihat Ujian
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    <div className="rounded-md border bg-white p-2">
                                                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                            Durasi
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {courseTest.duration ||
                                                                0}{" "}
                                                            menit
                                                        </p>
                                                    </div>
                                                    <div className="rounded-md border bg-white p-2">
                                                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                            Kesempatan
                                                            Mengerjakan
                                                        </p>
                                                        <div className="mt-1 flex items-center justify-between gap-2">
                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {isRemedialMode
                                                                     ? (courseTest?.remedial_status === 'passed' ? "Lulus Remedial" : "Tidak terbatas")
                                                                     : (isUnlimited
                                                                         ? "Tidak terbatas"
                                                                         : `${usedAttempts} / ${maxAttempts}`)}
                                                            </p>
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${attemptStatus.text}`}
                                                            >
                                                                {
                                                                    attemptStatus.label
                                                                }
                                                            </span>
                                                        </div>
                                                        {!isUnlimited && (
                                                            <>
                                                                <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                                                                    <div
                                                                        className={`h-full rounded-full ${attemptStatus.bar}`}
                                                                        style={{
                                                                            width: `${progress}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <p className="mt-1 text-[11px] text-gray-500">
                                                                    Dipakai{" "}
                                                                    {
                                                                        usedAttempts
                                                                    }{" "}
                                                                    dari{" "}
                                                                    {
                                                                        maxAttempts
                                                                    }
                                                                </p>
                                                            </>
                                                        )}
                                                        {isUnlimited && (
                                                            <p className="mt-1 text-[11px] text-gray-500">
                                                                Dipakai{" "}
                                                                {usedAttempts}{" "}
                                                                kali (tanpa
                                                                batas)
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`rounded-md border p-2 col-span-2 md:col-span-1 ${
                                                            courseTest.best_attempt
                                                                ? courseTest
                                                                      .best_attempt
                                                                      .passed
                                                                    ? "border-emerald-200 bg-emerald-50"
                                                                    : "border-rose-200 bg-rose-50"
                                                                : "bg-white"
                                                        }`}
                                                    >
                                                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                            {showScore
                                                                ? "Nilai Terbaik"
                                                                : "Status"}
                                                        </p>
                                                        <p
                                                            className={`text-sm font-semibold ${
                                                                courseTest.best_attempt
                                                                    ? courseTest
                                                                          .best_attempt
                                                                          .passed
                                                                        ? "text-emerald-700"
                                                                        : "text-rose-700"
                                                                    : "text-gray-800"
                                                            }`}
                                                        >
                                                            {courseTest.best_attempt
                                                                ? showScore
                                                                    ? courseTest
                                                                          .best_attempt
                                                                          .score
                                                                    : bestAttemptLabel
                                                                : "-"}
                                                        </p>
                                                        {courseTest.best_attempt &&
                                                            showScore && (
                                                                <p
                                                                    className={`text-xs font-medium ${
                                                                        courseTest
                                                                            .best_attempt
                                                                            .passed
                                                                            ? "text-emerald-700"
                                                                            : "text-rose-700"
                                                                    }`}
                                                                >
                                                                    {
                                                                        bestAttemptLabel
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                                    <div className="rounded-md border border-dashed bg-white p-2">
                                                        Jadwal Mulai:{" "}
                                                        {formatLocalDateTime(
                                                            courseTest.start_date,
                                                        )}
                                                    </div>
                                                    <div className="rounded-md border border-dashed bg-white p-2">
                                                        Jadwal Selesai:{" "}
                                                        {formatLocalDateTime(
                                                            courseTest.end_date,
                                                        )}
                                                    </div>
                                                    {courseTest.is_remedial_mode && courseTest.remedial_status === 'active' && (
                                                        <div className="rounded-md border border-rose-200 bg-rose-50/50 p-2 text-rose-800 md:col-span-2 font-semibold">
                                                            Batas Remedial:{" "}
                                                            {courseTest.remedial_end_date ? (
                                                                formatLocalDateTime(courseTest.remedial_end_date)
                                                            ) : (
                                                                "Tanpa batas waktu"
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Belum ada ujian kelas.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-primary mb-2">
                            Hasil yang Sudah Dikerjakan
                        </h2>
                        <Tabs defaultValue="faktur-keluaran">
                            <TabsList>
                                <TabsTrigger value="faktur-keluaran">
                                    Pajak Keluaran (
                                    {
                                        fakturs.filter(
                                            (f: any) => f.type === "keluaran",
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="faktur-masukan">
                                    Pajak Masukan (
                                    {
                                        fakturs.filter(
                                            (f: any) => f.type === "masukan",
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="retur-keluaran">
                                    Retur Pajak Keluaran (
                                    {
                                        returs.filter(
                                            (f: any) => f.type === "keluaran",
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="retur-masukan">
                                    Retur Pajak Masukan (
                                    {
                                        returs.filter(
                                            (f: any) => f.type === "masukan",
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                {/* <TabsTrigger value="other-keluaran">
                                    Dokumen Keluaran (
                                    {
                                        others.filter(
                                            (f: any) => f.type === "keluaran"
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="other-masukan">
                                    Dokumen Masukan (
                                    {
                                        others.filter(
                                            (f: any) => f.type === "masukan"
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="returOthers-keluaran">
                                    Retur Dokumen Keluaran (
                                    {
                                        returOthers.filter(
                                            (f: any) => f.type === "keluaran"
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="returOthers-masukan">
                                    Retur Dokumen Masukan (
                                    {
                                        returOthers.filter(
                                            (f: any) => f.type === "masukan"
                                        ).length
                                    }
                                    )
                                </TabsTrigger> */}
                                <TabsTrigger value="bupot">
                                    Bupot ({bupots.length})
                                </TabsTrigger>
                                <TabsTrigger value="spt">
                                    SPT ({spts.length})
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="faktur-keluaran">
                                <FakturKeluaran
                                    fakturs={fakturs}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            <TabsContent value="faktur-masukan">
                                <FakturMasukan
                                    fakturs={fakturs}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            <TabsContent value="retur-keluaran">
                                <ReturKeluaran
                                    returs={returs}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            <TabsContent value="retur-masukan">
                                <ReturMasukan
                                    returs={returs}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            {/* <TabsContent value="other-keluaran">
                                <DokumenKeluaran
                                    others={others}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            <TabsContent value="other-masukan">
                                <DokumenMasukan
                                    others={others}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            <TabsContent value="returOthers-keluaran">
                                <ReturDokumenKeluaran
                                    returOthers={returOthers}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            <TabsContent value="returOthers-masukan">
                                <ReturDokumenMasukan
                                    returOthers={returOthers}
                                    courseResults={courseResults}
                                />
                            </TabsContent> */}
                            <TabsContent value="bupot">
                                <Bupot
                                    bupots={bupots}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                            <TabsContent value="spt">
                                <SPT
                                    spts={spts}
                                    courseResults={courseResults}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="text-red-700 border-red-200 bg-red-50 hover:bg-red-100"
                            >
                                <DoorOpen /> Keluar Kelas
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Apakah Anda yakin ingin keluar dari kelas
                                    ini?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Anda
                                    harus memasukkan kode kelas lagi jika ingin
                                    bergabung kembali.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() => {
                                        router.delete(
                                            route("courses.leave", course.id),
                                            { preserveScroll: true },
                                        );
                                    }}
                                >
                                    Keluar Kelas
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
