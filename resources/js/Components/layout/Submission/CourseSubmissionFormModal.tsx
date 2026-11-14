import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon, Upload, Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

interface CourseSubmissionFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    courseSubmission?: any | null;
}

export default function CourseSubmissionFormModal({
    open,
    onOpenChange,
    courseId,
    courseSubmission,
}: CourseSubmissionFormModalProps) {
    const isEdit = Boolean(courseSubmission?.id);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
    const [deadlineTime, setDeadlineTime] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (courseSubmission) {
                setTitle(courseSubmission.title || "");
                setDescription(courseSubmission.description || "");

                if (courseSubmission.deadline) {
                    const d = new Date(courseSubmission.deadline);
                    setDeadlineDate(d);
                    const hours = String(d.getHours()).padStart(2, "0");
                    const minutes = String(d.getMinutes()).padStart(2, "0");
                    setDeadlineTime(`${hours}:${minutes}`);
                } else {
                    setDeadlineDate(null);
                    setDeadlineTime("");
                }
            } else {
                setTitle("");
                setDescription("");
                setDeadlineDate(null);
                setDeadlineTime("");
            }
            setFile(null);
        }
    }, [open, courseSubmission]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Judul tugas submission wajib diisi.");
            return;
        }

        let formattedDeadline: string | null = null;
        if (deadlineDate) {
            const dateStr = format(deadlineDate, "yyyy-MM-dd");
            const timeStr = deadlineTime ? `${deadlineTime}:00` : "23:59:00";
            formattedDeadline = `${dateStr} ${timeStr}`;
        }

        const formData = new FormData();
        formData.append("title", title);
        if (description) formData.append("description", description);
        if (formattedDeadline) formData.append("deadline", formattedDeadline);
        if (file) formData.append("file", file);

        setIsLoading(true);

        if (isEdit) {
            formData.append("_method", "PUT");
            router.post(
                route("teacher.courseSubmissions.update", [courseId, courseSubmission.id]),
                formData,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsLoading(false);
                        onOpenChange(false);
                    },
                    onError: (errors: any) => {
                        setIsLoading(false);
                        const firstError = Object.values(errors)[0] as string;
                        if (firstError) toast.error(firstError);
                    },
                }
            );
        } else {
            router.post(
                route("teacher.courseSubmissions.store", courseId),
                formData,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsLoading(false);
                        onOpenChange(false);
                    },
                    onError: (errors: any) => {
                        setIsLoading(false);
                        const firstError = Object.values(errors)[0] as string;
                        if (firstError) toast.error(firstError);
                    },
                }
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Tugas Submission" : "Tambah Tugas Submission Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        Buat instruksi penugasan atau submission berkas untuk siswa kelas ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs md:text-sm font-medium text-gray-700">
                            Nama / Judul Submission <span className="text-rose-500">*</span>
                        </label>
                        <Input
                            placeholder="Contoh: Tugas Praktik SPT Masa PPN 1111"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs md:text-sm font-medium text-gray-700">
                            Petunjuk / Instruksi Tugas (Opsional)
                        </label>
                        <Textarea
                            rows={3}
                            placeholder="Jelaskan apa yang harus dikerjakan siswa dan format berkas yang diharapkan..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs md:text-sm font-medium text-gray-700">
                                Batas Tanggal (Deadline)
                            </label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal text-xs md:text-sm",
                                            !deadlineDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadlineDate ? (
                                            format(deadlineDate, "d MMMM yyyy", { locale: idLocale })
                                        ) : (
                                            "Pilih Tanggal"
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        toYear={new Date().getFullYear() + 5}
                                        selected={deadlineDate || undefined}
                                        onSelect={(d) => {
                                            setDeadlineDate(d || null);
                                            setCalendarOpen(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs md:text-sm font-medium text-gray-700">
                                Batas Jam (Deadline)
                            </label>
                            <Input
                                type="time"
                                value={deadlineTime}
                                onChange={(e) => setDeadlineTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs md:text-sm font-medium text-gray-700">
                            Lampiran Berkas / Template Soal (Opsional)
                        </label>
                        <div className="border border-dashed rounded-lg p-3 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.txt"
                            />
                            <div className="flex flex-col items-center justify-center gap-1">
                                <Upload className="h-5 w-5 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                    {file ? (
                                        <span className="font-semibold text-primary">{file.name}</span>
                                    ) : courseSubmission?.original_filename ? (
                                        <span>
                                            Berkas saat ini: <strong className="text-primary">{courseSubmission.original_filename}</strong> (Klik untuk mengganti)
                                        </span>
                                    ) : (
                                        "Klik untuk unggah file panduan / format kerja (PDF, Word, Excel, ZIP maks 10MB)"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading} className="gap-2">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEdit ? "Simpan Perubahan" : "Buat Tugas"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

