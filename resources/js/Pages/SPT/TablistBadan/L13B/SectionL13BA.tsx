import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormL13BADialog } from "./FormL13BADialog";
import { TableL13BA } from "./TableL13BA";
import type { L13BAItem } from "./types";

interface SectionL13BAProps {
    data: L13BAItem[];
    sptBadanId: string;
}

export function SectionL13BA({ data, sptBadanId }: SectionL13BAProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L13BAItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => { setEditItem(null); setIsFormOpen(true); };
    const handleEdit = (item: L13BAItem) => { setEditItem(item); setIsFormOpen(true); };
    const handleDeleteSingle = (id: string) => { setDeleteId(id); setIsDeleteConfirmOpen(true); };
    const handleDeleteSelected = () => {
        if (!selectedIds.length) return;
        setDeleteId(null);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        const ids = deleteId ? [deleteId] : selectedIds;
        router.delete(route("spt.badan.l13ba.destroy"), {
            data: { ids },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                setIsDeleteConfirmOpen(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <Button type="button" className="bg-blue-950 hover:bg-blue-900" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0}
                >
                    <Trash2 className="w-4 h-4 mr-2" /> Hapus ({selectedIds.length})
                </Button>
            </div>

            <TableL13BA
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL13BADialog
                open={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditItem(null); }}
                sptBadanId={sptBadanId}
                editData={editItem}
            />

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onClose={() => { setIsDeleteConfirmOpen(false); setDeleteId(null); }}
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
