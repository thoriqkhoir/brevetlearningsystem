import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { useState, useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/Components/ui/pagination";
import AdminLayout from "@/Layouts/AdminLayout";
import { Download, Eye, FileText } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function DetailCourse({
    teacherId,
    course,
    participants = [],
}: any) {
    console.log(course);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageCount = Math.ceil(participants.length / pageSize) || 1;
    const paginatedParticipants = participants.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const [pdfViewOpen, setPdfViewOpen] = useState(false);

    useEffect(() => {
        if (page > pageCount) setPage(pageCount);
    }, [pageCount]);

    const handleViewModul = () => {
        window.open(route("course.viewModul", course.id), "_blank");
    };

    return (
        <AdminLayout>
            <Head title={`Detail Kelas - ${course.name}`} />
            <div className="py-8 mx-auto lg:px-4">
                <Head title={`Detail Kelas - ${course.name}`} />
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
                                <Link
                                    href={route("admin.showTeacher", teacherId)}
                                >
                                    {course.user?.name || "-"}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {" "}
                                    Kelas {course.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="rounded-xl bg-white border shadow p-6 mb-4">
                        <h2 className="text-lg font-bold mb-2 text-primary">
                            Informasi Kelas
                        </h2>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Nama Kelas
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{course.name}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Kode Kelas
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2 text-xs font-semibold">
                                            {course.code || "-"}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Nama Pengajar
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.user?.name || "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Deskripsi
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.description || "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Tanggal Pelaksanaan
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.start_date
                                            ? format(
                                                  new Date(course.start_date),
                                                  "d MMMM yyyy",
                                                  { locale: id }
                                              )
                                            : "-"}
                                        {" - "}
                                        {course.end_date
                                            ? format(
                                                  new Date(course.end_date),
                                                  "d MMMM yyyy",
                                                  { locale: id }
                                              )
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Akses Materi
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.access_rights ? (
                                            JSON.parse(
                                                course.access_rights
                                            ).map((access: string) => (
                                                <span
                                                    key={access}
                                                    className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded mr-2 text-xs font-semibold"
                                                >
                                                    {access === "efaktur"
                                                        ? "e-Faktur"
                                                        : access === "ebupot"
                                                        ? "e-Bupot"
                                                        : access}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="italic text-gray-400">
                                                Tidak ada akses materi
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Modul
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                                className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                            >
                                                <Link
                                                    href={route(
                                                        "admin.showTeacherCourseModules",
                                                        [teacherId, course.id]
                                                    )}
                                                >
                                                    <FileText size={14} />
                                                    Lihat Modul (
                                                    {course.modules_count ||
                                                        "Belum ada modul"}
                                                    )
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* <div className="rounded-xl bg-white border shadow p-6">
                        <h2 className="text-lg font-bold mb-4 text-primary">
                            Daftar Peserta
                        </h2>
                        {participants.length === 0 ? (
                            <div className="text-gray-500 text-center py-8">
                                Belum ada peserta yang terdaftar.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="py-2 px-3 border">
                                                No
                                            </th>
                                            <th className="py-2 px-3 border">
                                                Nama
                                            </th>
                                            <th className="py-2 px-3 border">
                                                Email
                                            </th>
                                            <th className="py-2 px-3 border">
                                                Nilai
                                            </th>
                                            <th className="py-2 px-3 border">
                                                Feedback
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.map(
                                            (p: any, i: number) => (
                                                <tr
                                                    key={p.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="py-2 px-3 border text-center">
                                                        {i + 1}
                                                    </td>
                                                    <td className="py-2 px-3 border">
                                                        {p.user?.name || "-"}
                                                    </td>
                                                    <td className="py-2 px-3 border">
                                                        {p.user?.email || "-"}
                                                    </td>
                                                    <td className="py-2 px-3 border text-center">
                                                        {p.score ?? "-"}
                                                    </td>
                                                    <td className="py-2 px-3 border">
                                                        {p.feedback ?? "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div> */}

                    {participants.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">
                            Belum ada peserta yang terdaftar.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-3 border">No</th>
                                        <th className="py-2 px-3 border">
                                            Nama
                                        </th>
                                        <th className="py-2 px-3 border">
                                            Email
                                        </th>
                                        <th className="py-2 px-3 border">
                                            Nilai
                                        </th>
                                        <th className="py-2 px-3 border">
                                            Feedback
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedParticipants.map(
                                        (p: any, i: number) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-2 px-3 border text-center">
                                                    {(page - 1) * pageSize +
                                                        i +
                                                        1}
                                                </td>
                                                <td className="py-2 px-3 border">
                                                    {p.user?.name || "-"}
                                                </td>
                                                <td className="py-2 px-3 border">
                                                    {p.user?.email || "-"}
                                                </td>
                                                <td className="py-2 px-3 border text-center">
                                                    <div className="font-mono font-bold text-primary">
                                                        {p.average_score !==
                                                        null ? (
                                                            p.average_score
                                                        ) : (
                                                            <span className="italic text-gray-400 text-sm">
                                                                Belum dinilai
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 border">
                                                    {p.feedback ?? "-"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                            {/* Pagination & page size (selalu tampil info + selector) */}
                            <div className="my-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="text-sm text-muted-foreground flex-1 mb-2 md:mb-0">
                                    Menampilkan {(page - 1) * pageSize + 1}
                                    {" - "}
                                    {Math.min(
                                        page * pageSize,
                                        participants.length
                                    )}
                                    {" dari " +
                                        participants.length +
                                        " peserta"}
                                </div>
                                <div className="flex items-center gap-2 justify-end w-full md:w-auto">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (page > 1)
                                                            setPage(page - 1);
                                                    }}
                                                    aria-disabled={page === 1}
                                                />
                                            </PaginationItem>
                                            {page > 2 && (
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setPage(1);
                                                        }}
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}
                                            {page > 3 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            {Array.from(
                                                { length: pageCount },
                                                (_, i) => i + 1
                                            )
                                                .filter(
                                                    (p) =>
                                                        p === 1 ||
                                                        p === pageCount ||
                                                        (p >= page - 1 &&
                                                            p <= page + 1)
                                                )
                                                .map((p) => (
                                                    <PaginationItem key={p}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={
                                                                p === page
                                                            }
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setPage(p);
                                                            }}
                                                        >
                                                            {p}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                            {page < pageCount - 2 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            {page < pageCount - 1 && (
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setPage(pageCount);
                                                        }}
                                                    >
                                                        {pageCount}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (page < pageCount)
                                                            setPage(page + 1);
                                                    }}
                                                    aria-disabled={
                                                        page === pageCount
                                                    }
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                    {/* Page size selector */}
                                    <div className=" sm:flex font-semibold items-center gap-2 text-sm md:ml-4">
                                        <span>Baris per halaman:</span>
                                        <select
                                            className="border rounded px-8 py-1"
                                            value={pageSize}
                                            onChange={(e) => {
                                                const newSize = Number(
                                                    e.target.value
                                                );
                                                setPageSize(newSize);
                                                setPage(1);
                                            }}
                                        >
                                            {[10, 20, 30, 40, 50].map(
                                                (size) => (
                                                    <option
                                                        key={size}
                                                        value={size}
                                                    >
                                                        {size}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
