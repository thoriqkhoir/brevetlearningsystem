import { Button } from "@/Components/ui/button";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FormL4BDialog } from "./FormL4BDialog";
import { TableL4B } from "./TableL4B";
import { L4BItem } from "./types";

interface SectionL4BProps {
    data: L4BItem[];
    sptBadanId: string;
}

export function SectionL4B({ data, sptBadanId }: SectionL4BProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L4BItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: L4BItem) => {
        setEditItem(item);
        setIsFormOpen(true);
    };

    const handleDeleteSingle = (id: string) => {
        setDeleteId(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        setDeleteId(null);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        const idsToDelete = deleteId ? [deleteId] : selectedIds;

        router.delete(route("spt.badan.l4b.destroy"), {
            data: { ids: idsToDelete },
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
                        Hapus ({selectedIds.length})
                    </Button>
                )}
            </div>

            <TableL4B
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL4BDialog
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

export default SectionL4B;
