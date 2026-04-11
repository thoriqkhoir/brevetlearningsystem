import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { columns } from "@/Components/layout/Invoice/columns";
import { DataTableInvoice } from "@/Components/layout/Invoice/data-table";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    File,
    FileText,
    FileUp,
    FileX,
    Info,
    Plus,
    RefreshCcw,
    Send,
    Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

export default function PajakKeluaran({ invoices }: any) {
    const { flash }: any = usePage().props;
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordAction, setPasswordAction] = useState<"submit" | "delete">(
        "submit"
    );
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
    const [initialInvoices, setInitialInvoices] = useState(invoices);

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
            route("invoice.updateStatusMultiple"),
            { ids: selectedIds, status: "approved", password },
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
            route("invoice.updateStatusMultiple"),
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
        } else if (passwordAction === "delete") {
            handleDeleteSelected(selectedIds, password);
        }
        setOpenPasswordModal(false);
    };

    const handleRefresh = () => {
        router.get(
            route("invoice.output"),
            {},
            {
                onSuccess: (page) => {
                    setInitialInvoices(page.props.invoices);
                },
            }
        );
    };

    return (
        <Authenticated>
            <Head title="Pajak Keluaran" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl font-semibold text-primary">
                            Pajak Keluaran
                        </h1>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm bg-gray-100 text-gray-800 border border-gray-300">
                                <p>
                                    Pajak Keluaran adalah Pajak Pertambahan
                                    Nilai terutang yang wajib dipungut oleh
                                    Pengusaha Kena Pajak (PKP) yang melakukan
                                    penyerahan Barang Kena Pajak (BKP),
                                    penyerahan Jasa Kena Pajak (JKP), ekspor BKP
                                    Berwujud, ekspor BKP Tidak Berwujud dan/atau
                                    ekspor JKP.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("invoice.create")}>
                                    <Plus />
                                    Buat Faktur Pajak Keluaran
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
                                Laporkan Faktur
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
                                Hapus Faktur
                            </Button>
                            <Button disabled>
                                <FileUp /> Unggah Faktur
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
                        <DataTableInvoice
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
                title="Laporkan Invoice Faktur"
                description="Apakah Anda yakin ingin melaporkan Faktur yang Anda pilih?"
                open={openApproveModal}
                onClose={() => setOpenApproveModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenApproveModal(false);
                }}
            />
            <ConfirmDialog
                title="Hapus Invoice Faktur"
                description="Apakah Anda yakin ingin menghapus Faktur yang Anda pilih?"
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
