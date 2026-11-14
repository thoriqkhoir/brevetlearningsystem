import {
    AlertTriangle,
    Calculator,
    FileSpreadsheet,
    Flag,
    PanelRightClose,
    PanelRightOpen,
    StickyNote,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { ExamActivePopupsState, QuestionIndexItem } from "./examTypes";

interface ExamRightSidebarProps {
    isOpen: boolean;
    onToggleOpen: () => void;
    questionIndex: QuestionIndexItem[];
    currentQuestionId?: string | null;
    answeredQuestionIds: string[];
    localAnsweredIds: string[];
    flaggedIds: string[];
    canSubmit: boolean;
    onSelectQuestion: (questionId: string) => void;
    onRequestSubmit: () => void;
    activePopups: ExamActivePopupsState;
    onTogglePopup: (tool: keyof ExamActivePopupsState) => void;
    hasNotesContent?: boolean;
    hasExcelContent?: boolean;
    calcHistoryCount?: number;
}

export default function ExamRightSidebar({
    isOpen,
    onToggleOpen,
    questionIndex = [],
    currentQuestionId,
    answeredQuestionIds = [],
    localAnsweredIds = [],
    flaggedIds = [],
    canSubmit,
    onSelectQuestion,
    onRequestSubmit,
    activePopups,
    onTogglePopup,
    hasNotesContent = false,
    hasExcelContent = false,
    calcHistoryCount = 0,
}: ExamRightSidebarProps) {
    const flaggedQuestions = questionIndex
        .map((q, idx) => ({ id: q.id, number: idx + 1 }))
        .filter((item) => flaggedIds.includes(item.id));
    const flaggedCount = flaggedQuestions.length;

    const toolButtons: {
        key: keyof ExamActivePopupsState;
        label: string;
        icon: typeof Calculator;
        hasData: boolean;
    }[] = [
        {
            key: "calculator",
            label: "Kalkulator",
            icon: Calculator,
            hasData: calcHistoryCount > 0,
        },
        {
            key: "notes",
            label: "Notes",
            icon: StickyNote,
            hasData: hasNotesContent,
        },
        {
            key: "excel",
            label: "Excel",
            icon: FileSpreadsheet,
            hasData: hasExcelContent,
        },
    ];

    if (!isOpen) {
        return (
            <div className="flex lg:flex-col items-center justify-between lg:justify-start gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onToggleOpen}
                    title="Buka Panel Nomor Soal"
                    className="w-full lg:w-11 lg:h-auto lg:py-3 flex lg:flex-col items-center gap-2 bg-white border rounded-xl shadow-sm hover:bg-slate-50"
                >
                    <PanelRightOpen className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 lg:[writing-mode:vertical-rl]">
                        Nomor Soal ({questionIndex.length})
                    </span>
                </Button>
                {/* Quick access to helper tools even when sidebar is collapsed */}
                <div className="flex lg:flex-col gap-1.5">
                    {toolButtons.map(({ key, label, icon: Icon, hasData }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onTogglePopup(key)}
                            title={label}
                            className={`relative p-2 rounded-lg border text-xs transition-colors ${
                                activePopups[key]
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {hasData && !activePopups[key] && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <aside className="bg-white border rounded-xl p-4 shadow-sm h-max">
            {/* Header row: Title left, 3 tool buttons + collapse toggle on the right */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b">
                <h3 className="font-semibold text-sm text-gray-800 whitespace-nowrap">
                    Nomor Soal
                </h3>
                <div className="flex items-center gap-1">
                    {toolButtons.map(({ key, label, icon: Icon, hasData }) => {
                        const isOpenTool = activePopups[key];
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onTogglePopup(key)}
                                title={label}
                                aria-label={label}
                                className={`relative inline-flex items-center justify-center h-7 w-7 rounded-md border transition-colors ${
                                    isOpenTool
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {hasData && (
                                    <span
                                        className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                                            isOpenTool ? "bg-amber-300" : "bg-emerald-500"
                                        }`}
                                    />
                                )}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={onToggleOpen}
                        title="Tutup Panel Nomor Soal"
                        aria-label="Tutup Panel Nomor Soal"
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-500 hover:text-gray-800 hover:bg-slate-100 transition-colors ml-0.5"
                    >
                        <PanelRightClose className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Question numbers grid */}
            <div className="flex flex-wrap gap-2 mb-4">
                {questionIndex.map((q, i) => {
                    const isCurrent = currentQuestionId === q.id;
                    const isFlagged = flaggedIds.includes(q.id);
                    const isAnswered =
                        answeredQuestionIds.includes(q.id) ||
                        localAnsweredIds.includes(q.id);

                    let colorClasses =
                        "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
                    if (isCurrent) {
                        colorClasses = isFlagged
                            ? "bg-blue-600 text-white border-amber-400 ring-2 ring-amber-400 font-semibold"
                            : "bg-blue-600 text-white border-blue-600 font-semibold";
                    } else if (isFlagged) {
                        colorClasses =
                            "bg-amber-400 text-amber-950 border-amber-500 hover:bg-amber-300 font-semibold";
                    } else if (isAnswered) {
                        colorClasses =
                            "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 font-medium";
                    }

                    return (
                        <button
                            key={q.id}
                            type="button"
                            onClick={() => onSelectQuestion(q.id)}
                            title={
                                isFlagged
                                    ? `Soal ${i + 1} (Ragu-ragu${isAnswered ? ", sudah dijawab" : ""})`
                                    : isAnswered
                                      ? `Soal ${i + 1} (Sudah dijawab)`
                                      : `Soal ${i + 1} (Belum dijawab)`
                            }
                            className={`relative w-8 h-8 rounded flex items-center justify-center text-sm border transition-colors ${colorClasses}`}
                        >
                            {i + 1}
                            {isFlagged && (
                                <span
                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-600 text-white flex items-center justify-center shadow"
                                    aria-hidden="true"
                                >
                                    <Flag className="h-2 w-2 fill-current" />
                                </span>
                            )}
                            {isFlagged && isAnswered && !isCurrent && (
                                <span
                                    className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-700"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-gray-200 border border-gray-300 shrink-0"></span>
                    <span>Belum Dikerjakan</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-200 border border-emerald-400 shrink-0"></span>
                    <span>Sudah Dikerjakan</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 shrink-0">
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-orange-600" />
                    </span>
                    <span>Ragu-ragu / Ditandai{flaggedCount > 0 ? ` (${flaggedCount})` : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-blue-600 shrink-0"></span>
                    <span>Nomor Soal Saat Ini</span>
                </div>
            </div>

            {flaggedCount > 0 && (
                <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900 space-y-1.5">
                    <div className="flex items-start gap-1.5 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <span>
                            Masih ada {flaggedCount} soal ragu-ragu. Hapus tanda ragu-ragu sebelum mengumpulkan ujian.
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {flaggedQuestions.map((fq) => (
                            <button
                                key={fq.id}
                                type="button"
                                onClick={() => onSelectQuestion(fq.id)}
                                className="px-1.5 py-0.5 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-semibold text-[11px] transition-colors"
                            >
                                No. {fq.number}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Button
                className={`mt-4 w-full border rounded py-2 ${
                    canSubmit ? "" : " cursor-not-allowed"
                }`}
                disabled={!canSubmit}
                onClick={onRequestSubmit}
            >
                Kumpulkan Ujian
            </Button>
            {!canSubmit && (
                <p className="text-xs text-red-600 mt-2">
                    Jawab semua soal terlebih dahulu.
                </p>
            )}
        </aside>
    );
}
