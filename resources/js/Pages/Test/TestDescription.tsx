import { Head, usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import HeaderOnlyLayout from "@/Layouts/HeaderOnlyLayout";
import { Button } from "@/Components/ui/button";
import { FileText, User as UserIcon, AlertTriangle } from "lucide-react";

function getStatus(start?: string | null, end?: string | null) {
    if (!start) return { label: "-", color: "bg-gray-100 text-gray-500" };
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    if (now < startDate)
        return { label: "Belum Mulai", color: "bg-gray-100 text-gray-500" };
    if (endDate && now > endDate)
        return { label: "Selesai", color: "bg-red-100 text-red-700" };
    return {
        label: "Sedang Berlangsung",
        color: "bg-green-100 text-green-700",
    };
}

export default function TestDescription({
    test,
    pivot,
    teacher,
    lastAttempt,
    attemptHistory,
}: any) {
    const { auth, active_test }: any = usePage().props;
    const user = auth?.user;

    const startDate = test?.start_date ? new Date(test.start_date) : null;
    const endDate = test?.end_date ? new Date(test.end_date) : null;
    // tick every 2s to auto-refresh UI when start_date is reached
    const [nowMs, setNowMs] = useState<number>(Date.now());
    useEffect(() => {
        const id = window.setInterval(() => setNowMs(Date.now()), 2000);
        return () => window.clearInterval(id);
    }, []);
    const status = getStatus(test?.start_date ?? null, test?.end_date ?? null);
    const isActive = active_test?.id === test?.id;
    const isSubmitted = Boolean(lastAttempt?.id);
    const hasOtherActive = active_test?.id && active_test?.id !== test?.id;
    const isClosed = endDate ? nowMs >= endDate.getTime() : false;
    const notStarted = startDate ? nowMs < startDate.getTime() : false;

    return (
        <HeaderOnlyLayout
            title={`${test?.title ?? "Ujian"} - ${status.label}`}
            backHref={route("tests.index")}
        >
            <Head title={`Deskripsi Ujian - ${test?.title ?? "Ujian"}`} />
            <div className="py-6 mx-auto px-4  min-h-[calc(100vh-3.5rem)]">
                <div className="max-w-7xl px-4 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Deskripsi Ujian */}
                        <div className="bg-white border rounded-xl shadow p-0 overflow-hidden">
                            <div className="px-5 pt-4 pb-3 border-b-2 border-gray-300 flex items-center gap-2">
                                <FileText className="text-primary" size={18} />
                                <h1 className="font-semibold text-xl text-gray-800">
                                    Deskripsi Ujian
                                </h1>
                            </div>
                            <div className="p-5">
                                <h1 className="text-xl font-semibold text-primary mb-1">
                                    {test?.title}
                                </h1>
                                <p className="text-md text-gray-600 mb-5">
                                    {test?.description || "-"}
                                </p>

                                <div className="rounded-lg border md:text-base text-sm border-yellow-200 bg-yellow-50 text-yellow-800 p-4">
                                    <div className="flex items-center gap-2 font-medium mb-2">
                                        <AlertTriangle size={18} /> Perhatian:
                                    </div>
                                    <ul className="list-disc ml-5 text-md space-y-1">
                                        <li>
                                            Ujian dapat diulang selama jadwal
                                            berlangsung
                                        </li>
                                        <li>
                                            Pastikan koneksi internet stabil
                                        </li>
                                        <li>
                                            Tidak diperbolehkan membuka
                                            tab/aplikasi lain
                                        </li>
                                        <li>
                                            Waktu akan berjalan otomatis setelah
                                            mulai
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right: Informasi Peserta */}
                        <div className="bg-white border rounded-xl shadow p-0 overflow-hidden h-max">
                            <div className="px-5 pt-4 pb-3 border-b-2 border-gray-300 flex items-center gap-2">
                                <UserIcon className="text-primary" size={18} />
                                <h1 className="font-semibold text-xl text-gray-800">
                                    Informasi Peserta
                                </h1>
                            </div>
                            <div className="p-5">
                                <div className="md:text-base text-sm text-gray-800 space-y-2">
                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Nama
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            {user?.name ?? "-"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Email
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            {user?.email ?? "-"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Ujian
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            {test?.title ?? "-"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Durasi
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            {test?.duration
                                                ? `${test.duration} Menit`
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Passing Grade
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            {typeof test?.passing_score ===
                                            "number"
                                                ? `${test.passing_score}`
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Mulai
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            {startDate
                                                ? `${startDate.toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )} ${startDate.toLocaleTimeString(
                                                      "id-ID",
                                                      {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )}`
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Selesai
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            {endDate
                                                ? `${endDate.toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )} ${endDate.toLocaleTimeString(
                                                      "id-ID",
                                                      {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )}`
                                                : "-"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-[120px,10px,1fr]">
                                        <span className="text-gray-500">
                                            Jenis Ujian
                                        </span>
                                        <span>:</span>
                                        <span className="font-medium">
                                            Pilihan Ganda
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2">
                                    <Button
                                        className="w-full"
                                        disabled={
                                            !isActive &&
                                            (Boolean(hasOtherActive) ||
                                                notStarted ||
                                                isClosed)
                                        }
                                        onClick={() =>
                                            router.post(
                                                route("tests.start", test.id),
                                                {},
                                                {
                                                    onSuccess: () =>
                                                        router.visit(
                                                            route(
                                                                "tests.exam",
                                                                test.id
                                                            )
                                                        ),
                                                }
                                            )
                                        }
                                    >
                                        {isActive
                                            ? "Lanjutkan Ujian"
                                            : isSubmitted
                                            ? "Ulangi Mengerjakan"
                                            : `Mulai Ujian ${
                                                  test?.title ?? "Ujian"
                                              }`}
                                    </Button>

                                    {/* Hapus tombol Lihat Hasil Terakhir sesuai permintaan */}

                                    {(isClosed ||
                                        hasOtherActive ||
                                        notStarted) && (
                                        <div className="text-xs text-red-600 space-y-1">
                                            {isClosed && (
                                                <p>Ujian telah ditutup.</p>
                                            )}
                                            {hasOtherActive && (
                                                <p>
                                                    Anda sedang memiliki ujian
                                                    aktif lain. Selesaikan
                                                    terlebih dahulu.
                                                </p>
                                            )}
                                            {notStarted && (
                                                <p>
                                                    Ujian belum mulai. Tunggu
                                                    waktu mulai untuk dapat
                                                    mengerjakan.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {hasOtherActive && !isSubmitted && (
                                        <p className="text-xs text-red-600">
                                            Anda sedang memiliki ujian aktif
                                            lain. Selesaikan terlebih dahulu.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Full width: Riwayat Nilai Ujian */}
                        <div className="lg:col-span-2 bg-white border rounded-xl shadow overflow-hidden">
                            <div className="px-5 pt-4 pb-3 border-b-2 border-gray-300 flex items-center gap-2">
                                <FileText className="text-primary" size={18} />
                                <h2 className="font-semibold text-xl text-gray-800">Riwayat Nilai Ujian</h2>
                            </div>
                            <div className="p-5">
                                {test?.show_score ? (
                                    Array.isArray(attemptHistory) && attemptHistory.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm md:text-base">
                                                <thead>
                                                    <tr className="text-left text-gray-500 border-b">
                                                        <th className="py-2 pr-4">#</th>
                                                        <th className="py-2 pr-4">Tanggal</th>
                                                        <th className="py-2 pr-4 text-center">Nilai</th>
                                                        <th className="py-2 pr-0 text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attemptHistory.map((a: any, idx: number) => {
                                                        const dt = a.submitted_at ? new Date(a.submitted_at) : null;
                                                        return (
                                                            <tr key={a.id} className="border-b last:border-b-0">
                                                                <td className="py-2 pr-4">{idx + 1}</td>
                                                                <td className="py-2 pr-4">
                                                                    {dt
                                                                        ? `${dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} ${dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                                                                        : '-'}
                                                                </td>
                                                                <td className="py-2 pr-4 font-semibold text-center">
                                                                    {typeof a.score === 'number' ? a.score : '-'}
                                                                </td>
                                                                <td className="py-2 pr-0 text-center">
                                                                    <span className={`inline-flex text-xs px-2 py-0.5 rounded-full ${a.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                                        {a.passed ? 'Lulus' : 'Tidak Lulus'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">Belum ada riwayat nilai. Ayo mulai mengerjakan ujian ini.</div>
                                    )
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mb-3">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Nilai Belum Diumumkan</h3>
                                        <p className="text-gray-500 text-sm">
                                            Pengajar belum mengumumkan nilai ujian ini. Silakan tunggu pengumuman dari pengajar.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HeaderOnlyLayout>
    );
}
