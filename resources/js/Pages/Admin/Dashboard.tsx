import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { MoveRight, Users, BookOpen, UserCheck, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FakturBupotChart } from "./FakturBupotChart";
import { SPTChart } from "./SPTChart";

const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const getCourseStatus = (course: any) => {
    const now = new Date();
    const startDate = course?.start_date ? new Date(course.start_date) : null;
    const endDate = course?.end_date ? new Date(course.end_date) : null;
    if (
        !startDate ||
        !endDate ||
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
    ) {
        return { label: "Tanpa Jadwal", className: "bg-gray-100 text-gray-700" };
    }
    if (now < startDate) {
        return { label: "Belum Mulai", className: "bg-orange-100 text-orange-700" };
    }
    if (now > endDate) {
        return { label: "Selesai", className: "bg-fuchsia-100 text-fuchsia-700" };
    }
    return { label: "Aktif", className: "bg-emerald-100 text-emerald-700" };
};

const parseAccessRights = (value: unknown): string[] => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
};

export default function Dashboard({
    userCount,
    courseCount,
    userLoginToday,
    outputInvoiceCount,
    inputInvoiceCount,
    bupotCount,
    sptPpnCount,
    sptUnifikasiCount,
    sptPph21Count,
    sptOpCount,
    sptBadanCount,
    runningCourses = [],
}: any) {
    const { flash }: any = usePage().props;

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const formattedTime = currentTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <AdminLayout>
            <Head title="Beranda Admin" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-6 px-4 pt-0">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-primary">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Selamat datang di panel kontrol utama Brevet Learning System.
                            </p>
                        </div>
                        <Button variant="outline" className="shadow-sm hover:bg-muted" asChild>
                            <Link href={route("dashboard")}>
                                Lihat Sebagai Pengguna <MoveRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="relative overflow-hidden p-6 rounded-2xl bg-card border shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-500/20 group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-blue-500/10"></div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-sm font-medium text-muted-foreground">
                                        Jumlah Pengguna
                                    </h2>
                                    <p className="text-4xl font-extrabold tracking-tight text-foreground">
                                        {userCount}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 transition-colors group-hover:bg-blue-500/20">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden p-6 rounded-2xl bg-card border shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-500/20 group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-amber-500/10"></div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-sm font-medium text-muted-foreground">
                                        Jumlah Kelas
                                    </h2>
                                    <p className="text-4xl font-extrabold tracking-tight text-foreground">
                                        {courseCount}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 transition-colors group-hover:bg-amber-500/20">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden p-6 rounded-2xl bg-card border shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/20 group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-emerald-500/10"></div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-sm font-medium text-muted-foreground">
                                        Login Hari Ini
                                    </h2>
                                    <p className="text-4xl font-extrabold tracking-tight text-foreground">
                                        {userLoginToday}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/20">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary to-indigo-950 text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Calendar className="h-28 w-28" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 opacity-80" />
                                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                                        {formattedDate}
                                    </p>
                                </div>
                                <p className="text-3xl font-black tracking-tight leading-none mt-1">
                                    {formattedTime}
                                </p>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
                            <div className="lg:col-span-2">
                                <FakturBupotChart
                                    outputInvoiceCount={outputInvoiceCount}
                                    inputInvoiceCount={inputInvoiceCount}
                                    bupotCount={bupotCount}
                                />
                            </div>
                            <div className="lg:col-span-2">
                                <SPTChart
                                    sptPpnCount={sptPpnCount}
                                    sptUnifikasiCount={sptUnifikasiCount}
                                    sptPph21Count={sptPph21Count}
                                    sptOpCount={sptOpCount ?? 0}
                                    sptBadanCount={sptBadanCount ?? 0}
                                />
                            </div>
                        </div>

                        {/* Running Classes Section */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
                            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
                                    <div>
                                        <h3 className="font-semibold text-lg leading-none tracking-tight">
                                            Kelas yang Sedang Berjalan
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Daftar kelas aktif dengan jadwal yang sedang berlangsung saat ini.
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                        {runningCourses.length} Aktif
                                    </span>
                                </div>
                                <div className="p-6">
                                    {runningCourses.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <p className="text-sm font-medium text-foreground">Tidak ada kelas berjalan</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Saat ini tidak ada kelas dengan jadwal aktif yang sedang berlangsung.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {runningCourses.map((course: any) => {
                                                const status = getCourseStatus(course);
                                                const accessRights = parseAccessRights(course.access_rights);

                                                return (
                                                    <div
                                                        key={course.id}
                                                        className="rounded-xl bg-white border shadow p-5 flex flex-col gap-2 hover:shadow-lg transition"
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h3 className="text-lg font-bold text-primary line-clamp-2">
                                                                {course.name}
                                                            </h3>
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono shrink-0">
                                                                {course.code}
                                                            </span>
                                                        </div>

                                                        <p className="text-gray-600 text-sm line-clamp-2">
                                                            {course.description || "-"}
                                                        </p>

                                                        <div className="text-xs text-gray-600">
                                                            <span className="font-medium">Pemateri:</span>{" "}
                                                            {course.user?.name || "-"}
                                                        </div>

                                                        <div className="text-xs text-gray-500">
                                                            <span className="font-medium">Jadwal:</span>{" "}
                                                            {formatDate(course.start_date)} -{" "}
                                                            {formatDate(course.end_date)}
                                                        </div>

                                                        <div className="text-xs text-gray-500">
                                                            <span className="font-medium">Peserta:</span>{" "}
                                                            {course.participants_count ?? 0}
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span
                                                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${status.className}`}
                                                            >
                                                                {status.label}
                                                            </span>
                                                            {accessRights.length > 0 ? (
                                                                accessRights.map((access: string) => (
                                                                    <span
                                                                        key={`${course.id}-${access}`}
                                                                        className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold"
                                                                    >
                                                                        {access === "efaktur"
                                                                            ? "e-Faktur"
                                                                            : access === "ebupot"
                                                                              ? "e-Bupot"
                                                                              : access}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                    Tidak ada akses materi
                                                                </span>
                                                            )}
                                                        </div>

                                                        <Button
                                                            variant="outline"
                                                            asChild
                                                            className="mt-2 w-fit text-blue-700 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Link
                                                                href={route("admin.showTeacherCourse", {
                                                                    id: course.teacher_id,
                                                                    courseId: course.id,
                                                                })}
                                                            >
                                                                <BookOpen className="h-4 w-4" />
                                                                Lihat Detail
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
