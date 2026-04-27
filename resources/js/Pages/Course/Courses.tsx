import { Head, Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";

function formatLocalDateTime(value?: string | null) {
    if (!value) return "-";

    const normalized = String(value).trim();

    const matched = normalized.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/,
    );

    let date: Date | null = null;

    if (matched) {
        date = new Date(
            Number(matched[1]),
            Number(matched[2]) - 1,
            Number(matched[3]),
            Number(matched[4]),
            Number(matched[5]),
            Number(matched[6] ?? 0),
        );
    } else {
        const parsed = new Date(normalized);
        date = Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    if (!date) return "-";

    return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatus(start: string, end: string) {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate)
        return {
            label: "Belum Mulai",
            color: "border border-amber-200 bg-amber-100 text-amber-800",
        };
    if (now > endDate)
        return {
            label: "Selesai",
            color: "border border-rose-200 bg-rose-100 text-rose-700",
        };
    if (now >= startDate && now <= endDate)
        return {
            label: "Sedang Berlangsung",
            color: "border border-emerald-200 bg-emerald-100 text-emerald-700",
        };
    return {
        label: "-",
        color: "border border-slate-200 bg-slate-100 text-slate-500",
    };
}

export default function Courses({ courses = [] }: any) {
    const { flash }: any = usePage().props;
    const active_course = usePage().props.active_course as {
        id: number;
        name: string;
        access_rights: string[];
    } | null;
    const [open, setOpen] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleJoinClass = async () => {
        setLoading(true);
        router.post(
            route("courses.join"),
            { code: classCode },
            {
                onSuccess: () => {
                    setOpen(false);
                    setClassCode("");
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Kelas Saya" />
            <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-amber-50/60">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.16),_transparent_40%)]" />
                <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
                        <div className="rounded-3xl border border-teal-200/70 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 h-16 w-1 rounded-full bg-gradient-to-b from-teal-500 to-amber-500" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                        Brevet Class
                                    </p>
                                    <h1 className="mt-1 text-2xl font-semibold text-slate-800 md:text-3xl">
                                        Kelas Saya
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Pantau status kelas, jadwal terdekat,
                                        dan progres belajar Anda dengan cepat.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                                            Total Kelas: {courses.length}
                                        </span>
                                        {active_course ? (
                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                Kelas Aktif:{" "}
                                                {active_course.name}
                                            </span>
                                        ) : (
                                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                Belum ada kelas aktif
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-sm lg:min-w-60">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                                Aksi Cepat
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                Masukkan kode dari pengajar untuk bergabung ke
                                kelas baru.
                            </p>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="accent"
                                        className="mt-3 w-full"
                                    >
                                        <Plus size={18} />
                                        Gabung Kelas
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="border-teal-100 bg-white/95">
                                    <DialogHeader>
                                        <DialogTitle className="text-slate-800">
                                            Gabung Kelas
                                        </DialogTitle>
                                        <DialogDescription>
                                            Masukkan kode kelas yang diberikan
                                            oleh pengajar untuk bergabung ke
                                            kelas.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                        <Input
                                            placeholder="Kode Kelas"
                                            value={classCode}
                                            onChange={(e) =>
                                                setClassCode(e.target.value)
                                            }
                                            autoFocus
                                        />
                                        <Button
                                            onClick={handleJoinClass}
                                            disabled={loading || !classCode}
                                        >
                                            {loading
                                                ? "Memproses..."
                                                : "Gabung"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {courses.length === 0 && (
                            <div className="rounded-2xl border border-teal-100 bg-white/90 px-6 py-10 text-center shadow-sm backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500">
                                    Anda belum bergabung di kelas manapun.
                                </p>
                            </div>
                        )}

                        {courses.map((course: any) => {
                            const status = getStatus(
                                course.start_date,
                                course.end_date,
                            );
                            const isActive = active_course?.id === course.id;
                            const hasOtherActive =
                                active_course?.id &&
                                active_course?.id !== course.id;

                            const averageScore = course.score;
                            const nextUpcomingSchedule =
                                course.next_schedule_upcoming;
                            const nextUpcomingTest = course.next_test_upcoming;

                            return (
                                <div
                                    key={course.id}
                                    className="rounded-3xl border border-teal-100/80 bg-white/95 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">
                                                {course.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {course.description || "-"}
                                            </p>
                                        </div>
                                        <span
                                            className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-600">
                                        Durasi Pengerjaan:{" "}
                                        {course.start_date
                                            ? new Date(
                                                  course.start_date,
                                              ).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                        {" - "}
                                        {course.end_date
                                            ? new Date(
                                                  course.end_date,
                                              ).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </div>

                                    {(nextUpcomingSchedule ||
                                        nextUpcomingTest) && (
                                        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                                            {nextUpcomingSchedule && (
                                                <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-3 text-sm">
                                                    <div className="font-semibold text-teal-800">
                                                        Jadwal Kelas terdekat
                                                    </div>
                                                    <div className="mt-0.5 text-slate-700">
                                                        {nextUpcomingSchedule.title ||
                                                            "-"}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        {formatLocalDateTime(
                                                            nextUpcomingSchedule.starts_at,
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {nextUpcomingTest && (
                                                <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 text-sm">
                                                    <div className="font-semibold text-cyan-800">
                                                        {nextUpcomingTest.state ===
                                                        "ongoing"
                                                            ? "Ujian Kelas sedang berlangsung"
                                                            : "Ujian Kelas terdekat"}
                                                    </div>
                                                    <div className="mt-0.5 text-slate-700">
                                                        {nextUpcomingTest.title ||
                                                            "-"}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        {formatLocalDateTime(
                                                            nextUpcomingTest.starts_at,
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-700">
                                            Nilai:
                                        </span>
                                        <div className="font-mono text-lg font-bold text-teal-700">
                                            {averageScore !== null ? (
                                                averageScore
                                            ) : (
                                                <span className="text-base italic text-slate-400">
                                                    Belum dinilai
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <Button variant="info" asChild>
                                            <Link
                                                href={route(
                                                    "courses.detail",
                                                    course.id,
                                                )}
                                            >
                                                Lihat Detail
                                            </Link>
                                        </Button>

                                        {!isActive ? (
                                            <Button
                                                onClick={() =>
                                                    router.post(
                                                        route(
                                                            "courses.start",
                                                            course.id,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    status.label !==
                                                        "Sedang Berlangsung" ||
                                                    Boolean(hasOtherActive)
                                                }
                                            >
                                                Mulai Mengerjakan
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="accentOutline"
                                                onClick={() =>
                                                    router.post(
                                                        route("courses.stop"),
                                                    )
                                                }
                                            >
                                                Hentikan Pengerjaan
                                            </Button>
                                        )}
                                    </div>

                                    {status.label === "Sedang Berlangsung" ? (
                                        hasOtherActive && (
                                            <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                                Anda memiliki kelas aktif lain.
                                                Selesaikan kelas tersebut
                                                terlebih dahulu sebelum
                                                mengerjakan kelas ini.
                                            </div>
                                        )
                                    ) : (
                                        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                            {status.label === "Belum Mulai" && (
                                                <p>
                                                    Kelas belum mulai. Tunggu
                                                    waktu mulai kelas untuk
                                                    dapat mengerjakan.
                                                </p>
                                            )}
                                            {status.label === "Selesai" && (
                                                <p className="text-rose-700">
                                                    Kelas sudah selesai. Anda
                                                    tidak dapat mengerjakan
                                                    kelas ini lagi.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
