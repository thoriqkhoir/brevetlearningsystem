import { Head, Link, router } from "@inertiajs/react";
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
import TeacherLayout from "@/Layouts/TeacherLayout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { useState } from "react";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";

export default function ModulesIndex({ course, modules, canManage }: any) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
        null
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
                }
            );
        }
    };

    const handleCloseModal = () => {
        setOpenDeleteModal(false);
        setSelectedModuleId(null);
        setSelectedModule(null);
    };

    return (
        <TeacherLayout>
            <Head title={`Modul Kelas ${course.name}`} />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.courses")}>
                                    Daftar Kelas
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link
                                    href={route(
                                        "teacher.showCourse",
                                        course.id
                                    )}
                                >
                                    Kelas {course.name}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Modul {course.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Modul Kelas {course.name}
                                </h1>
                                <p className="text-gray-600">
                                    Total {modules.length} modul
                                </p>
                            </div>
                        </div>

                        {canManage && (
                            <Button asChild>
                                <Link
                                    href={route(
                                        "course.modules.create",
                                        course.id
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
                                : "rounded-xl bg-white border shadow p-4"
                        }`}
                    >
                        {modules.length > 0 ? (
                            modules.map((module: any) => (
                                <Card
                                    key={module.id}
                                    className="hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {module.type === "file" ? (
                                                    <FileText
                                                        className="text-blue-600"
                                                        size={20}
                                                    />
                                                ) : (
                                                    <LinkIcon
                                                        className="text-green-600"
                                                        size={20}
                                                    />
                                                )}
                                            </div>
                                            <Badge variant="outline">
                                                {module.type === "file"
                                                    ? "File"
                                                    : "Link"}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg">
                                            {module.title}
                                        </CardTitle>
                                        {module.description && (
                                            <CardDescription>
                                                {module.description.length > 100
                                                    ? module.description.substring(
                                                          0,
                                                          100
                                                      ) + "..."
                                                    : module.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        {module.type === "file" &&
                                            module.original_filename && (
                                                <p className="text-xs text-gray-500 mb-2">
                                                    File:{" "}
                                                    {module.original_filename}
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
                                                                        module.id
                                                                    ),
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            <Folder size={14} />
                                                            Lihat
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            asChild
                                                        >
                                                            <a
                                                                href={route(
                                                                    "course.module.download",
                                                                    module.id
                                                                )}
                                                                target="_blank"
                                                            >
                                                                <Download
                                                                    size={14}
                                                                />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            window.open(
                                                                module.link_url,
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        <LinkIcon size={14} />
                                                        Buka Link
                                                    </Button>
                                                )}
                                            </div>

                                            {canManage && (
                                                <div className="flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                "course.modules.edit",
                                                                [
                                                                    course.id,
                                                                    module.id,
                                                                ]
                                                            )}
                                                        >
                                                            <Edit size={14} />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDelete(module)
                                                        }
                                                        className="text-red-600 hover:text-red-700"
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
                            <div className="col-span-full text-center py-12">
                                <FileText
                                    className="mx-auto text-gray-400"
                                    size={48}
                                />
                                <h3 className="text-lg font-semibold text-gray-600 mt-4">
                                    Belum ada modul
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    Belum ada modul yang ditambahkan untuk kelas
                                    ini
                                </p>
                                {canManage && (
                                    <Button asChild className="mt-4">
                                        <Link
                                            href={route(
                                                "course.modules.create",
                                                course.id
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
        </TeacherLayout>
    );
}
