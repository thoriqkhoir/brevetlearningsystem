import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormL10ADialog } from "./FormL10ADialog";
import { TableL10A } from "./TableL10A";
import { L10AItem } from "./types";

interface SectionL10AProps {
    data: L10AItem[];
    sptBadanId: string;
}

export function SectionL10A({ data, sptBadanId }: SectionL10AProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L10AItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: L10AItem) => {
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
        router.delete(route("spt.badan.l10a.destroy"), {
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
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus ({selectedIds.length})
                </Button>
            </div>

            <TableL10A
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL10ADialog
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

export default SectionL10A;
