import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormL9Dialog } from "./FormL9Dialog";
import { TableL9 } from "./TableL9";
import { L9Item, L9GroupType } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number) =>
    rupiahFormatter.format(value).replace("Rp", "").trim();

interface SectionL9Props {
    data: L9Item[];
    sptBadanId: string;
}

// Group definitions
const GROUPS: {
    label: string;
    value: string;
    types: { groupType: L9GroupType; label: string }[];
}[] = [
    {
        label: "1. Harta Berwujud",
        value: "berwujud",
        types: [
            { groupType: "1a", label: "Kelompok 1" },
            { groupType: "1b", label: "Kelompok 2" },
            { groupType: "1c", label: "Kelompok 3" },
            { groupType: "1d", label: "Kelompok 4" },
            { groupType: "1e", label: "Kelompok Lainnya" },
        ],
    },
    {
        label: "2. Harta Bangunan",
        value: "bangunan",
        types: [
            { groupType: "2a", label: "Permanen" },
            { groupType: "2b", label: "Tidak Permanen" },
        ],
    },
    {
        label: "3. Harta Tidak Berwujud",
        value: "tidak_berwujud",
        types: [
            { groupType: "3a", label: "Kelompok 1" },
            { groupType: "3b", label: "Kelompok 2" },
            { groupType: "3c", label: "Kelompok 3" },
            { groupType: "3d", label: "Kelompok 4" },
            { groupType: "3e", label: "Kelompok Lainnya" },
        ],
    },
];

interface SubSectionState {
    isFormOpen: boolean;
    editItem: L9Item | null;
    selectedIds: string[];
    isDeleteConfirmOpen: boolean;
    deleteId: string | null;
    deleteMode: "single" | "selected" | "all";
}

const defaultSubState = (): SubSectionState => ({
    isFormOpen: false,
    editItem: null,
    selectedIds: [],
    isDeleteConfirmOpen: false,
    deleteId: null,
    deleteMode: "single",
});

