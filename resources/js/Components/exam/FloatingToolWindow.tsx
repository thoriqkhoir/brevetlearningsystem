import { Maximize2, Minimize2, Move, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface FloatingToolWindowProps {
    open: boolean;
    onClose: () => void;
    title: string;
    icon?: React.ReactNode;
    defaultPosition?: { x: number; y: number };
    defaultWidth?: number;
    defaultHeight?: number;
    allowExpand?: boolean;
    zIndex?: number;
    onFocus?: () => void;
    headerExtra?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Draggable floating popup window for exam helper tools (Calculator, Notes, Excel).
 * Allows reading the exam question underneath without a blocking backdrop.
 */
export default function FloatingToolWindow({
    open,
    onClose,
    title,
    icon,
    defaultPosition = { x: 80, y: 90 },
    defaultWidth = 360,
    defaultHeight,
    allowExpand = true,
    zIndex = 41,
    onFocus,
    headerExtra,
    children,
}: FloatingToolWindowProps) {
    const [pos, setPos] = useState(defaultPosition);
    const [expanded, setExpanded] = useState(false);
    const dragRef = useRef<{
        dragging: boolean;
        startX: number;
        startY: number;
        origX: number;
        origY: number;
    }>({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

    // Clamp initial position within viewport on mount/open
    useEffect(() => {
        if (!open || typeof window === "undefined") return;
        setPos((prev) => {
            const maxX = Math.max(12, window.innerWidth - Math.min(defaultWidth, window.innerWidth - 24) - 12);
            const maxY = Math.max(72, window.innerHeight - 260);
            return {
                x: Math.min(Math.max(12, prev.x), maxX),
                y: Math.min(Math.max(72, prev.y), maxY),
            };
        });
    }, [open, defaultWidth]);

    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            if (!dragRef.current.dragging) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            const maxX = Math.max(8, window.innerWidth - 220);
            const maxY = Math.max(64, window.innerHeight - 100);
            setPos({
                x: Math.min(Math.max(8, dragRef.current.origX + dx), maxX),
                y: Math.min(Math.max(64, dragRef.current.origY + dy), maxY),
            });
        };

        const handleUp = () => {
            dragRef.current.dragging = false;
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
    }, []);

    if (!open) return null;

    const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
        if (expanded) return;
        if ((e.target as HTMLElement).closest("button")) return;
        onFocus?.();
        dragRef.current = {
            dragging: true,
            startX: e.clientX,
            startY: e.clientY,
            origX: pos.x,
            origY: pos.y,
        };
    };

    const style: React.CSSProperties = expanded
        ? {
              left: "16px",
              top: "72px",
              width: "calc(100vw - 32px)",
              height: "calc(100vh - 96px)",
              zIndex,
          }
        : {
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `min(${defaultWidth}px, calc(100vw - 24px))`,
              ...(defaultHeight ? { height: `min(${defaultHeight}px, calc(100vh - 96px))` } : {}),
              maxHeight: "calc(100vh - 96px)",
              zIndex,
          };

    return (
        <div
            onPointerDown={() => onFocus?.()}
            style={style}
            className="exam-allow-select select-text fixed flex flex-col bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
        >
            {/* Header / Drag Handle */}
            <div
                onPointerDown={startDrag}
                className={`flex items-center justify-between gap-2 px-3 py-2 bg-slate-800 text-white select-none ${
                    expanded ? "" : "cursor-move"
                }`}
            >
                <div className="flex items-center gap-2 min-w-0">
                    {icon}
                    <span className="text-xs sm:text-sm font-semibold truncate">{title}</span>
                    {!expanded && <Move className="h-3 w-3 opacity-50 hidden sm:inline shrink-0" />}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {headerExtra}
                    {allowExpand && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            title={expanded ? "Perkecil" : "Perbesar"}
                            className="p-1 rounded hover:bg-slate-700 text-slate-200 transition-colors"
                        >
                            {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        title="Tutup"
                        className="p-1 rounded hover:bg-rose-600 text-slate-200 hover:text-white transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
                {children}
            </div>
        </div>
    );
}
