import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    Plus,
    FileText,
    BarChart3,
    Pencil,
    Trash,
    ChevronDown,
    ChevronRight,
    Download,
    FileUp,
    Upload,
    LoaderCircle,
    Search,
    SlidersHorizontal,
} from "lucide-react";
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface QuestionOption {
    id: string;
    option_text: string;
    is_correct: boolean;
    image_url?: string;
}

interface Question {
    id: string;
    question_text: string;
    question_type: "multiple_choice" | "true_false" | "short_answer";
    correct_answer?: string | boolean;
    options?: QuestionOption[];
    image_url?: string;
}

interface Test {
    id: string;
    title: string;
    participants?: any[];
    questions_to_show?: number | null;
    question_bank?: {
        id: string;
        name: string;
    } | null;
}

interface QuestionBank {
    id: string;
    name: string;
    description?: string | null;
}

interface BankUsageTest {
    id: string;
    title: string;
    code?: string;
}

interface Statistics {
    average_score: number;
    difficulty_level: string;
    passed_participants: number;
    total_participants: number;
}

interface Props {
    test: Test;
    questions: Question[];
    statistics: Partial<Statistics>;
    mode?: "test" | "bank";
    questionBank?: QuestionBank | null;
    testsUsingBank?: BankUsageTest[];
    questionDisplaySettings?: {
        current: number;
        custom: number | null;
        max: number;
    };
}

