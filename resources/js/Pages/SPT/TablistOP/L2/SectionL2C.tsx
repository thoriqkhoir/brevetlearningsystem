import { Button } from "@/Components/ui/button";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { router } from "@inertiajs/react";
import { Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { FormL2CDialog } from "./FormL2CDialog";
import { TableL2C } from "./TableL2C";
import type { L2CItem } from "./types";

interface SectionL2CProps {
    data: L2CItem[];
    sptOpId: string;
    onRefresh?: () => void;
}

export function SectionL2C({ data, sptOpId, onRefresh }: SectionL2CProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L2CItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: L2CItem) => {
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

        router.delete(route("spt.op.l2c.destroy"), {
            data: { ids: idsToDelete },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                setIsDeleteConfirmOpen(false);
                setDeleteId(null);
                onRefresh?.();
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
                <Button
                    type="button"
                    variant="outline"
                    className="border-blue-950 text-blue-950"
                    disabled
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Impor data
                </Button>
            </div>

            <TableL2C
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL2CDialog
                open={isFormOpen}
                onClose={handleFormClose}
                sptOpId={sptOpId}
                editData={editItem}
                onSuccess={onRefresh}
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

export default SectionL2C;
