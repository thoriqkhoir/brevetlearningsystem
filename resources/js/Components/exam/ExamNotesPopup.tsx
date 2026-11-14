import { Check, Copy, StickyNote, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import FloatingToolWindow from "./FloatingToolWindow";
import { NotesSessionState } from "./examTypes";

interface ExamNotesPopupProps {
    open: boolean;
    onClose: () => void;
    state: NotesSessionState;
    onChange: (
        updater: NotesSessionState | ((prev: NotesSessionState) => NotesSessionState),
    ) => void;
    zIndex?: number;
    onFocus?: () => void;
}

export default function ExamNotesPopup({
    open,
    onClose,
    state,
    onChange,
    zIndex,
    onFocus,
}: ExamNotesPopupProps) {
    const [copied, setCopied] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);

    const handleCopy = async () => {
        if (!state.content) return;
        try {
            await navigator.clipboard.writeText(state.content);
            setCopied(true);
            toast.success("Catatan disalin");
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    };

    const handleClear = () => {
        if (!confirmClear) {
            setConfirmClear(true);
            setTimeout(() => setConfirmClear(false), 3000);
            return;
        }
        onChange({ content: "", updatedAt: new Date().toISOString() });
        setConfirmClear(false);
    };

    return (
        <FloatingToolWindow
            open={open}
            onClose={onClose}
            title="Notes / Catatan Ujian"
            icon={<StickyNote className="h-4 w-4 text-amber-300 shrink-0" />}
            defaultPosition={{ x: 140, y: 110 }}
            defaultWidth={400}
            defaultHeight={380}
            zIndex={zIndex}
            onFocus={onFocus}
        >
            <div className="flex-1 min-h-0 flex flex-col p-3 gap-2">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>Tersimpan otomatis selama sesi ujian ini</span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handleCopy}
                            disabled={!state.content}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700"
                        >
                            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            <span>Salin</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={!state.content}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded border transition-colors disabled:opacity-40 ${
                                confirmClear
                                    ? "bg-rose-600 text-white border-rose-600"
                                    : "border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-700"
                            }`}
                        >
                            <Trash2 className="h-3 w-3" />
                            <span>{confirmClear ? "Klik lagi utk hapus" : "Bersihkan"}</span>
                        </button>
                    </div>
                </div>

                <textarea
                    value={state.content}
                    onChange={(e) =>
                        onChange({
                            content: e.target.value,
                            updatedAt: new Date().toISOString(),
                        })
                    }
                    placeholder="Tulis catatan perhitungan pajak, poin penting, atau coretan sementara di sini..."
                    className="exam-allow-select select-text flex-1 min-h-[220px] w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans leading-relaxed"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{state.content.length} karakter</span>
                    <span>Akan tereset otomatis saat mengulang / remidi</span>
                </div>
            </div>
        </FloatingToolWindow>
    );
}
