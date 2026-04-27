"use client";

import * as React from "react";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
    BookOpen,
    BookPlus,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Database,
    GraduationCap,
    School,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";
import { id } from "date-fns/locale";

interface CourseStats {
    date: string;
    courseRegistrations: number;
    testRegistrations: number;
}

function getStatus(start: string, end: string) {
    const now = new Date();
    if (isBefore(now, new Date(start))) return "upcoming";
    if (isAfter(now, new Date(end))) return "finished";
    return "ongoing";
}

export default function Dashboard({
    courses = [],
    courseStats = [],
}: {
    courses: any[];
    courseStats: CourseStats[];
}) {
    const { flash, auth }: any = usePage().props;
    const user = auth?.user;
    const [timeRange, setTimeRange] = React.useState("90d");
    const [filteredStats, setFilteredStats] = React.useState(courseStats);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const now = new Date();
        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        setFilteredStats(
            courseStats.filter((s) => {
                const d = new Date(s.date);
                return d >= cutoff && d <= now;
            }),
        );
    }, [timeRange, courseStats]);

    const now = new Date();
    const totalKelas = courses.length;
    const kelasAktif = courses.filter((c) =>
        isWithinInterval(now, { start: new Date(c.start_date), end: new Date(c.end_date) }),
    ).length;
    const kelasSelesai = courses.filter((c) => isAfter(now, new Date(c.end_date))).length;
    const kelasBelumMulai = courses.filter((c) => isBefore(now, new Date(c.start_date))).length;

    const totalSchedules = courses.reduce(
        (acc: number, c: any) => acc + Number(c.course_schedules_count ?? 0),
        0,
    );
    const totalTests = courses.reduce(
        (acc: number, c: any) => acc + Number(c.course_tests_count ?? 0),
        0,
    );
    const totalParticipants = courses.reduce(
        (acc: number, c: any) => acc + Number(c.participants_count ?? 0),
        0,
    );

    const getInitials = (name: string) =>
        name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() ?? "??";

    const upcomingSchedules = courses
        .flatMap((c: any) =>
            (c.course_schedules ?? []).map((s: any) => ({
                ...s,
                courseName: c.name,
                courseId: c.id,
            })),
        )
        .filter((s: any) => isAfter(new Date(s.scheduled_at), now))
        .sort(
            (a: any, b: any) =>
                new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
        )
        .slice(0, 4);

    const activeAndUpcomingCourses = courses
        .filter((c: any) => getStatus(c.start_date, c.end_date) !== "finished")
        .slice(0, 4);

    const statCards = [
        {
            label: "Total Kelas",
            value: totalKelas,
            icon: BookOpen,
            color: "text-teal-700",
            bg: "bg-teal-50/80 border-teal-100",
            iconBg: "bg-teal-100",
        },
        {
            label: "Kelas Aktif",
            value: kelasAktif,
            icon: CheckCircle2,
            color: "text-emerald-700",
            bg: "bg-emerald-50/80 border-emerald-100",
            iconBg: "bg-emerald-100",
        },
        {
            label: "Belum Mulai",
            value: kelasBelumMulai,
            icon: Clock3,
            color: "text-slate-600",
            bg: "bg-slate-50/80 border-slate-200",
            iconBg: "bg-slate-100",
        },
        {
            label: "Kelas Selesai",
            value: kelasSelesai,
            icon: GraduationCap,
            color: "text-rose-600",
            bg: "bg-rose-50/80 border-rose-100",
            iconBg: "bg-rose-100",
        },
        {
            label: "Total Jadwal",
            value: totalSchedules,
            icon: CalendarClock,
            color: "text-cyan-700",
            bg: "bg-cyan-50/80 border-cyan-100",
            iconBg: "bg-cyan-100",
        },
        {
            label: "Total Ujian",
            value: totalTests,
            icon: Target,
            color: "text-amber-700",
            bg: "bg-amber-50/80 border-amber-100",
            iconBg: "bg-amber-100",
        },
        {
            label: "Total Peserta",
            value: totalParticipants,
            icon: Users,
            color: "text-teal-700",
            bg: "bg-teal-50/80 border-teal-100",
            iconBg: "bg-teal-100",
        },
    ];

    const statusMap: Record<string, { label: string; cls: string }> = {
        ongoing: { label: "Aktif", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        upcoming: { label: "Belum Mulai", cls: "bg-slate-100 text-slate-600 border-slate-200" },
        finished: { label: "Selesai", cls: "bg-rose-100 text-rose-700 border-rose-200" },
    };

    return (
        <TeacherLayout>
            <Head title="Dashboard Pengajar" />

            <div className="teacher-page-shell">
                <div className="teacher-page-stack">

                    {/* ── Hero Header ───────────────────────────────────── */}
                    <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-xl font-bold text-white shadow-md">
                                    {user ? getInitials(user.name) : "??"}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                        Teacher Portal
                                    </p>
                                    <h1 className="mt-0.5 text-2xl font-semibold text-slate-800 md:text-3xl">
                                        Selamat datang, {user?.name?.split(" ")[0] ?? "Pengajar"}!
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Pantau seluruh aktivitas kelas, ujian, dan peserta Anda.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button asChild>
                                    <Link href={route("teacher.createCourse")}>
                                        <BookPlus size={16} />
                                        Buat Kelas Baru
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route("teacher.courses")}>
                                        <School size={16} />
                                        Daftar Kelas
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ────────────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                        {statCards.map((s) => (
                            <div
                                key={s.label}
                                className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md ${s.bg}`}
                            >
                                <div className={`mb-2 w-fit rounded-xl p-1.5 ${s.iconBg}`}>
                                    <s.icon size={16} className={s.color} />
                                </div>
                                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Main Grid: Chart + Active Classes ─────────────── */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

                        {/* Chart */}
                        <div className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-md backdrop-blur-sm md:p-6">
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                        Analitik
                                    </p>
                                    <h2 className="mt-1 text-lg font-semibold text-slate-800">
                                        Statistik Pendaftar
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Pendaftar kelas dan ujian dalam periode terpilih
                                    </p>
                                </div>
                                <Select value={timeRange} onValueChange={setTimeRange}>
                                    <SelectTrigger className="w-[155px] rounded-xl border-teal-200 text-sm">
                                        <SelectValue placeholder="3 Bulan Terakhir" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="90d" className="rounded-lg">3 Bulan Terakhir</SelectItem>
                                        <SelectItem value="30d" className="rounded-lg">30 Hari Terakhir</SelectItem>
                                        <SelectItem value="7d" className="rounded-lg">7 Hari Terakhir</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Legend */}
                            <div className="mb-4 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-teal-500" />
                                    <span className="text-xs font-medium text-slate-600">Pendaftar Kelas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                                    <span className="text-xs font-medium text-slate-600">Pendaftar Ujian</span>
                                </div>
                            </div>

                            <div className="h-[220px] w-full">
                                {filteredStats.length === 0 ? (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-center">
                                            <TrendingUp size={40} className="mx-auto mb-2 text-teal-200" />
                                            <p className="text-sm text-slate-400">Belum ada data statistik.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={filteredStats} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gradCourse" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.03} />
                                                </linearGradient>
                                                <linearGradient id="gradTest" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.03} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                minTickGap={32}
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                tickFormatter={(v) =>
                                                    new Date(v).toLocaleDateString("id-ID", { month: "short", day: "numeric" })
                                                }
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                width={30}
                                            />
                                            <Tooltip
                                                labelFormatter={(v) =>
                                                    new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                                }
                                                formatter={(val: any, name: string) => [
                                                    val,
                                                    name === "courseRegistrations" ? "Pendaftar Kelas" : "Pendaftar Ujian",
                                                ]}
                                                contentStyle={{
                                                    borderRadius: "12px",
                                                    border: "1px solid #e2e8f0",
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Area dataKey="courseRegistrations" type="bump" fill="url(#gradCourse)" stroke="#0d9488" strokeWidth={2} />
                                            <Area dataKey="testRegistrations" type="bump" fill="url(#gradTest)" stroke="#f59e0b" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Active / Upcoming Classes */}
                        <div className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-md backdrop-blur-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                        Kelas
                                    </p>
                                    <h2 className="mt-1 text-lg font-semibold text-slate-800">
                                        Kelas Aktif & Mendatang
                                    </h2>
                                </div>
                                <Button variant="outline" size="sm" asChild className="border-teal-200 text-teal-700 hover:bg-teal-50">
                                    <Link href={route("teacher.courses")}>Semua</Link>
                                </Button>
                            </div>

                            {activeAndUpcomingCourses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <BookOpen size={36} className="mb-3 text-teal-200" />
                                    <p className="text-sm text-slate-400">Belum ada kelas aktif.</p>
                                    <Button asChild className="mt-4" size="sm">
                                        <Link href={route("teacher.createCourse")}>Buat Kelas</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {activeAndUpcomingCourses.map((course: any) => {
                                        const st = getStatus(course.start_date, course.end_date);
                                        const badge = statusMap[st];
                                        return (
                                            <Link
                                                key={course.id}
                                                href={route("teacher.showCourse", course.id)}
                                                className="block rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3 transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                                                        {course.name}
                                                    </p>
                                                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <div className="mt-1.5 flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                                        <Users size={11} />
                                                        {course.participants_count ?? 0} peserta
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                                        <CalendarClock size={11} />
                                                        {course.course_schedules_count ?? 0} jadwal
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                                        <Database size={11} />
                                                        {course.course_tests_count ?? 0} ujian
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Upcoming Schedules ────────────────────────────── */}
                    <div className="rounded-2xl border border-cyan-100 bg-white/90 p-5 shadow-md backdrop-blur-sm md:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                                    Jadwal
                                </p>
                                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                                    Jadwal Kelas Mendatang
                                </h2>
                            </div>
                            <Button variant="outline" size="sm" asChild className="border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                                <Link href={route("teacher.courses")}>Lihat Kelas</Link>
                            </Button>
                        </div>

                        {upcomingSchedules.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <CalendarClock size={36} className="mb-3 text-cyan-200" />
                                <p className="text-sm text-slate-400">Belum ada jadwal mendatang.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {upcomingSchedules.map((s: any) => (
                                    <div
                                        key={s.id}
                                        className="rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3"
                                    >
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-700">
                                            {s.courseName}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-800 line-clamp-1">
                                            {s.title}
                                        </p>
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                                            <CalendarClock size={12} className="text-cyan-500 shrink-0" />
                                            {format(new Date(s.scheduled_at), "d MMM yyyy • HH:mm", { locale: id })}
                                        </p>
                                        {s.zoom_link && (
                                            <a
                                                href={s.zoom_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 inline-block text-xs font-medium text-teal-600 hover:underline"
                                            >
                                                Buka Link Meeting →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Quick Actions ─────────────────────────────────── */}
                    <div className="rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-md backdrop-blur-sm md:p-6">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                            Aksi Cepat
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                { label: "Buat Kelas", icon: BookPlus, href: route("teacher.createCourse"), variant: "default" as const },
                                { label: "Daftar Kelas", icon: School, href: route("teacher.courses"), variant: "outline" as const },
                                { label: "Daftar Peserta", icon: Users, href: route("teacher.participants"), variant: "outline" as const },
                                { label: "Bank Soal", icon: Database, href: route("teacher.questionBanks"), variant: "outline" as const },
                            ].map((a) => (
                                <Button key={a.label} variant={a.variant} asChild className="h-auto flex-col gap-2 py-4">
                                    <Link href={a.href}>
                                        <a.icon size={20} />
                                        <span className="text-xs font-semibold">{a.label}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </TeacherLayout>
    );
}
