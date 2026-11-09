import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Textarea } from "@/Components/ui/textarea";
import {
    FileText,
    Upload,
    Download,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Loader2,
    Calendar,
    Paperclip,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface StudentCourseSubmissionsSectionProps {
    courseId: string;
    courseSubmissions: any[];
}

export default function StudentCourseSubmissionsSection({
    courseId,
    courseSubmissions = [],
}: StudentCourseSubmissionsSectionProps) {
    const [uploadForms, setUploadForms] = useState<{
        [taskId: string]: {
            file: File | null;
            notes: string;
            isSubmitting: boolean;
            showForm: boolean;
        };
    }>({});

    const getFormState = (taskId: string) => {
        return (
            uploadForms[taskId] || {
                file: null,
                notes: "",
                isSubmitting: false,
                showForm: false,
            }
        );
    };

    const updateFormState = (taskId: string, partial: any) => {
        setUploadForms((prev) => ({
            ...prev,
            [taskId]: {
                ...getFormState(taskId),
                ...partial,
            },
        }));
    };

    const formatBytes = (bytes?: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const handleSubmitSubmission = (e: React.FormEvent, taskId: string) => {
        e.preventDefault();
        const form = getFormState(taskId);

        if (!form.file) {
            toast.error("Silakan pilih berkas tugas yang akan diunggah.");
            return;
        }

        const formData = new FormData();
        formData.append("file", form.file);
        if (form.notes.trim()) {
            formData.append("student_notes", form.notes.trim());
        }

        updateFormState(taskId, { isSubmitting: true });

        router.post(
            route("courses.submissions.storeCourseSubmission", [courseId, taskId]),
            formData,
            {
                preserveScroll: true,
                onSuccess: () => {
                    updateFormState(taskId, {
                        file: null,
                        notes: "",
                        isSubmitting: false,
                        showForm: false,
                    });
                },
                onError: (errors: any) => {
                    updateFormState(taskId, { isSubmitting: false });
                    const firstError = Object.values(errors)[0] as string;
                    if (firstError) {
                        toast.error(firstError);
                    }
                },
            }
        );
    };

    return (
        <div className="rounded-xl bg-white border shadow p-6 space-y-4">
            <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tugas & Submission Kelas ({courseSubmissions.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    Kumpulkan tugas Anda sesuai instruksi pengajar. Status tugas yang disetujui (ACC) menjadi syarat untuk membuka ujian kelas yang mewajibkannya.
                </p>
            </div>

            {courseSubmissions.length > 0 ? (
                <div className="space-y-4">
                    {courseSubmissions.map((task: any, index: number) => {
                        const sub = task.user_submission;
                        const form = getFormState(task.id);
                        const isRejected = sub && sub.status === "rejected";
                        const isApproved = sub && sub.status === "approved";
                        const isPending = sub && sub.status === "pending_review";
                        const isUnsubmitted = !sub;
                        const isDeadlinePassed = Boolean(task.deadline && new Date() > new Date(task.deadline));
                        const canEditSubmission = !isApproved && !isDeadlinePassed;

                        return (
                            <div
                                key={task.id}
                                className={cn(
                                    "rounded-xl border p-4 transition space-y-3",
                                    isApproved && "bg-emerald-50/30 border-emerald-200",
                                    isPending && "bg-amber-50/30 border-amber-200",
                                    isRejected && "bg-rose-50/30 border-rose-200",
                                    isUnsubmitted && "bg-slate-50/70 border-slate-200"
                                )}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-gray-500 bg-white border rounded px-1.5 py-0.5">
                                                Tugas #{index + 1}
                                            </span>
                                            <h3 className="font-semibold text-gray-900 text-base">
                                                {task.title}
                                            </h3>

                                            {/* Status Badge */}
                                            {isUnsubmitted && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-gray-100 text-gray-600 border-gray-300 text-xs"
                                                >
                                                    Belum Mengumpulkan
                                                </Badge>
                                            )}
                                            {isPending && (
                                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300 text-xs gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Menunggu Review Pengajar
                                                </Badge>
                                            )}
                                            {isApproved && (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300 text-xs gap-1">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Disetujui (ACC)
                                                </Badge>
                                            )}
                                            {isRejected && (
                                                <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-300 text-xs gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    Perlu Perbaikan (Ditolak)
                                                </Badge>
                                            )}
                                            {isDeadlinePassed && (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                                    Tenggat Berakhir
                                                </Badge>
                                            )}
                                        </div>

                                        {task.deadline && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                <span>Batas Pengumpulan: </span>
                                                <span className="font-medium text-rose-600">
                                                    {format(new Date(task.deadline), "d MMMM yyyy, HH:mm", {
                                                        locale: idLocale,
                                                    })}
                                                </span>
                                            </div>
                                        )}

                                        {task.description && (
                                            <div className="text-xs text-gray-700 bg-white/80 p-2.5 rounded-lg border">
                                                <span className="font-semibold block mb-0.5 text-gray-800">
                                                    Petunjuk Tugas:
                                                </span>
                                                <p className="whitespace-pre-line">{task.description}</p>
                                            </div>
                                        )}

                                        {/* Download Template if available */}
                                        {task.file_path && (
                                            <div className="pt-1">
                                                <a
                                                    href={route("courses.submissions.attachment", [
                                                        courseId,
                                                        task.id,
                                                    ])}
                                                    download
                                                    className="inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2.5 py-1 font-medium transition"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    Download Lampiran Template: {task.original_filename}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rejection Alert Box */}
                                {isRejected && (
                                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 space-y-1 text-xs">
                                        <div className="flex items-center gap-1.5 font-bold text-rose-800">
                                            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                                            <span>Catatan Perbaikan dari Pengajar:</span>
                                        </div>
                                        <p className="text-rose-700 pl-5 whitespace-pre-line">
                                            {sub.admin_notes || "Tugas Anda perlu diperbaiki. Silakan periksa kembali dan kirimkan revisi."}
                                        </p>
                                    </div>
                                )}

                                {/* Approval Success Box */}
                                {/* {isApproved && (
                                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 space-y-1 text-xs text-emerald-800">
                                        <div className="flex items-center gap-1.5 font-bold">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                            <span>Tugas Anda Telah Di-ACC (Disetujui)!</span>
                                        </div>
                                        <p className="text-emerald-700 pl-5">
                                            Anda telah memenuhi persyaratan tugas ini dan dapat mengakses ujian kelas terkait.
                                        </p>
                                    </div>
                                )} */}

                                {/* Existing Submission Info */}
                                {sub && (
                                    <div className="rounded-lg border bg-white p-3 space-y-2 text-xs">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-2">
                                            <div className="flex items-center gap-2">
                                                <Paperclip className="h-4 w-4 text-gray-500" />
                                                <span className="font-semibold text-gray-800">Berkas Terkirim:</span>
                                                <span className="font-mono text-primary font-medium truncate max-w-[200px]" title={sub.original_filename}>
                                                    {sub.original_filename}
                                                </span>
                                                <span className="text-gray-400">
                                                    ({formatBytes(sub.file_size)} • Versi {sub.version})
                                                </span>
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                                className="h-7 text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                            >
                                                <a href={route("submissions.download", sub.id)} download>
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Unduh Berkas Saya
                                                </a>
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-2 text-gray-500 text-[11px]">
                                            <span>
                                                Dikirim:{" "}
                                                {format(new Date(sub.created_at), "d MMMM yyyy, HH:mm", {
                                                    locale: idLocale,
                                                })}
                                            </span>
                                            {sub.student_notes && (
                                                <span className="italic">
                                                    Catatan Anda: &quot;{sub.student_notes}&quot;
                                                </span>
                                            )}
                                        </div>

                                        {/* Edit Button for Pending Submission before Deadline */}
                                        {isPending && canEditSubmission && !form.showForm && (
                                            <div className="pt-2 border-t flex justify-end">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateFormState(task.id, { showForm: true, notes: sub.student_notes || "" })}
                                                    className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-300 gap-1.5"
                                                >
                                                    <Upload className="h-3.5 w-3.5" />
                                                    Edit / Ganti Berkas (Sebelum ACC)
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Notice if deadline passed and not submitted */}
                                {isDeadlinePassed && isUnsubmitted && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                        Batas waktu pengumpulan tugas ini telah berakhir. Anda tidak dapat mengirimkan tugas lagi.
                                    </div>
                                )}

                                {/* Upload / Edit Form (for unsubmitted or resubmitting/editing task before deadline) */}
                                {canEditSubmission && (isUnsubmitted || form.showForm) && (
                                    <div className="pt-2">
                                        {!form.showForm && isRejected ? (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => updateFormState(task.id, { showForm: true })}
                                                className="text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
                                            >
                                                <Upload className="h-3.5 w-3.5" />
                                                Kirim Berkas Revisi (Versi {(sub?.version || 1) + 1})
                                            </Button>
                                        ) : (
                                            <form
                                                onSubmit={(e) => handleSubmitSubmission(e, task.id)}
                                                className="space-y-3 bg-white p-3.5 rounded-lg border shadow-xs"
                                            >
                                                <div className="font-semibold text-xs text-gray-800 flex items-center gap-1.5">
                                                    <Upload className="h-3.5 w-3.5 text-primary" />
                                                    <span>
                                                        {isRejected
                                                            ? `Form Kirim Berkas Revisi (Versi ${(sub?.version || 1) + 1})`
                                                            : isPending
                                                            ? `Form Edit / Perbarui Berkas Tugas (Versi ${(sub?.version || 1) + 1})`
                                                            : "Form Pengumpulan Tugas"}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-gray-700">
                                                            {sub ? "Pilih Berkas Pengganti / Revisi" : "Pilih Berkas Tugas"}{" "}
                                                            <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            required
                                                            onChange={(e) =>
                                                                updateFormState(task.id, {
                                                                    file: e.target.files?.[0] || null,
                                                                })
                                                            }
                                                            className="block w-full text-xs text-gray-700 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 border rounded-md p-1 bg-slate-50 cursor-pointer"
                                                            accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.txt"
                                                        />
                                                        <p className="text-[10px] text-gray-400">
                                                            Mendukung PDF, Word, Excel, ZIP, Gambar (Maks 10MB)
                                                        </p>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-medium text-gray-700">
                                                            Catatan Tambahan untuk Pengajar (Opsional)
                                                        </label>
                                                        <Textarea
                                                            rows={2}
                                                            placeholder="Tuliskan catatan terkait berkas yang Anda kirimkan..."
                                                            value={form.notes}
                                                            onChange={(e) =>
                                                                updateFormState(task.id, { notes: e.target.value })
                                                            }
                                                            className="text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-2 pt-1">
                                                    {(isRejected || isPending) && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateFormState(task.id, { showForm: false })}
                                                            disabled={form.isSubmitting}
                                                            className="text-xs"
                                                        >
                                                            Batal
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        disabled={form.isSubmitting || !form.file}
                                                        className="text-xs gap-1.5"
                                                    >
                                                        {form.isSubmitting && (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        )}
                                                        {isRejected
                                                            ? "Kirim Berkas Revisi"
                                                            : isPending
                                                            ? "Simpan Perubahan Berkas"
                                                            : "Kirim Tugas"}
                                                    </Button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-6 text-center bg-slate-50/50">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-800">
                        Belum Ada Tugas / Submission
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Pengajar belum memberikan tugas submission untuk kelas ini.
                    </p>
                </div>
            )}
        </div>
    );
}

