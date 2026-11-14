import "@fortune-sheet/react/dist/index.css";
import "./fortuneSheetOverrides.css";

import { api, Sheet } from "@fortune-sheet/core";
import { Workbook, WorkbookInstance } from "@fortune-sheet/react";
import { Download, FileSpreadsheet, RotateCcw } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import FloatingToolWindow from "./FloatingToolWindow";
import { ExcelSessionState } from "./examTypes";

interface ExamExcelPopupProps {
    open: boolean;
    onClose: () => void;
    state: ExcelSessionState;
    onChange: (
        updater: ExcelSessionState | ((prev: ExcelSessionState) => ExcelSessionState),
    ) => void;
    examTitle?: string;
    zIndex?: number;
    onFocus?: () => void;
}

function createBlankSheets(): Sheet[] {
    return [
        {
            id: "sheet_1",
            name: "Kertas Kerja",
            order: 0,
            status: 1,
            row: 60,
            column: 26,
            defaultRowHeight: 22,
            defaultColWidth: 90,
            celldata: [],
        },
    ];
}

function buildInitialSheets(state: ExcelSessionState): Sheet[] {
    if (Array.isArray(state?.sheets) && state.sheets.length > 0) {
        let hasActive = false;
        const normalized: Sheet[] = state.sheets.map((s: any, idx: number) => {
            const isActive = Number(s?.status) === 1;
            if (isActive) hasActive = true;
            const celldata = Array.isArray(s?.celldata)
                ? s.celldata
                : Array.isArray(s?.data)
                  ? api.dataToCelldata(s.data)
                  : [];

            return {
                id: s?.id || `sheet_${idx + 1}`,
                name: s?.name || `Sheet${idx + 1}`,
                order: typeof s?.order === "number" ? s.order : idx,
                status: isActive ? 1 : 0,
                hide: s?.hide,
                row: typeof s?.row === "number" ? Math.max(s.row, 40) : 60,
                column: typeof s?.column === "number" ? Math.max(s.column, 20) : 26,
                defaultRowHeight: s?.defaultRowHeight ?? 22,
                defaultColWidth: s?.defaultColWidth ?? 90,
                showGridLines: s?.showGridLines ?? true,
                frozen: s?.frozen,
                config: s?.config,
                calcChain: s?.calcChain,
                zoomRatio: s?.zoomRatio,
                celldata,
            };
        });

        if (!hasActive && normalized[0]) {
            normalized[0].status = 1;
        }
        return normalized;
    }

    return createBlankSheets();
}

function serializeSheetsForSession(sheets: Sheet[]): Sheet[] {
    return sheets.map((s, idx) => ({
        id: s.id || `sheet_${idx + 1}`,
        name: s.name || `Sheet${idx + 1}`,
        order: typeof s.order === "number" ? s.order : idx,
        status: typeof s.status === "number" ? s.status : idx === 0 ? 1 : 0,
        hide: s.hide,
        row: s.row ?? (s.data?.length || 60),
        column: s.column ?? (s.data?.[0]?.length || 26),
        defaultRowHeight: s.defaultRowHeight ?? 22,
        defaultColWidth: s.defaultColWidth ?? 90,
        showGridLines: s.showGridLines,
        frozen: s.frozen,
        config: s.config,
        calcChain: s.calcChain,
        zoomRatio: s.zoomRatio,
        celldata: Array.isArray(s.data) ? api.dataToCelldata(s.data) : s.celldata || [],
    }));
}

interface FortuneWorkbookSurfaceProps {
    initialState: ExcelSessionState;
    onPersistRef: React.MutableRefObject<(next: ExcelSessionState) => void>;
    workbookRef: React.MutableRefObject<WorkbookInstance | null>;
    skipFlushOnUnmountRef: React.MutableRefObject<boolean>;
}

/**
 * Isolated inner workbook wrapper that initializes FortuneSheet once per mount
 * so reactive session writes never trigger controlled re-render/focus loops.
 */
