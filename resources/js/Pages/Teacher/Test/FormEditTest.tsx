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
import { useEffect, useState } from "react";
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    FileText,
    Trash,
} from "lucide-react";
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
        title: z.string().min(1, "Judul Ujian harus diisi"),
        code: z.string().min(1, "Kode Ujian harus diisi"),
        description: z.string().nullable(),
        question_bank_id: z.string().uuid("Bank soal harus dipilih"),
        questions_to_show: z.number().int().min(1).nullable().optional(),
        duration: z.number().min(1, "Durasi harus diisi"),
        passing_score: z.number().min(0).max(100),
        start_date: z.date(),
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

export default function FormEditTest({ test, questionBanks = [] }: any) {
    const [isCalendar1Open, setIsCalendar1Open] = useState(false);
    const [isCalendar2Open, setIsCalendar2Open] = useState(false);
    const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [removeExistingModul, setRemoveExistingModul] = useState(false);
    const minSelectableDate = new Date();
    minSelectableDate.setHours(0, 0, 0, 0);
    const maxSelectableDate = new Date(minSelectableDate);
    maxSelectableDate.setFullYear(maxSelectableDate.getFullYear() + 1);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: test.id,
            title: test.title,
            code: test.code,
            description: test.description,
            question_bank_id: test.question_bank_id ?? "",
            questions_to_show: test.questions_to_show ?? null,
            duration: test.duration,
            passing_score: test.passing_score,
            start_date: test.start_date ? new Date(test.start_date) : undefined,
            start_time: test.start_date
                ? (() => {
                      const d = new Date(test.start_date);
                      const hh = `${d.getHours()}`.padStart(2, "0");
                      const mm = `${d.getMinutes()}`.padStart(2, "0");
                      return `${hh}:${mm}`;
                  })()
                : "",
            end_date: test.end_date ? new Date(test.end_date) : undefined,
            end_time: test.end_date
                ? (() => {
                      const d = new Date(test.end_date);
                      const hh = `${d.getHours()}`.padStart(2, "0");
                      const mm = `${d.getMinutes()}`.padStart(2, "0");
                      return `${hh}:${mm}`;
                  })()
                : "",
        },
    });

    // Clear end_time when end_date is removed
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
        // Gabungkan tanggal dan jam ke start_date timestamp
        const combined = new Date(values.start_date);
        const [hours, minutes] = (values.start_time || "00:00")
            .split(":")
            .map(Number);
        combined.setHours(hours ?? 0, minutes ?? 0, 0, 0);

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("title", values.title);
        formData.append("code", values.code);
        formData.append("description", values.description || "");
        formData.append("question_bank_id", values.question_bank_id);
        formData.append(
            "questions_to_show",
            values.questions_to_show === null ||
                typeof values.questions_to_show === "undefined"
                ? ""
                : values.questions_to_show.toString(),
        );
        formData.append("duration", values.duration.toString());
        formData.append("passing_score", values.passing_score.toString());
        formData.append("start_date", format(combined, "yyyy-MM-dd HH:mm:ss"));
        if (values.end_date) {
            const end = new Date(values.end_date);
            if (values.end_time && values.end_time !== "") {
                const [eh, em] = values.end_time.split(":").map(Number);
                end.setHours(eh ?? 0, em ?? 0, 0, 0);
            } else {
                end.setHours(23, 59, 59, 999);
            }
            formData.append("end_date", format(end, "yyyy-MM-dd HH:mm:ss"));
        } else {
            formData.append("end_date", "");
        }

        router.post(route("teacher.updateTest", test.id), formData, {
            forceFormData: true,
        });
    }

    return (
        <TeacherLayout>
            <Head title="Edit Ujian" />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.tests")}>
                                    Daftar Ujian
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit Ujian</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Edit Ujian
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Judul Ujian*
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
                                                            disabled={(date) =>
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
                                                <FormLabel>
                                                    Jam Mulai*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="time"
                                                        step={60}
                                                        value={
                                                            field.value ?? ""
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
                                                <FormLabel>
                                                    Tanggal Selesai (opsional)
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
                                                            disabled={(date) =>
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
                                                <FormLabel>
                                                    Jam Selesai (opsional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="time"
                                                        step={60}
                                                        value={
                                                            field.value ?? ""
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
                                                    Bank Soal*
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
                                                        <PopoverTrigger asChild>
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
                                                    Bank Soal.
                                                </p>
                                                {questionBanks.length === 0 && (
                                                    <p className="text-xs text-red-600">
                                                        Belum ada bank soal
                                                        aktif. Buat bank soal
                                                        terlebih dahulu.
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
                                                            field.value ?? ""
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
                                                                e.target.value;
                                                            if (raw === "") {
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
                                                    mengikuti total soal bank.
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
                                                    Durasi Ujian (Menit)*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
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
                                                    Kriteria Kelulusan (%)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
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
                                                    Kode Ujian*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        disabled
                                                    />
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