export function SectionL9({ data, sptBadanId }: SectionL9Props) {
    // Keyed by groupType string
    const [states, setStates] = useState<Record<string, SubSectionState>>(
        () => {
            const init: Record<string, SubSectionState> = {};
            GROUPS.forEach((g) =>
                g.types.forEach((t) => {
                    init[t.groupType] = defaultSubState();
                }),
            );
            return init;
        },
    );

    const updateState = (
        groupType: L9GroupType,
        patch: Partial<SubSectionState>,
    ) => {
        setStates((prev) => ({
            ...prev,
            [groupType]: { ...prev[groupType], ...patch },
        }));
    };

    const handleAdd = (groupType: L9GroupType) => {
        updateState(groupType, { editItem: null, isFormOpen: true });
    };

    const handleEdit = (groupType: L9GroupType, item: L9Item) => {
        updateState(groupType, { editItem: item, isFormOpen: true });
    };

    const handleDeleteSingle = (groupType: L9GroupType, id: string) => {
        updateState(groupType, {
            deleteId: id,
            isDeleteConfirmOpen: true,
            deleteMode: "single",
        });
    };

    const handleDeleteSelected = (groupType: L9GroupType) => {
        const s = states[groupType];
        if (s.selectedIds.length === 0) return;
        updateState(groupType, {
            deleteId: null,
            isDeleteConfirmOpen: true,
            deleteMode: "selected",
        });
    };

    const handleDeleteAll = (groupType: L9GroupType) => {
        const filtered = data.filter((item) => item.group_type === groupType);
        if (filtered.length === 0) return;

        updateState(groupType, {
            deleteId: null,
            isDeleteConfirmOpen: true,
            deleteMode: "all",
        });
    };

    const confirmDelete = (groupType: L9GroupType) => {
        const s = states[groupType];
        const idsToDelete =
            s.deleteMode === "all"
                ? data
                      .filter((item) => item.group_type === groupType)
                      .map((item) => item.id)
                      .filter(Boolean)
                : s.deleteId
                  ? [s.deleteId]
                  : s.selectedIds;

        router.delete(route("spt.badan.l9.destroy"), {
            data: { ids: idsToDelete },
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data berhasil dihapus");
                router.reload({ only: ["l9"] });
                updateState(groupType, {
                    selectedIds: [],
                    isDeleteConfirmOpen: false,
                    deleteId: null,
                    deleteMode: "single",
                });
            },
        });
    };

    const handleFormClose = (groupType: L9GroupType) => {
        updateState(groupType, { isFormOpen: false, editItem: null });
    };

    const renderAccordionGroup = (group: (typeof GROUPS)[number]) => (
        <Accordion
            key={group.value}
            type="single"
            collapsible
            defaultValue={group.value}
        >
            <AccordionItem value={group.value}>
                <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 rounded hover:no-underline">
                    {group.label}
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                    {group.types.map(({ groupType, label }) => {
                        const s = states[groupType];
                        const filtered = data.filter(
                            (item) => item.group_type === groupType,
                        );

                        return (
                            <div key={groupType} className="space-y-3 border">
                                {/* Label header dengan background zinc-300 */}
                                <div className="bg-zinc-300 dark:bg-zinc-700 px-4 py-2 rounded-t">
                                    <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-100">
                                        {label}
                                    </h4>
                                </div>

                                {/* Tombol aksi di bawah label */}
                                <div className="flex gap-2 px-2">
                                    <Button
                                        type="button"
                                        className="bg-blue-950 hover:bg-blue-900"
                                        size="sm"
                                        onClick={() => handleAdd(groupType)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Tambah
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        disabled={s.selectedIds.length === 0}
                                        onClick={() =>
                                            handleDeleteSelected(groupType)
                                        }
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Hapus
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        disabled={filtered.length === 0}
                                        onClick={() =>
                                            handleDeleteAll(groupType)
                                        }
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Hapus Semua
                                    </Button>
                                </div>

                                <TableL9
                                    data={filtered}
                                    selectedIds={s.selectedIds}
                                    onSelectChange={(ids) =>
                                        updateState(groupType, {
                                            selectedIds: ids,
                                        })
                                    }
                                    onEdit={(item) =>
                                        handleEdit(groupType, item)
                                    }
                                    onDelete={(id) =>
                                        handleDeleteSingle(groupType, id)
                                    }
                                />

                                <FormL9Dialog
                                    open={s.isFormOpen}
                                    onClose={() => handleFormClose(groupType)}
                                    sptBadanId={sptBadanId}
                                    groupType={groupType}
                                    editData={s.editItem}
                                />

                                <ConfirmDialog
                                    open={s.isDeleteConfirmOpen}
                                    onClose={() =>
                                        updateState(groupType, {
                                            isDeleteConfirmOpen: false,
                                            deleteId: null,
                                            deleteMode: "single",
                                        })
                                    }
                                    onConfirm={() => confirmDelete(groupType)}
                                    title="Hapus Data"
                                    description={
                                        s.deleteMode === "all"
                                            ? `Apakah Anda yakin ingin menghapus semua ${filtered.length} data pada bagian ini?`
                                            : s.deleteId
                                              ? "Apakah Anda yakin ingin menghapus data ini?"
                                              : `Apakah Anda yakin ingin menghapus ${s.selectedIds.length} data yang dipilih?`
                                    }
                                />
                            </div>
                        );
                    })}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );

    const totalFiskal = data.reduce(
        (sum, item) => sum + (item.depreciation_this_year ?? 0),
        0,
    );
    const totalKomersial = data.reduce(
        (sum, item) =>
            item.comercial_depreciation_method
                ? sum + (item.depreciation_this_year ?? 0)
                : sum,
        0,
    );
    const selisih = totalFiskal - totalKomersial;

    return (
        <div className="space-y-4">
            {/* Accordion 1: Harta Berwujud */}
            {renderAccordionGroup(GROUPS[0])}

            {/* Accordion 2: Harta Bangunan */}
            {renderAccordionGroup(GROUPS[1])}

            {/* ===== Summary: Jumlah Penyusutan ===== */}
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-sm font-semibold uppercase">
                        Jumlah Penyusutan Fiskal
                    </Label>
                    <Input
                        readOnly
                        value={formatMoney(totalFiskal)}
                        className="text-right bg-gray-100 dark:bg-gray-800 cursor-default"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-sm font-semibold uppercase">
                        Jumlah Penyusutan Komersial
                    </Label>
                    <Input
                        readOnly
                        value={formatMoney(totalKomersial)}
                        className="text-right bg-gray-100 dark:bg-gray-800 cursor-default"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-sm font-semibold uppercase">
                        Selisih Penyusutan
                    </Label>
                    <Input
                        readOnly
                        value={formatMoney(selisih)}
                        className="text-right bg-gray-100 dark:bg-gray-800 cursor-default"
                    />
                </div>
            </div>

            {/* ===== Summary: Jumlah Amortisasi ===== */}

            {/* Accordion 3: Harta Tidak Berwujud */}
            {renderAccordionGroup(GROUPS[2])}
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-sm font-semibold uppercase">
                        Jumlah Amortisasi Fiskal
                    </Label>
                    <Input
                        readOnly
                        value={formatMoney(0)}
                        className="text-right bg-gray-100 dark:bg-gray-800 cursor-default"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-sm font-semibold uppercase">
                        Jumlah Amortisasi Komersial
                    </Label>
                    <Input
                        readOnly
                        value={formatMoney(0)}
                        className="text-right bg-gray-100 dark:bg-gray-800 cursor-default"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-sm font-semibold uppercase">
                        Selisih Amortisasi
                    </Label>
                    <Input
                        readOnly
                        value={formatMoney(0)}
                        className="text-right bg-gray-100 dark:bg-gray-800 cursor-default"
                    />
                </div>
            </div>
        </div>
    );
}

export default SectionL9;
