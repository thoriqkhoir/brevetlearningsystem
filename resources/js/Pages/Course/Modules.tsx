import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    FileText,
    Link as LinkIcon,
    Plus,
    Download,
    Edit,
    Trash,
    Folder,
} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { useState } from "react";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";

export default function ModulesIndex({
    teacher,
    course,
    modules,
    canManage,
}: any) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
        null,
    );
    const [selectedModule, setSelectedModule] = useState<any>(null);

    const handleDelete = (module: any) => {
        setSelectedModuleId(module.id);
        setSelectedModule(module);
        setOpenDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedModuleId) {
            router.delete(
                route("course.modules.destroy", [course.id, selectedModuleId]),
                {
                    onSuccess: () => {
                        setOpenDeleteModal(false);
                        setSelectedModuleId(null);
                        setSelectedModule(null);
                    },
                },
            );
        }
    };

    const handleCloseModal = () => {
        setOpenDeleteModal(false);
        setSelectedModuleId(null);
        setSelectedModule(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Modul Kelas ${course.name}`} />

            <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-cyan-50/60 via-white to-teal-50/60">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(13,148,136,0.16),_transparent_38%)]" />
                <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <div className="flex flex-1 flex-col gap-6">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <Link href={route("courses")}>
                                        Daftar Kelas
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Link
                                        href={route(
                                            "courses.detail",
                                            course.id,
                                        )}
                                    >
                                        Kelas {course.name}
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Modul Kelas</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="rounded-3xl border border-cyan-200/70 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                                    Manajemen Materi
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold text-slate-800 md:text-3xl">
                                    Modul Kelas {course.name}
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Pengajar: {teacher?.name} | Total{" "}
                                    {modules.length} modul
                                </p>
                                <div className="mt-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                                    Kelola materi file dan link dalam satu
                                    tempat
                                </div>
                            </div>

                            {canManage && (
                                <Button variant="accent" asChild>
                                    <Link
                                        href={route(
                                            "course.modules.create",
                                            course.id,
                                        )}
                                    >
                                        <Plus size={16} />
                                        Tambah Modul
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <div
                            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
                                modules.length > 0
                                    ? ""
                                    : "rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
                            }`}
                        >
                            {modules.length > 0 ? (
                                modules.map((module: any) => (
                                    <Card
                                        key={module.id}
                                        className="flex flex-col justify-between rounded-2xl border border-teal-100 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                                                    {module.type === "file" ? (
                                                        <FileText
                                                            className="text-teal-700"
                                                            size={20}
                                                        />
                                                    ) : (
                                                        <LinkIcon
                                                            className="text-cyan-700"
                                                            size={20}
                                                        />
                                                    )}
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        module.type === "file"
                                                            ? "border-teal-200 bg-teal-50 text-teal-700"
                                                            : "border-cyan-200 bg-cyan-50 text-cyan-700"
                                                    }
                                                >
                                                    {module.type === "file"
                                                        ? "File"
                                                        : "Link"}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg text-slate-800">
                                                {module.title}
                                            </CardTitle>
                                            {module.description && (
                                                <CardDescription className="text-slate-600">
                                                    {module.description.length >
                                                    100
                                                        ? module.description.substring(
                                                              0,
                                                              100,
                                                          ) + "..."
                                                        : module.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            {module.type === "file" &&
                                                module.original_filename && (
                                                    <p className="mb-2 text-xs text-slate-500">
                                                        File:{" "}
                                                        {
                                                            module.original_filename
                                                        }
                                                    </p>
                                                )}
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2 flex-wrap">
                                                    {module.type === "file" ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    window.open(
                                                                        route(
                                                                            "course.module.view",
                                                                            module.id,
                                                                        ),
                                                                        "_blank",
                                                                    )
                                                                }
                                                            >
                                                                <Folder
                                                                    size={14}
                                                                />
                                                                Lihat
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={route(
                                                                        "course.module.download",
                                                                        module.id,
                                                                    )}
                                                                    target="_blank"
                                                                >
                                                                    <Download
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Download
                                                                </a>
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="info"
                                                            onClick={() =>
                                                                window.open(
                                                                    module.link_url,
                                                                    "_blank",
                                                                )
                                                            }
                                                        >
                                                            <LinkIcon
                                                                size={14}
                                                            />
                                                            Buka Link
                                                        </Button>
                                                    )}
                                                </div>

                                                {canManage && (
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "course.modules.edit",
                                                                    [
                                                                        course.id,
                                                                        module.id,
                                                                    ],
                                                                )}
                                                            >
                                                                <Edit
                                                                    size={14}
                                                                />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    module,
                                                                )
                                                            }
                                                        >
                                                            <Trash size={14} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full rounded-2xl border border-dashed border-teal-200 bg-white/85 py-12 text-center">
                                    <FileText
                                        className="mx-auto text-teal-300"
                                        size={48}
                                    />
                                    <h3 className="mt-4 text-lg font-semibold text-slate-700">
                                        Belum ada modul
                                    </h3>
                                    <p className="mt-2 text-slate-500">
                                        Belum ada modul yang ditambahkan untuk
                                        kelas ini
                                    </p>
                                    {canManage && (
                                        <Button
                                            variant="accent"
                                            asChild
                                            className="mt-4"
                                        >
                                            <Link
                                                href={route(
                                                    "course.modules.create",
                                                    course.id,
                                                )}
                                            >
                                                <Plus size={16} />
                                                Tambah Modul Pertama
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                        <ConfirmDialog
                            title="Hapus Modul"
                            description={
                                selectedModule
                                    ? `Apakah Anda yakin ingin menghapus modul "${selectedModule.title}"? Tindakan ini tidak dapat dibatalkan.`
                                    : "Apakah Anda yakin ingin menghapus modul ini?"
                            }
                            open={openDeleteModal}
                            onClose={handleCloseModal}
                            onConfirm={handleDeleteConfirm}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
