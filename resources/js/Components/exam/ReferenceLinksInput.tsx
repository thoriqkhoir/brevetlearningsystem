import { BookOpen, ExternalLink, Link2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

export type ReferenceLinkFormItem = {
    title: string;
    url: string;
};

/**
 * Normalize backend reference_link payload into editable form rows.
 */
export function normalizeReferenceLinksForForm(raw: any): ReferenceLinkFormItem[] {
    let source = raw;
    if (typeof source === "string") {
        try {
            source = JSON.parse(source);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(source)) return [];

    return source
        .map((item, idx) => {
            if (typeof item === "string" && item.trim()) {
                return { title: `Referensi ${idx + 1}`, url: item.trim() };
            }
            if (item && typeof item === "object") {
                const title = typeof item.title === "string" ? item.title : "";
                const url = typeof item.url === "string" ? item.url : "";
                if (!title.trim() && !url.trim()) return null;
                return { title, url };
            }
            return null;
        })
        .filter((item): item is ReferenceLinkFormItem => Boolean(item));
}

/**
 * Validate and sanitize form rows before sending to the backend.
 * Returns either cleaned items or an Indonesian error message.
 */
export function validateAndPrepareReferenceLinks(
    items: ReferenceLinkFormItem[] | undefined | null,
): { valid: true; data: ReferenceLinkFormItem[] } | { valid: false; error: string } {
    const cleaned: ReferenceLinkFormItem[] = [];
    let idx = 1;

    for (const row of items || []) {
        const title = (row?.title || "").trim();
        const url = (row?.url || "").trim();

        if (!title && !url) continue;

        if (!url) {
            return {
                valid: false,
                error: `URL link referensi ke-${idx} wajib diisi jika judul diisi.`,
            };
        }

        try {
            const parsed = new URL(url);
            if (!["http:", "https:"].includes(parsed.protocol)) {
                return {
                    valid: false,
                    error: `URL link referensi ke-${idx} harus menggunakan http:// atau https://.`,
                };
            }
        } catch {
            return {
                valid: false,
                error: `URL link referensi ke-${idx} tidak valid.`,
            };
        }

        cleaned.push({
            title: title || `Referensi ${idx}`,
            url,
        });
        idx++;
    }

    return { valid: true, data: cleaned };
}

interface ReferenceLinksInputProps {
    value: ReferenceLinkFormItem[];
    onChange: (next: ReferenceLinkFormItem[]) => void;
    error?: string;
    compact?: boolean;
}

export function ReferenceLinksInput({
    value = [],
    onChange,
    error,
    compact = false,
}: ReferenceLinksInputProps) {
    const items = Array.isArray(value) ? value : [];

    const handleAdd = () => {
        onChange([...items, { title: "", url: "" }]);
    };

    const handleUpdate = (
        index: number,
        field: keyof ReferenceLinkFormItem,
        fieldVal: string,
    ) => {
        const next = items.map((item, idx) =>
            idx === index ? { ...item, [field]: fieldVal } : item,
        );
        onChange(next);
    };

    const handleRemove = (index: number) => {
        onChange(items.filter((_, idx) => idx !== index));
    };

    return (
        <div className="space-y-2.5 rounded-lg border bg-slate-50/70 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span>Link Referensi Ujian (Google Drive)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Opsional. Bisa menambahkan lebih dari 1 link file/folder Google Drive untuk dibuka peserta di popup sebelah kiri selama ujian.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAdd}
                    className="gap-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Link
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-white/70 px-3 py-2.5 text-xs text-slate-500">
                    Belum ada link referensi. Klik <strong>Tambah Link</strong> jika ujian membutuhkan dokumen acuan.
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`grid grid-cols-1 ${
                                compact ? "sm:grid-cols-[1fr_1.4fr_auto]" : "md:grid-cols-[1fr_1.5fr_auto]"
                            } gap-2 items-start rounded-md border bg-white p-2.5`}
                        >
                            <div>
                                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                                    Judul Referensi #{idx + 1}
                                </span>
                                <Input
                                    type="text"
                                    placeholder={`Contoh: Tabel Tarif / Referensi ${idx + 1}`}
                                    value={item.title ?? ""}
                                    onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                                    className="h-9 text-xs sm:text-sm"
                                />
                            </div>
                            <div>
                                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                                    URL Google Drive
                                </span>
                                <div className="relative">
                                    <Link2 className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <Input
                                        type="url"
                                        placeholder="https://drive.google.com/file/d/.../view"
                                        value={item.url ?? ""}
                                        onChange={(e) => handleUpdate(idx, "url", e.target.value)}
                                        className="h-9 pl-8 text-xs sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end sm:pt-5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(idx)}
                                    title="Hapus link ini"
                                    className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-[11px] text-slate-500">
                Pastikan akses Google Drive disetel ke{" "}
                <strong className="text-slate-700">Anyone with the link (Siapa saja yang memiliki link)</strong>{" "}
                agar dapat langsung dipratinjau peserta.
            </p>

            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}

interface ReferenceLinksDisplayProps {
    links: any;
    title?: string;
}

export function ReferenceLinksDisplay({
    links,
    title = "Referensi Google Drive",
}: ReferenceLinksDisplayProps) {
    const items = normalizeReferenceLinksForForm(links).filter((i) => i.url);
    if (items.length === 0) return null;

    return (
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <BookOpen className="h-3.5 w-3.5" />
                <span>
                    {title} ({items.length})
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <a
                        key={`${item.url}-${idx}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                        <span>{item.title || `Referensi ${idx + 1}`}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                ))}
            </div>
        </div>
    );
}
