import { Calculator, Copy, Delete, History, Trash2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import FloatingToolWindow from "./FloatingToolWindow";
import { CalcHistoryItem, CalculatorSessionState } from "./examTypes";
import { evaluateMathExpression, formatIndonesianNumber } from "./formulaEngine";

interface ExamCalculatorPopupProps {
    open: boolean;
    onClose: () => void;
    state: CalculatorSessionState;
    onChange: (
        updater: CalculatorSessionState | ((prev: CalculatorSessionState) => CalculatorSessionState),
    ) => void;
    zIndex?: number;
    onFocus?: () => void;
}

const OPERATORS = ["+", "-", "×", "÷"];

export default function ExamCalculatorPopup({
    open,
    onClose,
    state,
    onChange,
    zIndex,
    onFocus,
}: ExamCalculatorPopupProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(true);
    const [justEvaluated, setJustEvaluated] = useState(false);

    const appendToken = (token: string) => {
        setErrorMsg(null);
        const isOp = OPERATORS.includes(token);

        onChange((prev) => {
            let base = prev.expression || "";

            // After pressing "=", typing a number starts fresh, typing an operator continues from last result
            if (justEvaluated) {
                if (isOp || token === "%") {
                    base = prev.display !== "Error" ? prev.display : "";
                } else if (token !== ")" && token !== "(") {
                    base = "";
                }
            }

            // Replace trailing operator cleanly if another operator is clicked
            if (isOp) {
                if (!base && token !== "-") {
                    base = prev.display && prev.display !== "0" && prev.display !== "Error" ? prev.display : "0";
                }
                const lastChar = base.slice(-1);
                if (OPERATORS.includes(lastChar)) {
                    base = base.slice(0, -1);
                }
            }

            const nextExpr = base + token;
            return { ...prev, expression: nextExpr };
        });
        setJustEvaluated(false);
    };

    const handleBackspace = () => {
        setErrorMsg(null);
        setJustEvaluated(false);
        onChange((prev) => ({
            ...prev,
            expression: (prev.expression || "").slice(0, -1),
        }));
    };

    const handleClearEntry = () => {
        setErrorMsg(null);
        setJustEvaluated(false);
        onChange((prev) => ({
            ...prev,
            expression: "",
            display: "0",
        }));
    };

    const handleToggleSign = () => {
        setErrorMsg(null);
        onChange((prev) => {
            const target = prev.expression || prev.display;
            if (!target || target === "0" || target === "Error") return prev;
            if (/^-?\d+(\.\d+)?$/.test(target)) {
                const toggled = target.startsWith("-") ? target.slice(1) : `-${target}`;
                return { ...prev, expression: toggled, display: toggled };
            }
            return { ...prev, expression: `-(${target})` };
        });
    };

    const handleEvaluate = () => {
        const expr = (state.expression || state.display || "").trim();
        if (!expr) return;
        try {
            const num = evaluateMathExpression(expr);
            const rawStr = String(num);
            const item: CalcHistoryItem = {
                id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                expression: expr,
                result: rawStr,
                createdAt: new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setErrorMsg(null);
            setJustEvaluated(true);
            onChange((prev) => ({
                expression: rawStr,
                display: rawStr,
                history: [item, ...(prev.history || [])].slice(0, 50),
            }));
        } catch (err: any) {
            setErrorMsg(err?.message || "Ekspresi tidak valid");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        const k = e.key;
        if (/^[0-9.]$/.test(k)) {
            e.preventDefault();
            appendToken(k);
        } else if (k === "+") {
            e.preventDefault();
            appendToken("+");
        } else if (k === "-") {
            e.preventDefault();
            appendToken("-");
        } else if (k === "*") {
            e.preventDefault();
            appendToken("×");
        } else if (k === "/") {
            e.preventDefault();
            appendToken("÷");
        } else if (k === "%" || k === "(" || k === ")") {
            e.preventDefault();
            appendToken(k);
        } else if (k === "Enter" || k === "=") {
            e.preventDefault();
            handleEvaluate();
        } else if (k === "Backspace") {
            e.preventDefault();
            handleBackspace();
        } else if (k === "Escape") {
            e.preventDefault();
            handleClearEntry();
        }
    };

    const handleCopyResult = async () => {
        const val = state.expression || state.display || "0";
        try {
            await navigator.clipboard.writeText(val);
            toast.success("Hasil disalin");
        } catch {}
    };

    const displayFormatted = (() => {
        const num = Number(state.display);
        if (state.display !== "" && !Number.isNaN(num) && Number.isFinite(num)) {
            return formatIndonesianNumber(num, true);
        }
        return state.display || "0";
    })();

    const buttons: { label: string; action: () => void; variant?: "op" | "eq" | "util" | "num" }[] = [
        { label: "C", action: handleClearEntry, variant: "util" },
        { label: "(", action: () => appendToken("("), variant: "util" },
        { label: ")", action: () => appendToken(")"), variant: "util" },
        { label: "÷", action: () => appendToken("÷"), variant: "op" },

        { label: "7", action: () => appendToken("7"), variant: "num" },
        { label: "8", action: () => appendToken("8"), variant: "num" },
        { label: "9", action: () => appendToken("9"), variant: "num" },
        { label: "×", action: () => appendToken("×"), variant: "op" },

        { label: "4", action: () => appendToken("4"), variant: "num" },
        { label: "5", action: () => appendToken("5"), variant: "num" },
        { label: "6", action: () => appendToken("6"), variant: "num" },
        { label: "-", action: () => appendToken("-"), variant: "op" },

        { label: "1", action: () => appendToken("1"), variant: "num" },
        { label: "2", action: () => appendToken("2"), variant: "num" },
        { label: "3", action: () => appendToken("3"), variant: "num" },
        { label: "+", action: () => appendToken("+"), variant: "op" },

        { label: "+/-", action: handleToggleSign, variant: "num" },
        { label: "0", action: () => appendToken("0"), variant: "num" },
        { label: ".", action: () => appendToken("."), variant: "num" },
        { label: "%", action: () => appendToken("%"), variant: "op" },
    ];

    return (
        <FloatingToolWindow
            open={open}
            onClose={onClose}
            title="Kalkulator Ujian"
            icon={<Calculator className="h-4 w-4 text-sky-300 shrink-0" />}
            defaultPosition={{ x: 40, y: 88 }}
            defaultWidth={370}
            allowExpand={false}
            zIndex={zIndex}
            onFocus={onFocus}
            headerExtra={
                <button
                    type="button"
                    onClick={() => setShowHistory((v) => !v)}
                    title={showHistory ? "Sembunyikan History" : "Tampilkan History"}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                        showHistory ? "bg-slate-600 text-white" : "text-slate-300 hover:bg-slate-700"
                    }`}
                >
                    <History className="h-3 w-3" />
                    <span>{state.history?.length ?? 0}</span>
                </button>
            }
        >
            <div
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="p-3 space-y-3 outline-none overflow-y-auto"
            >
                {/* Display */}
                <div className="rounded-lg border bg-slate-50 p-3 text-right space-y-1">
                    <div className="min-h-[20px] text-xs font-mono text-slate-500 break-all">
                        {state.expression || "0"}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={handleCopyResult}
                            title="Salin nilai"
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </button>
                        <div className="text-2xl font-bold font-mono text-slate-900 truncate">
                            {displayFormatted}
                        </div>
                    </div>
                    {errorMsg && (
                        <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>
                    )}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-4 gap-1.5">
                    {buttons.map((btn) => (
                        <button
                            key={btn.label}
                            type="button"
                            onClick={btn.action}
                            className={`h-10 rounded-lg text-sm font-semibold border transition-colors ${
                                btn.variant === "op"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                    : btn.variant === "util"
                                      ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                                      : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={handleBackspace}
                        title="Hapus 1 karakter"
                        className="col-span-1 h-10 rounded-lg text-sm font-semibold border bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 flex items-center justify-center"
                    >
                        <Delete className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => appendToken("000")}
                        className="col-span-1 h-10 rounded-lg text-sm font-semibold border bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                    >
                        000
                    </button>
                    <button
                        type="button"
                        onClick={handleEvaluate}
                        className="col-span-2 h-10 rounded-lg text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        =
                    </button>
                </div>

                {/* History Hitungan */}
                {showHistory && (
                    <div className="border-t pt-2.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                <History className="h-3.5 w-3.5" />
                                History Hitungan (Sesi Ini)
                            </span>
                            {(state.history?.length ?? 0) > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onChange((prev) => ({ ...prev, history: [] }))
                                    }
                                    className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Hapus
                                </button>
                            )}
                        </div>
                        {(state.history?.length ?? 0) > 0 ? (
                            <div className="max-h-40 overflow-y-auto space-y-1 pr-0.5">
                                {state.history.map((item) => {
                                    const numRes = Number(item.result);
                                    const formattedRes = !Number.isNaN(numRes)
                                        ? formatIndonesianNumber(numRes, true)
                                        : item.result;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                setErrorMsg(null);
                                                setJustEvaluated(false);
                                                onChange((prev) => ({
                                                    ...prev,
                                                    expression: item.result,
                                                    display: item.result,
                                                }));
                                            }}
                                            title="Klik untuk memakai kembali hasil ini"
                                            className="w-full text-left px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                        >
                                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                                                <span className="font-mono truncate">{item.expression}</span>
                                                <span className="shrink-0">{item.createdAt}</span>
                                            </div>
                                            <div className="text-xs font-mono font-semibold text-slate-800">
                                                = {formattedRes}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-[11px] text-slate-400 italic py-1">
                                Belum ada riwayat perhitungan.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </FloatingToolWindow>
    );
}
