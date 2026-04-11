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
        return { label: "Belum Mulai", color: "text-gray-500 bg-gray-100" };
    if (now > endDate)
        return { label: "Selesai", color: "text-red-700 bg-red-100" };
    if (now >= startDate && now <= endDate)
        return {
            label: "Sedang Berlangsung",
            color: "text-green-700 bg-green-100",
        };
    return { label: "-", color: "text-gray-400 bg-gray-50" };
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
            <div className="py-8 mx-auto px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <h1 className="text-2xl font-semibold text-primary">
                            Kelas Saya
                        </h1>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default">
                                    <Plus size={18} />
                                    Gabung Kelas
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Gabung Kelas</DialogTitle>
                                    <DialogDescription>
                                        Masukkan kode kelas yang diberikan oleh
                                        pengajar untuk bergabung ke kelas.
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
                                        {loading ? "Memproses..." : "Gabung"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-4">
                        {courses.length === 0 && (
                            <div className="text-gray-400 text-center col-span-3 py-8">
                                Anda belum bergabung di kelas manapun.
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
                                    className="rounded-xl bg-white border shadow p-5 flex flex-col gap-2 hover:shadow-lg transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-primary">
                                            {course.name}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${status.color}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {course.description || "-"}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>
                                            Durasi Pengerjaan:{" "}
                                            {course.start_date
                                                ? new Date(
                                                      course.start_date,
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : "-"}
                                            {" - "}
                                            {course.end_date
                                                ? new Date(
                                                      course.end_date,
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : "-"}
                                        </span>
                                    </div>
                                    {(nextUpcomingSchedule ||
                                        nextUpcomingTest) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {nextUpcomingSchedule && (
                                                <div className="rounded-lg border border-dashed bg-slate-50 p-3 text-sm">
                                                    <div className="font-semibold text-slate-700">
                                                        Jadwal Kelas terdekat
                                                    </div>
                                                    <div className="text-slate-700 mt-0.5">
                                                        {nextUpcomingSchedule.title ||
                                                            "-"}
                                                    </div>
                                                    <div className="text-slate-500 text-xs mt-1">
                                                        {formatLocalDateTime(
                                                            nextUpcomingSchedule.starts_at,
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {nextUpcomingTest && (
                                                <div className="rounded-lg border border-dashed bg-blue-50 p-3 text-sm">
                                                    <div className="font-semibold text-blue-800">
                                                        {nextUpcomingTest.state ===
                                                        "ongoing"
                                                            ? "Ujian Kelas sedang berlangsung"
                                                            : "Ujian Kelas terdekat"}
                                                    </div>
                                                    <div className="text-blue-800 mt-0.5">
                                                        {nextUpcomingTest.title ||
                                                            "-"}
                                                    </div>
                                                    <div className="text-blue-700 text-xs mt-1">
                                                        {formatLocalDateTime(
                                                            nextUpcomingTest.starts_at,
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm mt-2">
                                        <span className="font-medium text-gray-700">
                                            Nilai:
                                        </span>
                                        <div className="font-mono text-lg font-bold text-primary">
                                            {averageScore !== null ? (
                                                averageScore
                                            ) : (
                                                <span className="italic text-base text-gray-400">
                                                    Belum dinilai
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            className="w-fit text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                            asChild
                                        >
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
                                                variant="outline"
                                                className="text-green-700 bg-green-50 border-green-400 hover:bg-green-100 hover:text-green-700"
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
                                                variant="outline"
                                                className="text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:text-orange-700"
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
                                            <p className="text-sm text-red-600 mt-1">
                                                Anda memiliki kelas aktif lain.
                                                Selesaikan kelas tersebut
                                                terlebih dahulu sebelum
                                                mengerjakan kelas ini.
                                            </p>
                                        )
                                    ) : (
                                        <div className="text-sm text-red-600 mt-1">
                                            {status.label === "Belum Mulai" && (
                                                <p>
                                                    Kelas belum mulai. Tunggu
                                                    waktu mulai kelas untuk
                                                    dapat mengerjakan.
                                                </p>
                                            )}
                                            {status.label === "Selesai" && (
                                                <p>
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
