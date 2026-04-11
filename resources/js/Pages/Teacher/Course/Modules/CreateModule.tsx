import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TeacherLayout from "@/Layouts/TeacherLayout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { FileText, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

const formSchema = z
    .object({
        title: z.string().min(1, "Judul modul harus diisi"),
        description: z.string().nullable().optional(),
        type: z.enum(["file", "link"], {
            required_error: "Pilih jenis modul",
        }),
        link_url: z.string().optional(),
    })
    .refine(
        (data) => {
            if (
                data.type === "link" &&
                (!data.link_url || data.link_url.trim() === "")
            ) {
                return false;
            }
            return true;
        },
        {
            message: "URL harus diisi untuk modul jenis link",
            path: ["link_url"],
        }
    );

export default function CreateModule({ course }: any) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            type: undefined,
            link_url: "",
        },
    });

    const watchType = form.watch("type");

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.type === "file" && !selectedFile) {
            form.setError("title", {
                type: "manual",
                message: "File harus diupload untuk modul jenis file",
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description || "");
        formData.append("type", values.type);

        if (values.type === "file" && selectedFile) {
            formData.append("file", selectedFile);
        } else if (values.type === "link" && values.link_url) {
            formData.append("link_url", values.link_url);
        }

        router.post(route("course.modules.store", course.id), formData, {
            forceFormData: true,
        });
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ];
            if (!allowedTypes.includes(file.type)) {
                alert(
                    "Hanya file PDF, DOC, DOCX, PPT, atau PPTX yang diizinkan"
                );
                return;
            }

            if (file.size > 20 * 1024 * 1024) {
                alert("Ukuran file maksimal 20MB");
                return;
            }

            setSelectedFile(file);

            form.clearErrors("title");
        }
    };

    return (
        <TeacherLayout>
            <Head title={`Tambah Modul - ${course.name}`} />
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
                                <Link
                                    href={route(
                                        "course.modules.index",
                                        course.id
                                    )}
                                >
                                    Modul
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tambah Modul</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold text-primary">
                            Tambah Modul - {course.name}
                        </h1>
                    </div>

                    <div className="p-5 lg:p-8 rounded-xl bg-white border shadow">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Judul Modul*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Masukkan judul modul"
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deskripsi</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={
                                                            field.value || ""
                                                        }
                                                        placeholder="Masukkan deskripsi modul (opsional)"
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Jenis Modul*
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih jenis modul" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="file">
                                                            <div className="flex items-center gap-2">
                                                                <FileText
                                                                    size={16}
                                                                    className="text-blue-600"
                                                                />
                                                                File Upload
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="link">
                                                            <div className="flex items-center gap-2">
                                                                <LinkIcon
                                                                    size={16}
                                                                    className="text-green-600"
                                                                />
                                                                Link/URL
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {watchType === "file" && (
                                        <FormItem>
                                            <FormLabel>Upload File*</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                            className="flex-1"
                                                        />
                                                        <div className="text-xs text-gray-500">
                                                            Max: 20MB
                                                        </div>
                                                    </div>
                                                    {selectedFile && (
                                                        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                                                            <FileText
                                                                className="text-green-600"
                                                                size={16}
                                                            />
                                                            <span className="text-sm text-green-700">
                                                                {
                                                                    selectedFile.name
                                                                }{" "}
                                                                (
                                                                {(
                                                                    selectedFile.size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(
                                                                    2
                                                                )}{" "}
                                                                MB)
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setSelectedFile(
                                                                        null
                                                                    )
                                                                }
                                                                className="ml-auto text-red-500 hover:text-red-700"
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-500">
                                                        Format yang didukung:
                                                        PDF, DOC, DOCX, PPT,
                                                        PPTX (Maks. 20MB)
                                                    </p>
                                                    {watchType === "file" &&
                                                        !selectedFile && (
                                                            <p className="text-xs text-red-500">
                                                                File harus
                                                                diupload untuk
                                                                modul jenis file
                                                            </p>
                                                        )}
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}

                                    {watchType === "link" && (
                                        <FormField
                                            control={form.control}
                                            name="link_url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        URL Link*
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-2">
                                                            <Input
                                                                {...field}
                                                                type="url"
                                                                placeholder="https://example.com/modul"
                                                                autoComplete="off"
                                                            />
                                                            <p className="text-xs text-gray-500">
                                                                Masukkan URL
                                                                lengkap dengan
                                                                https://
                                                            </p>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit">
                                            Simpan Modul
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "course.modules.index",
                                                    course.id
                                                )}
                                            >
                                                Batal
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
