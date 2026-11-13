import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { router, Link } from "@inertiajs/react";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileCheck,
    FileText,
    History,
    RefreshCw,
    Search,
    UserCheck,
    UserX,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
    submissions: any;
    courses: any[];
    filters: any;
    role: "admin" | "pengajar";
}

export default function SubmissionManagement({
    submissions,
    courses = [],
    filters = {},
    role,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [courseId, setCourseId] = useState(filters.course_id || "all");
    const [status, setStatus] = useState(filters.status || "all");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");

    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApplyFilters = () => {
        router.get(
            route(role === "admin" ? "admin.submissions.index" : "teacher.submissions.index"),
            {
                search: search || undefined,
                course_id: courseId === "all" ? undefined : courseId,
                status: status === "all" ? undefined : status,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleResetFilters = () => {
        setSearch("");
        setCourseId("all");
        setStatus("all");
        setDateFrom("");
        setDateTo("");
        router.get(
            route(role === "admin" ? "admin.submissions.index" : "teacher.submissions.index"),
            {},
            { preserveState: true }
        );
    };

    const openDetailModal = (sub: any) => {
        setSelectedSubmission(sub);
        setDetailOpen(true);
    };

    const handleApprove = (submission: any) => {
        if (!confirm(`Setujui submission dari ${submission.user?.name}? Siswa akan mendapatkan akses ujian.`)) {
            return;
        }

        setIsProcessing(true);
        router.post(
            route("submissions.approve", submission.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Submission berhasil disetujui!");
                    setDetailOpen(false);
                },
                onError: (err) => {
                    const first = Object.values(err)[0] as string;
                    toast.error(first || "Gagal menyetujui submission.");
                },
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const handleRejectSubmit = () => {
        if (!adminNotes || adminNotes.trim().length < 3) {
            toast.error("Alasan / catatan penolakan wajib diisi (minimal 3 karakter).");
            return;
        }

        if (!selectedSubmission) return;

        setIsProcessing(true);
        router.post(
            route("submissions.reject", selectedSubmission.id),
            { admin_notes: adminNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Submission berhasil ditolak dengan catatan.");
                    setRejectModalOpen(false);
                    setDetailOpen(false);
                    setAdminNotes("");
                },
                onError: (err) => {
                    const first = Object.values(err)[0] as string;
                    toast.error(first || "Gagal menolak submission.");
                },
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const formatSize = (bytes: number) => {
        if (!bytes || bytes === 0) return "0 KB";
        const k = 1024;
        const dm = 1;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return "-";
        try {
            const date = new Date(isoString);
            return date.toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return isoString;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <FileCheck className="h-6 w-6 text-indigo-600" />
                        Daftar Submission Tugas Siswa
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {role === "admin"
                            ? "Pantau dan validasi seluruh submission berkas tugas dari seluruh kelas."
                            : "Periksa dan berikan persetujuan akses ujian bagi siswa di kelas Anda."}
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari siswa atau kelas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                            className="pl-9 text-xs"
                        />
                    </div>

                    <div>
                        <Select value={courseId} onValueChange={setCourseId}>
                            <SelectTrigger className="text-xs">
                                <SelectValue placeholder="Pilih Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {courses.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name} ({c.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="text-xs">
                                <SelectValue placeholder="Status Review" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending_review">Pending Review</SelectItem>
                                <SelectItem value="approved">Approved (Disetujui)</SelectItem>
                                <SelectItem value="rejected">Rejected (Ditolak)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="text-xs"
                            title="Dari Tanggal"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="text-xs"
                            title="Sampai Tanggal"
                        />
                        <Button
                            size="sm"
                            onClick={handleApplyFilters}
                            className="px-3"
                        >
                            Filter
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleResetFilters}
                            title="Reset Filter"
                            className="px-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table of Submissions */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b text-gray-600 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Siswa</th>
                                <th className="px-4 py-3">Kelas & Ujian</th>
                                <th className="px-4 py-3">File / Versi</th>
                                <th className="px-4 py-3">Waktu Kirim</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {submissions.data && submissions.data.length > 0 ? (
                                submissions.data.map((sub: any) => (
                                    <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-gray-900">
                                                {sub.user?.name || "-"}
                                            </div>
                                            <div className="text-gray-500 text-[11px]">
                                                {sub.user?.email}
                                            </div>
                                            {sub.user?.institution && (
                                                <div className="text-gray-400 text-[10px]">
                                                    {sub.user.institution}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-800">
                                                {sub.course?.name || "-"}
                                            </div>
                                            <div className="text-indigo-600 font-mono text-[11px]">
                                                Ujian: {sub.course_test?.title || "-"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <a
                                                href={route("submissions.download", sub.id)}
                                                className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                                title="Klik untuk unduh berkas"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span className="truncate max-w-[180px]">
                                                    {sub.original_filename}
                                                </span>
                                            </a>
                                            <div className="text-gray-500 text-[11px] flex items-center gap-2 mt-0.5">
                                                <span>{formatSize(sub.file_size)}</span>
                                                <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 border">
                                                    v{sub.version}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {formatDate(sub.updated_at || sub.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {sub.status === "pending_review" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 border border-amber-200">
                                                    <Clock className="h-3 w-3 text-amber-500 animate-pulse" />
                                                    Pending Review
                                                </span>
                                            )}
                                            {sub.status === "approved" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                    Approved
                                                </span>
                                            )}
                                            {sub.status === "rejected" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-700 border border-rose-200">
                                                    <XCircle className="h-3 w-3 text-rose-500" />
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openDetailModal(sub)}
                                                className="text-xs gap-1.5"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Review
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                        <FileCheck className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        Belum ada submission tugas siswa yang sesuai dengan filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {submissions.links && submissions.links.length > 3 && (
                    <div className="flex items-center justify-between border-t px-4 py-3 bg-slate-50 text-xs text-gray-600">
                        <div>
                            Menampilkan {submissions.from || 0} - {submissions.to || 0} dari {submissions.total || 0} data
                        </div>
                        <div className="flex items-center gap-1">
                            {submissions.links.map((link: any, idx: number) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 text-gray-400 border rounded bg-white text-xs"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        className={`px-2.5 py-1 border rounded text-xs transition ${
                                            link.active
                                                ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                                                : "bg-white text-gray-700 hover:bg-slate-100"
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail / Review Modal */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <FileCheck className="h-5 w-5 text-indigo-600" />
                            Detail Submission Tugas
                        </DialogTitle>
                        <DialogDescription>
                            Periksa berkas tugas dan putuskan pemberian akses ujian untuk siswa.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSubmission && (
                        <div className="space-y-4 py-2 text-xs">
                            {/* Student & Course Info Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border">
                                <div>
                                    <span className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold">
                                        Data Siswa:
                                    </span>
                                    <p className="font-semibold text-gray-900 text-sm mt-0.5">
                                        {selectedSubmission.user?.name}
                                    </p>
                                    <p className="text-gray-600">{selectedSubmission.user?.email}</p>
                                    {selectedSubmission.user?.institution && (
                                        <p className="text-gray-500 text-[11px] mt-0.5">
                                            Instansi: {selectedSubmission.user.institution}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <span className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold">
                                        Kelas & Ujian:
                                    </span>
                                    <p className="font-semibold text-gray-900 text-sm mt-0.5">
                                        {selectedSubmission.course?.name} ({selectedSubmission.course?.code})
                                    </p>
                                    <p className="text-indigo-700 font-medium">
                                        {selectedSubmission.course_test?.title}
                                    </p>
                                </div>
                            </div>

                            {/* File Card */}
                            <div className="p-3.5 border rounded-lg flex flex-wrap items-center justify-between gap-3 bg-white">
                                <div>
                                    <span className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold">
                                        Berkas Submission (Versi {selectedSubmission.version})
                                    </span>
                                    <p className="font-semibold text-gray-800 text-sm mt-0.5">
                                        {selectedSubmission.original_filename}
                                    </p>
                                    <p className="text-gray-500 text-[11px]">
                                        Ukuran: {formatSize(selectedSubmission.file_size)} • Diunggah:{" "}
                                        {formatDate(selectedSubmission.updated_at || selectedSubmission.created_at)}
                                    </p>
                                </div>
                                <a
                                    href={route("submissions.download", selectedSubmission.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm transition"
                                >
                                    <Download className="h-4 w-4" />
                                    Unduh Berkas
                                </a>
                            </div>

                            {/* Student Notes */}
                            {selectedSubmission.student_notes && (
                                <div className="p-3 bg-slate-50 border rounded-lg">
                                    <span className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                                        Catatan Siswa:
                                    </span>
                                    <p className="mt-1 text-gray-800 italic whitespace-pre-wrap">
                                        &quot;{selectedSubmission.student_notes}&quot;
                                    </p>
                                </div>
                            )}

                            {/* Current Status Box */}
                            <div className="p-3.5 border rounded-lg bg-slate-50/70 space-y-1">
                                <span className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold">
                                    Status Review Saat Ini:
                                </span>
                                <div className="pt-1 flex items-center gap-2">
                                    {selectedSubmission.status === "pending_review" && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                                            Pending Review
                                        </span>
                                    )}
                                    {selectedSubmission.status === "approved" && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            Disetujui (Approved)
                                        </span>
                                    )}
                                    {selectedSubmission.status === "rejected" && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
                                            <XCircle className="h-3.5 w-3.5 text-rose-600" />
                                            Ditolak (Rejected)
                                        </span>
                                    )}
                                </div>
                                {selectedSubmission.reviewed_at && (
                                    <p className="text-[11px] text-gray-500 pt-1">
                                        Ditinjau pada {formatDate(selectedSubmission.reviewed_at)}
                                        {selectedSubmission.reviewer?.name ? ` oleh ${selectedSubmission.reviewer.name}` : ""}
                                    </p>
                                )}
                                {selectedSubmission.admin_notes && (
                                    <div className="mt-2 p-2.5 bg-white border border-rose-200 rounded text-rose-900">
                                        <span className="font-semibold text-[10px] uppercase">Catatan Penolakan:</span>
                                        <p className="mt-0.5 whitespace-pre-wrap">{selectedSubmission.admin_notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Audit Trail Timeline */}
                            {selectedSubmission.reviews && selectedSubmission.reviews.length > 0 && (
                                <div className="space-y-2 border-t pt-3">
                                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                                        <History className="h-4 w-4 text-indigo-600" />
                                        <span>Riwayat Pengiriman & Peninjauan (Audit Trail)</span>
                                    </div>
                                    <div className="divide-y rounded-lg border bg-slate-50/50 text-[11px]">
                                        {selectedSubmission.reviews.map((rev: any) => (
                                            <div key={rev.id} className="p-2.5 flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                                                        <span
                                                            className={`capitalize font-bold ${
                                                                rev.action === "approved"
                                                                    ? "text-emerald-700"
                                                                    : rev.action === "rejected"
                                                                    ? "text-rose-700"
                                                                    : rev.action === "resubmitted"
                                                                    ? "text-amber-700"
                                                                    : "text-indigo-700"
                                                            }`}
                                                        >
                                                            {rev.action === "submitted"
                                                                ? "Pengiriman Pertama"
                                                                : rev.action === "resubmitted"
                                                                ? "Pengiriman Ulang (Revisi)"
                                                                : rev.action === "approved"
                                                                ? "Disetujui"
                                                                : "Ditolak"}
                                                        </span>
                                                        {rev.reviewer?.name && (
                                                            <span className="text-gray-500 font-normal">
                                                                oleh {rev.reviewer.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {rev.notes && (
                                                        <p className="text-gray-600 mt-0.5 whitespace-pre-wrap">
                                                            Catatan: {rev.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-gray-400 text-[10px]">
                                                        {formatDate(rev.created_at)}
                                                    </span>
                                                    {rev.file_path && (
                                                        <div className="mt-1">
                                                            <a
                                                                href={route("submissions.reviews.download", rev.id)}
                                                                className="text-indigo-600 hover:underline flex items-center gap-1 justify-end text-[10px]"
                                                            >
                                                                <Download className="h-3 w-3" />
                                                                Berkas versi ini
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0 border-t pt-3">
                        {selectedSubmission && (
                            <div className="flex items-center justify-between w-full">
                                <Button
                                    variant="outline"
                                    onClick={() => setDetailOpen(false)}
                                    disabled={isProcessing}
                                >
                                    Tutup
                                </Button>
                                <div className="flex items-center gap-2">
                                    {selectedSubmission.status !== "rejected" && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => setRejectModalOpen(true)}
                                            disabled={isProcessing}
                                            className="text-xs"
                                        >
                                            <UserX className="h-3.5 w-3.5 mr-1.5" />
                                            {selectedSubmission.status === "approved" ? "Batalkan / Tolak" : "Tolak"}
                                        </Button>
                                    )}
                                    {selectedSubmission.status !== "approved" && (
                                        <Button
                                            onClick={() => handleApprove(selectedSubmission)}
                                            disabled={isProcessing}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                        >
                                            <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                                            Setujui (Approve)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal with Mandatory Notes */}
            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-rose-700 flex items-center gap-2 text-base">
                            <XCircle className="h-5 w-5" />
                            Konfirmasi Penolakan Submission
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Berikan catatan atau instruksi perbaikan yang jelas kepada siswa. Catatan ini wajib diisi agar siswa mengetahui hal apa yang harus direvisi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                        <label className="text-xs font-semibold text-gray-700">
                            Alasan / Catatan Penolakan <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            rows={4}
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Tuliskan alasan penolakan dan bagian yang perlu diperbaiki oleh siswa..."
                            className="text-xs"
                        />
                        <p className="text-[11px] text-gray-500">
                            Minimal 3 karakter. Siswa dapat melihat catatan ini di halaman ujian.
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setRejectModalOpen(false)}
                            disabled={isProcessing}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectSubmit}
                            disabled={isProcessing}
                            className="text-xs"
                        >
                            {isProcessing ? "Menyimpan..." : "Tolak Submission"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

