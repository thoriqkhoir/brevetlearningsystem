import {
    BookOpen,
    ExternalLink,
    FileText,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { ExamReferenceItem } from "./examTypes";

/**
 * Converts common Google Drive / Docs / Sheets / Slides sharing URLs into an embeddable preview URL.
 */
export function buildGoogleDrivePreviewUrl(rawUrl: string): {
    embedUrl: string | null;
    isFolder: boolean;
} {
    const trimmed = (rawUrl || "").trim();
    if (!trimmed) return { embedUrl: null, isFolder: false };

    // Google Drive folder
    const folderMatch = /drive\.google\.com\/(?:drive\/(?:u\/\d+\/)?folders\/)([a-zA-Z0-9_-]+)/.exec(trimmed);
    if (folderMatch) {
        return {
            embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`,
            isFolder: true,
        };
    }

    // Google Drive file (/file/d/ID/...)
    const fileMatch = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/.exec(trimmed);
    if (fileMatch) {
        return {
            embedUrl: `https://drive.google.com/file/d/${fileMatch[1]}/preview`,
            isFolder: false,
        };
    }

    // Google Drive open?id=ID or uc?id=ID
    const idParamMatch = /drive\.google\.com\/(?:open|uc)\?[^#]*\bid=([a-zA-Z0-9_-]+)/.exec(trimmed);
    if (idParamMatch) {
        return {
            embedUrl: `https://drive.google.com/file/d/${idParamMatch[1]}/preview`,
            isFolder: false,
        };
    }

    // Google Docs / Sheets / Slides
    const docsMatch = /docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/.exec(
        trimmed,
    );
    if (docsMatch) {
        return {
            embedUrl: `https://docs.google.com/${docsMatch[1]}/d/${docsMatch[2]}/preview`,
            isFolder: false,
        };
    }

    // Generic HTTPS link fallback
    return { embedUrl: trimmed, isFolder: false };
}

interface ExamReferenceSidebarProps {
    references: ExamReferenceItem[];
    isOpen: boolean;
    onToggleOpen: () => void;
}

export default function ExamReferenceSidebar({
    references = [],
    isOpen,
    onToggleOpen,
}: ExamReferenceSidebarProps) {
    const [activeRef, setActiveRef] = useState<ExamReferenceItem | null>(null);
    const previewMeta = activeRef ? buildGoogleDrivePreviewUrl(activeRef.url) : null;

    if (!isOpen) {
        return (
            <div className="flex lg:flex-col items-center justify-between lg:justify-start gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onToggleOpen}
                    title="Buka Panel Referensi"
                    className="w-full lg:w-11 lg:h-auto lg:py-3 flex lg:flex-col items-center gap-2 bg-white border rounded-xl shadow-sm hover:bg-slate-50"
                >
                    <PanelLeftOpen className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 lg:[writing-mode:vertical-rl] lg:rotate-180">
                        Referensi ({references.length})
                    </span>
                </Button>
            </div>
        );
    }

    return (
        <>
            <aside className="bg-white border rounded-xl p-4 shadow-sm h-max flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b">
                    <div className="flex items-center gap-2 min-w-0">
                        <BookOpen className="h-4 w-4 text-blue-600 shrink-0" />
                        <h3 className="font-semibold text-sm text-gray-800 truncate">
                            Referensi
                        </h3>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onToggleOpen}
                        title="Tutup Panel Referensi"
                        className="h-7 w-7 text-gray-500 hover:text-gray-800 shrink-0"
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </Button>
                </div>

                {references.length > 0 ? (
                    <div className="space-y-2">
                        {references.map((item, idx) => (
                            <button
                                key={item.id ?? `${item.url}-${idx}`}
                                type="button"
                                onClick={() => setActiveRef(item)}
                                className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 transition-colors group"
                            >
                                <FileText className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-slate-800 group-hover:text-blue-700 break-words leading-snug">
                                        {item.title || `Referensi ${idx + 1}`}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        Klik untuk pratinjau file
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-3 text-center">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Belum ada link referensi Google Drive untuk ujian ini.
                        </p>
                    </div>
                )}
            </aside>

            {/* Popup Preview File Google Drive */}
            <Dialog open={!!activeRef} onOpenChange={(next) => !next && setActiveRef(null)}>
                <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden exam-allow-select">
                    <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
                        <DialogTitle className="text-sm sm:text-base font-semibold truncate pr-6">
                            {activeRef?.title || "Referensi Ujian"}
                        </DialogTitle>
                        {activeRef?.url && (
                            <a
                                href={activeRef.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 mr-6 shrink-0"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Buka di Tab Baru
                            </a>
                        )}
                    </DialogHeader>

                    <div className="flex-1 min-h-0 bg-slate-100 relative">
                        {previewMeta?.embedUrl ? (
                            <iframe
                                src={previewMeta.embedUrl}
                                title={activeRef?.title || "Preview Referensi"}
                                className="w-full h-full border-0"
                                allow="autoplay"
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-sm text-slate-500">
                                URL referensi tidak valid.
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-2 bg-slate-50 border-t text-[11px] text-slate-500 flex items-center justify-between gap-2">
                        <span>
                            {previewMeta?.isFolder
                                ? "Jika isi folder tidak tampil, pastikan izin Drive disetel ke 'Siapa saja yang memiliki link' atau buka di tab baru."
                                : "Jika pratinjau tidak muncul karena izin Google Drive, klik 'Buka di Tab Baru'."}
                        </span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
