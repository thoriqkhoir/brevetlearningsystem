import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
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
import { Input } from "@/Components/ui/input";
import { Separator } from "@/Components/ui/separator";
import { format } from "date-fns";

const formSchema = z.object({
    npwp: z.string().max(255),
    name: z.string().max(255),
    address: z.string().max(255),
    billing_type_id: z.number().int(),
    billing_payment_id: z.number().int().nullable().optional(),
    start_period: z.string().max(255),
    end_period: z.string().max(255),
    year: z.string().max(4),
    currency: z.string().max(255),
    amount: z.number().int(),
    amount_in_words: z.string().max(255),
    period_for: z.string().max(255).optional(),
    year_for: z.string().max(4).optional(),
    description: z.string().max(255),
    status: z.enum(["paid", "unpaid"]),
    active_period: z.date(),
    code: z.string().max(255),
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 4 }, (_, i) => (currentYear + i).toString());

const SPECIAL_KAP_KJS_CODE = "411618-100";
const specialYearPeriods = years;

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

const generateBillingCode = () => {
    return Math.floor(
        100000000000000 + Math.random() * 900000000000000
    ).toString();
};

export default function LayananMandiriKodeBilling({
    user,
    billingTypes,
    billingPayments,
}: any) {
    const [isPopoverOpenType, setIsPopoverOpenType] = useState(false);
    const [isPopoverOpenPeriod, setIsPopoverOpenPeriod] = useState(false);
    const [isPopoverOpenPayment, setIsPopoverOpenPayment] = useState(false);
    const [filteredBillingTypes, setFilteredBillingTypes] =
        useState(billingTypes);
    const [filteredBillingPayments, setFilteredBillingPayments] =
        useState(billingPayments);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        npwp: user.npwp,
        name: user.name,
        address: user.address,
        billing_type_id: 0,
        billing_payment_id: null as number | null,
        start_period: "",
        end_period: "",
        year: "",
        currency: "IDR",
        amount: 0,
        amount_in_words: "",
        period_for: "",
        year_for: "",
        description: "",
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            npwp: formData.npwp,
            name: formData.name,
            address: formData.address,
            billing_type_id: formData.billing_type_id,
            billing_payment_id: formData.billing_payment_id,
            start_period: formData.start_period,
            end_period: formData.end_period,
            year: formData.year,
            currency: formData.currency,
            amount: formData.amount,
            amount_in_words: formData.amount_in_words,
            period_for: formData.period_for,
            year_for: formData.year_for,
            description: formData.description,
            status: "unpaid",
            active_period: new Date(
                new Date().setDate(new Date().getDate() + 7)
            ),
            code: generateBillingCode(),
        },
    });

    const selectedBillingType = billingTypes?.find(
        (type: any) => type.id === form.watch("billing_type_id")
    );
    const isSpecialKapKjs = selectedBillingType?.code === SPECIAL_KAP_KJS_CODE;

    useEffect(() => {
        setFilteredBillingTypes(
            billingTypes.filter((type: any) => type.id !== 55)
        );
    }, [billingTypes]);

    useEffect(() => {
        setFilteredBillingPayments(billingPayments);
    }, [billingPayments]);

    function nextStep(newData: any) {
        const updatedData = { ...formData, ...newData };

        if (step === 2) {
            if (
                !updatedData.billing_type_id ||
                !updatedData.start_period ||
                !updatedData.end_period ||
                !updatedData.year
            ) {
                toast.error("KAP - KJS, Periode Pajak, dan Tahun harus diisi.");
                return;
            }
        }

        setFormData(updatedData);
        setStep(step + 1);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (formData.amount <= 0) {
            toast.error("Nilai setor harus lebih dari Rp 0.");
            return;
        }

        const payload = {
            ...formData,
            ...values,
            billing_payment_id: values.billing_payment_id ?? null,
            period_for: values.period_for ? values.period_for : null,
            year_for: values.year_for ? values.year_for : null,
            active_period: format(values.active_period, "yyyy-MM-dd"),
        };

        router.post(route("payment.store"), payload);
    }

    const progress = (step / 3) * 100;

    const numberToWords = (num: number): string => {
        const units = [
            "",
            "satu",
            "dua",
            "tiga",
            "empat",
            "lima",
            "enam",
            "tujuh",
            "delapan",
            "sembilan",
        ];
        const teens = [
            "sepuluh",
            "sebelas",
            "dua belas",
            "tiga belas",
            "empat belas",
            "lima belas",
            "enam belas",
            "tujuh belas",
            "delapan belas",
            "sembilan belas",
        ];
        const tens = [
            "",
            "",
            "dua puluh",
            "tiga puluh",
            "empat puluh",
            "lima puluh",
            "enam puluh",
            "tujuh puluh",
            "delapan puluh",
            "sembilan puluh",
        ];
        const thousands = ["", "ribu", "juta", "miliar", "triliun"];

        if (num === 0) return "Nol Rupiah";

        let words = "";
        let i = 0;

        while (num > 0) {
            const chunk = num % 1000;
            if (chunk > 0) {
                let chunkWords = "";
                const hundreds = Math.floor(chunk / 100);
                const remainder = chunk % 100;

                if (hundreds > 0) {
                    if (hundreds === 1) {
                        chunkWords += "seratus ";
                    } else {
                        chunkWords += `${units[hundreds]} ratus `;
                    }
                }

                if (remainder > 0) {
                    if (remainder < 10) {
                        chunkWords += units[remainder];
                    } else if (remainder < 20) {
                        chunkWords += teens[remainder - 10];
                    } else {
                        chunkWords += `${tens[Math.floor(remainder / 10)]} ${
                            units[remainder % 10]
                        }`;
                    }
                }

                if (i === 1 && chunk === 1) {
                    chunkWords = "seribu";
                }

                if (!(i === 1 && chunk === 1)) {
                    chunkWords += ` ${thousands[i]}`;
                }

                words = `${chunkWords.trim()} ${words}`.trim();
            }

            num = Math.floor(num / 1000);
            i++;
        }

        return (
            words
                .trim()
                .replace(/\s+/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") + " Rupiah"
        );
    };

    return (
        <Authenticated>
            <Head title="Layanan Mandiri Kode Billing" />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Layanan Mandiri Kode Billing
                    </h1>

                    <Progress value={progress} className="mb-4" />

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        {step === 1 && (
                            <Form {...form}>
                                <div className="mb-4 text-center">
                                    <p>
                                        <strong>Langkah 1:</strong> Verifikasi
                                        Identitas Wajib Pajak
                                    </p>
                                </div>
                                <form
                                    className="grid grid-cols-1 md:grid-cols-3 md:gap-8"
                                    onSubmit={form.handleSubmit(() =>
                                        nextStep({
                                            npwp: form.getValues("npwp"),
                                            name: form.getValues("name"),
                                            address: form.getValues("address"),
                                        })
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
                                            <p className="text-sm">
                                                Pastikan identitas wajib pajak
                                                Anda sudah benar dan lengkap
                                                sebelum melanjutkan ke tahap
                                                berikutnya. Verifikasi yang
                                                tepat akan membantu mencegah
                                                potensi kesalahan atau
                                                kebingungan pada tahap
                                                selanjutnya, serta memastikan
                                                bahwa semua informasi yang
                                                diperlukan telah dicatat dengan
                                                benar.
                                            </p>

                                            <Separator />

                                            <FormField
                                                name="npwp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            NPWP
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                {...field}
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Wajib Pajak
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                {...field}
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat Wajib Pajak
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                {...field}
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
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
                                <div className="flex justify-center items-center mb-4">
                                    <p className="text-center">
                                        <strong>Langkah 2:</strong> Memilih
                                        Periode Pajak
                                    </p>
                                </div>
                                <form
                                    className="grid grid-cols-1 md:grid-cols-3 md:gap-8"
                                    onSubmit={form.handleSubmit(() =>
                                        nextStep({
                                            billing_type_id:
                                                form.getValues(
                                                    "billing_type_id"
                                                ),
                                            start_period:
                                                form.getValues("start_period"),
                                            end_period:
                                                form.getValues("end_period"),
                                            year: form.getValues("year"),
                                        })
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
                                                <strong>KAP</strong> adalah kode
                                                yang mengidentifikasi jenis
                                                pajak yang harus dibayar oleh
                                                wajib pajak. Setiap jenis pajak,
                                                seperti Pajak Penghasilan (PPh),
                                                Pajak Pertambahan Nilai (PPN),
                                                dan pajak lainnya, memiliki KAP
                                                yang berbeda.
                                            </p>
                                            <p className="text-sm">
                                                <strong>KJS</strong> adalah kode
                                                yang menunjukkan jenis setoran
                                                pajak yang dilakukan oleh wajib
                                                pajak. Kode ini mencerminkan
                                                cara dan tujuan setoran, seperti
                                                pembayaran pajak terutang,
                                                setoran denda, atau setoran
                                                untuk angsuran.
                                            </p>

                                            <Separator />

                                            <FormItem>
                                                <FormLabel>
                                                    KAP - KJS*
                                                </FormLabel>
                                                <Popover
                                                    open={isPopoverOpenType}
                                                    onOpenChange={
                                                        setIsPopoverOpenType
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
                                                                        "billing_type_id"
                                                                    ) &&
                                                                        "text-muted-foreground",
                                                                    "whitespace-normal break-words"
                                                                )}
                                                            >
                                                                <span className="truncate">
                                                                    {form.watch(
                                                                        "billing_type_id"
                                                                    )
                                                                        ? (() => {
                                                                              const selectedType =
                                                                                  billingTypes.find(
                                                                                      (
                                                                                          type: any
                                                                                      ) =>
                                                                                          type.id ===
                                                                                          form.watch(
                                                                                              "billing_type_id"
                                                                                          )
                                                                                  );
                                                                              return selectedType
                                                                                  ? `${selectedType.code} - ${selectedType.description}`
                                                                                  : "Pilih KAP - KJS";
                                                                          })()
                                                                        : "Pilih KAP - KJS"}
                                                                </span>
                                                                <ChevronsUpDown className="opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Cari KAP - KJS..."
                                                                className="h-9"
                                                                onInput={(
                                                                    e
                                                                ) => {
                                                                    const searchValue =
                                                                        e.currentTarget.value.toLowerCase();
                                                                    setFilteredBillingTypes(
                                                                        billingTypes.filter(
                                                                            (
                                                                                type: any
                                                                            ) =>
                                                                                type.description
                                                                                    .toLowerCase()
                                                                                    .includes(
                                                                                        searchValue
                                                                                    )
                                                                        )
                                                                    );
                                                                }}
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    Tidak ada
                                                                    KAP - KJS
                                                                    yang
                                                                    tersedia.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {filteredBillingTypes?.length >
                                                                    0 ? (
                                                                        filteredBillingTypes.map(
                                                                            (
                                                                                type: any
                                                                            ) => (
                                                                                <CommandItem
                                                                                    key={
                                                                                        type.id
                                                                                    }
                                                                                    value={
                                                                                        type.id
                                                                                    }
                                                                                    onSelect={() => {
                                                                                        form.setValue(
                                                                                            "billing_type_id",
                                                                                            type.id
                                                                                        );

                                                                                        // Reset periode/tahun saat ganti KAP-KJS agar tidak membawa nilai lama.
                                                                                        form.setValue(
                                                                                            "start_period",
                                                                                            ""
                                                                                        );
                                                                                        form.setValue(
                                                                                            "end_period",
                                                                                            ""
                                                                                        );
                                                                                        form.setValue(
                                                                                            "year",
                                                                                            ""
                                                                                        );

                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => ({
                                                                                                ...prev,
                                                                                                billing_type_id:
                                                                                                    type.id,
                                                                                            })
                                                                                        );
                                                                                        setIsPopoverOpenType(
                                                                                            false
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {type.code +
                                                                                        " - " +
                                                                                        type.description}
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "ml-auto",
                                                                                            type.id ===
                                                                                                form.watch(
                                                                                                    "billing_type_id"
                                                                                                )
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                </CommandItem>
                                                                            )
                                                                        )
                                                                    ) : (
                                                                        <CommandItem value="">
                                                                            Tidak
                                                                            ada
                                                                            KAP
                                                                            -
                                                                            KJS
                                                                            yang
                                                                            sesuai.
                                                                        </CommandItem>
                                                                    )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            <FormItem>
                                                <FormLabel>
                                                    Periode Pajak
                                                </FormLabel>
                                                <Popover
                                                    open={isPopoverOpenPeriod}
                                                    onOpenChange={
                                                        setIsPopoverOpenPeriod
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
                                                                        "start_period"
                                                                    ) &&
                                                                        "text-muted-foreground",
                                                                    "whitespace-normal break-words"
                                                                )}
                                                            >
                                                                <span className="truncate">
                                                                    {isSpecialKapKjs
                                                                        ? form.watch(
                                                                              "year"
                                                                          )
                                                                            ? `Januari - Desember ${form.watch(
                                                                                  "year"
                                                                              )}`
                                                                            : "Pilih Periode Pajak"
                                                                        : form.watch(
                                                                              "start_period"
                                                                          )
                                                                        ? months.find(
                                                                              (
                                                                                  month
                                                                              ) =>
                                                                                  month.value ===
                                                                                  form.watch(
                                                                                      "start_period"
                                                                                  )
                                                                          )
                                                                              ?.label
                                                                        : "Pilih Periode Pajak"}
                                                                </span>
                                                                <ChevronsUpDown className="opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Cari Periode Pajak..."
                                                                className="h-9"
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    Tidak ada
                                                                    periode yang
                                                                    tersedia.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {isSpecialKapKjs
                                                                        ? specialYearPeriods.map(
                                                                              (
                                                                                  year
                                                                              ) => (
                                                                                  <CommandItem
                                                                                      key={
                                                                                          year
                                                                                      }
                                                                                      value={
                                                                                          year
                                                                                      }
                                                                                      onSelect={() => {
                                                                                          form.setValue(
                                                                                              "start_period",
                                                                                              "Januari"
                                                                                          );
                                                                                          form.setValue(
                                                                                              "end_period",
                                                                                              "Desember"
                                                                                          );
                                                                                          form.setValue(
                                                                                              "year",
                                                                                              year
                                                                                          );
                                                                                          setIsPopoverOpenPeriod(
                                                                                              false
                                                                                          );
                                                                                      }}
                                                                                      className="max-w-md"
                                                                                  >
                                                                                      {`Januari - Desember ${year}`}
                                                                                      <Check
                                                                                          className={cn(
                                                                                              "ml-auto",
                                                                                              form.watch(
                                                                                                  "year"
                                                                                              ) ===
                                                                                                  year
                                                                                                  ? "opacity-100"
                                                                                                  : "opacity-0"
                                                                                          )}
                                                                                      />
                                                                                  </CommandItem>
                                                                              )
                                                                          )
                                                                        : months.map(
                                                                              (
                                                                                  month
                                                                              ) => (
                                                                                  <CommandItem
                                                                                      key={
                                                                                          month.value
                                                                                      }
                                                                                      value={
                                                                                          month.value
                                                                                      }
                                                                                      onSelect={() => {
                                                                                          form.setValue(
                                                                                              "start_period",
                                                                                              month.value
                                                                                          );
                                                                                          form.setValue(
                                                                                              "end_period",
                                                                                              month.value
                                                                                          );
                                                                                          setIsPopoverOpenPeriod(
                                                                                              false
                                                                                          );
                                                                                      }}
                                                                                      className="max-w-md"
                                                                                  >
                                                                                      {
                                                                                          month.label
                                                                                      }
                                                                                      <Check
                                                                                          className={cn(
                                                                                              "ml-auto",
                                                                                              form.watch(
                                                                                                  "start_period"
                                                                                              ) ===
                                                                                                  month.value
                                                                                                  ? "opacity-100"
                                                                                                  : "opacity-0"
                                                                                          )}
                                                                                      />
                                                                                  </CommandItem>
                                                                              )
                                                                          )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            <FormItem>
                                                <FormLabel>
                                                    Tahun Pajak
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        form.setValue(
                                                            "year",
                                                            value
                                                        )
                                                    }
                                                    required
                                                    value={form.watch("year")}
                                                    disabled={isSpecialKapKjs}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Tahun" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {years.map((year) => (
                                                            <SelectItem
                                                                key={year}
                                                                value={year.toString()}
                                                            >
                                                                {year}
                                                            </SelectItem>
                                                        ))}
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
                                                Lanjut
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        )}

                        {step === 3 && (
                            <Form {...form}>
                                <div className="flex justify-center items-center mb-4">
                                    <p className="text-center">
                                        <strong>Langkah 3:</strong> Selesai,
                                        Unduh Kode Pembayaran
                                    </p>
                                </div>
                                <form
                                    className="grid grid-cols-1 md:grid-cols-3 md:gap-8"
                                    onSubmit={form.handleSubmit(onSubmit)}
                                >
                                    <div className="w-3/4 md:w-full mx-auto">
                                        <img
                                            src="/images/Tax-rafiki.svg"
                                            alt="Kemenkeu"
                                            className="w-full object-cover"
                                        />
                                    </div>

                                    <div className="col-span-2 gap-4 p-4 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <p className="text-sm">
                                                Harap pastikan dengan cermat
                                                bahwa semua informasi terkait
                                                identitas wajib pajak Anda telah
                                                diperiksa dan dikonfirmasi. Ini
                                                mencakup nama lengkap Anda.
                                                alamat tempat tinggal atau
                                                domisili, serta Nomor Pokok
                                                Wajib Pajak (NPWP) Anda. Selain
                                                itu, pastikan bahwa Kode Akun
                                                Pajak (KAP) dan Kode Jenis
                                                Setoran (KJS) yang Anda gunakan
                                                sudah benar dan sesuai.
                                                Ketelitian dalam memverifikasi
                                                kesesuaian informasi ini sangat
                                                penting, terutama dalam konteks
                                                proses pembentukan kode
                                                penagihan, untuk menghindari
                                                kesalahan yang dapat menghambat
                                                proses administrasi pajak dan
                                                potensi masalah di masa depan.
                                            </p>
                                            <div className="space-y-2">
                                                <p className="text-sm">
                                                    NPWP :
                                                    <span className="font-bold">
                                                        {formData.npwp}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    Nama Wajib Pajak :{" "}
                                                    <span className="uppercase font-bold">
                                                        {formData.name}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    Alamat Wajib Pajak :{" "}
                                                    <span className="uppercase font-bold">
                                                        {formData.address}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    KAP - KJS :{" "}
                                                    <span className="font-bold">
                                                        {(() => {
                                                            const selectedType =
                                                                billingTypes.find(
                                                                    (
                                                                        type: any
                                                                    ) =>
                                                                        type.id ===
                                                                        formData.billing_type_id
                                                                );
                                                            return selectedType
                                                                ? `${selectedType.code} - ${selectedType.description}`
                                                                : "Data tidak ditemukan";
                                                        })()}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    Periode Pajak :{" "}
                                                    <span className="font-bold">
                                                        {formData.start_period}
                                                        {formData.end_period &&
                                                        formData.end_period !==
                                                            formData.start_period
                                                            ? ` - ${formData.end_period}`
                                                            : ""}{" "}
                                                        {formData.year}
                                                    </span>
                                                </p>
                                            </div>

                                            <FormItem>
                                                <FormLabel>Mata Uang</FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        form.setValue(
                                                            "currency",
                                                            value
                                                        )
                                                    }
                                                    required
                                                    value={form.watch(
                                                        "currency"
                                                    )}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Mata Uang" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="IDR">
                                                            Rupiah Indonesia
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                            <FormField
                                                name="amount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nilai*
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                value={rupiahFormatter.format(
                                                                    field.value ||
                                                                        0
                                                                )}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const numericValue =
                                                                        parseRupiah(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    field.onChange(
                                                                        numericValue
                                                                    );
                                                                    form.setValue(
                                                                        "amount_in_words",
                                                                        numberToWords(
                                                                            numericValue
                                                                        )
                                                                    );
                                                                    setFormData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            amount: numericValue,
                                                                            amount_in_words:
                                                                                numberToWords(
                                                                                    numericValue
                                                                                ),
                                                                        })
                                                                    );
                                                                }}
                                                                autoComplete="off"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="amount_in_words"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Terbilang
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                {...field}
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                name="billing_payment_id"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Untuk pembayaran
                                                        </FormLabel>
                                                        <Popover
                                                            open={
                                                                isPopoverOpenPayment
                                                            }
                                                            onOpenChange={
                                                                setIsPopoverOpenPayment
                                                            }
                                                        >
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        className={cn(
                                                                            "w-full justify-between",
                                                                            !form.watch(
                                                                                "billing_payment_id"
                                                                            ) &&
                                                                                "text-muted-foreground",
                                                                            "whitespace-normal break-words"
                                                                        )}
                                                                    >
                                                                        <span className="truncate">
                                                                            {form.watch(
                                                                                "billing_payment_id"
                                                                            )
                                                                                ? billingPayments?.find(
                                                                                      (
                                                                                          p: any
                                                                                      ) =>
                                                                                          p.id ===
                                                                                          form.watch(
                                                                                              "billing_payment_id"
                                                                                          )
                                                                                  )
                                                                                      ?.name ||
                                                                                  "Pilih pembayaran"
                                                                                : "Pilih pembayaran"}
                                                                        </span>
                                                                        <ChevronsUpDown className="opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command>
                                                                    <CommandInput
                                                                        placeholder="Cari pembayaran..."
                                                                        className="h-9"
                                                                        onInput={(
                                                                            e
                                                                        ) => {
                                                                            const searchValue =
                                                                                e.currentTarget.value.toLowerCase();
                                                                            setFilteredBillingPayments(
                                                                                billingPayments.filter(
                                                                                    (
                                                                                        p: any
                                                                                    ) =>
                                                                                        p.name
                                                                                            .toLowerCase()
                                                                                            .includes(
                                                                                                searchValue
                                                                                            )
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                    <CommandList>
                                                                        <CommandEmpty>
                                                                            Tidak
                                                                            ada
                                                                            pembayaran
                                                                            yang
                                                                            tersedia.
                                                                        </CommandEmpty>
                                                                        <CommandGroup>
                                                                            {filteredBillingPayments?.length >
                                                                            0 ? (
                                                                                filteredBillingPayments.map(
                                                                                    (
                                                                                        p: any
                                                                                    ) => (
                                                                                        <CommandItem
                                                                                            key={
                                                                                                p.id
                                                                                            }
                                                                                            value={String(
                                                                                                p.id
                                                                                            )}
                                                                                            onSelect={() => {
                                                                                                form.setValue(
                                                                                                    "billing_payment_id",
                                                                                                    p.id
                                                                                                );
                                                                                                setFormData(
                                                                                                    (
                                                                                                        prev
                                                                                                    ) => ({
                                                                                                        ...prev,
                                                                                                        billing_payment_id:
                                                                                                            p.id,
                                                                                                    })
                                                                                                );
                                                                                                setIsPopoverOpenPayment(
                                                                                                    false
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                p.name
                                                                                            }
                                                                                            <Check
                                                                                                className={cn(
                                                                                                    "ml-auto",
                                                                                                    p.id ===
                                                                                                        form.watch(
                                                                                                            "billing_payment_id"
                                                                                                        )
                                                                                                        ? "opacity-100"
                                                                                                        : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </CommandItem>
                                                                                    )
                                                                                )
                                                                            ) : (
                                                                                <CommandItem value="">
                                                                                    Tidak
                                                                                    ada
                                                                                    pembayaran
                                                                                    yang
                                                                                    sesuai.
                                                                                </CommandItem>
                                                                            )}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <p className="text-xs text-muted-foreground">
                                                            Pemilihan ini
                                                            bersifat indikatif
                                                            dan tidak mengikat
                                                            penggunaan deposit
                                                            pada saat pelaporan
                                                            SPT atau permohonan
                                                            pemindahbukuan.
                                                        </p>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormItem>
                                                <FormLabel>
                                                    Untuk masa
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        form.setValue(
                                                            "period_for",
                                                            value
                                                        );
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            period_for: value,
                                                        }));
                                                    }}
                                                    value={
                                                        form.watch(
                                                            "period_for"
                                                        ) || ""
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Masa" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {months.map((month) => (
                                                            <SelectItem
                                                                key={
                                                                    month.value
                                                                }
                                                                value={
                                                                    month.value
                                                                }
                                                            >
                                                                {month.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>

                                            <FormItem>
                                                <FormLabel>
                                                    Untuk tahun
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        form.setValue(
                                                            "year_for",
                                                            value
                                                        );
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            year_for: value,
                                                        }));
                                                    }}
                                                    value={
                                                        form.watch(
                                                            "year_for"
                                                        ) || ""
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Tahun" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {years.map((y) => (
                                                            <SelectItem
                                                                key={y}
                                                                value={y}
                                                            >
                                                                {y}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>

                                            <FormField
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Keterangan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                {...field}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    field.onChange(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    setFormData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            description:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    );
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
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
                                                Kirim
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