const FortuneWorkbookSurface = memo(
    function FortuneWorkbookSurface({
        initialState,
        onPersistRef,
        workbookRef,
        skipFlushOnUnmountRef,
    }: FortuneWorkbookSurfaceProps) {
        const [initialSheets] = useState<Sheet[]>(() => buildInitialSheets(initialState));
        const wrapperRef = useRef<HTMLDivElement | null>(null);
        const latestSheetsRef = useRef<Sheet[] | null>(null);
        const dirtyRef = useRef(false);
        const debounceRef = useRef<number | null>(null);
        const bypassTabRef = useRef(false);

        const flushSaveNow = useCallback(() => {
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
            if (skipFlushOnUnmountRef.current || !dirtyRef.current || !latestSheetsRef.current) {
                return;
            }
            dirtyRef.current = false;
            try {
                onPersistRef.current({
                    version: 2,
                    sheets: serializeSheetsForSession(latestSheetsRef.current),
                    updatedAt: new Date().toISOString(),
                });
            } catch {}
        }, [onPersistRef, skipFlushOnUnmountRef]);

        const handleChange = useCallback(
            (sheets: Sheet[]) => {
                latestSheetsRef.current = sheets;
                dirtyRef.current = true;
                if (debounceRef.current !== null) {
                    window.clearTimeout(debounceRef.current);
                }
                debounceRef.current = window.setTimeout(() => {
                    debounceRef.current = null;
                    if (!dirtyRef.current || !latestSheetsRef.current) return;
                    dirtyRef.current = false;
                    try {
                        onPersistRef.current({
                            version: 2,
                            sheets: serializeSheetsForSession(latestSheetsRef.current),
                            updatedAt: new Date().toISOString(),
                        });
                    } catch {}
                }, 200);
            },
            [onPersistRef],
        );

        // Support Tab / Shift+Tab while editing a cell: commit value and move right/left
        useEffect(() => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            const onKeyDownCapture = (e: KeyboardEvent) => {
                if (
                    e.key !== "Tab" ||
                    e.ctrlKey ||
                    e.metaKey ||
                    e.altKey ||
                    bypassTabRef.current
                ) {
                    return;
                }

                const target = e.target as HTMLElement | null;
                if (!target) return;

                const isCellEditor = target.id === "luckysheet-rich-text-editor";
                const isFxEditor = target.id === "luckysheet-functionbox-cell";
                if (!isCellEditor && !isFxEditor) return;

                const inputBox = wrapper.querySelector(
                    ".luckysheet-input-box",
                ) as HTMLElement | null;
                const isEditing =
                    Number(inputBox?.style.zIndex ?? -1) > 0 || isFxEditor;
                if (!isEditing) return;

                // Preserve Tab formula autocomplete when an active suggestion exists
                if (isCellEditor && !e.shiftKey) {
                    const searchBox = wrapper.querySelector(
                        "#luckysheet-formula-search-c",
                    ) as HTMLElement | null;
                    const hasActiveFormulaCandidate = Boolean(
                        searchBox &&
                            searchBox.offsetParent !== null &&
                            searchBox.querySelector(".luckysheet-formula-search-item-active"),
                    );
                    if (hasActiveFormulaCandidate) {
                        return;
                    }
                }

                e.preventDefault();
                e.stopPropagation();

                const wb = workbookRef.current;
                const sel = wb?.getSelection()?.[0] as
                    | {
                          row?: number[];
                          column?: number[];
                          row_focus?: number;
                          column_focus?: number;
                      }
                    | undefined;
                const curRow = sel?.row_focus ?? sel?.row?.[0] ?? 0;
                const curCol = sel?.column_focus ?? sel?.column?.[0] ?? 0;
                const shiftKey = e.shiftKey;

                // Commit current cell edit through FortuneSheet's native Enter flow
                target.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                    }),
                );

                // Restore original row selection then move right/left via native Tab
                window.setTimeout(() => {
                    try {
                        wb?.setSelection([{ row: [curRow, curRow], column: [curCol, curCol] }]);
                    } catch {}

                    window.setTimeout(() => {
                        const focusEl =
                            (wrapper.querySelector(
                                "#luckysheet-rich-text-editor",
                            ) as HTMLElement | null) ||
                            (wrapper.querySelector(
                                ".fortune-sheet-overlay",
                            ) as HTMLElement | null);
                        if (!focusEl) return;
                        focusEl.focus();
                        bypassTabRef.current = true;
                        try {
                            focusEl.dispatchEvent(
                                new KeyboardEvent("keydown", {
                                    key: "Tab",
                                    code: "Tab",
                                    keyCode: 9,
                                    which: 9,
                                    shiftKey,
                                    bubbles: true,
                                    cancelable: true,
                                }),
                            );
                        } finally {
                            bypassTabRef.current = false;
                        }
                    }, 0);
                }, 0);
            };

            wrapper.addEventListener("keydown", onKeyDownCapture, true);
            return () => {
                wrapper.removeEventListener("keydown", onKeyDownCapture, true);
            };
        }, [workbookRef]);

        // Trigger canvas resize whenever popup container changes size (e.g. Expand/Minimize)
        useEffect(() => {
            const el = wrapperRef.current;
            if (!el || typeof ResizeObserver === "undefined") return;
            let raf = 0;
            const ro = new ResizeObserver(() => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    window.dispatchEvent(new Event("resize"));
                });
            });
            ro.observe(el);
            return () => {
                cancelAnimationFrame(raf);
                ro.disconnect();
            };
        }, []);

        // Flush unsaved edits immediately on popup close, question switch, or page unload
        useEffect(() => {
            const onUnload = () => flushSaveNow();
            window.addEventListener("beforeunload", onUnload);
            window.addEventListener("pagehide", onUnload);
            return () => {
                window.removeEventListener("beforeunload", onUnload);
                window.removeEventListener("pagehide", onUnload);
                flushSaveNow();
            };
        }, [flushSaveNow]);

        return (
            <div ref={wrapperRef} className="exam-fortune-wrapper">
                <Workbook
                    ref={workbookRef}
                    data={initialSheets}
                    onChange={handleChange}
                    lang="en"
                    currency="Rp"
                    allowEdit={true}
                    showToolbar={true}
                    showFormulaBar={true}
                    showSheetTabs={true}
                    row={60}
                    column={26}
                    defaultRowHeight={22}
                    defaultColWidth={90}
                />
            </div>
        );
    },
    (prev, next) =>
        prev.workbookRef === next.workbookRef &&
        prev.skipFlushOnUnmountRef === next.skipFlushOnUnmountRef &&
        prev.onPersistRef === next.onPersistRef,
);

