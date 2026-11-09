import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Plus,
    FileText,
    Pencil,
    Trash2,
    Download,
    Users,
    Clock,
    CheckCircle2,
    CheckCheck,
    Eye,
    Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import CourseSubmissionFormModal from "./CourseSubmissionFormModal";
import TeacherSubmissionDetailModal from "./TeacherSubmissionDetailModal";
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

interface TeacherCourseSubmissionsCardProps {
    courseId: string;
    courseSubmissions: any[];
    participants: any[];
}

export default function TeacherCourseSubmissionsCard({
    courseId,
    courseSubmissions = [],
    participants = [],
}: TeacherCourseSubmissionsCardProps) {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingSubmission, setEditingSubmission] = useState<any | null>(null);

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedSubmissionForDetail, setSelectedSubmissionForDetail] = useState<any | null>(null);

    const openCreateModal = () => {
        setEditingSubmission(null);
        setFormModalOpen(true);
    };

    const openEditModal = (submission: any) => {
        setEditingSubmission(submission);
        setFormModalOpen(true);
    };

    const openDetailModal = (submission: any) => {
        setSelectedSubmissionForDetail(submission);
        setDetailModalOpen(true);
    };

    const handleDeleteSubmission = (submissionId: string) => {
        router.delete(route("teacher.courseSubmissions.destroy", [courseId, submissionId]), {
            preserveScroll: true,
            onError: (err: any) => {
                if (err?.error) toast.error(err.error);
            },
        });
    };

    // Keep active selected submission updated with the latest prop data
    const activeDetailSubmission = selectedSubmissionForDetail
        ? courseSubmissions.find((cs) => cs.id === selectedSubmissionForDetail.id) || selectedSubmissionForDetail
        : null;

    return (
        <div className="rounded-xl bg-white border shadow p-6 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Submission & Tugas Kelas ({courseSubmissions.length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Kelola tugas submission untuk siswa dan berikan persetujuan (ACC) berkas yang dikumpulkan.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={openCreateModal}
                    className="w-full sm:w-auto text-white bg-primary hover:bg-primary/90 gap-1.5"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Submission
                </Button>
            </div>

            {courseSubmissions.length > 0 ? (
                <div className="space-y-3">
                    {courseSubmissions.map((submission: any) => {
                        const subs = submission.submissions || [];
                        const submittedCount = subs.length;
                        const pendingCount = subs.filter((s: any) => s.status === "pending_review").length;
                        const approvedCount = subs.filter((s: any) => s.status === "approved").length;

                        return (
                            <div
                                key={submission.id}
                                className="rounded-xl border bg-slate-50/70 p-4 transition hover:border-slate-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-gray-800 text-base">
                                                {submission.title}
                                            </h3>

                                            {submission.deadline ? (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-rose-50 text-rose-700 border-rose-200 text-xs gap-1"
                                                >
                                                    <Clock className="h-3 w-3" />
                                                    Batas:{" "}
                                                    {format(
                                                        new Date(submission.deadline),
                                                        "d MMM yyyy, HH:mm",
                                                        { locale: idLocale }
                                                    )}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-gray-100 text-gray-600 border-gray-200 text-xs"
                                                >
                                                    Tanpa Batas Waktu
                                                </Badge>
                                            )}
                                        </div>

                                        {submission.description && (
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {submission.description}
                                            </p>
                                        )}

                                        {/* Attachment Template */}
                                        {submission.file_path && (
                                            <div className="pt-1">
                                                <a
                                                    href={route("courses.submissions.attachment", [
                                                        courseId,
                                                        submission.id,
                                                    ])}
                                                    download
                                                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2.5 py-1 transition"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Template Tugas: {submission.original_filename}
                                                </a>
                                            </div>
                                        )}

                                        {/* Submission Progress Stats */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                            <span className="inline-flex items-center gap-1 text-gray-600 bg-white border rounded px-2 py-0.5">
                                                <Users className="h-3 w-3 text-gray-400" />
                                                Terkumpul: <strong>{submittedCount} / {participants.length}</strong>
                                            </span>

                                            {pendingCount > 0 && (
                                                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 animate-pulse">
                                                    <Clock className="h-3 w-3" />
                                                    {pendingCount} Perlu ACC
                                                </span>
                                            )}

                                            {approvedCount > 0 && (
                                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {approvedCount} Di-ACC
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 md:self-start shrink-0">
                                        <Button
                                            size="sm"
                                            type="button"
                                            onClick={() => openDetailModal(submission)}
                                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            Detail & Periksa Siswa
                                        </Button>

                                        {participants.length > 0 && approvedCount < participants.length && (
                                            <Button
                                                size="sm"
                                                type="button"
                                                onClick={() => openDetailModal(submission)}
                                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-sm"
                                                title="Buka detail & ACC Semua Siswa"
                                            >
                                                <CheckCheck className="h-3.5 w-3.5" />
                                                ACC Semua
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            type="button"
                                            onClick={() => openEditModal(submission)}
                                            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                                            title="Edit Submission"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                                    title="Hapus Submission"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Hapus Tugas Submission?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah Anda yakin ingin menghapus tugas <strong>{submission.title}</strong>? Seluruh berkas submission siswa untuk tugas ini juga akan terhapus.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-rose-600 hover:bg-rose-700"
                                                        onClick={() => handleDeleteSubmission(submission.id)}
                                                    >
                                                        Hapus Tugas
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-8 text-center bg-slate-50/50">
                    <FileText className="mx-auto h-9 w-9 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-800">
                        Belum Ada Submission / Tugas
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Klik tombol di atas untuk membuat tugas submission baru bagi siswa di kelas ini.
                    </p>
                    <div className="mt-4">
                        <Button
                            type="button"
                            size="sm"
                            onClick={openCreateModal}
                            className="text-xs gap-1.5"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Tambah Submission
                        </Button>
                    </div>
                </div>
            )}

            {/* Create / Edit Modal */}
            <CourseSubmissionFormModal
                open={formModalOpen}
                onOpenChange={setFormModalOpen}
                courseId={courseId}
                courseSubmission={editingSubmission}
            />

            {/* Detail & Review (ACC) Modal */}
            <TeacherSubmissionDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                courseId={courseId}
                courseSubmission={activeDetailSubmission}
                participants={participants}
            />
        </div>
    );
}

