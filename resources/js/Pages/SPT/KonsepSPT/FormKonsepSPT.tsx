import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Progress } from "@/Components/ui/progress";
import toast from "react-hot-toast";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";

const formSchema = z.object({
    form_id: z.number().int(),
    correction_number: z.number().int().max(127),
    start_period: z.string().max(255),
    end_period: z.string().max(255),
    year: z.string().max(4),
    spt_period_type: z
        .enum(["tahunan", "bagian_tahun_pajak"])
        .optional()
        .nullable(),
    tax_type: z.enum(["nihil", "kurang bayar", "lebih bayar"]),
    tax_value: z.number(),
    status: z.enum([
        "created",
        "approved",
        "canceled",
        "rejected",
        "amanded",
        "waiting",
    ]),
});

const months = [
    { value: "Januari", label: "Januari" },
    { value: "Februari", label: "Februari" },
    { value: "Maret", label: "Maret" },
    { value: "April", label: "April" },
    { value: "Mei", label: "Mei" },
    { value: "Juni", label: "Juni" },
    { value: "Juli", label: "Juli" },
    { value: "Agustus", label: "Agustus" },
    { value: "September", label: "September" },
    { value: "Oktober", label: "Oktober" },
    { value: "November", label: "November" },
    { value: "Desember", label: "Desember" },
];

const currentYear = new Date().getFullYear() - 1;
const years = Array.from({ length: 4 }, (_, i) => (currentYear + i).toString());

