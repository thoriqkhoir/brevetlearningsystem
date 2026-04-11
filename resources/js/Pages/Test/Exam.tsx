import { Head, router } from "@inertiajs/react";
import HeaderOnlyLayout from "@/Layouts/HeaderOnlyLayout";
import { AlarmClock, ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

type Question = {
    id: string;
    question_text: string;
    question_type: "multiple_choice" | "true_false" | "short_answer";
    options?: { id: string; option_text: string; is_correct: boolean; image_url?: string }[];
    image_url?: string;
};

export default function Exam({
    test,
    currentQuestion,
    nextQuestionId,
    prevQuestionId,
    questionIndex,
    answeredQuestionIds = [],
    answeredCount = 0,
    currentAnswer,
    deadline,
    serverNow,
    durationDeadline,
}: any) {
    const total = questionIndex?.length ?? 0;

    // Timer based on server-provided deadline to avoid client drift. Persist remaining in localStorage by test id.
    // We'll compute canSubmit using union of server and local answers (local-only mode)
    const [answersVersion, setAnswersVersion] = useState(0);

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
    const [remaining, setRemaining] = useState<number>(computeInitial());
    const deadlineTs = useMemo(() => {
        try {
            return deadline ? new Date(deadline).getTime() : 0;
        } catch {
            return 0;
        }
    }, [deadline]);

    // add: durationDeadline timestamp and display remaining (for header only)
    const durationDeadlineTs = useMemo(() => {
        try {
            return durationDeadline ? new Date(durationDeadline).getTime() : 0;
        } catch {
            return 0;
        }
    }, [durationDeadline]);
    const [durationRemaining, setDurationRemaining] = useState<number>(() => {
        try {
            if (!durationDeadline) return 0;
            const now = serverNow ? new Date(serverNow).getTime() : Date.now();
            return Math.max(
                0,
                Math.floor((new Date(durationDeadline).getTime() - now) / 1000)
            );
        } catch {
            return 0;
        }
    });

    useEffect(() => {
        const id = window.setInterval(async () => {
            const now = Date.now();
            if (deadlineTs && now >= deadlineTs && !hasSubmittedRef.current) {
                hasSubmittedRef.current = true;
                try {
                    if (storageKey) window.localStorage.removeItem(storageKey);
                } catch {}
                try {
                    if (headerStorageKey)
                        window.localStorage.removeItem(headerStorageKey);
                } catch {}
                try {
                    // ensure current short answer textarea is captured
                    saveShortAnswerIfNeeded();
                    await flushLocalAnswers();
                } catch {}
                try {
                    clearLocalAnswers();
                } catch {}
                router.post(route("tests.submit", test.id));
            }
        }, 2000);
        return () => window.clearInterval(id);
    }, [deadlineTs, storageKey, durationDeadlineTs]);

    // Auto-submit when timer hits zero (covers both duration and end_date cutoff)
    const hasSubmittedRef = useRef(false);
    useEffect(() => {
        if (remaining === 0 && !hasSubmittedRef.current) {
            hasSubmittedRef.current = true;
            (async () => {
                try {
                    if (storageKey) window.localStorage.removeItem(storageKey);
                } catch {}
                try {
                    if (headerStorageKey)
                        window.localStorage.removeItem(headerStorageKey);
                } catch {}
                try {
                    // ensure current short answer textarea is captured
                    saveShortAnswerIfNeeded();
                    await flushLocalAnswers();
                } catch {}
                try {
                    clearLocalAnswers();
                } catch {}
                router.post(route("tests.submit", test.id));
            })();
        }
    }, [remaining, storageKey, test?.id]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Defensive: if page remains open past deadline due to tab sleep or throttling, force submit
    useEffect(() => {
        const id = window.setInterval(async () => {
            const now = Date.now();
            if (deadlineTs && now >= deadlineTs && !hasSubmittedRef.current) {
                hasSubmittedRef.current = true;
                try {
                    if (storageKey) window.localStorage.removeItem(storageKey);
                } catch {}
                try {
                    // ensure current short answer textarea is captured
                    saveShortAnswerIfNeeded();
                    await flushLocalAnswers();
                } catch {}
                try {
                    clearLocalAnswers();
                } catch {}
                router.post(route("tests.submit", test.id));
            }
        }, 2000);
        return () => window.clearInterval(id);
    }, [deadlineTs, storageKey]);

    // Save short answer helper (used before navigation)
    const saveShortAnswerIfNeeded = () => {
        if (currentQuestion?.question_type === "short_answer") {
            const el = document.querySelector(
                `textarea[name="q_${currentQuestion.id}"]`
            ) as HTMLTextAreaElement | null;
            if (el) {
                const val = el.value ?? "";
                // Save locally only (do not post to server until submit)
                try {
                    saveAnswerLocalOnly(currentQuestion.id, { answer: val });
                    setAnswersVersion((v) => v + 1);
                } catch {}
            }
        }
    };

    const gotoQuestion = (qid: string | null | undefined) => {
        if (!qid) return;
        saveShortAnswerIfNeeded();
        router.visit(route("tests.exam", [test.id, qid]));
    };
    const [confirmOpen, setConfirmOpen] = useState(false);
    const handleBack = () => setConfirmOpen(true);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false); // loading state during flush & submit

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
            // prefer attempt-specific key using durationDeadline timestamp; fallback to duration
            return `exam_header_${test.id}_${ddts || `d${durationMinutes}`}`;
        } catch {
            return `exam_header_${test.id}`;
        }
    }, [test?.id, durationDeadline, durationMinutes]);

    // initialize header countdown from localStorage if exists, else from DB duration
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
    const [headerRemaining, setHeaderRemaining] =
        useState<number>(computeHeaderInitial);

    // const [headerRemaining, setHeaderRemaining] = useState<number>(() => Math.max(0, durationMinutes * 60));
    // useEffect(() => { setHeaderRemaining(Math.max(0, durationMinutes * 60)); }, [durationMinutes]);

    useEffect(() => {
        if (durationMinutes <= 0) return;
        const id = window.setInterval(() => {
            setHeaderRemaining((p) => {
                const next = Math.max(0, p - 1);
                if (headerStorageKey) {
                    try {
                        window.localStorage.setItem(
                            headerStorageKey,
                            String(next)
                        );
                    } catch {}
                }
                return next;
            });
        }, 1000);
        return () => window.clearInterval(id);
    }, [durationMinutes, headerStorageKey]);

    // ================= Local-only answer persistence =================
    // Keyed by test + attempt signature (durationDeadline or deadline)
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

    // Save a single answer locally without hitting the server/DB
    const saveAnswerLocalOnly = (
        questionId: string,
        payload: { option_id?: string; answer?: string }
    ) => {
        if (!answersStorageKey || !questionId) return;
        try {
            const raw = window.localStorage.getItem(answersStorageKey);
            const store = raw ? JSON.parse(raw) : {};
            store[questionId] = { ...payload, savedAt: new Date().toISOString() };
            window.localStorage.setItem(answersStorageKey, JSON.stringify(store));
        } catch {}
    };

    // Read a single answer or all answers from local storage
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

    // Clear all locally stored answers for this attempt/test
    const clearLocalAnswers = () => {
        if (!answersStorageKey) return;
        try {
            window.localStorage.removeItem(answersStorageKey);
        } catch {}
    };
    // =================================================================

    // Determine answered using union of server-answered ids and locally saved
    const localAnsweredIds = useMemo(() => {
        const all = getAnswerLocal();
        if (!all || typeof all !== "object") return [] as string[];
        return Object.entries(all as Record<string, any>)
            .filter(([_, v]) => v && (v.option_id || (typeof v.answer === 'string' && v.answer.trim() !== '')))
            .map(([qid]) => String(qid));
    }, [answersStorageKey, answersVersion]);
    const combinedAnsweredCount = useMemo(() => {
        const set = new Set<string>([...answeredQuestionIds, ...localAnsweredIds]);
        return set.size;
    }, [answeredQuestionIds, localAnsweredIds]);
    const canSubmit = total > 0 && combinedAnsweredCount >= total;

    // Flush locally stored answers using Inertia router.post (bulk only) to rely on built-in CSRF handling.
    // Returns number of answers persisted (best-effort, falls back to local count if flash not available).
    const flushLocalAnswers = async (): Promise<number> => {
        const all = getAnswerLocal();
        if (!all || typeof all !== 'object') return 0;
        const entries = Object.entries(all as Record<string, any>);
        if (!entries.length) return 0;
        const answers = entries.map(([qid, payload]) => ({ question_id: qid, ...payload }));

        return new Promise<number>((resolve) => {
            let resolved = false;
            router.post(
                route('tests.answers.bulk', test.id),
                { answers, current: currentQuestion?.id },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onSuccess: () => {
                        try {
                            // Read flash value delivered via redirect (controller sets saved_count)
                            const flushSavedCount = (window as any)?.Inertia?.page?.props?.flushSavedCount;
                            if (typeof flushSavedCount === 'number') {
                                console.info('Bulk saved (Inertia)', flushSavedCount, 'answers');
                                resolved = true;
                                resolve(flushSavedCount);
                                return;
                            }
                        } catch {}
                        console.info('Bulk saved (no flushSavedCount flash) assuming all:', answers.length);
                        resolved = true;
                        resolve(answers.length);
                    },
                    onError: (errors) => {
                        console.warn('Bulk save error via Inertia', errors);
                        resolved = true;
                        resolve(0);
                    },
                    onFinish: () => {
                        // Safety: resolve if onSuccess did not fire (rare)
                        if (!resolved) resolve(answers.length);
                    },
                }
            );
        });
    };

    // Auto-submit when header countdown (duration-based) hits 0:00
    useEffect(() => {
        if (
            durationMinutes > 0 &&
            headerRemaining === 0 &&
            !hasSubmittedRef.current
        ) {
            hasSubmittedRef.current = true;
            (async () => {
                try {
                    if (storageKey) window.localStorage.removeItem(storageKey);
                } catch {}
                try {
                    if (headerStorageKey)
                        window.localStorage.removeItem(headerStorageKey);
                } catch {}
                try {
                    // ensure current short answer textarea is captured
                    saveShortAnswerIfNeeded();
                    await flushLocalAnswers();
                } catch {}
                try {
                    clearLocalAnswers();
                } catch {}
                router.post(route("tests.submit", test.id));
            })();
        }
    }, [
        headerRemaining,
        durationMinutes,
        headerStorageKey,
        storageKey,
        test?.id,
    ]);

    // Prefer server-provided currentAnswer; fall back to locally saved answer
    const effectiveAnswer = useMemo(() => {
        if (!currentQuestion?.id) return {} as any;
        const local = getAnswerLocal(currentQuestion.id);
        return {
            // Prefer local first for instant UI feedback; fallback to server
            option_id:
                (local && local.option_id) ||
                (currentAnswer && (currentAnswer as any).option_id) ||
                null,
            answer:
                (local && local.answer) ||
                (currentAnswer && (currentAnswer as any).answer) ||
                "",
        } as any;
    }, [answersStorageKey, answersVersion, currentQuestion?.id, currentAnswer?.option_id, currentAnswer?.answer]);

    return (
        <>
            <HeaderOnlyLayout
                title={
                    <span className="font-medium">
                        {test?.title ?? "Ujian"}
                    </span>
                }
                right={
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm rounded-full border px-2 py-0.5 bg-white">
                            <AlarmClock size={14} className="text-amber-600" />
                            <span>
                                {durationMinutes > 0
                                    ? formatTime(headerRemaining)
                                    : "0:00"}
                            </span>
                        </span>
                        <span className="text-xs text-gray-500">
                            {combinedAnsweredCount}/{total} dikerjakan
                        </span>
                        <div className="hidden md:block w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-2 bg-green-300"
                                style={{
                                    width: total
                                        ? `${Math.round(
                                              (combinedAnsweredCount / total) * 100
                                          )}%`
                                        : "0%",
                                }}
                            />
                        </div>
                    </div>
                }
                onBack={handleBack}
                backHref={route("tests.index")}
            >
                <Head title={`Ujian - ${test?.title ?? "Ujian"}`} />
                <div className="py-4 mx-auto px-4 bg-white min-h-[calc(100vh-3.5rem)]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr,320px] gap-4">
                        {/* Left: Question Card */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            {currentQuestion ? (
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">
                                        Soal No.
                                        {(questionIndex?.findIndex(
                                            (q: any) =>
                                                q.id === currentQuestion.id
                                        ) ?? 0) + 1}
                                    </h2>
                                    <p className="mb-2 font-semibold">
                                        {currentQuestion.question_text}
                                    </p>
                                    {currentQuestion.image_url && (
                                        <div className="mb-4">
                                            <img
                                                src={`/storage/${currentQuestion.image_url}`}
                                                alt="Gambar soal"
                                                className="max-h-64 rounded-lg border object-contain"
                                            />
                                        </div>
                                    )}

                                    {currentQuestion.question_type ===
                                        "multiple_choice" &&
                                        currentQuestion.options && (
                                            <div className="space-y-3">
                                                {currentQuestion.options.map(
                                                    (opt: any) => (
                                                        <label
                                                            key={opt.id}
                                                            className="flex items-start gap-2 p-3 border rounded-xl hover:bg-gray-50 cursor-pointer"
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
                                                                            { option_id: opt.id }
                                                                        );
                                                                        setAnswersVersion((v) => v + 1);
                                                                    } catch {}
                                                                }}
                                                            />
                                                            <div className="flex-1">
                                                                <span>
                                                                    {
                                                                        opt.option_text
                                                                    }
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
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {currentQuestion.question_type ===
                                        "true_false" && currentQuestion.options && (
                                        <div className="space-y-3">
                                            {currentQuestion.options.map((opt: any) => (
                                                <label key={opt.id} className="flex items-start gap-2 p-3 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`q_${currentQuestion.id}`}
                                                        className="h-4 w-4 mt-0.5"
                                                        checked={effectiveAnswer?.option_id === opt.id}
                                                        onChange={() => {
                                                            try {
                                                                saveAnswerLocalOnly(currentQuestion.id, { option_id: opt.id });
                                                                setAnswersVersion((v) => v + 1);
                                                            } catch {}
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        <span>{opt.option_text}</span>
                                                        {opt.image_url && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={`/storage/${opt.image_url}`}
                                                                    alt={`Gambar opsi ${opt.option_text}`}
                                                                    className="max-h-48 rounded border"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {currentQuestion.question_type ===
                                        "short_answer" && (
                                        <textarea
                                            className="w-full border rounded p-3"
                                            rows={4}
                                            placeholder="Tulis jawaban Anda"
                                            defaultValue={effectiveAnswer?.answer}
                                            name={`q_${currentQuestion.id}`}
                                            onBlur={(e) => {
                                                const val = e.currentTarget.value;
                                                try {
                                                    saveAnswerLocalOnly(
                                                        currentQuestion.id,
                                                        { answer: val }
                                                    );
                                                    setAnswersVersion((v) => v + 1);
                                                } catch {}
                                            }}
                                        />
                                    )}

                                    {/* Bottom nav */}
                                    <div className="mt-6 flex items-center justify-between">
                                        <Button
                                            disabled={!prevQuestionId}
                                            onClick={() =>
                                                gotoQuestion(prevQuestionId)
                                            }
                                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft
                                                className="inline-block mr-1"
                                                size={16}
                                            />{" "}
                                            Sebelumnya
                                        </Button>
                                        
                                        {nextQuestionId ? (
                                            <Button
                                                onClick={() =>
                                                    gotoQuestion(nextQuestionId)
                                                }
                                            >
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
                                <p className="text-gray-500">
                                    Belum ada soal yang tersedia.
                                </p>
                            )}
                        </div>

                        {/* Right: Number panel */}
                        <aside className="bg-white border rounded-xl p-4 shadow-sm h-max">
                            <h3 className="font-semibold mb-3">Nomor Soal</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {questionIndex?.map((q: any, i: number) => {
                                    const isCurrent =
                                        currentQuestion?.id === q.id;
                                    const isAnswered =
                                        answeredQuestionIds?.includes(q.id) ||
                                        localAnsweredIds.includes(q.id);
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => gotoQuestion(q.id)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-sm border
											${
                                                isCurrent
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : isAnswered
                                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-gray-300 border"></span>{" "}
                                    Belum Dikerjakan
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300"></span>{" "}
                                    Sudah Dikerjakan
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-blue-600"></span>{" "}
                                    Nomor Soal Saat Ini
                                </div>
                            </div>

                            <Button
                                className={`mt-4 w-full border rounded py-2 ${
                                    canSubmit ? "" : " cursor-not-allowed"
                                }`}
                                disabled={!canSubmit}
                                onClick={() => setSubmitOpen(true)}
                            >
                                Kumpulkan Ujian
                            </Button>
                            {!canSubmit && (
                                <p className="text-xs text-red-600 mt-2">
                                    Jawab semua soal terlebih dahulu.
                                </p>
                            )}
                        </aside>
                    </div>
                </div>
            </HeaderOnlyLayout>

            {/* Confirm leave dialog */}
            <AlertDialog open={confirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Keluar dari Ujian?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Jawaban tidak akan dikirim ke database dan waktu ujian akan direset. Lanjutkan?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                // Pastikan short answer terakhir tersimpan lokal (tetap tidak dikirim ke DB)
                                try { saveShortAnswerIfNeeded(); } catch {}
                                // Hapus timer & jawaban lokal (discard = buang jawaban)
                                try { if (storageKey) window.localStorage.removeItem(storageKey); } catch {}
                                try { if (headerStorageKey) window.localStorage.removeItem(headerStorageKey); } catch {}
                                try { clearLocalAnswers(); } catch {}
                                setConfirmOpen(false);
                                router.post(route("tests.discard", test.id));
                            }}
                        >
                            Ya, Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm submit dialog */}
            <AlertDialog open={submitOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kumpulkan Ujian?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Pastikan semua soal sudah dijawab. Anda tidak dapat
                            mengubah jawaban setelah dikumpulkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSubmitOpen(false)}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={submitting}
                            onClick={async () => {
                                if (submitting) return; // guard double click
                                setSubmitting(true);
                                try {
                                    // capture last short answer if still focused (no onBlur yet)
                                    try { saveShortAnswerIfNeeded(); } catch {}
                                    // clear timers on manual submit
                                    try { if (storageKey) window.localStorage.removeItem(storageKey); } catch {}
                                    try { if (headerStorageKey) window.localStorage.removeItem(headerStorageKey); } catch {}
                                    // flush answers (bulk + fallback)
                                    try { await flushLocalAnswers(); } catch (e) { console.warn('Flush error', e); }
                                    // clear local cache after flush
                                    try { clearLocalAnswers(); } catch {}
                                    setSubmitOpen(false);
                                    router.post(route("tests.submit", test.id));
                                } catch (e) {
                                    console.error('Submit sequence error', e);
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
                                'Ya, Kumpulkan'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
