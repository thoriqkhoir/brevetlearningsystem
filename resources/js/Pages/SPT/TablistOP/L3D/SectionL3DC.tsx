import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { L3DCItem } from "./types";
import { TableL3DC } from "./TableL3DC";
import { FormL3DCDialog } from "./FormL3DCDialog";

export function SectionL3DC({
    data,
    sptOpId,
    onRefresh,
}: {
    data: L3DCItem[];
    sptOpId: string;
    onRefresh?: () => void;
}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L3DCItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: L3DCItem) => {
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

    const handleDeleteAll = () => {
        if (data.length === 0) return;
        setSelectedIds(data.map((r) => r.id!).filter(Boolean));
        setDeleteId(null);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        const idsToDelete = deleteId ? [deleteId] : selectedIds;

        router.delete(route("spt.op.l3dc.destroy"), {
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
                    variant="destructive"
                    onClick={handleDeleteAll}
                    disabled={data.length === 0}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Semua
                </Button>
            </div>

            <TableL3DC
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL3DCDialog
                open={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditItem(null);
                }}
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
