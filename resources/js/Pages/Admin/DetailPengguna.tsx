import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Badge } from "@/Components/ui/badge";
import {
    Calendar,
    Clock,
    Edit,
    GraduationCap,
    Key,
    Shield,
    User as UserIcon,
} from "lucide-react";
import FakturKeluaran from "./UserData/FakturKeluaran";
import FakturMasukan from "./UserData/FakturMasukan";
import Bupot from "./UserData/Bupot";
import SPT from "./UserData/SPT";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DetailPengguna({
    user,
    courses = [],
    fakturKeluaranCount = 0,
    fakturMasukanCount = 0,
    bupotCount = 0,
    sptCount = 0,
    fakturs = [],
    bupots = [],
    spts = [],
}: any) {
    const { flash, auth }: any = usePage().props;
    const authUser = auth?.user;
    const isTeacher = authUser?.role === "pengajar";
    const Layout = isTeacher ? TeacherLayout : AdminLayout;

    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleResetPassword = () => {
        const resetRoute = isTeacher
            ? route("teacher.resetPassword", user.id)
            : route("admin.resetPassword", user.id);

        router.post(
            resetRoute,
            {},
            {
                onSuccess: () => {
                    setResetPasswordOpen(false);
                },
            }
        );
    };

    const handleEdit = () => {
        const editRoute = isTeacher
            ? route("teacher.editParticipant", user.id)
            : route("admin.edit", user.id);
        router.visit(editRoute);
    };

    return (
        <Layout>
            <Head
                title={`Detail ${isTeacher ? "Peserta" : "Pengguna"} - ${user.name}`}
            />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link
                                    href={
                                        isTeacher
                                            ? route("teacher.participants")
                                            : route("admin.users")
                                    }
                                >
                                    {isTeacher
                                        ? "Daftar Peserta"
                                        : "Daftar Pengguna"}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Detail{" "}
                                    {isTeacher ? "Peserta" : "Pengguna"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {user.profile_url ? (
                                <img
                                    src={user.profile_url}
                                    alt={`Foto profil ${user.name}`}
                                    className="h-14 w-14 rounded-2xl object-cover shadow-sm ring-2 ring-teal-100"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-xl font-bold text-white shadow-sm">
                                    {user.name
                                        ?.split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase() || "??"}
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-semibold text-primary">
                                        {user.name}
                                    </h1>
                                    {user.platform && (
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                            {user.platform.name}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {user.email} &bull; {user.phone_number}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <AlertDialog
                                open={resetPasswordOpen}
                                onOpenChange={setResetPasswordOpen}
                            >
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100"
                                    >
                                        <Key size={16} />
                                        Reset Kata Sandi
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Reset Kata Sandi
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Apakah Anda yakin ingin mereset kata
                                            sandi untuk{" "}
                                            <span className="font-semibold">
                                                {user.name}
                                            </span>
                                            ? Kata sandi akan diubah menjadi
                                            nomor telepon:{" "}
                                            <span className="font-mono font-semibold">
                                                {user.phone_number}
                                            </span>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-orange-600 hover:bg-orange-700"
                                            onClick={handleResetPassword}
                                        >
                                            Reset Kata Sandi
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button onClick={handleEdit}>
                                <Edit size={16} />
                                Edit {isTeacher ? "Peserta" : "Pengguna"}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="col-span-2 p-5 rounded-xl bg-sidebar border">
                            <h3 className="text-lg font-semibold text-primary mb-3">
                                Biodata & Informasi Pengguna
                            </h3>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600 w-44">
                                            Nama Pengguna
                                        </td>
                                        <td className="py-2 pr-2 w-4">:</td>
                                        <td className="py-2 font-semibold text-gray-900">
                                            {user.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            Email
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2 text-gray-800">
                                            {user.email}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            No. Telepon
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2 font-mono text-gray-800">
                                            {user.phone_number}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            NPWP
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2 font-mono text-gray-800">
                                            {user.npwp ?? "-"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            Alamat
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2 text-gray-800">
                                            {user.address ?? "-"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            Platform
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2 text-gray-800">
                                            {user.platform?.name ?? "-"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            Event
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2 text-gray-800">
                                            {user.event?.name ?? "-"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            Kelas yang Diikuti
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2">
                                            {courses && courses.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 py-0.5">
                                                    {courses.map(
                                                        (c: any) => (
                                                            <Badge
                                                                key={
                                                                    c.id ||
                                                                    c.course_user_id
                                                                }
                                                                variant="outline"
                                                                className="bg-teal-50 text-teal-800 border-teal-200 font-medium"
                                                            >
                                                                {c.name}
                                                                {c.code
                                                                    ? ` (${c.code})`
                                                                    : ""}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Belum terdaftar di kelas
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium pr-4 text-gray-600">
                                            Status Kata Sandi
                                        </td>
                                        <td className="py-2 pr-2">:</td>
                                        <td className="py-2">
                                            <div className="flex items-center gap-2">
                                                {user.is_password_reset ? (
                                                    <>
                                                        <Shield
                                                            className="text-orange-600"
                                                            size={16}
                                                        />
                                                        <span className="text-orange-600 font-medium text-xs sm:text-sm">
                                                            Sudah direset
                                                            (default: no.
                                                            telepon)
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield
                                                            className="text-green-600"
                                                            size={16}
                                                        />
                                                        <span className="text-green-600 font-medium text-xs sm:text-sm">
                                                            Kata sandi masih
                                                            asli
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border flex flex-col justify-center">
                                <h2 className="text-sm font-medium text-gray-600">
                                    Faktur Keluaran
                                </h2>
                                <p className="text-4xl lg:text-5xl font-bold text-emerald-800">
                                    {fakturKeluaranCount}
                                </p>
                            </div>
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border flex flex-col justify-center">
                                <h2 className="text-sm font-medium text-gray-600">
                                    Faktur Masukan
                                </h2>
                                <p className="text-4xl lg:text-5xl font-bold text-sky-800">
                                    {fakturMasukanCount}
                                </p>
                            </div>
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border flex flex-col justify-center">
                                <h2 className="text-sm font-medium text-gray-600">
                                    Bupot
                                </h2>
                                <p className="text-4xl lg:text-5xl font-bold text-orange-800">
                                    {bupotCount}
                                </p>
                            </div>
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border flex flex-col justify-center">
                                <h2 className="text-sm font-medium text-gray-600">
                                    SPT
                                </h2>
                                <p className="text-4xl lg:text-5xl font-bold text-fuchsia-800">
                                    {sptCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section: Kelas yang Diikuti */}
                    <div className="rounded-xl bg-sidebar border p-5 mt-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-primary">
                                        Kelas yang Diikuti
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Daftar kelas atau kursus yang diikuti oleh pengguna ini.
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className="font-semibold bg-teal-50 text-teal-800 border-teal-200"
                            >
                                {courses?.length ?? 0} Kelas
                            </Badge>
                        </div>

                        {courses && courses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {courses.map((course: any) => {
                                    const isMyCourse =
                                        isTeacher &&
                                        course.teacher_id === authUser?.id;

                                    return (
                                        <div
                                            key={
                                                course.id ||
                                                course.course_user_id
                                            }
                                            className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold text-base text-foreground leading-snug line-clamp-2">
                                                        {course.name}
                                                    </h4>
                                                    {course.code && (
                                                        <Badge
                                                            variant="outline"
                                                            className="font-mono text-xs bg-teal-50 text-teal-700 border-teal-200 shrink-0"
                                                        >
                                                            {course.code}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {course.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                )}

                                                <div className="space-y-2 pt-2 border-t text-xs text-muted-foreground">
                                                    {course.teacher && (
                                                        <div className="flex items-center gap-2">
                                                            <UserIcon
                                                                size={14}
                                                                className="text-gray-400 shrink-0"
                                                            />
                                                            <span className="truncate">
                                                                Pengajar:{" "}
                                                                <strong className="text-foreground">
                                                                    {course.teacher.name}
                                                                </strong>
                                                                {isMyCourse && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="ml-1 text-[10px] py-0 px-1 bg-green-50 text-green-700 border-green-200"
                                                                    >
                                                                        Kelas Anda
                                                                    </Badge>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {(course.start_date ||
                                                        course.end_date) && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar
                                                                size={14}
                                                                className="text-gray-400 shrink-0"
                                                            />
                                                            <span>
                                                                {course.start_date
                                                                    ? format(
                                                                          new Date(
                                                                              course.start_date
                                                                          ),
                                                                          "dd MMM yyyy",
                                                                          {
                                                                              locale: id,
                                                                          }
                                                                      )
                                                                    : "-"}
                                                                {" s/d "}
                                                                {course.end_date
                                                                    ? format(
                                                                          new Date(
                                                                              course.end_date
                                                                          ),
                                                                          "dd MMM yyyy",
                                                                          {
                                                                              locale: id,
                                                                          }
                                                                      )
                                                                    : "-"}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {course.joined_at && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock
                                                                size={14}
                                                                className="text-gray-400 shrink-0"
                                                            />
                                                            <span>
                                                                Terdaftar:{" "}
                                                                {format(
                                                                    new Date(
                                                                        course.joined_at
                                                                    ),
                                                                    "dd MMM yyyy HH:mm",
                                                                    {
                                                                        locale: id,
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {course.average_score !==
                                                        null &&
                                                        course.average_score !==
                                                            undefined && (
                                                            <div className="flex items-center justify-between pt-1">
                                                                <span className="text-xs text-muted-foreground">
                                                                    Nilai Rata-rata:
                                                                </span>
                                                                <span className="font-mono font-bold text-sm text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                                                                    {course.average_score}
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="pt-2 border-t flex items-center justify-end gap-2">
                                                {isTeacher &&
                                                    isMyCourse &&
                                                    course.id &&
                                                    course.course_user_id && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs h-7 text-teal-700 border-teal-200 hover:bg-teal-50"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "teacher.showParticipant",
                                                                        [
                                                                            course.id,
                                                                            course.course_user_id,
                                                                        ]
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Lihat Penilaian
                                                        </Button>
                                                    )}
                                                {isTeacher &&
                                                    isMyCourse &&
                                                    course.id && (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="text-xs h-7 bg-teal-600 hover:bg-teal-700 text-white"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "teacher.showCourse",
                                                                        course.id
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Detail Kelas
                                                        </Button>
                                                    )}
                                                {!isTeacher &&
                                                    course.id &&
                                                    course.teacher_id && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs h-7 text-teal-700 border-teal-200 hover:bg-teal-50"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "admin.showTeacherCourse",
                                                                        [
                                                                            course.teacher_id,
                                                                            course.id,
                                                                        ]
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Detail Kelas
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm border border-dashed rounded-lg bg-card/50">
                                <GraduationCap className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                <p className="font-medium text-foreground">
                                    Belum Terdaftar di Kelas
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Pengguna ini saat ini belum terdaftar di
                                    kelas atau kursus manapun.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold text-primary">
                            Data Perpajakan Pengguna
                        </h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Berikut adalah data Faktur Keluaran, Faktur Masukan,
                            Bupot, dan SPT yang telah dibuat oleh pengguna ini.
                        </p>
                        <Tabs defaultValue="faktur-keluaran">
                            <TabsList>
                                <TabsTrigger value="faktur-keluaran">
                                    Faktur Keluaran
                                </TabsTrigger>
                                <TabsTrigger value="faktur-masukan">
                                    Faktur Masukan
                                </TabsTrigger>
                                <TabsTrigger value="bupot">Bupot</TabsTrigger>
                                <TabsTrigger value="spt">SPT</TabsTrigger>
                            </TabsList>
                            <TabsContent value="faktur-keluaran">
                                <FakturKeluaran fakturs={fakturs} />
                            </TabsContent>
                            <TabsContent value="faktur-masukan">
                                <FakturMasukan fakturs={fakturs} />
                            </TabsContent>
                            <TabsContent value="bupot">
                                <Bupot bupots={bupots} />
                            </TabsContent>
                            <TabsContent value="spt">
                                <SPT spts={spts} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
