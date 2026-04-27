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
    course,
    participant,
    fakturs,
    returs,
    others,
    returOthers,
    bupots,
    spts,
    courseResults,
    averageScore,
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

    const handleDeleteScore = () => {
        router.delete(route("teacher.deleteAverageScore", participant.id), {
            onSuccess: () => {
                setDeleteScoreOpen(false);
            },
        });
    };

    return (
        <TeacherLayout>
            <Head title={`Detail Peserta - ${participant.user?.name}`} />

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
                                        course.id
                                    )}
                                >
                                    Detail Kelas
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
                                Kelas: {course.name}
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
                                    Nilai Rata-rata
                                </div>
                                <div className="font-mono text-lg font-bold text-primary">
                                    {averageScore !== null ? (
                                        averageScore
                                    ) : (
                                        <span className="italic text-gray-400">
                                            Belum dinilai
                                        </span>
                                    )}
                                </div>
                                {averageScore !== null && (
                                    <AlertDialog
                                        open={deleteScoreOpen}
                                        onOpenChange={setDeleteScoreOpen}
                                    >
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="text-red-700 bg-red-50 border-red-200 hover:bg-red-100"
                                            >
                                                <Trash2 size={16} />
                                                Hapus Nilai Rata-rata
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Hapus Nilai Rata-rata
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Apakah Anda yakin ingin
                                                    menghapus nilai rata-rata
                                                    untuk{" "}
                                                    <span className="font-semibold">
                                                        {participant.user?.name}
                                                    </span>
                                                    ? Tindakan ini tidak dapat
                                                    dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Batal
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-red-600 hover:bg-red-700"
                                                    onClick={handleDeleteScore}
                                                >
                                                    Hapus Nilai Rata-rata
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
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
                        <Tabs defaultValue="faktur-keluaran">
                            <TabsList>
                                <TabsTrigger value="faktur-keluaran">
                                    Faktur Keluaran (
                                    {
                                        fakturs.filter(
                                            (f: any) => f.type === "keluaran"
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="faktur-masukan">
                                    Faktur Masukan (
                                    {
                                        fakturs.filter(
                                            (f: any) => f.type === "masukan"
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="retur-keluaran">
                                    Retur Pajak Keluaran (
                                    {
                                        returs.filter(
                                            (f: any) => f.type === "keluaran"
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="retur-masukan">
                                    Retur Pajak Masukan (
                                    {
                                        returs.filter(
                                            (f: any) => f.type === "masukan"
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
                </div>
            </div>
        </TeacherLayout>
    );
}