export default function FormKonsepSPT({ forms, spts }: any) {
    const [step, setStep] = useState(1);
    const { props } = usePage<any>();
    const activeBusinessEntity = props?.active_business_entity;

    const availableForms = useMemo(() => {
        if (!Array.isArray(forms)) return [];
        if (activeBusinessEntity) {
            // Acting as Business Entity: hide PPh Orang Pribadi
            return forms.filter((f: any) => f?.code !== "PPHOP");
        }
        // Acting as Personal: hide SPT PPN and PPh Badan
        return forms.filter(
            (f: any) => f?.code !== "PPN1111" && f?.code !== "PPHBADAN",
        );
    }, [forms, activeBusinessEntity]);

    const [formData, setFormData] = useState({
        tax_type: "nihil",
        start_period: "",
        end_period: "",
        year: "",
        form_id: 0,
        form_name: "",
        form_code: "",
        form_description: "",
        spt_period_type: null as null | "tahunan" | "bagian_tahun_pajak",
        correction_number: 0,
    });
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            form_id: formData.form_id,
            correction_number: formData.correction_number,
            start_period: formData.start_period,
            end_period: formData.end_period,
            year: formData.year,
            spt_period_type: formData.spt_period_type,
            tax_type: formData.tax_type as
                | "nihil"
                | "kurang bayar"
                | "lebih bayar",
            tax_value: 0,
            status: "created",
        },
    });

    const { watch, setValue } = form;
    const start_period = watch("start_period");
    const year = watch("year");
    const form_id = watch("form_id");
    const end_period = watch("end_period");

    useEffect(() => {
        // Ensure default form_id always points to a visible option
        const currentFormId = form.getValues("form_id");
        const isCurrentVisible = availableForms.some(
            (f: any) => f?.id === currentFormId,
        );

        if (!isCurrentVisible) {
            const firstId = availableForms?.[0]?.id ?? 0;
            const firstForm = firstId
                ? availableForms.find((f: any) => f?.id === firstId)
                : null;
            setValue("form_id", firstId);
            setFormData((prev) => ({
                ...prev,
                form_id: firstId,
                form_name: firstId ? (firstForm?.name ?? "") : "",
                form_code: firstId ? (firstForm?.code ?? "") : "",
                form_description: firstId ? (firstForm?.description ?? "") : "",
            }));
        }
    }, [activeBusinessEntity, availableForms, form, setValue]);

    const isTahunanPphOpOrBadan = useMemo(() => {
        return ["PPHOP", "PPHBADAN"].includes(formData.form_code);
    }, [formData.form_code]);

    const sptPeriodType = watch("spt_period_type");

    const formatPeriodDisplay = (
        start: string,
        end: string,
        yearValue: string,
    ) => {
        if (!start || !yearValue) return "";
        if (!end || start === end) return `${start} ${yearValue}`;
        return `${start} - ${end} ${yearValue}`;
    };

    useEffect(() => {
        if (!isTahunanPphOpOrBadan) {
            // Clear period type when not annual
            form.setValue("spt_period_type", null);
            setFormData((prev) => ({ ...prev, spt_period_type: null }));
            return;
        }

        // Default required selection for annual forms
        const currentType = form.getValues("spt_period_type");
        if (!currentType) {
            form.setValue("spt_period_type", "tahunan");
            setFormData((prev) => ({ ...prev, spt_period_type: "tahunan" }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTahunanPphOpOrBadan]);

    const periodOptions = useMemo(() => {
        if (isTahunanPphOpOrBadan) {
            if (sptPeriodType === "bagian_tahun_pajak") {
                // Desc order like the examples: Desember, November, November-Desember, ...
                const yearValue = currentYear.toString();
                const opts: Array<{
                    value: string;
                    label: string;
                    start_period: string;
                    end_period: string;
                    year: string;
                }> = [];

                for (
                    let startIdx = months.length - 1;
                    startIdx >= 0;
                    startIdx -= 1
                ) {
                    const startMonth = months[startIdx];
                    // single month
                    opts.push({
                        value: `${startMonth.value}|${startMonth.value}|${yearValue}`,
                        label: `${startMonth.label} ${yearValue}`,
                        start_period: startMonth.value,
                        end_period: startMonth.value,
                        year: yearValue,
                    });
                    // ranges to later months
                    for (
                        let endIdx = startIdx + 1;
                        endIdx < months.length;
                        endIdx += 1
                    ) {
                        const endMonth = months[endIdx];
                        opts.push({
                            value: `${startMonth.value}|${endMonth.value}|${yearValue}`,
                            label: `${startMonth.label} - ${endMonth.label} ${yearValue}`,
                            start_period: startMonth.value,
                            end_period: endMonth.value,
                            year: yearValue,
                        });
                    }
                }

                return opts;
            }

            // Tahunan: fixed Januari - Desember tahun sebelumnya
            return [
                {
                    value: `TAHUNAN|${currentYear}`,
                    label: `Januari - Desember ${currentYear}`,
                    start_period: "Januari",
                    end_period: "Desember",
                    year: currentYear.toString(),
                },
            ];
        }

        return years.flatMap((yearValue) =>
            months.map((month) => ({
                value: `${month.value}|${yearValue}`,
                label: `${month.label} ${yearValue}`,
                start_period: month.value,
                end_period: month.value,
                year: yearValue,
            })),
        );
    }, [isTahunanPphOpOrBadan, sptPeriodType]);

    const selectedPeriodLabel = useMemo(() => {
        const start = form.getValues("start_period");
        const end = form.getValues("end_period");
        const selectedYear = form.getValues("year");

        return formatPeriodDisplay(start, end, selectedYear);
    }, [form, isTahunanPphOpOrBadan, start_period, year]);

    useEffect(() => {
        if (!isTahunanPphOpOrBadan) return;

        if (sptPeriodType === "tahunan") {
            form.setValue("start_period", "Januari");
            form.setValue("end_period", "Desember");
            form.setValue("year", currentYear.toString());
        }

        if (sptPeriodType === "bagian_tahun_pajak") {
            // Force user to pick a specific month/range
            form.setValue("start_period", "");
            form.setValue("end_period", "");
            form.setValue("year", currentYear.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTahunanPphOpOrBadan, sptPeriodType]);

    useEffect(() => {
        if (form_id && start_period && end_period && year) {
            const correction = isCorrection(
                spts,
                form_id,
                start_period,
                end_period,
                year,
            );
            if (correction) {
                setValue("correction_number", 1);
                setFormData((prevData) => ({
                    ...prevData,
                    correction_number: 1,
                }));
            } else {
                setValue("correction_number", 0);
                setFormData((prevData) => ({
                    ...prevData,
                    correction_number: 0,
                }));
            }
        }
    }, [form_id, start_period, end_period, year, spts, setValue]);

    function nextStep(newData: any) {
        const updatedData = { ...formData, ...newData };

        if (step === 1) {
            const selectedForm = availableForms.find(
                (form: any) => form.id === newData.form_id,
            );
            if (!selectedForm) {
                toast.error("Jenis SPT tidak tersedia.");
                return;
            }
            updatedData.form_name = selectedForm ? selectedForm.name : "";
            updatedData.form_code = selectedForm?.code ?? "";
            updatedData.form_description = selectedForm?.description ?? "";
        }

        if (step === 2) {
            if (
                ["PPHOP", "PPHBADAN"].includes(updatedData.form_code) &&
                !updatedData.spt_period_type
            ) {
                toast.error("Jenis Periode SPT wajib dipilih.");
                return;
            }
            if (
                !updatedData.start_period ||
                !updatedData.end_period ||
                !updatedData.year
            ) {
                toast.error("Periode & Tahun Pajak harus diisi.");
                return;
            }
            const correction = isCorrection(
                spts,
                updatedData.form_id,
                updatedData.start_period,
                updatedData.end_period,
                updatedData.year,
            );
            updatedData.correction_number = correction
                ? getMaxCorrectionNumber(
                      spts,
                      updatedData.form_id,
                      updatedData.start_period,
                      updatedData.end_period,
                      updatedData.year,
                  ) + 1
                : 0;
        }

        setFormData(updatedData);
        setStep(step + 1);
    }

    function getMaxCorrectionNumber(
        spts: any[],
        form_id: number,
        start_period: string,
        end_period: string,
        year: string,
    ) {
        const corrections = spts.filter(
            (spt: any) =>
                spt.form_id === form_id &&
                spt.start_period === start_period &&
                spt.end_period === end_period &&
                spt.year === year,
        );
        return corrections.length > 0
            ? Math.max(...corrections.map((spt: any) => spt.correction_number))
            : 0;
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.form_id === 0) {
            toast.error("Jenis SPT harus dipilih.");
            return;
        }
        const existingSPT = spts.find(
            (spt: any) =>
                spt.form_id === values.form_id &&
                spt.start_period === values.start_period &&
                spt.end_period === values.end_period &&
                spt.year === values.year &&
                (spt.status === "waiting" || spt.status === "created"),
        );

        if (existingSPT) {
            toast.error("Silahkan selesaikan SPT anda terlebih dahulu");
            return;
        }

        router.post(route("spt.store"), { ...formData, ...values });
    }

    const progress = (step / 3) * 100;

    function isCorrection(
        spts: any[],
        form_id: number,
        start_period: string,
        end_period: string,
        year: string,
    ) {
        return spts.some(
            (spt: any) =>
                spt.form_id === form_id &&
                spt.start_period === start_period &&
                spt.end_period === end_period &&
                spt.year === year,
        );
    }

    return (
        <Authenticated>
            <Head title="Form Konsep SPT" />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("spt.konsep")}>
                                    Konsep SPT
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Buat Konsep SPT</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Buat Konsep SPT
                    </h1>

                    <Progress value={progress} className="mb-4" />

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        {step === 1 && (
                            <Form {...form}>
                                <div className="mb-4 text-center">
                                    <p className="font-bold">
                                        Pilih Jenis Pajak
                                    </p>
                                </div>
                                <form
                                    className="grid grid-cols-1 md:grid-cols-3 md:gap-8"
                                    onSubmit={form.handleSubmit(() =>
                                        nextStep({
                                            form_id: form.getValues("form_id"),
                                        }),
                                    )}
                                >
                                    <div className="w-3/4 md:w-full mx-auto">
                                        <img
                                            src="/images/Tax-pana.svg"
                                            alt="Kemenkeu"
                                            className="w-full object-cover"
                                        />
                                    </div>
                                    <div className="col-span-2 gap-4 p-4 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <FormItem>
                                                <FormLabel>
                                                    <strong>Langkah 1.</strong>{" "}
                                                    Pilih Jenis SPT yang akan
                                                    dilaporkan
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        form.setValue(
                                                            "form_id",
                                                            parseInt(value, 10),
                                                        )
                                                    }
                                                    value={form
                                                        .watch("form_id")
                                                        .toString()}
                                                    required
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Jenis SPT" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableForms?.length >
                                                        0 ? (
                                                            availableForms.map(
                                                                (form: any) => (
                                                                    <SelectItem
                                                                        key={
                                                                            form.id
                                                                        }
                                                                        value={form.id.toString()}
                                                                    >
                                                                        {
                                                                            form.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )
                                                        ) : (
                                                            <SelectItem
                                                                disabled
                                                                value=""
                                                            >
                                                                No Forms
                                                                Available
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                className="px-8"
                                            >
                                                Lanjut
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        )}

                        {step === 2 && (
                            <Form {...form}>
                                <div className="mb-4 text-center">
                                    <p className="font-bold">
                                        Pilih Periode Pelaporan SPT
                                    </p>
                                </div>
                                <form
                                    className="grid grid-cols-1 md:grid-cols-3 md:gap-8"
                                    onSubmit={form.handleSubmit(() =>
                                        nextStep({
                                            start_period:
                                                form.getValues("start_period"),
                                            end_period:
                                                form.getValues("end_period"),
                                            year: form.getValues("year"),
                                            spt_period_type:
                                                form.getValues(
                                                    "spt_period_type",
                                                ),
                                        }),
                                    )}
                                >
                                    <div className="w-3/4 md:w-full mx-auto">
                                        <img
                                            src="/images/Tax-bro.svg"
                                            alt="Kemenkeu"
                                            className="w-full object-cover"
                                        />
                                    </div>

                                    <div className="col-span-2 gap-4 p-4 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <p className="text-sm">
                                                <strong>Langkah 2. </strong>
                                                <span>
                                                    Pilih periode pelaporan SPT
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span>
                                                    Jenis Surat Pemberitahuan
                                                    Pajak :{" "}
                                                </span>
                                                {formData.form_description ? (
                                                    <strong>
                                                        {
                                                            formData.form_description
                                                        }
                                                    </strong>
                                                ) : (
                                                    <strong>
                                                        {formData.form_name}
                                                    </strong>
                                                )}
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {isTahunanPphOpOrBadan ? (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenis Periode SPT{" "}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </FormLabel>
                                                        <RadioGroup
                                                            value={
                                                                (form.watch(
                                                                    "spt_period_type",
                                                                ) as any) ?? ""
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) => {
                                                                const next =
                                                                    value as
                                                                        | "tahunan"
                                                                        | "bagian_tahun_pajak";
                                                                form.setValue(
                                                                    "spt_period_type",
                                                                    next,
                                                                );
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        spt_period_type:
                                                                            next,
                                                                    }),
                                                                );
                                                            }}
                                                            className="gap-3"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem
                                                                    value="bagian_tahun_pajak"
                                                                    id="spt-period-bagian"
                                                                />
                                                                <Label htmlFor="spt-period-bagian">
                                                                    SPT Bagian
                                                                    Tahun Pajak
                                                                </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem
                                                                    value="tahunan"
                                                                    id="spt-period-tahunan"
                                                                />
                                                                <Label htmlFor="spt-period-tahunan">
                                                                    SPT Tahunan
                                                                </Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <FormMessage />
                                                    </FormItem>
                                                ) : null}

                                                <FormItem>
                                                    <FormLabel>
                                                        Periode & Tahun Pajak{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <Popover
                                                        open={isPopoverOpen}
                                                        onOpenChange={
                                                            setIsPopoverOpen
                                                        }
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "w-full justify-between",
                                                                        !form.watch(
                                                                            "start_period",
                                                                        ) &&
                                                                            "text-muted-foreground",
                                                                        "whitespace-normal break-words",
                                                                    )}
                                                                >
                                                                    <span className="truncate">
                                                                        {selectedPeriodLabel
                                                                            ? selectedPeriodLabel
                                                                            : "Pilih Periode & Tahun Pajak"}
                                                                    </span>
                                                                    <ChevronsUpDown className="opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0">
                                                            <Command>
                                                                <CommandInput
                                                                    placeholder="Cari Periode & Tahun..."
                                                                    className="h-9"
                                                                />
                                                                <CommandList>
                                                                    <CommandEmpty>
                                                                        Tidak
                                                                        ada item
                                                                        yang
                                                                        tersedia.
                                                                    </CommandEmpty>
                                                                    <CommandGroup>
                                                                        {periodOptions.map(
                                                                            (
                                                                                opt: any,
                                                                            ) => (
                                                                                <CommandItem
                                                                                    key={
                                                                                        opt.value
                                                                                    }
                                                                                    value={
                                                                                        opt.label
                                                                                    }
                                                                                    onSelect={() => {
                                                                                        form.setValue(
                                                                                            "start_period",
                                                                                            opt.start_period,
                                                                                        );
                                                                                        form.setValue(
                                                                                            "end_period",
                                                                                            opt.end_period,
                                                                                        );
                                                                                        form.setValue(
                                                                                            "year",
                                                                                            opt.year,
                                                                                        );
                                                                                        setIsPopoverOpen(
                                                                                            false,
                                                                                        );
                                                                                    }}
                                                                                    className="max-w-md"
                                                                                >
                                                                                    {
                                                                                        opt.label
                                                                                    }
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "ml-auto",
                                                                                            selectedPeriodLabel ===
                                                                                                opt.label
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0",
                                                                                        )}
                                                                                    />
                                                                                </CommandItem>
                                                                            ),
                                                                        )}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setIsPopoverOpen(false);

                                                    // Reset period/year so user re-fills when coming back
                                                    form.setValue(
                                                        "start_period",
                                                        "",
                                                    );
                                                    form.setValue(
                                                        "end_period",
                                                        "",
                                                    );
                                                    form.setValue("year", "");
                                                    form.setValue(
                                                        "correction_number",
                                                        0,
                                                    );
                                                    form.setValue(
                                                        "spt_period_type",
                                                        null,
                                                    );

                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        start_period: "",
                                                        end_period: "",
                                                        year: "",
                                                        correction_number: 0,
                                                        spt_period_type: null,
                                                    }));

                                                    setStep(1);
                                                }}
                                                className="px-6"
                                            >
                                                Kembali
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="px-8"
                                            >
                                                Lanjut
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        )}

                        {step === 3 && (
                            <Form {...form}>
                                <div className="mb-4 text-center">
                                    <p className="font-bold">Pilih Jenis SPT</p>
                                </div>
                                <form
                                    className="grid grid-cols-1 md:grid-cols-3 md:gap-8"
                                    onSubmit={form.handleSubmit(onSubmit)}
                                >
                                    <div className="w-3/4 md:w-full mx-auto">
                                        <img
                                            src="/images/Tax-bro.svg"
                                            alt="Kemenkeu"
                                            className="w-full object-cover"
                                        />
                                    </div>

                                    <div className="col-span-2 gap-4 p-4 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <p className="text-sm">
                                                <strong>Langkah 3. </strong>
                                                <span>Pilih Jenis SPT</span>
                                            </p>
                                            <p className="text-sm">
                                                <span>
                                                    Jenis Surat Pemberitahuan
                                                    Pajak :{" "}
                                                </span>
                                                {formData.form_description ? (
                                                    <strong>
                                                        {
                                                            formData.form_description
                                                        }
                                                    </strong>
                                                ) : (
                                                    <strong>
                                                        {formData.form_name}
                                                    </strong>
                                                )}
                                            </p>
                                            {["PPHOP", "PPHBADAN"].includes(
                                                formData.form_code,
                                            ) ? (
                                                <p className="text-sm">
                                                    <span>
                                                        Jenis Periode SPT :{" "}
                                                    </span>
                                                    <strong className="capitalize">
                                                        {formData.spt_period_type ===
                                                        "tahunan"
                                                            ? "SPT Tahunan"
                                                            : formData.spt_period_type ===
                                                                "bagian_tahun_pajak"
                                                              ? "SPT Bagian Tahun Pajak"
                                                              : "-"}
                                                    </strong>
                                                </p>
                                            ) : null}
                                            <p className="text-sm">
                                                <span>
                                                    Periode & Tahun Pajak :{" "}
                                                </span>
                                                <strong className="capitalize">
                                                    {formatPeriodDisplay(
                                                        formData.start_period,
                                                        formData.end_period,
                                                        formData.year,
                                                    )}
                                                </strong>
                                            </p>

                                            <FormItem>
                                                <FormLabel>
                                                    Model SPT{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        form.setValue(
                                                            "correction_number",
                                                            parseInt(value, 10),
                                                        )
                                                    }
                                                    required
                                                    value={form
                                                        .watch(
                                                            "correction_number",
                                                        )
                                                        .toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Model Pajak" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">
                                                            Normal
                                                        </SelectItem>

                                                        <SelectItem value="1">
                                                            Pembetulan
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        </div>

                                        <div className="flex justify-between">
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setStep(step - 1)
                                                }
                                                className="px-6"
                                            >
                                                Kembali
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="px-8"
                                            >
                                                Buat Konsep SPT
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
