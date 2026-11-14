import { Head, router } from "@inertiajs/react";
import HeaderOnlyLayout from "@/Layouts/HeaderOnlyLayout";
import {
    AlarmClock,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Flag,
    Loader2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { ExamReferenceItem, QuestionIndexItem } from "./examTypes";
import { useExamSessionTools } from "./useExamSessionTools";
import ExamReferenceSidebar from "./ExamReferenceSidebar";
import ExamRightSidebar from "./ExamRightSidebar";
import ExamCalculatorPopup from "./ExamCalculatorPopup";
import ExamNotesPopup from "./ExamNotesPopup";
import ExamExcelPopup from "./ExamExcelPopup";

type QuestionOption = {
    id: string;
    option_text: string;
    is_correct: boolean;
    image_url?: string;
};

type Question = {
    id: string;
    question_text: string;
    question_type: "multiple_choice" | "true_false" | "short_answer";
    options?: QuestionOption[];
    image_url?: string;
};

export interface ExamWorkspaceProps {
    test: any;
    attemptId?: string | null;
    attemptSignature?: string | null;
    currentQuestion: Question | null;
    nextQuestionId?: string | null;
    prevQuestionId?: string | null;
    questionIndex?: QuestionIndexItem[];
    answeredQuestionIds?: string[];
    currentAnswer?: { option_id?: string | null; answer?: string | null } | null;
    deadline?: string | null;
    serverNow?: string | null;
    durationDeadline?: string | null;
    examScopeKey: string;
    backHref: string;
    getQuestionRoute: (questionId: string) => string;
    bulkAnswersRoute: string;
    submitRoute: string;
    discardRoute: string;
}

function normalizeReferences(raw: any): ExamReferenceItem[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .map((item, idx): ExamReferenceItem | null => {
            if (typeof item === "string" && item.trim()) {
                return { id: String(idx), title: `Referensi ${idx + 1}`, url: item.trim() };
            }
            if (item && typeof item === "object" && typeof item.url === "string" && item.url.trim()) {
                return {
                    id: item.id ? String(item.id) : String(idx),
                    title: typeof item.title === "string" && item.title.trim()
                        ? item.title.trim()
                        : `Referensi ${idx + 1}`,
                    url: item.url.trim(),
                };
            }
            return null;
        })
        .filter((x): x is ExamReferenceItem => Boolean(x));
}

export default function ExamWorkspace({
    test,
    attemptId,
    attemptSignature,
    currentQuestion,
    nextQuestionId,
    prevQuestionId,
    questionIndex = [],
    answeredQuestionIds = [],
    currentAnswer,
    deadline,
    serverNow,
    durationDeadline,
    examScopeKey,
    backHref,
    getQuestionRoute,
    bulkAnswersRoute,
    submitRoute,
    discardRoute,
}: ExamWorkspaceProps) {
    const total = questionIndex?.length ?? 0;

    // Allow text selection & editing inside helper popups (Calculator, Notes, Excel) and inputs
    useEffect(() => {
        const isAllowedTarget = (target: EventTarget | null) => {
            if (!(target instanceof HTMLElement)) return false;
            return Boolean(
                target.closest(
                    "input, textarea, select, [contenteditable='true'], .exam-allow-select",
                ),
            );
        };
        const prevent = (e: Event) => {
            if (isAllowedTarget(e.target)) return;
            e.preventDefault();
        };
        document.addEventListener("selectstart", prevent);
        document.addEventListener("copy", prevent);
        document.addEventListener("contextmenu", prevent);
        return () => {
            document.removeEventListener("selectstart", prevent);
            document.removeEventListener("copy", prevent);
            document.removeEventListener("contextmenu", prevent);
        };
    }, []);

    const [answersVersion, setAnswersVersion] = useState(0);

    const resolvedAttemptSignature = useMemo(() => {
        if (attemptSignature) return attemptSignature;
        if (attemptId) return attemptId;
        try {
            const sig = durationDeadline
                ? new Date(durationDeadline).getTime()
                : deadline
                  ? new Date(deadline).getTime()
                  : 0;
            return `sig_${sig}`;
        } catch {
            return "sig_0";
        }
    }, [attemptSignature, attemptId, durationDeadline, deadline]);

    const {
        flaggedIds,
        toggleFlag,
        calcState,
        setCalcState,
        notesState,
        setNotesState,
        excelState,
        setExcelState,
        panels,
        toggleLeftPanel,
        toggleRightPanel,
        activePopups,
        togglePopup,
        closePopup,
        clearSessionTools,
    } = useExamSessionTools(examScopeKey, resolvedAttemptSignature);

    // Track focus z-order among the 3 floating tool windows
    const [focusOrder, setFocusOrder] = useState<("calculator" | "notes" | "excel")[]>([
        "calculator",
        "notes",
        "excel",
    ]);
    const bringToFront = useCallback((tool: "calculator" | "notes" | "excel") => {
        setFocusOrder((prev) =>
            prev[prev.length - 1] === tool
                ? prev
                : [...prev.filter((t) => t !== tool), tool],
        );
    }, []);
    const getZIndex = (tool: "calculator" | "notes" | "excel") => {
        const idx = focusOrder.indexOf(tool);
        return 41 + (idx >= 0 ? idx : 0);
    };

    const references = useMemo(
        () =>
            normalizeReferences(
                test?.reference_link ?? test?.reference_links ?? test?.references,
            ),
        [test?.reference_link, test?.reference_links, test?.references],
    );

    const hasExcelContent = useMemo(() => {
        const sheets = excelState?.sheets;
        if (!Array.isArray(sheets)) return false;
        if (sheets.length > 1) return true;
        return sheets.some(
            (s: any) => Array.isArray(s?.celldata) && s.celldata.length > 0,
        );
    }, [excelState?.sheets]);

    const storageKey = useMemo(() => {
        if (!test?.id) return null;
        try {
            const dts = deadline ? new Date(deadline).getTime() : 0;
            return `exam_timer_${test.id}_${dts}`;
        } catch {
            return `exam_timer_${test.id}`;
        }
    }, [test?.id, deadline]);

    const computeInitial = () => {
        try {
            const d = deadline ? new Date(deadline).getTime() : 0;
            const now = serverNow ? new Date(serverNow).getTime() : Date.now();
            let secs = Math.max(0, Math.floor((d - now) / 1000));
            if (typeof window !== "undefined" && storageKey) {
                const saved = window.localStorage.getItem(storageKey);
                if (saved !== null && !Number.isNaN(Number(saved))) {
                    secs = Math.min(secs, Math.max(0, Number(saved)));
                }
            }
            return secs;
        } catch {
            return 0;
        }
    };

    const [remaining] = useState<number>(computeInitial());
    const deadlineTs = useMemo(() => {
        try {
            return deadline ? new Date(deadline).getTime() : 0;
        } catch {
            return 0;
        }
    }, [deadline]);

    const durationDeadlineTs = useMemo(() => {
        try {
            return durationDeadline ? new Date(durationDeadline).getTime() : 0;
        } catch {
            return 0;
        }
    }, [durationDeadline]);

    const hasSubmittedRef = useRef(false);

    const durationMinutes = useMemo(() => {
        const d = Number(test?.duration ?? 0);
        return Number.isFinite(d) ? d : 0;
    }, [test?.duration]);

    const headerStorageKey = useMemo(() => {
        if (!test?.id) return null;
        try {
            const ddts = durationDeadline
                ? new Date(durationDeadline).getTime()
                : 0;
            return `exam_header_${test.id}_${ddts || `d${durationMinutes}`}`;
        } catch {
            return `exam_header_${test.id}`;
        }
    }, [test?.id, durationDeadline, durationMinutes]);

    const computeHeaderInitial = () => {
        const base = Math.max(0, durationMinutes * 60);
        if (!headerStorageKey) return base;
        try {
            const saved = window.localStorage.getItem(headerStorageKey);
            if (saved !== null) {
                const v = Number(saved);
                if (!Number.isNaN(v) && v >= 0) return v;
            }
        } catch {}
        return base;
    };

    const [headerRemaining, setHeaderRemaining] = useState<number>(computeHeaderInitial);

    useEffect(() => {
        if (durationMinutes <= 0) return;
        const id = window.setInterval(() => {
            setHeaderRemaining((p) => {
                const next = Math.max(0, p - 1);
                if (headerStorageKey) {
                    try {
                        window.localStorage.setItem(headerStorageKey, String(next));
                    } catch {}
                }
                return next;
            });
        }, 1000);
        return () => window.clearInterval(id);
    }, [durationMinutes, headerStorageKey]);

    // ================= Local-only answer persistence =================
    const answersStorageKey = useMemo(() => {
        if (!test?.id) return null;
        try {
            const sig = durationDeadline
                ? new Date(durationDeadline).getTime()
                : deadline
                  ? new Date(deadline).getTime()
                  : 0;
            return `exam_answers_${test.id}_${sig}`;
        } catch {
            return `exam_answers_${test?.id}`;
        }
    }, [test?.id, durationDeadline, deadline]);

    const saveAnswerLocalOnly = (
        questionId: string,
        payload: { option_id?: string; answer?: string },
    ) => {
        if (!answersStorageKey || !questionId) return;
        try {
            const raw = window.localStorage.getItem(answersStorageKey);
            const store = raw ? JSON.parse(raw) : {};
            store[questionId] = { ...payload, savedAt: new Date().toISOString() };
            window.localStorage.setItem(answersStorageKey, JSON.stringify(store));
        } catch {}
    };

    const getAnswerLocal = (questionId?: string): any => {
        if (!answersStorageKey) return questionId ? null : {};
        try {
            const raw = window.localStorage.getItem(answersStorageKey);
            const store = raw ? JSON.parse(raw) : {};
            return questionId ? store?.[questionId] ?? null : store;
        } catch {
            return questionId ? null : {};
        }
    };

    const clearLocalAnswers = () => {
        if (answersStorageKey) {
            try {
                window.localStorage.removeItem(answersStorageKey);
            } catch {}
        }
        try {
            clearSessionTools();
        } catch {}
    };

    const saveShortAnswerIfNeeded = () => {
        if (currentQuestion?.question_type === "short_answer") {
            const el = document.querySelector(
                `textarea[name="q_${currentQuestion.id}"]`,
            ) as HTMLTextAreaElement | null;
            if (el) {
                const val = el.value ?? "";
                try {
                    saveAnswerLocalOnly(currentQuestion.id, { answer: val });
                    setAnswersVersion((v) => v + 1);
                } catch {}
            }
        }
    };

    const flushLocalAnswers = async (): Promise<number> => {
        const all = getAnswerLocal();
        if (!all || typeof all !== "object") return 0;
        const entries = Object.entries(all as Record<string, any>);
        if (!entries.length) return 0;
        const answers = entries.map(([qid, payload]) => ({ question_id: qid, ...payload }));

        return new Promise<number>((resolve) => {
            let resolved = false;
            router.post(
                bulkAnswersRoute,
                { answers, current: currentQuestion?.id },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onSuccess: () => {
                        try {
                            const flushSavedCount = (window as any)?.Inertia?.page?.props
                                ?.flushSavedCount;
                            if (typeof flushSavedCount === "number") {
                                resolved = true;
                                resolve(flushSavedCount);
                                return;
                            }
                        } catch {}
                        resolved = true;
                        resolve(answers.length);
                    },
                    onError: (errors) => {
                        console.warn("Bulk save error via Inertia", errors);
                        resolved = true;
                        resolve(0);
                    },
                    onFinish: () => {
                        if (!resolved) resolve(answers.length);
                    },
                },
            );
        });
    };

    const executeAutoSubmit = async () => {
        try {
            if (storageKey) window.localStorage.removeItem(storageKey);
        } catch {}
        try {
            if (headerStorageKey) window.localStorage.removeItem(headerStorageKey);
        } catch {}
        try {
            saveShortAnswerIfNeeded();
            await flushLocalAnswers();
        } catch {}
        try {
            clearLocalAnswers();
        } catch {}
        router.post(submitRoute);
    };

    useEffect(() => {
        const id = window.setInterval(async () => {
            const now = Date.now();
            if (deadlineTs && now >= deadlineTs && !hasSubmittedRef.current) {
                hasSubmittedRef.current = true;
                await executeAutoSubmit();
            }
        }, 2000);
        return () => window.clearInterval(id);
    }, [deadlineTs, storageKey, durationDeadlineTs]);

    useEffect(() => {
        if (deadlineTs > 0 && remaining === 0 && !hasSubmittedRef.current) {
            hasSubmittedRef.current = true;
            void executeAutoSubmit();
        }
    }, [deadlineTs, remaining, storageKey, test?.id]);

    useEffect(() => {
        if (
            durationMinutes > 0 &&
            headerRemaining === 0 &&
            !hasSubmittedRef.current
        ) {
            hasSubmittedRef.current = true;
            void executeAutoSubmit();
        }
    }, [headerRemaining, durationMinutes, headerStorageKey, storageKey, test?.id]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const gotoQuestion = (qid: string | null | undefined) => {
        if (!qid) return;
        saveShortAnswerIfNeeded();
        router.visit(getQuestionRoute(qid));
    };

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const localAnsweredIds = useMemo(() => {
        const all = getAnswerLocal();
        if (!all || typeof all !== "object") return [] as string[];
        return Object.entries(all as Record<string, any>)
            .filter(
                ([_, v]) =>
                    v &&
                    (v.option_id ||
                        (typeof v.answer === "string" && v.answer.trim() !== "")),
            )
            .map(([qid]) => String(qid));
    }, [answersStorageKey, answersVersion]);

    const combinedAnsweredCount = useMemo(() => {
        const set = new Set<string>([...answeredQuestionIds, ...localAnsweredIds]);
        return set.size;
    }, [answeredQuestionIds, localAnsweredIds]);

    const canSubmit = total > 0 && combinedAnsweredCount >= total;

    const effectiveAnswer = useMemo(() => {
        if (!currentQuestion?.id) return {} as any;
        const local = getAnswerLocal(currentQuestion.id);
        return {
            option_id:
                (local && local.option_id) ||
                (currentAnswer && currentAnswer.option_id) ||
                null,
            answer:
                (local && local.answer) ||
                (currentAnswer && currentAnswer.answer) ||
                "",
        } as any;
    }, [
        answersStorageKey,
        answersVersion,
        currentQuestion?.id,
        currentAnswer?.option_id,
        currentAnswer?.answer,
    ]);

    const currentNumber =
        (questionIndex?.findIndex((q) => q.id === currentQuestion?.id) ?? 0) + 1;
    const isCurrentFlagged = currentQuestion?.id
        ? flaggedIds.includes(currentQuestion.id)
        : false;

    const flaggedQuestionsList = useMemo(() => {
        return questionIndex
            .map((q, idx) => ({ id: q.id, number: idx + 1 }))
            .filter((item) => flaggedIds.includes(item.id));
    }, [questionIndex, flaggedIds]);

    // Dynamic 3-column template on large screens: left (Referensi), center (Soal), right (Nomor Soal)
    const gridColumnsClass = useMemo(() => {
        if (panels.leftOpen && panels.rightOpen) {
            return "lg:grid-cols-[250px_minmax(0,1fr)_310px]";
        }
        if (!panels.leftOpen && panels.rightOpen) {
            return "lg:grid-cols-[44px_minmax(0,1fr)_310px]";
        }
        if (panels.leftOpen && !panels.rightOpen) {
            return "lg:grid-cols-[250px_minmax(0,1fr)_52px]";
        }
        return "lg:grid-cols-[44px_minmax(0,1fr)_52px]";
    }, [panels.leftOpen, panels.rightOpen]);

    return (
        <>
            <HeaderOnlyLayout
                centerTitle
                wide
                title={<span className="font-semibold">{test?.title ?? "Ujian"}</span>}
                right={
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm rounded-full border px-2.5 py-0.5 bg-white">
                            <AlarmClock size={14} className="text-amber-600" />
                            <span>
                                {durationMinutes > 0
                                    ? formatTime(headerRemaining)
                                    : "0:00"}
                            </span>
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {combinedAnsweredCount}/{total} dikerjakan
                        </span>
                        <div className="hidden md:block w-28 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-2 bg-green-400 transition-all"
                                style={{
                                    width: total
                                        ? `${Math.round(
                                              (combinedAnsweredCount / total) * 100,
                                          )}%`
                                        : "0%",
                                }}
                            />
                        </div>
                    </div>
                }
                onBack={() => setConfirmOpen(true)}
                backHref={backHref}
            >
                <Head title={`Ujian - ${test?.title ?? "Ujian"}`} />
                <div className="py-4 mx-auto px-4 bg-slate-50/40 min-h-[calc(100vh-4rem)] select-none">
                    <div
                        className={`max-w-[1600px] mx-auto grid grid-cols-1 gap-4 items-start ${gridColumnsClass}`}
                    >
                        {/* KIRI: Panel Referensi Google Drive */}
                        <ExamReferenceSidebar
                            references={references}
                            isOpen={panels.leftOpen}
                            onToggleOpen={toggleLeftPanel}
                        />

                        {/* TENGAH: Soal dan Jawaban (Paling Besar) */}
                        <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm min-w-0">
                            {currentQuestion ? (
                                <div>
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Soal No. {currentNumber}
                                            </h2>
                                            {isCurrentFlagged && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                                                    <Flag className="h-3 w-3 fill-amber-500 text-amber-700" />
                                                    Ragu-ragu
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => toggleFlag(currentQuestion.id)}
                                            className={`gap-1.5 transition-colors ${
                                                isCurrentFlagged
                                                    ? "bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 font-semibold shadow-sm"
                                                    : "border-amber-300 text-amber-800 hover:bg-amber-50"
                                            }`}
                                        >
                                            <Flag
                                                className={`h-3.5 w-3.5 ${
                                                    isCurrentFlagged ? "fill-current" : ""
                                                }`}
                                            />
                                            <span>
                                                {isCurrentFlagged
                                                    ? "Ditandai Ragu-ragu"
                                                    : "Tandai Soal / Ragu-ragu"}
                                            </span>
                                        </Button>
                                    </div>

                                    <p className="mb-3 font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                                        {currentQuestion.question_text}
                                    </p>

                                    {currentQuestion.image_url && (
                                        <div className="mb-4">
                                            <img
                                                src={`/storage/${currentQuestion.image_url}`}
                                                alt="Gambar soal"
                                                className="max-h-72 rounded-lg border object-contain"
                                            />
                                        </div>
                                    )}

                                    {(currentQuestion.question_type === "multiple_choice" ||
                                        currentQuestion.question_type === "true_false") &&
                                        currentQuestion.options && (
                                            <div className="space-y-3 mt-3">
                                                {currentQuestion.options.map((opt) => (
                                                    <label
                                                        key={opt.id}
                                                        className={`flex items-start gap-2.5 p-3 border rounded-xl cursor-pointer transition-colors ${
                                                            effectiveAnswer?.option_id === opt.id
                                                                ? "bg-blue-50/70 border-blue-400"
                                                                : "hover:bg-gray-50 border-gray-200"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q_${currentQuestion.id}`}
                                                            className="h-4 w-4 mt-0.5 cursor-pointer"
                                                            checked={
                                                                effectiveAnswer?.option_id ===
                                                                opt.id
                                                            }
                                                            onChange={() => {
                                                                try {
                                                                    saveAnswerLocalOnly(
                                                                        currentQuestion.id,
                                                                        { option_id: opt.id },
                                                                    );
                                                                    setAnswersVersion(
                                                                        (v) => v + 1,
                                                                    );
                                                                } catch {}
                                                            }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-gray-800 whitespace-pre-line">
                                                                {opt.option_text}
                                                            </span>
                                                            {opt.image_url && (
                                                                <div className="mt-2">
                                                                    <img
                                                                        src={`/storage/${opt.image_url}`}
                                                                        alt={`Gambar opsi ${opt.option_text}`}
                                                                        className="max-h-48 rounded-lg border"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                    {currentQuestion.question_type === "short_answer" && (
                                        <textarea
                                            key={currentQuestion.id}
                                            className="exam-allow-select w-full border rounded-lg p-3 select-text focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                            rows={4}
                                            placeholder="Tulis jawaban Anda"
                                            defaultValue={effectiveAnswer?.answer}
                                            name={`q_${currentQuestion.id}`}
                                            onContextMenu={(e) => e.stopPropagation()}
                                            onBlur={(e) => {
                                                const val = e.currentTarget.value;
                                                try {
                                                    saveAnswerLocalOnly(currentQuestion.id, {
                                                        answer: val,
                                                    });
                                                    setAnswersVersion((v) => v + 1);
                                                } catch {}
                                            }}
                                        />
                                    )}

                                    {/* Bottom nav */}
                                    <div className="mt-6 pt-4 border-t flex items-center justify-between gap-2">
                                        <Button
                                            disabled={!prevQuestionId}
                                            onClick={() => gotoQuestion(prevQuestionId)}
                                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="inline-block mr-1" size={16} />{" "}
                                            Sebelumnya
                                        </Button>

                                        {nextQuestionId ? (
                                            <Button onClick={() => gotoQuestion(nextQuestionId)}>
                                                Selanjutnya{" "}
                                                <ChevronRight
                                                    className="inline-block ml-1"
                                                    size={16}
                                                />
                                            </Button>
                                        ) : (
                                            <Button
                                                disabled={!canSubmit}
                                                onClick={() => setSubmitOpen(true)}
                                                className={!canSubmit ? "cursor-not-allowed" : ""}
                                            >
                                                Kumpulkan Ujian
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">Belum ada soal yang tersedia.</p>
                            )}
                        </div>

                        {/* KANAN: Nomor Soal + 3 Tombol Alat Bantu (Kalkulator, Notes, Excel) */}
                        <ExamRightSidebar
                            isOpen={panels.rightOpen}
                            onToggleOpen={toggleRightPanel}
                            questionIndex={questionIndex}
                            currentQuestionId={currentQuestion?.id}
                            answeredQuestionIds={answeredQuestionIds}
                            localAnsweredIds={localAnsweredIds}
                            flaggedIds={flaggedIds}
                            canSubmit={canSubmit}
                            onSelectQuestion={gotoQuestion}
                            onRequestSubmit={() => setSubmitOpen(true)}
                            activePopups={activePopups}
                            onTogglePopup={(tool) => {
                                togglePopup(tool);
                                bringToFront(tool);
                            }}
                            hasNotesContent={notesState.content.trim().length > 0}
                            hasExcelContent={hasExcelContent}
                            calcHistoryCount={calcState.history?.length ?? 0}
                        />
                    </div>
                </div>
            </HeaderOnlyLayout>

            {/* Floating Popups: Kalkulator (+ History), Notes, Excel */}
            <ExamCalculatorPopup
                open={activePopups.calculator}
                onClose={() => closePopup("calculator")}
                state={calcState}
                onChange={setCalcState}
                zIndex={getZIndex("calculator")}
                onFocus={() => bringToFront("calculator")}
            />
            <ExamNotesPopup
                open={activePopups.notes}
                onClose={() => closePopup("notes")}
                state={notesState}
                onChange={setNotesState}
                zIndex={getZIndex("notes")}
                onFocus={() => bringToFront("notes")}
            />
            <ExamExcelPopup
                open={activePopups.excel}
                onClose={() => closePopup("excel")}
                state={excelState}
                onChange={setExcelState}
                examTitle={test?.title}
                zIndex={getZIndex("excel")}
                onFocus={() => bringToFront("excel")}
            />

            {/* Confirm leave dialog */}
            <AlertDialog open={confirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Keluar dari Ujian?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Jawaban tidak akan dikirim ke database dan waktu ujian serta alat
                            bantu sesi akan direset. Lanjutkan?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    saveShortAnswerIfNeeded();
                                } catch {}
                                try {
                                    if (storageKey) window.localStorage.removeItem(storageKey);
                                } catch {}
                                try {
                                    if (headerStorageKey)
                                        window.localStorage.removeItem(headerStorageKey);
                                } catch {}
                                try {
                                    clearLocalAnswers();
                                } catch {}
                                setConfirmOpen(false);
                                router.post(discardRoute);
                            }}
                        >
                            Ya, Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm submit dialog (blocks submission if Ragu-ragu flags remain) */}
            <AlertDialog open={submitOpen}>
                <AlertDialogContent>
                    {flaggedQuestionsList.length > 0 ? (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-amber-800">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                                    <span>Masih Ada Soal Ragu-ragu</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription asChild>
                                    <div className="space-y-3 text-sm text-slate-600">
                                        <p>
                                            Anda masih menandai{" "}
                                            <strong>
                                                {flaggedQuestionsList.length} soal
                                            </strong>{" "}
                                            sebagai <strong>Ragu-ragu</strong>.
                                            Ujian belum dapat dikumpulkan sampai
                                            semua tanda ragu-ragu dihapus.
                                        </p>
                                        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 space-y-2">
                                            <p className="text-xs font-semibold text-amber-900">
                                                Klik nomor soal di bawah untuk langsung memeriksa dan menghapus tanda ragu-ragu:
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {flaggedQuestionsList.map((fq) => (
                                                    <Button
                                                        key={fq.id}
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSubmitOpen(false);
                                                            gotoQuestion(fq.id);
                                                        }}
                                                        className="h-7 px-2.5 bg-amber-200/80 hover:bg-amber-300 border-amber-400 text-amber-950 font-semibold text-xs"
                                                    >
                                                        Soal No. {fq.number}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => setSubmitOpen(false)}
                                >
                                    Tutup
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                    onClick={() => {
                                        const first = flaggedQuestionsList[0];
                                        setSubmitOpen(false);
                                        if (first) gotoQuestion(first.id);
                                    }}
                                >
                                    Periksa Soal No.{" "}
                                    {flaggedQuestionsList[0]?.number}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    ) : (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Kumpulkan Ujian?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Pastikan semua soal sudah dijawab. Anda tidak
                                    dapat mengubah jawaban setelah dikumpulkan.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => setSubmitOpen(false)}
                                >
                                    Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={submitting}
                                    onClick={async () => {
                                        if (submitting) return;
                                        setSubmitting(true);
                                        try {
                                            try {
                                                saveShortAnswerIfNeeded();
                                            } catch {}
                                            try {
                                                if (storageKey)
                                                    window.localStorage.removeItem(
                                                        storageKey,
                                                    );
                                            } catch {}
                                            try {
                                                if (headerStorageKey)
                                                    window.localStorage.removeItem(
                                                        headerStorageKey,
                                                    );
                                            } catch {}
                                            try {
                                                await flushLocalAnswers();
                                            } catch (e) {
                                                console.warn("Flush error", e);
                                            }
                                            try {
                                                clearLocalAnswers();
                                            } catch {}
                                            setSubmitOpen(false);
                                            router.post(submitRoute);
                                        } catch (e) {
                                            console.error(
                                                "Submit sequence error",
                                                e,
                                            );
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Mengumpulkan...
                                        </span>
                                    ) : (
                                        "Ya, Kumpulkan"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
