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
import TabA1 from "./Tablist/TabA1";
import TabA2 from "./Tablist/TabA2";
import TabB1 from "./Tablist/TabB1";
import TabB2 from "./Tablist/TabB2";
import TabB3 from "./Tablist/TabB3";
import TabC from "./Tablist/TabC";
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
    dpp_a1: z.number().int(),
    dpp_a2: z.number().int(),
    dpp_a3: z.number().int(),
    dpp_a4: z.number().int(),
    dpp_a5: z.number().int(),
    dpp_a6: z.number().int(),
    dpp_a7: z.number().int(),
    dpp_a8: z.number().int(),
    dpp_a9: z.number().int(),
    dpp_a10: z.number().int(),
    dpp_ab: z.number().int(),
    dpp_suma: z.number().int(),
    dpp_lain_a1: z.number().int(),
    dpp_lain_a2: z.number().int(),
    dpp_lain_a3: z.number().int(),
    dpp_lain_a4: z.number().int(),
    dpp_lain_a5: z.number().int(),
    dpp_lain_a6: z.number().int(),
    dpp_lain_a7: z.number().int(),
    dpp_lain_a8: z.number().int(),
    dpp_lain_a9: z.number().int(),
    dpp_lain_a10: z.number().int(),
    dpp_lain_ab: z.number().int(),
    dpp_lain_suma: z.number().int(),
    ppn_a1: z.number().int(),
    ppn_a2: z.number().int(),
    ppn_a3: z.number().int(),
    ppn_a4: z.number().int(),
    ppn_a5: z.number().int(),
    ppn_a6: z.number().int(),
    ppn_a7: z.number().int(),
    ppn_a8: z.number().int(),
    ppn_a9: z.number().int(),
    ppn_a10: z.number().int(),
    ppn_ab: z.number().int(),
    ppn_suma: z.number().int(),
    ppnbm_a1: z.number().int(),
    ppnbm_a2: z.number().int(),
    ppnbm_a3: z.number().int(),
    ppnbm_a4: z.number().int(),
    ppnbm_a5: z.number().int(),
    ppnbm_a6: z.number().int(),
    ppnbm_a7: z.number().int(),
    ppnbm_a8: z.number().int(),
    ppnbm_a9: z.number().int(),
    ppnbm_a10: z.number().int(),
    ppnbm_ab: z.number().int(),
    ppnbm_suma: z.number().int(),
    dpp_ba: z.number().int(),
    dpp_bb: z.number().int(),
    dpp_bc: z.number().int(),
    dpp_bd: z.number().int(),
    dpp_be: z.number().int(),
    dpp_bf: z.number().int(),
    dpp_bg: z.number().int(),
    dpp_bh: z.number().int(),
    dpp_bi: z.number().int(),
    dpp_bj: z.number().int(),
    dpp_lain_ba: z.number().int(),
    dpp_lain_bb: z.number().int(),
    dpp_lain_bc: z.number().int(),
    dpp_lain_bd: z.number().int(),
    dpp_lain_be: z.number().int(),
    dpp_lain_bf: z.number().int(),
    dpp_lain_bg: z.number().int(),
    dpp_lain_bh: z.number().int(),
    dpp_lain_bi: z.number().int(),
    dpp_lain_bj: z.number().int(),
    ppn_ba: z.number().int(),
    ppn_bb: z.number().int(),
    ppn_bc: z.number().int(),
    ppn_bd: z.number().int(),
    ppn_be: z.number().int(),
    ppn_bf: z.number().int(),
    ppn_bg: z.number().int(),
    ppn_bh: z.number().int(),
    ppn_bi: z.number().int(),
    ppn_bj: z.number().int(),
    ppnbm_ba: z.number().int(),
    ppnbm_bb: z.number().int(),
    ppnbm_bc: z.number().int(),
    ppnbm_bd: z.number().int(),
    ppnbm_be: z.number().int(),
    ppnbm_bf: z.number().int(),
    ppnbm_bg: z.number().int(),
    ppnbm_bh: z.number().int(),
    ppnbm_bi: z.number().int(),
    ppnbm_bj: z.number().int(),
    ppn_ca: z.number().int(),
    ppn_cb: z.number().int(),
    ppn_cc: z.number().int(),
    ppn_cd: z.number().int(),
    ppn_ce: z.number().int(),
    ppn_cf: z.number().int(),
    ppn_cg: z.number().int(),
    ppn_ch: z.string().nullable(),
    dpp_kms: z.number().int(),
    ppn_kms: z.number().int(),
    ppn_pkpm: z.number().int(),
    ppnbm_da: z.number().int(),
    ppnbm_db: z.number().int(),
    ppnbm_dc: z.number().int(),
    ppnbm_dd: z.number().int(),
    ppnbm_de: z.number().int(),
    ppnbm_df: z.boolean(),
    dpp_ea: z.number().int(),
    dpp_eb: z.number().int(),
    dpp_ec: z.number().int(),
    dpp_lain_ea: z.number().int(),
    dpp_lain_eb: z.number().int(),
    dpp_lain_ec: z.number().int(),
    ppn_ea: z.number().int(),
    ppn_eb: z.number().int(),
    ppn_ec: z.number().int(),
    ppnbm_ea: z.number().int(),
    ppnbm_eb: z.number().int(),
    ppnbm_ec: z.number().int(),
    dpp_fa: z.number().int(),
    dpp_fb: z.number().int(),
    dpp_fc: z.number().int(),
    dpp_lain_fa: z.number().int(),
    dpp_lain_fb: z.number().int(),
    dpp_lain_fc: z.number().int(),
    ppn_fa: z.number().int(),
    ppn_fb: z.number().int(),
    ppn_fc: z.number().int(),
    ppnbm_fa: z.number().int(),
    ppnbm_fb: z.number().int(),
    ppnbm_fc: z.number().int(),
    ppnbm_fd: z.boolean(),
    spt_document: z.string(),
    spt_result: z.string(),
    ttd_name: z.string(),
    ttd_position: z.string(),
    ttd_date: z.date(),
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
}

