import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import FakturKeluaran from "@/Pages/Course/CourseResults/FakturKeluaran";
import FakturMasukan from "@/Pages/Course/CourseResults/FakturMasukan";
import Bupot from "@/Pages/Course/CourseResults/Bupot";
import SPT from "@/Pages/Course/CourseResults/SPT";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { Label } from "@/Components/ui/label";
import ReturKeluaran from "@/Pages/Course/CourseResults/ReturKeluaran";
import ReturMasukan from "@/Pages/Course/CourseResults/ReturMasukan";
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

export default function ParticipantDetail({
    test,
    participant,
    fakturs,
    returs,
    others,
    returOthers,
    bupots,
    spts,
    courseResults,
    averageScore,
    bestScore,
    attempts = [],
}: any) {
    const { flash }: any = usePage().props;
    const [feedbackData, setFeedbackData] = useState(
        participant.feedback || ""
    );
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [deleteFeedbackOpen, setDeleteFeedbackOpen] = useState(false);
    const [deleteScoreOpen, setDeleteScoreOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleFeedbackSubmit = () => {
        router.post(
            route("teacher.giveFeedback", participant.id),
            {
                feedback: feedbackData,
            },
            {
                onSuccess: () => {
                    setFeedbackOpen(false);
                },
            }
        );
    };

    const handleDeleteFeedback = () => {
        router.post(
            route("teacher.deleteFeedback", participant.id),
            {
                feedback: null,
            },
            {
                onSuccess: () => {
                    setDeleteFeedbackOpen(false);
                    setFeedbackData("");
                },
            }
        );
    };

    // No delete handler for best score (it's derived from attempts)

    return (
        <TeacherLayout>
            <Head title={`Detail Peserta - ${participant.user?.name}`} />

            <div className="teacher-page-shell">
                <div className="teacher-page-stack">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.tests")}>
                                    Daftar Test
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link
                                    href={route(
                                        "teacher.showTest",
                                        test.id
                                    )}
                                >
                                    Detail Test
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detail Peserta</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="teacher-page-title">
                                Detail Peserta - {participant.user?.name}
                            </h1>
                            <p className="text-gray-600">
                                Test: {test.name}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white border shadow p-6">
                        <h2 className="text-lg font-bold mb-4 text-primary">
                            Informasi Peserta
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500">
                                    Nama
                                </div>
                                <div className="font-medium">
                                    {participant.user?.name || "-"}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Email
                                </div>
                                <div className="font-medium">
                                    {participant.user?.email || "-"}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Nilai Terbaik
                                </div>
                                <div className="font-mono text-lg font-bold text-primary">
                                    {bestScore !== null && bestScore !== undefined ? (
                                        bestScore
                                    ) : (
                                        <span className="italic text-gray-400">
                                            Belum ada nilai
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Feedback
                                </div>
                                <div className="font-medium mb-2">
                                    {participant.feedback || "-"}
                                </div>
                                <div className="space-x-2">
                                    <Dialog
                                        open={feedbackOpen}
                                        onOpenChange={setFeedbackOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                                onClick={() =>
                                                    setFeedbackOpen(true)
                                                }
                                            >
                                                <MessageSquare size={16} />
                                                {feedbackData
                                                    ? "Ubah Feedback"
                                                    : "Beri Feedback"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {feedbackData
                                                        ? "Ubah Feedback"
                                                        : "Beri Feedback"}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Berikan feedback untuk
                                                    peserta{" "}
                                                    {participant.user?.name}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div>
                                                    <Label htmlFor="feedback">
                                                        Feedback
                                                    </Label>
                                                    <textarea
                                                        id="feedback"
                                                        rows={5}
                                                        placeholder="Tulis feedback untuk peserta..."
                                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                        value={feedbackData}
                                                        onChange={(e) =>
                                                            setFeedbackData(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setFeedbackOpen(false)
                                                    }
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    onClick={
                                                        handleFeedbackSubmit
                                                    }
                                                >
                                                    Simpan Feedback
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    {participant.feedback && (
                                        <AlertDialog
                                            open={deleteFeedbackOpen}
                                            onOpenChange={setDeleteFeedbackOpen}
                                        >
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="text-red-700 bg-red-50 border-red-200 hover:bg-red-100"
                                                >
                                                    <Trash2 size={16} />
                                                    Hapus Feedback
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Hapus Feedback
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah Anda yakin ingin
                                                        menghapus feedback untuk{" "}
                                                        <span className="font-semibold">
                                                            {
                                                                participant.user
                                                                    ?.name
                                                            }
                                                        </span>
                                                        ? Tindakan ini tidak
                                                        dapat dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={
                                                            handleDeleteFeedback
                                                        }
                                                    >
                                                        Hapus Feedback
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-primary mb-2">
                            Hasil yang Sudah Dikerjakan
                        </h2>
                        {attempts.length === 0 ? (
                            <div className="text-sm italic text-gray-500">Belum ada riwayat pengerjaan.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 border">#</th>
                                            <th className="px-3 py-2 border text-left">Mulai</th>
                                            <th className="px-3 py-2 border text-left">Selesai</th>
                                            <th className="px-3 py-2 border text-left">Durasi</th>
                                            <th className="px-3 py-2 border text-left">Tipe</th>
                                            <th className="px-3 py-2 border text-left">Status</th>
                                            <th className="px-3 py-2 border text-left">Nilai</th>
                                            <th className="px-3 py-2 border text-left">Keterangan</th>
                                            <th className="px-3 py-2 border text-left">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((a: any, idx: number) => {
                                            const start = a.created_at ? new Date(a.created_at) : null;
                                            const end = a.submitted_at || a.completed_at ? new Date(a.submitted_at ?? a.completed_at) : null;
                                            const durationSec = start && end ? Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000)) : null;
                                            const mm = durationSec !== null ? String(Math.floor(durationSec / 60)).padStart(2, '0') : '-';
                                            const ss = durationSec !== null ? String(durationSec % 60).padStart(2, '0') : '-';
                                            const status = a.submitted_at ? 'Terkumpul' : (a.created_at ? 'Sedang Berlangsung / Batal' : 'Belum Mulai');
                                            const passingScore = typeof test?.passing_score === 'number' ? test.passing_score : parseFloat(test?.passing_score ?? 'NaN');
                                            const numericScore = typeof a?.score === 'number' ? a.score : parseFloat(a?.score ?? 'NaN');
                                            const hasScore = Number.isFinite(numericScore);
                                            const passed = hasScore && Number.isFinite(passingScore) ? numericScore >= passingScore : null;
                                            return (
                                                <tr key={a.id} className="odd:bg-white even:bg-gray-50">
                                                    <td className="px-3 py-2 border text-center">{idx + 1}</td>
                                                    <td className="px-3 py-2 border">{start ? start.toLocaleString() : '-'}</td>
                                                    <td className="px-3 py-2 border">{end ? end.toLocaleString() : '-'}</td>
                                                    <td className="px-3 py-2 border font-mono">{durationSec !== null ? `${mm}:${ss}` : '-'}</td>
                                                    <td className="px-3 py-2 border">{a.test_type ?? '-'}</td>
                                                    <td className="px-3 py-2 border">{status}</td>
                                                    <td className="px-3 py-2 border font-mono">{a.score ?? '-'}</td>
                                                    <td className="px-3 py-2 border">
                                                        {passed === true && (
                                                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                                                Lulus
                                                            </span>
                                                        )}
                                                        {passed === false && (
                                                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                                                Tidak Lulus
                                                            </span>
                                                        )}
                                                        {passed === null && (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 border">
                                                        {status === 'Terkumpul' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                                                asChild
                                                            >
                                                                <Link href={route('teacher.testResult', [test.id, a.id])}>
                                                                    Lihat Hasil
                                                                </Link>
                                                            </Button>
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
                </div>
            </div>
        </TeacherLayout>
    );
}
