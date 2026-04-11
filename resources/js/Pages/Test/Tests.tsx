import { Head, Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useMemo, useState } from "react";
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

function getStatusAt(start: string, end: string, nowMs: number) {
    const now = new Date(nowMs);
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

export default function Tests({ tests = [] }: any) {
    const { flash }: any = usePage().props;
    const active_test = usePage().props.active_test as {
        id: number;
        name: string;
        access_rights: string[];
    } | null;
    const [open, setOpen] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [loading, setLoading] = useState(false);
    // tick every 2s to auto-refresh status (Belum Mulai -> Sedang Berlangsung)
    const [nowMs, setNowMs] = useState<number>(Date.now());
    useEffect(() => {
        const id = window.setInterval(() => setNowMs(Date.now()), 2000);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleJoinClass = async () => {
        setLoading(true);
        router.post(
            route("tests.join"),
            { code: classCode },
            {
                onSuccess: () => {
                    setOpen(false);
                    setClassCode("");
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Ujian Saya" />
            <div className="py-8 mx-auto px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <h1 className="text-2xl font-semibold text-primary">
                            Ujian Saya
                        </h1>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default">
                                    <Plus size={18} />
                                    Gabung Ujian
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Gabung Ujian</DialogTitle>
                                    <DialogDescription>
                                        Masukkan kode Ujian yang diberikan oleh
                                        pengajar untuk bergabung ke Ujian.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        placeholder="Kode Ujian"
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
                        {tests.length === 0 && (
                            <div className="text-gray-400 text-center col-span-3 py-8">
                                Anda belum bergabung di Ujian manapun.
                            </div>
                        )}
                        {tests.map((test: any) => {
                            const status = getStatusAt(
                                test.start_date,
                                test.end_date,
                                nowMs
                            );
                            const isActive = active_test?.id === test.id;
                            const hasOtherActive =
                                active_test?.id &&
                                active_test?.id !== test.id;

                            const averageScore = test.score;

                            return (
                                <div
                                    key={test.id}
                                    className="rounded-xl bg-white border shadow p-5 flex flex-col gap-2 hover:shadow-lg transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-primary">
                                            {test.title}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${status.color}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {test.description || "-"}
                                    </p>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <div>
                                            Ujian Dimulai:{" "}
                                            {test.start_date
                                                ? new Date(test.start_date).toLocaleDateString("id-ID", {
                                                      day: "numeric",
                                                      month: "long",
                                                      year: "numeric",
                                                  })
                                                : "-"}
                                            {" - "}
                                            {test.start_date
                                                ? new Date(test.start_date).toLocaleTimeString("id-ID", {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : "-"}
                                        </div>
                                        <div>
                                            Ujian Ditutup:{" "}
                                            {test.end_date
                                                ? new Date(test.end_date).toLocaleDateString("id-ID", {
                                                      day: "numeric",
                                                      month: "long",
                                                      year: "numeric",
                                                  })
                                                : "-"}
                                            {" - "}
                                            {test.end_date
                                                ? new Date(test.end_date).toLocaleTimeString("id-ID", {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : "-"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm mt-2">
                                        <span className="font-medium text-gray-700">
                                            Nilai Terbaik:
                                        </span>
                                        <div className="font-mono text-lg font-bold text-primary">
                                            {test.show_score ? (
                                                averageScore !== null ? (
                                                    averageScore
                                                ) : (
                                                    <span className="italic text-base text-gray-400">
                                                        Belum dinilai
                                                    </span>
                                                )
                                            ) : (
                                                <span className="italic text-base text-gray-500">
                                                    Nilai belum diumumkan
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        
                                            <Button
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            "tests.detail",
                                                            test.id
                                                        )
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
                                    
                                    </div>
                                    {status.label === "Sedang Berlangsung" ? (
                                        hasOtherActive && (
                                            <p className="text-sm text-red-600 mt-1">
                                                Anda memiliki Ujian aktif lain.
                                                Selesaikan Ujian tersebut
                                                terlebih dahulu sebelum
                                                mengerjakan Ujian ini.
                                            </p>
                                        )
                                    ) : (
                                        <div className="text-sm text-red-600 mt-1">
                                            {status.label === "Belum Mulai" && (
                                                <p>
                                                    Ujian belum mulai. Tunggu
                                                    waktu mulai Ujian untuk
                                                    dapat mengerjakan.
                                                </p>
                                            )}
                                            {status.label === "Selesai" && (
                                                <p>
                                                    Ujian sudah selesai. Anda
                                                    tidak dapat mengerjakan
                                                    Ujian ini lagi.
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
