import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { columns } from "@/Components/layout/Other/columns";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    File,
    FileText,
    FileUp,
    FileX,
    Plus,
    RefreshCcw,
    Send,
    Trash,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DataTableOther } from "@/Components/layout/Other/data-table";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";

export default function DokumenPajakKeluaran({ others }: any) {
    const { flash }: any = usePage().props;
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordAction, setPasswordAction] = useState<
        "submit" | "cancel" | "delete"
    >("submit");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
    const [initialInvoices, setInitialInvoices] = useState(others);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialInvoices.filter((invoice: any) =>
            ids.includes(invoice.id)
        );
        setSelectedInvoices(selected);
    };

    const handleApproveSelected = (selectedIds: string[], password: string) => {
        router.patch(
            route("other.updateStatusMultiple"),
            { ids: selectedIds, status: "approved", password },
            {
                onSuccess: () => {
                    handleRefresh();
                    setSelectedIds([]);
                },
            }
        );
    };

    const handleCancelSelected = (selectedIds: string[], password: string) => {
        router.patch(
            route("other.updateStatusMultiple"),
            { ids: selectedIds, status: "canceled", password },
            {
                onSuccess: () => {
                    handleRefresh();
                    setSelectedIds([]);
                },
            }
        );
    };

    const handleDeleteSelected = (selectedIds: string[], password: string) => {
        router.patch(
            route("other.updateStatusMultiple"),
            { ids: selectedIds, status: "deleted", password },
            {
                onSuccess: () => {
                    handleRefresh();
                    setSelectedIds([]);
                },
            }
        );
    };

    const handlePasswordConfirm = async (password: string) => {
        if (passwordAction === "submit") {
            handleApproveSelected(selectedIds, password);
        } else if (passwordAction === "cancel") {
            handleCancelSelected(selectedIds, password);
        } else if (passwordAction === "delete") {
            handleDeleteSelected(selectedIds, password);
        }
        setOpenPasswordModal(false);
    };

    const handleRefresh = () => {
        router.get(
            route("other.export"),
            {},
            {
                onSuccess: (page) => {
                    setInitialInvoices(page.props.others);
                },
            }
        );
    };

    return (
        <Authenticated>
            <Head title="Dokumen Lain Keluaran" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Dokumen Lain Keluaran
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("other.create")}>
                                    <Plus />
                                    Buat Dokumen Keluaran
                                </Link>
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("submit");
                                    setOpenApproveModal(true);
                                }}
                                disabled={
                                    selectedInvoices.length === 0 ||
                                    selectedInvoices.some(
                                        (invoice: any) =>
                                            invoice.status !== "created"
                                    )
                                }
                            >
                                <Send />
                                Laporkan Dokumen
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("cancel");
                                    setOpenCancelModal(true);
                                }}
                                disabled={
                                    selectedInvoices.length === 0 ||
                                    selectedInvoices.some(
                                        (invoice: any) =>
                                            invoice.status !== "approved"
                                    )
                                }
                            >
                                <X />
                                Batalkan Dokumen
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={() => {
                                    setPasswordAction("delete");
                                    setOpenDeleteModal(true);
                                }}
                                disabled={
                                    selectedInvoices.length === 0 ||
                                    selectedInvoices.some(
                                        (invoice: any) =>
                                            invoice.status !== "created"
                                    )
                                }
                            >
                                <Trash />
                                Hapus Dokumen
                            </Button>
                            <Button disabled>
                                <FileUp />
                                Unggah Dokumen
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                className="bg-yellow-400 text-primary hover:bg-yellow-400/90 hover:text-primary"
                                onClick={handleRefresh}
                            >
                                <RefreshCcw />
                            </Button>
                            <Button
                                className="bg-zinc-400 hover:bg-zinc-400/90"
                                disabled
                            >
                                <File />
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-600/90"
                                disabled
                            >
                                <FileX />
                            </Button>
                            <Button
                                className="bg-destructive hover:bg-destructive/90"
                                disabled
                            >
                                <FileText />
                            </Button>
                        </div>
                        <DataTableOther
                            columns={columns}
                            data={initialInvoices}
                            setSelectedIds={handleSelectIds}
                        />
                    </div>
                </div>
            </div>
            <PasswordVerificationDialog
                open={openPasswordModal}
                onClose={() => setOpenPasswordModal(false)}
                onConfirm={handlePasswordConfirm}
            />
            <ConfirmDialog
                title="Laporkan Dokumen"
                description="Apakah Anda yakin ingin melaporkan Dokumen yang Anda pilih?"
                open={openApproveModal}
                onClose={() => setOpenApproveModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenApproveModal(false);
                }}
            />
            <ConfirmDialog
                title="Hapus Dokumen"
                description="Apakah Anda yakin ingin membatalkan Dokumen yang Anda pilih?"
                open={openCancelModal}
                onClose={() => setOpenCancelModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenCancelModal(false);
                }}
            />
            <ConfirmDialog
                title="Hapus Dokumen"
                description="Apakah Anda yakin ingin menghapus Dokumen yang Anda pilih?"
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenDeleteModal(false);
                }}
            />
        </Authenticated>
    );
}
