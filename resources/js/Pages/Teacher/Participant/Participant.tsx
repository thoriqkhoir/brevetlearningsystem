import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { createUserColumns } from "@/Components/layout/User/columns";
import { DataTableUser } from "@/Components/layout/User/data-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Modal from "@/Components/ui/modal";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    Download,
    FileDown,
    RefreshCcw,
    Trash,
    Users,
    UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function Participant({ participants, events }: any) {
    const { flash }: any = usePage().props;
    const [initialParticipants, setInitialParticipants] = useState(
        participants.map((participant: any) => ({
            ...participant,
            event_id: String(participant.event_id),
        })),
    );
    const [isImportModalOpen, setImportModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { data, setData, post, errors } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    const eventOptions = events.map((event: any) => ({
        value: String(event.id),
        label: event.name,
    }));

    const columns = useMemo(
        () =>
            createUserColumns({
                actionRoute: "teacher.editParticipant",
                deleteRoute: "teacher.destroyParticipant",
                entityLabel: "Peserta",
                actionMode: "edit",
            }),
        [],
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData("file", e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        post(route("teacher.importParticipants"), {
            onSuccess: () => {
                setIsLoading(false);
                setImportModalOpen(false);
                router.reload();
            },
            onError: (errs) => {
                setIsLoading(false);
                if (errs.file) toast.error(errs.file);
            },
            preserveScroll: true,
            preserveState: false,
        });
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleRefresh = () => {
        router.get(
            route("teacher.participants"),
            {},
            {
                onSuccess: (page) => {
                    setInitialParticipants((page.props as any).participants);
                },
            },
        );
    };

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialParticipants.filter((participant: any) =>
            ids.includes(participant.id),
        );
        setSelectedParticipants(selected);
    };

    const handleDeleteSelected = () => {
        router.delete(route("teacher.deleteMultipleParticipants"), {
            data: { ids: selectedIds },
            onSuccess: () => {
                handleRefresh();
                setSelectedIds([]);
            },
        });
    };

    return (
        <TeacherLayout>
            <Head title="Daftar Peserta" />

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
                                    Daftar Peserta
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Kelola seluruh data peserta — tambah, impor, dan hapus dengan mudah.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Users size={16} className="text-teal-600" />
                                <span className="font-medium text-slate-700">
                                    {initialParticipants.length} peserta terdaftar
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="mb-6 rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-md backdrop-blur-sm md:p-6">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                            Aksi
                        </p>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href={route("teacher.createParticipant")}>
                                    <UserPlus size={16} />
                                    Tambah Peserta
                                </Link>
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => setOpenDeleteModal(true)}
                                disabled={selectedParticipants.length === 0}
                            >
                                <Trash size={16} />
                                Hapus Terpilih
                                {selectedParticipants.length > 0 && (
                                    <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">
                                        {selectedParticipants.length}
                                    </span>
                                )}
                            </Button>

                            <Button
                                variant="accent"
                                onClick={() => setImportModalOpen(true)}
                            >
                                <FileDown size={16} />
                                Import Peserta
                            </Button>

                            <Button
                                variant="outline"
                                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                                onClick={handleRefresh}
                            >
                                <RefreshCcw size={16} />
                                Refresh
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                            >
                                <a href={route("teacher.downloadParticipantTemplate")}>
                                    <Download size={16} />
                                    Download Template
                                </a>
                            </Button>
                        </div>

                        {selectedParticipants.length > 0 && (
                            <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-2 text-sm text-rose-700">
                                <span className="font-semibold">{selectedParticipants.length} peserta</span> dipilih — klik <span className="font-semibold">Hapus Terpilih</span> untuk menghapus.
                            </div>
                        )}
                    </div>

                    {/* Data Table */}
                    <div className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-md backdrop-blur-sm md:p-6">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                            Data Peserta
                        </p>
                        <DataTableUser
                            columns={columns}
                            data={initialParticipants}
                            setSelectedIds={handleSelectIds}
                            eventOptions={eventOptions}
                            searchPlaceholder="Cari Nama Peserta..."
                        />
                    </div>
                </div>
            </div>

            {/* Import Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setImportModalOpen(false)}
                title="Import Peserta"
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                    encType="multipart/form-data"
                >
                    <div className="rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
                            Format File
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                            Kolom opsional: isi <span className="font-mono font-semibold">course_code</span> untuk otomatis memasukkan peserta ke kelas berdasarkan kode kelas.
                        </p>
                    </div>
                    <Input
                        type="file"
                        className="cursor-pointer"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv"
                    />
                    {errors.file && (
                        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                            {errors.file}
                        </p>
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Mengimport..." : "Import Sekarang"}
                    </Button>
                </form>
            </Modal>

            <ConfirmDialog
                title="Hapus Peserta"
                description="Apakah Anda yakin ingin menghapus peserta yang Anda pilih?"
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={() => handleDeleteSelected()}
            />
        </TeacherLayout>
    );
}
