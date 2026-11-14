import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    CalculatorSessionState,
    ExamActivePopupsState,
    ExamPanelsState,
    ExcelSessionState,
    NotesSessionState,
} from "./examTypes";

const DEFAULT_CALC_STATE: CalculatorSessionState = {
    expression: "",
    display: "0",
    history: [],
};

const DEFAULT_NOTES_STATE: NotesSessionState = {
    content: "",
};

const DEFAULT_EXCEL_STATE: ExcelSessionState = {
    version: 2,
    sheets: [],
};

const DEFAULT_PANELS_STATE: ExamPanelsState = {
    leftOpen: true,
    rightOpen: true,
};

const DEFAULT_POPUPS_STATE: ExamActivePopupsState = {
    calculator: false,
    notes: false,
    excel: false,
};

function safeReadJson<T>(storage: Storage | undefined, key: string | null, fallback: T): T {
    if (!storage || !key) return fallback;
    try {
        const raw = storage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function safeWriteJson<T>(storage: Storage | undefined, key: string | null, value: T): void {
    if (!storage || !key) return;
    try {
        storage.setItem(key, JSON.stringify(value));
    } catch {}
}

/**
 * Manages per-attempt exam session tools (ragu-ragu flags, calculator+history,
 * notes, excel scratchpad) and panel/popup UI state across question navigation.
 * Data persists only in browser storage during the active attempt and resets on
 * submit, discard, or retake/remedial.
 */
export function useExamSessionTools(examScopeKey: string, attemptSignature: string) {
    const ls = typeof window !== "undefined" ? window.localStorage : undefined;
    const ss = typeof window !== "undefined" ? window.sessionStorage : undefined;

    const keys = useMemo(() => {
        const prefix = `exam_tools_${examScopeKey}`;
        const sigPrefix = `${prefix}_${attemptSignature}`;
        return {
            prefix,
            flags: `${sigPrefix}_flags`,
            calc: `${sigPrefix}_calc`,
            notes: `${sigPrefix}_notes`,
            excel: `${sigPrefix}_excel`,
            panels: `${sigPrefix}_panels`,
            popups: `${sigPrefix}_popups`,
        };
    }, [examScopeKey, attemptSignature]);

    // Purge stale caches belonging to previous attempts of the same exam
    useEffect(() => {
        if (!attemptSignature) return;
        const activeIds = new Set(Object.values(keys));
        const purgeOld = (storage?: Storage) => {
            if (!storage) return;
            try {
                const toRemove: string[] = [];
                for (let i = 0; i < storage.length; i++) {
                    const k = storage.key(i);
                    if (k && k.startsWith(`${keys.prefix}_`) && !activeIds.has(k)) {
                        toRemove.push(k);
                    }
                }
                toRemove.forEach((k) => storage.removeItem(k));
            } catch {}
        };
        purgeOld(ls);
        purgeOld(ss);
    }, [attemptSignature, keys, ls, ss]);

    const [flaggedIds, setFlaggedIds] = useState<string[]>(() =>
        safeReadJson<string[]>(ls, keys.flags, []),
    );
    const [calcState, setCalcStateState] = useState<CalculatorSessionState>(() =>
        safeReadJson<CalculatorSessionState>(ls, keys.calc, DEFAULT_CALC_STATE),
    );
    const [notesState, setNotesStateState] = useState<NotesSessionState>(() =>
        safeReadJson<NotesSessionState>(ls, keys.notes, DEFAULT_NOTES_STATE),
    );
    const [excelState, setExcelStateState] = useState<ExcelSessionState>(() =>
        safeReadJson<ExcelSessionState>(ls, keys.excel, DEFAULT_EXCEL_STATE),
    );
    const [panels, setPanels] = useState<ExamPanelsState>(() =>
        safeReadJson<ExamPanelsState>(ss, keys.panels, DEFAULT_PANELS_STATE),
    );
    const [activePopups, setActivePopups] = useState<ExamActivePopupsState>(() =>
        safeReadJson<ExamActivePopupsState>(ss, keys.popups, DEFAULT_POPUPS_STATE),
    );

    const calcRef = useRef(calcState);
    calcRef.current = calcState;
    const notesRef = useRef(notesState);
    notesRef.current = notesState;
    const excelRef = useRef(excelState);
    excelRef.current = excelState;

    const toggleFlag = useCallback(
        (questionId?: string | null) => {
            if (!questionId) return;
            setFlaggedIds((prev) => {
                const next = prev.includes(questionId)
                    ? prev.filter((id) => id !== questionId)
                    : [...prev, questionId];
                safeWriteJson(ls, keys.flags, next);
                return next;
            });
        },
        [keys.flags, ls],
    );

    const setCalcState = useCallback(
        (updater: CalculatorSessionState | ((prev: CalculatorSessionState) => CalculatorSessionState)) => {
            const next = typeof updater === "function" ? updater(calcRef.current) : updater;
            calcRef.current = next;
            safeWriteJson(ls, keys.calc, next);
            setCalcStateState(next);
        },
        [keys.calc, ls],
    );

    const setNotesState = useCallback(
        (updater: NotesSessionState | ((prev: NotesSessionState) => NotesSessionState)) => {
            const next = typeof updater === "function" ? updater(notesRef.current) : updater;
            notesRef.current = next;
            safeWriteJson(ls, keys.notes, next);
            setNotesStateState(next);
        },
        [keys.notes, ls],
    );

    const setExcelState = useCallback(
        (updater: ExcelSessionState | ((prev: ExcelSessionState) => ExcelSessionState)) => {
            const next = typeof updater === "function" ? updater(excelRef.current) : updater;
            excelRef.current = next;
            safeWriteJson(ls, keys.excel, next);
            setExcelStateState(next);
        },
        [keys.excel, ls],
    );

    const toggleLeftPanel = useCallback(() => {
        setPanels((prev) => {
            const next = { ...prev, leftOpen: !prev.leftOpen };
            safeWriteJson(ss, keys.panels, next);
            return next;
        });
    }, [keys.panels, ss]);

    const toggleRightPanel = useCallback(() => {
        setPanels((prev) => {
            const next = { ...prev, rightOpen: !prev.rightOpen };
            safeWriteJson(ss, keys.panels, next);
            return next;
        });
    }, [keys.panels, ss]);

    const togglePopup = useCallback(
        (tool: keyof ExamActivePopupsState) => {
            setActivePopups((prev) => {
                const next = { ...prev, [tool]: !prev[tool] };
                safeWriteJson(ss, keys.popups, next);
                return next;
            });
        },
        [keys.popups, ss],
    );

    const closePopup = useCallback(
        (tool: keyof ExamActivePopupsState) => {
            setActivePopups((prev) => {
                const next = { ...prev, [tool]: false };
                safeWriteJson(ss, keys.popups, next);
                return next;
            });
        },
        [keys.popups, ss],
    );

    const clearSessionTools = useCallback(() => {
        [keys.flags, keys.calc, keys.notes, keys.excel].forEach((k) => {
            try {
                ls?.removeItem(k);
            } catch {}
        });
        [keys.panels, keys.popups].forEach((k) => {
            try {
                ss?.removeItem(k);
            } catch {}
        });
    }, [keys, ls, ss]);

    return {
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
    };
}
