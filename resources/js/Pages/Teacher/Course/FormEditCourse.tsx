import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Input } from "@/Components/ui/input";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useState } from "react";
import { CalendarIcon, FileText, Trash } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Checkbox } from "@/Components/ui/checkbox";
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

const formSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string().min(1, "Nama kelas harus diisi"),
        code: z.string().min(1, "Kode kelas harus diisi"),
        description: z.string().nullable(),
        start_date: z.date(),
        end_date: z.date(),
        access_rights: z
            .array(z.enum(["efaktur", "ebupot"]))
            .min(1, "Pilih minimal satu hak akses"),
    })
    .refine((data) => data.end_date >= data.start_date, {
        message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
        path: ["end_date"],
    });

export default function FormEditCourse({ course }: any) {
    const [isCalendar1Open, setIsCalendar1Open] = useState(false);
    const [isCalendar2Open, setIsCalendar2Open] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: course.id,
            name: course.name,
            code: course.code,
            description: course.description,
            start_date: course.start_date
                ? new Date(course.start_date)
                : undefined,
            end_date: course.end_date ? new Date(course.end_date) : undefined,
            access_rights: (() => {
                if (Array.isArray(course.access_rights)) {
                    return course.access_rights;
                }
                if (typeof course.access_rights === "string") {
                    try {
                        return JSON.parse(course.access_rights);
                    } catch {
                        return [];
                    }
                }
                return [];
            })(),
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const endDateWithTime = new Date(values.end_date);
        endDateWithTime.setHours(23, 59, 59, 999);

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("name", values.name);
        formData.append("code", values.code);
        formData.append("description", values.description || "");
        formData.append("start_date", format(values.start_date, "yyyy-MM-dd"));
        formData.append(
            "end_date",
            format(endDateWithTime, "yyyy-MM-dd HH:mm:ss")
        );

        values.access_rights.forEach((right, index) => {
            formData.append(`access_rights[${index}]`, right);
        });

        router.post(route("teacher.updateCourse", course.id), formData, {
            forceFormData: true,
        });
    }

    return (
        <TeacherLayout>
            <Head title="Edit Kelas" />
            <div className="teacher-page-shell">
                <div className="teacher-page-stack">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.courses")}>
                                    Daftar Kelas
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit Kelas</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="teacher-page-title">
                        Edit Kelas
                    </h1>

                    <div className="teacher-panel">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nama Kelas*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={
                                                            field.value ?? ""
                                                        }
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
                                                            field.value ?? ""
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="start_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Tanggal Mulai*
                                                </FormLabel>
                                                <Popover
                                                    open={isCalendar1Open}
                                                    onOpenChange={
                                                        setIsCalendar1Open
                                                    }
                                                >
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                                onClick={() =>
                                                                    setIsCalendar1Open(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                {field.value ? (
                                                                    format(
                                                                        field.value,
                                                                        "yyyy-MM-dd"
                                                                    )
                                                                ) : (
                                                                    <span>
                                                                        Pilih
                                                                        Tanggal
                                                                        Mulai
                                                                        Kelas
                                                                    </span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                field.value
                                                            }
                                                            onSelect={(
                                                                date
                                                            ) => {
                                                                field.onChange(
                                                                    date
                                                                );
                                                                setIsCalendar1Open(
                                                                    false
                                                                );
                                                            }}
                                                            disabled={(date) =>
                                                                date <
                                                                new Date(
                                                                    new Date().setHours(
                                                                        0,
                                                                        0,
                                                                        0,
                                                                        0
                                                                    )
                                                                )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Tanggal Selesai*
                                                </FormLabel>
                                                <Popover
                                                    open={isCalendar2Open}
                                                    onOpenChange={
                                                        setIsCalendar2Open
                                                    }
                                                >
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value &&
                                                                        "text-muted-foreground"
                                                                )}
                                                                onClick={() =>
                                                                    setIsCalendar2Open(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                {field.value ? (
                                                                    format(
                                                                        field.value,
                                                                        "yyyy-MM-dd"
                                                                    )
                                                                ) : (
                                                                    <span>
                                                                        Pilih
                                                                        Tanggal
                                                                        Selesai
                                                                        Kelas
                                                                    </span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                field.value
                                                            }
                                                            onSelect={(
                                                                date
                                                            ) => {
                                                                field.onChange(
                                                                    date
                                                                );
                                                                setIsCalendar2Open(
                                                                    false
                                                                );
                                                            }}
                                                            disabled={(date) =>
                                                                date <
                                                                new Date(
                                                                    new Date().setHours(
                                                                        0,
                                                                        0,
                                                                        0,
                                                                        0
                                                                    )
                                                                )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Kode Kelas*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="access_rights"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>
                                                        Hak Akses*
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="flex flex-col gap-2">
                                                            <label className="flex items-center gap-2">
                                                                <Checkbox
                                                                    checked={field.value?.includes(
                                                                        "efaktur"
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        const newValue =
                                                                            checked
                                                                                ? [
                                                                                      ...(field.value ||
                                                                                          []),
                                                                                      "efaktur",
                                                                                  ]
                                                                                : field.value?.filter(
                                                                                      (
                                                                                          v
                                                                                      ) =>
                                                                                          v !==
                                                                                          "efaktur"
                                                                                  );
                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                />
                                                                <span>
                                                                    e-Faktur
                                                                </span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <Checkbox
                                                                    checked={field.value?.includes(
                                                                        "ebupot"
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        const newValue =
                                                                            checked
                                                                                ? [
                                                                                      ...(field.value ||
                                                                                          []),
                                                                                      "ebupot",
                                                                                  ]
                                                                                : field.value?.filter(
                                                                                      (
                                                                                          v
                                                                                      ) =>
                                                                                          v !==
                                                                                          "ebupot"
                                                                                  );
                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                />
                                                                <span>
                                                                    eBupot
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                                <Button type="submit" className="mt-6">
                                    Simpan Perubahan
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
