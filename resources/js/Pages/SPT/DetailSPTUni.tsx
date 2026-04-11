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
import TabI from "./TablistUni/TabI";
import TabII from "./TablistUni/TabII";
import TabLampiran from "./TablistUni/TabLampiran";
import { InvoiceColumns } from "@/Components/layout/Invoice/columns";
import { useState, useEffect, useRef } from "react";
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
    setor_1: z.number().int(),
    setor_1a: z.number().int(),
    setor_1b: z.number().int(),
    setor_1c: z.number().int(),
    setor_2: z.number().int(),
    setor_2a: z.number().int(),
    setor_2b: z.number().int(),
    setor_3: z.number().int(),
    setor_3a: z.number().int(),
    setor_3b: z.number().int(),
    setor_3c: z.number().int(),
    setor_4: z.number().int(),
    setor_4a: z.number().int(),
    setor_5: z.number().int(),
    setor_5a: z.number().int(),
    total_setor: z.number().int(),
    pemotongan_1: z.number().int(),
    pemotongan_1a: z.number().int(),
    pemotongan_1b: z.number().int(),
    pemotongan_1c: z.number().int(),
    pemotongan_2: z.number().int(),
    pemotongan_2a: z.number().int(),
    pemotongan_2b: z.number().int(),
    pemotongan_3: z.number().int(),
    pemotongan_3a: z.number().int(),
    pemotongan_3b: z.number().int(),
    pemotongan_3c: z.number().int(),
    pemotongan_4: z.number().int(),
    pemotongan_4a: z.number().int(),
    pemotongan_5: z.number().int(),
    pemotongan_5a: z.number().int(),
    total_pemotongan: z.number().int(),
    pphpemerintah_1: z.number().int(),
    pphpemerintah_1a: z.number().int(),
    pphpemerintah_1b: z.number().int(),
    pphpemerintah_1c: z.number().int(),
    pphpemerintah_2: z.number().int(),
    pphpemerintah_2a: z.number().int(),
    pphpemerintah_2b: z.number().int(),
    pphpemerintah_3: z.number().int(),
    pphpemerintah_3a: z.number().int(),
    pphpemerintah_3b: z.number().int(),
    pphpemerintah_3c: z.number().int(),
    pphpemerintah_4: z.number().int(),
    pphpemerintah_4a: z.number().int(),
    pphpemerintah_5: z.number().int(),
    pphpemerintah_5a: z.number().int(),
    total_pphpemerintah: z.number().int(),
    jumlahpph_1: z.number().int(),
    jumlahpph_1a: z.number().int(),
    jumlahpph_1b: z.number().int(),
    jumlahpph_1c: z.number().int(),
    jumlahpph_2: z.number().int(),
    jumlahpph_2a: z.number().int(),
    jumlahpph_2b: z.number().int(),
    jumlahpph_3: z.number().int(),
    jumlahpph_3a: z.number().int(),
    jumlahpph_3b: z.number().int(),
    jumlahpph_3c: z.number().int(),
    jumlahpph_4: z.number().int(),
    jumlahpph_4a: z.number().int(),
    jumlahpph_5: z.number().int(),
    jumlahpph_5a: z.number().int(),
    total_jumlahpph: z.number().int(),
    pphdibetulkan_1: z.number().int(),
    pphdibetulkan_1a: z.number().int(),
    pphdibetulkan_1b: z.number().int(),
    pphdibetulkan_1c: z.number().int(),
    pphdibetulkan_2: z.number().int(),
    pphdibetulkan_2a: z.number().int(),
    pphdibetulkan_2b: z.number().int(),
    pphdibetulkan_3: z.number().int(),
    pphdibetulkan_3a: z.number().int(),
    pphdibetulkan_3b: z.number().int(),
    pphdibetulkan_3c: z.number().int(),
    pphdibetulkan_4: z.number().int(),
    pphdibetulkan_4a: z.number().int(),
    pphdibetulkan_5: z.number().int(),
    pphdibetulkan_5a: z.number().int(),
    total_pphdibetulkan: z.number().int(),
    pphkurangbayar_1: z.number().int(),
    pphkurangbayar_1a: z.number().int(),
    pphkurangbayar_1b: z.number().int(),
    pphkurangbayar_1c: z.number().int(),
    pphkurangbayar_2: z.number().int(),
    pphkurangbayar_2a: z.number().int(),
    pphkurangbayar_2b: z.number().int(),
    pphkurangbayar_3: z.number().int(),
    pphkurangbayar_3a: z.number().int(),
    pphkurangbayar_3b: z.number().int(),
    pphkurangbayar_3c: z.number().int(),
    pphkurangbayar_4: z.number().int(),
    pphkurangbayar_4a: z.number().int(),
    pphkurangbayar_5: z.number().int(),
    pphkurangbayar_5a: z.number().int(),
    total_pphkurangbayar: z.number().int(),
    penandatangan: z.enum([
        "Wajib Pajak",
        "Kuasa Wajib Pajak",
    ]),
    ttd_npwp: z.string(),
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
    bupots: any[];
    masterBillingTypes: any[];

}

