import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import AdminLayout from "@/Layouts/AdminLayout";
import { Download, Eye, FileText } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { DataTableParticipant } from "@/Components/layout/UserCourse/data-table";
import { ParticipantColumns } from "@/Components/layout/UserCourse/columns";
import { DataTableColumnHeader } from "@/Components/layout/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function DetailCourse({
    teacherId,
    course,
    participants = [],
    courseSchedules = [],
    courseTests = [],
}: any) {
    const formatLocalDateTime = (value?: string | null) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return format(date, "d MMMM yyyy HH:mm", { locale: id });
    };

    const columns = useMemo<ColumnDef<ParticipantColumns>[]>(
        () => [
            {
                accessorKey: "no",
                header: "No",
                cell: ({ row }) => <p>{row.index + 1}</p>,
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "user.name",
                id: "user_name",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Nama" />
                ),
                cell: ({ row }) => {
                    const user = row.original.user;
                    const getInitials = (name: string) => {
                        return (
                            name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase() || "??"
                        );
                    };

                    return (
                        <div className="flex items-center gap-3 w-[220px]">
                            {user?.profile_url ? (
                                <img
                                    src={user.profile_url}
                                    alt={`Foto profil ${user.name}`}
                                    className="h-8 w-8 rounded-xl object-cover shadow-sm ring-1 ring-teal-100"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 text-xs font-bold text-white shadow-sm shrink-0">
                                    {getInitials(user?.name || "??")}
                                </div>
                            )}
                            <p className="font-medium text-slate-700">
                                {user?.name || "-"}
                            </p>
                        </div>
                    );
                },
            },
            {
                accessorKey: "user.email",
                id: "user_email",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Email" />
                ),
                cell: ({ row }) => <p>{row.original.user?.email || "-"}</p>,
            },
            {
                accessorKey: "user.phone_number",
                id: "user_phone_number",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="No. WA" />
                ),
                cell: ({ row }) => (
                    <p>{row.original.user?.phone_number || "-"}</p>
                ),
            },
            {
                accessorKey: "average_score",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Nilai" />
                ),
                cell: ({ row }) => (
                    <div className="text-center">
                        <div className="font-mono font-bold text-primary">
                            {row.original.average_score !== null &&
                            typeof row.original.average_score !== "undefined" ? (
                                row.original.average_score
                            ) : (
                                <span className="italic text-gray-400 text-sm">
                                    Belum dinilai
                                </span>
                            )}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "feedback",
                header: "Feedback",
                cell: ({ row }) => (
                    <p className="w-[200px] truncate">
                        {row.original.feedback ?? "-"}
                    </p>
                ),
            },
        ],
        [],
    );

    const participantsData = useMemo<ParticipantColumns[]>(
        () =>
            participants.map((p: any) => ({
                id: p.id,
                user: p.user,
                average_score: p.average_score ?? null,
                feedback: p.feedback ?? null,
                course_id: String(course?.id ?? ""),
            })),
        [participants, course?.id],
    );

    return (
        <AdminLayout>
            <Head title={`Detail Kelas - ${course.name}`} />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("admin.teachers")}>
                                    Daftar Pengajar
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link
                                    href={route("admin.showTeacher", teacherId)}
                                >
                                    {course.user?.name || "Pengajar"}
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

                    <div className="flex items-center justify-between">
                        <h1 className="text-xl sm:text-2xl font-semibold text-primary">
                            Detail Kelas - {course.name}
                        </h1>
                    </div>

                    {/* Informasi Kelas */}
                    <div className="rounded-xl bg-white border shadow p-6">
                        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                            <h2 className="text-lg font-bold md:mb-2 text-primary">
                                Informasi Kelas
                            </h2>
                            <span className="w-fit text-sm md:text-base md:mb-0 mb-4 font-mono font-bold px-3 py-1 rounded bg-blue-200 text-blue-900 border border-blue-400 tracking-widest shadow-sm">
                                Kode : {course.code || "-"}
                            </span>
                        </div>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td className="font-medium py-1 pr-4 w-48">
                                        Nama Kelas
                                    </td>
                                    <td className="py-1 w-4">:</td>
                                    <td className="py-1">{course.name}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Nama Pengajar
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        <Link
                                            href={route(
                                                "admin.showTeacher",
                                                teacherId,
                                            )}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {course.user?.name || "-"}
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Deskripsi
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.description || "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Tanggal Pelaksanaan
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.start_date
                                            ? format(
                                                  new Date(course.start_date),
                                                  "d MMMM yyyy",
                                                  { locale: id },
                                              )
                                            : "-"}
                                        {" - "}
                                        {course.end_date
                                            ? format(
                                                  new Date(course.end_date),
                                                  "d MMMM yyyy",
                                                  { locale: id },
                                              )
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Akses Materi
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.access_rights ? (
                                            (Array.isArray(course.access_rights)
                                                ? course.access_rights
                                                : JSON.parse(
                                                      course.access_rights,
                                                  )
                                            ).map((access: string) => (
                                                <span
                                                    key={access}
                                                    className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded mr-2 text-xs font-semibold"
                                                >
                                                    {access === "efaktur"
                                                        ? "e-Faktur"
                                                        : access === "ebupot"
                                                          ? "e-Bupot"
                                                          : access}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="italic text-gray-400">
                                                Tidak ada akses materi
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Modul
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            asChild
                                            className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                        >
                                            <Link
                                                href={route(
                                                    "admin.showTeacherCourseModules",
                                                    {
                                                        teacherId:
                                                            course.teacher_id,
                                                        courseId: course.id,
                                                    },
                                                )}
                                            >
                                                <FileText size={14} />
                                                Lihat Modul (
                                                {course.modules_count ||
                                                    "Belum ada modul"}
                                                )
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Jadwal Kelas */}
                    <div className="rounded-xl bg-white border shadow p-6 space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-bold text-primary">
                                Jadwal Kelas ({courseSchedules.length})
                            </h2>
                        </div>

                        {courseSchedules.length > 0 ? (
                            <div className="space-y-2">
                                {courseSchedules.map((schedule: any) => (
                                    <div
                                        key={schedule.id}
                                        className="rounded-lg border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-800">
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
                                                Link meeting belum diisi
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Belum ada jadwal kelas.
                            </div>
                        )}
                    </div>

                    {/* Ujian Kelas */}
                    <div className="rounded-xl bg-white border shadow p-6 space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-bold text-primary">
                                Ujian Kelas ({courseTests.length})
                            </h2>
                        </div>

                        {courseTests.length > 0 ? (
                            <div className="space-y-2">
                                {courseTests.map((courseTest: any) => (
                                    <div
                                        key={courseTest.id}
                                        className="rounded-xl border bg-slate-50/60 p-4"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                            <div>
                                                <div className="font-semibold text-gray-800 text-base">
                                                    {courseTest.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Bank Soal:{" "}
                                                    {courseTest.question_bank
                                                        ?.name || "-"}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 md:justify-end md:self-start">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-blue-700 border-blue-200 hover:bg-blue-50"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            "admin.showTeacherCourseTest",
                                                            {
                                                                teacherId:
                                                                    course.teacher_id,
                                                                courseId:
                                                                    course.id,
                                                                courseTestId:
                                                                    courseTest.id,
                                                            },
                                                        )}
                                                    >
                                                        <Eye size={14} />
                                                        Detail Ujian
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <div className="rounded-md border bg-white p-2">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                    Durasi
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {courseTest.duration || 0}{" "}
                                                    menit
                                                </p>
                                            </div>
                                            <div className="rounded-md border bg-white p-2">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                    Passing Score
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {courseTest.passing_score ||
                                                        0}
                                                </p>
                                            </div>
                                            <div className="rounded-md border bg-white p-2 col-span-2 md:col-span-1">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                    Soal Ditampilkan
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {courseTest.questions_to_show ||
                                                        "Semua"}
                                                </p>
                                            </div>
                                            <div className="rounded-md border bg-white p-2">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                    Maksimal Pengerjaan
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {Number(
                                                        courseTest.max_attempts ??
                                                            0,
                                                    ) <= 0
                                                        ? "Tidak terbatas"
                                                        : courseTest.max_attempts}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div className="rounded-md border border-dashed bg-white p-2">
                                                Jadwal Mulai:{" "}
                                                {courseTest.start_date
                                                    ? formatLocalDateTime(
                                                          courseTest.start_date,
                                                      )
                                                    : "-"}
                                            </div>
                                            <div className="rounded-md border border-dashed bg-white p-2">
                                                Jadwal Selesai:{" "}
                                                {courseTest.end_date
                                                    ? formatLocalDateTime(
                                                          courseTest.end_date,
                                                      )
                                                    : "-"}
                                            </div>
                                        </div>

                                        {courseTest.remedial_enabled && (
                                            <div className="mt-2 rounded-md border border-rose-200 bg-rose-50/60 p-2 text-xs text-rose-800">
                                                <span className="font-semibold">
                                                    Remedial Aktif:
                                                </span>{" "}
                                                Selesai pada{" "}
                                                {formatLocalDateTime(
                                                    courseTest.remedial_end_date,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Belum ada ujian kelas.
                            </div>
                        )}
                    </div>

                    {/* Daftar Peserta */}
                    <div className="rounded-xl bg-white border shadow p-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-bold text-primary">
                                Daftar Peserta ({participants.length})
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    className="text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                                    asChild
                                >
                                    <a
                                        href={route(
                                            "admin.showTeacherCourseExportParticipants",
                                            {
                                                id: course.teacher_id,
                                                courseId: course.id,
                                            },
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download size={16} />
                                        Ekspor Peserta (.xlsx)
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    asChild
                                >
                                    <a
                                        href={route(
                                            "admin.showTeacherCoursePhotos",
                                            {
                                                id: course.teacher_id,
                                                courseId: course.id,
                                            },
                                        )}
                                    >
                                        <Download size={16} />
                                        Unduh Foto (.zip)
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <DataTableParticipant
                            columns={columns}
                            data={participantsData}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