const DetailSPT = ({
    spt,
    invoices,
    others,
    returns,
    returnsOthers,
    saldo,
    transactionNumber,
}: DetailSPTProps) => {
    const user = usePage().props.auth.user;
    const { flash }: any = usePage().props;
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [openModalPayment, setOpenModalPayment] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showRowH, setShowRowH] = useState(false);
    const [showRowF, setShowRowF] = useState(false);
    const [total, setTotal] = useState(0);
    const userSaldo = saldo ?? 0;
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
    const tabA1Ref = useRef<TabRefType>(null);
    const tabA2Ref = useRef<TabRefType>(null);
    const tabB1Ref = useRef<TabRefType>(null);
    const tabB2Ref = useRef<TabRefType>(null);
    const tabB3Ref = useRef<TabRefType>(null);

    const formatRupiah = (amount: number | string): string => {
        if (amount === null || amount === undefined || amount === "") return "";

        const number = typeof amount === "string" ? parseFloat(amount) : amount;

        if (isNaN(number) || number === 0) return "0";

        return number.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 20,
        });
    };

    const parseRupiah = (formattedValue: string): number => {
        const cleanedString = formattedValue
            .replace(/\./g, "")
            .replace(/,/g, ".");
        return parseFloat(cleanedString) || 0;
    };

    interface PendingSubmitType extends z.infer<typeof sptIndukSchema> {
        tab_data?: any[];
    }

    const [pendingSubmit, setPendingSubmit] =
        useState<PendingSubmitType | null>(null);
    const filteredInvoices = Array.isArray(invoices)
        ? invoices.filter((invoice) => {
              return (
                  invoice?.invoice_period === spt?.start_period &&
                  invoice?.invoice_year === spt.year &&
                  invoice.status === "approved" &&
                  invoice.type === "keluaran"
              );
          })
        : [];

    const filteredReturns = Array.isArray(returns)
        ? returns.filter((retur) => {
              return (
                  retur?.retur_period === spt?.start_period &&
                  retur?.retur_year === spt.year &&
                  retur.status === "approved" &&
                  retur.type === "keluaran"
              );
          })
        : [];

    const filteredMasukan = Array.isArray(invoices)
        ? invoices.filter((invoice) => {
              return (
                  invoice?.invoice_period === spt?.start_period &&
                  invoice?.invoice_year === spt.year &&
                  invoice?.status === "credit" &&
                  invoice?.type === "masukan"
              );
          })
        : [];

    const filteredOthers = Array.isArray(others)
        ? others.filter((other) => {
              return (
                  other?.other_period === spt?.start_period &&
                  other?.other_year === spt.year &&
                  other.status === "approved" &&
                  other.type === "keluaran"
              );
          })
        : [];

    const filteredOthersMasukan = Array.isArray(others)
        ? others.filter((other) => {
              return (
                  other?.other_period === spt?.start_period &&
                  other?.other_year === spt.year &&
                  other.status === "approved" &&
                  other.type === "masukan"
              );
          })
        : [];

    const filteredMasukanUncredit = Array.isArray(invoices)
        ? invoices.filter((invoice) => {
              return (
                  invoice?.invoice_period === spt?.start_period &&
                  invoice?.invoice_year === spt.year &&
                  invoice?.status === "uncredit" &&
                  invoice?.type === "masukan"
              );
          })
        : [];

    const [totals, setTotals] = useState({
        dpp: 0,
        dpp_split: 0,
        ppn: 0,
        ppnbm: 0,
        dppC: 0,
        dpp_splitC: 0,
        ppnC: 0,
        ppnbmC: 0,
        dpp2: 0,
        dpp_split2: 0,
        ppn2: 0,
        ppnbm2: 0,
        dppJ: 0,
        dpp_splitJ: 0,
        ppnJ: 0,
        ppnbmJ: 0,
        dpp_sum_1_5: 0,
        dpp_lain_sum_1_5: 0,
        ppn_sum_1_5: 0,
        ppnbm_sum_1_5: 0,
    });

    const [inputs, setInputs] = useState({
        dpp1: 0,
        dppBa: 0,
        ppnbma1: 0,
        ppnbma2: 0,
        ppnbma3: 0,
        ppnbma4: 0,
        dpp5: 0,
        dpp_split5: 0,
        ppn5: 0,
        ppnbm5: 0,
        dpp9: 0,
        dpp_split9: 0,
        ppn9: 0,
        ppnbm9: 0,
        dppB: 0,
        dpp_splitB: 0,
        ppnB: 0,
        ppnbmB: 0,
        dppE: 0,
        dpp_splitE: 0,
        ppnE: 0,
        ppnbmE: 0,
        dppF: 0,
        dpp_splitF: 0,
        ppnF: 0,
        ppnbmF: 0,
        dppBh: 0,
        dpp_splitBh: 0,
        ppnBh: 0,
        ppnbmBh: 0,
        dppI: 0,
        dpp_splitI: 0,
        ppnI: 0,
        ppnbmI: 0,
        dppJ: 0,
        dpp_splitJ: 0,
        ppnJ: 0,
        ppnbmJ: 0,
        dppKms: 0,
        ppnKms: 0,
        ppnPkpm: 0,
    });

    const form = useForm<z.infer<typeof sptIndukSchema>>({
        resolver: zodResolver(sptIndukSchema),
        defaultValues: {
            spt_id: spt.id,
            dpp_a1: 0,
            dpp_a2: 0,
            dpp_a3: 0,
            dpp_a4: 0,
            dpp_a5: 0,
            dpp_a6: 0,
            dpp_a7: 0,
            dpp_a8: 0,
            dpp_a9: 0,
            dpp_a10: 0,
            dpp_ab: 0,
            dpp_suma: 0,
            dpp_lain_a1: 0,
            dpp_lain_a2: 0,
            dpp_lain_a3: 0,
            dpp_lain_a4: 0,
            dpp_lain_a5: 0,
            dpp_lain_a6: 0,
            dpp_lain_a7: 0,
            dpp_lain_a8: 0,
            dpp_lain_a9: 0,
            dpp_lain_a10: 0,
            dpp_lain_ab: 0,
            dpp_lain_suma: 0,
            ppn_a1: 0,
            ppn_a2: 0,
            ppn_a3: 0,
            ppn_a4: 0,
            ppn_a5: 0,
            ppn_a6: 0,
            ppn_a7: 0,
            ppn_a8: 0,
            ppn_a9: 0,
            ppn_a10: 0,
            ppn_ab: 0,
            ppn_suma: 0,
            ppnbm_a1: 0,
            ppnbm_a2: 0,
            ppnbm_a3: 0,
            ppnbm_a4: 0,
            ppnbm_a5: 0,
            ppnbm_a6: 0,
            ppnbm_a7: 0,
            ppnbm_a8: 0,
            ppnbm_a9: 0,
            ppnbm_a10: 0,
            ppnbm_ab: 0,
            ppnbm_suma: 0,
            dpp_ba: 0,
            dpp_bb: 0,
            dpp_bc: 0,
            dpp_bd: 0,
            dpp_be: 0,
            dpp_bf: 0,
            dpp_bg: 0,
            dpp_bh: 0,
            dpp_bi: 0,
            dpp_bj: 0,
            dpp_lain_ba: 0,
            dpp_lain_bb: 0,
            dpp_lain_bc: 0,
            dpp_lain_bd: 0,
            dpp_lain_be: 0,
            dpp_lain_bf: 0,
            dpp_lain_bg: 0,
            dpp_lain_bh: 0,
            dpp_lain_bi: 0,
            dpp_lain_bj: 0,
            ppn_ba: 0,
            ppn_bb: 0,
            ppn_bc: 0,
            ppn_bd: 0,
            ppn_be: 0,
            ppn_bf: 0,
            ppn_bg: 0,
            ppn_bh: 0,
            ppn_bi: 0,
            ppn_bj: 0,
            ppnbm_ba: 0,
            ppnbm_bb: 0,
            ppnbm_bc: 0,
            ppnbm_bd: 0,
            ppnbm_be: 0,
            ppnbm_bf: 0,
            ppnbm_bg: 0,
            ppnbm_bh: 0,
            ppnbm_bi: 0,
            ppnbm_bj: 0,
            ppn_ca: 0,
            ppn_cb: 0,
            ppn_cc: 0,
            ppn_cd: 0,
            ppn_ce: 0,
            ppn_cf: 0,
            ppn_cg: 0,
            ppn_ch: null,
            dpp_kms: 0,
            ppn_kms: 0,
            ppn_pkpm: 0,
            ppnbm_da: 0,
            ppnbm_db: 0,
            ppnbm_dc: 0,
            ppnbm_dd: 0,
            ppnbm_de: 0,
            ppnbm_df: false,
            dpp_ea: 0,
            dpp_eb: 0,
            dpp_ec: 0,
            dpp_lain_ea: 0,
            dpp_lain_eb: 0,
            dpp_lain_ec: 0,
            ppn_ea: 0,
            ppn_eb: 0,
            ppn_ec: 0,
            ppnbm_ea: 0,
            ppnbm_eb: 0,
            ppnbm_ec: 0,
            dpp_fa: 0,
            dpp_fb: 0,
            dpp_fc: 0,
            dpp_lain_fa: 0,
            dpp_lain_fb: 0,
            dpp_lain_fc: 0,
            ppn_fa: 0,
            ppn_fb: 0,
            ppn_fc: 0,
            ppnbm_fa: 0,
            ppnbm_fb: 0,
            ppnbm_fc: 0,
            ppnbm_fd: false,
            spt_document: "tidak",
            spt_result: "tidak",
            ttd_name: "",
            ttd_position: "",
            payment_method: "",
            password: "",
        },
    });

    const ppnValues = form.watch([
        "ppn_a1",
        "ppn_a2",
        "ppn_a3",
        "ppn_a4",
        "ppn_a5",
    ]);
    const ppnBgValue = form.watch("ppn_bg");
    const ppnCalcValues = form.watch(["ppn_ca", "ppn_cb", "ppn_cc", "ppn_cd"]);

    useEffect(() => {
        const calculatedTotal =
            (form.getValues("ppn_ce") || 0) +
            (form.getValues("ppn_kms") || 0) +
            (form.getValues("ppn_pkpm") || 0) +
            (form.getValues("ppnbm_dc") || 0);

        setTotal(calculatedTotal);
    }, [form.watch(["ppn_ce", "ppn_kms", "ppn_pkpm", "ppnbm_dc"])]);

    useEffect(() => {
        const groupedData = {
            "a2": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 04, 05
            "a3": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 06
            "a4": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 01, 09, 10
            "a6": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 02, 03
            "a7": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 07
            "a8": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 08
        };
        filteredInvoices.forEach((invoice) => {
            const matchingReturns = Array.isArray(returns)
                ? returns.filter((ret) => ret.invoice_id === invoice.id)
                : [];
            let adjustedDpp = invoice.dpp;
            let adjustedDppSplit = invoice.dpp_lain;
            let adjustedPpn = invoice.ppn;
            let adjustedPpnbm = invoice.ppnbm;

            if (matchingReturns.length > 0) {
                matchingReturns.forEach((ret) => {
                    adjustedDpp -= ret.dpp || 0;
                    adjustedDppSplit -= ret.dpp_lain || 0;
                    adjustedPpn -= ret.ppn || 0;
                    adjustedPpnbm -= ret.ppnbm || 0;
                });
            }
            if (["04", "05"].includes(invoice.transaction_code)) {
            groupedData["a2"].dpp += adjustedDpp;
            groupedData["a2"].dpp_lain += adjustedDppSplit;
            groupedData["a2"].ppn += adjustedPpn;
            groupedData["a2"].ppnbm += adjustedPpnbm;
        } else if (["06"].includes(invoice.transaction_code)) {
            groupedData["a3"].dpp += adjustedDpp;
            groupedData["a3"].dpp_lain += adjustedDppSplit;
            groupedData["a3"].ppn += adjustedPpn;
            groupedData["a3"].ppnbm += adjustedPpnbm;
        } else if (["01", "09", "10"].includes(invoice.transaction_code)) {
            groupedData["a4"].dpp += adjustedDpp;
            groupedData["a4"].dpp_lain += adjustedDppSplit;
            groupedData["a4"].ppn += adjustedPpn;
            groupedData["a4"].ppnbm += adjustedPpnbm;
        } else if (["02", "03"].includes(invoice.transaction_code)) {
            groupedData["a6"].dpp += adjustedDpp;
            groupedData["a6"].dpp_lain += adjustedDppSplit;
            groupedData["a6"].ppn += adjustedPpn;
            groupedData["a6"].ppnbm += adjustedPpnbm;
        } else if (["07"].includes(invoice.transaction_code)) {
            groupedData["a7"].dpp += adjustedDpp;
            groupedData["a7"].dpp_lain += adjustedDppSplit;
            groupedData["a7"].ppn += adjustedPpn;
            groupedData["a7"].ppnbm += adjustedPpnbm;
        } else if (["08"].includes(invoice.transaction_code)) {
            groupedData["a8"].dpp += adjustedDpp;
            groupedData["a8"].dpp_lain += adjustedDppSplit;
            groupedData["a8"].ppn += adjustedPpn;
            groupedData["a8"].ppnbm += adjustedPpnbm;
        }
        
        });
        form.setValue("dpp_a2", groupedData["a2"].dpp);
        form.setValue("dpp_lain_a2", groupedData["a2"].dpp_lain);
        form.setValue("ppn_a2", groupedData["a2"].ppn);
        form.setValue("ppnbm_a2", groupedData["a2"].ppnbm);
        
        form.setValue("dpp_a3", groupedData["a3"].dpp);
        form.setValue("dpp_lain_a3", groupedData["a3"].dpp_lain);
        form.setValue("ppn_a3", groupedData["a3"].ppn);
        form.setValue("ppnbm_a3", groupedData["a3"].ppnbm);
        
        form.setValue("dpp_a4", groupedData["a4"].dpp);
        form.setValue("dpp_lain_a4", groupedData["a4"].dpp_lain);
        form.setValue("ppn_a4", groupedData["a4"].ppn);
        form.setValue("ppnbm_a4", groupedData["a4"].ppnbm);
        
        form.setValue("dpp_a6", groupedData["a6"].dpp);
        form.setValue("dpp_lain_a6", groupedData["a6"].dpp_lain);
        form.setValue("ppn_a6", groupedData["a6"].ppn);
        form.setValue("ppnbm_a6", groupedData["a6"].ppnbm);
        
        form.setValue("dpp_a7", groupedData["a7"].dpp);
        form.setValue("dpp_lain_a7", groupedData["a7"].dpp_lain);
        form.setValue("ppn_a7", groupedData["a7"].ppn);
        form.setValue("ppnbm_a7", groupedData["a7"].ppnbm);
        
        form.setValue("dpp_a8", groupedData["a8"].dpp);
        form.setValue("dpp_lain_a8", groupedData["a8"].dpp_lain);
        form.setValue("ppn_a8", groupedData["a8"].ppn);
        form.setValue("ppnbm_a8", groupedData["a8"].ppnbm);

        const groupedMasukan = {
            "bb": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 04, 05
            "bc": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 01, 09, 10
            "bd": { dpp: 0, dpp_lain: 0, ppn: 0, ppnbm: 0 },  // kode 02, 03
        };

        filteredMasukan.forEach((invoice) => {
            const matchingReturns = Array.isArray(returns)
                ? returns.filter((ret) => ret.invoice_id === invoice.id)
                : [];
            let adjustedDpp = invoice.dpp;
            let adjustedDppSplit = invoice.dpp_lain;
            let adjustedPpn = invoice.ppn;
            let adjustedPpnbm = invoice.ppnbm;
            if (matchingReturns.length > 0) {
                matchingReturns.forEach((ret) => {
                    adjustedDpp -= ret.dpp || 0;
                    adjustedDppSplit -= ret.dpp_lain || 0;
                    adjustedPpn -= ret.ppn || 0;
                    adjustedPpnbm -= ret.ppnbm || 0;
                });
            }
            if (["04", "05"].includes(invoice.transaction_code)) {
                groupedMasukan["bb"].dpp += adjustedDpp;
                groupedMasukan["bb"].dpp_lain += adjustedDppSplit;
                groupedMasukan["bb"].ppn += adjustedPpn;
                groupedMasukan["bb"].ppnbm += adjustedPpnbm;
            } else if (["01", "09", "10"].includes(invoice.transaction_code)) {
                groupedMasukan["bc"].dpp += adjustedDpp;
                groupedMasukan["bc"].dpp_lain += adjustedDppSplit;
                groupedMasukan["bc"].ppn += adjustedPpn;
                groupedMasukan["bc"].ppnbm += adjustedPpnbm;
            } else if (["02", "03"].includes(invoice.transaction_code)) {
                groupedMasukan["bd"].dpp += adjustedDpp;
                groupedMasukan["bd"].dpp_lain += adjustedDppSplit;
                groupedMasukan["bd"].ppn += adjustedPpn;
                groupedMasukan["bd"].ppnbm += adjustedPpnbm;
            }
        });
        
        form.setValue("dpp_bb", groupedMasukan["bb"].dpp);
        form.setValue("dpp_lain_bb", groupedMasukan["bb"].dpp_lain);
        form.setValue("ppn_bb", groupedMasukan["bb"].ppn);
        form.setValue("ppnbm_bb", groupedMasukan["bb"].ppnbm);
        
        form.setValue("dpp_bc", groupedMasukan["bc"].dpp);
        form.setValue("dpp_lain_bc", groupedMasukan["bc"].dpp_lain);
        form.setValue("ppn_bc", groupedMasukan["bc"].ppn);
        form.setValue("ppnbm_bc", groupedMasukan["bc"].ppnbm);
        
        form.setValue("dpp_bd", groupedMasukan["bd"].dpp);
        form.setValue("dpp_lain_bd", groupedMasukan["bd"].dpp_lain);
        form.setValue("ppn_bd", groupedMasukan["bd"].ppn);
        form.setValue("ppnbm_bd", groupedMasukan["bd"].ppnbm);

        const newTotals = filteredInvoices.reduce(
            (acc, invoice) => {
                const matchingReturns = Array.isArray(returns)
                    ? returns.filter((ret) => ret.invoice_id === invoice.id)
                    : [];

                let adjustedDpp = parseFloat(invoice.dpp) || 0;
                let adjustedDppSplit = parseFloat(invoice.dpp_split) || 0;
                let adjustedPpn = parseFloat(invoice.ppn) || 0;
                let adjustedPpnbm = parseFloat(invoice.ppnbm) || 0;

                if (matchingReturns.length > 0) {
                    matchingReturns.forEach((ret) => {
                        adjustedDpp -= parseFloat(ret.dpp) || 0;
                        adjustedDppSplit -= parseFloat(ret.dpp_split) || 0;
                        adjustedPpn -= parseFloat(ret.ppn) || 0;
                        adjustedPpnbm -= parseFloat(ret.ppnbm) || 0;
                    });
                }

                acc.dpp += adjustedDpp;
                acc.dpp_split += adjustedDppSplit;
                acc.ppn += adjustedPpn;
                acc.ppnbm += adjustedPpnbm;
                return acc;
            },
            { dpp: 0, dpp_split: 0, ppn: 0, ppnbm: 0 }
        );

        newTotals.dpp += inputs.dpp1 + inputs.dpp5 + inputs.dpp9;
        newTotals.dpp_split += inputs.dpp_split5 + inputs.dpp_split9;
        newTotals.ppn += inputs.ppn5 + inputs.ppn9;
        newTotals.ppnbm += inputs.ppnbm5 + inputs.ppnbm9;

        setTotals((prevTotals) => ({
            ...prevTotals,
            dpp: newTotals.dpp,
            dpp_split: newTotals.dpp_split,
            ppn: newTotals.ppn,
            ppnbm: newTotals.ppnbm,
            dppC: newTotals.dpp + inputs.dppB,
            dpp_splitC: newTotals.dpp_split + inputs.dpp_splitB,
            ppnC: newTotals.ppn + inputs.ppnB,
            ppnbmC: newTotals.ppnbm + inputs.ppnbmB,
        }));

        const newTotals2 = filteredMasukan.reduce(
            (acc, invoice) => {
                const matchingReturns = Array.isArray(returns)
                    ? returns.filter((ret) => ret.invoice_id === invoice.id)
                    : [];
                let adjustedDpp = parseFloat(invoice.dpp) || 0;
                let adjustedDppSplit = parseFloat(invoice.dpp_split) || 0;
                let adjustedPpn = parseFloat(invoice.ppn) || 0;
                let adjustedPpnbm = parseFloat(invoice.ppnbm) || 0;

                if (matchingReturns.length > 0) {
                    matchingReturns.forEach((ret) => {
                        adjustedDpp -= parseFloat(ret.dpp) || 0;
                        adjustedDppSplit -= parseFloat(ret.dpp_split) || 0;
                        adjustedPpn -= parseFloat(ret.ppn) || 0;
                        adjustedPpnbm -= parseFloat(ret.ppnbm) || 0;
                    });
                }
                acc.dpp2 += adjustedDpp;
                acc.dpp_split2 += adjustedDppSplit;
                acc.ppn2 += adjustedPpn;
                acc.ppnbm2 += adjustedPpnbm;
                return acc;
            },
            { dpp2: 0, dpp_split2: 0, ppn2: 0, ppnbm2: 0 }
        );

        newTotals2.dpp2 += inputs.dppBa + inputs.dppE + inputs.dppF;
        newTotals2.dpp_split2 += inputs.dpp_splitE + inputs.dpp_splitF;
        newTotals2.ppn2 += inputs.ppnE + inputs.ppnF;
        newTotals2.ppnbm2 += inputs.ppnbmE + inputs.ppnbmF;

        const newTotals3 = {
            dppJ:
                newTotals2.dpp2 -
                (inputs.dppE + inputs.dppF) +
                inputs.dppI +
                inputs.dppBh,
            dpp_splitJ:
                newTotals2.dpp_split2 -
                (inputs.dpp_splitE + inputs.dpp_splitF) +
                inputs.dpp_splitI +
                inputs.dpp_splitBh,
            ppnJ:
                newTotals2.ppn2 -
                (inputs.ppnE + inputs.ppnF) +
                inputs.ppnI +
                inputs.ppnBh,
            ppnbmJ:
                newTotals2.ppnbm2 -
                (inputs.ppnbmE + inputs.ppnbmF) +
                inputs.ppnbmI +
                inputs.ppnbmBh,
        };

        setTotals((prevTotals) => ({
            ...prevTotals,
            dpp2: newTotals2.dpp2,
            dpp_split2: newTotals2.dpp_split2,
            ppn2: newTotals2.ppn2,
            ppnbm2: newTotals2.ppnbm2,
            dppJ: newTotals3.dppJ,
            dpp_splitJ: newTotals3.dpp_splitJ,
            ppnJ: newTotals3.ppnJ,
            ppnbmJ: newTotals3.ppnbmJ,
        }));
        const ppn_sum_1_5 =
            (ppnValues[0] || 0) +
            (ppnValues[1] || 0) +
            (ppnValues[2] || 0) +
            (ppnValues[3] || 0) +
            (ppnValues[4] || 0);

        setTotals((prevTotals) => ({
            ...prevTotals,
            ppn_sum_1_5: ppn_sum_1_5,
        }));
        form.setValue("ppn_bg", totals.ppn2);

        const ppnCa = ppnValues.reduce((sum, value) => sum + (value || 0), 0);
        const ppnCb = form.getValues("ppn_cb") || 0;
        const ppnCc = form.getValues("ppn_bg") || 0;
        const ppnCd = form.getValues("ppn_cd") || 0;
        const ppnCe = ppnCa - ppnCb - ppnCc - ppnCd;

        form.setValue("ppn_ce", ppnCe);
        setShowRowH(ppnCe < 0);

        const othersSum = filteredOthers.reduce(
            (acc, other) => {
                const matchingReturnsOthers = Array.isArray(returnsOthers)
                    ? returnsOthers.filter((ret) => ret.other_id === other.id)
                    : [];

                let adjustedDpp = parseFloat(other.dpp) || 0;
                let adjustedPpn = parseFloat(other.ppn) || 0;
                let adjustedPpnbm = parseFloat(other.ppnbm) || 0;

                if (matchingReturnsOthers.length > 0) {
                    matchingReturnsOthers.forEach((ret) => {
                        adjustedDpp -= parseFloat(ret.dpp) || 0;
                        adjustedPpn -= parseFloat(ret.ppn) || 0;
                        adjustedPpnbm -= parseFloat(ret.ppnbm) || 0;
                    });
                }

                acc.dpp += adjustedDpp;
                acc.ppn += adjustedPpn;
                acc.ppnbm += adjustedPpnbm;
                return acc;
            },
            { dpp: 0, ppn: 0, ppnbm: 0 }
        );

        form.setValue("dpp_a1", othersSum.dpp);

        setInputs((prevInputs) => ({
            ...prevInputs,
            dpp1: othersSum.dpp,
        }));

        const othersSumMasukan = filteredOthersMasukan.reduce(
            (acc, other) => {
                const matchingReturnsOthers = Array.isArray(returnsOthers)
                    ? returnsOthers.filter((ret) => ret.other_id === other.id)
                    : [];

                let adjustedDpp = parseFloat(other.dpp) || 0;
                let adjustedPpn = parseFloat(other.ppn) || 0;
                let adjustedPpnbm = parseFloat(other.ppnbm) || 0;

                if (matchingReturnsOthers.length > 0) {
                    matchingReturnsOthers.forEach((ret) => {
                        adjustedDpp -= parseFloat(ret.dpp) || 0;
                        adjustedPpn -= parseFloat(ret.ppn) || 0;
                        adjustedPpnbm -= parseFloat(ret.ppnbm) || 0;
                    });
                }

                acc.dpp += adjustedDpp;
                acc.ppn += adjustedPpn;
                acc.ppnbm += adjustedPpnbm;
                return acc;
            },
            { dpp: 0, ppn: 0, ppnbm: 0 }
        );

        form.setValue("dpp_ba", othersSumMasukan.dpp);

        setInputs((prevInputs) => ({
            ...prevInputs,
            dppBa: othersSumMasukan.dpp,
        }));
        const ppnbm_sum_1_5 =
            (form.getValues("ppnbm_a1") || 0) +
            (form.getValues("ppnbm_a2") || 0) +
            (form.getValues("ppnbm_a3") || 0) +
            (form.getValues("ppnbm_a4") || 0) +
            (form.getValues("ppnbm_a5") || 0);

        setTotals((prevTotals) => ({
            ...prevTotals,
            ppnbm_sum_1_5: ppnbm_sum_1_5,
        }));

        form.setValue("ppnbm_da", ppnbm_sum_1_5);

        const ppnbm_db = form.getValues("ppnbm_db") || 0;
        const ppnbm_dc = ppnbm_sum_1_5 - ppnbm_db;
        form.setValue("ppnbm_dc", ppnbm_dc);
        setShowRowF(ppnbm_dc < 0);

        const uncreditedTotals = filteredMasukanUncredit.reduce(
            (acc, invoice) => {
                const matchingReturns = Array.isArray(returns)
                    ? returns.filter((ret) => ret.invoice_id === invoice.id)
                    : [];

                let adjustedDpp = parseFloat(invoice.dpp) || 0;
                let adjustedDppSplit = parseFloat(invoice.dpp_split) || 0;
                let adjustedPpn = parseFloat(invoice.ppn) || 0;
                let adjustedPpnbm = parseFloat(invoice.ppnbm) || 0;

                if (matchingReturns.length > 0) {
                    matchingReturns.forEach((ret) => {
                        adjustedDpp -= parseFloat(ret.dpp) || 0;
                        adjustedDppSplit -= parseFloat(ret.dpp_split) || 0;
                        adjustedPpn -= parseFloat(ret.ppn) || 0;
                        adjustedPpnbm -= parseFloat(ret.ppnbm) || 0;
                    });
                }

                acc.dpp += adjustedDpp;
                acc.dpp_split += adjustedDppSplit;
                acc.ppn += adjustedPpn;
                acc.ppnbm += adjustedPpnbm;
                return acc;
            },
            { dpp: 0, dpp_split: 0, ppn: 0, ppnbm: 0 }
        );

        form.setValue("dpp_bh", uncreditedTotals.dpp);
        form.setValue("dpp_lain_bh", uncreditedTotals.dpp_split);
        form.setValue("ppn_bh", uncreditedTotals.ppn);
        form.setValue("ppnbm_bh", uncreditedTotals.ppnbm);

        setInputs((prevInputs) => ({
            ...prevInputs,
            dppBh: uncreditedTotals.dpp,
            dpp_splitBh: uncreditedTotals.dpp_split,
            ppnBh: uncreditedTotals.ppn,
            ppnbmBh: uncreditedTotals.ppnbm,
        }));
    }, [
        filteredInvoices,
        filteredMasukan,
        filteredMasukanUncredit,
        filteredOthers,
        filteredOthersMasukan,
        inputs,
        form,
        ppnValues,
        ppnBgValue,
        totals.ppn2,
        returns,
        returnsOthers,
    ]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        const rawValue = e.target.value;
        const value = parseRupiah(rawValue);
        setInputs((prevInputs) => ({
            ...prevInputs,
            [field]: value,
        }));
    };

    const handleDppChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        dppField: string,
        dppLainField: string,
        ppnField: string
    ) => {
        const rawValue = e.target.value;
        const dppValue = parseRupiah(rawValue) || 0;

        const dppLainValue = dppValue;

        const ppnValue = dppLainValue * 0.12;

        form.setValue(
            dppField as keyof z.infer<typeof sptIndukSchema>,
            dppValue
        );
        form.setValue(
            dppLainField as keyof z.infer<typeof sptIndukSchema>,
            dppValue
        );
        form.setValue(
            ppnField as keyof z.infer<typeof sptIndukSchema>,
            ppnValue
        );

        setInputs((prevInputs) => ({
            ...prevInputs,
            [dppField === "dpp_a5"
                ? "dpp5"
                : dppField === "dpp_a9"
                ? "dpp9"
                : dppField === "dpp_bi"
                ? "dppI"
                : "dppB"]: dppValue,
            [dppLainField === "dpp_lain_a5"
                ? "dpp_split5"
                : dppLainField === "dpp_lain_a9"
                ? "dpp_split9"
                : "dpp_splitB"]: dppValue,
            [ppnField === "ppn_a5"
                ? "ppn5"
                : ppnField === "ppn_a9"
                ? "ppn9"
                : ppnField === "ppn_bi"
                ? "ppnI"
                : "ppnB"]: ppnValue,
        }));
    };

    const handleDppLainChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        dppLainField: string,
        ppnField: string
    ) => {
        const rawValue = e.target.value;
        const dppLainValue = parseRupiah(rawValue) || 0;

        const ppnValue = dppLainValue * 0.12;

        form.setValue(
            dppLainField as keyof z.infer<typeof sptIndukSchema>,
            dppLainValue
        );
        form.setValue(
            ppnField as keyof z.infer<typeof sptIndukSchema>,
            ppnValue
        );

        setInputs((prevInputs) => ({
            ...prevInputs,
            [dppLainField === "dpp_lain_a5"
                ? "dpp_split5"
                : dppLainField === "dpp_lain_a9"
                ? "dpp_split9"
                : "dpp_splitB"]: dppLainValue,
            [ppnField === "ppn_a5"
                ? "ppn5"
                : ppnField === "ppn_a9"
                ? "ppn9"
                : "ppnB"]: ppnValue,
        }));
    };

    const onSubmit = async (values: z.infer<typeof sptIndukSchema>) => {
        console.log("Form Values:", values);
        console.log("Totals before submit:", totals);

        form.setValue("dpp_a10", totals.dpp);
        form.setValue("dpp_lain_a10", totals.dpp_split);
        form.setValue("ppn_a10", totals.ppn);
        form.setValue("ppnbm_a10", totals.ppnbm);

        form.setValue("dpp_suma", totals.dppC);
        form.setValue("dpp_lain_suma", totals.dpp_splitC);
        form.setValue("ppn_suma", totals.ppnC);
        form.setValue("ppnbm_suma", totals.ppnbmC);

        form.setValue("dpp_a5", inputs.dpp5);
        form.setValue("dpp_lain_a5", inputs.dpp_split5);
        form.setValue("ppn_a5", inputs.ppn5);
        form.setValue("ppnbm_a5", inputs.ppnbm5);

        form.setValue("dpp_a9", inputs.dpp9);
        form.setValue("dpp_lain_a9", inputs.dpp_split9);
        form.setValue("ppn_a9", inputs.ppn9);
        form.setValue("ppnbm_a9", inputs.ppnbm9);

        form.setValue("dpp_ab", inputs.dppB);
        form.setValue("dpp_lain_ab", inputs.dpp_splitB);
        form.setValue("ppn_ab", inputs.ppnB);
        form.setValue("ppnbm_ab", inputs.ppnbmB);

        form.setValue("dpp_be", inputs.dppE);
        form.setValue("dpp_lain_be", inputs.dpp_splitE);
        form.setValue("ppn_be", inputs.ppnE);
        form.setValue("ppnbm_be", inputs.ppnbmE);

        form.setValue("dpp_bf", inputs.dppF);
        form.setValue("dpp_lain_bf", inputs.dpp_splitF);
        form.setValue("ppn_bf", inputs.ppnF);
        form.setValue("ppnbm_bf", inputs.ppnbmF);

        form.setValue("dpp_bh", inputs.dppBh);
        form.setValue("dpp_lain_bh", inputs.dpp_splitBh);
        form.setValue("ppn_bh", inputs.ppnBh);
        form.setValue("ppnbm_bh", inputs.ppnbmBh);

        form.setValue("dpp_bi", inputs.dppI);
        form.setValue("dpp_lain_bi", inputs.dpp_splitI);
        form.setValue("ppn_bi", inputs.ppnI);
        form.setValue("ppnbm_bi", inputs.ppnbmI);

        form.setValue("dpp_bg", totals.dpp2);
        form.setValue("dpp_lain_bg", totals.dpp_split2);
        form.setValue("ppn_bg", totals.ppn2);
        form.setValue("ppnbm_bg", totals.ppnbm2);

        form.setValue("dpp_bj", totals.dppJ);
        form.setValue("dpp_lain_bj", totals.dpp_splitJ);
        form.setValue("ppn_bj", totals.ppnJ);
        form.setValue("ppnbm_bj", totals.ppnbmJ);

        form.setValue("ppn_ca", totals.ppn_sum_1_5);
        form.setValue("ppn_cc", totals.ppn2);
        form.setValue("ppn_pkpm", inputs.ppnPkpm);
        try {
            // Debugging tab refs
            console.log("Tab refs tersedia:", {
                A1: tabA1Ref.current !== null,
                A2: tabA2Ref.current !== null,
                B1: tabB1Ref.current !== null,
                B2: tabB2Ref.current !== null,
                B3: tabB3Ref.current !== null,
            });

            // Pastikan TabA1 diakses dengan benar meskipun ref tidak tersedia
            let a1Data = [];
            let a2Data = [];
            let b1Data = [];
            let b2Data = [];
            let b3Data = [];

            // Coba ambil data dengan penanganan error lebih baik
            try {
                if (tabA1Ref.current) {
                    a1Data = tabA1Ref.current.getFormData() || [];
                    console.log("Data A1 berhasil diambil:", a1Data.length);
                } else {
                    console.warn(
                        "tabA1Ref.current tidak tersedia, menggunakan data langsung"
                    );
                    // Gunakan data langsung dari props jika tersedia
                    if (Array.isArray(others)) {
                        const filteredOther = others.filter(
                            (oth) => oth.type === "keluaran"
                        );
                        a1Data = filteredOther.map((oth) => ({
                            type: "A1",
                            no: oth.other_no,
                            date: oth.other_date,
                            customer_id: oth.customer_id || "",
                            customer_name: oth.customer_name || "",
                            customer_email: oth.customer_email || "",
                            customer_address: oth.customer_address || "",
                            dpp: Number(oth.dpp || 0),
                            dpp_lain: Number(oth.dpp_lain || 0),
                            ppn: Number(oth.ppn || 0),
                            ppnbm: Number(oth.ppnbm || 0),
                            retur_no: null,
                        }));
                        if (Array.isArray(returnsOthers)) {
                            // Filter retur yang memiliki other_id yang cocok dengan id other yang ada di filteredOther
                            const relevantReturnsOthers = returnsOthers.filter(
                                (ret) => {
                                    // Cek apakah other_id retur ada dalam daftar id others yang terfilter
                                    return filteredOther.some(
                                        (oth) => oth.id === ret.other_id
                                    );
                                }
                            );

                            const returOthersData = relevantReturnsOthers.map(
                                (ret) => {
                                    const matchingOther =
                                        filteredOther.find(
                                            (oth) => oth.id === ret.other_id
                                        ) || {};

                                    return {
                                        type: "A1",
                                        no: ret.retur_number,
                                        date: ret.retur_date,
                                        customer_id:
                                            matchingOther.customer_id || "",
                                        customer_name:
                                            matchingOther.customer_name || "",
                                        customer_email:
                                            matchingOther.customer_email || "",
                                        customer_address:
                                            matchingOther.customer_address ||
                                            "",
                                        dpp: Number(-ret.dpp || 0), // Negative value for returns
                                        dpp_lain: Number(-ret.dpp_lain || 0),
                                        ppn: Number(-ret.ppn || 0),
                                        ppnbm: Number(-ret.ppnbm || 0),
                                        retur_no: ret.retur_number,
                                    };
                                }
                            );

                            // Combine regular data with return data
                            a1Data = [...a1Data, ...returOthersData];
                        }
                    }
                }
            } catch (e) {
                console.error("Error saat mengambil data A1:", e);
            }

            try {
                if (tabA2Ref.current) {
                    a2Data = tabA2Ref.current.getFormData() || [];
                    console.log("Data A2 berhasil diambil:", a2Data.length);
                } else {
                    console.warn(
                        "tabA2Ref.current tidak tersedia, menggunakan data langsung"
                    );
                    if (Array.isArray(invoices)) {
                        const filteredInvoices = invoices.filter(
                            (inv) => inv.type === "keluaran" || !inv.type
                        );
                        a2Data = filteredInvoices.map((inv) => ({
                            type: "A2",
                            no: inv.invoice_number,
                            date: inv.invoice_date,
                            customer_id: inv.customer_id || "",
                            customer_name: inv.customer_name || "",
                            customer_email: inv.customer_email || "",
                            customer_address: inv.customer_address || "",
                            dpp: Number(inv.dpp || 0),
                            dpp_lain: Number(inv.dpp_lain || 0),
                            ppn: Number(inv.ppn || 0),
                            ppnbm: Number(inv.ppnbm || 0),
                            retur_no: null,
                        }));

                        if (Array.isArray(returns)) {
                            const relevantReturns = returns.filter((ret) => {
                                return filteredInvoices.some(
                                    (inv) => inv.id === ret.invoice_id
                                );
                            });

                            const returData = relevantReturns.map((ret) => {
                                const matchingInvoice =
                                    filteredInvoices.find(
                                        (inv) => inv.id === ret.invoice_id
                                    ) || {};

                                return {
                                    type: "A2",
                                    no: ret.retur_number,
                                    date: ret.retur_date,
                                    customer_id:
                                        matchingInvoice.customer_id || "",
                                    customer_name:
                                        matchingInvoice.customer_name || "",
                                    customer_email:
                                        matchingInvoice.customer_email || "",
                                    customer_address:
                                        matchingInvoice.customer_address || "",
                                    dpp: Number(-ret.dpp || 0),
                                    dpp_lain: Number(-ret.dpp_lain || 0),
                                    ppn: Number(-ret.ppn || 0),
                                    ppnbm: Number(-ret.ppnbm || 0),
                                    retur_no: ret.retur_number,
                                };
                            });
                            a2Data = [...a2Data, ...returData];
                        }

                        console.log(
                            "Data A2 fallback berhasil diambil:",
                            a2Data.length
                        );
                    }
                }
            } catch (e) {
                console.error("Error saat mengambil data A2:", e);
            }

            try {
                if (tabB1Ref.current) {
                    b1Data = tabB1Ref.current.getFormData() || [];
                    console.log("Data B1 berhasil diambil:", b1Data.length);
                } else {
                    console.warn(
                        "tabB1Ref.current tidak tersedia, menggunakan data langsung"
                    );
                    // Data B1 dari others masukan
                    if (Array.isArray(others)) {
                        const filteredOthers = others.filter(
                            (other) =>
                                other.type === "masukan" &&
                                other.status === "approved"
                        );
                        b1Data = filteredOthers.map((other) => ({
                            type: "B1",
                            no: other.other_no,
                            date: other.other_date,
                            customer_id: other.customer_id || "",
                            customer_name: other.customer_name || "",
                            customer_email: other.customer_email || "",
                            customer_address: other.customer_address || "",
                            dpp: Number(other.dpp || 0),
                            dpp_lain: Number(other.dpp_lain || 0),
                            ppn: Number(other.ppn || 0),
                            ppnbm: Number(other.ppnbm || 0),
                            retur_no: null,
                        }));

                        // Tambahkan data retur untuk B1 jika ada
                        if (Array.isArray(returnsOthers)) {
                            const relevantReturnsOthers = returnsOthers.filter(
                                (ret) => {
                                    return filteredOthers.some(
                                        (other) => other.id === ret.other_id
                                    );
                                }
                            );

                            const returData = relevantReturnsOthers.map(
                                (ret) => {
                                    const matchingOther =
                                        filteredOthers.find(
                                            (other) => other.id === ret.other_id
                                        ) || {};

                                    return {
                                        type: "B1",
                                        no: ret.retur_number,
                                        date: ret.retur_date,
                                        customer_id:
                                            matchingOther.customer_id || "",
                                        customer_name:
                                            matchingOther.customer_name || "",
                                        customer_email:
                                            matchingOther.customer_email || "",
                                        customer_address:
                                            matchingOther.customer_address ||
                                            "",
                                        dpp: Number(-ret.dpp || 0),
                                        dpp_lain: Number(-ret.dpp_lain || 0),
                                        ppn: Number(-ret.ppn || 0),
                                        ppnbm: Number(-ret.ppnbm || 0),
                                        retur_no: ret.retur_number,
                                    };
                                }
                            );

                            // Gabungkan data others dan retur others
                            b1Data = [...b1Data, ...returData];
                        }

                        console.log(
                            "Data B1 fallback berhasil diambil:",
                            b1Data.length
                        );
                    }
                }
            } catch (e) {
                console.error("Error saat mengambil data B1:", e);
            }

            try {
                if (tabB2Ref.current) {
                    b2Data = tabB2Ref.current.getFormData() || [];
                    console.log("Data B2 berhasil diambil:", b2Data.length);
                } else {
                    console.warn(
                        "tabB2Ref.current tidak tersedia, menggunakan data langsung"
                    );
                    // Data B2 dari invoices masukan yang bisa dikreditkan
                    if (Array.isArray(invoices)) {
                        const filteredInvoices = invoices.filter(
                            (inv) =>
                                inv.type === "masukan" &&
                                inv.status === "credit"
                        );
                        b2Data = filteredInvoices.map((inv) => ({
                            type: "B2",
                            no: inv.invoice_number,
                            date: inv.invoice_date,
                            customer_id: inv.customer_id || "",
                            customer_name: inv.customer_name || "",
                            customer_email: inv.customer_email || "",
                            customer_address: inv.customer_address || "",
                            dpp: Number(inv.dpp || 0),
                            dpp_lain: Number(inv.dpp_lain || 0),
                            ppn: Number(inv.ppn || 0),
                            ppnbm: Number(inv.ppnbm || 0),
                            retur_no: null,
                        }));

                        // Tambahkan data retur untuk B2 jika ada
                        if (Array.isArray(returns)) {
                            const relevantReturns = returns.filter((ret) => {
                                return filteredInvoices.some(
                                    (inv) => inv.id === ret.invoice_id
                                );
                            });

                            const returData = relevantReturns.map((ret) => {
                                const matchingInvoice =
                                    filteredInvoices.find(
                                        (inv) => inv.id === ret.invoice_id
                                    ) || {};

                                return {
                                    type: "B2",
                                    no: ret.retur_number,
                                    date: ret.retur_date,
                                    customer_id:
                                        matchingInvoice.customer_id || "",
                                    customer_name:
                                        matchingInvoice.customer_name || "",
                                    customer_email:
                                        matchingInvoice.customer_email || "",
                                    customer_address:
                                        matchingInvoice.customer_address || "",
                                    dpp: Number(-ret.dpp || 0),
                                    dpp_lain: Number(-ret.dpp_lain || 0),
                                    ppn: Number(-ret.ppn || 0),
                                    ppnbm: Number(-ret.ppnbm || 0),
                                    retur_no: ret.retur_number,
                                };
                            });

                            // Gabungkan data invoice dan retur
                            b2Data = [...b2Data, ...returData];
                        }

                        console.log(
                            "Data B2 fallback berhasil diambil:",
                            b2Data.length
                        );
                    }
                }
            } catch (e) {
                console.error("Error saat mengambil data B2:", e);
            }

            try {
                if (tabB3Ref.current) {
                    b3Data = tabB3Ref.current.getFormData() || [];
                    console.log("Data B3 berhasil diambil:", b3Data.length);
                } else {
                    console.warn(
                        "tabB3Ref.current tidak tersedia, menggunakan data langsung"
                    );
                    // Data B3 dari invoices masukan uncredit
                    if (Array.isArray(invoices)) {
                        const filteredInvoices = invoices.filter(
                            (inv) =>
                                inv.type === "masukan" &&
                                inv.status === "uncredit"
                        );
                        b3Data = filteredInvoices.map((inv) => ({
                            type: "B3",
                            no: inv.invoice_number,
                            date: inv.invoice_date,
                            customer_id: inv.customer_id || "",
                            customer_name: inv.customer_name || "",
                            customer_email: inv.customer_email || "",
                            customer_address: inv.customer_address || "",
                            dpp: Number(inv.dpp || 0),
                            dpp_lain: Number(inv.dpp_lain || 0),
                            ppn: Number(inv.ppn || 0),
                            ppnbm: Number(inv.ppnbm || 0),
                            retur_no: null,
                        }));

                        // Tambahkan data retur untuk B3 jika ada
                        if (Array.isArray(returns)) {
                            const relevantReturns = returns.filter((ret) => {
                                return filteredInvoices.some(
                                    (inv) => inv.id === ret.invoice_id
                                );
                            });

                            const returData = relevantReturns.map((ret) => {
                                const matchingInvoice =
                                    filteredInvoices.find(
                                        (inv) => inv.id === ret.invoice_id
                                    ) || {};

                                return {
                                    type: "B3",
                                    no: ret.retur_number,
                                    date: ret.retur_date,
                                    customer_id:
                                        matchingInvoice.customer_id || "",
                                    customer_name:
                                        matchingInvoice.customer_name || "",
                                    customer_email:
                                        matchingInvoice.customer_email || "",
                                    customer_address:
                                        matchingInvoice.customer_address || "",
                                    dpp: Number(-ret.dpp || 0),
                                    dpp_lain: Number(-ret.dpp_lain || 0),
                                    ppn: Number(-ret.ppn || 0),
                                    ppnbm: Number(-ret.ppnbm || 0),
                                    retur_no: ret.retur_number,
                                };
                            });

                            // Gabungkan data invoice dan retur
                            b3Data = [...b3Data, ...returData];
                        }

                        console.log(
                            "Data B3 fallback berhasil diambil:",
                            b3Data.length
                        );
                    }
                }
            } catch (e) {
                console.error("Error saat mengambil data B3:", e);
            }

            console.log("Jumlah data yang diambil:", {
                A1: a1Data.length,
                A2: a2Data.length,
                B1: b1Data.length,
                B2: b2Data.length,
                B3: b3Data.length,
            });

            // Combine all tab data
            const allTabData = [
                ...a1Data,
                ...a2Data,
                ...b1Data,
                ...b2Data,
                ...b3Data,
            ];

            console.log("Tab data collected:", allTabData);

            const updatedFormValues = form.getValues();
            const formattedValues = {
                ...updatedFormValues,
                totals: totals,
                inputs: inputs,
                tab_data: allTabData,
            };

            setPendingSubmit({
                ...formattedValues,
            });

            console.log("Pending Submit with tab data:", formattedValues);
            setOpenModalPayment(true);
        } catch (error) {
            console.error("Error collecting tab data:", error);

            const updatedFormValues = form.getValues();

            const formattedValues = {
                ...updatedFormValues,
                totals: totals,
                inputs: inputs,
            };

            setPendingSubmit({
                ...formattedValues,
            });
            console.log("Pending Submit:", formattedValues);
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
                                chunkWords += `${
                                    tens[Math.floor(remainder / 10)]
                                } ${units[remainder % 10]}`;
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
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ") + " Rupiah"
                );
            };

            const finalData = {
                ...pendingSubmit,
                ttd_date: formatDate(pendingSubmit.ttd_date),
                payment_method: paymentMethod,
                password: password,
                tab_data: pendingSubmit.tab_data?.map((item) => ({
                    ...item,
                    date: formatDate(item.date),
                })),
                billing_data: {
                    billing_type_id: 55,
                    start_period: spt.start_period,
                    end_period: spt.end_period,
                    year: spt.year,
                    currency: "IDR",
                    amount:
                        (pendingSubmit.ppn_ce || 0) +
                        (pendingSubmit.ppn_kms || 0) +
                        (pendingSubmit.ppn_pkpm || 0) +
                        (pendingSubmit.ppnbm_dc || 0),
                    amount_in_words: numberToWords(
                        (pendingSubmit.ppn_ce || 0) +
                            (pendingSubmit.ppn_kms || 0) +
                            (pendingSubmit.ppn_pkpm || 0) +
                            (pendingSubmit.ppnbm_dc || 0)
                    ),
                    description: "",
                    status: "unpaid",
                    active_period: formatDate(
                        new Date(new Date().setDate(new Date().getDate() + 7))
                    ),
                    code: generateBillingCode(),
                },
                ledger_data: {
                    billing_type_id: 55,
                    transaction_date: formatDate(
                        new Date(new Date().setDate(new Date().getDate()))
                    ),
                    posting_date: formatDate(
                        new Date(new Date().setDate(new Date().getDate()))
                    ),
                    accounting_type: "surat pemberitahuan",
                    accounting_type_detail: spt.correction_number === 1 ? "spt pembetulan" : "spt normal",
                    currency: "IDR",
                    transaction_type: "debit",
                    debit_amount:
                        -(pendingSubmit.ppn_ce || 0) +
                        (pendingSubmit.ppn_kms || 0) +
                        (pendingSubmit.ppn_pkpm || 0) +
                        (pendingSubmit.ppnbm_dc || 0),
                    debit_unpaid: 0,
                    credit_amount: 0,
                    credit_left: 0,
                    kap: "411211",
                    kap_description: "PPN Dalam Negeri - Masa",
                    kjs: "100",
                    tax_period: spt.start_period + " " + spt.year,
                    transaction_number: transactionNumber,
                },
            };

            console.log("Data final yang dikirim:", finalData);
            router.post(route("spt.storeInduk"), finalData);
            setPendingSubmit(null);
        }

        setOpenPasswordModal(false);
    };

    return (
        <Authenticated>
            <Head title="Detail SPT" />
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
                                <BreadcrumbPage>Detail SPT</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Detail SPT
                    </h1>
                    <div className="flex flex-col gap-4 bg-sidebar border rounded-xl p-5 md:p-8">
                        <Tabs defaultValue="Main Form" className="w-full">
                            <TabsList className="flex justify-start gap-2">
                                <TabsTrigger value="Main Form">
                                    Induk
                                </TabsTrigger>
                                <TabsTrigger value="A-1">A-1</TabsTrigger>
                                <TabsTrigger value="A-2">A-2</TabsTrigger>
                                <TabsTrigger value="B-1">B-1</TabsTrigger>
                                <TabsTrigger value="B-2">B-2</TabsTrigger>
                                <TabsTrigger value="B-3">B-3</TabsTrigger>
                                <TabsTrigger value="C">C</TabsTrigger>
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
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                name="user.name"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Nama
                                                                            PKP
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue={
                                                                                    user.name
                                                                                }
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                name="user.address"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Alamat
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue={
                                                                                    user.address
                                                                                }
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                name="user.phone_number"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            HP
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue="-"
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                name="user.phone_number"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Telepon
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue={
                                                                                    user.phone_number
                                                                                }
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                name="user.npwp"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            NPWP
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue={
                                                                                    user.npwp
                                                                                }
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                name="klu"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            KLU
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue="-"
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                name="spt.start_period"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Periode
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue={
                                                                                    spt.start_period +
                                                                                    " " +
                                                                                    spt.year
                                                                                }
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                name="spt.correction_number"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Model
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                defaultValue={
                                                                                    spt.correction_number ===
                                                                                    0
                                                                                        ? "Normal"
                                                                                        : "Pembetulan"
                                                                                }
                                                                                disabled
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
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
                                                    I. PENYERAHAN BARANG DAN
                                                    JASA
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Penyerahan
                                                                    barang dan
                                                                    jasa
                                                                </TableHead>
                                                                <TableHead>
                                                                    Harga
                                                                    Jual/Pengganti
                                                                    Nilai
                                                                    Ekspor/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    DPP Nilai
                                                                    Lain/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPN (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPnBM
                                                                    (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell className="font-medium">
                                                                                        A.
                                                                                        Penyerahan
                                                                                        BKP/JKP
                                                                                        yang
                                                                                        terutang
                                                                                        PPN{" "}
                                                                                    </TableCell>
                                                                                </TableRow>

                                                                                <TableRow>
                                                                                    <TableCell className="pl-8">
                                                                                        {/* pajak keluaran dokumen lain */}
                                                                                        1.
                                                                                        Ekspor
                                                                                        BKP/BKP
                                                                                        Tidak
                                                                                        Berwujud/JKP
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a1"
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
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell className="pl-8">
                                                                                        2.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        PPN
                                                                                        atau
                                                                                        PPN
                                                                                        dan
                                                                                        PPnBM-nya
                                                                                        harus
                                                                                        dipungut
                                                                                        sendiri
                                                                                        dengan
                                                                                        DPP
                                                                                        Nilai
                                                                                        Lain
                                                                                        atau
                                                                                        Besaran
                                                                                        Tertentu
                                                                                        (dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        Kode
                                                                                        04
                                                                                        dan
                                                                                        05)
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a2"
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
                                                                                            name="dpp_lain_a2"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppn_a2"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppnbm_a2"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                    <TableCell className="pl-8">
                                                                                        3.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        PPN
                                                                                        atau
                                                                                        PPN
                                                                                        dan
                                                                                        PPnBM-nya
                                                                                        harus
                                                                                        dipungut
                                                                                        sendiri
                                                                                        kepada
                                                                                        turis
                                                                                        sesuai
                                                                                        dengan
                                                                                        Pasal
                                                                                        16E
                                                                                        UU
                                                                                        PPN
                                                                                        (dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        Kode
                                                                                        06)
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a3"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="dpp_lain_a3"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppn_a3"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppnbm_a3"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                    <TableCell className="pl-8">
                                                                                        4.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        PPN
                                                                                        atau
                                                                                        PPN
                                                                                        dan
                                                                                        PPnBM-nya
                                                                                        harus
                                                                                        dipungut
                                                                                        sendiri
                                                                                        lainnya
                                                                                        (dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        Kode
                                                                                        01,
                                                                                        09
                                                                                        dan
                                                                                        10)
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a4"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
                                                                                                            value={formatRupiah(
                                                                                                                field.value
                                                                                                            )}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="ppn_a4"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppnbm_a4"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                    <TableCell className="pl-8">
                                                                                        5.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        PPN
                                                                                        atau
                                                                                        PPN
                                                                                        dan
                                                                                        PPnBM-nya
                                                                                        harus
                                                                                        dipungut
                                                                                        sendiri
                                                                                        dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        yang
                                                                                        dilaporkan
                                                                                        secara
                                                                                        digunggung
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a5"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleDppChange(
                                                                                                                    e,
                                                                                                                    "dpp_a5",
                                                                                                                    "dpp_lain_a5",
                                                                                                                    "ppn_a5"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_lain_a5"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleDppLainChange(
                                                                                                                    e,
                                                                                                                    "dpp_lain_a5",
                                                                                                                    "ppn_a5"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="ppn_a5"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleInputChange(
                                                                                                                    e,
                                                                                                                    "ppn5"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="ppnbm_a5"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleInputChange(
                                                                                                                    e,
                                                                                                                    "ppnbm5"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell className="pl-8">
                                                                                        6.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        PPN
                                                                                        atau
                                                                                        PPN
                                                                                        dan
                                                                                        PPnBM-nya
                                                                                        harus
                                                                                        dipungut
                                                                                        oleh
                                                                                        Pemungut
                                                                                        PPN
                                                                                        (dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        Kode
                                                                                        02
                                                                                        dan
                                                                                        03)
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a6"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="dpp_lain_a6"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppn_a6"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppnbm_a6"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                    <TableCell className="pl-8">
                                                                                        7.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        mendapat
                                                                                        fasilitas
                                                                                        PPN
                                                                                        atau
                                                                                        PPnBM
                                                                                        Tidak
                                                                                        Dipungut
                                                                                        (dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        Kode
                                                                                        07)
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a7"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="dpp_lain_a7"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppn_a7"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppnbm_a7"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                    <TableCell className="pl-8">
                                                                                        8.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        mendapat
                                                                                        fasilitas
                                                                                        PPN
                                                                                        atau
                                                                                        PPnBM
                                                                                        Dibebaskan
                                                                                        (dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        Kode
                                                                                        08)
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a8"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="dpp_lain_a8"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppn_a8"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                            name="ppnbm_a8"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            disabled
                                                                                                            {...field}
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
                                                                                    <TableCell className="pl-8">
                                                                                        9.
                                                                                        Penyerahan
                                                                                        yang
                                                                                        mendapat
                                                                                        fasilitas
                                                                                        PPN
                                                                                        atau
                                                                                        PPnBM
                                                                                        dengan
                                                                                        Faktur
                                                                                        Pajak
                                                                                        yang
                                                                                        dilaporkan
                                                                                        secara
                                                                                        digunggung
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a9"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleDppChange(
                                                                                                                    e,
                                                                                                                    "dpp_a9",
                                                                                                                    "dpp_lain_a9",
                                                                                                                    "ppn_a9"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_lain_a9"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleDppLainChange(
                                                                                                                    e,
                                                                                                                    "dpp_lain_a9",
                                                                                                                    "ppn_a9"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="ppn_a9"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleInputChange(
                                                                                                                    e,
                                                                                                                    "ppn9"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="ppnbm_a9"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleInputChange(
                                                                                                                    e,
                                                                                                                    "ppnbm9"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                </TableRow>

                                                                                <TableRow>
                                                                                    <TableCell className="font-medium pl-8">
                                                                                        Jumlah
                                                                                        (I.A.1
                                                                                        +
                                                                                        I.A.2
                                                                                        +
                                                                                        I.A.3
                                                                                        +
                                                                                        I.A.4
                                                                                        +
                                                                                        I.A.5
                                                                                        +
                                                                                        I.A.6
                                                                                        +
                                                                                        I.A.7
                                                                                        +
                                                                                        I.A.8
                                                                                        +
                                                                                        I.A.9)
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_a10"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            {...field}
                                                                                                            value={formatRupiah(
                                                                                                                totals.dpp
                                                                                                            )}
                                                                                                            disabled
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="ppn_a10"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            {...field}
                                                                                                            value={formatRupiah(
                                                                                                                totals.ppn
                                                                                                            )}
                                                                                                            disabled
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="ppnbm_a10"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            {...field}
                                                                                                            value={formatRupiah(
                                                                                                                totals.ppnbm
                                                                                                            )}
                                                                                                            disabled
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                </TableRow>

                                                                                <TableRow>
                                                                                    <TableCell className="font-medium">
                                                                                        B.
                                                                                        Penyerahan
                                                                                        barang/jasa
                                                                                        yang
                                                                                        tidak
                                                                                        terutang
                                                                                        PPN{" "}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_ab"
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
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                const numberValue =
                                                                                                                    parseRupiah(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    ) ||
                                                                                                                    0;
                                                                                                                field.onChange(
                                                                                                                    numberValue
                                                                                                                );
                                                                                                                handleInputChange(
                                                                                                                    e,
                                                                                                                    "dppB"
                                                                                                                );
                                                                                                            }}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                </TableRow>

                                                                                <TableRow>
                                                                                    <TableCell className="font-medium">
                                                                                        C.
                                                                                        Jumlah
                                                                                        seluruh
                                                                                        penyerahan
                                                                                        barang
                                                                                        dan
                                                                                        jasa
                                                                                        (I.A
                                                                                        +
                                                                                        I.B){" "}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <FormField
                                                                                            name="dpp_suma"
                                                                                            render={({
                                                                                                field,
                                                                                            }) => (
                                                                                                <FormItem>
                                                                                                    <FormControl>
                                                                                                        <Input
                                                                                                            type="text"
                                                                                                            {...field}
                                                                                                            value={formatRupiah(
                                                                                                                totals.dppC
                                                                                                            )}
                                                                                                        />
                                                                                                    </FormControl>
                                                                                                </FormItem>
                                                                                            )}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                    <TableCell></TableCell>
                                                                                </TableRow>
                                                              
                                                        </TableBody>
                                                    </Table>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        {/* 2 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    II. PEROLEHAN BARANG DAN
                                                    JASA
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Perolehan
                                                                    barang dan
                                                                    jasa
                                                                </TableHead>
                                                                <TableHead>
                                                                    Harga
                                                                    Jual/Pengganti
                                                                    Nilai
                                                                    Ekspor/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    DPP Nilai
                                                                    Lain/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPN (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPnBM
                                                                    (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    A. Impor
                                                                    BKP,
                                                                    Pemanfaatan
                                                                    BKP Tidak
                                                                    Berwujud
                                                                    dan/atau JKP
                                                                    dari luar
                                                                    Daerah
                                                                    Pabean di
                                                                    dalam Daerah
                                                                    Pabean yang
                                                                    Pajak
                                                                    Masukannya
                                                                    dapat
                                                                    dikreditkan
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_ba"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_ba"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_ba"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    B. Perolehan
                                                                    BKP/JKP dari
                                                                    dalam negeri
                                                                    dengan DPP
                                                                    Nilai Lain
                                                                    atau Besaran
                                                                    Tertentu
                                                                    yang Pajak
                                                                    Masukannya
                                                                    dapat
                                                                    dikreditkan
                                                                    (dengan
                                                                    Faktur Pajak
                                                                    Kode 04 dan
                                                                    05)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_bb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_bb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_bb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    C. Perolehan
                                                                    BKP/JKP dari
                                                                    dalam negeri
                                                                    selain
                                                                    dengan DPP
                                                                    Nilai Lain
                                                                    yang Pajak
                                                                    Masukannya
                                                                    dapat
                                                                    dikreditkan
                                                                    (dengan
                                                                    Faktur Pajak
                                                                    Kode 01, 09,
                                                                    dan 10)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_bc"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bc"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_bc"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    D. Perolehan
                                                                    BKP/JKP dari
                                                                    dalam negeri
                                                                    sebagai
                                                                    Pemungut PPN
                                                                    yang Pajak
                                                                    Masukannya
                                                                    dapat
                                                                    dikreditkan
                                                                    (dengan
                                                                    Faktur Pajak
                                                                    Kode 02 dan
                                                                    03)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_bd"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_bd"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bd"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_bd"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    E.
                                                                    Kompensasi
                                                                    kelebihan
                                                                    Pajak
                                                                    Masukan
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_be"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const numberValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                numberValue
                                                                                            );
                                                                                            handleInputChange(
                                                                                                e,
                                                                                                "ppnE"
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    F. Hasil
                                                                    penghitungan
                                                                    kembali
                                                                    Pajak
                                                                    Masukan yang
                                                                    telah
                                                                    dikreditkan
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bf"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const numberValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                numberValue
                                                                                            );
                                                                                            handleInputChange(
                                                                                                e,
                                                                                                "ppnF"
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    G. Jumlah
                                                                    Pajak
                                                                    Masukan yang
                                                                    dapat
                                                                    diperhitungkan
                                                                    (II.A + II.B
                                                                    + II.C +
                                                                    II.D + II.E
                                                                    + II.F)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_bg"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.dpp2
                                                                                        )}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bg"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.ppn2
                                                                                        )}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    H. Impor
                                                                    atau
                                                                    perolehan
                                                                    BKP/JKP yang
                                                                    Pajak
                                                                    Masukannya
                                                                    tidak
                                                                    dikreditkan
                                                                    dan atau
                                                                    impor atau
                                                                    perolehan
                                                                    BKP/JKP yang
                                                                    mendapat
                                                                    fasilitas
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_bh"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_bh"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bh"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_bh"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    I. Impor
                                                                    atau
                                                                    perolehan
                                                                    BKP/JKP
                                                                    dengan
                                                                    Faktur Pajak
                                                                    yang
                                                                    dilaporkan
                                                                    secara
                                                                    digunggung
                                                                    dan
                                                                    barang/jasa
                                                                    yang tidak
                                                                    terutang PPN
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_bi"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const numberValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                numberValue
                                                                                            );
                                                                                            handleDppChange(
                                                                                                e,
                                                                                                "dpp_bi",
                                                                                                "dpp_lain_a5",
                                                                                                "ppn_bi"
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bi"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const numberValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                numberValue
                                                                                            );
                                                                                            handleInputChange(
                                                                                                e,
                                                                                                "ppnI"
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_bi"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const numberValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                numberValue
                                                                                            );
                                                                                            handleInputChange(
                                                                                                e,
                                                                                                "ppnbmI"
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    J. Jumlah
                                                                    perolehan
                                                                    (II.A + II.B
                                                                    + II.C +
                                                                    II.D +II.H +
                                                                    II.I)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_bj"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.dppJ
                                                                                        )}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_bj"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.ppnJ
                                                                                        )}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_bj"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.ppnbmJ
                                                                                        )}
                                                                                        disabled
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
                                        {/* 3 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-3">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    III. PERHITUNGAN PPN KURANG
                                                    BAYAR/LEBIH BAYAR
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Perhitungan
                                                                    PPN Kurang
                                                                    Bayar
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPN (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    A. Pajak
                                                                    Keluaran
                                                                    yang harus
                                                                    dipungut
                                                                    sendiri
                                                                    (I.A.2 +
                                                                    I.A.3 +
                                                                    I.A.4 +
                                                                    I.A.5)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_ca"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.ppn_sum_1_5
                                                                                        )}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    B. PPN
                                                                    disetor
                                                                    dimuka dalam
                                                                    Masa Pajak
                                                                    yang sama
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_cb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    C. Pajak
                                                                    Masukan yang
                                                                    dapat
                                                                    diperhitungkan
                                                                    (II.G)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_cc"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.ppn2
                                                                                        )}
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            console.log(
                                                                                                "Changing ppn_cc:",
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            );
                                                                                            field.onChange(
                                                                                                e
                                                                                            );
                                                                                        }}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    D. Kelebihan
                                                                    pemungutan
                                                                    PPN oleh
                                                                    Pemungut PPN
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_cd"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    E. PPN
                                                                    kurang atau
                                                                    (lebih)
                                                                    bayar (III.A
                                                                    - III.B -
                                                                    III.C -
                                                                    III.D)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_ce"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    F. PPN
                                                                    kurang atau
                                                                    (lebih)
                                                                    bayar pada
                                                                    SPT yang
                                                                    dibetulkan
                                                                    sebelumnya
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_cf"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium flex items-center space-x-10">
                                                                    G. PPN
                                                                    kurang atau
                                                                    (lebih)
                                                                    bayar karena
                                                                    pembetulan
                                                                    SPT (III.E -
                                                                    III.F)
                                                                    <div className="flex items-center space-x-2 pl-10">
                                                                        <Checkbox id="terms1" />
                                                                        <label
                                                                            htmlFor="terms1"
                                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                        >
                                                                            Ganti
                                                                            SPT
                                                                            Sebelumnya
                                                                        </label>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_cg"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow
                                                                className={
                                                                    showRowH
                                                                        ? ""
                                                                        : "hidden"
                                                                }
                                                            >
                                                                <TableCell className="font-medium flex items-start space-x-10">
                                                                    H. diminta
                                                                    untuk:
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="ppn_ch"
                                                                        render={({
                                                                            field,
                                                                        }) => {
                                                                            return (
                                                                                <FormItem className="pl-4 space-y-2">
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            onValueChange={
                                                                                                field.onChange
                                                                                            }
                                                                                            value={
                                                                                                field.value ||
                                                                                                ""
                                                                                            }
                                                                                        >
                                                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                                                <FormControl>
                                                                                                    <RadioGroupItem value="Dikompensasikan" />
                                                                                                </FormControl>
                                                                                                <FormLabel className="font-normal">
                                                                                                    Dikompensasikan
                                                                                                </FormLabel>
                                                                                            </FormItem>
                                                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                                                <FormControl>
                                                                                                    <RadioGroupItem value="dikembalikan melalui pengembalian pendahuluan" />
                                                                                                </FormControl>
                                                                                                <FormLabel className="font-normal">
                                                                                                    dikembalikan
                                                                                                    melalui
                                                                                                    pengembalian
                                                                                                    pendahuluan
                                                                                                </FormLabel>
                                                                                            </FormItem>
                                                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                                                <FormControl>
                                                                                                    <RadioGroupItem value="dikembalikan melalui pemeriksaan" />
                                                                                                </FormControl>
                                                                                                <FormLabel className="font-normal">
                                                                                                    dikembalikan
                                                                                                    melalui
                                                                                                    pemeriksaan
                                                                                                </FormLabel>
                                                                                            </FormItem>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            );
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        {/* 4 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-4">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    IV. PPN TERUTANG ATAS
                                                    KEGIATAN MEMBANGUN SENDIRI
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    PPN Terutang
                                                                    atas
                                                                    Kegiatan
                                                                    Membangun
                                                                    Sendiri
                                                                </TableHead>
                                                                <TableHead>
                                                                    DPP (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPN (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    PPN Terutang
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_kms"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const dppValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                dppValue
                                                                                            );

                                                                                            const ppnValue =
                                                                                                dppValue *
                                                                                                0.12;

                                                                                            form.setValue(
                                                                                                "ppn_kms",
                                                                                                ppnValue
                                                                                            );

                                                                                            setInputs(
                                                                                                (
                                                                                                    prevInputs
                                                                                                ) => ({
                                                                                                    ...prevInputs,
                                                                                                    dppKms: dppValue,
                                                                                                    ppnKms: ppnValue,
                                                                                                })
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_kms"
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
                                                                                        disabled
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
                                        {/* 5 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-5">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    V. PEMBAYARAN KEMBALI PAJAK
                                                    MASUKAN YANG TIDAK DAPAT
                                                    DIKREDITKAN
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Pembayaran
                                                                    Kembali
                                                                    Pajak
                                                                    Masukan yang
                                                                    Tidak Dapat
                                                                    Dikreditkan
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPN (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    PPN Yang
                                                                    Wajib
                                                                    Dibayar
                                                                    Kembali
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_pkpm"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const numberValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                numberValue
                                                                                            );

                                                                                            setInputs(
                                                                                                (
                                                                                                    prevInputs
                                                                                                ) => ({
                                                                                                    ...prevInputs,
                                                                                                    ppnPkpm:
                                                                                                        numberValue,
                                                                                                })
                                                                                            );
                                                                                        }}
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
                                        {/* 6 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-6">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    VI. PAJAK PENJUALAN ATAS
                                                    BARANG MEWAH
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Pajak
                                                                    Penjualan
                                                                    atas Barang
                                                                    Mewah
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPnBM
                                                                    (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    A. PPnBM
                                                                    yang harus
                                                                    dipungut
                                                                    sendiri
                                                                    (I.A.2 +
                                                                    I.A.3 +
                                                                    I.A.4 +
                                                                    I.A.5)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_da"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            totals.ppnbm_sum_1_5
                                                                                        )}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    B. Kelebihan
                                                                    pemungutan
                                                                    PPnBM oleh
                                                                    Pemungut PPN
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_db"
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const numberValue =
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                0;
                                                                                            field.onChange(
                                                                                                numberValue
                                                                                            );

                                                                                            const ppnbm_da =
                                                                                                form.getValues(
                                                                                                    "ppnbm_da"
                                                                                                ) ||
                                                                                                0;
                                                                                            const ppnbm_dc =
                                                                                                ppnbm_da -
                                                                                                numberValue;
                                                                                            form.setValue(
                                                                                                "ppnbm_dc",
                                                                                                ppnbm_dc
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    C. PPnBM
                                                                    kurang atau
                                                                    (lebih)
                                                                    bayar (VI.A
                                                                    - VI.B)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_dc"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        {...field}
                                                                                        value={formatRupiah(
                                                                                            form.getValues(
                                                                                                "ppnbm_dc"
                                                                                            )
                                                                                        )}
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    D. PPnBM
                                                                    kurang atau
                                                                    (lebih)
                                                                    bayar pada
                                                                    SPT yang
                                                                    dibetulkan
                                                                    sebelumnya
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_dd"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    E. PPnBM
                                                                    kurang atau
                                                                    (lebih)
                                                                    bayar karena
                                                                    pembetulan
                                                                    SPT (VI.C -
                                                                    VI.D)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_de"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow
                                                                className={
                                                                    showRowF
                                                                        ? ""
                                                                        : "hidden"
                                                                }
                                                            >
                                                                <TableCell className="font-medium flex items-center space-x-10">
                                                                    F.
                                                                    <div className="flex items-center space-x-2 px-2">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="ppnbm_df"
                                                                            render={({
                                                                                field,
                                                                            }) => {
                                                                                return (
                                                                                    <FormItem>
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                checked={
                                                                                                    field.value
                                                                                                }
                                                                                                onCheckedChange={
                                                                                                    field.onChange
                                                                                                }
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormLabel className="ml-2">
                                                                                            diminta
                                                                                            pengembalian
                                                                                            pajak
                                                                                            yang
                                                                                            tidak
                                                                                            seharusnya
                                                                                            terutang
                                                                                        </FormLabel>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        {/* 7 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-7">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    VII. PEMUNGUTAN PPN ATAU PPN
                                                    DAN PPnBM OLEH PEMUNGUT PPN
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Pemungutan
                                                                    PPN atau PPN
                                                                    dan PPnBM
                                                                    oleh
                                                                    pemungut PPN
                                                                </TableHead>
                                                                <TableHead>
                                                                    Harga
                                                                    Jual/Pengganti
                                                                    Nilai
                                                                    Ekspor/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    DPP Nilai
                                                                    Lain/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPN (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPnBM
                                                                    (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    A. Jumlah
                                                                    PPN dan
                                                                    PPnBM yang
                                                                    dipungut
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_ea"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_ea"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_ea"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_ea"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    B. PPN dan
                                                                    PPnBM kurang
                                                                    atau (lebih)
                                                                    bayar pada
                                                                    SPT yang
                                                                    dibetulkan
                                                                    sebelumnya
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_eb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_eb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_eb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_eb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    C. PPN dan
                                                                    PPnBM kurang
                                                                    atau (lebih)
                                                                    bayar karena
                                                                    pembetulan
                                                                    SPT (VII.A -
                                                                    VII.B)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_ec"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_ec"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_ec"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_ec"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-small">
                                                                    Setiap
                                                                    kelebihan
                                                                    pemungutan
                                                                    PPN oleh
                                                                    Pemungut PPN
                                                                    pada bagian
                                                                    ini akan
                                                                    dipindah ke
                                                                    bagian III.D
                                                                    untuk PPN
                                                                    dan VI.B
                                                                    untuk PPnBM.
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        {/* 8 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-8">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    VIII. PEMUNGGUTAN PPN ATAU
                                                    PPN DAN PPnBM OLEH PIHAK
                                                    LAIN
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Pemungutan
                                                                    PPN atau PPN
                                                                    dan PPnBM
                                                                    oleh pihak
                                                                    lain
                                                                </TableHead>
                                                                <TableHead>
                                                                    Harga
                                                                    Jual/Pengganti
                                                                    Nilai
                                                                    Ekspor/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    DPP Nilai
                                                                    Lain/DPP
                                                                    (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPN (Rupiah)
                                                                </TableHead>
                                                                <TableHead>
                                                                    PPnBM
                                                                    (Rupiah)
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    A. Jumlah
                                                                    PPN dan
                                                                    PPnBM yang
                                                                    dipungut
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_fa"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_fa"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_fa"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_fa"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    B. PPN dan
                                                                    PPnBM kurang
                                                                    atau (lebih)
                                                                    bayar pada
                                                                    SPT yang
                                                                    dibetulkan
                                                                    sebelumnya
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_fb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_fb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_fb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_fb"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium">
                                                                    C. PPN dan
                                                                    PPnBM kurang
                                                                    atau (lebih)
                                                                    bayar karena
                                                                    pembetulan
                                                                    SPT (VIII.A
                                                                    - VIII.B)
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_fc"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="dpp_lain_fc"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppn_fc"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <FormField
                                                                        name="ppnbm_fc"
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
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium flex items-center">
                                                                    D.
                                                                    <div className="flex items-center space-x-2 px-2">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="ppnbm_fd"
                                                                            render={({
                                                                                field,
                                                                            }) => {
                                                                                return (
                                                                                    <FormItem>
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                checked={
                                                                                                    field.value
                                                                                                }
                                                                                                onCheckedChange={
                                                                                                    field.onChange
                                                                                                }
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormLabel className="ml-2">
                                                                                            diminta
                                                                                            pengembalian
                                                                                            pajak
                                                                                            yang
                                                                                            tidak
                                                                                            seharusnya
                                                                                            terutang
                                                                                        </FormLabel>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        {/* 9 */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="item-9">
                                                <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                                    IX. KELENGKAPAN SPT
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Kelengkapan
                                                                    SPT
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium flex items-center space-x-10">
                                                                    1.
                                                                    <div className="flex items-center space-x-2 px-2">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="spt_document"
                                                                            render={({
                                                                                field,
                                                                            }) => {
                                                                                return (
                                                                                    <FormItem>
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                checked={
                                                                                                    field.value ===
                                                                                                    "ya"
                                                                                                }
                                                                                                onCheckedChange={(
                                                                                                    checked
                                                                                                ) =>
                                                                                                    field.onChange(
                                                                                                        checked
                                                                                                            ? "ya"
                                                                                                            : "tidak"
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormLabel className="ml-2">
                                                                                            Dokumen
                                                                                            Daftar
                                                                                            Rincian
                                                                                            Penyerahan
                                                                                            Kendaraan
                                                                                            Bermotor
                                                                                        </FormLabel>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium flex items-center space-x-10">
                                                                    2.
                                                                    <div className="flex items-center space-x-2 px-2">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="spt_result"
                                                                            render={({
                                                                                field,
                                                                            }) => {
                                                                                return (
                                                                                    <FormItem>
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                checked={
                                                                                                    field.value ===
                                                                                                    "ya"
                                                                                                }
                                                                                                onCheckedChange={(
                                                                                                    checked
                                                                                                ) =>
                                                                                                    field.onChange(
                                                                                                        checked
                                                                                                            ? "ya"
                                                                                                            : "tidak"
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormLabel className="ml-2">
                                                                                            Hasil
                                                                                            Penghitungan
                                                                                            Kembali
                                                                                            Pajak
                                                                                            Masukan
                                                                                            yang
                                                                                            Telah
                                                                                            Dikreditkan
                                                                                        </FormLabel>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
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
                                                    PERNYATAAN
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
                                                                name="ttd_name"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Nama
                                                                            PKP*
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                {...field}
                                                                                required
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                name="ttd_position"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Jabatan*
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="text"
                                                                                {...field}
                                                                                required
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="ttd_date"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Tanggal*
                                                                        </FormLabel>
                                                                        <Popover
                                                                            open={
                                                                                isCalendarOpen
                                                                            }
                                                                            onOpenChange={
                                                                                setIsCalendarOpen
                                                                            }
                                                                        >
                                                                            <PopoverTrigger
                                                                                asChild
                                                                            >
                                                                                <FormControl>
                                                                                    <Button
                                                                                        variant={
                                                                                            "outline"
                                                                                        }
                                                                                        className={cn(
                                                                                            "w-full pl-3 text-left font-normal",
                                                                                            !field.value &&
                                                                                                "text-muted-foreground"
                                                                                        )}
                                                                                        onClick={() =>
                                                                                            setIsCalendarOpen(
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
                                                                                        setIsCalendarOpen(
                                                                                            false
                                                                                        );
                                                                                    }}
                                                                                    disabled={(
                                                                                        date
                                                                                    ) =>
                                                                                        date >
                                                                                            new Date() ||
                                                                                        date <
                                                                                            new Date(
                                                                                                "1900-01-01"
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

                            <TabsContent value="A-1">
                                <TabA1
                                    ref={tabA1Ref}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    invoice={filteredInvoices}
                                    retur={filteredReturns}
                                    other={filteredOthers}
                                    returnsOthers={returnsOthers}
                                />
                            </TabsContent>
                            <TabsContent value="A-2">
                                <TabA2
                                    ref={tabA2Ref}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    invoice={filteredInvoices}
                                    retur={filteredReturns}
                                />
                            </TabsContent>
                            <TabsContent value="B-1">
                                <TabB1
                                    ref={tabB1Ref}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    invoice={filteredInvoices}
                                    retur={filteredReturns}
                                    other={filteredOthersMasukan}
                                    returnsOthers={returnsOthers}
                                />
                            </TabsContent>
                            <TabsContent value="B-2">
                                <TabB2
                                    ref={tabB2Ref}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    invoice={filteredMasukan}
                                    retur={returns}
                                />
                            </TabsContent>
                            <TabsContent value="B-3">
                                <TabB3
                                    ref={tabB3Ref}
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    invoice={filteredMasukanUncredit}
                                    retur={filteredReturns}
                                    other={filteredOthersMasukan}
                                    returnsOthers={returnsOthers}
                                />
                            </TabsContent>
                            <TabsContent value="C">
                                <TabC
                                    user={{
                                        ...user,
                                        address: user.address ?? "",
                                        npwp: user.npwp ?? "",
                                    }}
                                    spt={{ ...spt, year: Number(spt.year) }}
                                    invoice={filteredInvoices}
                                    retur={filteredReturns}
                                    other={filteredOthersMasukan}
                                    returnsOthers={returnsOthers}
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
