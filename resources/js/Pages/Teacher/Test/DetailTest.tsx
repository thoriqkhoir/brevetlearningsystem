import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    Copy,
    Download,
    Eye,
    FileText,
    FileUp,
    LoaderCircle,
    Pencil,
    Search,
    Trash,
    Upload,
    UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
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

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import {
    participantColumns,
    ParticipantColumns,
} from "@/Components/layout/TestUser/columns";
import { DataTableParticipant } from "@/Components/layout/TestUser/data-table";
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

export default function DetailTest({
    course,
    test = [],
    participants = [],
}: any) {
    //participants = []
    const { flash, errors }: any = usePage().props;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<
        string[]
    >([]);
    const [addParticipantOpen, setAddParticipantOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pdfViewOpen, setPdfViewOpen] = useState(false);
    const [deleteModulOpen, setDeleteModulOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [showScore, setShowScore] = useState(test.show_score ?? true);
    const [copiedCode, setCopiedCode] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    // Simpan status toggle ke localStorage
    useEffect(() => {
        localStorage.setItem(
            `test_${test.id}_show_score`,
            JSON.stringify(showScore),
        );
    }, [showScore, test.id]);

    const handleToggleShowScore = (checked: boolean) => {
        setShowScore(checked);
        router.post(
            route("teacher.updateShowScore", test.id),
            { show_score: checked },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        checked
                            ? "Nilai ditampilkan ke peserta"
                            : "Nilai disembunyikan dari peserta",
                    );
                },
                onError: () => {
                    toast.error("Gagal mengubah status tampilan nilai");
                    setShowScore(!checked); // Kembalikan state jika gagal
                },
            },
        );
    };

    const handleViewModul = () => {
        window.open(route("test.viewModul", test.id), "_blank");
    };

    const handleDeleteModul = async () => {
        try {
            router.delete(route("test.deleteModul", test.id), {
                preserveState: true,
                onSuccess: () => {
                    toast.success("Modul berhasil dihapus");
                    setDeleteModulOpen(false);
                },
                onError: (errors) => {
                    console.error("Delete errors:", errors);
                    toast.error("Gagal menghapus modul");
                },
            });
        } catch (error) {
            toast.error("Terjadi kesalahan saat menghapus modul");
            console.error("Delete modul error:", error);
        }
    };

    const handleRemoveParticipant = (participantId: string) => {
        router.delete(
            route("teacher.removeTestParticipant", [test.id, participantId]),
            {
                preserveScroll: true,
            },
        );
    };

    const handleSearchUsers = (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        fetch(
            `${route("teacher.searchUsers")}?search=${encodeURIComponent(
                query,
            )}&test_id=${test.id}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            },
        )
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data.searchResults || []);
                setIsSearching(false);
            })
            .catch((error) => {
                console.error("Search error:", error);
                setIsSearching(false);
            });
    };

    const handleAddParticipant = (userId: string) => {
        router.post(
            route("teacher.addTestParticipant", test.id),
            { user_id: userId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setAddParticipantOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                },
            },
        );
    };

    const handleCopyCode = async () => {
        if (!test?.code) return;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(test.code);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = test.code;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }

            setCopiedCode(true);
            toast.success(`Kode ujian ${test.code} berhasil disalin`);

            setTimeout(() => {
                setCopiedCode(false);
            }, 1500);
        } catch (error) {
            toast.error("Gagal menyalin kode ujian");
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearchUsers(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const participantsData: ParticipantColumns[] = participants.map(
        (p: any) => ({
            id: p.id,
            user: p.user,
            average_score: p.average_score,
            best_score: p.best_score,
            feedback: p.feedback,
            test_id: test.id,
            show_score: showScore, // Pass status ke columns
        }),
    );

    const totalSoalBank = Number(test.question_count ?? 0);
    const soalDitampilkan = Number(test.questions_to_show ?? totalSoalBank);
    const isCustomSoalDitampilkan =
        test.questions_to_show !== null &&
        typeof test.questions_to_show !== "undefined";
    const tanggalPelaksanaan = test.start_date
        ? `${format(new Date(test.start_date), "d MMMM yyyy", { locale: id })} - ${format(new Date(test.start_date), "HH:mm", { locale: id })}`
        : "-";
    const ujianDitutup = test.end_date
        ? `${format(new Date(test.end_date), "d MMMM yyyy", { locale: id })} - ${format(new Date(test.end_date), "HH:mm", { locale: id })}`
        : "-";

    const columns = participantColumns(handleRemoveParticipant);

    return (
        <TeacherLayout>
            <Head title={`Detail Ujian - ${test.title}`} />
            <div className="teacher-page-shell">
                <div className="teacher-page-stack">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.tests")}>
                                    Daftar Ujian
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detail Ujian</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center justify-between">
                        <h1 className="text-xl sm:teacher-page-title">
                            Detail Ujian - {test.title}
                        </h1>
                        <div className="flex flex-col sm:flex-col md:flex-row items-center gap-2 md:gap-2 ">
                            <Button asChild>
                                <Link href={route("teacher.editTest", test.id)}>
                                    <Pencil size={16} />
                                    Edit Ujian
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-fit text-red-700 bg-red-200 border-red-200 hover:bg-red-300 flex items-center gap-1"
                                onClick={() => {
                                    setOpenDeleteModal(true);
                                }}
                            >
                                <Trash size={16} />
                                Hapus
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white border shadow p-6">
                        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                            <h2 className="text-lg font-bold md:mb-2 text-primary">
                                Informasi Ujian
                            </h2>
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition border-blue-300 bg-blue-50 text-blue-700"
                            >
                                <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                                    Kode
                                </span>
                                <span className="font-mono text-sm font-bold tracking-widest md:text-[15px]">
                                    {test.code}
                                </span>
                                <Copy size={13} className="opacity-75" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="rounded-lg border bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Informasi Dasar
                                </p>
                                <dl className="mt-3 space-y-3 text-sm">
                                    <div>
                                        <dt className="text-slate-500">
                                            Nama Ujian
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {test.title || "-"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">
                                            Deskripsi
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {test.description || "-"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">
                                            Bank Soal
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {test.question_bank?.name || "-"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-lg border bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Jadwal Dan Penilaian
                                </p>
                                <dl className="mt-3 space-y-3 text-sm">
                                    <div>
                                        <dt className="text-slate-500">
                                            Durasi
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {test.duration || "-"} Menit
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">
                                            Passing Grade
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {test.passing_score || "-"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">
                                            Tanggal Pelaksanaan
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {tanggalPelaksanaan}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">
                                            Ujian Ditutup
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {ujianDitutup}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 lg:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                    Pengaturan Soal
                                </p>
                                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                    <div className="rounded-md border border-blue-100 bg-white p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                            Bank Soal
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {test.question_bank?.name || "-"}
                                        </p>
                                    </div>
                                    <div className="rounded-md border border-blue-100 bg-white p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                            Total Soal Bank
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {totalSoalBank}
                                        </p>
                                    </div>
                                    <div className="rounded-md border border-blue-100 bg-white p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                            Soal Ditampilkan
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {soalDitampilkan}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-slate-600">
                                    {isCustomSoalDitampilkan
                                        ? "Mode custom aktif: jumlah soal ditampilkan diatur manual."
                                        : "Mode otomatis: jumlah soal ditampilkan mengikuti total soal bank."}
                                </p>
                            </div>

                            <div className="rounded-lg border bg-white p-4 lg:col-span-2">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Tampilkan Nilai ke Peserta
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {showScore
                                                ? "Peserta dapat melihat nilai ujian mereka"
                                                : 'Peserta hanya melihat "Selamat anda telah mengerjakan ujian"'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={showScore}
                                            onCheckedChange={
                                                handleToggleShowScore
                                            }
                                        />
                                        <span
                                            className={`text-sm ${showScore ? "text-emerald-600 font-medium" : "text-gray-500"}`}
                                        >
                                            {showScore
                                                ? "Nilai ditampilkan"
                                                : "Nilai disembunyikan"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white border shadow p-6">
                        <div className="flex items-center justify-between gap-2 flex-wrap md:flex-nowrap">
                            <h2 className="text-lg font-bold text-primary">
                                Daftar Peserta ({participants.length})
                            </h2>
                            <div className="flex items-center gap-2">
                                <Dialog
                                    open={addParticipantOpen}
                                    onOpenChange={setAddParticipantOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                        >
                                            <UserPlus size={16} />
                                            Tambah Peserta
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Tambah Peserta
                                            </DialogTitle>
                                            <DialogDescription>
                                                Cari dan tambahkan peserta ke
                                                Ujian ini.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="relative">
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    size={16}
                                                />
                                                <Input
                                                    placeholder="Cari nama atau email peserta..."
                                                    className="pl-10"
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* Search Results */}
                                            <div className="max-h-64 overflow-y-auto">
                                                {isSearching && (
                                                    <div className="text-center py-4 text-gray-500">
                                                        Mencari...
                                                    </div>
                                                )}

                                                {!isSearching &&
                                                    searchQuery.length >= 2 &&
                                                    searchResults.length ===
                                                        0 && (
                                                        <div className="text-center py-4 text-gray-500">
                                                            Tidak ada peserta
                                                            ditemukan
                                                        </div>
                                                    )}

                                                {searchResults.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleAddParticipant(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Tambah
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    variant="outline"
                                    className="text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                                    onClick={() =>
                                        window.open(
                                            route(
                                                "teacher.exportTestParticipants",
                                                test.id,
                                            ),
                                            "_blank",
                                        )
                                    }
                                >
                                    <FileUp />
                                    Export Excel
                                </Button>
                            </div>
                        </div>

                        <DataTableParticipant
                            columns={columns}
                            data={participantsData}
                        />
                    </div>
                </div>
                <ConfirmDialog
                    title="Hapus Ujian"
                    description="Apakah Anda yakin ingin menghapus Ujian ini?"
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                    onConfirm={() => {
                        router.delete(route("teacher.destroyTest", test.id), {
                            preserveScroll: true,
                        });
                    }}
                />
            </div>
        </TeacherLayout>
    );
}
