    import { Head, Link, router } from "@inertiajs/react";
    import AdminLayout from "@/Layouts/AdminLayout";
    import { Button } from "@/Components/ui/button";
    import {
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbList,
        BreadcrumbPage,
        BreadcrumbSeparator,
    } from "@/Components/ui/breadcrumb";
    import { BookPlus, Edit } from "lucide-react";
    import { format } from "date-fns";
    import { id } from "date-fns/locale";

    export default function DetailTeacher({ user, courses = [], tests = [] }: any) {
        const now = new Date();
        const totalKelas = courses.length;
        const totalUjian = tests.length;
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
            <AdminLayout>
                <Head title={`Detail Pengajar - ${user.name}`} />
                <div className="py-8 mx-auto lg:px-4">
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <Link href={route("admin.teachers")}>
                                        Daftar Pengajar
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Detail Pengajar</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-primary">
                                {user.name}
                            </h1>
                            <Button
                                onClick={() =>
                                    router.visit(
                                        route("admin.editTeacher", user.id)
                                    )
                                }
                            >
                                <Edit />
                                Edit Pengajar
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="col-span-2 p-4 rounded-xl bg-sidebar border">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Nama Pengajar
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>{user.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Email
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>{user.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                No. Telepon
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>{user.phone_number}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Instansi
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>{user.institution ?? "-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Jumlah Maksimal Kelas
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>
                                                {user.max_class != null
                                                    ? `${user.max_class} Kelas`
                                                    : "-"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Jumlah Kelas Saat Ini
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>
                                                {totalKelas} Kelas{" "}
                                                <span className="text-sm text-gray-500">
                                                    {totalKelas == user.max_class
                                                        ? "(Kuota Kelas Penuh)"
                                                        : ""}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Jumlah Maksimal Ujian
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>
                                                {user.max_test != null
                                                    ? `${user.max_test} Ujian`
                                                    : "-"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Jumlah Ujian Saat Ini
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>
                                                {totalUjian} Ujian{" "}
                                                <span className="text-sm text-gray-500">
                                                    {totalUjian == user.max_test
                                                        ? "(Kuota Ujian Penuh)"
                                                        : ""}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-4">
                                                Tanggal Bergabung
                                            </td>
                                            <td className="pr-2">:</td>
                                            <td>
                                                {user.created_at
                                                    ? format(
                                                        new Date(user.created_at),
                                                        "d MMMM yyyy",
                                                        { locale: id }
                                                    )
                                                    : "-"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                    <h2 className="text-sm font-medium">
                                        Total Kelas
                                    </h2>
                                    <p className="text-5xl font-bold text-emerald-800">
                                        {totalKelas}
                                    </p>
                                </div>
                                <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                    <h2 className="text-sm font-medium">
                                        Kelas Aktif
                                    </h2>
                                    <p className="text-5xl font-bold text-sky-800">
                                        {kelasAktif}
                                    </p>
                                </div>
                                <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                    <h2 className="text-sm font-medium">
                                        Belum Mulai
                                    </h2>
                                    <p className="text-5xl font-bold text-orange-800">
                                        {kelasBelumMulai}
                                    </p>
                                </div>
                                <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                    <h2 className="text-sm font-medium">
                                        Kelas Selesai
                                    </h2>
                                    <p className="text-5xl font-bold text-fuchsia-800">
                                        {kelasSelesai}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-0">
                                <div>
                                    <h2 className="text-xl font-semibold text-primary">
                                        Daftar Kelas
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Berikut adalah daftar kelas yang telah
                                        dibuat oleh pengajar ini.
                                    </p>
                                </div>
                                {/* <Button asChild>
                                    <Link href={route("admin.teachers")}>
                                        <BookPlus />
                                        Tambah Kelas Baru
                                    </Link>
                                </Button> */}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {courses.length === 0 && (
                                    <div className="text-gray-400 text-center col-span-3 py-8">
                                        <img
                                            src="/images/empty.svg"
                                            alt="Belum ada kelas yang dibuat"
                                            className="mx-auto mb-4 w-48"
                                        />
                                        Belum ada kelas yang dibuat.
                                    </div>
                                )}
                                {courses.map((course: any) => (
                                    <div
                                        key={course.id}
                                        className="rounded-xl bg-white border shadow p-5 flex flex-col gap-2 hover:shadow-lg transition"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-primary">
                                                {course.name}
                                            </h3>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono">
                                                Kode: {course.code}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {course.description || "-"}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            {course.access_rights ? (
                                                JSON.parse(
                                                    course.access_rights
                                                ).map(
                                                    (
                                                        access: string,
                                                        idx: number
                                                    ) => (
                                                        <span
                                                            key={access}
                                                            className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold"
                                                        >
                                                            {access === "efaktur"
                                                                ? "e-Faktur"
                                                                : access ===
                                                                "ebupot"
                                                                ? "e-Bupot"
                                                                : access}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="italic text-gray-400">
                                                    Tidak ada akses materi
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>
                                                Durasi Pengerjaan:{" "}
                                                {course.start_date
                                                    ? new Date(
                                                        course.start_date
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : "-"}
                                                {" - "}
                                                {course.end_date
                                                    ? new Date(
                                                        course.end_date
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : "-"}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="mt-2 w-fit text-blue-700 border-blue-200 hover:bg-blue-50"
                                        >
                                            <Link
                                                href={route(
                                                    "admin.showTeacherCourse",
                                                    {
                                                        id: user.id,
                                                        courseId: course.id,
                                                    }
                                                )}
                                            >
                                                Lihat Detail
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    {/* Daftar Ujian */}
                    <div className="mt-8">
                        <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-0">
                            <div>
                                <h2 className="text-xl font-semibold text-primary">Daftar Ujian</h2>
                                <p className="text-gray-500 text-sm mb-4">
                                    Berikut adalah daftar ujian yang dibuat oleh pengajar ini.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {tests.length === 0 && (
                                <div className="text-gray-400 text-center col-span-3 py-8">
                                    <img src="/images/empty.svg" alt="Belum ada ujian yang dibuat" className="mx-auto mb-4 w-48" />
                                    Belum ada ujian yang dibuat.
                                </div>
                            )}
                            {tests.map((t: any) => (
                                <div key={t.id} className="rounded-xl bg-white border shadow p-5 flex flex-col gap-2 hover:shadow-lg transition">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-primary">{t.title}</h3>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono">Kode: {t.code}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{t.description || '-'}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>
                                            Jadwal:
                                            {t.start_date
                                                ? ` ${new Date(t.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                                : ' -'}
                                            {" - "}
                                            {t.end_date
                                                ? new Date(t.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>Durasi: {typeof t.duration === 'number' ? `${t.duration} menit` : '-'}</span>
                                        <span className="mx-1">•</span>
                                        <span>KKM: {typeof t.passing_score === 'number' ? t.passing_score : '-'}</span>
                                    </div>
                                    <Button variant="outline" asChild className="mt-2 w-fit text-blue-700 border-blue-200 hover:bg-blue-50">
                                        <Link href={route('admin.showTeacherTest', { id: user.id, testId: t.id })}>Lihat Detail</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
