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
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Input } from "@/Components/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useEffect, useState } from "react";
import {
    AlertCircleIcon,
    CalendarIcon,
    Check,
    ChevronsUpDown,
    School,
    FileText,
    Upload,
} from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";

const formSchema = z
    .object({
        id: z.string().uuid(),
        title: z.string().min(1, "title Ujian harus diisi"),
        code: z.string().min(1, "Kode Ujian harus diisi"),
        description: z.string().nullable(),
        question_bank_id: z.string().uuid("Bank soal harus dipilih"),
        questions_to_show: z.number().int().min(1).nullable().optional(),
        duration: z.number().min(0),
        passing_score: z.number().min(0),
        start_date: z.date(),
        // HH:mm format 24-hour
        start_time: z
            .string({ required_error: "Jam mulai harus diisi" })
            .regex(
                /^([01]\d|2[0-3]):[0-5]\d$/,
                "Format jam tidak valid (HH:mm)",
            ),
        end_date: z.date().optional(),
        end_time: z
            .string()
            .optional()
            .refine(
                (val) => !val || /^([01]\d|2[0-3]):[0-5]\d$/.test(val),
                "Format jam selesai tidak valid (HH:mm)",
            ),
    })
    .refine((data) => !data.end_date || data.end_date >= data.start_date, {
        message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
        path: ["end_date"],
    })
    .refine(
        (data) => {
            if (!data.end_date) return true;
            // Compare full datetimes: start_date+start_time <= end_date+end_time
            const start = new Date(data.start_date);
            const [sh, sm] = (data.start_time || "00:00")
                .split(":")
                .map(Number);
            start.setHours(sh ?? 0, sm ?? 0, 0, 0);
            const end = new Date(data.end_date);
            const [eh, em] = (
                data.end_time && data.end_time !== "" ? data.end_time : "23:59"
            )
                .split(":")
                .map(Number);
            end.setHours(eh ?? 0, em ?? 0, 0, 0);
            return end.getTime() >= start.getTime();
        },
        {
            message: "Waktu selesai tidak boleh sebelum waktu mulai",
            path: ["end_time"],
        },
    );

