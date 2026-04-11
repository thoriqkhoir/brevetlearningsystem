import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    BookOpen,
    CheckCircle2,
    CircleOff,
    Database,
    Pencil,
    Plus,
    Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type QuestionBank = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    tests_count: number;
};

export default function QuestionBank({
    questionBanks = [],
}: {
    questionBanks: QuestionBank[];
}) {
    const { flash }: any = usePage().props;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleDelete = () => {
        if (!selectedBankId) return;

        router.delete(route("teacher.destroyQuestionBank", selectedBankId), {
            preserveScroll: true,
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedBankId(null);
            },
        });
    };

    const totalBanks = questionBanks.length;
    const activeBanks = questionBanks.filter((bank) => bank.is_active).length;
    const nonActiveBanks = totalBanks - activeBanks;
    const banksInUse = questionBanks.filter(
        (bank) => bank.tests_count > 0,
    ).length;
    const totalTestsUsingBanks = questionBanks.reduce(
        (acc, bank) => acc + (bank.tests_count || 0),
        0,
    );

    return (
        <TeacherLayout>
            <Head title="Bank Soal" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Bank Soal
                    </h1>

                    <div className="rounded-2xl border bg-sidebar p-5 md:p-8">
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Kelola bank soal untuk digunakan kembali di
                                banyak ujian.
                            </p>

                            <Button asChild>
                                <Link
                                    href={route("teacher.createQuestionBank")}
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Bank Soal
                                </Link>
                            </Button>
                        </div>

                        <div className="mb-5 grid grid-cols-2 gap-2.5 lg:grid-cols-5">
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Total Bank Soal
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-primary">
                                    {totalBanks}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Aktif
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-emerald-700">
                                    {activeBanks}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Nonaktif
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-slate-700">
                                    {nonActiveBanks}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Bank Dipakai Ujian
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-blue-700">
                                    {banksInUse}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-2.5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                    Total Pemakaian Ujian
                                </p>
                                <p className="mt-0.5 text-lg font-semibold text-indigo-700">
                                    {totalTestsUsingBanks}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {questionBanks.length === 0 && (
                                <div className="text-center text-gray-500 py-10">
                                    Belum ada bank soal. Tambahkan bank soal
                                    pertama Anda.
                                </div>
                            )}

                            {questionBanks.map((bank) => (
                                <div
                                    key={bank.id}
                                    className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h2 className="text-base font-bold text-primary md:text-lg">
                                                {bank.name}
                                            </h2>

                                            {bank.description &&
                                                bank.description !== "-" && (
                                                    <p className="mt-0.5 line-clamp-1 text-sm text-gray-600">
                                                        {bank.description}
                                                    </p>
                                                )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    bank.is_active
                                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                                }`}
                                            >
                                                {bank.is_active ? (
                                                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                                ) : (
                                                    <CircleOff className="mr-1 h-3.5 w-3.5" />
                                                )}
                                                {bank.is_active
                                                    ? "Aktif"
                                                    : "Nonaktif"}
                                            </span>

                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                <BookOpen className="mr-1 h-3.5 w-3.5" />
                                                Dipakai {bank.tests_count} ujian
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-2 rounded-lg border bg-slate-50 p-2.5">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                            Ringkasan
                                        </p>
                                        <div className="mt-1.5 grid grid-cols-2 gap-2 text-sm">
                                            <div className="rounded-md border bg-white p-2">
                                                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                                    Status
                                                </p>
                                                <p className="font-semibold text-slate-900">
                                                    {bank.is_active
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </p>
                                            </div>
                                            <div className="rounded-md border bg-white p-2">
                                                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                                    Dipakai Ujian
                                                </p>
                                                <p className="font-semibold text-slate-900">
                                                    {bank.tests_count}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 md:flex">
                                        <Button asChild>
                                            <Link
                                                href={route(
                                                    "teacher.questionBankQuestions.index",
                                                    bank.id,
                                                )}
                                            >
                                                <Database className="h-4 w-4" />
                                                Kelola Soal
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full md:w-fit"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "teacher.editQuestionBank",
                                                    bank.id,
                                                )}
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full md:w-fit text-red-700 border-red-200 hover:bg-red-50"
                                            onClick={() => {
                                                setSelectedBankId(bank.id);
                                                setOpenDeleteModal(true);
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                title="Hapus Bank Soal"
                description="Apakah Anda yakin ingin menghapus bank soal ini?"
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDelete}
            />
        </TeacherLayout>
    );
}
