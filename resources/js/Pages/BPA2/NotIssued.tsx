import { columns } from "@/Components/layout/BupotA2/columns";
import { DataTableBupotA2 } from "@/Components/layout/BupotA2/data-table";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
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

export default function NotIssued({ bupots }: any) {
    const { flash }: any = usePage().props;
    const [selectedBpa2, setSelectedBpa2] = useState<any[]>([]);
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordAction, setPasswordAction] = useState<"submit" | "delete">(
        "submit"
    );
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [initialBpa2, setInitialBpa2] = useState(bupots);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const handleRefresh = () => {
        router.get(
            route("bpa2.notIssued"),
            {},
            {
                onSuccess: (page) => {
                    setInitialBpa2(page.props.bupots);
                },
            }
        );
    };

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialBpa2.filter((bupots: any) =>
            ids.includes(bupots.id)
        );
        setSelectedBpa2(selected);
    };

    const handleApproveSelected = (selectedIds: string[], password: string) => {
        setIsLoading(true);
        router.patch(
            route("bpa2.updateStatusMultiple"),
            { ids: selectedIds, status: "approved", password },
            {
                onSuccess: () => {
                    setSelectedIds([]);
                    setIsLoading(false);
                },
                onError: (errors) => {
                    console.error("Error updating status:", errors);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            }
        );
    };

    const handleDeleteSelected = (selectedIds: string[], password: string) => {
        router.delete(route("bpa2.deleteMultiple"), {
            data: { ids: selectedIds, password },
            onSuccess: () => {
                setSelectedIds([]);
            },
        });
    };

    const handlePasswordConfirm = async (password: string) => {
        if (passwordAction === "submit") {
            handleApproveSelected(selectedIds, password);
        } else if (passwordAction === "delete") {
            handleDeleteSelected(selectedIds, password);
        }
        setOpenPasswordModal(false);
    };

    return (
        <Authenticated>
            <Head title="eBupot BPA2" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        eBupot BPA2 Belum Terbit
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("bpa2.create")}>
                                    <Plus />
                                    Buat eBupot BPA2
                                </Link>
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={() => {
                                    setPasswordAction("delete");
                                    setOpenDeleteModal(true);
                                }}
                                disabled={selectedBpa2.length === 0}
                            >
                                <Trash />
                                Batalkan
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("submit");
                                    setOpenApproveModal(true);
                                }}
                                disabled={
                                    selectedBpa2.length === 0 ||
                                    selectedBpa2.some(
                                        (bpa2: any) => bpa2.status !== "created"
                                    ) ||
                                    isLoading
                                }
                            >
                                <Send /> {isLoading ? "Menerbitkan..." : "Terbitkan"}
                            </Button>
                            <Button disabled>
                                <FileUp /> Impor Data
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
                        <DataTableBupotA2
                            columns={columns}
                            data={initialBpa2}
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
                title="Terbitkan eBupot BPA2"
                description="Apakah Anda yakin ingin menerbitkan eBupot BPA2 yang Anda pilih?"
                open={openApproveModal}
                onClose={() => setOpenApproveModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenApproveModal(false);
                }}
            />
            <ConfirmDialog
                title="Batalkan eBupot BPA2"
                description="Apakah Anda yakin ingin membatalkan eBupot BPA2 yang Anda pilih?"
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