function generateClassCode(length = 8) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default function FormCreateTest({
    tests,
    user,
    questionBanks = [],
}: any) {
    const defaultId = uuidv4();
    const [isCalendar1Open, setIsCalendar1Open] = useState(false);
    const [isCalendar2Open, setIsCalendar2Open] = useState(false);
    const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const minSelectableDate = new Date();
    minSelectableDate.setHours(0, 0, 0, 0);
    const maxSelectableDate = new Date(minSelectableDate);
    maxSelectableDate.setFullYear(maxSelectableDate.getFullYear() + 1);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultId,
            title: "",
            code: generateClassCode(8),
            description: "",
            question_bank_id: "",
            questions_to_show: null,
            duration: 0,
            passing_score: 0,
            // default kosong agar user memilih jam
            start_time: "",
            end_time: "",
        },
    });

    // Clear end_time when end_date is unset to avoid stale values
    const watchedEndDate = form.watch("end_date");
    const watchedQuestionBankId = form.watch("question_bank_id");
    const selectedQuestionBank = questionBanks.find(
        (bank: any) => bank.id === watchedQuestionBankId,
    );
    const maxQuestionsFromBank = Number(
        selectedQuestionBank?.questions_count ?? 0,
    );

    useEffect(() => {
        if (!watchedEndDate) {
            form.setValue("end_time", "");
        }
    }, [watchedEndDate]);

    useEffect(() => {
        if (!watchedQuestionBankId) {
            form.setValue("questions_to_show", null);
            return;
        }

        const current = form.getValues("questions_to_show");
        if (maxQuestionsFromBank <= 0) {
            form.setValue("questions_to_show", null);
            return;
        }

        if (typeof current === "number" && current > maxQuestionsFromBank) {
            form.setValue("questions_to_show", maxQuestionsFromBank);
        }
    }, [watchedQuestionBankId, maxQuestionsFromBank]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Gabungkan tanggal (start_date) dan jam (start_time) menjadi satu timestamp
        const dateStr = format(values.start_date, "yyyy-MM-dd");
        const [hours, minutes] = (values.start_time || "00:00")
            .split(":")
            .map(Number);
        const combined = new Date(values.start_date);
        combined.setHours(hours ?? 0, minutes ?? 0, 0, 0);

        router.post(route("teacher.storeTest"), {
            id: values.id,
            title: values.title,
            code: values.code,
            description: values.description || "",
            question_bank_id: values.question_bank_id,
            questions_to_show: values.questions_to_show ?? null,
            duration: values.duration || 0,
            passing_score: values.passing_score || 0,
            // Simpan dalam satu kolom start_date (timestamp) dengan format Y-m-d H:i:s
            start_date: format(combined, "yyyy-MM-dd HH:mm:ss"),
            // end_date jika diisi, gabungkan tanggal dan end_time (jika kosong -> 23:59:59)
            end_date: values.end_date
                ? (() => {
                      const end = new Date(values.end_date);
                      if (values.end_time && values.end_time !== "") {
                          const [eh, em] = values.end_time
                              .split(":")
                              .map(Number);
                          end.setHours(eh ?? 0, em ?? 0, 0, 0);
                      } else {
                          end.setHours(23, 59, 59, 999);
                      }
                      return format(end, "yyyy-MM-dd HH:mm:ss");
                  })()
                : null,
        });
    }

    return (
        <TeacherLayout>
            <Head title="Tambah Ujian" />

            <div className="teacher-page-shell">
                <div className="teacher-page-stack">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.tests")}>
                                    Daftar Ujian
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tambah Ujian</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="teacher-page-title">
                        Tambah Ujian
                    </h1>

                    <div className="teacher-panel">
                        {tests.length < user.max_test ? (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Judul Ujian
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={
                                                                field.value ??
                                                                ""
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
                                                    <FormLabel>
                                                        Deskripsi
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={
                                                                field.value ??
                                                                ""
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
                                                    <FormLabel className="md:w-1/4">
                                                        Tanggal Mulai
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
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
                                                                    variant={
                                                                        "outline"
                                                                    }
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value &&
                                                                            "text-muted-foreground",
                                                                    )}
                                                                    onClick={() =>
                                                                        setIsCalendar1Open(
                                                                            true,
                                                                        )
                                                                    }
                                                                >
                                                                    {field.value ? (
                                                                        format(
                                                                            field.value,
                                                                            "yyyy-MM-dd",
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pilih
                                                                            Tanggal
                                                                            Mulai
                                                                            Ujian
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
                                                                fromYear={minSelectableDate.getFullYear()}
                                                                toYear={maxSelectableDate.getFullYear()}
                                                                fromDate={
                                                                    minSelectableDate
                                                                }
                                                                toDate={
                                                                    maxSelectableDate
                                                                }
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={(
                                                                    date,
                                                                ) => {
                                                                    field.onChange(
                                                                        date,
                                                                    );
                                                                    setIsCalendar1Open(
                                                                        false,
                                                                    );
                                                                }}
                                                                disabled={(
                                                                    date,
                                                                ) =>
                                                                    date <
                                                                        minSelectableDate ||
                                                                    date >
                                                                        maxSelectableDate
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
                                            name="start_time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="md:w-1/4">
                                                        Jam Mulai
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="time"
                                                            step={60}
                                                            value={
                                                                field.value ??
                                                                ""
                                                            }
                                                            disabled={
                                                                !form.getValues(
                                                                    "start_date",
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="end_date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="md:w-1/4">
                                                        Tanggal Selesai
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
                                                                            "text-muted-foreground",
                                                                    )}
                                                                    onClick={() =>
                                                                        setIsCalendar2Open(
                                                                            true,
                                                                        )
                                                                    }
                                                                >
                                                                    {field.value ? (
                                                                        format(
                                                                            field.value,
                                                                            "yyyy-MM-dd",
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pilih
                                                                            Tanggal
                                                                            Selesai
                                                                            Ujian
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
                                                                fromYear={minSelectableDate.getFullYear()}
                                                                toYear={maxSelectableDate.getFullYear()}
                                                                fromDate={
                                                                    minSelectableDate
                                                                }
                                                                toDate={
                                                                    maxSelectableDate
                                                                }
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={(
                                                                    date,
                                                                ) => {
                                                                    field.onChange(
                                                                        date,
                                                                    );
                                                                    setIsCalendar2Open(
                                                                        false,
                                                                    );
                                                                }}
                                                                disabled={(
                                                                    date,
                                                                ) =>
                                                                    date <
                                                                        minSelectableDate ||
                                                                    date >
                                                                        maxSelectableDate
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
                                            name="end_time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="md:w-1/4">
                                                        Jam Selesai
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="time"
                                                            step={60}
                                                            value={
                                                                field.value ??
                                                                ""
                                                            }
                                                            disabled={
                                                                !form.getValues(
                                                                    "end_date",
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="question_bank_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Bank Soal
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Popover
                                                            open={
                                                                isQuestionBankOpen
                                                            }
                                                            onOpenChange={
                                                                setIsQuestionBankOpen
                                                            }
                                                        >
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "w-full justify-between",
                                                                        !field.value &&
                                                                            "text-muted-foreground",
                                                                    )}
                                                                >
                                                                    <span className="truncate">
                                                                        {field.value
                                                                            ? (() => {
                                                                                  const selected =
                                                                                      questionBanks.find(
                                                                                          (
                                                                                              bank: any,
                                                                                          ) =>
                                                                                              bank.id ===
                                                                                              field.value,
                                                                                      );
                                                                                  return selected
                                                                                      ? `${selected.name}${!selected.is_active ? " (Nonaktif)" : ""}`
                                                                                      : "Pilih bank soal";
                                                                              })()
                                                                            : "Pilih bank soal"}
                                                                    </span>
                                                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Cari bank soal..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>
                                                                            Bank
                                                                            soal
                                                                            tidak
                                                                            ditemukan.
                                                                        </CommandEmpty>
                                                                        <CommandGroup>
                                                                            {questionBanks.map(
                                                                                (
                                                                                    bank: any,
                                                                                ) => (
                                                                                    <CommandItem
                                                                                        key={
                                                                                            bank.id
                                                                                        }
                                                                                        value={`${bank.name} ${bank.id}`}
                                                                                        onSelect={() => {
                                                                                            field.onChange(
                                                                                                bank.id,
                                                                                            );
                                                                                            setIsQuestionBankOpen(
                                                                                                false,
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4",
                                                                                                field.value ===
                                                                                                    bank.id
                                                                                                    ? "opacity-100"
                                                                                                    : "opacity-0",
                                                                                            )}
                                                                                        />
                                                                                        {
                                                                                            bank.name
                                                                                        }
                                                                                        {!bank.is_active
                                                                                            ? " (Nonaktif)"
                                                                                            : ""}
                                                                                    </CommandItem>
                                                                                ),
                                                                            )}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormControl>
                                                    <p className="text-xs text-muted-foreground">
                                                        Kelola bank soal di menu
                                                        Bank Soal.{" "}
                                                        <Link
                                                            href={route(
                                                                "teacher.createQuestionBank",
                                                            )}
                                                            className="text-blue-700 hover:underline"
                                                        >
                                                            Buat bank soal baru
                                                        </Link>
                                                    </p>
                                                    {questionBanks.length ===
                                                        0 && (
                                                        <p className="text-xs text-red-600">
                                                            Belum ada bank soal
                                                            aktif. Buat bank
                                                            soal terlebih
                                                            dahulu.
                                                        </p>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="questions_to_show"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Custom Jumlah Soal
                                                        Ditampilkan
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={
                                                                maxQuestionsFromBank >
                                                                0
                                                                    ? maxQuestionsFromBank
                                                                    : undefined
                                                            }
                                                            value={
                                                                field.value ??
                                                                ""
                                                            }
                                                            placeholder={
                                                                maxQuestionsFromBank >
                                                                0
                                                                    ? `Maksimal ${maxQuestionsFromBank}`
                                                                    : "Pilih bank soal terlebih dahulu"
                                                            }
                                                            disabled={
                                                                !watchedQuestionBankId ||
                                                                maxQuestionsFromBank <=
                                                                    0
                                                            }
                                                            onChange={(e) => {
                                                                const raw =
                                                                    e.target
                                                                        .value;
                                                                if (
                                                                    raw === ""
                                                                ) {
                                                                    field.onChange(
                                                                        null,
                                                                    );
                                                                    return;
                                                                }

                                                                const parsed =
                                                                    Number(raw);
                                                                if (
                                                                    Number.isNaN(
                                                                        parsed,
                                                                    )
                                                                ) {
                                                                    field.onChange(
                                                                        null,
                                                                    );
                                                                    return;
                                                                }

                                                                if (
                                                                    maxQuestionsFromBank >
                                                                    0
                                                                ) {
                                                                    field.onChange(
                                                                        Math.min(
                                                                            parsed,
                                                                            maxQuestionsFromBank,
                                                                        ),
                                                                    );
                                                                    return;
                                                                }

                                                                field.onChange(
                                                                    parsed,
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <p className="text-xs text-muted-foreground">
                                                        Kosongkan jika ingin
                                                        mengikuti total soal
                                                        bank.
                                                        {watchedQuestionBankId
                                                            ? ` Total soal bank saat ini: ${maxQuestionsFromBank}.`
                                                            : ""}
                                                    </p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Durasi Ujian (menit)
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            min={1}
                                                            step={1}
                                                            value={
                                                                field.value ??
                                                                ""
                                                            }
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    e.target
                                                                        .value ===
                                                                        ""
                                                                        ? ""
                                                                        : Number(
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          ),
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="passing_score"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Passing Score (%)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            min={1}
                                                            step={1}
                                                            value={
                                                                field.value ??
                                                                ""
                                                            }
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    e.target
                                                                        .value ===
                                                                        ""
                                                                        ? ""
                                                                        : Number(
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          ),
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
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
                                                        Kode Ujian
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                {...field}
                                                                readOnly
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    form.setValue(
                                                                        "code",
                                                                        generateClassCode(
                                                                            8,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                Generate
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="mt-6"
                                        disabled={questionBanks.length === 0}
                                    >
                                        Simpan
                                    </Button>
                                </form>
                            </Form>
                        ) : (
                            <div className="mx-auto text-center w-fit">
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle className="text-start">
                                        Anda telah mencapai batas maksimal Ujian
                                        yang dapat dibuat.
                                    </AlertTitle>
                                    <AlertDescription>
                                        Silahkan kembali ke daftar Ujian untuk
                                        melihat Ujian yang telah Anda buat.
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    asChild
                                >
                                    <Link href={route("teacher.tests")}>
                                        <School />
                                        Kembali ke Daftar Ujian
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
