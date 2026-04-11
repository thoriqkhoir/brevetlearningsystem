import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
import { columns } from "@/Components/layout/Retur/columns";
import { DataTableRetur } from "@/Components/layout/Retur/data-table";
import { Button } from "@/Components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { File, FileText, FileX, Plus, RefreshCcw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ReturPajakKeluaran({ returs }: any) {
    const { flash }: any = usePage().props;
    const [openModal, setOpenModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
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
        handleCancelSelected(selectedIds, password);
        setOpenPasswordModal(false);
    };

    const handleRefresh = () => {
        router.get(
            route("retur.output"),
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
            <Head title="Retur Pajak Keluaran" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Retur Pajak Keluaran
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("retur.create")}>
                                    <Plus />
                                    Tambah Retur Keluaran
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setOpenModal(true)}
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
                                Batalkan Retur Keluaran
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
                title="Batalkan Retur Pajak Keluaran"
                description="Apakah Anda yakin ingin membatalkan retur pajak keluaran yang Anda pilih?"
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenModal(false);
                }}
            />
        </Authenticated>
    );
}
