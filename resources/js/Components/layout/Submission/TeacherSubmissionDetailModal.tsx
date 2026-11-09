import { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import {
    Search,
    Download,
    Check,
    CheckCheck,
    X,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Loader2,
    Calendar,
    Users,
    Eye,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface TeacherSubmissionDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    courseSubmission: any | null;
    participants: any[];
}

export default function TeacherSubmissionDetailModal({
    open,
    onOpenChange,
    courseId,
    courseSubmission,
    participants = [],
}: TeacherSubmissionDetailModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [processingSubmissionId, setProcessingSubmissionId] = useState<string | null>(null);

    // Reject Dialog state
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [targetSubmission, setTargetSubmission] = useState<any | null>(null);
    const [rejectNotes, setRejectNotes] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    // Preview Dialog state
    const [previewSubmission, setPreviewSubmission] = useState<any | null>(null);

    // Approve All Dialog state
    const [approveAllDialogOpen, setApproveAllDialogOpen] = useState(false);
    const [isApprovingAll, setIsApprovingAll] = useState(false);
    const [includeUnsubmitted, setIncludeUnsubmitted] = useState(true);

    // Build map of student user_id -> submission
    const studentSubmissionMap = useMemo(() => {
        const map = new Map<string, any>();
        if (courseSubmission?.submissions) {
            courseSubmission.submissions.forEach((sub: any) => {
                map.set(sub.user_id, sub);
            });
        }
        return map;
    }, [courseSubmission]);

    // Format file size
    const formatBytes = (bytes?: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    // Prepare table items (combining participant and their submission)
    const tableItems = useMemo(() => {
        return participants.map((participant) => {
            const user = participant.user || {};
            const submission = studentSubmissionMap.get(user.id) || null;
            return {
                participant,
                user,
                submission,
                status: submission ? submission.status : "unsubmitted",
            };
        });
    }, [participants, studentSubmissionMap]);

    // Statistics
    const stats = useMemo(() => {
        const total = tableItems.length;
        const submitted = tableItems.filter((i) => i.submission !== null).length;
        const pending = tableItems.filter((i) => i.status === "pending_review").length;
        const approved = tableItems.filter((i) => i.status === "approved").length;
        const rejected = tableItems.filter((i) => i.status === "rejected").length;
        const unsubmitted = total - submitted;
        return { total, submitted, pending, approved, rejected, unsubmitted };
    }, [tableItems]);

    const notApprovedCount = stats.total - stats.approved;

    // Handle Approve All (ACC Semua Siswa)
    const handleConfirmApproveAll = () => {
        setIsApprovingAll(true);
        router.post(
            route("courses.submissions.approveAll", [courseId, courseSubmission.id]),
            { include_unsubmitted: includeUnsubmitted },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsApprovingAll(false);
                    setApproveAllDialogOpen(false);
                },
                onError: (err: any) => {
                    setIsApprovingAll(false);
                    if (err?.error) toast.error(err.error);
                },
            }
        );
    };

    // Filtered items
    const filteredItems = useMemo(() => {
        return tableItems.filter((item) => {
            // Search filter
            const name = (item.user.name || "").toLowerCase();
            const email = (item.user.email || "").toLowerCase();
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query || name.includes(query) || email.includes(query);

            // Status filter
            let matchesStatus = true;
            if (statusFilter !== "all") {
                matchesStatus = item.status === statusFilter;
            }

            return matchesSearch && matchesStatus;
        });
    }, [tableItems, searchQuery, statusFilter]);

    // Handle ACC (Approve)
    const handleApprove = (submission: any) => {
        setProcessingSubmissionId(submission.id);
        router.post(
            route("submissions.approve", submission.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessingSubmissionId(null);
                    if (previewSubmission && previewSubmission.id === submission.id) {
                        setPreviewSubmission((prev: any) => ({ ...prev, status: "approved" }));
                    }
                },
                onError: (err: any) => {
                    setProcessingSubmissionId(null);
                    if (err?.error) toast.error(err.error);
                },
            }
        );
    };

    // Open Reject Modal
    const openRejectModal = (submission: any) => {
        setTargetSubmission(submission);
        setRejectNotes("");
        setRejectModalOpen(true);
    };

    // Submit Rejection
    const handleConfirmReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetSubmission) return;

        if (!rejectNotes.trim()) {
            toast.error("Alasan atau catatan penolakan wajib diisi.");
            return;
        }

        setIsRejecting(true);
        router.post(
            route("submissions.reject", targetSubmission.id),
            { admin_notes: rejectNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRejecting(false);
                    setRejectModalOpen(false);
                    if (previewSubmission && previewSubmission.id === targetSubmission.id) {
                        setPreviewSubmission((prev: any) => ({ ...prev, status: "rejected", admin_notes: rejectNotes }));
                    }
                    setTargetSubmission(null);
                    setRejectNotes("");
                },
                onError: (err: any) => {
                    setIsRejecting(false);
                    const errorMsg = err?.admin_notes || err?.error;
                    if (errorMsg) toast.error(errorMsg);
                },
            }
        );
    };

    if (!courseSubmission) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
                    <DialogHeader className="border-b pb-4 shrink-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span>Detail Submission: {courseSubmission.title}</span>
                                </DialogTitle>
                                <DialogDescription className="text-xs text-gray-500 mt-1">
                                    Tinjau berkas yang dikirimkan siswa dan berikan persetujuan (ACC) atau penolakan.
                                </DialogDescription>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                                {courseSubmission.file_path && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        asChild
                                        className="text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 shrink-0"
                                    >
                                        <a
                                            href={route("courses.submissions.attachment", [
                                                courseId,
                                                courseSubmission.id,
                                            ])}
                                            download
                                        >
                                            <Download className="h-3.5 w-3.5 mr-1.5" />
                                            Unduh Template Tugas
                                        </a>
                                    </Button>
                                )}

                                <Button
                                    size="sm"
                                    type="button"
                                    disabled={notApprovedCount === 0 || isApprovingAll}
                                    onClick={() => setApproveAllDialogOpen(true)}
                                    className={cn(
                                        "text-xs gap-1.5 shadow-sm transition shrink-0",
                                        notApprovedCount === 0
                                            ? "bg-slate-100 text-gray-400 border border-slate-200 cursor-not-allowed hover:bg-slate-100"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    )}
                                    title={notApprovedCount === 0 ? "Semua siswa sudah disetujui (ACC)" : "Setujui semua siswa"}
                                >
                                    <CheckCheck className="h-4 w-4" />
                                    {notApprovedCount === 0
                                        ? "Semua Siswa Sudah Di-ACC"
                                        : `ACC Semua Siswa (${notApprovedCount})`}
                                </Button>
                            </div>
                        </div>

                        {/* Submission Meta Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3 border-t text-xs text-gray-600 bg-slate-50/80 p-3 rounded-lg">
                            <div>
                                <span className="font-medium text-gray-700">Batas Waktu (Deadline): </span>
                                {courseSubmission.deadline ? (
                                    <span className="font-semibold text-rose-600">
                                        {format(new Date(courseSubmission.deadline), "d MMMM yyyy, HH:mm", {
                                            locale: idLocale,
                                        })}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">Tidak ada batas waktu</span>
                                )}
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Petunjuk Tugas: </span>
                                <span>{courseSubmission.description || "-"}</span>
                            </div>
                        </div>

                        {/* Stats Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                            <div className="bg-slate-100 rounded-lg p-2 text-center">
                                <div className="text-[11px] text-gray-500">Total Siswa</div>
                                <div className="text-base font-bold text-gray-800">{stats.total}</div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center">
                                <div className="text-[11px] text-blue-700">Terkumpul</div>
                                <div className="text-base font-bold text-blue-700">{stats.submitted}</div>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                                <div className="text-[11px] text-amber-700 font-medium">Perlu Review</div>
                                <div className="text-base font-bold text-amber-700">{stats.pending}</div>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
                                <div className="text-[11px] text-emerald-700 font-medium">Di-ACC</div>
                                <div className="text-base font-bold text-emerald-700">{stats.approved}</div>
                            </div>
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center">
                                <div className="text-[11px] text-rose-700 font-medium">Ditolak</div>
                                <div className="text-base font-bold text-rose-700">{stats.rejected}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                                <div className="text-[11px] text-gray-600">Belum Kumpul</div>
                                <div className="text-base font-bold text-gray-600">{stats.unsubmitted}</div>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-3 pt-2">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama atau email siswa..."
                                    className="pl-8 text-xs h-9 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                                {[
                                    { key: "all", label: "Semua" },
                                    { key: "pending_review", label: "Perlu Review" },
                                    { key: "approved", label: "Disetujui (ACC)" },
                                    { key: "rejected", label: "Ditolak" },
                                    { key: "unsubmitted", label: "Belum Kumpul" },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setStatusFilter(tab.key)}
                                        className={cn(
                                            "px-2.5 py-1 text-xs rounded-full font-medium whitespace-nowrap transition",
                                            statusFilter === tab.key
                                                ? "bg-primary text-white shadow-sm"
                                                : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Table Container (Scrollable) */}
                    <div className="flex-1 overflow-y-auto mt-2 -mx-6 px-6">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                Tidak ada siswa yang sesuai dengan filter pencarian.
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100/80 text-gray-700 font-semibold border-b">
                                        <tr>
                                            <th className="py-2.5 px-3 w-10 text-center">No</th>
                                            <th className="py-2.5 px-3">Nama Siswa</th>
                                            <th className="py-2.5 px-3">Status</th>
                                            <th className="py-2.5 px-3">Berkas Tugas</th>
                                            <th className="py-2.5 px-3">Waktu Kirim</th>
                                            <th className="py-2.5 px-3">Catatan Siswa</th>
                                            <th className="py-2.5 px-3">Catatan Pengajar</th>
                                            <th className="py-2.5 px-3 text-center min-w-[140px]">Aksi Review (ACC)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredItems.map((item, index) => {
                                            const sub = item.submission;
                                            const isProcessing = sub && processingSubmissionId === sub.id;

                                            return (
                                                <tr
                                                    key={item.user.id || index}
                                                    className={cn(
                                                        "hover:bg-slate-50/80 transition",
                                                        sub?.status === "pending_review" && "bg-amber-50/30"
                                                    )}
                                                >
                                                    <td className="py-2.5 px-3 text-center text-gray-500">
                                                        {index + 1}
                                                    </td>

                                                    <td className="py-2.5 px-3">
                                                        <div className="font-semibold text-gray-800">
                                                            {item.user.name || "Nama Siswa"}
                                                        </div>
                                                        <div className="text-[11px] text-gray-500">
                                                            {item.user.email}
                                                        </div>
                                                        {item.user.institution && (
                                                            <div className="text-[10px] text-gray-400">
                                                                {item.user.institution}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="py-2.5 px-3">
                                                        {item.status === "unsubmitted" && (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-gray-100 text-gray-600 border-gray-200 text-[10px]"
                                                            >
                                                                Belum Mengumpulkan
                                                            </Badge>
                                                        )}
                                                        {item.status === "pending_review" && (
                                                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300 text-[10px] gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                Perlu Review
                                                            </Badge>
                                                        )}
                                                        {item.status === "approved" && (
                                                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300 text-[10px] gap-1">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Disetujui (ACC)
                                                            </Badge>
                                                        )}
                                                        {item.status === "rejected" && (
                                                            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-300 text-[10px] gap-1">
                                                                <XCircle className="h-3 w-3" />
                                                                Ditolak
                                                            </Badge>
                                                        )}
                                                    </td>

                                                    <td className="py-2.5 px-3">
                                                        {sub ? (
                                                            <div className="space-y-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    type="button"
                                                                    onClick={() => setPreviewSubmission(sub)}
                                                                    className="h-7 text-xs text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 gap-1"
                                                                >
                                                                    <Eye className="h-3 w-3" />
                                                                    Pratinjau Berkas
                                                                </Button>
                                                                <div
                                                                    className="text-[11px] text-gray-700 font-medium truncate max-w-[150px] cursor-pointer hover:underline"
                                                                    title={sub.original_filename}
                                                                    onClick={() => setPreviewSubmission(sub)}
                                                                >
                                                                    {sub.original_filename}
                                                                </div>
                                                                <div className="text-[10px] text-gray-400">
                                                                    {formatBytes(sub.file_size)} • v{sub.version}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>

                                                    <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                                                        {sub?.created_at ? (
                                                            <div>
                                                                <div>
                                                                    {format(new Date(sub.created_at), "dd/MM/yyyy", {
                                                                        locale: idLocale,
                                                                    })}
                                                                </div>
                                                                <div className="text-[11px] text-gray-400">
                                                                    {format(new Date(sub.created_at), "HH:mm", {
                                                                        locale: idLocale,
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>

                                                    <td className="py-2.5 px-3 text-gray-600 max-w-[160px]">
                                                        {sub?.student_notes ? (
                                                            <p className="line-clamp-2 text-[11px]" title={sub.student_notes}>
                                                                {sub.student_notes}
                                                            </p>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>

                                                    <td className="py-2.5 px-3 text-gray-600 max-w-[160px]">
                                                        {sub?.admin_notes ? (
                                                            <p className="line-clamp-2 text-[11px] text-rose-600 font-medium" title={sub.admin_notes}>
                                                                {sub.admin_notes}
                                                            </p>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>

                                                    <td className="py-2.5 px-3 text-center">
                                                        {sub ? (
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                {/* ACC Button */}
                                                                {sub.status !== "approved" ? (
                                                                    <Button
                                                                        size="sm"
                                                                        type="button"
                                                                        onClick={() => handleApprove(sub)}
                                                                        disabled={isProcessing}
                                                                        className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-sm"
                                                                        title="ACC / Setujui Submission"
                                                                    >
                                                                        {isProcessing ? (
                                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                                        ) : (
                                                                            <Check className="h-3.5 w-3.5" />
                                                                        )}
                                                                        <span>ACC</span>
                                                                    </Button>
                                                                ) : (
                                                                    <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5">
                                                                        <Check className="h-3 w-3 mr-1" />
                                                                        Sudah ACC
                                                                    </span>
                                                                )}

                                                                {/* Tolak Button */}
                                                                {sub.status !== "rejected" && (
                                                                    <Button
                                                                        size="sm"
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => openRejectModal(sub)}
                                                                        disabled={isProcessing}
                                                                        className="h-7 px-2 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                                                                        title="Tolak Submission dengan Catatan"
                                                                    >
                                                                        <X className="h-3.5 w-3.5" />
                                                                        <span>Tolak</span>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-[11px] italic">
                                                                Belum ada berkas
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t mt-3 flex items-center justify-between shrink-0">
                        <span className="text-xs text-gray-500">
                            Menampilkan {filteredItems.length} dari {tableItems.length} siswa
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                        >
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reject Notes Prompt Dialog */}
            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-700">
                            <AlertCircle className="h-5 w-5" />
                            Tolak Submission Siswa
                        </DialogTitle>
                        <DialogDescription>
                            Tuliskan alasan penolakan dan instruksi perbaikan yang harus diperbaiki oleh siswa.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleConfirmReject} className="space-y-4 pt-2">
                        <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 border">
                            <div>
                                <span className="font-semibold text-gray-700">Siswa: </span>
                                <span>{targetSubmission?.user?.name} ({targetSubmission?.user?.email})</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Berkas: </span>
                                <span className="text-primary font-mono">{targetSubmission?.original_filename}</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                Catatan / Alasan Penolakan <span className="text-rose-500">*</span>
                            </label>
                            <Textarea
                                rows={4}
                                placeholder="Contoh: Lampiran belum menyertakan file SPT Induk, silakan lengkapi dan kirim ulang..."
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRejectModalOpen(false)}
                                disabled={isRejecting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={isRejecting}
                                className="gap-1.5"
                            >
                                {isRejecting && <Loader2 className="h-4 w-4 animate-spin" />}
                                Tolak Submission
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* File Preview Modal */}
            <Dialog open={previewSubmission !== null} onOpenChange={(isOpen) => !isOpen && setPreviewSubmission(null)}>
                <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-6 overflow-hidden">
                    <DialogHeader className="border-b pb-3 shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-indigo-600" />
                                    <span>Pratinjau Berkas: {previewSubmission?.original_filename}</span>
                                </DialogTitle>
                                <DialogDescription className="text-xs text-gray-500 mt-0.5">
                                    Siswa: <strong>{previewSubmission?.user?.name}</strong> • Versi {previewSubmission?.version} • {formatBytes(previewSubmission?.file_size)}
                                </DialogDescription>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="h-8 text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 gap-1.5"
                                >
                                    <a href={previewSubmission ? route("submissions.download", previewSubmission.id) : "#"} download>
                                        <Download className="h-3.5 w-3.5" />
                                        Unduh File
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {previewSubmission?.student_notes && (
                            <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-md border text-gray-700">
                                <span className="font-semibold text-gray-800">Catatan Siswa: </span>
                                {previewSubmission.student_notes}
                            </div>
                        )}
                    </DialogHeader>

                    {/* Preview Viewport */}
                    <div className="flex-1 overflow-auto mt-2 min-h-[350px] max-h-[62vh] rounded-lg border bg-slate-100 flex items-center justify-center p-2">
                        {previewSubmission && (() => {
                            const ext = previewSubmission.original_filename?.split(".").pop()?.toLowerCase() || "";
                            const isPdf = previewSubmission.mime_type === "application/pdf" || ext === "pdf";
                            const isImage = previewSubmission.mime_type?.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

                            if (isPdf) {
                                return (
                                    <iframe
                                        src={route("submissions.preview", previewSubmission.id)}
                                        className="w-full h-full min-h-[58vh] rounded border-0 bg-white"
                                        title="Pratinjau PDF"
                                    />
                                );
                            }

                            if (isImage) {
                                return (
                                    <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
                                        <img
                                            src={route("submissions.preview", previewSubmission.id)}
                                            alt={previewSubmission.original_filename}
                                            className="max-w-full max-h-[58vh] object-contain rounded shadow"
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div className="text-center p-8 space-y-3 max-w-md mx-auto bg-white rounded-xl shadow-xs border">
                                    <FileText className="mx-auto h-12 w-12 text-indigo-500" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">
                                            {previewSubmission.original_filename}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format file <strong>.{ext.toUpperCase()}</strong> tidak dapat dipratinjau langsung di peramban.
                                        </p>
                                    </div>
                                    <Button size="sm" asChild className="gap-1.5 bg-primary text-white">
                                        <a href={route("submissions.download", previewSubmission.id)} download>
                                            <Download className="h-4 w-4" />
                                            Unduh untuk Membuka Berkas
                                        </a>
                                    </Button>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Preview Modal Footer with ACC / Reject action */}
                    <div className="pt-3 border-t mt-2 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                            {previewSubmission?.status === "approved" ? (
                                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1">
                                    <Check className="h-3.5 w-3.5 mr-1" />
                                    Status: Disetujui (ACC)
                                </span>
                            ) : (
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => previewSubmission && handleApprove(previewSubmission)}
                                    disabled={processingSubmissionId === previewSubmission?.id}
                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
                                >
                                    {processingSubmissionId === previewSubmission?.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                    <span>ACC / Setujui Submission</span>
                                </Button>
                            )}

                            {previewSubmission?.status !== "rejected" && (
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const sub = previewSubmission;
                                        setPreviewSubmission(null);
                                        openRejectModal(sub);
                                    }}
                                    className="text-xs border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800 gap-1"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Tolak dengan Catatan</span>
                                </Button>
                            )}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewSubmission(null)}
                        >
                            Tutup Pratinjau
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi ACC Semua Siswa */}
            <AlertDialog open={approveAllDialogOpen} onOpenChange={setApproveAllDialogOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-emerald-700 text-base">
                            <CheckCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                            <span>ACC Semua Siswa</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-gray-600 space-y-3 pt-2 text-left" asChild>
                            <div>
                                <p>
                                    Apakah Anda yakin ingin menyetujui (ACC) seluruh siswa untuk tugas <strong>{courseSubmission.title}</strong>? Tindakan ini akan membuka akses ujian untuk siswa terkait.
                                </p>
                                <div className="bg-slate-50 border rounded-lg p-3 space-y-1.5 text-xs mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Siswa menunggu review:</span>
                                        <strong className="text-amber-700">{stats.pending} siswa</strong>
                                    </div>
                                    {stats.rejected > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Siswa status ditolak:</span>
                                            <strong className="text-rose-700">{stats.rejected} siswa</strong>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Siswa belum mengumpulkan:</span>
                                        <strong className="text-gray-700">{stats.unsubmitted} siswa</strong>
                                    </div>
                                    <div className="border-t pt-1.5 flex justify-between font-semibold">
                                        <span className="text-gray-800">Total siswa yang akan di-ACC:</span>
                                        <span className="text-emerald-700 font-bold">
                                            {includeUnsubmitted ? notApprovedCount : (stats.pending + stats.rejected)} siswa
                                        </span>
                                    </div>
                                </div>

                                {stats.unsubmitted > 0 && (
                                    <label className="flex items-start gap-2 pt-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={includeUnsubmitted}
                                            onChange={(e) => setIncludeUnsubmitted(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-700">
                                            Sertakan juga siswa yang belum mengumpulkan ({stats.unsubmitted} siswa) agar dapat langsung mengikuti ujian.
                                        </span>
                                    </label>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel disabled={isApprovingAll} className="text-xs">
                            Batal
                        </AlertDialogCancel>
                        <Button
                            type="button"
                            disabled={isApprovingAll || (!includeUnsubmitted && stats.pending + stats.rejected === 0)}
                            onClick={handleConfirmApproveAll}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold"
                        >
                            {isApprovingAll ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Memproses ACC...
                                </>
                            ) : (
                                <>
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    Ya, ACC Semua Siswa
                                </>
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
