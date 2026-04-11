import { columns } from "@/Components/layout/Bupot/columns";
import { DataTableBupot } from "@/Components/layout/Bupot/data-table";
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
    const [selectedBp21, setSelectedBp21] = useState<any[]>([]);
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordAction, setPasswordAction] = useState<"submit" | "delete">(
        "submit"
    );
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [initialBp21, setInitialBp21] = useState(bupots);

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
            route("bp21.notIssued"),
            {},
            {
                onSuccess: (page) => {
                    setInitialBp21(page.props.bupots);
                },
            }
        );
    };

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialBp21.filter((bupots: any) =>
            ids.includes(bupots.id)
        );
        setSelectedBp21(selected);
    };

    const handleApproveSelected = (selectedIds: string[], password: string) => {
        router.patch(
            route("bp21.updateStatusMultiple"),
            { ids: selectedIds, status: "approved", password },
            {
                onSuccess: () => {
                    setSelectedIds([]);
                },
            }
        );
    };

    const handleDeleteSelected = (selectedIds: string[], password: string) => {
        router.delete(route("bp21.deleteMultiple"), {
            data: { ids: selectedIds, password },
            onSuccess: () => {
                setSelectedIds([]);
                handleRefresh();
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
            <Head title="eBupot BP21" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        eBupot BP21
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("bp21.create")}>
                                    <Plus />
                                    Buat eBupot BP21
                                </Link>
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={() => {
                                    setPasswordAction("delete");
                                    setOpenDeleteModal(true);
                                }}
                                disabled={selectedBp21.length === 0}
                            >
                                <Trash />
                                Hapus
                            </Button>
                            <Button
                                onClick={() => {
                                    setPasswordAction("submit");
                                    setOpenApproveModal(true);
                                }}
                                disabled={
                                    selectedBp21.length === 0 ||
                                    selectedBp21.some(
                                        (bp21: any) => bp21.status !== "created"
                                    )
                                }
                            >
                                <Send /> Terbitkan
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
                        <DataTableBupot
                            columns={columns}
                            data={initialBp21}
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
                title="Terbitkan e-Bupot BP21"
                description="Apakah Anda yakin ingin menerbitkan e-Bupot BP21 yang Anda pilih?"
                open={openApproveModal}
                onClose={() => setOpenApproveModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenApproveModal(false);
                }}
            />
            <ConfirmDialog
                title="Hapus e-Bupot BP21"
                description="Apakah Anda yakin ingin menghapus e-Bupot BP21 yang Anda pilih?"
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