export default function Question({
    test,
    questions = [],
    statistics = {},
    mode = "test",
    questionBank = null,
    testsUsingBank = [],
    questionDisplaySettings,
}: Props) {
    const { flash, errors }: any = usePage().props;
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
        new Set(),
    );
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10); // items per page
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [questionsToShowInput, setQuestionsToShowInput] =
        useState<string>("");
    const [updatingQuestionsToShow, setUpdatingQuestionsToShow] =
        useState(false);

    const maxQuestionsToShow = questionDisplaySettings?.max ?? questions.length;
    const effectiveQuestionsToShow =
        questionDisplaySettings?.current ?? questions.length;
    const customQuestionsToShow =
        questionDisplaySettings?.custom ?? test.questions_to_show ?? null;
    const isBankMode = mode === "bank";
    const bankId = questionBank?.id ?? test.question_bank?.id ?? null;
    const bankName =
        questionBank?.name ?? test.question_bank?.name ?? test.title;
    const canManageQuestions = isBankMode && !!bankId;

    const { data, setData, post, processing, reset } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("file", file);
        }
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!canManageQuestions || !bankId) {
            toast.error(
                "Import soal hanya bisa dilakukan dari halaman Bank Soal.",
            );
            return;
        }

        if (!data.file) {
            toast.error("Silakan pilih file untuk diimport");
            return;
        }

        post(route("teacher.questionBankQuestions.import", bankId), {
            onSuccess: () => {
                // toast.success("Soal berhasil diimport!");
                setImportModalOpen(false);
                reset();
            },
            onError: (errors: any) => {
                if (errors.file) {
                    toast.error(errors.file);
                } else {
                    toast.error("Terjadi kesalahan saat import");
                }
            },
        });
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    // (clamp moved below after filtered totals are known)

    const toggleExpanded = (questionId: string) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
        } else {
            newExpanded.add(questionId);
        }
        setExpandedQuestions(newExpanded);
    };

    const handleDeleteQuestion = (questionId: string) => {
        if (!canManageQuestions) {
            toast.error(
                "Hapus soal hanya bisa dilakukan dari halaman Bank Soal.",
            );
            return;
        }
        setDeleteId(questionId);
        setDeleteDialogOpen(true);
    };

    const performDelete = () => {
        if (!deleteId || !bankId || !canManageQuestions) return;
        setDeleting(true);
        router.delete(
            route("teacher.questionBankQuestions.destroy", [bankId, deleteId]),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleting(false);
                    setDeleteDialogOpen(false);
                    setDeleteId(null);
                    // toast.success("Soal berhasil dihapus");
                },
                onError: () => {
                    setDeleting(false);
                    toast.error("Gagal menghapus soal");
                },
                onFinish: () => {
                    setDeleting(false);
                },
            },
        );
    };

    const openSettingsDialog = () => {
        if (isBankMode) return;
        setQuestionsToShowInput(String(effectiveQuestionsToShow || 0));
        setSettingsDialogOpen(true);
    };

    const submitQuestionsToShow = (e: React.FormEvent) => {
        e.preventDefault();

        if (isBankMode) {
            return;
        }

        if (maxQuestionsToShow <= 0) {
            toast.error("Belum ada soal untuk ditampilkan.");
            return;
        }

        const value = Number(questionsToShowInput);
        if (!Number.isInteger(value) || value < 1) {
            toast.error("Jumlah soal harus berupa angka bulat minimal 1.");
            return;
        }

        if (value > maxQuestionsToShow) {
            toast.error(
                `Jumlah soal tidak boleh melebihi total soal (${maxQuestionsToShow}).`,
            );
            return;
        }

        setUpdatingQuestionsToShow(true);
        router.put(
            route("test.question.updateQuestionsToShow", test.id),
            {
                questions_to_show: value,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSettingsDialogOpen(false);
                },
                onError: (errorBag: any) => {
                    if (errorBag?.questions_to_show) {
                        toast.error(errorBag.questions_to_show);
                    } else {
                        toast.error(
                            "Gagal memperbarui jumlah soal ditampilkan.",
                        );
                    }
                },
                onFinish: () => {
                    setUpdatingQuestionsToShow(false);
                },
            },
        );
    };

    // Filtered + pagination values
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const filteredQuestions = normalizedQuery
        ? questions.filter((q) => {
              const qt = (q.question_text || "").toLowerCase();
              const matchText = qt.includes(normalizedQuery);
              const matchOptions = q.options?.some((o) =>
                  (o.option_text || "").toLowerCase().includes(normalizedQuery),
              );
              return matchText || !!matchOptions;
          })
        : questions;

    const totalItems = filteredQuestions.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    // Clamp current page when totals change (e.g., after import/delete or search/pageSize change)
    useEffect(() => {
        const newTotalPages = Math.max(
            1,
            Math.ceil((totalItems || 0) / pageSize),
        );
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
        if (currentPage < 1 && newTotalPages >= 1) setCurrentPage(1);
    }, [totalItems, pageSize]);

    // (debug removed)

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        // Optionally collapse expanded items when page changes
        // setExpandedQuestions(new Set());
    };

    const getPageItems = (): (number | "ellipsis")[] => {
        const items: (number | "ellipsis")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) items.push(i);
            return items;
        }

        if (currentPage <= 4) {
            items.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
            return items;
        }

        if (currentPage >= totalPages - 3) {
            items.push(
                1,
                "ellipsis",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            );
            return items;
        }

        items.push(
            1,
            "ellipsis",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "ellipsis",
            totalPages,
        );
        return items;
    };

    return (
        <TeacherLayout>
            <Head title={`Soal Bank - ${bankName}`} />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {isBankMode ? (
                                <>
                                    <BreadcrumbItem>
                                        <Link
                                            href={route(
                                                "teacher.questionBanks",
                                            )}
                                        >
                                            Bank Soal
                                        </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {bankName}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            ) : (
                                <>
                                    <BreadcrumbItem>
                                        <Link href={route("teacher.tests")}>
                                            Daftar Ujian
                                        </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <Link
                                            href={route(
                                                "teacher.showTest",
                                                test.id,
                                            )}
                                        >
                                            Detail Ujian
                                        </Link>
                                    </BreadcrumbItem>
                                </>
                            )}
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Soal Bank</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl sm:text-2xl font-semibold text-primary">
                                Soal Bank - {bankName}
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
                            {!isBankMode && (
                                <Button
                                    variant="outline"
                                    className="border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
                                    onClick={openSettingsDialog}
                                    disabled={maxQuestionsToShow <= 0}
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Atur Soal Ditampilkan
                                </Button>
                            )}

                            {!isBankMode && bankId && (
                                <Button
                                    variant="outline"
                                    asChild
                                    className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                    <Link
                                        href={route(
                                            "teacher.questionBankQuestions.index",
                                            bankId,
                                        )}
                                    >
                                        Kelola Soal di Bank
                                    </Link>
                                </Button>
                            )}

                            {isBankMode && (
                                <>
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                    >
                                        {/* Link langsung ke file publik tanpa lewat controller */}
                                        <a
                                            href="/templates/template_import_soal.xlsx"
                                            className="inline-flex items-center gap-2"
                                            download
                                        >
                                            <Download className="h-4 w-4" />
                                            Template
                                        </a>
                                    </Button>

                                    <Dialog
                                        open={importModalOpen}
                                        onOpenChange={setImportModalOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                            >
                                                <FileUp className="mr-2 h-4 w-4" />
                                                Import
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <form onSubmit={handleImportSubmit}>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Import Soal dari Excel
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Upload file Excel
                                                        (.xlsx, .xls, .csv) yang
                                                        berisi data soal untuk
                                                        diimport ke dalam bank
                                                        soal "{bankName}
                                                        ".
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="file">
                                                            File Excel
                                                        </Label>
                                                        <Input
                                                            id="file"
                                                            type="file"
                                                            accept=".xlsx,.xls,.csv"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                            className="file:rounded file:border-0 file:bg-blue-50 file:px-2 hover:cursor-pointer hover:file:bg-blue-100"
                                                        />
                                                        {errors?.file && (
                                                            <p className="text-sm text-red-500">
                                                                {errors.file}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {data.file && (
                                                        <div className="rounded-md bg-green-50 p-3">
                                                            <div className="flex items-center">
                                                                <Upload className="mr-2 h-4 w-4 text-green-600" />
                                                                <span className="text-sm font-medium text-green-700">
                                                                    {
                                                                        data
                                                                            .file
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-xs text-green-600">
                                                                File siap untuk
                                                                diimport
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="rounded-md bg-blue-50 p-3">
                                                        <div className="flex items-start">
                                                            <div className="mr-2">
                                                                <svg
                                                                    className="mt-0.5 h-4 w-4 text-blue-600"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-blue-800">
                                                                    Format File:
                                                                </p>
                                                                <ul className="mt-1 list-inside list-disc text-xs text-blue-700">
                                                                    <li>
                                                                        Kolom:
                                                                        question,
                                                                        option_a,
                                                                        option_b,
                                                                        option_c,
                                                                        option_d,
                                                                        correct_option
                                                                    </li>
                                                                    <li>
                                                                        Correct_option:
                                                                        A, B, C,
                                                                        atau D
                                                                    </li>
                                                                    <li>
                                                                        Option_c
                                                                        dan
                                                                        option_d
                                                                        boleh
                                                                        kosong
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <DialogFooter>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setImportModalOpen(
                                                                false,
                                                            )
                                                        }
                                                        disabled={processing}
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            processing ||
                                                            !data.file
                                                        }
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                                Mengimport...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="mr-2 h-4 w-4" />
                                                                Import Soal
                                                            </>
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {bankId && (
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "teacher.questionBankQuestions.create",
                                                    bankId,
                                                )}
                                            >
                                                <Plus size={16} />
                                                Tambah Soal
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                        Bank soal aktif:{" "}
                        <span className="font-semibold">
                            {bankName || "Belum dipilih"}
                        </span>
                        .
                        {isBankMode
                            ? ` Bank ini dipakai oleh ${testsUsingBank.length} ujian.`
                            : " Halaman ujian hanya membaca soal dari bank. Tambah/edit/hapus/import soal dilakukan di modul Bank Soal."}
                    </div>

                    {/* Statistik Kelas */}
                    {!isBankMode && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Soal
                                    </CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {questions.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        soal tersedia
                                    </p>
                                    <p className="mt-1 text-xs text-green-600">
                                        Ditampilkan: {effectiveQuestionsToShow}{" "}
                                        soal
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Rata-rata Nilai
                                    </CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {statistics.average_score || "0"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        dari semua peserta
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Tingkat Kesulitan
                                    </CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {statistics.difficulty_level ||
                                            "Sedang"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        berdasarkan analisis
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Peserta Lulus
                                    </CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {statistics.passed_participants || "0"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        dari{" "}
                                        {statistics.total_participants || "0"}{" "}
                                        peserta
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Daftar Soal */}
                    <div className="rounded-xl bg-white border shadow p-6">
                        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-primary">
                                    Daftar Soal ({totalItems})
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {isBankMode
                                        ? `Dipakai oleh ${testsUsingBank.length} ujian`
                                        : `Soal ditampilkan ke peserta: ${effectiveQuestionsToShow} dari ${maxQuestionsToShow}${customQuestionsToShow === null ? " (otomatis mengikuti total soal)" : " (custom)"}`}
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                                <div className="w-full sm:w-64 relative">
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Cari soal..."
                                        className="pl-9 h-9"
                                    />
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        {questions.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum ada soal
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {isBankMode
                                        ? "Mulai dengan menambahkan soal pertama untuk bank ini."
                                        : "Belum ada soal di bank ini. Kelola dari menu Bank Soal."}
                                </p>
                                {isBankMode && bankId ? (
                                    <Button
                                        asChild
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Link
                                            href={route(
                                                "teacher.questionBankQuestions.create",
                                                bankId,
                                            )}
                                        >
                                            <Plus size={16} />
                                            Tambah Soal Pertama
                                        </Link>
                                    </Button>
                                ) : (
                                    bankId && (
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={route(
                                                    "teacher.questionBankQuestions.index",
                                                    bankId,
                                                )}
                                            >
                                                Buka Bank Soal
                                            </Link>
                                        </Button>
                                    )
                                )}
                            </div>
                        ) : filteredQuestions.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Tidak ada hasil
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Tidak ada soal yang cocok dengan kata kunci
                                    pencarian.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm("")}
                                >
                                    Hapus Pencarian
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {paginatedQuestions.map(
                                        (question: any, index: number) => (
                                            <div
                                                key={question.id}
                                                className="border rounded-lg overflow-hidden"
                                            >
                                                <div className="p-4 hover:bg-gray-50">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                    Soal{" "}
                                                                    {startIndex +
                                                                        index +
                                                                        1}
                                                                </span>
                                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                    {question.question_type ===
                                                                    "multiple_choice"
                                                                        ? "Pilihan Ganda"
                                                                        : question.question_type ===
                                                                            "true_false"
                                                                          ? "Benar/Salah"
                                                                          : question.question_type ===
                                                                              "short_answer"
                                                                            ? "Jawaban Singkat"
                                                                            : "Multiple Choice"}
                                                                </span>
                                                            </div>
                                                            <h3 className="font-medium text-gray-900 mb-2">
                                                                {question.question_text ||
                                                                    "Pertanyaan tidak tersedia"}
                                                            </h3>
                                                            {question.image_url && (
                                                                <div className="my-2">
                                                                    <img
                                                                        src={`/storage/${question.image_url}`}
                                                                        alt="Gambar soal"
                                                                        className="max-h-64 rounded-lg border"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-4">
                                                                <p className="text-sm text-gray-600">
                                                                    {question.question_type ===
                                                                    "multiple_choice"
                                                                        ? `${
                                                                              question
                                                                                  .options
                                                                                  ?.length ||
                                                                              0
                                                                          } pilihan jawaban`
                                                                        : question.question_type ===
                                                                            "true_false"
                                                                          ? "Soal Benar/Salah"
                                                                          : "Jawaban Singkat"}
                                                                </p>
                                                                {(question.question_type ===
                                                                    "multiple_choice" ||
                                                                    question.question_type ===
                                                                        "true_false") && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() =>
                                                                            toggleExpanded(
                                                                                question.id,
                                                                            )
                                                                        }
                                                                        className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                                                                    >
                                                                        {expandedQuestions.has(
                                                                            question.id,
                                                                        ) ? (
                                                                            <>
                                                                                <ChevronDown
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                <span className="ml-1 text-xs">
                                                                                    Sembunyikan
                                                                                    Jawaban
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <ChevronRight
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                <span className="ml-1 text-xs">
                                                                                    Lihat
                                                                                    Jawaban
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {canManageQuestions && (
                                                            <div className="flex items-center gap-2 ml-4">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                    onClick={() => {
                                                                        if (
                                                                            !bankId
                                                                        )
                                                                            return;
                                                                        router.get(
                                                                            route(
                                                                                "teacher.questionBankQuestions.edit",
                                                                                [
                                                                                    bankId,
                                                                                    question.id,
                                                                                ],
                                                                            ),
                                                                        );
                                                                    }}
                                                                >
                                                                    <Pencil
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    onClick={() =>
                                                                        handleDeleteQuestion(
                                                                            question.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Hapus
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Accordion Content - Options/Answers */}
                                                {expandedQuestions.has(
                                                    question.id,
                                                ) && (
                                                    <div className="border-t bg-gray-50 p-4">
                                                        {question.question_type ===
                                                            "multiple_choice" &&
                                                            question.options && (
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                                                        Pilihan
                                                                        Jawaban:
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        {question.options.map(
                                                                            (
                                                                                option: QuestionOption,
                                                                                optionIndex: number,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        optionIndex
                                                                                    }
                                                                                    className={`flex flex-col gap-2 p-2 rounded ${
                                                                                        option.is_correct
                                                                                            ? "bg-green-100 border border-green-200"
                                                                                            : "bg-white border border-gray-200"
                                                                                    }`}
                                                                                >
                                                                                    <div className="flex items-start gap-2">
                                                                                        <span className="text-sm font-medium text-gray-600 mt-0.5">
                                                                                            {String.fromCharCode(
                                                                                                65 +
                                                                                                    optionIndex,
                                                                                            )}

                                                                                            .
                                                                                        </span>
                                                                                        <span
                                                                                            className={`text-sm flex-1 ${
                                                                                                option.is_correct
                                                                                                    ? "font-bold text-green-800"
                                                                                                    : "text-gray-700"
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                option.option_text
                                                                                            }
                                                                                        </span>
                                                                                        {option.is_correct && (
                                                                                            <span className="ml-auto text-xs bg-green-600 text-white px-2 py-1 rounded">
                                                                                                Jawaban
                                                                                                Benar
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    {option.image_url && (
                                                                                        <div className="ml-5 mt-1">
                                                                                            <img
                                                                                                src={`/storage/${option.image_url}`}
                                                                                                alt={`Gambar opsi ${String.fromCharCode(65 + optionIndex)}`}
                                                                                                className="max-h-48 rounded border"
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {question.question_type ===
                                                            "true_false" && (
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700 mb-3">
                                                                    Jawaban:
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {question.options?.map(
                                                                        (
                                                                            option: QuestionOption,
                                                                            optionIndex: number,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    optionIndex
                                                                                }
                                                                                className={`flex items-center gap-2 p-2 rounded ${
                                                                                    option.is_correct
                                                                                        ? "bg-green-100 border border-green-200"
                                                                                        : "bg-white border border-gray-200"
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`text-sm ${
                                                                                        option.is_correct
                                                                                            ? "font-bold text-green-800"
                                                                                            : "text-gray-700"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        option.option_text
                                                                                    }
                                                                                </span>
                                                                                {option.is_correct && (
                                                                                    <span className="ml-auto text-xs bg-green-600 text-white px-2 py-1 rounded">
                                                                                        Jawaban
                                                                                        Benar
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>

                                {/* Pagination footer - always show when there are items */}
                                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    {/* Left: range text */}
                                    <p className="text-sm text-muted-foreground">
                                        Menampilkan{" "}
                                        <span className="font-medium text-foreground">
                                            {totalItems === 0
                                                ? 0
                                                : startIndex + 1}
                                        </span>
                                        –
                                        <span className="font-medium text-foreground">
                                            {endIndex}
                                        </span>{" "}
                                        dari{" "}
                                        <span className="font-medium text-foreground">
                                            {totalItems}
                                        </span>{" "}
                                        soal
                                    </p>

                                    {/* Right: page size selector + navigation */}
                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                Per halaman:
                                            </span>
                                            <Select
                                                value={String(pageSize)}
                                                onValueChange={(v) => {
                                                    const n = parseInt(v, 10);
                                                    if (!isNaN(n)) {
                                                        setPageSize(n);
                                                        setCurrentPage(1);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-8 w-[90px]">
                                                    <SelectValue placeholder="10" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">
                                                        10
                                                    </SelectItem>
                                                    <SelectItem value="20">
                                                        20
                                                    </SelectItem>
                                                    <SelectItem value="30">
                                                        30
                                                    </SelectItem>
                                                    <SelectItem value="40">
                                                        40
                                                    </SelectItem>
                                                    <SelectItem value="50">
                                                        50
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            goToPage(
                                                                currentPage - 1,
                                                            );
                                                        }}
                                                        className={
                                                            currentPage === 1
                                                                ? "pointer-events-none opacity-50"
                                                                : ""
                                                        }
                                                    />
                                                </PaginationItem>

                                                {getPageItems().map(
                                                    (item, idx) => (
                                                        <PaginationItem
                                                            key={`${item}-${idx}`}
                                                        >
                                                            {item ===
                                                            "ellipsis" ? (
                                                                <PaginationEllipsis />
                                                            ) : (
                                                                <PaginationLink
                                                                    href="#"
                                                                    isActive={
                                                                        item ===
                                                                        currentPage
                                                                    }
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        goToPage(
                                                                            item as number,
                                                                        );
                                                                    }}
                                                                >
                                                                    {item}
                                                                </PaginationLink>
                                                            )}
                                                        </PaginationItem>
                                                    ),
                                                )}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            goToPage(
                                                                currentPage + 1,
                                                            );
                                                        }}
                                                        className={
                                                            currentPage ===
                                                            totalPages
                                                                ? "pointer-events-none opacity-50"
                                                                : ""
                                                        }
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Soal?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Soal yang
                            dihapus tidak dapat dipulihkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!deleting) setDeleteDialogOpen(false);
                            }}
                            disabled={deleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={performDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Ya, Hapus
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {!isBankMode && (
                <Dialog
                    open={settingsDialogOpen}
                    onOpenChange={(open) => {
                        if (!updatingQuestionsToShow) {
                            setSettingsDialogOpen(open);
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-[460px]">
                        <form onSubmit={submitQuestionsToShow}>
                            <DialogHeader>
                                <DialogTitle>Atur Soal Ditampilkan</DialogTitle>
                                <DialogDescription>
                                    Tentukan berapa jumlah soal yang akan
                                    ditampilkan ke peserta saat mengerjakan
                                    ujian.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-3 py-4">
                                <Label htmlFor="questions_to_show">
                                    Jumlah soal ditampilkan
                                </Label>
                                <Input
                                    id="questions_to_show"
                                    type="number"
                                    min={1}
                                    max={maxQuestionsToShow}
                                    value={questionsToShowInput}
                                    onChange={(e) =>
                                        setQuestionsToShowInput(e.target.value)
                                    }
                                    disabled={
                                        updatingQuestionsToShow ||
                                        maxQuestionsToShow <= 0
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimal 1, maksimal {maxQuestionsToShow}{" "}
                                    (total soal tersedia saat ini).
                                </p>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={updatingQuestionsToShow}
                                    onClick={() => setSettingsDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        updatingQuestionsToShow ||
                                        maxQuestionsToShow <= 0
                                    }
                                >
                                    {updatingQuestionsToShow ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </TeacherLayout>
    );
}

// Confirm Delete Dialog
// Placed near root return to be always mounted
