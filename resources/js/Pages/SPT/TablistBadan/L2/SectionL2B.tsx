import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormL2BDialog } from "./FormL2BDialog";
import { TableL2B } from "./TableL2B";
import { L2BItem } from "./types";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";

interface SectionL2BProps {
    data: L2BItem[];
    sptBadanId: string;
}

export function SectionL2B({ data, sptBadanId }: SectionL2BProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L2BItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: L2BItem) => {
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

        router.delete(route("spt.badan.l2b.destroy"), {
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
                
            </div>

            <TableL2B
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL2BDialog
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

export default SectionL2B;
