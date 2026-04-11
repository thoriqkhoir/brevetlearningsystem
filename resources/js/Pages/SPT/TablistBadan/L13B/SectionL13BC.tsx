import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormL13BCDialog } from "./FormL13BCDialog";
import { TableL13BC } from "./TableL13BC";
import type { L13BCItem } from "./types";

interface SectionL13BCProps {
    data: L13BCItem[];
    sptBadanId: string;
}

export function SectionL13BC({ data, sptBadanId }: SectionL13BCProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L13BCItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: L13BCItem) => {
        setEditItem(item);
        setIsFormOpen(true);
    };

    const handleDeleteSingle = (id: string) => {
        setDeleteId(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteSelected = () => {
        if (!selectedIds.length) return;
        setDeleteId(null);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        const ids = deleteId ? [deleteId] : selectedIds;
        router.delete(route("spt.badan.l13bc.destroy"), {
            data: { ids },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                setIsDeleteConfirmOpen(false);
                setDeleteId(null);
            },
        });
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    className="bg-blue-950 hover:bg-blue-900"
                    onClick={handleAdd}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                </Button>
                {selectedIds.length > 0 && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteSelected}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus ({selectedIds.length})
                    </Button>
                )}
            </div>

            <TableL13BC
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL13BCDialog
                open={isFormOpen}
                onClose={handleFormClose}
                sptBadanId={sptBadanId}
                editData={editItem}
            />

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Data"
                description={
                    deleteId
                        ? "Apakah Anda yakin ingin menghapus data ini?"
                        : `Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih?`
                }
            />
        </div>
    );
}