const DetailSPT = ({
    spt,
    returnsOthers,
    saldo,
    transactionNumber,
    bupots,
    masterBillingTypes,
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
    const tabIRef = useRef<TabRefType>(null);
    const tabIIRef = useRef<TabRefType>(null);
    const tabLampiranRef = useRef<TabRefType>(null);

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
            setor_1: 0,
            setor_1a: 0,
            setor_1b: 0,
            setor_1c: 0,
            setor_2: 0,
            setor_2a: 0,
            setor_2b: 0,
            setor_3: 0,
            setor_3a: 0,
            setor_3b: 0,
            setor_3c: 0,
            setor_4: 0,
            setor_4a: 0,
            setor_5: 0,
            setor_5a: 0,
            total_setor: 0,
            pemotongan_1: 0,
            pemotongan_1a: 0,
            pemotongan_1b: 0,
            pemotongan_1c: 0,
            pemotongan_2: 0,
            pemotongan_2a: 0,
            pemotongan_2b: 0,
            pemotongan_3: 0,
            pemotongan_3a: 0,
            pemotongan_3b: 0,
            pemotongan_3c: 0,
            pemotongan_4: 0,
            pemotongan_4a: 0,
            pemotongan_5: 0,
            pemotongan_5a: 0,
            total_pemotongan: 0,
            pphpemerintah_1: 0,
            pphpemerintah_1a: 0,
            pphpemerintah_1b: 0,
            pphpemerintah_1c: 0,
            pphpemerintah_2: 0,
            pphpemerintah_2a: 0,
            pphpemerintah_2b: 0,
            pphpemerintah_3: 0,
            pphpemerintah_3a: 0,
            pphpemerintah_3b: 0,
            pphpemerintah_3c: 0,
            pphpemerintah_4: 0,
            pphpemerintah_4a: 0,
            pphpemerintah_5: 0,
            pphpemerintah_5a: 0,
            total_pphpemerintah: 0,
            jumlahpph_1: 0,
            jumlahpph_1a: 0,
            jumlahpph_1b: 0,
            jumlahpph_1c: 0,
            jumlahpph_2: 0,
            jumlahpph_2a: 0,
            jumlahpph_2b: 0,
            jumlahpph_3: 0,
            jumlahpph_3a: 0,
            jumlahpph_3b: 0,
            jumlahpph_3c: 0,
            jumlahpph_4: 0,
            jumlahpph_4a: 0,
            jumlahpph_5: 0,
            jumlahpph_5a: 0,
            total_jumlahpph: 0,
            pphdibetulkan_1: 0,
            pphdibetulkan_1a: 0,
            pphdibetulkan_1b: 0,
            pphdibetulkan_1c: 0,
            pphdibetulkan_2: 0,
            pphdibetulkan_2a: 0,
            pphdibetulkan_2b: 0,
            pphdibetulkan_3: 0,
            pphdibetulkan_3a: 0,
            pphdibetulkan_3b: 0,
            pphdibetulkan_3c: 0,
            pphdibetulkan_4: 0,
            pphdibetulkan_4a: 0,
            pphdibetulkan_5: 0,
            pphdibetulkan_5a: 0,
            total_pphdibetulkan: 0,
            pphkurangbayar_1: 0,
            pphkurangbayar_1a: 0,
            pphkurangbayar_1b: 0,
            pphkurangbayar_1c: 0,
            pphkurangbayar_2: 0,
            pphkurangbayar_2a: 0,
            pphkurangbayar_2b: 0,
            pphkurangbayar_3: 0,
            pphkurangbayar_3a: 0,
            pphkurangbayar_3b: 0,
            pphkurangbayar_3c: 0,
            pphkurangbayar_4: 0,
            pphkurangbayar_4a: 0,
            pphkurangbayar_5: 0,
            pphkurangbayar_5a: 0,
            total_pphkurangbayar: 0,
            penandatangan: "Wajib Pajak",
            ttd_npwp: "",
            ttd_name: "",
            payment_method: "",
            password: "",
        },
    });


    useEffect(() => {
        if (filteredBupots?.length > 0) {
            const prefixSums: {
                [prefix: string]: number;
            } = {};

            filteredBupots.forEach(bupot => {
                if (bupot?.object?.kap && bupot?.facility === "tanpa fasilitas" && (bupot?.object?.type === "bpnr" || bupot?.object?.type === "bppu")) {
                    const kap = bupot.object.kap;
                    const prefix = kap.slice(0, 6);

                    if (!prefixSums[prefix]) {
                        prefixSums[prefix] = 0;
                    }

                    prefixSums[prefix] += Number(bupot.tax || 0);
                }
            });

            form.setValue("pemotongan_1", 0);
            form.setValue("pemotongan_2", 0);
            form.setValue("pemotongan_3", 0);
            form.setValue("pemotongan_4", 0);
            form.setValue("pemotongan_5", 0);

            Object.entries(prefixSums).forEach(([prefix, totalTax]) => {
                switch (prefix) {
                    case "411128":
                        form.setValue("pemotongan_1", (form.getValues("pemotongan_1") || 0) + totalTax);
                        break;
                    case "411129":
                        form.setValue("pemotongan_2", (form.getValues("pemotongan_2") || 0) + totalTax);
                        break;
                    case "411122":
                    case "411123":
                        form.setValue("pemotongan_3", (form.getValues("pemotongan_3") || 0) + totalTax);
                        break;
                    case "411124":
                        form.setValue("pemotongan_4", (form.getValues("pemotongan_4") || 0) + totalTax);
                        break;
                    case "411127":
                        form.setValue("pemotongan_5", (form.getValues("pemotongan_5") || 0) + totalTax);
                        break;
                    default:
                        break;
                }
            });
        }
    }, [filteredBupots, form]);

    useEffect(() => {
        if (filteredBupots?.length > 0) {
            const prefixSums: {
                [prefix: string]: number;
            } = {};

            filteredBupots.forEach(bupot => {
                if (bupot?.object?.kap && bupot?.object?.type === "sendiri") {
                    const kap = bupot.object.kap;
                    const prefix = kap.slice(0, 6);

                    if (!prefixSums[prefix]) {
                        prefixSums[prefix] = 0;
                    }

                    prefixSums[prefix] += Number(bupot.tax || 0);
                }
            });

            // Reset nilai setor terlebih dahulu
            form.setValue("setor_1", 0);
            form.setValue("setor_2", 0);
            form.setValue("setor_3", 0);
            form.setValue("setor_4", 0);
            form.setValue("setor_5", 0);

            // Set nilai berdasarkan prefix KAP
            Object.entries(prefixSums).forEach(([prefix, totalTax]) => {
                switch (prefix) {
                    case "411128":
                        form.setValue("setor_1", (form.getValues("setor_1") || 0) + totalTax);
                        break;
                    case "411129":
                        form.setValue("setor_2", (form.getValues("setor_2") || 0) + totalTax);
                        break;
                    case "411122":
                    case "411123":
                        form.setValue("setor_3", (form.getValues("setor_3") || 0) + totalTax);
                        break;
                    case "411124":
                        form.setValue("setor_4", (form.getValues("setor_4") || 0) + totalTax);
                        break;
                    case "411127":
                        form.setValue("setor_5", (form.getValues("setor_5") || 0) + totalTax);
                        break;
                    default:
                        break;
                }
            });

            // Hitung dan set total_setor
            const totalSetor = 
                (form.getValues("setor_1") || 0) +
                (form.getValues("setor_1a") || 0) +
                (form.getValues("setor_1b") || 0) +
                (form.getValues("setor_1c") || 0) +
                (form.getValues("setor_2") || 0) +
                (form.getValues("setor_2a") || 0) +
                (form.getValues("setor_2b") || 0) +
                (form.getValues("setor_3") || 0) +
                (form.getValues("setor_3a") || 0) +
                (form.getValues("setor_3b") || 0) +
                (form.getValues("setor_3c") || 0) +
                (form.getValues("setor_4") || 0) +
                (form.getValues("setor_4a") || 0) +
                (form.getValues("setor_5") || 0) +
                (form.getValues("setor_5a") || 0);
                
            form.setValue("total_setor", totalSetor);

            console.log("Nilai setor setelah kalkulasi:", {
                setor_1: form.getValues("setor_1"),
                setor_2: form.getValues("setor_2"),
                setor_3: form.getValues("setor_3"),
                setor_4: form.getValues("setor_4"),
                setor_5: form.getValues("setor_5"),
                total_setor: totalSetor
            });
        }
    }, [filteredBupots, form]);




    useEffect(() => {
        if (filteredBupots?.length > 0) {
            const prefixSums: {
                [prefix: string]: number;
            } = {};

            filteredBupots.forEach(bupot => {
                if (bupot?.object?.kap && bupot?.facility === "pph ditanggung pemerintah") {
                    const kap = bupot.object.kap;
                    const prefix = kap.slice(0, 6);

                    if (!prefixSums[prefix]) {
                        prefixSums[prefix] = 0;
                    }

                    prefixSums[prefix] += Number(bupot.tax || 0);
                }
            });

            form.setValue("pphpemerintah_1", 0);
            form.setValue("pphpemerintah_2", 0);
            form.setValue("pphpemerintah_3", 0);
            form.setValue("pphpemerintah_4", 0);
            form.setValue("pphpemerintah_5", 0);

            Object.entries(prefixSums).forEach(([prefix, totalTax]) => {
                switch (prefix) {
                    case "411128":
                        form.setValue("pphpemerintah_1", (form.getValues("pphpemerintah_1") || 0) + totalTax);
                        break;
                    case "411129":
                        form.setValue("pphpemerintah_2", (form.getValues("pphpemerintah_2") || 0) + totalTax);
                        break;
                    case "411122":
                    case "411123":
                        form.setValue("pphpemerintah_3", (form.getValues("pphpemerintah_3") || 0) + totalTax);
                        break;
                    case "411124":
                        form.setValue("pphpemerintah_4", (form.getValues("pphpemerintah_4") || 0) + totalTax);
                        break;
                    case "411127":
                        form.setValue("pphpemerintah_5", (form.getValues("pphpemerintah_5") || 0) + totalTax);
                        break;
                    default:
                        break;
                }
            });
        }
    }, [filteredBupots, form]);

    // useEffect untuk menghitung jumlahpph dan total secara otomatis
    useEffect(() => {
        // Hitung jumlahpph dari setor + pemotongan untuk setiap field
        const jumlahpph1 = (form.getValues("setor_1") || 0) + (form.getValues("pemotongan_1") || 0);
        const jumlahpph2 = (form.getValues("setor_2") || 0) + (form.getValues("pemotongan_2") || 0);
        const jumlahpph3 = (form.getValues("setor_3") || 0) + (form.getValues("pemotongan_3") || 0);
        const jumlahpph4 = (form.getValues("setor_4") || 0) + (form.getValues("pemotongan_4") || 0);
        const jumlahpph5 = (form.getValues("setor_5") || 0) + (form.getValues("pemotongan_5") || 0);

        // Hitung juga untuk sub field
        const jumlahpph1a = (form.getValues("setor_1a") || 0) + (form.getValues("pemotongan_1a") || 0);
        const jumlahpph1b = (form.getValues("setor_1b") || 0) + (form.getValues("pemotongan_1b") || 0);
        const jumlahpph1c = (form.getValues("setor_1c") || 0) + (form.getValues("pemotongan_1c") || 0);
        const jumlahpph2a = (form.getValues("setor_2a") || 0) + (form.getValues("pemotongan_2a") || 0);
        const jumlahpph2b = (form.getValues("setor_2b") || 0) + (form.getValues("pemotongan_2b") || 0);
        const jumlahpph3a = (form.getValues("setor_3a") || 0) + (form.getValues("pemotongan_3a") || 0);
        const jumlahpph3b = (form.getValues("setor_3b") || 0) + (form.getValues("pemotongan_3b") || 0);
        const jumlahpph3c = (form.getValues("setor_3c") || 0) + (form.getValues("pemotongan_3c") || 0);
        const jumlahpph4a = (form.getValues("setor_4a") || 0) + (form.getValues("pemotongan_4a") || 0);
        const jumlahpph5a = (form.getValues("setor_5a") || 0) + (form.getValues("pemotongan_5a") || 0);

        // Set nilai jumlahpph yang sudah dihitung
        form.setValue("jumlahpph_1", jumlahpph1);
        form.setValue("jumlahpph_2", jumlahpph2);
        form.setValue("jumlahpph_3", jumlahpph3);
        form.setValue("jumlahpph_4", jumlahpph4);
        form.setValue("jumlahpph_5", jumlahpph5);

        // Set nilai jumlahpph sub field
        form.setValue("jumlahpph_1a", jumlahpph1a);
        form.setValue("jumlahpph_1b", jumlahpph1b);
        form.setValue("jumlahpph_1c", jumlahpph1c);
        form.setValue("jumlahpph_2a", jumlahpph2a);
        form.setValue("jumlahpph_2b", jumlahpph2b);
        form.setValue("jumlahpph_3a", jumlahpph3a);
        form.setValue("jumlahpph_3b", jumlahpph3b);
        form.setValue("jumlahpph_3c", jumlahpph3c);
        form.setValue("jumlahpph_4a", jumlahpph4a);
        form.setValue("jumlahpph_5a", jumlahpph5a);

        // Menghitung total dari semua nilai jumlahpph
        const totalJumlahpph =
            jumlahpph1 + jumlahpph1a + jumlahpph1b + jumlahpph1c +
            jumlahpph2 + jumlahpph2a + jumlahpph2b +
            jumlahpph3 + jumlahpph3a + jumlahpph3b + jumlahpph3c +
            jumlahpph4 + jumlahpph4a +
            jumlahpph5 + jumlahpph5a;

        // Memperbarui nilai total_jumlahpph pada form
        form.setValue("total_jumlahpph", totalJumlahpph);

        // Hitung total pemotongan
        const totalPemotongan =
            (form.getValues("pemotongan_1") || 0) +
            (form.getValues("pemotongan_1a") || 0) +
            (form.getValues("pemotongan_1b") || 0) +
            (form.getValues("pemotongan_1c") || 0) +
            (form.getValues("pemotongan_2") || 0) +
            (form.getValues("pemotongan_2a") || 0) +
            (form.getValues("pemotongan_2b") || 0) +
            (form.getValues("pemotongan_3") || 0) +
            (form.getValues("pemotongan_3a") || 0) +
            (form.getValues("pemotongan_3b") || 0) +
            (form.getValues("pemotongan_3c") || 0) +
            (form.getValues("pemotongan_4") || 0) +
            (form.getValues("pemotongan_4a") || 0) +
            (form.getValues("pemotongan_5") || 0) +
            (form.getValues("pemotongan_5a") || 0);

        form.setValue("total_pemotongan", totalPemotongan);

        // Hitung total setor
        const totalSetor = 
            (form.getValues("setor_1") || 0) +
            (form.getValues("setor_1a") || 0) +
            (form.getValues("setor_1b") || 0) +
            (form.getValues("setor_1c") || 0) +
            (form.getValues("setor_2") || 0) +
            (form.getValues("setor_2a") || 0) +
            (form.getValues("setor_2b") || 0) +
            (form.getValues("setor_3") || 0) +
            (form.getValues("setor_3a") || 0) +
            (form.getValues("setor_3b") || 0) +
            (form.getValues("setor_3c") || 0) +
            (form.getValues("setor_4") || 0) +
            (form.getValues("setor_4a") || 0) +
            (form.getValues("setor_5") || 0) +
            (form.getValues("setor_5a") || 0);
            
        form.setValue("total_setor", totalSetor);

        // Hitung total pph pemerintah
        const totalPphPemerintah =
            (form.getValues("pphpemerintah_1") || 0) +
            (form.getValues("pphpemerintah_1a") || 0) +
            (form.getValues("pphpemerintah_1b") || 0) +
            (form.getValues("pphpemerintah_1c") || 0) +
            (form.getValues("pphpemerintah_2") || 0) +
            (form.getValues("pphpemerintah_2a") || 0) +
            (form.getValues("pphpemerintah_2b") || 0) +
            (form.getValues("pphpemerintah_3") || 0) +
            (form.getValues("pphpemerintah_3a") || 0) +
            (form.getValues("pphpemerintah_3b") || 0) +
            (form.getValues("pphpemerintah_3c") || 0) +
            (form.getValues("pphpemerintah_4") || 0) +
            (form.getValues("pphpemerintah_4a") || 0) +
            (form.getValues("pphpemerintah_5") || 0) +
            (form.getValues("pphpemerintah_5a") || 0);
            
        form.setValue("total_pphpemerintah", totalPphPemerintah);

    }, [form,
        form.watch("setor_1"), form.watch("setor_1a"), form.watch("setor_1b"), form.watch("setor_1c"),
        form.watch("setor_2"), form.watch("setor_2a"), form.watch("setor_2b"),
        form.watch("setor_3"), form.watch("setor_3a"), form.watch("setor_3b"), form.watch("setor_3c"),
        form.watch("setor_4"), form.watch("setor_4a"),
        form.watch("setor_5"), form.watch("setor_5a"),
        form.watch("pemotongan_1"), form.watch("pemotongan_1a"), form.watch("pemotongan_1b"), form.watch("pemotongan_1c"),
        form.watch("pemotongan_2"), form.watch("pemotongan_2a"), form.watch("pemotongan_2b"),
        form.watch("pemotongan_3"), form.watch("pemotongan_3a"), form.watch("pemotongan_3b"), form.watch("pemotongan_3c"),
        form.watch("pemotongan_4"), form.watch("pemotongan_4a"),
        form.watch("pemotongan_5"), form.watch("pemotongan_5a"),
        form.watch("pphpemerintah_1"), form.watch("pphpemerintah_1a"), form.watch("pphpemerintah_1b"), form.watch("pphpemerintah_1c"),
        form.watch("pphpemerintah_2"), form.watch("pphpemerintah_2a"), form.watch("pphpemerintah_2b"),
        form.watch("pphpemerintah_3"), form.watch("pphpemerintah_3a"), form.watch("pphpemerintah_3b"), form.watch("pphpemerintah_3c"),
        form.watch("pphpemerintah_4"), form.watch("pphpemerintah_4a"),
        form.watch("pphpemerintah_5"), form.watch("pphpemerintah_5a")
    ]);


    const onSubmit = async (values: z.infer<typeof sptIndukSchema>) => {
        console.log("Form Values:", values);
        console.log("Totals before submit:", form.getValues());

        if (!values.ttd_npwp || !values.ttd_name) {
            toast.error("Silahkan lengkapi data tanda tangan terlebih dahulu");
            return;
        }

        try {
            console.log("Tab refs tersedia:", {
                TabI: tabIRef.current !== null,
                TabII: tabIIRef.current !== null,
                TabLampiran: tabLampiranRef.current !== null,
            });

            let tabIData = [];
            let tabIIData = [];
            let tabLampiranData = [];

            try {
                if (tabIRef.current) {
                    tabIData = tabIRef.current.getFormData() || [];
                    console.log("Data DAFTAR-I berhasil diambil:", tabIData.length);
                } else {
                    console.warn("tabIRef.current tidak tersedia");
                    if (Array.isArray(bupots)) {

                        tabIData = bupots
                            .filter(item => item.object?.type === "bpnr" || item.object?.type === "bppu")
                            .map((item) => ({
                                tab_type: 'tabI',
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
                console.error("Error saat mengambil data DAFTAR-I:", e);
            }

            try {
                if (tabIIRef.current) {
                    tabIIData = tabIIRef.current.getFormData() || [];
                    console.log("Data DAFTAR-II berhasil diambil:", tabIIData.length);
                } else {
                    console.warn("tabIIRef.current tidak tersedia");
                    if (Array.isArray(bupots)) {
                        tabIIData = bupots
                            .filter(item => item.object?.type === "sendiri" || item.object?.type === "digunggung")
                            .map((item) => ({
                                tab_type: 'tabII',
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

            try {
                if (tabLampiranRef.current) {
                    tabLampiranData = tabLampiranRef.current.getFormData() || [];
                    console.log("Data LAMPIRAN-I berhasil diambil:", tabLampiranData.length);
                } else {
                    console.warn("tabLampiranRef.current tidak tersedia");
                    if (Array.isArray(bupots)) {
                        tabLampiranData = bupots
                            .filter(item => item.object?.type === "lampiran")
                            .map((item) => ({
                                tab_type: 'tabLampiran',
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
                console.error("Error saat mengambil data LAMPIRAN-I:", e);
            }

            const allTabData = [
                ...tabIData.map(item => ({ ...item, tab_type: 'tabI' })),
                ...tabIIData.map(item => ({ ...item, tab_type: 'tabII' })),
                ...tabLampiranData.map(item => ({ ...item, tab_type: 'tabLampiran' }))
            ];

            console.log("Tab data collected:", allTabData);

            const updatedFormValues = form.getValues();
            const formattedValues = {
                ...updatedFormValues,
                tab_data: allTabData
            };

            setPendingSubmit({
                ...formattedValues,
            });
            setTotal(form.getValues("total_jumlahpph") || 0);

            console.log("Pending Submit with tab data:", formattedValues);

            setOpenModalPayment(true);
        } catch (error) {
            console.error("Error collecting tab data:", error);

            const updatedFormValues = form.getValues();
            const formattedValues = {
                ...updatedFormValues,
            };

            setPendingSubmit(formattedValues);
            console.log("Pending Submit (error fallback):", formattedValues);
            setOpenModalPayment(true);
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

            const totalAmount = filteredBupots
                .filter(bupot => bupot.object?.kap && bupot.tax > 0)
                .reduce((sum, bupot) => sum + Number(bupot.tax || 0), 0);
            const validBupots = filteredBupots.filter(bupot => bupot.object?.kap && bupot.tax > 0);
            const validBupot = validBupots.find(bupot => bupot.object?.tax_name);

            let billing_type_id = ''; // default
            if (validBupot && validBupot.object?.tax_name && Array.isArray(masterBillingTypes)) {
                const found = masterBillingTypes.find(
                    (bt) => bt.description?.trim().toLowerCase() === validBupot.object.tax_name.trim().toLowerCase()
                );
                if (found) billing_type_id = found.id;
            }
            const billing_code = generateBillingCode();
            const billing_data = [{
                billing_type_id: billing_type_id,
                start_period: spt.start_period,
                year: spt.year,
                currency: "IDR",
                amount: totalAmount,
                amount_in_words: numberToWords(totalAmount),
                description: `SPT Masa PPh Unifikasi periode ${spt.start_period} ${spt.year}`,
                status: "unpaid",
                active_period: formatDate(new Date(new Date().setDate(new Date().getDate() + 7))),
                code: billing_code
            }];

            // Ledger tetap satu per bupot, billing_id nanti di-backend diisi sama
            const ledger_data = validBupots.map((bupot, idx) => {
                const [kap, kjs] = typeof bupot.object.kap === "string" ? bupot.object.kap.split("-") : ["", ""];
                const amount = Number(bupot.tax || 0);

                // Tentukan billing_type_id berdasarkan object atau KAP
                let billing_type_id = '';
                let kap_description = '';

                if (bupot.object?.kap && Array.isArray(masterBillingTypes)) {
                    const found = masterBillingTypes.find(
                        (bt) => bt.code?.includes(bupot.object.kap) ||
                            bt.description?.trim().toLowerCase() === bupot.object.tax_name?.trim().toLowerCase()
                    );
                    if (found) {
                        billing_type_id = found.id;
                        kap_description = found.description || ""; // <- AMBIL description dari master_billing_types
                    }
                } return {
                    billing_type_id: billing_type_id,
                    transaction_date: formatDate(new Date()),
                    posting_date: formatDate(new Date()),
                    accounting_type: "surat pemberitahuan",
                    accounting_type_detail: spt.correction_number === 1 ? "spt pembetulan" : "spt normal",
                    currency: "IDR",
                    transaction_type: "debit",
                    debit_amount: -amount,
                    debit_unpaid: 0,
                    credit_amount: 0,
                    credit_left: 0,
                    kap: kap,
                    kap_description: kap_description,
                    kjs: kjs,
                    tax_period: `${spt.start_period} ${spt.year}`,
                    transaction_number: transactionNumber + "-" + (idx + 1)
                };
            });



            const getActiveKapKjs = () => {
                if (!filteredBupots || filteredBupots.length === 0) {
                    return {
                        kap: "411128", // Default jika tidak ada data
                        kjs: "401",
                        kap_description: "Pendapatan PPh Final"
                    };
                }

                const formValues = form.getValues();

                const kapKjsMap = {
                    "411128-100": { value: formValues.jumlahpph_1 || 0, desc: "Pendapatan PPh Pasal 4(2)" },
                    "411128-402": { value: formValues.jumlahpph_1 || 0, desc: "Pendapatan PPh Pasal 4(2)" },
                    "411128-403": { value: formValues.jumlahpph_1 || 0, desc: "Pendapatan PPh Pasal 4(2)" },
                    "411128-600": { value: formValues.jumlahpph_2 || 0, desc: "Pendapatan PPh Pasal 15" },
                    "411129-600": { value: formValues.jumlahpph_2 || 0, desc: "Pendapatan PPh Pasal 15" },
                    "411122-100": { value: formValues.jumlahpph_3 || 0, desc: "Pendapatan PPh Pasal 22" },
                    "411122-900": { value: formValues.jumlahpph_3 || 0, desc: "Pendapatan PPh Pasal 22" },
                    "411122-910": { value: formValues.jumlahpph_3 || 0, desc: "Pendapatan PPh Pasal 22" },
                    "411124-100": { value: formValues.jumlahpph_4 || 0, desc: "Pendapatan PPh Pasal 23" },
                    "411127-110": { value: formValues.jumlahpph_5 || 0, desc: "Pendapatan PPh Pasal 26" }
                };

                // Cari KAP-KJS yang memiliki nilai > 0
                for (const [kapKjs, data] of Object.entries(kapKjsMap)) {
                    if (data.value > 0) {
                        const [kap, kjs] = kapKjs.split("-");
                        return {
                            kap,
                            kjs,
                            kap_description: data.desc
                        };
                    }
                }

                // Jika tidak ada nilai yang > 0, gunakan bupot pertama
                if (filteredBupots[0]?.object?.kap) {
                    const kapParts = filteredBupots[0].object.kap.split("-");
                    return {
                        kap: kapParts[0] || "411122",
                        kjs: kapParts[1] || "100",
                        kap_description: filteredBupots[0].object.kap_description || "Pendapatan Pajak"
                    };
                }

                // Fallback ke default
                return {
                    kap: "411122",
                    kjs: "100",
                    kap_description: "Pendapatan PPh 21"
                };
            };

            const kapKjsInfo = getActiveKapKjs();

            const totalPph = form.getValues("total_jumlahpph") || 0;

            const finalData = {
                ...pendingSubmit,
                payment_method: paymentMethod,
                password: password,
                billing_data,
                ledger_data,
            };

            console.log("Data final yang dikirim:", finalData);

            router.post(route("spt.storeUnifikasi"), finalData);
            setPendingSubmit(null);
        }

        setOpenPasswordModal(false);
    };

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
                                <BreadcrumbPage>Detail SPT Masa PPH Unifikasi</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        SPT Masa PPH Unifikasi
                    </h1>
                    <div className="flex flex-col gap-4 bg-sidebar border rounded-xl p-5 md:p-8">
                        <Tabs defaultValue="Main Form" className="w-full">
                            <TabsList className="flex justify-start gap-2">
                                <TabsTrigger value="Main Form">
                                    SPT Masa PPH Unifikasi
                                </TabsTrigger>
                                <TabsTrigger value="I">DAFTAR-I</TabsTrigger>
                                <TabsTrigger value="II">DAFTAR-II</TabsTrigger>
                                <TabsTrigger value="Lampiran">LAMPIRAN-I</TabsTrigger>
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
                                                    A. IDENTITAS PEMOTONG
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <div className="flex flex-col space-y-2">
                                                        <FormField
                                                            name="user.name"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-center gap-4">
                                                                    <FormLabel className="text-base font-medium min-w-[200px]">
                                                                        Masa Pajak
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="text"
                                                                            defaultValue={filteredBupots.length > 0
                                                                                ? `${filteredBupots[0].bupot_period} ${filteredBupots[0].bupot_year}`
                                                                                : "-"}
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
                                        {/* 1 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    B. PAJAK PENGHASILAN
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="border border-gray-300" rowSpan={2}>
                                                                    No
                                                                </TableHead>
                                                                <TableHead className="border border-gray-300 text-center w-[15%]" rowSpan={2}>
                                                                    Detail
                                                                </TableHead>
                                                                <TableHead className="border border-gray-300 text-center w-[25%]" colSpan={2}>
                                                                    Pajak Penghasilan
                                                                </TableHead>
                                                                <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                    PPh Ditanggung Pemerintah
                                                                </TableHead>
                                                                <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                    Jumlah PPh Dibayar
                                                                </TableHead>
                                                                <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                    jumlah PPh dibayar dari SPT yang dibetulkan
                                                                </TableHead>
                                                                <TableHead className="border border-gray-300 text-center" rowSpan={2}>
                                                                    PPh Kurang Bayar/Lebih Bayar Karena Pembetulan
                                                                </TableHead>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableHead className="border border-gray-300 text-center ">
                                                                    Setor Sendiri
                                                                </TableHead>
                                                                <TableHead className="border border-gray-300 text-center ">
                                                                    Pemotongan
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow
                                                                className="cursor-pointer hover:bg-gray-100"
                                                                onClick={() => toggleRow("article4")}
                                                            >
                                                                <TableCell className="pl-4">
                                                                    1.
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        Pasal 4 ayat 2
                                                                        <span className="ml-2">
                                                                            {expandedRows.article4 ? "v" : ">"}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="setor_1"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pemotongan_1"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphpemerintah_1"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="jumlahpph_1"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphdibetulkan_1"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphkurangbayar_1"
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
                                                            {expandedRows.article4 && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411128-100
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_1a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_1a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_1a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_1a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_1a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_1a"
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
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411128-402
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_1b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_1b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_1b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_1b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_1b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_1b"
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
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411128-403
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_1c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_1c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_1c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_1c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_1c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_1c"
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
                                                                </>
                                                            )}

                                                            <TableRow
                                                                className="cursor-pointer hover:bg-gray-100"
                                                                onClick={() => toggleRow("article15")}
                                                            >
                                                                <TableCell className="pl-4">
                                                                    2.
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        Pasal 15
                                                                        <span className="ml-2">
                                                                            {expandedRows.article15 ? "v" : ">"}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="setor_2"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pemotongan_2"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphpemerintah_2"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="jumlahpph_2"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphdibetulkan_2"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphkurangbayar_2"
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

                                                            {expandedRows.article15 && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411128-600
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_2a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_2a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_2a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_2a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_2a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_2a"
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
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411129-600
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_2b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_2b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_2b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_2b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_2b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_2b"
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
                                                                </>
                                                            )}

                                                            <TableRow
                                                                className="cursor-pointer hover:bg-gray-100"
                                                                onClick={() => toggleRow("article22")}
                                                            >
                                                                <TableCell className="pl-4">
                                                                    3.
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        Pasal 22
                                                                        <span className="ml-2">
                                                                            {expandedRows.article22 ? "v" : ">"}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="setor_3"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pemotongan_3"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphpemerintah_3"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="jumlahpph_3"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphdibetulkan_3"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphkurangbayar_3"
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

                                                            {expandedRows.article22 && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411122-100
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_3a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_3a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_3a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_3a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_3a"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_3a"
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
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411122-900
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_3b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_3b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_3b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_3b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_3b"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_3b"
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
                                                                        <TableCell className="pl-4"></TableCell>
                                                                        <TableCell className="text-center">
                                                                            KJS:411122-910
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="setor_3c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pemotongan_3c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphpemerintah_3c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="jumlahpph_3c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphdibetulkan_3c"
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
                                                                        <TableCell>
                                                                            <FormField
                                                                                name="pphkurangbayar_3c"
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
                                                                </>
                                                            )}

                                                            <TableRow
                                                                className="cursor-pointer hover:bg-gray-100"
                                                                onClick={() => toggleRow("article23")}
                                                            >
                                                                <TableCell className="pl-4">
                                                                    4.
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        Pasal 23
                                                                        <span className="ml-2">
                                                                            {expandedRows.article23 ? "v" : ">"}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="setor_4"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pemotongan_4"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphpemerintah_4"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="jumlahpph_4"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphdibetulkan_4"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphkurangbayar_4"
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

                                                            {/* KJS row for Article 23 */}
                                                            {expandedRows.article23 && (
                                                                <TableRow>
                                                                    <TableCell className="pl-4"></TableCell>
                                                                    <TableCell className="text-center">
                                                                        KJS:411124-100
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="setor_4a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pemotongan_4a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pphpemerintah_4a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="jumlahpph_4a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pphdibetulkan_4a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pphkurangbayar_4a"
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
                                                            )}

                                                            <TableRow
                                                                className="cursor-pointer hover:bg-gray-100"
                                                                onClick={() => toggleRow("article26")}
                                                            >
                                                                <TableCell className="pl-4">
                                                                    5.
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        Pasal 26
                                                                        <span className="ml-2">
                                                                            {expandedRows.article26 ? "v" : ">"}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="setor_5"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pemotongan_5"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphpemerintah_5"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="jumlahpph_5"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphdibetulkan_5"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="pphkurangbayar_5"
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

                                                            {/* KJS row for Article 26 */}
                                                            {expandedRows.article26 && (
                                                                <TableRow>
                                                                    <TableCell className="pl-4"></TableCell>
                                                                    <TableCell className="text-center">
                                                                        KJS:411127-110
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="setor_5a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pemotongan_5a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pphpemerintah_5a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="jumlahpph_5a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pphdibetulkan_5a"
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
                                                                    <TableCell>
                                                                        <FormField
                                                                            name="pphkurangbayar_5a"
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
                                                            )}
                                                            <TableRow className="bg-slate-100">
                                                                <TableCell ></TableCell>
                                                                <TableCell className="font-medium">
                                                                    TOTAL PAJAK PENDAPATAN
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="total_setor"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="total_pemotongan"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="total_pphpemerintah"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="total_jumlahpph"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="total_pphdibetulkan"
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
                                                                <TableCell>
                                                                    <FormField
                                                                        name="total_pphkurangbayar"
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
                                                    C. PERNYATAAN DAN TANDA TANGAN
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 w-full">
                                                    <div >
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
                                                                name="ttd_npwp"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem className="flex flex-row items-center gap-4">
                                                                        <FormLabel className="text-base font-medium min-w-[200px]">
                                                                            NPWP/NIK* :
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

                            <TabsContent value="I">
                                <TabI
                                    ref={tabIRef}
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
                            <TabsContent value="II">
                                <TabII
                                    ref={tabIIRef}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    bupots={bupots}

                                />
                            </TabsContent>
                            <TabsContent value="Lampiran">
                                <TabLampiran
                                    ref={tabLampiranRef}
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
