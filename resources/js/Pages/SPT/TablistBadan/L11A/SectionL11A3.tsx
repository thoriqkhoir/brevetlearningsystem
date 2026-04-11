import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormL11A3Dialog } from "./FormL11A3Dialog";
import { TableL11A3 } from "./TableL11A3";
import { L11A3Item } from "./types";

interface SectionL11A3Props {
    data: L11A3Item[];
    sptBadanId: string;
}

export function SectionL11A3({ data, sptBadanId }: SectionL11A3Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L11A3Item | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => { setEditItem(null); setIsFormOpen(true); };
    const handleEdit = (item: L11A3Item) => { setEditItem(item); setIsFormOpen(true); };
    const handleDeleteSingle = (id: string) => { setDeleteId(id); setIsDeleteConfirmOpen(true); };
    const handleDeleteSelected = () => { if (!selectedIds.length) return; setDeleteId(null); setIsDeleteConfirmOpen(true); };

    const confirmDelete = () => {
        const ids = deleteId ? [deleteId] : selectedIds;
        router.delete(route("spt.badan.l11a3.destroy"), {
            data: { ids },
            preserveScroll: true,
            onSuccess: () => { setSelectedIds([]); setIsDeleteConfirmOpen(false); setDeleteId(null); },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <Button type="button" className="bg-blue-950 hover:bg-blue-900" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah
                </Button>
                <Button type="button" variant="destructive" onClick={handleDeleteSelected} disabled={!selectedIds.length}>
                    <Trash2 className="w-4 h-4 mr-2" /> Hapus ({selectedIds.length})
                </Button>
            </div>
            <TableL11A3
                data={data}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />
            <FormL11A3Dialog open={isFormOpen} onClose={() => { setIsFormOpen(false); setEditItem(null); }} sptBadanId={sptBadanId} editData={editItem} />
            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onClose={() => { setIsDeleteConfirmOpen(false); setDeleteId(null); }}
                onConfirm={confirmDelete}
                title="Hapus Data"
                description={deleteId ? "Apakah Anda yakin ingin menghapus data ini?" : `Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih?`}
            />
        </div>
    );
}

export default SectionL11A3;
