import { usePage, router, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { SPTColumns } from "@/Components/layout/SPT/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import TabLIA from "./Tablist21/TabLIA";
import TabLIB from "./Tablist21/TabLIB";
import TabLII from "./Tablist21/TabLII";
import TabLIII from "./Tablist21/TabLIII";
import { InvoiceColumns } from "@/Components/layout/Invoice/columns";
import React, { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";
import PaymentDialog from "@/Components/layout/PaymentDialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import toast from "react-hot-toast";

const sptIndukSchema = z.object({
    spt_id: z.string().uuid(),
    ppha1: z.number().int(),
    ppha2: z.number().int(),
    ppha3: z.number().int(),
    ppha4: z.number().int(),
    ppha5: z.number().int(),
    ppha6: z.number().int(),
    pphapemerintah: z.number().int(),
    pphb1: z.number().int(),
    pphb2: z.number().int(),
    pphb3: z.number().int(),
    pphb4: z.number().int(),
    pphb5: z.number().int(),
    pphb6: z.number().int(),
    pphbpemerintah: z.number().int(),
    penandatangan: z.enum([
        "Wajib Pajak",
        "Kuasa Wajib Pajak",
    ]),
    ttd_name: z.string(),
    payment_method: z.string(),
    password: z.string(),
});

interface DetailSPTProps {
    spt: SPTColumns;
    invoices: InvoiceColumns;
    others: any[];
    returns: any[];
    returnsOthers: any[];
    saldo: number;
    transactionNumber: string;
    bupots:any[];
    bupotA1: any[];
    bupotA2: any[];
    
}

const DetailSPT = ({
    spt,
    returnsOthers,
    saldo,
    transactionNumber,
    bupots,
    bupotA1,
    bupotA2,
}: DetailSPTProps) => {
    const user = usePage().props.auth.user;
    const { flash }: any = usePage().props;
    const [openModalPayment, setOpenModalPayment] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [total, setTotal] = useState(0);
    const userSaldo = saldo ?? 0;
    const [pendingSubmit, setPendingSubmit] = useState<any>(null);
    const [pernyataanSetuju, setPernyataanSetuju] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    interface TabRefType {
        getFormData: () => any[];
    }
        // Deklarasi yang benar
    const tabIARef = useRef<TabRefType>(null);
    const tabIBRef = useRef<TabRefType>(null);
    const tabIIARef = useRef<TabRefType>(null);
    const tabIIIRef = useRef<TabRefType>(null);

    const formatRupiah = (amount: number | string): string => {
        if (amount === null || amount === undefined || amount === "") return "";

        const number = typeof amount === "string" ? parseFloat(amount) : amount;

        if (isNaN(number) || number === 0) return "0";

        return number.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 20,
        });
    };

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
        "article4": true,  // initially collapsed
        "article15": true,
        "article22": true,
        "article23": true,
        "article26": true,
    });

    const toggleRow = (rowId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };
    

    const filteredBupots = Array.isArray(bupots)
    ? bupots.filter((bupot) => {
          return (
              bupot?.bupot_period === spt?.start_period &&
              bupot?.bupot_year === spt.year &&
              bupot?.status === "approved" 
          );
      })
    : [];


    const [totals, setTotals] = useState({
        dpp: 0,
        dpp_split: 0,
        ppn: 0,
        ppnbm: 0,
    });

    const [inputs, setInputs] = useState({
        dpp1: 0,
        dppBa: 0,
        ppnbma1: 0,
        ppnbma2: 0,
        
    });

    const form = useForm<z.infer<typeof sptIndukSchema>>({
        resolver: zodResolver(sptIndukSchema),
        defaultValues: {
            spt_id: spt.id,
            ppha1: 0,
            ppha2: 0,
            ppha3: 0,
            ppha4: 0,
            ppha5: 0,
            ppha6: 0,
            pphapemerintah: 0,
            pphb1: 0,
            pphb2: 0,
            pphb3: 0,
            pphb4: 0,
            pphb5: 0,
            pphb6: 0,
            pphbpemerintah: 0,
            penandatangan: "Wajib Pajak",
            ttd_name: "",
            payment_method: "",
            password: "",
        },
    });

    useEffect(() => {
        const ppha1Value = form.getValues("ppha1") || 0;
        const ppha2Value = form.getValues("ppha2") || 0; 
        const ppha3Value = form.getValues("ppha3") || 0;
        
        const ppha4Value = ppha1Value + ppha2Value + ppha3Value;
        
        form.setValue("ppha4", ppha4Value);
        
        const ppha5Value = form.getValues("ppha5") || 0;
        const ppha6Value = ppha4Value - ppha5Value;
        form.setValue("ppha6", ppha6Value);
    
    console.log("Auto-calculating ppha4:", { ppha1Value, ppha2Value, ppha3Value, ppha4Value });
    }, [form.watch("ppha1"), form.watch("ppha2"), form.watch("ppha3"), form.watch("ppha5")]);

    useEffect(() => {
        const pphb1Value = form.getValues("pphb1") || 0;
        const pphb2Value = form.getValues("pphb2") || 0; 
        const pphb3Value = form.getValues("pphb3") || 0;
        
        // Hitung pphb4 = pphb1 + pphb2 + pphb3
        const pphb4Value = pphb1Value + pphb2Value + pphb3Value;
        form.setValue("pphb4", pphb4Value);
        
        // Hitung pphb6 = pphb4 - pphb5
        const pphb5Value = form.getValues("pphb5") || 0;
        const pphb6Value = pphb4Value - pphb5Value;
        form.setValue("pphb6", pphb6Value);
        
        console.log("Auto-calculating pphb4:", { pphb1Value, pphb2Value, pphb3Value, pphb4Value, pphb6Value });
    }, [form.watch("pphb1"), form.watch("pphb2"), form.watch("pphb3"), form.watch("pphb5")]);

    useEffect(() => {
        if (filteredBupots?.length > 0) {
            const kapSums: {
                [key: string]: {
                    tax: number;
                    dpp: number;
                }
            } = {};

            let pph21Total = 0;
            let pph26Total = 0;
            
            filteredBupots.forEach(bupot => {
                if (bupot?.object?.kap && bupot?.facility === "tanpa fasilitas") {
                    const kap = bupot.object.kap;
                    
                    if (!kapSums[kap]) {
                        kapSums[kap] = { 
                            tax: 0, 
                            dpp: 0 
                        };
                    }
                    
                    kapSums[kap].tax += Number(bupot.tax || 0);
                    kapSums[kap].dpp += Number(bupot.dpp || 0);

                    if (kap === "411121-100" || kap === "411121-401" || kap === "411121-402") {
                    pph21Total += Number(bupot.tax || 0);
                    }
                    if (kap === "411127-100" || kap === "411127-101" || kap === "411127-102" || 
                        kap === "411127-104" || kap === "411127-105" || kap === "411127-107") {
                        pph26Total += Number(bupot.tax || 0);
                    }
                }
            });

            form.setValue("ppha1", pph21Total);
            form.setValue("pphb1", pph26Total);
        }   
    }, [filteredBupots, form]);

    useEffect(() => {
        if (filteredBupots?.length > 0) {
            const kapSums: {
                [key: string]: {
                    tax: number;
                    dpp: number;
                }
            } = {};

            let pph21Total = 0;
            let pph26Total = 0;
            
            filteredBupots.forEach(bupot => {
                if (bupot?.object?.kap && bupot?.facility === "pph ditanggung pemerintah") {
                    const kap = bupot.object.kap;
                    
                    if (!kapSums[kap]) {
                        kapSums[kap] = { 
                            tax: 0, 
                            dpp: 0 
                        };
                    }
                    
                    kapSums[kap].tax += Number(bupot.tax || 0);
                    kapSums[kap].dpp += Number(bupot.dpp || 0);

                    if (kap === "411121-100" || kap === "411121-401" || kap === "411121-402") {
                    pph21Total += Number(bupot.tax || 0);
                    }
                    if (kap === "411127-100" || kap === "411127-101" || kap === "411127-102" || 
                        kap === "411127-104" || kap === "411127-105" || kap === "411127-107") {
                        pph26Total += Number(bupot.tax || 0);
                    }
                }
            });
            form.setValue("pphapemerintah", pph21Total);
            form.setValue("pphbpemerintah", pph26Total);
        }   
    }, [filteredBupots, form]);
    
    const onSubmit = async (values: z.infer<typeof sptIndukSchema>) => {
        console.log("Form Values:", values);
        console.log("Totals before submit:", form.getValues());

        if (!values.ttd_name) {
        toast.error("Silahkan lengkapi data tanda tangan terlebih dahulu");
        return;
        }
        try {
        // Inisialisasi array untuk menyimpan data dari semua tab
        let tabIAData = [];
        let tabIBData = [];
        let tabIIAData = [];
        let tabIIIData = [];
        
        // Ambil data dari TabIA (komponen referensi didapatkan dari useRef)
        try {
                if (tabIARef.current) {
                    tabIAData = tabIARef.current.getFormData() || [];
                    console.log("Data DAFTAR-I berhasil diambil:", tabIAData.length);
                } else {
                    console.warn("tabIARef.current tidak tersedia");
                    if (Array.isArray(bupots)) {

                        tabIAData = bupots
                            .filter(item => item.object?.type === "pegawai" )
                            .map((item) => ({
                                tab_type: 'tabIA',
                                npwp: item.customer_id || '',
                                name: item.customer_name || '',
                                doc_no: item.doc_no || '',
                                doc_date: item.doc_date || '',
                                tax_type: item.object?.tax_type || '',
                                tax_code: item.object?.tax_code || '',
                                tax_name: item.object?.tax_name || '',
                                dpp: item.dpp || 0,
                                tarif: item.rates || 0,
                                tax: item.tax || 0,
                                facility: item.facility || '',
                                original_data: item 
                            }));
                        }
                }
            } catch (e) {
                console.error("Error saat mengambil data DAFTAR-IA:", e);
            }
        
        // Ambil data dari TabIB
        try {
                if (tabIBRef.current) {
                    tabIBData = tabIBRef.current.getFormData() || [];
                    console.log("Data DAFTAR-II berhasil diambil:", tabIBData.length);
                } else {
                    console.warn("tabIBRef.current tidak tersedia");
                    if (Array.isArray(bupots)) {

                        tabIBData = bupots
                            .filter(item => item.object?.type === "selainpegawai" )
                            .map((item) => ({
                                tab_type: 'tabIB',
                                npwp: item.customer_id || '',
                                name: item.customer_name || '',
                                doc_no: item.doc_no || '',
                                doc_date: item.doc_date || '',
                                tax_type: item.object?.tax_type || '',
                                tax_code: item.object?.tax_code || '',
                                tax_name: item.object?.tax_name || '',
                                dpp: item.dpp || 0,
                                tarif: item.rates || 0,
                                tax: item.tax || 0,
                                facility: item.facility || '',
                                original_data: item 
                            }));
                        }
                }
            } catch (e) {
                console.error("Error saat mengambil data DAFTAR-IB:", e);
            }
        
        // Ambil data dari TabIIA
        try {
                if (tabIIARef.current) {
                    tabIIAData = tabIIARef.current.getFormData() || [];
                    console.log("Data DAFTAR-IIA berhasil diambil:", tabIIAData.length);
                } else {
                    console.warn("tabIIARef.current tidak tersedia");
                    if (Array.isArray(bupots)) {

                        tabIIAData = bupots
                            .filter(item => item.object?.type === "selainpegawai" )
                            .map((item) => ({
                                tab_type: 'tabIIA',
                                npwp: item.customer_id || '',
                                name: item.customer_name || '',
                                doc_no: item.doc_no || '',
                                doc_date: item.doc_date || '',
                                tax_type: item.object?.tax_type || '',
                                tax_code: item.object?.tax_code || '',
                                tax_name: item.object?.tax_name || '',
                                dpp: item.dpp || 0,
                                tarif: item.rates || 0,
                                tax: item.tax || 0,
                                facility: item.facility || '',
                                original_data: item 
                            }));
                        }
                }
            } catch (e) {
                console.error("Error saat mengambil data DAFTAR-II:", e);
            }
        
        // Ambil data dari TabIII
        try {
                if (tabIIIRef.current) {
                    tabIIIData = tabIIIRef.current.getFormData() || [];
                    console.log("Data DAFTAR-III berhasil diambil:", tabIIIData.length);
                } else {
                    console.warn("tabIIIRef.current tidak tersedia");
                    if (Array.isArray(bupots)) {

                        tabIIIData = bupots
                            .filter(item => 
                            item.object?.type === "selain pegawai" || 
                            (item.object?.kap && item.object?.kap.includes("411127")))
                            .map((item) => ({
                                tab_type: 'tabIII',
                                npwp: item.customer_id || '',
                                name: item.customer_name || '',
                                doc_no: item.doc_no || '',
                                doc_date: item.doc_date || '',
                                tax_type: item.object?.tax_type || '',
                                tax_code: item.object?.tax_code || '',
                                tax_name: item.object?.tax_name || '',
                                dpp: item.dpp || 0,
                                tarif: item.rates || 0,
                                tax: item.tax || 0,
                                facility: item.facility || '',
                                customer_name: item.customer_name || '',
                                original_data: item 
                            }));
                        }
                }
            } catch (e) {
                console.error("Error saat mengambil data DAFTAR-III:", e);
            }
        
        // Gabungkan semua data tab dengan label tab_type masing-masing
        const allTabData = [
            ...tabIAData.map(item => ({ ...item, tab_type: 'tabIA' })),
            ...tabIBData.map(item => ({ ...item, tab_type: 'tabIB' })),
            ...tabIIAData.map(item => ({ ...item, tab_type: 'tabIIA' })),
            ...tabIIIData.map(item => ({ ...item, tab_type: 'tabIII' }))
        ];
        
        console.log("All tab data collected:", allTabData);
        
        // Tambahkan data tab ke form values
        const updatedFormValues = form.getValues();
        const formattedValues = {
            ...updatedFormValues,
            tab_data: allTabData,
            spt_id: spt?.id
        };
        
        // Lanjutkan dengan submission
        setPendingSubmit(formattedValues);
        
        // Set total pajak
        setTotal((form.getValues("ppha6") || 0) + (form.getValues("pphb6") || 0));
        
        // Buka modal pembayaran
        setOpenModalPayment(true);
    } catch (error) {
        console.error("Error collecting tab data:", error);
    }
        
    };

    const handlePasswordConfirm = async (password: string) => {
        if (pendingSubmit) {
            const formatDate = (dateStr: any): string => {
                if (!dateStr) return "";

                try {
                    const date = new Date(dateStr);
                    if (isNaN(date.getTime())) return "";
                    return format(date, "yyyy-MM-dd");
                } catch {
                    return "";
                }
            };

            const generateBillingCode = () => {
                return Math.floor(
                    100000000000000 + Math.random() * 900000000000000
                ).toString();
            };

            const numberToWords = (num: number): string => {
                const units = [
                    "", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"
                ];
                const teens = [
                    "sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", 
                    "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas"
                ];
                const tens = [
                    "", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh",
                    "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh"
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
                                chunkWords += `${tens[Math.floor(remainder / 10)]} ${units[remainder % 10]}`;
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

                return words
                    .trim()
                    .replace(/\s+/g, " ")
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ") + " Rupiah";
            };

            const totalPph = (form.getValues("ppha1") || 0) + (form.getValues("pphb1") || 0);

            const finalData = {
                ...pendingSubmit,
                payment_method: paymentMethod,
                password: password,
                billing_data: {
                    billing_type_id: 444, 
                    start_period: spt.start_period,
                    year: spt.year,
                    currency: "IDR",
                    amount: totalPph,
                    amount_in_words: numberToWords(totalPph),
                    description: `SPT Masa PPh 21/26`,
                    status: "unpaid",
                    active_period: formatDate(new Date(new Date().setDate(new Date().getDate() + 7))),
                    code: generateBillingCode()
                },
                ledger_data: {
                    billing_type_id: 444, 
                    transaction_date: formatDate(new Date()),
                    posting_date: formatDate(new Date()),
                    accounting_type: "surat pemberitahuan",
                    accounting_type_detail: spt.correction_number === 1 ? "spt pembetulan" : "spt normal",
                    currency: "IDR",
                    transaction_type: "debit",
                    debit_amount: -totalPph,
                    debit_unpaid: 0,
                    credit_amount: 0,
                    credit_left: 0,
                    kap: "411121", 
                    kap_description: "PPh Masa 21/26",
                    kjs: "100",
                    tax_period: `${spt.start_period} ${spt.year}`,
                    transaction_number: transactionNumber
                }
            };

            console.log("Data final yang dikirim:", finalData);
            
            router.post(route("spt.store21"), finalData);
            setPendingSubmit(null);
        }

        setOpenPasswordModal(false);
    };
    console.log("data object:", filteredBupots);

    return (
        <Authenticated>
            <Head title="SPT Masa PPH Unifikasi" />
            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("spt.konsep")}>
                                    Konsep SPT 
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detail SPT Masa PPH 21/26 </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                    Pemotongan PPH Pasal 21 atau 26
                    </h1>
                    <div className="flex flex-col gap-4 bg-sidebar border rounded-xl p-5 md:p-8">
                        <Tabs defaultValue="Main Form" className="w-full">
                            <TabsList className="flex justify-start gap-2">
                                <TabsTrigger value="Main Form">
                                Pemotongan PPH Pasal 21 atau 26
                                </TabsTrigger>
                                <TabsTrigger value="A">L-IA</TabsTrigger>
                                <TabsTrigger value="B">L-IB</TabsTrigger>
                                <TabsTrigger value="II">L-II</TabsTrigger>
                                <TabsTrigger value="III">L-III</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Main Form" className="w-full">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            onSubmit,
                                            (errors) =>
                                                console.error(
                                                    "Form validation errors:",
                                                    errors
                                                )
                                        )}
                                    >
                                        {/* Header */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                            defaultValue="item-1"
                                        >
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className="bg-muted p-4 w-full rounded">
                                                    HEADER
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                <div className="flex flex-col space-y-2">
                                                <FormField
                                                    name="user.name"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center gap-4">
                                                            <FormLabel className="text-base font-medium min-w-[200px]">
                                                                Periode Pajak Bulan 
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    defaultValue={spt?.start_period || "-"}
                                                                    disabled
                                                                    {...field}
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    name="user.npwp"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center gap-4">
                                                            <FormLabel className="text-base font-medium min-w-[200px] ">
                                                                Periode Pajak Tahun 
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    defaultValue={spt?.year || "-"}
                                                                    disabled
                                                                    {...field}
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    name="user.name"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center gap-4">
                                                            <FormLabel className="text-base font-medium min-w-[200px] ">
                                                                Status 
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    defaultValue={spt?.status || "-"}
                                                                    disabled
                                                                    {...field}
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                            </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* A */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full mt-4"
                                            defaultValue="item-1"
                                        >
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className="bg-muted p-4 w-full rounded">
                                                    A. IDENTITAS PEMOTONG
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                <div className="flex flex-col space-y-2">
                                                
                                                
                                                <FormField
                                                    name="user.npwp"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center gap-4">
                                                            <FormLabel className="text-base font-medium min-w-[200px] ">
                                                                NPWP/NIK 
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    defaultValue={user.npwp}
                                                                    disabled
                                                                    {...field}
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    name="user.name"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center gap-4">
                                                            <FormLabel className="text-base font-medium min-w-[200px] ">
                                                                Nama Lengkap 
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    defaultValue={user.name}
                                                                    disabled
                                                                    {...field}
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    name="user.address"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center gap-4">
                                                            <FormLabel className="text-base font-medium min-w-[200px] ">
                                                                Alamat 
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    defaultValue={user.address}
                                                                    disabled
                                                                    {...field}
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                
                                                <FormField
                                                    name="user.phone_number"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center gap-4">
                                                            <FormLabel className="text-base font-medium min-w-[200px] ">
                                                                Nomor Telepon 
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    defaultValue={user.phone_number}
                                                                    disabled
                                                                    {...field}
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* B */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    B. PAJAK PENGHASILAN PASAL 21
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white  w-full ">
                                                    <div className="bg-white rounded  ">
                                                        <div className="bg-gray-100 p-4 rounded  w-full mb-4">
                                                        I. PAJAK PENGHASILAN PASAL 21 YANG DIPOTONG
                                                        </div>
                                                      <Table className="w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                No
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[64%]" rowSpan={2}>
                                                                URAIAN
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[15%]" rowSpan={2}>
                                                                KAP-KJS
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                JUMLAH (Rp)
                                                            </TableHead>
                                                        </TableRow>
                                                        
                                                    </TableHeader>
                                                        <TableBody>
                                                        <TableRow>
                                                            <TableCell className="border border-gray-300 text-center text-xs">
                                                                1.
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                            
                                                                    PAJAK PEMOTONGAN PENGHASILAN PASAL 21 YANG DILAKUKAN PEMOTONGAN
                                                                
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                                <div className="text-center font-medium">411121-100</div>
                                                                                                                                                          
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                            <FormField
                                                                  name="ppha1"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                            </TableCell>
                                                            
                                                        </TableRow>
                                                        
                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">
                                                                    2.
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    PENYERAHAN KELEBIHAN PEMBAYARAN PAJAK PENGHASILAN PASAL 21 DARI PERIODE PAJAK SEBELUMNYA
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="ppha2"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                                onChange={(e) => {
                                                                                    const rawValue = e.target.value.replace(/[^\d]/g, '');
                                                                                    const numericValue = rawValue ? - parseInt(rawValue, 10) : 0;
                                                                                    field.onChange(numericValue);
                                                                                }}
                                                                                onBlur={field.onBlur}
                                                                                name={field.name}
                                                                                ref={field.ref}  
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                                
                                                            </TableRow>

                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">
                                                                    3.
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    PEMBAYARAN PAJAK PENGHASILAN PASAL 21 DENGAN SP2D (HANYA UNTUK INSTANSI PEMERINTAH)
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="ppha3"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                                
                                                            </TableRow>

                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">4.</TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    PAJAK PENGHASILAN PASAL 21 YANG KURANG BAYAR (LEBIH BAYAR) (1-2-3) (Setiap Kelebihan Pembayaran Diteruskan)
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell >
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="ppha4"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                                
                                                            </TableRow>
                                                      

                                                    <TableRow>
                                                        <TableCell className="border border-gray-300 text-xs text-center">
                                                            5.
                                                        </TableCell>
                                                        <TableCell className="border border-gray-300 text-xs">
                                                                PAJAK PENGHASILAN PASAL 21 YANG DIBAYAR PADA SPT YANG DIPERBAIKI

                                                        </TableCell>
                                                        <TableCell className="border border-gray-300 text-xs">
                                                        
                                                        </TableCell>
                                                        <TableCell className="border border-gray-300 text-xs">
                                                        <FormField
                                                                  name="ppha5"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                   type="text"
                                                                                    {...field}
                                                                                    value={formatRupiah(field.value)}
                                                                                    onChange={(e) => {
                                                                                        const rawValue = e.target.value.replace(/[^\d]/g, '');
                                                                                        const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
                                                                                        field.onChange(numericValue);
                                                                                    }}
                                                                                    onBlur={field.onBlur}
                                                                                    name={field.name}
                                                                                    ref={field.ref}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                        </TableCell>
                                                        
                                                    </TableRow>

                                                    
                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">6.</TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    PAJAK PENGHASILAN PASAL 21 YANG KURANG BAYAR (LEBIH BAYAR) (4-5) (Setiap Kelebihan Pembayaran Diteruskan)
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="ppha6"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                            </TableRow>
                                                      

                                                    </TableBody>
                                                    </Table>
                                                    </div>
                                                </AccordionContent>
                                                <AccordionContent className="p-4 bg-white  w-full ">
                                                    <div className="bg-white rounded  ">
                                                        <div className="bg-gray-100 p-4 rounded  w-full mb-4">
                                                        II. PAJAK PENGHASILAN PASAL 21 YANG DITANGGUNG OLEH PEMERINTAH
                                                        </div>
                                                      <Table className="w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                No
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[64%]" rowSpan={2}>
                                                                URAIAN
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[15%]" rowSpan={2}>
                                                                KAP-KJS
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                JUMLAH (Rp)
                                                            </TableHead>
                                                        </TableRow>
                                                        
                                                    </TableHeader>
                                                        <TableBody>
                                                        <TableRow>
                                                            <TableCell className="border border-gray-300 text-center text-xs">
                                                                1.
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                                    PAJAK PENGHASILAN PASAL 21 YANG DITANGGUNG OLEH PEMERINTAH                                              
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                                <div className="text-center font-medium">411121-100</div>
                                                                                                                                                          
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                            <FormField
                                                                  name="pphapemerintah"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                            </TableCell>
                                                            
                                                        </TableRow>

                                                    </TableBody>
                                                    </Table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* B */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    C. PAJAK PENGHASILAN PASAL 26
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white  w-full ">
                                                    <div className="bg-white rounded  ">
                                                        <div className="bg-gray-100 p-4 rounded  w-full mb-4">
                                                        I. PAJAK PENGHASILAN PASAL 26 YANG DIPOTONG
                                                        </div>
                                                      <Table className="w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                No
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[64%]" rowSpan={2}>
                                                                URAIAN
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[15%]" rowSpan={2}>
                                                                KAP-KJS
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                JUMLAH (Rp)
                                                            </TableHead>
                                                        </TableRow>
                                                        
                                                    </TableHeader>
                                                        <TableBody>
                                                        <TableRow>
                                                            <TableCell className="border border-gray-300 text-center text-xs">
                                                                1.
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                            
                                                                    PAJAK PENGHASILAN PASAL 26 YANG DIPOTONG
                                                                
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                                 <div className="text-center font-normal">411127-100</div>                                                                                         
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                            <FormField
                                                                  name="pphb1"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                            </TableCell>
                                                            
                                                        </TableRow>
                                                        
                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">
                                                                    2.
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    MEMBAWA KE DEPAN KELEBIHAN BAYAR PAJAK PENGHASILAN PASAL 26 DARI PERIODE PAJAK SEBELUMNYA
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="pphb2"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  value={formatRupiah(field.value)}
                                                                                    onChange={(e) => {
                                                                                        const rawValue = e.target.value.replace(/[^\d]/g, '');
                                                                                        const numericValue = rawValue ? -parseInt(rawValue, 10) : 0;
                                                                                        field.onChange(numericValue);
                                                                                    }}
                                                                                    onBlur={field.onBlur}
                                                                                    name={field.name}
                                                                                    ref={field.ref}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                                
                                                            </TableRow>

                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">
                                                                    3.
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    PEMBAYARAN PAJAK PENGHASILAN PASAL 26 DENGAN SP2D (HANYA UNTUK INSTANSI PEMERINTAH)
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="pphb3"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                                
                                                            </TableRow>

                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">4.</TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    PAJAK PENGHASILAN PASAL 26 YANG KURANG BAYAR (LEBIH BAYAR) (1-2-3) (Setiap Kelebihan Bayar Akan Dibawa Ke Depan)
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell >
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="pphb4"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                                
                                                            </TableRow>
                                                      

                                                    <TableRow>
                                                        <TableCell className="border border-gray-300 text-xs text-center">
                                                            5.
                                                        </TableCell>
                                                        <TableCell className="border border-gray-300 text-xs">
                                                                PAJAK PENGHASILAN PASAL 26 YANG DIBAYAR PADA PENGEMBALIAN PAJAK YANG DIUBAH

                                                        </TableCell>
                                                        <TableCell className="border border-gray-300 text-xs">
                                                        
                                                        </TableCell>
                                                        <TableCell className="border border-gray-300 text-xs">
                                                        <FormField
                                                                  name="pphb5"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  value={formatRupiah(field.value)}
                                                                                    onChange={(e) => {
                                                                                        const rawValue = e.target.value.replace(/[^\d]/g, '');
                                                                                        const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
                                                                                        field.onChange(numericValue);
                                                                                    }}
                                                                                    onBlur={field.onBlur}
                                                                                    name={field.name}
                                                                                    ref={field.ref}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                        </TableCell>
                                                        
                                                    </TableRow>

                                                    
                                                            <TableRow>
                                                                <TableCell className="border border-gray-300 text-xs text-center">6.</TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                    PAJAK PENGHASILAN PASAL 26 YANG KURANG BAYAR (KELEBIHAN BAYAR) (4-5) (Setiap Kelebihan Bayar Akan Dibawa ke Depan)
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                
                                                                </TableCell>
                                                                <TableCell className="border border-gray-300 text-xs">
                                                                <FormField
                                                                  name="pphb6"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                                </TableCell>
                                                            </TableRow>
                                                      

                                                    </TableBody>
                                                    </Table>
                                                    </div>
                                                </AccordionContent>

                                                <AccordionContent className="p-4 bg-white  w-full ">
                                                    <div className="bg-white rounded  ">
                                                        <div className="bg-gray-100 p-4 rounded  w-full mb-4">
                                                        II. PAJAK PENGHASILAN PASAL 26 YANG DITANGGUNG OLEH PEMERINTAH
                                                        </div>
                                                      <Table className="w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                No
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[64%]" rowSpan={2}>
                                                                URAIAN
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center w-[15%]" rowSpan={2}>
                                                                KAP-KJS
                                                            </TableHead>
                                                            <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                JUMLAH (Rp)
                                                            </TableHead>
                                                        </TableRow>
                                                        
                                                    </TableHeader>
                                                        <TableBody>
                                                        <TableRow>
                                                            <TableCell className="border border-gray-300 text-center text-xs">
                                                                1.
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                                    PAJAK PENGHASILAN PASAL 26 YANG DITANGGUNG OLEH PEMERINTAH                                              
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                                <div className="text-center font-medium">411127-100</div>                                                                               
                                                            </TableCell>
                                                            <TableCell className="border border-gray-300 text-xs">
                                                            <FormField
                                                                  name="pphbpemerintah"
                                                                  render={({
                                                                      field,
                                                                  }) => (
                                                                      <FormItem>
                                                                          <FormControl>
                                                                              <Input
                                                                                  type="text"
                                                                                  {...field}
                                                                                  disabled
                                                                                  value={formatRupiah(
                                                                                      field.value
                                                                                  )}
                                                                              />
                                                                          </FormControl>
                                                                      </FormItem>
                                                                  )}
                                                              />
                                                            </TableCell>
                                                            
                                                        </TableRow>

                                                    </TableBody>
                                                    </Table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* Penyerahan */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-penyerahan">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    D. PERNYATAAN DAN TANDA TANGAN  
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 w-full">
                                                    <div>
                                                        <div className="flex items-start gap-3 pb-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={pernyataanSetuju}
                                                                onChange={(e) => setPernyataanSetuju(e.target.checked)}
                                                                className="h-4 w-4 text-primary mt-1"
                                                            />
                                                            <div className="text-sm font-medium">
                                                                Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi-sanksi sesuai dengan ketentuan perundang-undangan yang berlaku, saya menyatakan bahwa apa yang telah saya beritahukan diatas beserta lampiran-lampirannya adalah benar,lengkap dan jelas.*
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                        <FormField
                                                            name="penandatangan"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-center gap-4">
                                                                    <FormLabel className="text-base font-medium min-w-[200px]">
                                                                        Penandatangan* :
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <RadioGroup
                                                                            onValueChange={field.onChange}
                                                                            value={field.value}
                                                                            className="flex flex-row space-x-6"
                                                                            required
                                                                        >
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem value="Wajib Pajak" id="Wajib Pajak" />
                                                                                <label htmlFor="Wajib Pajak">Wajib Pajak</label>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem value="Kuasa Wajib Pajak" id="Kuasa Wajib Pajak" />
                                                                                <label htmlFor="Kuasa Wajib Pajak">Kuasa Wajib Pajak</label>
                                                                            </div>
                                                                        </RadioGroup>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        
                                                        <FormField
                                                            name="ttd_name"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem className="flex flex-row items-center gap-4">
                                                                    <FormLabel className="text-base font-medium min-w-[200px]">
                                                                        Nama Tanda Tangan* :
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            {...field}
                                                                            required
                                                                            className="flex-1"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        
                                                        </div>
                                                        <div className="flex justify-end mt-4">
                                                            <Button 
                                                                type="submit"
                                                                disabled={!pernyataanSetuju}
                                                                className={`${!pernyataanSetuju ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                Bayar dan Lapor
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </form>
                                </Form>
                            </TabsContent>

                            <TabsContent value="A">
                                <TabLIA
                                    ref={tabIARef}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    bupots={bupots}
                                    // Prop lainnya dapat ditambahkan nanti sesuai kebutuhan
                                />
                            </TabsContent>
                            <TabsContent value="B">
                                <TabLIB
                                    ref={tabIBRef}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    bupots={bupots}
                                    bupotA1={bupotA1}
                                    bupotA2={bupotA2}
                                    
                                />
                            </TabsContent>
                            <TabsContent value="II">
                                <TabLII
                                    ref={tabIIARef}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    bupots={bupots}
                                    bupotA1={bupotA1}
                                    bupotA2={bupotA2}
                                    
                                />
                            </TabsContent>
                            <TabsContent value="III">
                                <TabLIII
                                    ref={tabIIIRef}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    bupots={bupots}
                                    
                                />
                            </TabsContent>
                            
                        </Tabs>
                    </div>
                </div>
            </div>
            <PasswordVerificationDialog
                open={openPasswordModal}
                onClose={() => setOpenPasswordModal(false)}
                onConfirm={handlePasswordConfirm}
            />
            <PaymentDialog
                title="Pilih Metode Pembayaran"
                description="Anda memiliki saldo deposit yang cukup untuk membayar kekurangan pembayaran. Jika Anda ingin membayar menggunakan saldo deposit, klik tombol 'Bayar dengan Saldo Deposit'. Jika tidak, klik tombol 'Buat Kode Billing'."
                open={openModalPayment}
                onClose={() => setOpenModalPayment(false)}
                onConfirmBilling={() => {
                    setPaymentMethod("billing");
                    setOpenModalPayment(false);
                    setOpenPasswordModal(true);
                }}
                onConfirmDeposit={() => {
                    setPaymentMethod("deposit");
                    setOpenModalPayment(false);
                    setOpenPasswordModal(true);
                }}
                onConfirmSpt={() => {
                    setPaymentMethod("spt");
                    setOpenModalPayment(false);
                    setOpenPasswordModal(true);
                }}
                saldo={userSaldo}
                total={total}
            />
        </Authenticated>
    );
};

export default DetailSPT;
