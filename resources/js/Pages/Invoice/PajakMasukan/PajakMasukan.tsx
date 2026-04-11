import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { columns } from "@/Components/layout/Invoice/columns";
import { DataTableInvoice } from "@/Components/layout/Invoice/data-table";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
import { Button } from "@/Components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import {
    File,
    FileDown,
    FileText,
    FileUp,
    FileX,
    Plus,
    RefreshCcw,
    Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PajakMasukan({ invoices }: any) {
    const { flash }: any = usePage().props;
    const [openCreditedModal, setOpenCreditedModal] = useState(false);
    const [openUncreditedModal, setOpenUncreditedModal] = useState(false);
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordAction, setPasswordAction] = useState<
        "submit" | "credit" | "uncredit"
    >("submit");
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

    const handleCreditedSelected = (
        selectedIds: string[],
        password: string
    ) => {
        const creditDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        router.patch(
            route("invoice.updateStatusInputMultiple"),
            {
                ids: selectedIds,
                status: "credit",
                credit_date: creditDate,
                password,
            },
            {
                onSuccess: () => {
                    handleRefresh();
                    setSelectedIds([]);
                },
            }
        );
    };

    const handleUncreditedSelected = (
        selectedIds: string[],
        password: string
    ) => {
        const creditDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        router.patch(
            route("invoice.updateStatusInputMultiple"),
            {
                ids: selectedIds,
                status: "uncredit",
                credit_date: creditDate,
                password,
            },
            {
                onSuccess: () => {
                    handleRefresh();
                    setSelectedIds([]);
                },
            }
        );
    };

    const handleApproveSelected = (selectedIds: string[], password: string) => {
        router.patch(
            route("invoice.updateStatusInputMultiple"),
            { ids: selectedIds, status: "approved", password },
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
        } else if (passwordAction === "credit") {
            handleCreditedSelected(selectedIds, password);
        } else if (passwordAction === "uncredit") {
            handleUncreditedSelected(selectedIds, password);
        }
        setOpenPasswordModal(false);
    };

    const handleRefresh = () => {
        router.get(
            route("invoice.input"),
            {},
            {
                onSuccess: (page) => {
                    setInitialInvoices(page.props.invoices);
                },
            }
        );
    };

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialInvoices.filter((invoice: any) =>
            ids.includes(invoice.id)
        );
        setSelectedInvoices(selected);
    };

    return (
        <Authenticated>
            <Head title="Pajak Masukan" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Pajak Masukan
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("invoice.createInput")}>
                                    <Plus />
                                    Tambah Faktur Pajak Masukan
                                </Link>
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("credit");
                                    setOpenCreditedModal(true);
                                }}
                                disabled={
                                    selectedInvoices.length === 0 ||
                                    selectedInvoices.some(
                                        (invoice: any) =>
                                            invoice.status !== "approved"
                                    )
                                }
                            >
                                <FileUp />
                                Kreditkan Faktur
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("uncredit");
                                    setOpenUncreditedModal(true);
                                }}
                                disabled={
                                    selectedInvoices.length === 0 ||
                                    selectedInvoices.some(
                                        (invoice: any) =>
                                            invoice.status !== "approved"
                                    )
                                }
                            >
                                <FileDown />
                                Tidak Kreditkan Faktur
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
                                            invoice.status === "approved"
                                    )
                                }
                            >
                                <Undo2 />
                                Kembali ke Approved
                            </Button>
                        </div>
                        <div className="flex gap-2">
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
                title="Kreditkan Faktur"
                description="Apakah Anda yakin ingin mengkreditkan Faktur yang Anda pilih?"
                open={openCreditedModal}
                onClose={() => setOpenCreditedModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenCreditedModal(false);
                }}
            />
            <ConfirmDialog
                title="Membatalkan kredit Faktur"
                description="Apakah Anda yakin ingin membatalkan kredit Faktur yang Anda pilih?"
                open={openUncreditedModal}
                onClose={() => setOpenUncreditedModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenUncreditedModal(false);
                }}
            />
            <ConfirmDialog
                title="Kembali ke Approved"
                description="Apakah Anda yakin ingin mengembalikan status Faktur yang Anda pilih ke Approved?"
                open={openApproveModal}
                onClose={() => setOpenApproveModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenApproveModal(false);
                }}
            />
        </Authenticated>
    );
}
