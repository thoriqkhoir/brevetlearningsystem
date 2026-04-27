import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

function parseLocalDateTime(value?: string | null) {
    if (!value) return null;

    const normalized = String(value).trim();
    const matched = normalized.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/,
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

function formatLocalDateTime(value?: string | null) {
    const date = parseLocalDateTime(value);
    if (!date) return "-";

    return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function CourseTestTeacherDetail({
    course,
    courseTest,
    statistics,
    participants = [],
}: any) {
    const attemptedParticipants = Number(
        statistics?.attempted_participants ?? 0,
    );
    const totalParticipants = Number(statistics?.total_participants ?? 0);
    const bestScore =
        statistics?.best_score !== null &&
        typeof statistics?.best_score !== "undefined"
            ? Number(statistics.best_score)
            : null;

    return (
        <TeacherLayout>
            <Head
                title={`Detail Ujian Kelas - ${courseTest?.title || "Ujian"}`}
            />

            <div className="teacher-page-shell">
                <div className="teacher-page-stack">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.courses")}>
                                    Daftar Kelas
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link
                                    href={route(
                                        "teacher.showCourse",
                                        course.id,
                                    )}
                                >
                                    {course?.name || "Detail Kelas"}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Detail Ujian -{" "}
                                    {courseTest?.title || "Ujian"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="teacher-page-title">
                                Detail Ujian Kelas: {courseTest?.title}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Kelas:{" "}
                                <span className="font-semibold">
                                    {course?.name || "-"}
                                </span>
                            </p>
                        </div>

                        <Button variant="outline" asChild>
                            <Link href={route("teacher.showCourse", course.id)}>
                                Kembali ke Detail Kelas
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow space-y-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div className="rounded-lg border bg-slate-50 p-3">
                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                    Jumlah Peserta Kelas
                                </p>
                                <p className="text-2xl font-semibold text-gray-800">
                                    {totalParticipants}
                                </p>
                            </div>
                            <div className="rounded-lg border bg-emerald-50 p-3">
                                <p className="text-xs uppercase tracking-wide text-emerald-700">
                                    Sudah Mengerjakan
                                </p>
                                <p className="text-2xl font-semibold text-emerald-700">
                                    {attemptedParticipants}
                                </p>
                            </div>
                            <div className="rounded-lg border bg-blue-50 p-3">
                                <p className="text-xs uppercase tracking-wide text-blue-700">
                                    Nilai Terbaik
                                </p>
                                <p className="text-2xl font-semibold text-blue-700">
                                    {bestScore !== null ? bestScore : "-"}
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    {statistics?.best_score_user?.name ||
                                        "Belum ada peserta yang submit"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 text-sm">
                            <div className="rounded-md border p-3">
                                <p className="text-gray-500">Durasi</p>
                                <p className="font-semibold text-gray-800">
                                    {courseTest?.duration || 0} menit
                                </p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="text-gray-500">Passing Score</p>
                                <p className="font-semibold text-gray-800">
                                    {courseTest?.passing_score || 0}
                                </p>
                            </div>
                            <div className="rounded-md border border-dashed p-3">
                                <p className="text-gray-500">Mulai Ujian</p>
                                <p className="font-semibold text-gray-800">
                                    {formatLocalDateTime(
                                        courseTest?.start_date,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-md border border-dashed p-3">
                                <p className="text-gray-500">Selesai Ujian</p>
                                <p className="font-semibold text-gray-800">
                                    {formatLocalDateTime(courseTest?.end_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow">
                        <h2 className="text-lg font-semibold text-primary mb-3">
                            Peserta dan Nilai Terbaik
                        </h2>

                        {participants.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="py-2">Nama</th>
                                            <th className="py-2">Email</th>
                                            <th className="py-2">
                                                Nilai Terbaik
                                            </th>
                                            <th className="py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.map(
                                            (participant: any) => (
                                                <tr
                                                    key={participant.id}
                                                    className="border-b last:border-b-0"
                                                >
                                                    <td className="py-2 font-medium text-gray-800">
                                                        {participant?.user
                                                            ?.name || "-"}
                                                    </td>
                                                    <td className="py-2 text-gray-600">
                                                        {participant?.user
                                                            ?.email || "-"}
                                                    </td>
                                                    <td className="py-2 text-gray-800 font-semibold">
                                                        {participant?.best_score ??
                                                            "-"}
                                                    </td>
                                                    <td className="py-2">
                                                        {participant?.best_score ===
                                                            null ||
                                                        typeof participant?.best_score ===
                                                            "undefined" ? (
                                                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                                                Belum
                                                                Mengerjakan
                                                            </span>
                                                        ) : participant?.passed ? (
                                                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                                Lulus
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex rounded-full border border-rose-200 bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                                                                Tidak Lulus
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                Belum ada peserta kelas.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
