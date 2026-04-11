import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Plus, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { FormL3CDialog } from "./FormL3CDialog";
import { TableL3C } from "./TableL3C";
import {
    AssetOption,
    L3CItem,
    L3CSubType,
    L3CType,
    L3C_SUBTYPE_LABEL,
} from "./types";

interface SectionL3CProps {
    title?: string;
    data: L3CItem[];
    sptOpId: string;
    type: L3CType;
    subType: L3CSubType;
    assetOptions: AssetOption[];
    onRefresh?: () => void;
}

export function SectionL3C({
    title,
    data,
    sptOpId,
    type,
    subType,
    assetOptions,
    onRefresh,
}: SectionL3CProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L3CItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const rows = useMemo(() => {
        return (data ?? []).filter(
            (d) => d.type === type && d.sub_type === subType,
        );
    }, [data, type, subType]);

    const handleAdd = () => {
        setEditItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: L3CItem) => {
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
        if (rows.length === 0) return;
        setSelectedIds(rows.map((r) => r.id!).filter(Boolean));
        setDeleteId(null);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        const idsToDelete = deleteId ? [deleteId] : selectedIds;

        router.delete(route("spt.op.l3c.destroy"), {
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

    const sectionTitle = title ?? L3C_SUBTYPE_LABEL[subType];

    return (
        <div className="space-y-4">
            <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                {sectionTitle}
            </div>

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
                    disabled={rows.length === 0}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Semua
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

            <TableL3C
                data={rows}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
            />

            <FormL3CDialog
                open={isFormOpen}
                onClose={handleFormClose}
                sptOpId={sptOpId}
                type={type}
                subType={subType}
                assetOptions={assetOptions}
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

export default SectionL3C;
