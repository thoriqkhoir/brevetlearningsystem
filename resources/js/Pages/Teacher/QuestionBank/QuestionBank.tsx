import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    BookOpen,
    CheckCircle2,
    CircleOff,
    Database,
    Layers,
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
    const banksInUse = questionBanks.filter((bank) => bank.tests_count > 0).length;
    const totalTestsUsingBanks = questionBanks.reduce(
        (acc, bank) => acc + (bank.tests_count || 0),
        0,
    );

    const statCards = [
        {
            label: "Total Bank Soal",
            value: totalBanks,
            color: "text-teal-700",
            bg: "bg-teal-50/80 border-teal-100",
        },
        {
            label: "Aktif",
            value: activeBanks,
            color: "text-emerald-700",
            bg: "bg-emerald-50/80 border-emerald-100",
        },
        {
            label: "Nonaktif",
            value: nonActiveBanks,
            color: "text-slate-600",
            bg: "bg-slate-50/80 border-slate-200",
        },
        {
            label: "Dipakai Ujian",
            value: banksInUse,
            color: "text-cyan-700",
            bg: "bg-cyan-50/80 border-cyan-100",
        },
        {
            label: "Total Pemakaian",
            value: totalTestsUsingBanks,
            color: "text-amber-700",
            bg: "bg-amber-50/80 border-amber-100",
        },
    ];

    return (
        <TeacherLayout>
            <Head title="Bank Soal" />

            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_40%)]" />

                <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">

                    {/* Page Header */}
                    <div className="mb-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                    Teacher Portal
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold text-slate-800 md:text-3xl">
                                    Bank Soal
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Kelola bank soal untuk digunakan kembali di banyak ujian secara efisien.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href={route("teacher.createQuestionBank")}>
                                    <Plus size={16} />
                                    Tambah Bank Soal
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stat Bar */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {statCards.map((s) => (
                            <div
                                key={s.label}
                                className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md ${s.bg}`}
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    {s.label}
                                </p>
                                <p className={`mt-1 text-xl font-bold ${s.color}`}>
                                    {s.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Question Bank List */}
                    <div className="space-y-4">
                        {questionBanks.length === 0 && (
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 py-16 text-center shadow-sm">
                                <Layers
                                    size={48}
                                    className="mx-auto mb-4 text-amber-300"
                                />
                                <p className="text-base font-semibold text-amber-900">
                                    Belum ada bank soal.
                                </p>
                                <p className="mt-1 text-sm text-amber-800/70">
                                    Tambahkan bank soal pertama Anda untuk mulai mengelola ujian.
                                </p>
                            </div>
                        )}

                        {questionBanks.map((bank) => (
                            <div
                                key={bank.id}
                                className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-6"
                            >
                                {/* Card Header */}
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-slate-800 md:text-xl">
                                            {bank.name}
                                        </h2>
                                        {bank.description && bank.description !== "-" && (
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                                {bank.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                bank.is_active
                                                    ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                                                    : "border border-slate-200 bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {bank.is_active ? (
                                                <CheckCircle2 size={13} />
                                            ) : (
                                                <CircleOff size={13} />
                                            )}
                                            {bank.is_active ? "Aktif" : "Nonaktif"}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                                            <BookOpen size={13} />
                                            Dipakai {bank.tests_count} ujian
                                        </span>
                                    </div>
                                </div>

                                {/* Summary Info */}
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                                            Status
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-800">
                                            {bank.is_active ? "Aktif" : "Nonaktif"}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                                            Dipakai Ujian
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-800">
                                            {bank.tests_count} ujian
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                                    <Button asChild>
                                        <Link
                                            href={route(
                                                "teacher.questionBankQuestions.index",
                                                bank.id,
                                            )}
                                        >
                                            <Database size={15} />
                                            Kelola Soal
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-amber-200 text-amber-700 hover:bg-amber-50"
                                        asChild
                                    >
                                        <Link href={route("teacher.editQuestionBank", bank.id)}>
                                            <Pencil size={15} />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto border-rose-200 text-rose-700 hover:bg-rose-50"
                                        onClick={() => {
                                            setSelectedBankId(bank.id);
                                            setOpenDeleteModal(true);
                                        }}
                                    >
                                        <Trash size={15} />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        ))}
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
