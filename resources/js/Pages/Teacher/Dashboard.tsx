"use client";

import * as React from "react";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { BookOpen, BookPlus, CheckCircle, Clock, School } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface CourseStats {
    date: string;
    courseRegistrations: number;
    testRegistrations: number;
}

export default function Dashboard({
    courses = [],
    courseStats = [],
}: {
    courses: any[];
    courseStats: CourseStats[];
}) {
    const { flash }: any = usePage().props;
    const [timeRange, setTimeRange] = React.useState("90d");
    const [filteredStats, setFilteredStats] = React.useState(courseStats);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const now = new Date();
        const filterData = () => {
            const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
            const cutoffDate = new Date(
                now.getTime() - days * 24 * 60 * 60 * 1000
            );

            return courseStats.filter((stat) => {
                const statDate = new Date(stat.date);
                return statDate >= cutoffDate && statDate <= now;
            });
        };

        setFilteredStats(filterData());
    }, [timeRange, courseStats]);

    const now = new Date();
    const totalKelas = courses.length;
    const kelasAktif = courses.filter(
        (c: any) => new Date(c.start_date) <= now && new Date(c.end_date) >= now
    ).length;
    const kelasSelesai = courses.filter(
        (c: any) => new Date(c.end_date) < now
    ).length;
    const kelasBelumMulai = courses.filter(
        (c: any) => new Date(c.start_date) > now
    ).length;

    return (
        <TeacherLayout>
            <Head title="Dashboard Pengajar" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <h1 className="text-2xl font-semibold text-primary">
                            Dashboard Pengajar
                        </h1>
                        <Button asChild>
                            <Link href={route("teacher.createCourse")}>
                                <BookPlus />
                                Buat Kelas Baru
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            asChild
                            className="inline-flex md:hidden"
                        >
                            <Link href={route("teacher.courses")}>
                                <School />
                                Lihat Daftar Kelas
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="rounded-xl bg-gradient-to-r from-white to-orange-50 border shadow p-5 flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-orange-100 to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <BookOpen
                                    size={32}
                                    className="text-primary mb-2 mx-auto"
                                />
                                <div className="text-3xl font-bold text-center text-primary">
                                    {totalKelas}
                                </div>
                                <div className="text-gray-500 text-sm text-center">
                                    Total Kelas
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-green-50 to-orange-50 border border-green-200 shadow p-5 flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-orange-100 to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <CheckCircle
                                    size={32}
                                    className="text-green-600 mb-2 mx-auto"
                                />
                                <div className="text-3xl font-bold text-center text-green-700">
                                    {kelasAktif}
                                </div>
                                <div className="text-green-700 text-sm text-center">
                                    Kelas Aktif
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-gray-50 to-orange-50 border border-gray-200 shadow p-5 flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-orange-100 to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <Clock
                                    size={32}
                                    className="text-gray-500 mb-2 mx-auto"
                                />
                                <div className="text-3xl font-bold text-center text-gray-700">
                                    {kelasBelumMulai}
                                </div>
                                <div className="text-gray-700 text-sm text-center">
                                    Belum Mulai
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 shadow p-5 flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-orange-100 to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <CheckCircle
                                    size={32}
                                    className="text-red-600 mb-2 mx-auto"
                                />
                                <div className="text-3xl font-bold text-center text-red-700">
                                    {kelasSelesai}
                                </div>
                                <div className="text-red-700 text-sm text-center">
                                    Kelas Selesai
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="pt-0">
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1">
                                <CardTitle>
                                    Statistik Pendaftar Kelas dan Test
                                </CardTitle>
                                <CardDescription>
                                    Menampilkan jumlah pendaftar kelas dan test
                                    dalam 3 bulan terakhir
                                </CardDescription>
                            </div>
                            <Select
                                value={timeRange}
                                onValueChange={setTimeRange}
                            >
                                <SelectTrigger
                                    className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                                    aria-label="Select a value"
                                >
                                    <SelectValue placeholder="3 Bulan Terakhir" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem
                                        value="90d"
                                        className="rounded-lg"
                                    >
                                        3 Bulan Terakhir
                                    </SelectItem>
                                    <SelectItem
                                        value="30d"
                                        className="rounded-lg"
                                    >
                                        30 Hari Terakhir
                                    </SelectItem>
                                    <SelectItem
                                        value="7d"
                                        className="rounded-lg"
                                    >
                                        7 Hari Terakhir
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            <div className="flex gap-4 mb-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-[#4ade80]"></div>
                                    <span className="text-sm text-gray-600">
                                        Pendaftar Kelas
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-[#60a5fa]"></div>
                                    <span className="text-sm text-gray-600">
                                        Pendaftar Test
                                    </span>
                                </div>
                            </div>
                            <ChartContainer
                                config={{
                                    courseRegistrations: {
                                        label: "Pendaftar Kelas",
                                        color: "#4ade80",
                                    },
                                    testRegistrations: {
                                        label: "Pendaftar Test",
                                        color: "#60a5fa",
                                    },
                                }}
                                className="aspect-auto h-[250px] w-full"
                            >
                                <AreaChart data={filteredStats}>
                                    <defs>
                                        <linearGradient
                                            id="fillCourse"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#4ade80"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#4ade80"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="fillTest"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#60a5fa"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#60a5fa"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString(
                                                "id-ID",
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            );
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(value) => {
                                                    return new Date(
                                                        value
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    );
                                                }}
                                                indicator="dot"
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="courseRegistrations"
                                        name="Pendaftar Kelas"
                                        type="bump"
                                        fill="url(#fillCourse)"
                                        stroke="#4ade80"
                                        strokeWidth={2}
                                        stackId="1"
                                    />
                                    <Area
                                        dataKey="testRegistrations"
                                        name="Pendaftar Test"
                                        type="bump"
                                        fill="url(#fillTest)"
                                        stroke="#60a5fa"
                                        strokeWidth={2}
                                        stackId="2"
                                    />
                                    <ChartLegend
                                        content={<ChartLegendContent />}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TeacherLayout>
    );
}

const chartData = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    // ... data lainnya
];