export default function ExamExcelPopup({
    open,
    onClose,
    state,
    onChange,
    examTitle = "Kertas-Kerja-Ujian",
    zIndex,
    onFocus,
}: ExamExcelPopupProps) {
    const workbookRef = useRef<WorkbookInstance | null>(null);
    const skipFlushOnUnmountRef = useRef(false);
    const [resetCounter, setResetCounter] = useState(0);
    const [confirmReset, setConfirmReset] = useState(false);
    const onPersistRef = useRef<(next: ExcelSessionState) => void>((next) => {
        onChange(next);
    });
    onPersistRef.current = onChange;

    const handleExportXlsx = () => {
        try {
            const activeSheets = workbookRef.current?.getAllSheets() ?? buildInitialSheets(state);
            const wb = XLSX.utils.book_new();

            activeSheets.forEach((sheet, idx) => {
                const ws: XLSX.WorkSheet = {};
                let maxR = 0;
                let maxC = 0;
                let hasCell = false;

                if (Array.isArray(sheet.data)) {
                    sheet.data.forEach((rowArr, r) => {
                        if (!Array.isArray(rowArr)) return;
                        rowArr.forEach((cell, c) => {
                            if (!cell) return;
                            const val = cell.v ?? cell.m;
                            const formula =
                                typeof cell.f === "string" && cell.f.startsWith("=")
                                    ? cell.f.slice(1)
                                    : undefined;
                            if ((val === undefined || val === null || val === "") && !formula) {
                                return;
                            }
                            hasCell = true;
                            maxR = Math.max(maxR, r);
                            maxC = Math.max(maxC, c);
                            const addr = XLSX.utils.encode_cell({ r, c });

                            if (typeof cell.v === "number") {
                                ws[addr] = { t: "n", v: cell.v, ...(formula ? { f: formula } : {}) };
                            } else if (typeof cell.v === "boolean") {
                                ws[addr] = { t: "b", v: cell.v, ...(formula ? { f: formula } : {}) };
                            } else {
                                ws[addr] = {
                                    t: "s",
                                    v: String(val ?? ""),
                                    ...(formula ? { f: formula } : {}) ,
                                };
                            }
                        });
                    });
                } else if (Array.isArray(sheet.celldata)) {
                    sheet.celldata.forEach((item) => {
                        if (!item?.v) return;
                        const cell = item.v;
                        const val = cell.v ?? cell.m;
                        const formula =
                            typeof cell.f === "string" && cell.f.startsWith("=")
                                ? cell.f.slice(1)
                                : undefined;
                        if ((val === undefined || val === null || val === "") && !formula) {
                            return;
                        }
                        hasCell = true;
                        maxR = Math.max(maxR, item.r);
                        maxC = Math.max(maxC, item.c);
                        const addr = XLSX.utils.encode_cell({ r: item.r, c: item.c });
                        if (typeof cell.v === "number") {
                            ws[addr] = { t: "n", v: cell.v, ...(formula ? { f: formula } : {}) };
                        } else if (typeof cell.v === "boolean") {
                            ws[addr] = { t: "b", v: cell.v, ...(formula ? { f: formula } : {}) };
                        } else {
                            ws[addr] = {
                                t: "s",
                                v: String(val ?? ""),
                                ...(formula ? { f: formula } : {}),
                            };
                        }
                    });
                }

                ws["!ref"] = hasCell
                    ? XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxR, c: maxC } })
                    : "A1";
                const safeSheetName =
                    (sheet.name || `Sheet${idx + 1}`).replace(/[\\/?*[\]:]/g, "_").slice(0, 31) ||
                    `Sheet${idx + 1}`;
                XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
            });

            const safeFile =
                examTitle.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 40) || "kertas-kerja";
            XLSX.writeFile(wb, `${safeFile}.xlsx`);
            toast.success("Kertas kerja berhasil diunduh (.xlsx)");
        } catch (err) {
            console.error("Export xlsx error", err);
            toast.error("Gagal mengekspor file .xlsx");
        }
    };

    const handleResetSheet = () => {
        if (!confirmReset) {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 3000);
            return;
        }
        skipFlushOnUnmountRef.current = true;
        onChange({
            version: 2,
            sheets: createBlankSheets(),
            updatedAt: new Date().toISOString(),
        });
        setResetCounter((c) => c + 1);
        setConfirmReset(false);
        setTimeout(() => {
            skipFlushOnUnmountRef.current = false;
        }, 50);
    };

    return (
        <FloatingToolWindow
            open={open}
            onClose={onClose}
            title="Excel / Kertas Kerja Ujian"
            icon={<FileSpreadsheet className="h-4 w-4 text-emerald-300 shrink-0" />}
            defaultPosition={{ x: 60, y: 80 }}
            defaultWidth={920}
            defaultHeight={560}
            zIndex={zIndex}
            onFocus={onFocus}
            headerExtra={
                <div className="flex items-center gap-1 mr-1">
                    <button
                        type="button"
                        onClick={handleExportXlsx}
                        title="Unduh kertas kerja sebagai file .xlsx"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
                    >
                        <Download className="h-3 w-3" />
                        <span>.xlsx</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleResetSheet}
                        title="Bersihkan seluruh isi Excel sesi ini"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            confirmReset
                                ? "bg-rose-600 text-white"
                                : "bg-slate-700 hover:bg-rose-600 text-slate-100"
                        }`}
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>{confirmReset ? "Yakin Reset?" : "Reset"}</span>
                    </button>
                </div>
            }
        >
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 min-h-0 relative bg-white">
                    <FortuneWorkbookSurface
                        key={resetCounter}
                        initialState={state}
                        onPersistRef={onPersistRef}
                        workbookRef={workbookRef}
                        skipFlushOnUnmountRef={skipFlushOnUnmountRef}
                    />
                </div>
                <div className="px-3 py-1 border-t bg-slate-50 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <span>
                        Tips rumus: ketik <code className="font-mono text-slate-700">=SUM(</code> lalu klik/tarik langsung sel yang diinginkan, akhiri{" "}
                        <code className="font-mono text-slate-700">Enter</code>.
                    </span>
                    <span>Aktif selama sesi ujian ini saja (otomatis reset setelah selesai/remidi)</span>
                </div>
            </div>
        </FloatingToolWindow>
    );
}
