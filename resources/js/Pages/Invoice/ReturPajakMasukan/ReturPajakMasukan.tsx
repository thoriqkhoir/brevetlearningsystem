import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
import { columns } from "@/Components/layout/Retur/columns";
import { DataTableRetur } from "@/Components/layout/Retur/data-table";
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

export default function ReturPajakMasukan({ returs }: any) {
    const { flash }: any = usePage().props;
    const [openApproveModal, setOpenApproveModal] = useState(false);
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

    const handleApproveSelected = (selectedIds: string[], password: string) => {
        router.patch(
            route("retur.updateStatusMultiple"),
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
            route("retur.updateStatusMultiple"),
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
            handleApproveSelected(selectedIds, password);
        } else if (passwordAction === "cancel") {
            handleCancelSelected(selectedIds, password);
        }
        setOpenPasswordModal(false);
    };

    const handleRefresh = () => {
        router.get(
            route("retur.input"),
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
            <Head title="Retur Pajak Masukan" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Retur Pajak Masukan
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("retur.createInput")}>
                                    <Plus />
                                    Tambah Retur Masukan
                                </Link>
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("submit");
                                    setOpenApproveModal(true);
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
                                Laporkan Retur Masukan
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
                                Batalkan Retur Masukan
                            </Button>
                            <Button disabled>
                                <FileUp /> Unggah Retur Masukan
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
                        <DataTableRetur
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
                title="Laporkan Retur Pajak Masukan"
                description="Apakah Anda yakin ingin melaporkan retur pajak masukan yang Anda pilih?"
                open={openApproveModal}
                onClose={() => setOpenApproveModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenApproveModal(false);
                }}
            />
            <ConfirmDialog
                title="Batalkan Retur Pajak Masukan"
                description="Apakah Anda yakin ingin membatalkan retur pajak masukan yang Anda pilih?"
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
