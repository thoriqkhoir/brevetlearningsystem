import { columns } from "@/Components/layout/Bupot/columns";
import { DataTableBupot } from "@/Components/layout/Bupot/data-table";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
import { Button } from "@/Components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { File, FileText, FileX, RefreshCcw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Issued({ bupots }: any) {
    const { flash }: any = usePage().props;
    const [selectedBp26, setSelectedBp26] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [initialBp26, setInitialBp26] = useState(bupots);

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
            route("bp26.issued"),
            {},
            {
                onSuccess: (page) => {
                    setInitialBp26(page.props.bupots);
                },
            }
        );
    };

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialBp26.filter((bupots: any) =>
            ids.includes(bupots.id)
        );
        setSelectedBp26(selected);
    };

    const handleDeleteSelected = (selectedIds: string[], password: string) => {
        router.delete(route("bp26.deleteMultiple"), {
            data: { ids: selectedIds, password },
            onSuccess: () => {
                setSelectedIds([]);
            },
        });
    };

    const handlePasswordConfirm = async (password: string) => {
        handleDeleteSelected(selectedIds, password);

        setOpenPasswordModal(false);
    };

    return (
        <Authenticated>
            <Head title="eBupot BP26" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        eBupot BP26 Telah Terbit
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex gap-2 mb-2">
                            <Button
                                variant={"destructive"}
                                onClick={() => {
                                    setOpenDeleteModal(true);
                                }}
                                disabled={selectedBp26.length === 0}
                            >
                                <Trash />
                                Hapus
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
                            data={initialBp26}
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
                title="Hapus e-Bupot BP26"
                description="Apakah Anda yakin ingin menghapus e-Bupot BP26 yang Anda pilih?"
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
