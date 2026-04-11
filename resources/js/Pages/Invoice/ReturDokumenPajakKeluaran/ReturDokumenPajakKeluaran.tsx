import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
import { columns } from "@/Components/layout/ReturOther/columns";
import { DataTableReturOther } from "@/Components/layout/ReturOther/data-table";
import { Button } from "@/Components/ui/button";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ReturDokumenPajakKeluaran({ returs }: any) {
    const { flash }: any = usePage().props;
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordAction, setPasswordAction] = useState<"submit" | "cancel">(
        "submit"
    );
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedReturs, setSelectedReturs] = useState<any[]>([]);
    const [initialReturs, setInitialReturs] = useState(returs);

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
        const selected = initialReturs.filter((retur: any) =>
            ids.includes(retur.id)
        );
        setSelectedReturs(selected);
    };

    const handleSubmitSelected = (selectedIds: string[], password: string) => {
        router.patch(
            route("retur.updateStatusMultipleOther"),
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
            route("retur.updateStatusMultipleOther"),
            { ids: selectedIds, status: "canceled", password },
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
            handleSubmitSelected(selectedIds, password);
        } else if (passwordAction === "cancel") {
            handleCancelSelected(selectedIds, password);
        }
        setOpenPasswordModal(false);
    };

    const handleRefresh = () => {
        router.get(
            route("retur.export"),
            {},
            {
                onSuccess: (page) => {
                    setInitialReturs(page.props.returs);
                },
            }
        );
    };

    return (
        <Authenticated>
            <Head title="Retur Dokumen Pajak Keluaran" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Retur Dokumen Pajak Keluaran
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("retur.createExport")}>
                                    <Plus />
                                    Tambah Retur Keluaran
                                </Link>
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("submit");
                                    setOpenSubmitModal(true);
                                }}
                                disabled={
                                    selectedReturs.length === 0 ||
                                    selectedReturs.some(
                                        (retur: any) =>
                                            retur.status !== "created"
                                    )
                                }
                            >
                                <Send />
                                Laporkan Retur
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setPasswordAction("cancel");
                                    setOpenCancelModal(true);
                                }}
                                disabled={
                                    selectedReturs.length === 0 ||
                                    selectedReturs.some(
                                        (retur: any) =>
                                            retur.status !== "created" &&
                                            retur.status !== "approved"
                                    )
                                }
                            >
                                <Trash />
                                Batalkan Retur
                            </Button>
                            <Button disabled>
                                <FileUp /> Unggah Retur
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
                        <DataTableReturOther
                            columns={columns}
                            data={initialReturs}
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
                title="Laporkan Retur Dokumen Keluaran"
                description="Apakah Anda yakin ingin membatalkan retur dokumen keluaran yang Anda pilih?"
                open={openSubmitModal}
                onClose={() => setOpenSubmitModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenSubmitModal(false);
                }}
            />
            <ConfirmDialog
                title="Batalkan Retur Dokumen Keluaran"
                description="Apakah Anda yakin ingin membatalkan retur dokumen keluaran yang Anda pilih?"
                open={openCancelModal}
                onClose={() => setOpenCancelModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenCancelModal(false);
                }}
            />
        </Authenticated>
    );
}
