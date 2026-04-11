import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { createUserColumns } from "@/Components/layout/User/columns";
import { DataTableUser } from "@/Components/layout/User/data-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Modal from "@/Components/ui/modal";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Download, FileDown, RefreshCcw, Trash, UserPlus } from "lucide-react";
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
                if (errs.file) {
                    toast.error(errs.file);
                }
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

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Daftar Peserta
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2" />
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("teacher.createParticipant")}>
                                    <UserPlus />
                                    Tambah Peserta
                                </Link>
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setOpenDeleteModal(true);
                                }}
                                disabled={selectedParticipants.length === 0}
                            >
                                <Trash />
                                Hapus Peserta
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-600/90"
                                onClick={() => setImportModalOpen(true)}
                            >
                                <FileDown />
                                Import Peserta
                            </Button>
                            <Modal
                                isOpen={isImportModalOpen}
                                onClose={() => setImportModalOpen(false)}
                                title="Import Peserta"
                            >
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-3"
                                    encType="multipart/form-data"
                                >
                                    <Input
                                        type="file"
                                        className="hover:cursor-pointer"
                                        onChange={handleFileChange}
                                        accept=".xlsx,.xls,.csv"
                                    />
                                    {errors.file && (
                                        <p className="text-red-600">
                                            {errors.file}
                                        </p>
                                    )}
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "Import"}
                                    </Button>
                                </form>
                            </Modal>
                            <Button
                                className="bg-yellow-400 text-primary hover:bg-yellow-400/90 hover:text-primary"
                                onClick={handleRefresh}
                            >
                                <RefreshCcw />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            asChild
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-blue-200"
                        >
                            <a
                                href={route(
                                    "teacher.downloadParticipantTemplate",
                                )}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700"
                            >
                                <Download className="h-4 w-4" />
                                Download Format Import Peserta BLS
                            </a>
                        </Button>
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
