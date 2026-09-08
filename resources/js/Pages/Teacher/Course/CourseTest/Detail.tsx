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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { ArrowLeft, CheckCircle2, Clock, Download, FileText, Search, UserCheck, Users, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

function parseLocalDate(value?: string | null) {
    if (!value) return null;
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (!match) return null;
    return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6] ?? 0)
    );
}

function formatLocalDateTime(value?: string | null) {
    const date = parseLocalDate(value);
    if (!date) return value || "-";
    
    const day = date.getDate();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${day} ${month} ${year}, ${hours}.${minutes} WIB`;
}

export default function CourseTestTeacherDetail({
    course,
    courseTest,
    statistics,
    participants = [],
    attemptHistory = [],
}: any) {
    const [searchParticipant, setSearchParticipant] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchHistory, setSearchHistory] = useState("");

    const attemptedParticipants = Number(
        statistics?.attempted_participants ?? 0,
    );
    const totalParticipants = Number(statistics?.total_participants ?? 0);
    const bestScore =
        statistics?.best_score !== null &&
        typeof statistics?.best_score !== "undefined"
            ? Number(statistics.best_score)
            : null;

    const filteredParticipants = useMemo(() => {
        return participants.filter((p: any) => {
            const matchesSearch =
                (p?.user?.name || "").toLowerCase().includes(searchParticipant.toLowerCase()) ||
                (p?.user?.email || "").toLowerCase().includes(searchParticipant.toLowerCase());

            if (!matchesSearch) return false;

            if (statusFilter === "passed") {
                return p?.passed === true;
            } else if (statusFilter === "failed") {
                return p?.passed === false && p?.best_score !== null && typeof p?.best_score !== "undefined";
            } else if (statusFilter === "unattempted") {
                return p?.best_score === null || typeof p?.best_score === "undefined";
            }

            return true;
        });
    }, [participants, searchParticipant, statusFilter]);

    const filteredHistory = useMemo(() => {
        return attemptHistory.filter((a: any) => {
            return (
                (a?.user?.name || "").toLowerCase().includes(searchHistory.toLowerCase()) ||
                (a?.user?.email || "").toLowerCase().includes(searchHistory.toLowerCase())
            );
        });
    }, [attemptHistory, searchHistory]);

    return (
        <TeacherLayout>
            <Head
                title={`Detail Ujian - ${courseTest?.title || "Ujian"}`}
            />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-5 p-4 pt-0">
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
                                    Detail Ujian - {courseTest?.title || "Ujian"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header Action */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {courseTest?.title}
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Kelas: <span className="font-medium text-gray-800">{course?.name || "-"}</span>
                                {courseTest?.question_bank?.name && (
                                    <> &bull; Bank Soal: <span className="font-medium text-gray-800">{courseTest.question_bank.name}</span></>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild className="gap-2">
                                <Link href={route("teacher.showCourse", course.id)}>
                                    <ArrowLeft size={16} />
                                    Kembali ke Kelas
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Total Peserta
                                </p>
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Users size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                {totalParticipants} <span className="text-xs font-normal text-gray-500">siswa</span>
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                    Sudah Mengerjakan
                                </p>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <UserCheck size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-emerald-700 mt-2">
                                {attemptedParticipants} <span className="text-xs font-normal text-emerald-600">/ {totalParticipants}</span>
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                    Passing Score (KKM)
                                </p>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-indigo-700 mt-2">
                                {courseTest?.passing_score ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                                    Nilai Tertinggi
                                </p>
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <FileText size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-amber-700 mt-2">
                                {bestScore !== null ? bestScore : "-"}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1" title={statistics?.best_score_user?.name}>
                                {statistics?.best_score_user?.name ? `Oleh: ${statistics.best_score_user.name}` : "Belum ada data"}
                            </p>
                        </div>
                    </div>

                    {/* Test Info Parameters */}
                    <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                            Pengaturan &amp; Jadwal Ujian
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="rounded-lg border bg-slate-50/70 p-3">
                                <p className="text-xs text-gray-500">Durasi Pengerjaan</p>
                                <p className="font-semibold text-gray-800 mt-0.5">
                                    {courseTest?.duration || 0} Menit
                                </p>
                            </div>
                            <div className="rounded-lg border bg-slate-50/70 p-3">
                                <p className="text-xs text-gray-500">Batas Percobaan</p>
                                <p className="font-semibold text-gray-800 mt-0.5">
                                    {Number(courseTest?.max_attempts ?? 0) <= 0
                                        ? "Tidak terbatas"
                                        : `${courseTest?.max_attempts}x`}
                                </p>
                            </div>
                            <div className="rounded-lg border bg-slate-50/70 p-3">
                                <p className="text-xs text-gray-500">Mulai Ujian</p>
                                <p className="font-semibold text-gray-800 mt-0.5">
                                    {formatLocalDateTime(courseTest?.start_date)}
                                </p>
                            </div>
                            <div className="rounded-lg border bg-slate-50/70 p-3">
                                <p className="text-xs text-gray-500">Selesai Ujian</p>
                                <p className="font-semibold text-gray-800 mt-0.5">
                                    {formatLocalDateTime(courseTest?.end_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Participants & Scores Section */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <Tabs defaultValue="participants">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                                <TabsList>
                                    <TabsTrigger value="participants" className="gap-2">
                                        <Users size={16} />
                                        Daftar Siswa &amp; Nilai ({participants.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="gap-2">
                                        <Clock size={16} />
                                        Riwayat Percobaan ({attemptHistory.length})
                                    </TabsTrigger>
                                </TabsList>

                                <Button variant="outline" asChild className="text-green-700 bg-green-50 border-green-200 hover:bg-green-100 gap-2">
                                    <a
                                        href={route(
                                            "teacher.courseTests.exportParticipants",
                                            {
                                                course: course.id,
                                                courseTest: courseTest.id,
                                            },
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download className="w-4 h-4" />
                                        Ekspor Nilai (.xlsx)
                                    </a>
                                </Button>
                            </div>

                            {/* TAB: Participants & Scores */}
                            <TabsContent value="participants" className="mt-4 space-y-4">
                                {/* Filter bar */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            placeholder="Cari nama atau email siswa..."
                                            value={searchParticipant}
                                            onChange={(e) => setSearchParticipant(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Semua Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Status</SelectItem>
                                                <SelectItem value="passed">Lulus</SelectItem>
                                                <SelectItem value="failed">Tidak Lulus</SelectItem>
                                                <SelectItem value="unattempted">Belum Mengerjakan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {filteredParticipants.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 text-gray-600 border-b">
                                                <tr>
                                                    <th className="py-3 px-4 text-left font-medium w-12">No</th>
                                                    <th className="py-3 px-4 text-left font-medium">Nama Siswa</th>
                                                    <th className="py-3 px-4 text-left font-medium">Email</th>
                                                    <th className="py-3 px-4 text-center font-medium">Nilai Akhir / Terbaik</th>
                                                    <th className="py-3 px-4 text-center font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredParticipants.map((participant: any, index: number) => {
                                                    const hasScore = participant?.best_score !== null && typeof participant?.best_score !== "undefined";
                                                    return (
                                                        <tr key={participant.id || index} className="hover:bg-slate-50/60 transition-colors">
                                                            <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                                                            <td className="py-3 px-4 font-semibold text-gray-900">
                                                                {participant?.user?.name || "-"}
                                                            </td>
                                                            <td className="py-3 px-4 text-gray-600">
                                                                {participant?.user?.email || "-"}
                                                            </td>
                                                            <td className="py-3 px-4 text-center">
                                                                {hasScore ? (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-gray-900 border">
                                                                        {participant.best_score}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400 font-medium">-</span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-center">
                                                                {!hasScore ? (
                                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                                                        Belum Mengerjakan
                                                                    </span>
                                                                ) : participant?.passed ? (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                        <CheckCircle2 size={12} />
                                                                        Lulus
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                                        <XCircle size={12} />
                                                                        Tidak Lulus
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border rounded-lg bg-slate-50/50">
                                        <p className="text-sm text-gray-500 font-medium">
                                            Tidak ada siswa yang sesuai dengan filter.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* TAB: Attempt History */}
                            <TabsContent value="history" className="mt-4 space-y-4">
                                <div className="relative max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        placeholder="Cari nama atau email siswa di riwayat..."
                                        value={searchHistory}
                                        onChange={(e) => setSearchHistory(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {filteredHistory.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 text-gray-600 border-b">
                                                <tr>
                                                    <th className="py-3 px-4 text-left font-medium w-12">No</th>
                                                    <th className="py-3 px-4 text-left font-medium">Peserta</th>
                                                    <th className="py-3 px-4 text-left font-medium">Email</th>
                                                    <th className="py-3 px-4 text-center font-medium">Skor</th>
                                                    <th className="py-3 px-4 text-center font-medium">Status</th>
                                                    <th className="py-3 px-4 text-left font-medium">Waktu Selesai Submit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredHistory.map((attempt: any, index: number) => (
                                                    <tr key={attempt.id || index} className="hover:bg-slate-50/60 transition-colors">
                                                        <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                                            {attempt?.user?.name || "-"}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600">
                                                            {attempt?.user?.email || "-"}
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-bold text-gray-800">
                                                            {attempt?.score ?? 0}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            {attempt?.passed ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    <CheckCircle2 size={12} />
                                                                    Lulus
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                                    <XCircle size={12} />
                                                                    Tidak Lulus
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600">
                                                            {formatLocalDateTime(attempt?.submitted_at)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border rounded-lg bg-slate-50/50">
                                        <p className="text-sm text-gray-500 font-medium">
                                            Belum ada riwayat pengerjaan.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
