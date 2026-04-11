import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { columns } from "@/Components/layout/Teacher/columns";
import { DataTableTeacher } from "@/Components/layout/Teacher/data-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Modal from "@/Components/ui/modal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Download, FileDown, RefreshCcw, Trash, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DaftarPengajar({ users, events }: any) {
    const { flash }: any = usePage().props;
    const [initialUsers, setInitialUsers] = useState(users || []);
    const [isImportModalOpen, setImportModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { data, setData, post, errors, reset } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    const eventOptions = events.map((event: any) => ({
        value: String(event.id),
        label: event.name,
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData("file", e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        post("/admin/teachers/import", {
            onSuccess: () => {
                setIsLoading(false);
                setImportModalOpen(false);
                router.reload();
            },
            onError: (errors) => {
                setIsLoading(false);
                if (errors.file) {
                    toast.error(errors.file);
                }
            },
            preserveScroll: true,
            preserveState: false,
        });
    };

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
            route("admin.teachers"),
            {},
            {
                onSuccess: (page) => {
                    setInitialUsers(page.props.users);
                },
            }
        );
    };

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialUsers.filter((retur: any) =>
            ids.includes(retur.id)
        );
        setSelectedUsers(selected);
    };

    const handleDeleteSelected = () => {
        router.delete(route("admin.deleteMultipleTeacher"), {
            data: { ids: selectedIds },
            onSuccess: () => {
                handleRefresh();
                setSelectedIds([]);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Daftar Pengajar" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Daftar Pengajar
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2"></div>
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("admin.createTeacher")}>
                                    <UserPlus />
                                    Tambah Pengajar
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setOpenDeleteModal(true);
                                }}
                                disabled={selectedUsers.length === 0}
                            >
                                <Trash />
                                Hapus Pengajar
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-600/90"
                                onClick={() => setImportModalOpen(true)}
                            >
                                <FileDown />
                                Import Pengajar
                            </Button>
                            <Modal
                                isOpen={isImportModalOpen}
                                onClose={() => setImportModalOpen(false)}
                                title="Import Pengajar"
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
                                href="/templates/format_pengajar_bls.xlsx"
                                download
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download Format Import Pengajar BLS
                            </a>
                        </Button>
                        <DataTableTeacher
                            columns={columns}
                            data={initialUsers}
                            setSelectedIds={handleSelectIds}
                        />
                    </div>
                </div>
            </div>
            <ConfirmDialog
                title="Hapus Pengajar"
                description="Apakah Anda yakin ingin menghapus pengajar yang Anda pilih?"
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={() => handleDeleteSelected()}
            />
        </AdminLayout>
    );
}
