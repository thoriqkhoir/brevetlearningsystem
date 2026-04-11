import { usePage, router, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import axios from "axios";
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
import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from "react";
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
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    FolderOpen,
    Info,
    Plus,
    Trash2,
    RefreshCw,
    X,
    Filter,
    FileText,
    FileSpreadsheet,
    FilePlus,
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
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import toast from "react-hot-toast";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/Components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/Components/ui/dialog";
import TabL1 from "./TablistOP/TabL1";
import TabL2 from "./TablistOP/TabL2";
import { TabL3A1, TabL3A2, TabL3A3 } from "./TablistOP/L3";
import TabL3A4 from "./TablistOP/L3A4/TabL3A4";
import TabL3B from "./TablistOP/L3B/TabL3B";
import TabL3C from "./TablistOP/L3C/TabL3C";
import TabL3D from "./TablistOP/L3D/TabL3D";
import TabL4A from "./TablistOP/L4/TabL4A";
import { TabL5 } from "./TablistOP/L5";

const SOURCE_INCOME_OPTIONS = [
    "kegiatan usaha",
    "pekerjaan",
    "pekerjaan bebas",
    "lainnya",
] as const;

type SourceIncome = (typeof SOURCE_INCOME_OPTIONS)[number];

const SOURCE_INCOME_LABEL: Record<SourceIncome, string> = {
    "kegiatan usaha": "Kegiatan Usaha",
    pekerjaan: "Pekerjaan",
    "pekerjaan bebas": "Pekerjaan Bebas",
    lainnya: "Lainnya",
};

const PTKP_MAP = {
    "K/0": 58500000,
    "K/1": 63000000,
    "K/2": 67500000,
    "K/3": 72000000,
    "K/I/0": 112500000,
    "K/I/1": 117000000,
    "K/I/2": 121500000,
    "K/I/3": 126000000,
    "TK/0": 54000000,
    "TK/1": 58500000,
    "TK/2": 63000000,
    "TK/3": 67500000,
    "-/-": 0,
} as const;

type PtkpStatus = keyof typeof PTKP_MAP;

const PTKP_STATUS_ORDER: PtkpStatus[] = [
    "K/0",
    "K/1",
    "K/2",
    "K/3",
    "K/I/0",
    "K/I/1",
    "K/I/2",
    "K/I/3",
    "TK/0",
    "TK/1",
    "TK/2",
    "TK/3",
    "-/-",
];

// Schema for SPT OP Induk
const sptOpIndukSchema = z
    .object({
        spt_id: z.string().uuid(),
        source_income: z
            .array(z.enum(SOURCE_INCOME_OPTIONS))
            .min(1, "Wajib dipilih"),
        type_of_bookkeeping: z.enum([
            "pembukuan stelsel akrual",
            "pembukuan stelsel kas",
            "pencatatan",
        ]),

        // B - Ikhtisar Penghasilan Neto
        b_1a: z.boolean().optional(),
        b_1a_value: z.number().int(),
        b_1b_1: z.boolean().optional(),
        b_1b_2: z.enum(["tidak", "ya1", "ya2"]).optional(),
        b_1b_3: z.enum(["tidak1", "tidak2", "ya"]).optional(),
        b_1b_4: z.enum(["dagang", "jasa", "industri"]).optional(),
        b_1b_5: z.number().int(),
        b_1c: z.boolean().optional(),
        b_1c_value: z.number().int(),
        b_1d: z.boolean().optional(),
        b_1d_value: z.number().int(),

        // C - Perhitungan Pajak Terutang
        c_2: z.number().int(),
        c_3: z.boolean().optional(),
        c_3_value: z.number().int(),
        c_4: z.number().int(),
        c_5: z
            .enum([
                "K/0",
                "K/1",
                "K/2",
                "K/3",
                "K/I/0",
                "K/I/1",
                "K/I/2",
                "K/I/3",
                "TK/0",
                "TK/1",
                "TK/2",
                "TK/3",
                "-/-",
            ])
            .optional(),
        c_6: z.number().int(),
        c_7: z.number().int(),
        c_8: z.boolean().optional(),
        c_8_value: z.number().int(),
        c_9: z.number().int(),

        // D - Kredit Pajak
        d_10_a: z.boolean().optional(),
        d_10_a_value: z.number().int(),
        d_10_b: z.number().int(),
        d_10_c: z.number().int(),
        d_10_d: z.boolean().optional(),
        d_10_d_value: z.number().int(),

        // E - PPH Kurang/Lebih Bayar
        e_11_a: z.number().int(),
        e_11_b: z.boolean().optional(),
        e_11_b_value: z.number().int(),
        e_11_c: z.number().int(),

        // F - Pembetulan
        f_12_a: z.number().int(),
        f_12_b: z.number().int(),

        // G - Permohonan Pengembalian
        g_pph: z
            .enum([
                "dikembalikan melalui pemeriksaan",
                "dikembalikan melalui permohonan pendahuluan",
            ])
            .optional(),
        account_number: z.string().nullable(),
        bank_name: z.string().nullable(),
        account_name: z.string().nullable(),

        // H - Angsuran PPh Pasal 25
        h_13_a: z.boolean().optional(),
        h_13_a_value: z.number().int(),
        h_13_b: z.boolean().optional(),
        h_13_b_value: z.number().int(),
        h_13_c: z.boolean().optional(),

        // I - Pernyataan Transaksi Lainnya
        i_14_a: z.number().int(),
        i_14_b: z.boolean().optional(),
        i_14_b_value: z.number().int(),
        i_14_c: z.boolean().optional(),
        i_14_c_value: z.number().int(),
        i_14_d: z.boolean().optional(),
        i_14_d_value: z.number().int(),
        i_14_e: z.boolean().optional(),
        i_14_e_value: z.number().int(),
        i_14_f: z.boolean().optional(),
        i_14_f_value: z.number().int(),
        i_14_g: z.boolean().optional(),
        i_14_h: z.number().int(),

        // J - Lampiran
        j_a: z.boolean().optional(),
        j_a_file: z.string().nullable(),
        j_b: z.boolean().optional(),
        j_b_file: z.string().nullable(),
        j_c: z.boolean().optional(),
        j_c_file: z.string().nullable(),
        j_d: z.boolean().optional(),
        j_d_file: z.string().nullable(),
        j_e: z.boolean().optional(),
        j_e_file: z.string().nullable(),

        // K - Penandatangan
        k_signer: z.enum(["taxpayer", "representative"]),
        k_signer_id: z.string().nullable(),
        k_signer_name: z.string().nullable(),

        // Additional fields
        password: z.string(),
        payment_method: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.b_1a === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["b_1a"],
                message: "Wajib dipilih",
            });
        }

        if (data.b_1b_1 === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["b_1b_1"],
                message: "Wajib dipilih",
            });
        }

        if (data.b_1b_1) {
            if (!data.b_1b_2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["b_1b_2"],
                    message: "Wajib dipilih",
                });
            }

            if (!data.b_1b_3) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["b_1b_3"],
                    message: "Wajib dipilih",
                });
            }

            if (data.b_1b_3 === "tidak1" && !data.b_1b_4) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["b_1b_4"],
                    message: "Wajib dipilih",
                });
            }
        }

        if (data.b_1c === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["b_1c"],
                message: "Wajib dipilih",
            });
        }

        if (data.b_1d === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["b_1d"],
                message: "Wajib dipilih",
            });
        }

        if (data.c_3 === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["c_3"],
                message: "Wajib dipilih",
            });
        }

        if (!data.c_5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["c_5"],
                message: "Wajib dipilih",
            });
        }

        if (data.c_8 === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["c_8"],
                message: "Wajib dipilih",
            });
        }

        if (data.d_10_a === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["d_10_a"],
                message: "Wajib dipilih",
            });
        }

        if (data.d_10_d === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["d_10_d"],
                message: "Wajib dipilih",
            });
        }

        if (data.e_11_b === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["e_11_b"],
                message: "Wajib dipilih",
            });
        }

        if (data.h_13_b === true && Number(data.h_13_b_value ?? 0) <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Wajib diisi",
                path: ["h_13_b_value"],
            });
        }

        const isLebihBayar =
            Number(data.e_11_a ?? 0) <= 0 || Number(data.f_12_b ?? 0) <= 0;
        if (isLebihBayar && !data.g_pph) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["g_pph"],
                message: "Wajib dipilih",
            });
        }

        if (data.h_13_a === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["h_13_a"],
                message: "Wajib dipilih",
            });
        }

        if (data.h_13_b === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["h_13_b"],
                message: "Wajib dipilih",
            });
        }

        if (data.h_13_c === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["h_13_c"],
                message: "Wajib dipilih",
            });
        }

        if (data.i_14_b === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["i_14_b"],
                message: "Wajib dipilih",
            });
        }

        if (data.i_14_c === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["i_14_c"],
                message: "Wajib dipilih",
            });
        }

        if (data.i_14_d === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["i_14_d"],
                message: "Wajib dipilih",
            });
        }

        const canAnswerI14EF =
            data.b_1b_1 === true &&
            (data.b_1b_2 === "ya1" || data.b_1b_2 === "ya2") &&
            data.b_1b_3 === "tidak1" &&
            !!data.b_1b_4;

        if (canAnswerI14EF && data.i_14_e === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["i_14_e"],
                message: "Wajib dipilih",
            });
        }

        if (canAnswerI14EF && data.i_14_f === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["i_14_f"],
                message: "Wajib dipilih",
            });
        }

        if (data.i_14_g === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["i_14_g"],
                message: "Wajib dipilih",
            });
        }
    });

const AUTO_SAVE_FIELDS = new Set<keyof z.infer<typeof sptOpIndukSchema>>([
    "source_income",
    "type_of_bookkeeping",
    "b_1a",
    "b_1b_1",
    "b_1b_2",
    "b_1b_3",
    "b_1b_4",
    "b_1c",
    "b_1d",
    "d_10_b",
    "c_3",
    "c_5",
    "c_8",
    "d_10_a",
    "d_10_c",
    "d_10_d",
    "d_10_d_value",
    "e_11_b",
    "e_11_b_value",
    "f_12_a",
    "h_13_a",
    "h_13_b",
    "h_13_c",
    "i_14_b",
    "i_14_c",
    "i_14_d",
    "i_14_e",
    "i_14_f",
    "i_14_g",
    "i_14_h",
    "j_a",
    "j_b",
    "j_c",
    "j_d",
    "j_e",
    "k_signer",
]);

interface MasterAccount {
    id: string;
    code: string;
    category: string;
    name: string;
}

interface MasterTku {
    id: string;
    name: string;
    code?: string;
}

interface MasterObject {
    id: string;
    code: string;
    name: string;
    kap: string;
}

interface Bank {
    id: string;
    user_id: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    account_type: "tabungan" | "giro" | "deposito";
    is_primary: boolean;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
}

interface LampiranData {
    l1a1: any[];
    l1a2: any[];
    l1a3: any[];
    l1a4: any[];
    l1a5: any[];
    l1a6: any[];
    l1a7: any[];
    l1b: any[];
    l1c: any[];
    l1d: any[];
    l1e: any[];
    l2a: any[];
    l2b: any[];
    l2c: any[];
    l3a13a1: any[];
    l3a13a2: any[];
    l3a4a: any[];
    l3a4b: any[];
    l3b: any[];
    l3c: any[];
    l3da: any[];
    l3db: any[];
    l3dc: any[];
    l4a: any;
    l5a: any[];
    l5bc: any[];
}

interface SptOpData {
    id: string;
    spt_id: string;
    source_income: string;
    source_incomes?: string[] | null;
    type_of_bookkeeping: string;
    b_1a: boolean | null;
    b_1a_value: number;
    b_1b_1: boolean | null;
    b_1b_2: string | null;
    b_1b_3: string | null;
    b_1b_4: string | null;
    b_1b_5: number;
    b_1c: boolean | null;
    b_1c_value: number;
    b_1d: boolean | null;
    b_1d_value: number;
    c_2: number;
    c_3: boolean | null;
    c_3_value: number;
    c_4: number;
    c_5: string | null;
    c_6: number;
    c_7: number;
    c_8: boolean | null;
    c_8_value: number;
    c_9: number;
    d_10_a: boolean | null;
    d_10_a_value: number;
    d_10_b: number;
    d_10_c: number;
    d_10_d: boolean | null;
    d_10_d_value: number;
    e_11_a: number;
    e_11_b: boolean | null;
    e_11_b_value: number;
    e_11_c: number;
    f_12_a: number;
    f_12_b: number;
    g_pph: string | null;
    account_number: string | null;
    bank_name: string | null;
    account_name: string | null;
    h_13_a: boolean | null;
    h_13_a_value: number;
    h_13_b: boolean | null;
    h_13_b_value: number;
    h_13_c: boolean | null;
    i_14_a: number;
    i_14_b: boolean | null;
    i_14_b_value: number;
    i_14_c: boolean | null;
    i_14_c_value: number;
    i_14_d: boolean | null;
    i_14_d_value: number;
    i_14_e: boolean | null;
    i_14_e_value: number;
    i_14_f: boolean | null;
    i_14_f_value: number;
    i_14_g: boolean | null;
    i_14_h: number;
    j_a: boolean | null;
    j_a_file: string | null;
    j_b: boolean | null;
    j_b_file: string | null;
    j_c: boolean | null;
    j_c_file: string | null;
    j_d: boolean | null;
    j_d_file: string | null;
    j_e: boolean | null;
    j_e_file: string | null;
    k_signer: string;
    k_signer_id: string | null;
    k_signer_name: string | null;
}

interface DetailSPTOPProps {
    spt: SPTColumns;
    sptOp: SptOpData | null;
    lampiranData: LampiranData | null;
    masterAccounts: MasterAccount[];
    masterTku: MasterTku[];
    masterObjects: MasterObject[];
    saldo: number;
    transactionNumber: string;
    banks: Bank[];
}

const DetailSPTOP = ({
    spt,
    sptOp,
    lampiranData,
    masterAccounts,
    masterTku,
    masterObjects,
    saldo,
    transactionNumber,
    banks: initialBanks,
}: DetailSPTOPProps) => {
    const user = usePage().props.auth.user;
    const { flash }: any = usePage().props;
    const [openModalPayment, setOpenModalPayment] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openBankModal, setOpenBankModal] = useState(false);
    const [banks, setBanks] = useState<Bank[]>(initialBanks || []);
    const [isLoadingBanks, setIsLoadingBanks] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [total, setTotal] = useState(0);
    const userSaldo = saldo ?? 0;
    const [pendingSubmit, setPendingSubmit] = useState<any>(null);
    const [pernyataanSetuju, setPernyataanSetuju] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("induk");
    const [spouseTaxStatus, setSpouseTaxStatus] = useState<string>("");
    const [spouseNpwp, setSpouseNpwp] = useState<string>("");
    const jAFileInputRef = useRef<HTMLInputElement>(null);
    const jBFileInputRef = useRef<HTMLInputElement>(null);
    const jCFileInputRef = useRef<HTMLInputElement>(null);
    const jDFileInputRef = useRef<HTMLInputElement>(null);
    const jEFileInputRef = useRef<HTMLInputElement>(null);
    const autoSaveTimeoutRef = useRef<number | null>(null);

    // Bank filter state
    const [bankFilters, setBankFilters] = useState({
        bank_name: "",
        account_number: "",
        account_type: "",
        description: "",
        start_date: "",
        end_date: "",
    });
    const ALL_OPTION = "__all";
    const [bankStartOpen, setBankStartOpen] = useState(false);
    const [bankEndOpen, setBankEndOpen] = useState(false);
    const minBankDate = new Date("1900-01-01");
    const maxBankDate = new Date("2100-12-31");

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const formatRupiah = (amount: number | string): string => {
        if (amount === null || amount === undefined || amount === "") return "";

        const number = typeof amount === "string" ? parseFloat(amount) : amount;

        if (isNaN(number) || number === 0) return "0";

        return number.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 20,
        });
    };

    const parseRupiah = (value: string): number => {
        if (!value) return 0;
        return parseInt(value.replace(/\./g, "").replace(/,/g, "")) || 0;
    };

    // Bank CRUD functions
    const fetchBanks = async () => {
        setIsLoadingBanks(true);
        try {
            const response = await axios.get("/api/banks");
            setBanks(response.data);
        } catch (error) {
            toast.error("Gagal memuat data bank");
        } finally {
            setIsLoadingBanks(false);
        }
    };

    const handleSelectBank = (bank: Bank) => {
        form.setValue("account_number", bank.account_number);
        form.setValue("bank_name", bank.bank_name);
        form.setValue("account_name", user.name || "");
        setOpenBankModal(false);
    };

    const filteredBanks = useMemo(() => {
        return banks.filter((bank) => {
            const matchBankName =
                !bankFilters.bank_name ||
                bank.bank_name
                    .toLowerCase()
                    .includes(bankFilters.bank_name.toLowerCase());
            const matchAccountNumber =
                !bankFilters.account_number ||
                bank.account_number.includes(bankFilters.account_number);
            const matchAccountType =
                !bankFilters.account_type ||
                bank.account_type === bankFilters.account_type;
            const matchDescription =
                !bankFilters.description ||
                (bank.description &&
                    bank.description
                        .toLowerCase()
                        .includes(bankFilters.description.toLowerCase()));
            const matchStartDate =
                !bankFilters.start_date ||
                (bank.start_date && bank.start_date >= bankFilters.start_date);
            const matchEndDate =
                !bankFilters.end_date ||
                (bank.end_date && bank.end_date <= bankFilters.end_date);

            return (
                matchBankName &&
                matchAccountNumber &&
                matchAccountType &&
                matchDescription &&
                matchStartDate &&
                matchEndDate
            );
        });
    }, [banks, bankFilters]);

    const resetBankFilters = () => {
        setBankFilters({
            bank_name: "",
            account_number: "",
            account_type: "",
            description: "",
            start_date: "",
            end_date: "",
        });
    };

    const sanitizeIndukPayload = (values: z.infer<typeof sptOpIndukSchema>) => {
        return values;
    };

    const form = useForm<z.infer<typeof sptOpIndukSchema>>({
        resolver: zodResolver(sptOpIndukSchema),
        defaultValues: {
            spt_id: spt.id,
            source_income:
                (sptOp?.source_incomes as any) ??
                ((sptOp?.source_income ? [sptOp.source_income] : []) as any),
            type_of_bookkeeping:
                (sptOp?.type_of_bookkeeping as any) ?? (undefined as any),

            b_1a: sptOp?.b_1a ?? undefined,
            b_1a_value: sptOp?.b_1a_value ?? 0,
            b_1b_1: sptOp?.b_1b_1 ?? undefined,
            b_1b_2: (sptOp?.b_1b_2 as any) ?? undefined,
            b_1b_3: (sptOp?.b_1b_3 as any) ?? undefined,
            b_1b_4: (sptOp?.b_1b_4 as any) ?? undefined,
            b_1b_5: sptOp?.b_1b_5 ?? 0,
            b_1c: sptOp?.b_1c ?? undefined,
            b_1c_value: sptOp?.b_1c_value ?? 0,
            b_1d: sptOp?.b_1d ?? undefined,
            b_1d_value: sptOp?.b_1d_value ?? 0,

            c_2: sptOp?.c_2 ?? 0,
            c_3: sptOp?.c_3 ?? undefined,
            c_3_value: sptOp?.c_3_value ?? 0,
            c_4: sptOp?.c_4 ?? 0,
            c_5: (sptOp?.c_5 as any) ?? undefined,
            c_6: sptOp?.c_6 ?? 0,
            c_7: sptOp?.c_7 ?? 0,
            c_8: sptOp?.c_8 ?? undefined,
            c_8_value: sptOp?.c_8_value ?? 0,
            c_9: sptOp?.c_9 ?? 0,

            d_10_a: sptOp?.d_10_a ?? undefined,
            d_10_a_value: sptOp?.d_10_a_value ?? 0,
            d_10_b: sptOp?.d_10_b ?? 0,
            d_10_c: sptOp?.d_10_c ?? 0,
            d_10_d: sptOp?.d_10_d ?? undefined,
            d_10_d_value: sptOp?.d_10_d_value ?? 0,

            e_11_a: sptOp?.e_11_a ?? 0,
            e_11_b: sptOp?.e_11_b ?? undefined,
            e_11_b_value: sptOp?.e_11_b_value ?? 0,
            e_11_c: sptOp?.e_11_c ?? 0,

            f_12_a: sptOp?.f_12_a ?? 0,
            f_12_b: sptOp?.f_12_b ?? 0,

            g_pph: (sptOp?.g_pph as any) ?? undefined,
            account_number: sptOp?.account_number ?? "",
            bank_name: sptOp?.bank_name ?? "",
            account_name: sptOp?.account_name ?? "",

            h_13_a: sptOp?.h_13_a ?? undefined,
            h_13_a_value: sptOp?.h_13_a_value ?? 0,
            h_13_b: sptOp?.h_13_b ?? undefined,
            h_13_b_value: sptOp?.h_13_b_value ?? 0,
            h_13_c: sptOp?.h_13_c ?? undefined,

            i_14_a: sptOp?.i_14_a ?? 0,
            i_14_b: sptOp?.i_14_b ?? undefined,
            i_14_b_value: sptOp?.i_14_b_value ?? 0,
            i_14_c: sptOp?.i_14_c ?? undefined,
            i_14_c_value: sptOp?.i_14_c_value ?? 0,
            i_14_d: sptOp?.i_14_d ?? undefined,
            i_14_d_value: sptOp?.i_14_d_value ?? 0,
            i_14_e: sptOp?.i_14_e ?? undefined,
            i_14_e_value: sptOp?.i_14_e_value ?? 0,
            i_14_f: sptOp?.i_14_f ?? undefined,
            i_14_f_value: sptOp?.i_14_f_value ?? 0,
            i_14_g: sptOp?.i_14_g ?? undefined,
            i_14_h: sptOp?.i_14_h ?? 0,

            j_a: sptOp?.j_a ?? undefined,
            j_a_file: sptOp?.j_a_file ?? "",
            j_b: sptOp?.j_b ?? undefined,
            j_b_file: sptOp?.j_b_file ?? "",
            j_c: sptOp?.j_c ?? undefined,
            j_c_file: sptOp?.j_c_file ?? "",
            j_d: sptOp?.j_d ?? undefined,
            j_d_file: sptOp?.j_d_file ?? "",
            j_e: sptOp?.j_e ?? undefined,
            j_e_file: sptOp?.j_e_file ?? "",

            k_signer: (sptOp?.k_signer as any) ?? "taxpayer",
            k_signer_id: sptOp?.k_signer_id ?? "",
            k_signer_name: sptOp?.k_signer_name ?? "",

            password: "",
            payment_method: "",
        },
    });

    const queueAutoSave = useCallback(
        (name: keyof z.infer<typeof sptOpIndukSchema>, value: unknown) => {
            if (!AUTO_SAVE_FIELDS.has(name)) return;
            if (value === undefined) return;

            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }

            autoSaveTimeoutRef.current = window.setTimeout(() => {
                // For source_income (array), send as source_incomes for backend compatibility
                const payload: Record<string, unknown> = { spt_id: spt.id };
                if (name === "source_income" && Array.isArray(value)) {
                    payload.source_incomes = value;
                    payload.source_income = value[0] ?? null;
                } else {
                    payload[name] = value;
                }

                // Use axios for background auto-save (handles CSRF automatically)
                axios.post(route("spt.saveOpDraft"), payload).catch(() => {
                    // Silently fail - no need to notify user for background auto-save
                });
            }, 300);
        },
        [spt.id],
    );

    const sektor = form.watch("b_1b_4") as
        | "dagang"
        | "jasa"
        | "industri"
        | undefined;

    // L2 requires: b_1d === Ya OR i_14_c === Ya OR i_14_d === Ya
    const isL2Enabled =
        form.watch("b_1d") === true ||
        form.watch("i_14_c") === true ||
        form.watch("i_14_d") === true;

    // Simpan watched values ke variabel agar bisa dipakai di dependency array
    const watchedB1B4 = form.watch("b_1b_4");
    const watchedB1C = form.watch("b_1c");

    const isGpphEnabled =
        (form.watch("e_11_a") ?? 0) <= 0 || (form.watch("f_12_b") ?? 0) <= 0;

    const isH13BEnabled = form.watch("h_13_a") === false;

    // Auto-fill b_1c_value dari total net income L3A4B
    const [l3a4bTotal, setL3a4bTotal] = useState<number>(() => {
        return (lampiranData?.l3a4b ?? []).reduce(
            (sum: number, item: any) =>
                sum + (Number(item?.net_income ?? 0) || 0),
            0,
        );
    });

    // Sync l3a4bTotal jika lampiranData berubah (misal setelah reload)
    useEffect(() => {
        const total = (lampiranData?.l3a4b ?? []).reduce(
            (sum: number, item: any) =>
                sum + (Number(item?.net_income ?? 0) || 0),
            0,
        );
        setL3a4bTotal(total);
    }, [lampiranData?.l3a4b]);

    // Update b_1c_value setiap kali l3a4bTotal berubah
    useEffect(() => {
        if (watchedB1C === true) {
            form.setValue("b_1c_value", l3a4bTotal);
        }
    }, [l3a4bTotal, watchedB1C]);

    // Auto-fill b_1b_5 dari Laba (Rugi) Sebelum Pajak berdasarkan b_1b_4
    useEffect(() => {
        if (!watchedB1B4) {
            form.setValue("b_1b_5", 0);
            return;
        }

        const rows: any[] = lampiranData?.l3a13a1 ?? [];
        const rowsByType = rows.filter(
            (r: any) => (r.type ?? "") === watchedB1B4,
        );

        const labaAccount = (masterAccounts ?? []).find(
            (acc) =>
                acc.name.toLowerCase().includes("laba") &&
                acc.name.toLowerCase().includes("sebelum pajak"),
        );

        if (!labaAccount) {
            form.setValue("b_1b_5", 0);
            return;
        }

        const labaRow = rowsByType.find(
            (r: any) => Number(r.account_id) === Number(labaAccount.id),
        );

        if (!labaRow) {
            form.setValue("b_1b_5", 0);
            return;
        }

        form.setValue("b_1b_5", Number(labaRow.fiscal_amount ?? 0));
    }, [watchedB1B4, lampiranData?.l3a13a1, masterAccounts]);

    // HAPUS dua useMemo ini (tidak terpakai, menyebabkan error):
    // const labaSebelumPajakAccount = useMemo(...)
    // const labaSebelumPajakFiskal = useMemo(...)

    // L3A-4 requires: b_1c === Ya OR b_1b_3 === "ya"
    const isL3A4Enabled =
        form.watch("b_1c") === true || form.watch("b_1b_3") === "ya";

    // L3B requires: (b_1b_2 === "ya1" OR b_1b_2 === "ya2") OR b_1b_3 === "ya"
    const isL3BEnabled =
        form.watch("b_1b_2") === "ya1" ||
        form.watch("b_1b_2") === "ya2" ||
        form.watch("b_1b_3") === "ya";

    const canAnswerI14EF =
        form.watch("b_1b_1") === true &&
        (form.watch("b_1b_2") === "ya1" || form.watch("b_1b_2") === "ya2") &&
        form.watch("b_1b_3") === "tidak1" &&
        !!sektor;
    const isL3CEnabled = canAnswerI14EF && form.watch("i_14_e") === true;
    const isL3DEnabled = canAnswerI14EF && form.watch("i_14_f") === true;
    const isL4Enabled = form.watch("h_13_b") === true;
    const isL5Enabled =
        form.watch("c_3") === true || form.watch("c_8") === true;

    const visibleTabs = useMemo(() => {
        const set = new Set<string>();
        set.add("induk");
        set.add("lampiran1");
        if (isL2Enabled) set.add("lampiran2");

        if (sektor === "dagang") set.add("lampiran3a1");
        if (sektor === "jasa") set.add("lampiran3a2");
        if (sektor === "industri") set.add("lampiran3a3");
        if (isL3A4Enabled) set.add("lampiran3a4");

        if (isL3BEnabled) set.add("lampiran3b");
        if (isL3CEnabled) set.add("lampiran3c");
        if (isL3DEnabled) set.add("lampiran3d");
        if (isL4Enabled) set.add("lampiran4");
        if (isL5Enabled) set.add("lampiran5");

        return set;
    }, [
        sektor,
        isL2Enabled,
        isL3A4Enabled,
        isL3BEnabled,
        isL3CEnabled,
        isL3DEnabled,
        isL4Enabled,
        isL5Enabled,
    ]);

    useEffect(() => {
        if (!canAnswerI14EF) {
            form.setValue("i_14_e", undefined);
            form.setValue("i_14_e_value", 0);
            form.setValue("i_14_f", undefined);
            form.setValue("i_14_f_value", 0);
        }
    }, [canAnswerI14EF]);

    useEffect(() => {
        if (!visibleTabs.has(activeTab)) {
            setActiveTab("induk");
        }
    }, [activeTab, visibleTabs]);

    useEffect(() => {
        const subscription = form.watch((values, info) => {
            if (!info.name) return;
            const name = info.name as keyof z.infer<typeof sptOpIndukSchema>;
            const value = (values as Record<string, unknown>)[name];
            queueAutoSave(name, value);
        });

        return () => subscription.unsubscribe();
    }, [form, queueAutoSave]);

    // Keep dependent answers consistent
    useEffect(() => {
        if (!form.watch("b_1b_1")) {
            form.setValue("b_1b_2", undefined);
            form.setValue("b_1b_3", undefined);
            form.setValue("b_1b_4", undefined);
            form.setValue("b_1b_5", 0);
            return;
        }

        if (form.watch("b_1b_3") !== "tidak1") {
            form.setValue("b_1b_4", undefined);
        }
    }, [form.watch("b_1b_1"), form.watch("b_1b_3")]);

    // Keep D section answers consistent
    useEffect(() => {
        if (form.watch("d_10_a") !== true) {
            form.setValue("d_10_a_value", 0);
        }

        if (form.watch("d_10_d") !== true) {
            form.setValue("d_10_d_value", 0);
        }
    }, [form.watch("d_10_a"), form.watch("d_10_d")]);

    // Keep E section answers consistent
    useEffect(() => {
        if (form.watch("e_11_b") !== true) {
            form.setValue("e_11_b_value", 0);
        }
    }, [form.watch("e_11_b")]);

    // Auto-calculate F section
    useEffect(() => {
        const e_11_a = form.watch("e_11_a") || 0;
        const f_12_a = form.watch("f_12_a") || 0;
        form.setValue("f_12_b", e_11_a - f_12_a);
    }, [form.watch("e_11_a"), form.watch("f_12_a")]);

    // Keep H section answers consistent
    useEffect(() => {
        if (form.watch("h_13_a") !== true) {
            form.setValue("h_13_a_value", 0);
        }

        if (form.watch("h_13_b") !== true) {
            form.setValue("h_13_b_value", 0);
        }
    }, [form.watch("h_13_a"), form.watch("h_13_b")]);

    // If 13a is not "tidak", lock 13b
    useEffect(() => {
        if (form.watch("h_13_a") !== false) {
            form.setValue("h_13_b", undefined);
            form.setValue("h_13_b_value", 0);
        }
    }, [form.watch("h_13_a")]);

    // Sync H.13.b value from Lampiran 4A (angsuran) so it updates without refresh
    useEffect(() => {
        const installments = Number(lampiranData?.l4a?.tax_installments ?? 0);
        form.setValue("h_13_b_value", installments);
    }, [lampiranData?.l4a?.tax_installments]);

    // Auto-calculate H.13.a value = 1/12 x (C.9 - D.10.a)
    useEffect(() => {
        if (form.watch("h_13_a") === true) {
            const c_9 = form.watch("c_9") || 0;
            const d_10_a_value = form.watch("d_10_a")
                ? form.watch("d_10_a_value") || 0
                : 0;
            const computed = (c_9 - d_10_a_value) / 12;
            const rounded = Math.round(computed);
            form.setValue("h_13_a_value", rounded > 0 ? rounded : 0);
        }
    }, [
        form.watch("h_13_a"),
        form.watch("c_9"),
        form.watch("d_10_a"),
        form.watch("d_10_a_value"),
    ]);

    // Keep J section answers consistent
    useEffect(() => {
        const resetFileField = (
            answer: boolean | null | undefined,
            field:
                | "j_a_file"
                | "j_b_file"
                | "j_c_file"
                | "j_d_file"
                | "j_e_file",
            ref?: React.RefObject<HTMLInputElement>,
        ) => {
            if (answer === true) return;
            form.setValue(field, "");
            if (ref?.current) {
                ref.current.value = "";
            }
        };

        resetFileField(form.watch("j_a"), "j_a_file", jAFileInputRef);
        resetFileField(form.watch("j_b"), "j_b_file", jBFileInputRef);
        resetFileField(form.watch("j_c"), "j_c_file", jCFileInputRef);
        resetFileField(form.watch("j_d"), "j_d_file", jDFileInputRef);
        resetFileField(form.watch("j_e"), "j_e_file", jEFileInputRef);
    }, [
        form.watch("j_a"),
        form.watch("j_b"),
        form.watch("j_c"),
        form.watch("j_d"),
        form.watch("j_e"),
    ]);

    // Keep I section answers consistent
    useEffect(() => {
        if (form.watch("i_14_b") !== true) {
            form.setValue("i_14_b_value", 0);
        }
        if (form.watch("i_14_c") !== true) {
            form.setValue("i_14_c_value", 0);
        }
        if (form.watch("i_14_d") !== true) {
            form.setValue("i_14_d_value", 0);
        }
        if (form.watch("i_14_e") !== true) {
            form.setValue("i_14_e_value", 0);
        }
        if (form.watch("i_14_f") !== true) {
            form.setValue("i_14_f_value", 0);
        }
    }, [
        form.watch("i_14_b"),
        form.watch("i_14_c"),
        form.watch("i_14_d"),
        form.watch("i_14_e"),
        form.watch("i_14_f"),
    ]);

    // Auto-fill I.14a and I.14b value from lampiran totals
    useEffect(() => {
        const sumField = (items: any[] | undefined, field: string) =>
            items?.reduce(
                (sum, item) => sum + (Number(item?.[field] ?? 0) || 0),
                0,
            ) ?? 0;

        const acquisitionFromTables =
            sumField(lampiranData?.l1a1, "integer") +
            sumField(lampiranData?.l1a2, "amount") +
            sumField(lampiranData?.l1a3, "acquisition_cost") +
            sumField(lampiranData?.l1a4, "acquisition_cost") +
            sumField(lampiranData?.l1a5, "acquisition_cost") +
            sumField(lampiranData?.l1a6, "acquisition_cost");

        const totalHarta = Number(
            lampiranData?.l1a7?.[0]?.acquisition_cost ?? acquisitionFromTables,
        );

        const totalKewajiban =
            lampiranData?.l1b?.reduce(
                (sum, item) =>
                    sum + Number(item?.balance ?? item?.remaining_value ?? 0),
                0,
            ) || 0;

        form.setValue("i_14_a", totalHarta);
        if (form.watch("i_14_b") === true) {
            form.setValue("i_14_b_value", totalKewajiban);
        }
    }, [lampiranData, form.watch("i_14_b")]);

    // Auto-fill I.14c value from Lampiran 2 Bagian A (L2A) total DPP
    useEffect(() => {
        if (form.watch("i_14_c") !== true) return;

        const totalDppL2A =
            lampiranData?.l2a?.reduce(
                (sum, item) => sum + (Number(item?.dpp ?? 0) || 0),
                0,
            ) ?? 0;

        form.setValue("i_14_c_value", totalDppL2A);
    }, [lampiranData, form.watch("i_14_c")]);

    // Auto-fill I.14d value from Lampiran 2 Bagian B (L2B) total penghasilan bruto
    useEffect(() => {
        if (form.watch("i_14_d") !== true) return;

        const totalGrossIncomeL2B =
            lampiranData?.l2b?.reduce(
                (sum, item) => sum + (Number(item?.gross_income ?? 0) || 0),
                0,
            ) ?? 0;

        form.setValue("i_14_d_value", totalGrossIncomeL2B);
    }, [lampiranData, form.watch("i_14_d")]);

    useEffect(() => {
        form.setValue("b_1a_value", Number(sptOp?.b_1a_value ?? 0));
    }, [sptOp?.b_1a_value]);

    // Auto-set J.A = true ketika type_of_bookkeeping mengandung "pembukuan"
    // DAN b_1b_3 mengandung "tidak1" (menyelenggarakan pembukuan)
    useEffect(() => {
        const bookkeeping = form.watch("type_of_bookkeeping") ?? "";
        const b1b3 = form.watch("b_1b_3") ?? "";
        const isPembukuan =
            bookkeeping.toLowerCase().includes("pembukuan") &&
            b1b3.toLowerCase().includes("tidak1");

        if (isPembukuan && form.getValues("j_a") !== true) {
            form.setValue("j_a", true);
        }
    }, [form.watch("type_of_bookkeeping"), form.watch("b_1b_3")]);

    // Auto-fill B.1d value from Lampiran 2 Bagian C (L2C) total net income
    useEffect(() => {
        const totalNetIncomeL2C =
            lampiranData?.l2c?.reduce(
                (sum, item) => sum + (Number(item?.net_income ?? 0) || 0),
                0,
            ) ?? 0;

        form.setValue("b_1d_value", totalNetIncomeL2C);
    }, [lampiranData]);

    // Auto-fill C.3 and C.3 value from Lampiran 5B (L5BC type_of_reducer === 'neto')
    useEffect(() => {
        const totalNeto =
            lampiranData?.l5bc
                ?.filter((item) => item?.type_of_reducer === "neto")
                ?.reduce(
                    (sum, item) =>
                        sum + (Number(item?.amount_of_reducer ?? 0) || 0),
                    0,
                ) ?? 0;

        if (totalNeto > 0 && form.getValues("c_3") !== true) {
            form.setValue("c_3", true);
        }

        form.setValue("c_3_value", totalNeto);
    }, [lampiranData]);

    // Auto-fill C.8 and C.8 value from Lampiran 5C (L5BC type_of_reducer === 'pph')
    useEffect(() => {
        const totalPph =
            lampiranData?.l5bc
                ?.filter((item) => item?.type_of_reducer === "pph")
                ?.reduce(
                    (sum, item) =>
                        sum + (Number(item?.amount_of_reducer ?? 0) || 0),
                    0,
                ) ?? 0;

        if (totalPph > 0 && form.getValues("c_8") !== true) {
            form.setValue("c_8", true);
        }

        form.setValue("c_8_value", totalPph);
    }, [lampiranData]);

    // Auto-fill D.10a value from Lampiran 1 Bagian E (L1E) total PPh dipotong/dipungut
    useEffect(() => {
        const totalPphDipungutL1E =
            lampiranData?.l1e?.reduce(
                (sum, item) => sum + (Number(item?.amount ?? 0) || 0),
                0,
            ) ?? 0;

        // Auto-set d_10_a to true if there are L1E entries
        if (totalPphDipungutL1E > 0 && form.getValues("d_10_a") !== true) {
            form.setValue("d_10_a", true);
        }

        // Only update value when d_10_a is true
        if (form.getValues("d_10_a") === true) {
            form.setValue("d_10_a_value", totalPphDipungutL1E);
        }
    }, [lampiranData]);

    // Auto-calculate C section based on B section values
    useEffect(() => {
        const b_1a_value = form.watch("b_1a") ? form.watch("b_1a_value") : 0;
        const b_1b_5 = form.watch("b_1b_1") ? form.watch("b_1b_5") : 0;
        const b_1c_value = form.watch("b_1c") ? form.watch("b_1c_value") : 0;
        const b_1d_value = form.watch("b_1d") ? form.watch("b_1d_value") : 0;

        // C.2 = Total penghasilan neto
        const totalPenghasilanNeto =
            b_1a_value + b_1b_5 + b_1c_value + b_1d_value;
        form.setValue("c_2", totalPenghasilanNeto);
    }, [
        form.watch("b_1a"),
        form.watch("b_1a_value"),
        form.watch("b_1b_1"),
        form.watch("b_1b_5"),
        form.watch("b_1c"),
        form.watch("b_1c_value"),
        form.watch("b_1d"),
        form.watch("b_1d_value"),
    ]);

    // Auto-calculate PPH Terutang
    useEffect(() => {
        const c_2 = form.watch("c_2") || 0;
        const c_3_value = form.watch("c_3") ? form.watch("c_3_value") : 0;

        // C.4 = C.2 - C.3
        const c_4 = c_2 - c_3_value;
        form.setValue("c_4", c_4);

        // C.5 = PTKP (simplified, should be calculated based on status)
        // For now, we'll leave it as user input

        // C.6 = C.4 - C.5 (lookup PTKP value from label)
        const c_5_label = form.watch("c_5") as PtkpStatus | undefined;
        const c_5_value = c_5_label ? (PTKP_MAP[c_5_label] ?? 0) : 0;
        const c_6 = c_4 - c_5_value;
        form.setValue("c_6", Math.max(0, c_6));

        // C.7 = PPh Terutang (calculated based on tarif)
        // Simplified progressive tax rate calculation
        const pkp = Math.max(0, c_6);
        let pph = 0;
        if (pkp <= 60000000) {
            pph = pkp * 0.05;
        } else if (pkp <= 250000000) {
            pph = 60000000 * 0.05 + (pkp - 60000000) * 0.15;
        } else if (pkp <= 500000000) {
            pph = 60000000 * 0.05 + 190000000 * 0.15 + (pkp - 250000000) * 0.25;
        } else if (pkp <= 5000000000) {
            pph =
                60000000 * 0.05 +
                190000000 * 0.15 +
                250000000 * 0.25 +
                (pkp - 500000000) * 0.3;
        } else {
            pph =
                60000000 * 0.05 +
                190000000 * 0.15 +
                250000000 * 0.25 +
                4500000000 * 0.3 +
                (pkp - 5000000000) * 0.35;
        }
        form.setValue("c_7", Math.round(pph));

        // C.9 = C.7 - C.8 (if C.8 is checked)
        const c_8_value = form.watch("c_8") ? form.watch("c_8_value") : 0;
        form.setValue("c_9", Math.round(pph) - c_8_value);
    }, [
        form.watch("c_2"),
        form.watch("c_3"),
        form.watch("c_3_value"),
        form.watch("c_5"),
        form.watch("c_8"),
        form.watch("c_8_value"),
    ]);

    // Auto-calculate E section
    useEffect(() => {
        const c_9 = form.watch("c_9") || 0;
        const d_10_a_value = form.watch("d_10_a")
            ? form.watch("d_10_a_value")
            : 0;
        const d_10_b = form.watch("d_10_b") || 0;
        const d_10_c = form.watch("d_10_c") || 0;
        const d_10_d_value = form.watch("d_10_d")
            ? form.watch("d_10_d_value")
            : 0;

        const totalKreditPengurang = d_10_a_value + d_10_b + d_10_c;
        const totalKreditPenambah = d_10_d_value;

        // E.11.a = PPh Kurang/Lebih Bayar (10d menambah kredit)
        const e_11_a = c_9 - totalKreditPengurang + totalKreditPenambah;
        form.setValue("e_11_a", e_11_a);

        // E.11.c = hasil akhir
        const e_11_b_value = form.watch("e_11_b")
            ? form.watch("e_11_b_value")
            : 0;
        form.setValue("e_11_c", e_11_a - e_11_b_value);
    }, [
        form.watch("c_9"),
        form.watch("d_10_a"),
        form.watch("d_10_a_value"),
        form.watch("d_10_b"),
        form.watch("d_10_c"),
        form.watch("d_10_d"),
        form.watch("d_10_d_value"),
        form.watch("e_11_b"),
        form.watch("e_11_b_value"),
    ]);

    // Set total for payment
    useEffect(() => {
        const pphKurangBayar = form.watch("e_11_c");
        setTotal(Math.max(0, pphKurangBayar || 0));
    }, [form.watch("e_11_c")]);

    const handleSaveDraft = () => {
        const formData = sanitizeIndukPayload(form.getValues());
        router.post(
            route("spt.saveOpDraft"),
            { ...formData },
            {
                onSuccess: () => {
                    toast.success("SPT OP berhasil disimpan sebagai draft");
                },
                onError: (errors) => {
                    toast.error(
                        "Gagal menyimpan draft: " +
                            Object.values(errors).join(", "),
                    );
                },
            },
        );
    };

    // Auto-fill b_1b_5 dari Laba (Rugi) Sebelum Pajak berdasarkan b_1b_4
    useEffect(() => {
        if (!watchedB1B4) {
            form.setValue("b_1b_5", 0);
            return;
        }

        const rows: any[] = lampiranData?.l3a13a1 ?? [];
        const rowsByType = rows.filter(
            (r: any) => (r.type ?? "") === watchedB1B4,
        );

        const labaAccount = (masterAccounts ?? []).find(
            (acc) =>
                acc.name.toLowerCase().includes("laba") &&
                acc.name.toLowerCase().includes("sebelum pajak"),
        );

        if (!labaAccount) {
            form.setValue("b_1b_5", 0);
            return;
        }

        const labaRow = rowsByType.find(
            (r: any) => Number(r.account_id) === Number(labaAccount.id),
        );

        if (!labaRow) {
            form.setValue("b_1b_5", 0);
            return;
        }

        form.setValue("b_1b_5", Number(labaRow.fiscal_amount ?? 0));
    }, [watchedB1B4, lampiranData?.l3a13a1, masterAccounts]);

    // Update b_1c_value setiap kali l3a4bTotal berubah
    useEffect(() => {
        if (watchedB1C === true) {
            form.setValue("b_1c_value", l3a4bTotal);
        }
    }, [l3a4bTotal, watchedB1C]);

    const onSubmit = (data: z.infer<typeof sptOpIndukSchema>) => {
        if (data.b_1a === true && (lampiranData?.l1d?.length ?? 0) === 0) {
            toast.error(
                "Lampiran I Bagian D wajib diisi jika menjawab Ya pada B.1.a.",
            );
            return;
        }

        if (!pernyataanSetuju) {
            toast.error("Anda harus menyetujui pernyataan terlebih dahulu");
            return;
        }

        const pphKurangBayar = Number(data.e_11_c ?? 0);
        const paymentTotal = Math.max(0, pphKurangBayar);

        // Set total synchronously before opening dialog
        setTotal(paymentTotal);
        setPendingSubmit(sanitizeIndukPayload(data));

        if (pphKurangBayar > 0) {
            setOpenModalPayment(true);
        } else {
            setOpenPasswordModal(true);
        }
    };

    const handlePaymentConfirm = (method: string) => {
        setPaymentMethod(method);
        setOpenModalPayment(false);
        setOpenPasswordModal(true);
    };

    const handlePasswordConfirm = (password: string) => {
        if (!pendingSubmit) return;

        const formatDate = (dateStr: any): string => {
            if (!dateStr) return "";
            try {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return "";
                return date.toISOString().split("T")[0];
            } catch {
                return "";
            }
        };

        const generateBillingCode = () =>
            Math.floor(100000000000000 + Math.random() * 900000000000000).toString();

        const numberToWords = (num: number): string => {
            const units = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];
            const teens = ["sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas"];
            const tens = ["", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh", "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh"];
            const thousands = ["", "ribu", "juta", "miliar", "triliun"];
            if (num === 0) return "Nol Rupiah";
            let words = "";
            let i = 0;
            let n = num;
            while (n > 0) {
                const chunk = n % 1000;
                if (chunk > 0) {
                    let chunkWords = "";
                    const hundreds = Math.floor(chunk / 100);
                    const remainder = chunk % 100;
                    if (hundreds > 0) chunkWords += hundreds === 1 ? "seratus " : `${units[hundreds]} ratus `;
                    if (remainder > 0) {
                        if (remainder < 10) chunkWords += units[remainder];
                        else if (remainder < 20) chunkWords += teens[remainder - 10];
                        else chunkWords += `${tens[Math.floor(remainder / 10)]} ${units[remainder % 10]}`;
                    }
                    if (i === 1 && chunk === 1) chunkWords = "seribu";
                    else chunkWords += ` ${thousands[i]}`;
                    words = `${chunkWords.trim()} ${words}`.trim();
                }
                n = Math.floor(n / 1000);
                i++;
            }
            return words.trim().replace(/\s+/g, " ").split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Rupiah";
        };

        const amount = Math.max(0, Number(pendingSubmit.e_11_c ?? 0));

        const submitData = {
            ...pendingSubmit,
            password,
            payment_method: paymentMethod,
            transaction_number: transactionNumber,
            total_payment: amount,
            billing_data: {
                billing_type_id: 56,
                start_period: spt.start_period,
                end_period: spt.end_period,
                year: spt.year,
                currency: "IDR",
                amount,
                amount_in_words: numberToWords(amount),
                description: "",
                status: "unpaid",
                active_period: formatDate(
                    new Date(new Date().setDate(new Date().getDate() + 7)),
                ),
                code: generateBillingCode(),
            },
            ledger_data: {
                billing_type_id: 56,
                transaction_date: formatDate(new Date()),
                posting_date: formatDate(new Date()),
                accounting_type: "surat pemberitahuan",
                accounting_type_detail:
                    spt.correction_number === 1
                        ? "spt pembetulan"
                        : "spt normal",
                currency: "IDR",
                transaction_type: "debit",
                debit_amount: amount,
                debit_unpaid: 0,
                credit_amount: 0,
                credit_left: 0,
                kap: "411125",
                kap_description: "PPh Orang Pribadi",
                kjs: "200",
                tax_period: spt.start_period + " " + spt.year,
                transaction_number: transactionNumber,
            },
        };

        router.post(route("spt.storeOp"), submitData, {
            onSuccess: () => {
                toast.success("SPT OP berhasil dikirim");
                setOpenPasswordModal(false);
            },
            onError: (errors) => {
                if (errors.password) {
                    toast.error("Password salah");
                } else {
                    toast.error(
                        "Gagal mengirim SPT: " +
                            Object.values(errors).join(", "),
                    );
                }
            },
        });
    };

    type JFileField = "j_a_file" | "j_b_file" | "j_c_file" | "j_d_file" | "j_e_file";

    const [jFileUploading, setJFileUploading] = useState<Record<JFileField, boolean>>({
        j_a_file: false,
        j_b_file: false,
        j_c_file: false,
        j_d_file: false,
        j_e_file: false,
    });

    const [jFileNames, setJFileNames] = useState<Record<JFileField, string>>({
        j_a_file: sptOp?.j_a_file ? sptOp.j_a_file.split("/").pop() ?? "" : "",
        j_b_file: sptOp?.j_b_file ? sptOp.j_b_file.split("/").pop() ?? "" : "",
        j_c_file: sptOp?.j_c_file ? sptOp.j_c_file.split("/").pop() ?? "" : "",
        j_d_file: sptOp?.j_d_file ? sptOp.j_d_file.split("/").pop() ?? "" : "",
        j_e_file: sptOp?.j_e_file ? sptOp.j_e_file.split("/").pop() ?? "" : "",
    });

    const getJFileRef = (field: JFileField) => {
        if (field === "j_a_file") return jAFileInputRef;
        if (field === "j_b_file") return jBFileInputRef;
        if (field === "j_c_file") return jCFileInputRef;
        if (field === "j_d_file") return jDFileInputRef;
        return jEFileInputRef;
    };

    const uploadJAttachment = async (field: JFileField, file: File) => {
        if (!sptOp?.id) {
            toast.error("Data SPT OP belum siap");
            return;
        }

        if (file.type !== "application/pdf") {
            toast.error("File harus PDF");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Ukuran file maksimal 10MB");
            return;
        }

        setJFileUploading((prev) => ({ ...prev, [field]: true }));

        try {
            const formData = new FormData();
            formData.append("spt_op_id", String(sptOp.id));
            formData.append("field", field);
            formData.append("file", file);

            const response = await axios.post(route("spt.op.upload-attachment"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const path = response.data?.path ?? "";
            const originalName = response.data?.original_name ?? file.name;

            form.setValue(field, path);
            setJFileNames((prev) => ({ ...prev, [field]: originalName }));
            toast.success("File berhasil diupload");
        } catch {
            toast.error("Gagal upload file");
        } finally {
            setJFileUploading((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleJFileChange = async (
        field: JFileField,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        await uploadJAttachment(field, selectedFile);
    };


    return (
        <Authenticated>
            <Head title="Detail SPT PPh Orang Pribadi" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("spt.konsep")}>
                                    SPT Konsep
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Detail SPT PPh Orang Pribadi
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary mb-2">
                        SPT TAHUNAN PAJAK PENGHASILAN (PPh) WAJIB PAJAK ORANG
                        PRIBADI
                    </h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                const firstError = Object.values(errors)[0];
                                const message =
                                    firstError && "message" in firstError
                                        ? (firstError as any).message
                                        : "Ada field yang belum diisi dengan benar";
                                toast.error(String(message));
                            })}>
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="flex flex-wrap justify-start gap-2 h-auto">
                                    <TabsTrigger value="induk">
                                        Induk
                                    </TabsTrigger>
                                    <TabsTrigger value="lampiran1">
                                        L-1
                                    </TabsTrigger>
                                    {isL2Enabled ? (
                                        <TabsTrigger value="lampiran2">
                                            L-2
                                        </TabsTrigger>
                                    ) : null}
                                    {sektor === "dagang" ? (
                                        <TabsTrigger
                                            key="l3a1"
                                            value="lampiran3a1"
                                        >
                                            L-3A-1
                                        </TabsTrigger>
                                    ) : null}
                                    {sektor === "jasa" ? (
                                        <TabsTrigger
                                            key="l3a2"
                                            value="lampiran3a2"
                                        >
                                            L-3A-2
                                        </TabsTrigger>
                                    ) : null}
                                    {sektor === "industri" ? (
                                        <TabsTrigger
                                            key="l3a3"
                                            value="lampiran3a3"
                                        >
                                            L-3A-3
                                        </TabsTrigger>
                                    ) : null}
                                    {isL3A4Enabled ? (
                                        <TabsTrigger value="lampiran3a4">
                                            L-3A-4
                                        </TabsTrigger>
                                    ) : null}
                                    {isL3BEnabled ? (
                                        <TabsTrigger value="lampiran3b">
                                            L-3B
                                        </TabsTrigger>
                                    ) : null}
                                    {isL3CEnabled ? (
                                        <TabsTrigger value="lampiran3c">
                                            L-3C
                                        </TabsTrigger>
                                    ) : null}
                                    {isL3DEnabled ? (
                                        <TabsTrigger value="lampiran3d">
                                            L-3D
                                        </TabsTrigger>
                                    ) : null}
                                    {isL4Enabled ? (
                                        <TabsTrigger value="lampiran4">
                                            L-4
                                        </TabsTrigger>
                                    ) : null}
                                    {isL5Enabled ? (
                                        <TabsTrigger value="lampiran5">
                                            L-5
                                        </TabsTrigger>
                                    ) : null}
                                </TabsList>

                                {/* TAB INDUK */}
                                <TabsContent value="induk">
                                    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                                        {/* HEADER */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="header"
                                        >
                                            <AccordionItem value="header">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        {/* Left column */}
                                                        <div className="space-y-4">
                                                            <div>
                                                                <Label>
                                                                    Tahun
                                                                    Pajak/Bagian
                                                                    Tahun Pajak
                                                                </Label>
                                                                <Input
                                                                    className="mt-2"
                                                                    value={
                                                                        spt.year
                                                                    }
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>
                                                                    Periode
                                                                    Pembukuan
                                                                </Label>
                                                                <div className="mt-2 flex gap-3 max-w-xs">
                                                                    <Input
                                                                        value={
                                                                            spt.start_period
                                                                        }
                                                                        disabled
                                                                        readOnly
                                                                    />
                                                                    <Input
                                                                        value={
                                                                            spt.end_period
                                                                        }
                                                                        disabled
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Middle column */}
                                                        <div className="space-y-4">
                                                            <div>
                                                                <Label>
                                                                    Status
                                                                </Label>
                                                                <Input
                                                                    className="mt-2"
                                                                    value={
                                                                        spt.correction_number ===
                                                                        0
                                                                            ? "Normal"
                                                                            : "Pembetulan"
                                                                    }
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </div>

                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="source_income"
                                                                render={({
                                                                    field,
                                                                }) => {
                                                                    const value =
                                                                        (field.value as SourceIncome[]) ??
                                                                        [];
                                                                    const selectedLabel =
                                                                        value.length
                                                                            ? value
                                                                                  .map(
                                                                                      (
                                                                                          v,
                                                                                      ) =>
                                                                                          SOURCE_INCOME_LABEL[
                                                                                              v
                                                                                          ],
                                                                                  )
                                                                                  .join(
                                                                                      ", ",
                                                                                  )
                                                                            : "";

                                                                    const toggle =
                                                                        (
                                                                            option: SourceIncome,
                                                                        ) => {
                                                                            const next =
                                                                                value.includes(
                                                                                    option,
                                                                                )
                                                                                    ? value.filter(
                                                                                          (
                                                                                              v,
                                                                                          ) =>
                                                                                              v !==
                                                                                              option,
                                                                                      )
                                                                                    : [
                                                                                          ...value,
                                                                                          option,
                                                                                      ];
                                                                            field.onChange(
                                                                                next,
                                                                            );
                                                                        };

                                                                    return (
                                                                        <FormItem>
                                                                            <FormLabel>
                                                                                Sumber
                                                                                Penghasilan{" "}
                                                                                <span className="text-destructive">
                                                                                    *
                                                                                </span>
                                                                            </FormLabel>

                                                                            <Popover>
                                                                                <PopoverTrigger
                                                                                    asChild
                                                                                >
                                                                                    <FormControl>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            role="combobox"
                                                                                            className={cn(
                                                                                                "mt-2 w-full justify-between",
                                                                                                !selectedLabel &&
                                                                                                    "text-muted-foreground",
                                                                                                "whitespace-normal break-words",
                                                                                            )}
                                                                                        >
                                                                                            <span className="truncate">
                                                                                                {selectedLabel ||
                                                                                                    "Pilih sumber penghasilan"}
                                                                                            </span>
                                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                                        </Button>
                                                                                    </FormControl>
                                                                                </PopoverTrigger>

                                                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                                                    <Command>
                                                                                        <CommandInput placeholder="Cari sumber penghasilan..." />
                                                                                        <CommandEmpty>
                                                                                            Tidak
                                                                                            ada
                                                                                            data.
                                                                                        </CommandEmpty>
                                                                                        <CommandGroup>
                                                                                            {SOURCE_INCOME_OPTIONS.map(
                                                                                                (
                                                                                                    option,
                                                                                                ) => {
                                                                                                    const selected =
                                                                                                        value.includes(
                                                                                                            option,
                                                                                                        );
                                                                                                    return (
                                                                                                        <CommandItem
                                                                                                            key={
                                                                                                                option
                                                                                                            }
                                                                                                            value={
                                                                                                                option
                                                                                                            }
                                                                                                            onSelect={() =>
                                                                                                                toggle(
                                                                                                                    option,
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <Check
                                                                                                                className={cn(
                                                                                                                    "mr-2 h-4 w-4",
                                                                                                                    selected
                                                                                                                        ? "opacity-100"
                                                                                                                        : "opacity-0",
                                                                                                                )}
                                                                                                            />
                                                                                                            {
                                                                                                                SOURCE_INCOME_LABEL[
                                                                                                                    option
                                                                                                                ]
                                                                                                            }
                                                                                                        </CommandItem>
                                                                                                    );
                                                                                                },
                                                                                            )}
                                                                                        </CommandGroup>
                                                                                    </Command>
                                                                                </PopoverContent>
                                                                            </Popover>

                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    );
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Right column */}
                                                        <div className="space-y-4">
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="type_of_bookkeeping"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Metode
                                                                            Pembukuan/Pencatatan
                                                                        </FormLabel>
                                                                        <Select
                                                                            onValueChange={
                                                                                field.onChange
                                                                            }
                                                                            defaultValue={
                                                                                field.value
                                                                            }
                                                                        >
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Pilih metode" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                <SelectItem value="pembukuan stelsel akrual">
                                                                                    Pembukuan
                                                                                    Stelsel
                                                                                    Akrual
                                                                                </SelectItem>
                                                                                <SelectItem value="pembukuan stelsel kas">
                                                                                    Pembukuan
                                                                                    Stelsel
                                                                                    Kas
                                                                                </SelectItem>
                                                                                <SelectItem value="pencatatan">
                                                                                    Pencatatan
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="pt-6">
                                                        <Button
                                                            type="button"
                                                            className="bg-blue-950 hover:bg-blue-900"
                                                            onClick={() =>
                                                                toast.error(
                                                                    "Fitur Posting SPT belum diaktifkan di halaman ini.",
                                                                )
                                                            }
                                                        >
                                                            Posting SPT
                                                        </Button>
                                                        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
                                                            Klik tombol "Posting
                                                            SPT" untuk
                                                            menampilkan data
                                                            perpajakan Anda
                                                            (Harta, Utang,
                                                            Daftar Anggota
                                                            Keluarga, Bukti
                                                            Potong PPh,
                                                            Pembayaran, dan
                                                            lainnya). Posting
                                                            belum pernah
                                                            dilakukan
                                                        </p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* A. IDENTITAS WAJIB PAJAK */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="identitas"
                                        >
                                            <AccordionItem value="identitas">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    A. IDENTITAS WAJIB PAJAK
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4 space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                1. NIK/NPWP{" "}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    user.npwp ||
                                                                    ""
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                2. NAMA{" "}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    user.name ||
                                                                    ""
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                3. JENIS ID{" "}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                value="KTP"
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                4. NO. ID{" "}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    user.npwp ||
                                                                    ""
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                5. NO. TELEPON{" "}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    user.phone_number ||
                                                                    ""
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                6. EMAIL{" "}
                                                                <span className="text-destructive">
                                                                    *
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    user.email ||
                                                                    ""
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                7. STATUS
                                                                KEWAJIBAN
                                                                PERPAJAKAN SUAMI
                                                                DAN ISTRI
                                                                <div className="text-xs text-muted-foreground font-normal">
                                                                    (Isi jika
                                                                    status
                                                                    adalah
                                                                    PH/MT)
                                                                </div>
                                                            </Label>
                                                            <Select
                                                                value={
                                                                    spouseTaxStatus
                                                                }
                                                                onValueChange={
                                                                    setSpouseTaxStatus
                                                                }
                                                                disabled
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Silakan Pilih" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="PH">
                                                                        PH
                                                                    </SelectItem>
                                                                    <SelectItem value="MT">
                                                                        MT
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                8. NIK/NPWP
                                                                SUAMI/ISTRI
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    spouseNpwp
                                                                }
                                                                onChange={(e) =>
                                                                    setSpouseNpwp(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder=""
                                                                disabled={
                                                                    spouseTaxStatus !==
                                                                        "PH" &&
                                                                    spouseTaxStatus !==
                                                                        "MT"
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* B. IKHTISAR PENGHASILAN NETO */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="penghasilan"
                                        >
                                            <AccordionItem value="penghasilan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    B. IKHTISAR PENGHASILAN NETO
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className=" rounded-lg overflow-hidden">
                                                            {/* 1.a */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center">
                                                                <div className="text-sm font-medium">
                                                                    1.a.
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    penghasilan
                                                                    dalam negeri
                                                                    dari
                                                                    pekerjaan?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="b_1a"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="b_1a_ya"
                                                                                        />
                                                                                        <Label htmlFor="b_1a_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="b_1a_tidak"
                                                                                        />
                                                                                        <Label htmlFor="b_1a_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "b_1a",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "b_1a",
                                                                        )
                                                                            ? "Ya, silahkan mengisi lampiran I Bagian D"
                                                                            : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "b_1a",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="b_1a_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 1.b.1 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    1.b.1
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    penghasilan
                                                                    dalam negeri
                                                                    dari usaha
                                                                    dan/atau
                                                                    pekerjaan
                                                                    bebas?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="b_1b_1"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="b_1b_1_ya"
                                                                                        />
                                                                                        <Label htmlFor="b_1b_1_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="b_1b_1_tidak"
                                                                                        />
                                                                                        <Label htmlFor="b_1b_1_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "b_1b_1",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "b_1b_1",
                                                                        )
                                                                            ? "Ya, lanjutkan ke pertanyaan selanjutnya"
                                                                            : "Tidak, lanjutkan ke pertanyaan 1c"}
                                                                    </div>
                                                                )}
                                                                <div />
                                                            </div>

                                                            {/* 1.b.2 & 1.b.3 & 1.b.5 appear only if 1.b.1 = Ya */}
                                                            {form.watch(
                                                                "b_1b_1",
                                                            ) && (
                                                                <>
                                                                    <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_260px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                        <div className="text-sm font-medium">
                                                                            1.b.2
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            Apakah
                                                                            Anda
                                                                            termasuk
                                                                            Wajib
                                                                            Pajak
                                                                            Orang
                                                                            Pribadi
                                                                            yang
                                                                            memiliki
                                                                            peredaran
                                                                            bruto
                                                                            tertentu
                                                                            atau
                                                                            Orang
                                                                            Pribadi
                                                                            Pengusaha
                                                                            tertentu
                                                                            (OPPT)?{" "}
                                                                            <span className="text-destructive">
                                                                                *
                                                                            </span>
                                                                        </div>
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="b_1b_2"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <Select
                                                                                        value={
                                                                                            field.value
                                                                                        }
                                                                                        onValueChange={
                                                                                            field.onChange
                                                                                        }
                                                                                    >
                                                                                        <FormControl>
                                                                                            <SelectTrigger>
                                                                                                <SelectValue placeholder="Silakan Pilih" />
                                                                                            </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                            <SelectItem value="tidak">
                                                                                                Tidak,
                                                                                                lanjutkan
                                                                                                ke
                                                                                                pertanyaan
                                                                                                selanjutnya
                                                                                            </SelectItem>
                                                                                            <SelectItem value="ya1">
                                                                                                Ya,
                                                                                                saya
                                                                                                termasuk
                                                                                                Wajib
                                                                                                Pajak
                                                                                                Orang
                                                                                                Pribadi
                                                                                                yang
                                                                                                memiliki
                                                                                                peredaran
                                                                                                bruto
                                                                                                tertentu
                                                                                                yang
                                                                                                dikenai
                                                                                                pajak
                                                                                                bersifat
                                                                                                final.
                                                                                            </SelectItem>
                                                                                            <SelectItem value="ya2">
                                                                                                Ya,
                                                                                                saya
                                                                                                termasuk
                                                                                                orang
                                                                                                pribadi
                                                                                                pengusaha
                                                                                                tertentu
                                                                                            </SelectItem>
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        {form.watch(
                                                                            "b_1b_2",
                                                                        ) ===
                                                                        undefined ? (
                                                                            <div />
                                                                        ) : (
                                                                            <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                                {form.watch(
                                                                                    "b_1b_2",
                                                                                ) ===
                                                                                "tidak"
                                                                                    ? "Tidak, silahkan lanjut pertanyaan berikutnya"
                                                                                    : form.watch(
                                                                                            "b_1b_2",
                                                                                        ) ===
                                                                                        "ya1"
                                                                                      ? "Ya, saya menerima penghasilan usaha yang dikenakan Pajak Final PP 23/PP 55. (Isi Lampiran 3B Bagian A)"
                                                                                      : form.watch(
                                                                                              "b_1b_2",
                                                                                          ) ===
                                                                                          "ya2"
                                                                                        ? "Ya, saya termasuk Wajib Pajak OPPT (Isi Lampiran 3B Bagian B)."
                                                                                        : ""}
                                                                            </div>
                                                                        )}
                                                                        <div />
                                                                    </div>

                                                                    <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_260px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                        <div className="text-sm font-medium">
                                                                            1.b.3
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            Apakah
                                                                            Anda
                                                                            menggunakan
                                                                            Norma
                                                                            dalam
                                                                            menghitung
                                                                            penghasilan
                                                                            neto?{" "}
                                                                            <span className="text-destructive">
                                                                                *
                                                                            </span>
                                                                        </div>
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="b_1b_3"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <Select
                                                                                        value={
                                                                                            field.value
                                                                                        }
                                                                                        onValueChange={
                                                                                            field.onChange
                                                                                        }
                                                                                    >
                                                                                        <FormControl>
                                                                                            <SelectTrigger>
                                                                                                <SelectValue placeholder="Silakan Pilih" />
                                                                                            </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                            <SelectItem value="tidak1">
                                                                                                Tidak,
                                                                                                saya
                                                                                                menyelenggarakan
                                                                                                pembukuan
                                                                                            </SelectItem>
                                                                                            <SelectItem value="tidak2">
                                                                                                Tidak,
                                                                                                saya
                                                                                                hanya
                                                                                                menerima
                                                                                                penghasilan
                                                                                                dari
                                                                                                usaha
                                                                                                yang
                                                                                                dikenakan
                                                                                                pajak
                                                                                                bersifat
                                                                                                final
                                                                                                dan
                                                                                                tidak
                                                                                                menyelenggarakan
                                                                                                pembukuan.
                                                                                            </SelectItem>
                                                                                            <SelectItem value="ya">
                                                                                                Ya,
                                                                                                saya
                                                                                                berhak
                                                                                                menggunakan
                                                                                                Norma
                                                                                                Penghitungan
                                                                                                Penghasilan
                                                                                                Neto.
                                                                                            </SelectItem>
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        {form.watch(
                                                                            "b_1b_3",
                                                                        ) ===
                                                                        undefined ? (
                                                                            <div />
                                                                        ) : (
                                                                            <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                                {form.watch(
                                                                                    "b_1b_3",
                                                                                ) ===
                                                                                "tidak1"
                                                                                    ? "Tidak, saya menyusun laporan keuangan/laporan keuangan berbasis kas. (Lanjutkan ke pertanyaan berikutnya)"
                                                                                    : form.watch(
                                                                                            "b_1b_3",
                                                                                        ) ===
                                                                                        "tidak2"
                                                                                      ? "Tidak, saya hanya menerima penghasilan yang dikenakan Pajak Final PP 23/PP 55. (Lanjutkan ke pertanyaan 1c)"
                                                                                      : form.watch(
                                                                                              "b_1b_3",
                                                                                          ) ===
                                                                                          "ya"
                                                                                        ? "Ya, saya adalah pengguna yang memenuhi syarat untuk menggunakan norma perhitungan penghasilan neto. (Isi Lampiran 3B Bagian C, Lampiran 3A-4 Bagian A dan lanjut ke pertanyaan 1c)"
                                                                                        : ""}
                                                                            </div>
                                                                        )}
                                                                        <div />
                                                                    </div>

                                                                    {form.watch(
                                                                        "b_1b_3",
                                                                    ) ===
                                                                        "tidak1" && (
                                                                        <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_260px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                            <div className="text-sm font-medium">
                                                                                1.b.4
                                                                            </div>
                                                                            <div className="text-sm">
                                                                                Anda
                                                                                menyelenggarakan
                                                                                pembukuan.
                                                                                Sebutkan
                                                                                sektor
                                                                                usaha
                                                                                yang
                                                                                Anda
                                                                                lakukan?{" "}
                                                                                <span className="text-destructive">
                                                                                    *
                                                                                </span>
                                                                            </div>
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="b_1b_4"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem>
                                                                                        <Select
                                                                                            value={
                                                                                                field.value
                                                                                            }
                                                                                            onValueChange={
                                                                                                field.onChange
                                                                                            }
                                                                                        >
                                                                                            <FormControl>
                                                                                                <SelectTrigger>
                                                                                                    <SelectValue placeholder="Silakan Pilih" />
                                                                                                </SelectTrigger>
                                                                                            </FormControl>
                                                                                            <SelectContent>
                                                                                                <SelectItem value="dagang">
                                                                                                    Dagang
                                                                                                </SelectItem>
                                                                                                <SelectItem value="jasa">
                                                                                                    Jasa
                                                                                                </SelectItem>
                                                                                                <SelectItem value="industri">
                                                                                                    Industri
                                                                                                </SelectItem>
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                            {form.watch(
                                                                                "b_1b_4",
                                                                            ) ===
                                                                            undefined ? (
                                                                                <div />
                                                                            ) : (
                                                                                <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                                    {form.watch(
                                                                                        "b_1b_4",
                                                                                    ) ===
                                                                                    "dagang"
                                                                                        ? "Ya, silahkan mengisi lampiran 3A-1"
                                                                                        : form.watch(
                                                                                                "b_1b_4",
                                                                                            ) ===
                                                                                            "jasa"
                                                                                          ? "Ya, silahkan mengisi lampiran 3A-2"
                                                                                          : form.watch(
                                                                                                  "b_1b_4",
                                                                                              ) ===
                                                                                              "industri"
                                                                                            ? "Ya, silahkan mengisi lampiran 3A-3"
                                                                                            : ""}
                                                                                </div>
                                                                            )}
                                                                            <div />
                                                                        </div>
                                                                    )}

                                                                    <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                        <div className="text-sm font-medium">
                                                                            1.b.5
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            Penghasilan
                                                                            neto
                                                                            dari
                                                                            usaha
                                                                            dan/atau
                                                                            pekerjaan
                                                                            bebas
                                                                        </div>
                                                                        <div />
                                                                        <div />
                                                                        <div className="flex justify-end">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="b_1b_5"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem>
                                                                                        <FormControl>
                                                                                            <Input
                                                                                                type="text"
                                                                                                placeholder="0"
                                                                                                value={formatRupiah(
                                                                                                    field.value,
                                                                                                )}
                                                                                                onChange={(
                                                                                                    e,
                                                                                                ) =>
                                                                                                    field.onChange(
                                                                                                        parseRupiah(
                                                                                                            e
                                                                                                                .target
                                                                                                                .value,
                                                                                                        ),
                                                                                                    )
                                                                                                }
                                                                                                className="w-[160px] text-right"
                                                                                                disabled
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* 1.c */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    1.c.
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    penghasilan
                                                                    dalam negeri
                                                                    lainnya?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="b_1c"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="b_1c_ya"
                                                                                        />
                                                                                        <Label htmlFor="b_1c_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="b_1c_tidak"
                                                                                        />
                                                                                        <Label htmlFor="b_1c_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "b_1c",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "b_1c",
                                                                        )
                                                                            ? "Ya, silahkan mengisi lampiran 3A-4 Bagian B"
                                                                            : "Tidak, lanjutkan ke pertanyaan 1d"}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "b_1c",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="b_1c_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 1.d */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    1.d.
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    penghasilan
                                                                    luar negeri?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="b_1d"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="b_1d_ya"
                                                                                        />
                                                                                        <Label htmlFor="b_1d_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="b_1d_tidak"
                                                                                        />
                                                                                        <Label htmlFor="b_1d_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "b_1d",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "b_1d",
                                                                        )
                                                                            ? "Ya, silahkan mengisi lampiran 2 Bagian C"
                                                                            : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "b_1d",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="b_1d_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* C. PENGHITUNGAN PAJAK TERUTANG */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="penghitungan"
                                        >
                                            <AccordionItem value="penghitungan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    C. PENGHITUNGAN PAJAK
                                                    TERUTANG
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className="rounded-lg overflow-hidden">
                                                            {/* 2 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center">
                                                                <div className="text-sm font-medium">
                                                                    2
                                                                </div>
                                                                <div className="text-sm">
                                                                    Penghasilan
                                                                    neto setahun
                                                                    (1a+1b+1c+1d)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="c_2"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        className="w-[160px] text-right"
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 3 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    3
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah
                                                                    terdapat
                                                                    pengurang
                                                                    penghasilan
                                                                    neto seperti
                                                                    kompensasi
                                                                    kerugian
                                                                    atau
                                                                    zakat/sumbangan
                                                                    keagamaan
                                                                    yang dibayar
                                                                    selain yang
                                                                    telah
                                                                    diperhitungkan
                                                                    dalam
                                                                    Formulir
                                                                    BPA1
                                                                    dan/atau
                                                                    BPA2?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="c_3"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="c_3_ya"
                                                                                        />
                                                                                        <Label htmlFor="c_3_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="c_3_tidak"
                                                                                        />
                                                                                        <Label htmlFor="c_3_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "c_3",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "c_3",
                                                                        )
                                                                            ? "Ya, silahkan mengisi lampiran 5 Bagian A dan/atau B"
                                                                            : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "c_3",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="c_3_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 4 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    4
                                                                </div>
                                                                <div className="text-sm">
                                                                    Penghasilan
                                                                    neto setelah
                                                                    pengurang
                                                                    penghasilan
                                                                    neto (2-3)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="c_4"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        className="w-[160px] text-right"
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 5 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    5
                                                                </div>
                                                                <div className="text-sm font-medium">
                                                                    Penghasilan
                                                                    Tidak Kena
                                                                    Pajak
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="c_5"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <Select
                                                                                value={
                                                                                    field.value
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    field.onChange(
                                                                                        v,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FormControl>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Silakan Pilih" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    {PTKP_STATUS_ORDER.map(
                                                                                        (
                                                                                            k,
                                                                                        ) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    k
                                                                                                }
                                                                                                value={
                                                                                                    k
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    k
                                                                                                }
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="0"
                                                                        value={formatRupiah(
                                                                            PTKP_MAP[
                                                                                form.watch(
                                                                                    "c_5",
                                                                                ) as PtkpStatus
                                                                            ] ??
                                                                                0,
                                                                        )}
                                                                        className="w-[160px] text-right"
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 6 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    6
                                                                </div>
                                                                <div className="text-sm">
                                                                    Penghasilan
                                                                    Kena Pajak
                                                                    (4-5)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="c_6"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        className="w-[160px] text-right"
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 7 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    7
                                                                </div>
                                                                <div className="text-sm font-medium">
                                                                    PPh Terutang
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="c_7"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        className="w-[160px] text-right"
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 8 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    8
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah
                                                                    terdapat
                                                                    pengurang
                                                                    PPh
                                                                    Terutang?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="c_8"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="c_8_ya"
                                                                                        />
                                                                                        <Label htmlFor="c_8_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="c_8_tidak"
                                                                                        />
                                                                                        <Label htmlFor="c_8_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "c_8",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "c_8",
                                                                        )
                                                                            ? "Ya, silahkan mengisi lampiran 5 Bagian C"
                                                                            : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "c_8",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="c_8_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 9 */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    9
                                                                </div>
                                                                <div className="text-sm font-medium">
                                                                    PPh Terutang
                                                                    setelah
                                                                    pengurang
                                                                    PPh Terutang
                                                                    (7-8)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="c_9"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        className="w-[160px] text-right"
                                                                                        disabled
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* D. KREDIT PAJAK */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="kredit"
                                        >
                                            <AccordionItem value="kredit">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    D. KREDIT PAJAK
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className="rounded-lg overflow-hidden">
                                                            {/* 10a */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center">
                                                                <div className="text-sm font-medium">
                                                                    10a
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah
                                                                    terdapat PPh
                                                                    yang telah
                                                                    dipotong/
                                                                    dipungut
                                                                    oleh pihak
                                                                    lain?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="d_10_a"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="d_10_a_ya"
                                                                                        />
                                                                                        <Label htmlFor="d_10_a_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="d_10_a_tidak"
                                                                                        />
                                                                                        <Label htmlFor="d_10_a_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "d_10_a",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "d_10_a",
                                                                        )
                                                                            ? "Ya, silahkan mengisi lampiran 1 Bagian E"
                                                                            : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "d_10_a",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_10_a_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 10b */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    10b
                                                                </div>
                                                                <div className="text-sm">
                                                                    Angsuran PPh
                                                                    Pasal 25
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="d_10_b"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            field.onChange(
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ),
                                                                                            )
                                                                                        }
                                                                                        className="w-[160px] text-right"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 10c */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    10c
                                                                </div>
                                                                <div className="text-sm">
                                                                    STP PPh
                                                                    Pasal 25
                                                                    (Hanya pokok
                                                                    pajak)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="d_10_c"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            field.onChange(
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ),
                                                                                            )
                                                                                        }
                                                                                        className="w-[160px] text-right"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 10d */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    10d
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    pengembalian/
                                                                    pengurangan
                                                                    kredit PPh
                                                                    luar negeri
                                                                    yang telah
                                                                    dikreditkan?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="d_10_d"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="d_10_d_ya"
                                                                                        />
                                                                                        <Label htmlFor="d_10_d_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="d_10_d_tidak"
                                                                                        />
                                                                                        <Label htmlFor="d_10_d_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "d_10_d",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-100 text-sky-900 px-4 py-3 rounded">
                                                                        {form.watch(
                                                                            "d_10_d",
                                                                        )
                                                                            ? "Ya, lengkapi bagian ini dengan jumlah pengembalian/pengurangan yang Anda terima"
                                                                            : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "d_10_d",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_10_d_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* E. PPh KURANG/LEBIH BAYAR */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="pph_kb_lb"
                                        >
                                            <AccordionItem value="pph_kb_lb">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    E. PPh KURANG/LEBIH BAYAR
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className="rounded-lg overflow-hidden">
                                                            {/* 11a */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_240px] gap-4 p-4 bg-white items-center">
                                                                <div className="text-sm font-medium">
                                                                    11a
                                                                </div>
                                                                <div className="text-sm">
                                                                    PPh
                                                                    kurang/lebih
                                                                    bayar
                                                                    (9-10a-10b-10c+10d)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <Input
                                                                        type="text"
                                                                        value={formatRupiah(
                                                                            form.watch(
                                                                                "e_11_a",
                                                                            ),
                                                                        )}
                                                                        disabled
                                                                        className="w-[160px] text-right"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 11b */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    11b
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah
                                                                    terdapat
                                                                    Surat
                                                                    Keputusan
                                                                    Persetujuan
                                                                    Pengangsuran
                                                                    atau
                                                                    Penundaan
                                                                    Pembayaran
                                                                    Pajak?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="e_11_b"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="e_11_b_ya"
                                                                                        />
                                                                                        <Label htmlFor="e_11_b_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="e_11_b_tidak"
                                                                                        />
                                                                                        <Label htmlFor="e_11_b_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "e_11_b",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "e_11_b",
                                                                            )
                                                                                ? "Ya. Saya memilikinya"
                                                                                : "Tidak. Saya tidak memilikinya"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "e_11_b",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="e_11_b_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            placeholder="0"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 11c */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    11c
                                                                </div>
                                                                <div className="text-sm">
                                                                    PPh yang
                                                                    masih harus
                                                                    dibayar
                                                                    (11a-11b)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <Input
                                                                        type="text"
                                                                        value={formatRupiah(
                                                                            form.watch(
                                                                                "e_11_c",
                                                                            ),
                                                                        )}
                                                                        disabled
                                                                        className="w-[160px] text-right"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* F. PEMBETULAN (DIISI JIKA STATUS SPT ADALAH PEMBETULAN) */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="pembetulan"
                                        >
                                            <AccordionItem value="pembetulan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    F. PEMBETULAN (DIISI JIKA
                                                    STATUS SPT ADALAH
                                                    PEMBETULAN)
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className="rounded-lg overflow-hidden">
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center">
                                                                <div className="text-sm font-medium">
                                                                    12a
                                                                </div>
                                                                <div className="text-sm">
                                                                    PPh
                                                                    kurang/lebih
                                                                    bayar pada
                                                                    SPT yang
                                                                    dibetulkan
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="f_12_a"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        placeholder="0"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            field.onChange(
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ),
                                                                                            )
                                                                                        }
                                                                                        className="w-[160px] text-right"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    12b
                                                                </div>
                                                                <div className="text-sm">
                                                                    PPh
                                                                    kurang/lebih
                                                                    bayar karena
                                                                    pembetulan
                                                                    (11a-12a)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <Input
                                                                        type="text"
                                                                        value={formatRupiah(
                                                                            form.watch(
                                                                                "f_12_b",
                                                                            ),
                                                                        )}
                                                                        disabled
                                                                        className="w-[160px] text-right"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* G. PERMOHONAN PENGEMBALIAN PPh LEBIH BAYAR (DIISI JIKA STATUS SPT ADALAH LEBIH BAYAR) */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="permohonan"
                                        >
                                            <AccordionItem value="permohonan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    G. PERMOHONAN PENGEMBALIAN
                                                    PPh LEBIH BAYAR (DIISI JIKA
                                                    STATUS SPT ADALAH LEBIH
                                                    BAYAR)
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-start">
                                                            <div className="space-y-4">
                                                                <div className="text-sm">
                                                                    PPh lebih
                                                                    bayar pada
                                                                    11a atau 12b
                                                                    mohon:
                                                                </div>

                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="g_pph"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <Select
                                                                                onValueChange={
                                                                                    field.onChange
                                                                                }
                                                                                value={
                                                                                    field.value
                                                                                }
                                                                                disabled={
                                                                                    !isGpphEnabled
                                                                                }
                                                                            >
                                                                                <FormControl>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Silakan Pilih" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    <SelectItem value="dikembalikan melalui pemeriksaan">
                                                                                        Dikembalikan
                                                                                        melalui
                                                                                        pemeriksaan
                                                                                    </SelectItem>
                                                                                    <SelectItem value="dikembalikan melalui permohonan pendahuluan">
                                                                                        Dikembalikan
                                                                                        melalui
                                                                                        permohonan
                                                                                        pendahuluan
                                                                                    </SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-start gap-3">
                                                                    <div className="text-sm font-medium mr-4">
                                                                        Pilih
                                                                        Rekening
                                                                        Bank
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            fetchBanks();
                                                                            setOpenBankModal(
                                                                                true,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <FolderOpen className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="account_number"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem className="grid grid-cols-[140px_1fr] items-center gap-3">
                                                                            <FormLabel className="text-sm">
                                                                                Nomor
                                                                                Rekening
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={
                                                                                        field.value ||
                                                                                        ""
                                                                                    }
                                                                                    readOnly
                                                                                    className="bg-gray-100"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="bank_name"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem className="grid grid-cols-[140px_1fr] items-center gap-3">
                                                                            <FormLabel className="text-sm">
                                                                                Nama
                                                                                Bank
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={
                                                                                        field.value ||
                                                                                        ""
                                                                                    }
                                                                                    readOnly
                                                                                    className="bg-gray-100"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="account_name"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem className="grid grid-cols-[140px_1fr] items-center gap-3">
                                                                            <FormLabel className="text-sm">
                                                                                Nama
                                                                                Pemilik
                                                                                Rekening
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={
                                                                                        field.value ||
                                                                                        ""
                                                                                    }
                                                                                    readOnly
                                                                                    className="bg-gray-100"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* H. ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="angsuran_pph25"
                                        >
                                            <AccordionItem value="angsuran_pph25">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    H. ANGSURAN PPh PASAL 25
                                                    TAHUN PAJAK BERIKUTNYA
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className="rounded-lg overflow-hidden">
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center">
                                                                <div className="text-sm font-medium">
                                                                    13a
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    hanya
                                                                    menerima
                                                                    penghasilan
                                                                    teratur dan
                                                                    berkewajiban
                                                                    membayar
                                                                    angsuran PPh
                                                                    Pasal 25
                                                                    Tahun Pajak
                                                                    berikutnya?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="h_13_a"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="h_13_a_ya"
                                                                                        />
                                                                                        <Label htmlFor="h_13_a_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="h_13_a_tidak"
                                                                                        />
                                                                                        <Label htmlFor="h_13_a_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "h_13_a",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "h_13_a",
                                                                            )
                                                                                ? "Ya, Angsuran PPh Pasal 25 adalah 1/12 x ((9) - (10)(a))"
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya."}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "h_13_a",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="h_13_a_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    13b
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menyusun
                                                                    perhitungan
                                                                    tersendiri
                                                                    angsuran PPh
                                                                    Pasal 25
                                                                    Tahun Pajak
                                                                    berikutnya?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="h_13_b"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="h_13_b_ya"
                                                                                            disabled={
                                                                                                !isH13BEnabled
                                                                                            }
                                                                                        />
                                                                                        <Label htmlFor="h_13_b_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="h_13_b_tidak"
                                                                                            disabled={
                                                                                                !isH13BEnabled
                                                                                            }
                                                                                        />
                                                                                        <Label htmlFor="h_13_b_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "h_13_b",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "h_13_b",
                                                                            )
                                                                                ? "Ya, silahkan mengisi Lampiran 4 Bagian A"
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya."}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "h_13_b",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="h_13_b_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            readOnly
                                                                                            disabled
                                                                                            className="w-[160px] text-right bg-gray-100"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    13c
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    membayar
                                                                    angsuran PPh
                                                                    Pasal 25
                                                                    OPPT Tahun
                                                                    Pajak
                                                                    berikutnya?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="h_13_c"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="h_13_c_ya"
                                                                                        />
                                                                                        <Label htmlFor="h_13_c_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="h_13_c_tidak"
                                                                                        />
                                                                                        <Label htmlFor="h_13_c_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "h_13_c",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "h_13_c",
                                                                            )
                                                                                ? "Ya, angsuran PPh Pasal 25 saya adalah 0.75% dari penghasilan bruto setiap bulan dari masing-masing tempat usaha."
                                                                                : "Tidak, tidak ada kewajiban untuk membayar angsuran pajak penghasilan Pasal 25"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* I. PERNYATAAN TRANSAKSI LAINNYA */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="pernyataan_transaksi"
                                        >
                                            <AccordionItem value="pernyataan_transaksi">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    I. PERNYATAAN TRANSAKSI
                                                    LAINNYA
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4">
                                                        <div className="rounded-lg overflow-hidden">
                                                            {/* 14a */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center">
                                                                <div className="text-sm font-medium">
                                                                    14a
                                                                </div>
                                                                <div className="text-sm">
                                                                    Harta pada
                                                                    akhir Tahun
                                                                    Pajak{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>{" "}
                                                                    (Isi
                                                                    Lampiran 1
                                                                    Bagian A,
                                                                    lalu ke
                                                                    pertanyaan
                                                                    selanjutnya)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="i_14_a"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        disabled
                                                                                        className="w-[160px] text-right"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 14b */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    14b
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    memiliki
                                                                    utang pada
                                                                    akhir tahun
                                                                    pajak?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="i_14_b"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="i_14_b_ya"
                                                                                        />
                                                                                        <Label htmlFor="i_14_b_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="i_14_b_tidak"
                                                                                        />
                                                                                        <Label htmlFor="i_14_b_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "i_14_b",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "i_14_b",
                                                                            )
                                                                                ? "Ya, silakan mengisi lampiran 1 Bagian B"
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "i_14_b",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="i_14_b_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            disabled
                                                                                            className="w-[160px] text-right"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 14c */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    14c
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    penghasilan
                                                                    yang
                                                                    dikenakan
                                                                    pajak
                                                                    penghasilan
                                                                    bersifat
                                                                    final?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="i_14_c"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="i_14_c_ya"
                                                                                        />
                                                                                        <Label htmlFor="i_14_c_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="i_14_c_tidak"
                                                                                        />
                                                                                        <Label htmlFor="i_14_c_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "i_14_c",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "i_14_c",
                                                                            )
                                                                                ? "Ya, silakan mengisi lampiran 2 Bagian A"
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "i_14_c",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="i_14_c_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 14d */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    14d
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    penghasilan
                                                                    yang tidak
                                                                    termasuk
                                                                    objek pajak?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="i_14_d"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="i_14_d_ya"
                                                                                        />
                                                                                        <Label htmlFor="i_14_d_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="i_14_d_tidak"
                                                                                        />
                                                                                        <Label htmlFor="i_14_d_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "i_14_d",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "i_14_d",
                                                                            )
                                                                                ? "Ya, silahkan mengisi lampiran 2 Bagian B"
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end">
                                                                    {form.watch(
                                                                        "i_14_d",
                                                                    ) ? (
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="i_14_d_value"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            type="text"
                                                                                            value={formatRupiah(
                                                                                                field.value,
                                                                                            )}
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                field.onChange(
                                                                                                    parseRupiah(
                                                                                                        e
                                                                                                            .target
                                                                                                            .value,
                                                                                                    ),
                                                                                                )
                                                                                            }
                                                                                            className="w-[160px] text-right"
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* 14e */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    14e
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    melaporkan
                                                                    biaya
                                                                    penyusutan
                                                                    dan/atau
                                                                    amortisasi
                                                                    fiskal?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="i_14_e"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    disabled={
                                                                                        !canAnswerI14EF
                                                                                    }
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="i_14_e_ya"
                                                                                        />
                                                                                        <Label htmlFor="i_14_e_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="i_14_e_tidak"
                                                                                        />
                                                                                        <Label htmlFor="i_14_e_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "i_14_e",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "i_14_e",
                                                                            )
                                                                                ? "Ya, lanjutkan pengisian sesuai ketentuan"
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div />
                                                            </div>

                                                            {/* 14f */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    14f
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    melaporkan
                                                                    biaya
                                                                    entertainment,
                                                                    biaya
                                                                    promosi,
                                                                    penggantian
                                                                    atau imbalan
                                                                    dalam bentuk
                                                                    natura
                                                                    dan/atau
                                                                    kenikmatan,
                                                                    serta
                                                                    piutang yang
                                                                    nyata-nyata
                                                                    tidak dapat
                                                                    ditagih?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="i_14_f"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    disabled={
                                                                                        !canAnswerI14EF
                                                                                    }
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="i_14_f_ya"
                                                                                        />
                                                                                        <Label htmlFor="i_14_f_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="i_14_f_tidak"
                                                                                        />
                                                                                        <Label htmlFor="i_14_f_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "i_14_f",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "i_14_f",
                                                                            )
                                                                                ? "Ya, lanjutkan pengisian sesuai ketentuan"
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div />
                                                            </div>

                                                            {/* 14g */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-white items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    14g
                                                                </div>
                                                                <div className="text-sm">
                                                                    Apakah Anda
                                                                    menerima
                                                                    dividen
                                                                    dan/atau
                                                                    penghasilan
                                                                    lain dari
                                                                    luar negeri
                                                                    dan
                                                                    melaporkannya
                                                                    sebagai
                                                                    penghasilan
                                                                    tidak
                                                                    termasuk
                                                                    objek pajak?{" "}
                                                                    <span className="text-destructive">
                                                                        *
                                                                    </span>
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="i_14_g"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    className="flex items-center justify-center gap-6"
                                                                                    value={
                                                                                        field.value ===
                                                                                        true
                                                                                            ? "ya"
                                                                                            : field.value ===
                                                                                                false
                                                                                              ? "tidak"
                                                                                              : ""
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            v ===
                                                                                                "ya",
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="ya"
                                                                                            id="i_14_g_ya"
                                                                                        />
                                                                                        <Label htmlFor="i_14_g_ya">
                                                                                            Ya
                                                                                        </Label>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <RadioGroupItem
                                                                                            value="tidak"
                                                                                            id="i_14_g_tidak"
                                                                                        />
                                                                                        <Label htmlFor="i_14_g_tidak">
                                                                                            Tidak
                                                                                        </Label>
                                                                                    </div>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {form.watch(
                                                                    "i_14_g",
                                                                ) ===
                                                                undefined ? (
                                                                    <div />
                                                                ) : (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3">
                                                                        <div>
                                                                            {form.watch(
                                                                                "i_14_g",
                                                                            )
                                                                                ? "Pastikan Anda sudah menyampaikan laporan realisasi investasi secara terpisah."
                                                                                : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div />
                                                            </div>

                                                            {/* 14h */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_160px_1fr_180px] gap-4 p-4 bg-gray-100 items-center border-t">
                                                                <div className="text-sm font-medium">
                                                                    14h
                                                                </div>
                                                                <div className="text-sm">
                                                                    Kelebihan
                                                                    PPh Final
                                                                    atas
                                                                    penghasilan
                                                                    dari usaha
                                                                    dengan
                                                                    peredaran
                                                                    bruto
                                                                    tertentu
                                                                    yang dapat
                                                                    dimintakan
                                                                    pengembalian.
                                                                    (Silakan
                                                                    mengajukan
                                                                    permohonan
                                                                    pengembalian
                                                                    pajak yang
                                                                    seharusnya
                                                                    tidak
                                                                    terutang
                                                                    secara
                                                                    terpisah)
                                                                </div>
                                                                <div />
                                                                <div />
                                                                <div className="flex justify-end">
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="i_14_h"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="text"
                                                                                        value={formatRupiah(
                                                                                            field.value,
                                                                                        )}
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            field.onChange(
                                                                                                parseRupiah(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ),
                                                                                            )
                                                                                        }
                                                                                        className="w-[240px] text-right"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* J. LAMPIRAN TAMBAHAN */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="lampiran_tambahan"
                                        >
                                            <AccordionItem value="lampiran_tambahan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    J. LAMPIRAN TAMBAHAN
                                                </AccordionTrigger>
                                                <AccordionContent className="p-0 bg-white w-full">
                                                    <div>
                                                        {/* a */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_1fr] gap-4 p-4 bg-white items-start">
                                                            <div className="text-sm">
                                                                a. Laporan
                                                                Keuangan/Laporan
                                                                Keuangan yang
                                                                telah diaudit
                                                            </div>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="j_a"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                className="flex items-center justify-center gap-6"
                                                                                value={
                                                                                    field.value ===
                                                                                    true
                                                                                        ? "yes"
                                                                                        : field.value ===
                                                                                            false
                                                                                          ? "no"
                                                                                          : ""
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    field.onChange(
                                                                                        v ===
                                                                                            "yes",
                                                                                    )
                                                                                }
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="yes"
                                                                                        id="j_a_yes"
                                                                                    />
                                                                                    <Label htmlFor="j_a_yes">
                                                                                        1.
                                                                                        Yes
                                                                                    </Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="no"
                                                                                        id="j_a_no"
                                                                                    />
                                                                                    <Label htmlFor="j_a_no">
                                                                                        2.
                                                                                        No
                                                                                    </Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            {form.watch(
                                                                "j_a",
                                                            ) === undefined ? (
                                                                <div />
                                                            ) : form.watch(
                                                                  "j_a",
                                                              ) === false ? (
                                                                <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3 w-fit">
                                                                    <div>
                                                                        Tidak,
                                                                        jenis
                                                                        pembukuan
                                                                        adalah
                                                                        Pembukuan
                                                                        Sederhana.
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div />
                                                            )}
                                                        </div>
                                                        {form.watch("j_a") === true && (
                                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 p-4 bg-white border-t">
                                                            <div className="text-sm text-muted-foreground">
                                                                File
                                                            </div>
                                                            <FormField
                                                                control={form.control}
                                                                name="j_a_file"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <div className="border rounded-md p-4 bg-white">
                                                                                <input
                                                                                    ref={jAFileInputRef}
                                                                                    type="file"
                                                                                    accept=".pdf,application/pdf"
                                                                                    className="hidden"
                                                                                    onChange={(e) =>
                                                                                        handleJFileChange("j_a_file", e)
                                                                                    }
                                                                                />
                                                                                <div className="flex flex-wrap gap-3 items-center">
                                                                                    <Button
                                                                                        type="button"
                                                                                        className="bg-blue-950 hover:bg-blue-900"
                                                                                        disabled={jFileUploading.j_a_file}
                                                                                        onClick={() =>
                                                                                            jAFileInputRef.current?.click()
                                                                                        }
                                                                                    >
                                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                                        Choose
                                                                                    </Button>
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="outline"
                                                                                        disabled={
                                                                                            !String(
                                                                                                field.value ?? "",
                                                                                            ).trim()
                                                                                        }
                                                                                        onClick={() => {
                                                                                            field.onChange("");
                                                                                            setJFileNames((p) => ({ ...p, j_a_file: "" }));
                                                                                            if (jAFileInputRef.current)
                                                                                                jAFileInputRef.current.value = "";
                                                                                        }}
                                                                                    >
                                                                                        Cancel
                                                                                    </Button>
                                                                                </div>
                                                                                <div className="text-sm text-muted-foreground mt-4">
                                                                                    {jFileUploading.j_a_file
                                                                                        ? "Mengupload..."
                                                                                        : jFileNames.j_a_file
                                                                                          ? `Dipilih: ${jFileNames.j_a_file}`
                                                                                          : "Belum ada file"}
                                                                                </div>
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                        {/* b */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_1fr] gap-4 p-4 bg-gray-50 items-start border-t">
                                                            <div className="text-sm">
                                                                b. Bukti
                                                                pembayaran
                                                                zakat/sumbangan
                                                                keagamaan
                                                            </div>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="j_b"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                className="flex items-center justify-center gap-6"
                                                                                value={
                                                                                    field.value ===
                                                                                    true
                                                                                        ? "yes"
                                                                                        : field.value ===
                                                                                            false
                                                                                          ? "no"
                                                                                          : ""
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    field.onChange(
                                                                                        v ===
                                                                                            "yes",
                                                                                    )
                                                                                }
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="yes"
                                                                                        id="j_b_yes"
                                                                                    />
                                                                                    <Label htmlFor="j_b_yes">
                                                                                        1.
                                                                                        Yes
                                                                                    </Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="no"
                                                                                        id="j_b_no"
                                                                                    />
                                                                                    <Label htmlFor="j_b_no">
                                                                                        2.
                                                                                        No
                                                                                    </Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            {form.watch(
                                                                "j_b",
                                                            ) === undefined ? (
                                                                <div />
                                                            ) : form.watch(
                                                                  "j_b",
                                                              ) === false ? (
                                                                <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3 w-fit">
                                                                    <div>
                                                                        Tidak
                                                                        ada
                                                                        berkas
                                                                        yang
                                                                        perlu
                                                                        dilampirkan
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div />
                                                            )}
                                                        </div>
                                                        {form.watch("j_b") ===
                                                            true && (
                                                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 p-4 bg-gray-50 border-t">
                                                                <div className="text-sm text-muted-foreground">
                                                                    File
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="j_b_file"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <div className="border rounded-md p-4 bg-white">
                                                                                    <input
                                                                                        ref={
                                                                                            jBFileInputRef
                                                                                        }
                                                                                        type="file"
                                                                                        accept=".pdf,application/pdf"
                                                                                        className="hidden"
                                                                                        onChange={(e) =>
                                                                                            handleJFileChange("j_b_file", e)
                                                                                        }
                                                                                    />
                                                                                    <div className="flex flex-wrap gap-3 items-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            className="bg-blue-950 hover:bg-blue-900"
                                                                                            disabled={jFileUploading.j_b_file}
                                                                                            onClick={() =>
                                                                                                jBFileInputRef.current?.click()
                                                                                            }
                                                                                        >
                                                                                            <Plus className="h-4 w-4 mr-2" />
                                                                                            Choose
                                                                                        </Button>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            disabled={
                                                                                                !String(
                                                                                                    field.value ??
                                                                                                        "",
                                                                                                ).trim()
                                                                                            }
                                                                                            onClick={() => {
                                                                                                field.onChange("");
                                                                                                setJFileNames((p) => ({ ...p, j_b_file: "" }));
                                                                                                if (jBFileInputRef.current)
                                                                                                    jBFileInputRef.current.value = "";
                                                                                            }}
                                                                                        >
                                                                                            Cancel
                                                                                        </Button>
                                                                                    </div>
                                                                                    <div className="text-sm text-muted-foreground mt-4">
                                                                                        {jFileUploading.j_b_file
                                                                                            ? "Mengupload..."
                                                                                            : jFileNames.j_b_file
                                                                                              ? `Dipilih: ${jFileNames.j_b_file}`
                                                                                              : "Belum ada file"}
                                                                                    </div>
                                                                                </div>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* c */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_1fr] gap-4 p-4 bg-white items-start border-t">
                                                            <div className="text-sm">
                                                                c. Bukti
                                                                pemotongan/pemungutan
                                                                sehubungan
                                                                dengan kredit
                                                                pajak luar
                                                                negeri
                                                            </div>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="j_c"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                className="flex items-center justify-center gap-6"
                                                                                value={
                                                                                    field.value ===
                                                                                    true
                                                                                        ? "yes"
                                                                                        : field.value ===
                                                                                            false
                                                                                          ? "no"
                                                                                          : ""
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    field.onChange(
                                                                                        v ===
                                                                                            "yes",
                                                                                    )
                                                                                }
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="yes"
                                                                                        id="j_c_yes"
                                                                                    />
                                                                                    <Label htmlFor="j_c_yes">
                                                                                        1.
                                                                                        Yes
                                                                                    </Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="no"
                                                                                        id="j_c_no"
                                                                                    />
                                                                                    <Label htmlFor="j_c_no">
                                                                                        2.
                                                                                        No
                                                                                    </Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            {form.watch(
                                                                "j_c",
                                                            ) === undefined ? (
                                                                <div />
                                                            ) : form.watch(
                                                                  "j_c",
                                                              ) === false ? (
                                                                <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3 w-fit">
                                                                    <div>
                                                                        Tidak
                                                                        ada
                                                                        berkas
                                                                        yang
                                                                        perlu
                                                                        dilampirkan
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-sky-200/70 text-emerald-950 px-4 py-3 rounded flex items-center gap-3 w-fit">
                                                                    <div>
                                                                        Ya,
                                                                        Jumlah
                                                                        Kredit
                                                                        Pajak
                                                                        Penghasilan
                                                                        Luar
                                                                        Negeri
                                                                        Lebih
                                                                        dari 0
                                                                        pada
                                                                        Lampiran
                                                                        L1
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {form.watch("j_c") ===
                                                            true && (
                                                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 p-4 bg-white border-t">
                                                                <div className="text-sm text-muted-foreground">
                                                                    File
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="j_c_file"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <div className="border rounded-md p-4 bg-white">
                                                                                    <input
                                                                                        ref={
                                                                                            jCFileInputRef
                                                                                        }
                                                                                        type="file"
                                                                                        accept=".pdf,application/pdf"
                                                                                        className="hidden"
                                                                                        onChange={(e) =>
                                                                                            handleJFileChange("j_c_file", e)
                                                                                        }
                                                                                    />
                                                                                    <div className="flex flex-wrap gap-3 items-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            className="bg-blue-950 hover:bg-blue-900"
                                                                                            disabled={jFileUploading.j_c_file}
                                                                                            onClick={() =>
                                                                                                jCFileInputRef.current?.click()
                                                                                            }
                                                                                        >
                                                                                            <Plus className="h-4 w-4 mr-2" />
                                                                                            Choose
                                                                                        </Button>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            disabled={
                                                                                                !String(
                                                                                                    field.value ??
                                                                                                        "",
                                                                                                ).trim()
                                                                                            }
                                                                                            onClick={() => {
                                                                                                field.onChange("");
                                                                                                setJFileNames((p) => ({ ...p, j_c_file: "" }));
                                                                                                if (jCFileInputRef.current)
                                                                                                    jCFileInputRef.current.value = "";
                                                                                            }}
                                                                                        >
                                                                                            Cancel
                                                                                        </Button>
                                                                                    </div>
                                                                                    <div className="text-sm text-muted-foreground mt-4">
                                                                                        {jFileUploading.j_c_file
                                                                                            ? "Mengupload..."
                                                                                            : jFileNames.j_c_file
                                                                                              ? `Dipilih: ${jFileNames.j_c_file}`
                                                                                              : "Belum ada file"}
                                                                                    </div>
                                                                                </div>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* d */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_1fr] gap-4 p-4 bg-gray-50 items-start border-t">
                                                            <div className="text-sm">
                                                                d. Surat kuasa
                                                                khusus
                                                            </div>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="j_d"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                className="flex items-center justify-center gap-6"
                                                                                value={
                                                                                    field.value ===
                                                                                    true
                                                                                        ? "yes"
                                                                                        : field.value ===
                                                                                            false
                                                                                          ? "no"
                                                                                          : ""
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    field.onChange(
                                                                                        v ===
                                                                                            "yes",
                                                                                    )
                                                                                }
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="yes"
                                                                                        id="j_d_yes"
                                                                                    />
                                                                                    <Label htmlFor="j_d_yes">
                                                                                        1.
                                                                                        Yes
                                                                                    </Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="no"
                                                                                        id="j_d_no"
                                                                                    />
                                                                                    <Label htmlFor="j_d_no">
                                                                                        2.
                                                                                        No
                                                                                    </Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div />
                                                        </div>
                                                        {form.watch("j_d") ===
                                                            true && (
                                                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 p-4 bg-gray-50 border-t">
                                                                <div className="text-sm text-muted-foreground">
                                                                    File
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="j_d_file"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <div className="border rounded-md p-4 bg-white">
                                                                                    <input
                                                                                        ref={
                                                                                            jDFileInputRef
                                                                                        }
                                                                                        type="file"
                                                                                        accept=".pdf,application/pdf"
                                                                                        className="hidden"
                                                                                        onChange={(e) =>
                                                                                            handleJFileChange("j_d_file", e)
                                                                                        }
                                                                                    />
                                                                                    <div className="flex flex-wrap gap-3 items-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            className="bg-blue-950 hover:bg-blue-900"
                                                                                            disabled={jFileUploading.j_d_file}
                                                                                            onClick={() =>
                                                                                                jDFileInputRef.current?.click()
                                                                                            }
                                                                                        >
                                                                                            <Plus className="h-4 w-4 mr-2" />
                                                                                            Choose
                                                                                        </Button>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            disabled={
                                                                                                !String(
                                                                                                    field.value ??
                                                                                                        "",
                                                                                                ).trim()
                                                                                            }
                                                                                            onClick={() => {
                                                                                                field.onChange("");
                                                                                                setJFileNames((p) => ({ ...p, j_d_file: "" }));
                                                                                                if (jDFileInputRef.current)
                                                                                                    jDFileInputRef.current.value = "";
                                                                                            }}
                                                                                        >
                                                                                            Cancel
                                                                                        </Button>
                                                                                    </div>
                                                                                    <div className="text-sm text-muted-foreground mt-4">
                                                                                        {jFileUploading.j_d_file
                                                                                            ? "Mengupload..."
                                                                                            : jFileNames.j_d_file
                                                                                              ? `Dipilih: ${jFileNames.j_d_file}`
                                                                                              : "Belum ada file"}
                                                                                    </div>
                                                                                </div>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* e */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_1fr] gap-4 p-4 bg-white items-start border-t">
                                                            <div className="text-sm">
                                                                e. Dokumen
                                                                lainnya
                                                            </div>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="j_e"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                className="flex items-center justify-center gap-6"
                                                                                value={
                                                                                    field.value ===
                                                                                    true
                                                                                        ? "yes"
                                                                                        : field.value ===
                                                                                            false
                                                                                          ? "no"
                                                                                          : ""
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    field.onChange(
                                                                                        v ===
                                                                                            "yes",
                                                                                    )
                                                                                }
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="yes"
                                                                                        id="j_e_yes"
                                                                                    />
                                                                                    <Label htmlFor="j_e_yes">
                                                                                        1.
                                                                                        Yes
                                                                                    </Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="no"
                                                                                        id="j_e_no"
                                                                                    />
                                                                                    <Label htmlFor="j_e_no">
                                                                                        2.
                                                                                        No
                                                                                    </Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div />
                                                        </div>
                                                        {form.watch("j_e") ===
                                                            true && (
                                                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4 p-4 bg-gray-50 border-t">
                                                                <div className="text-sm text-muted-foreground">
                                                                    File
                                                                </div>
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="j_e_file"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <div className="border rounded-md p-4 bg-white">
                                                                                    <input
                                                                                        ref={
                                                                                            jEFileInputRef
                                                                                        }
                                                                                        type="file"
                                                                                        accept=".pdf,application/pdf"
                                                                                        className="hidden"
                                                                                        onChange={(e) =>
                                                                                            handleJFileChange("j_e_file", e)
                                                                                        }
                                                                                    />
                                                                                    <div className="flex flex-wrap gap-3 items-center">
                                                                                        <Button
                                                                                            type="button"
                                                                                            className="bg-blue-950 hover:bg-blue-900"
                                                                                            disabled={jFileUploading.j_e_file}
                                                                                            onClick={() =>
                                                                                                jEFileInputRef.current?.click()
                                                                                            }
                                                                                        >
                                                                                            <Plus className="h-4 w-4 mr-2" />
                                                                                            Choose
                                                                                        </Button>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            disabled={
                                                                                                !String(
                                                                                                    field.value ??
                                                                                                        "",
                                                                                                ).trim()
                                                                                            }
                                                                                            onClick={() => {
                                                                                                field.onChange("");
                                                                                                setJFileNames((p) => ({ ...p, j_e_file: "" }));
                                                                                                if (jEFileInputRef.current)
                                                                                                    jEFileInputRef.current.value = "";
                                                                                            }}
                                                                                        >
                                                                                            Cancel
                                                                                        </Button>
                                                                                    </div>
                                                                                    <div className="text-sm text-muted-foreground mt-4">
                                                                                        {jFileUploading.j_e_file
                                                                                            ? "Mengupload..."
                                                                                            : jFileNames.j_e_file
                                                                                              ? `Dipilih: ${jFileNames.j_e_file}`
                                                                                              : "Belum ada file"}
                                                                                    </div>
                                                                                </div>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* K. PERNYATAAN */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="pernyataan"
                                        >
                                            <AccordionItem value="pernyataan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    K. PERNYATAAN
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 bg-white w-full">
                                                    <div className="space-y-5">
                                                        <div className="bg-sky-200/70 text-sky-950 px-4 py-3 rounded flex items-center gap-3 w-fit">
                                                            <Info className="h-5 w-5" />
                                                            <div>
                                                                Status SPT :{" "}
                                                                {Number(
                                                                    form.watch(
                                                                        "e_11_c",
                                                                    ) ?? 0,
                                                                ) > 0
                                                                    ? "Kurang Bayar"
                                                                    : Number(
                                                                            form.watch(
                                                                                "e_11_c",
                                                                            ) ??
                                                                                0,
                                                                        ) < 0
                                                                      ? "Lebih Bayar"
                                                                      : "Nihil"}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <Checkbox
                                                                id="pernyataan"
                                                                checked={
                                                                    pernyataanSetuju
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    setPernyataanSetuju(
                                                                        checked as boolean,
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="pernyataan"
                                                                className="text-sm italic font-semibold leading-5"
                                                            >
                                                                Dengan menyadari
                                                                sepenuhnya akan
                                                                segala akibatnya
                                                                termasuk
                                                                sanksi-sanksi
                                                                sesuai dengan
                                                                ketentuan
                                                                perundang-undangan
                                                                yang berlaku,
                                                                saya menyatakan
                                                                bahwa apa yang
                                                                telah saya
                                                                beritahukan di
                                                                atas beserta
                                                                lampiran-lampirannya
                                                                adalah benar,
                                                                lengkap, dan
                                                                jelas.
                                                            </label>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 items-center pt-2">
                                                            <div className="text-sm">
                                                                Penandatangan
                                                            </div>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="k_signer"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                onValueChange={
                                                                                    field.onChange
                                                                                }
                                                                                defaultValue={
                                                                                    field.value
                                                                                }
                                                                                className="flex gap-6"
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="taxpayer"
                                                                                        id="taxpayer"
                                                                                    />
                                                                                    <Label htmlFor="taxpayer">
                                                                                        Wajib
                                                                                        Pajak
                                                                                    </Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="representative"
                                                                                        id="representative"
                                                                                    />
                                                                                    <Label htmlFor="representative">
                                                                                        Kuasa
                                                                                        Wajib
                                                                                        Pajak
                                                                                    </Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <div className="text-sm">
                                                                NPWP
                                                            </div>
                                                            {form.watch(
                                                                "k_signer",
                                                            ) ===
                                                            "representative" ? (
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="k_signer_id"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={
                                                                                        field.value ||
                                                                                        ""
                                                                                    }
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            ) : (
                                                                <Input
                                                                    value={
                                                                        user.npwp ||
                                                                        ""
                                                                    }
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            )}

                                                            <div className="text-sm">
                                                                Nama Lengkap
                                                            </div>
                                                            {form.watch(
                                                                "k_signer",
                                                            ) ===
                                                            "representative" ? (
                                                                <FormField
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="k_signer_name"
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={
                                                                                        field.value ||
                                                                                        ""
                                                                                    }
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            ) : (
                                                                <Input
                                                                    value={
                                                                        user.name ||
                                                                        ""
                                                                    }
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            )}

                                                            <div className="text-sm">
                                                                Tanda Tangan
                                                            </div>
                                                            <div className="h-10" />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </TabsContent>

                                {/* TAB LAMPIRAN 1 - HARTA DAN KEWAJIBAN */}
                                <TabsContent value="lampiran1">
                                    <TabL1
                                        user={{
                                            ...user,
                                            address: user.address ?? "",
                                            npwp: user.npwp ?? "",
                                        }}
                                        spt={{
                                            ...spt,
                                            year: Number(spt.year),
                                        }}
                                        sptOp={sptOp}
                                        lampiranData={lampiranData}
                                    />
                                </TabsContent>

                                {/* TAB LAMPIRAN 2 - KREDIT PAJAK */}
                                {isL2Enabled ? (
                                    <TabsContent value="lampiran2">
                                        <TabL2
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOp={sptOp}
                                            lampiranData={lampiranData}
                                            masterObjects={masterObjects}
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* TAB LAMPIRAN 3A-1/2/3 - REKONSILIASI (muncul sesuai sektor induk 1.b.4) */}
                                {sektor === "dagang" ? (
                                    <TabsContent value="lampiran3a1">
                                        <TabL3A1
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts as any
                                            }
                                            l3a13a1={
                                                lampiranData?.l3a13a1 ?? []
                                            }
                                            l3a13a2={
                                                lampiranData?.l3a13a2 ?? []
                                            }
                                        />
                                    </TabsContent>
                                ) : null}

                                {sektor === "jasa" ? (
                                    <TabsContent value="lampiran3a2">
                                        <TabL3A2
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts as any
                                            }
                                            l3a13a1={
                                                lampiranData?.l3a13a1 ?? []
                                            }
                                            l3a13a2={
                                                lampiranData?.l3a13a2 ?? []
                                            }
                                        />
                                    </TabsContent>
                                ) : null}

                                {sektor === "industri" ? (
                                    <TabsContent value="lampiran3a3">
                                        <TabL3A3
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts as any
                                            }
                                            l3a13a1={
                                                lampiranData?.l3a13a1 ?? []
                                            }
                                            l3a13a2={
                                                lampiranData?.l3a13a2 ?? []
                                            }
                                        />
                                    </TabsContent>
                                ) : null}

                                {isL3A4Enabled ? (
                                    <TabsContent value="lampiran3a4">
                                        <TabL3A4
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            masterTku={masterTku as any}
                                            masterObjects={masterObjects as any}
                                            l3a4a={lampiranData?.l3a4a ?? []}
                                            l3a4b={lampiranData?.l3a4b ?? []}
                                            onBTotalChange={setL3a4bTotal}
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* TAB LAMPIRAN 3B - PP23/55 */}
                                {isL3BEnabled ? (
                                    <TabsContent value="lampiran3b">
                                        <TabL3B
                                            user={{
                                                npwp: user.npwp ?? "",
                                                name: user.name ?? "",
                                                address: user.address ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            masterTku={masterTku as any}
                                            masterObjects={masterObjects as any}
                                            l3b={lampiranData?.l3b ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* TAB LAMPIRAN 3C - Penyusutan/Amortisasi */}
                                {isL3CEnabled ? (
                                    <TabsContent value="lampiran3c">
                                        <TabL3C
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            l3c={
                                                (lampiranData?.l3c ?? []) as any
                                            }
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* TAB LAMPIRAN 3D - Daftar Nominatif */}
                                {isL3DEnabled ? (
                                    <TabsContent value="lampiran3d">
                                        <TabL3D
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            l3da={
                                                (lampiranData?.l3da ??
                                                    []) as any
                                            }
                                            l3db={
                                                (lampiranData?.l3db ??
                                                    []) as any
                                            }
                                            l3dc={
                                                (lampiranData?.l3dc ??
                                                    []) as any
                                            }
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* TAB LAMPIRAN 4 */}
                                {isL4Enabled ? (
                                    <TabsContent value="lampiran4">
                                        <TabL4A
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            l4a={
                                                (lampiranData?.l4a ??
                                                    null) as any
                                            }
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* TAB LAMPIRAN 5 */}
                                {isL5Enabled ? (
                                    <TabsContent value="lampiran5">
                                        <TabL5
                                            user={{ npwp: user.npwp ?? "" }}
                                            spt={{ year: Number(spt.year) }}
                                            sptOpId={sptOp?.id ?? ""}
                                            l5a={
                                                (lampiranData?.l5a ?? []) as any
                                            }
                                            l5bc={
                                                (lampiranData?.l5bc ??
                                                    []) as any
                                            }
                                        />
                                    </TabsContent>
                                ) : null}
                            </Tabs>

                            {/* Action Buttons */}
                            {spt.status === "created" && (
                                <div className="mt-8 space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-start">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                toast.success("Berhasil disimpan");
                                                router.visit(route("spt.konsep"));
                                            }}
                                            className="bg-blue-950 hover:bg-blue-900"
                                        >
                                            Simpan Konsep
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!pernyataanSetuju}
                                            className="bg-blue-950 hover:bg-blue-900"
                                        >
                                            Bayar dan Lapor
                                        </Button>
                                    </div>
                                    <Link
                                        href={route("spt.konsep")}
                                        className="text-blue-950 font-medium inline-block hover:underline"
                                    >
                                        Pergi ke pencarian
                                    </Link>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            </div>

            {/* Payment Dialog */}
            <PaymentDialog
                open={openModalPayment}
                total={total}
                saldo={userSaldo}
                onClose={() => setOpenModalPayment(false)}
                onConfirmDeposit={() => handlePaymentConfirm("deposit")}
                onConfirmBilling={() => handlePaymentConfirm("billing")}
                onConfirmSpt={() => handlePaymentConfirm("spt")}
                title="Konfirmasi Pembayaran"
                description="Pilih metode pembayaran untuk melanjutkan."
            />

            {/* Password Verification Dialog */}
            <PasswordVerificationDialog
                open={openPasswordModal}
                onClose={() => setOpenPasswordModal(false)}
                onConfirm={handlePasswordConfirm}
            />

            {/* Bank Selection Dialog */}
            <Dialog open={openBankModal} onOpenChange={setOpenBankModal}>
                <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Pilih Rekening Bank</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto">
                        {/* Toolbar */}
                        <div className="flex items-center gap-2 mb-4 p-2 bg-blue-950 rounded">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={fetchBanks}
                                className="text-white hover:bg-blue-900"
                            >
                                <RefreshCw
                                    className={cn(
                                        "h-4 w-4",
                                        isLoadingBanks && "animate-spin",
                                    )}
                                />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={resetBankFilters}
                                className="text-white hover:bg-blue-900"
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                            <p className="text-sm text-white/80">
                                Kelola bank di menu
                            </p>
                            <Button
                                asChild
                                variant="secondary"
                                size="sm"
                                className="bg-white text-blue-900 hover:bg-amber-300"
                            >
                                <Link href={route("banks")}>
                                    Dashboard &gt; Bank Saya
                                </Link>
                            </Button>
                        </div>

                        {/* Bank Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-amber-400">
                                    <TableRow>
                                        <TableHead className="text-black font-semibold">
                                            Aksi
                                        </TableHead>
                                        <TableHead className="text-black font-semibold">
                                            Nama Bank
                                        </TableHead>
                                        <TableHead className="text-black font-semibold">
                                            Nomor Rekening Bank
                                        </TableHead>
                                        <TableHead className="text-black font-semibold">
                                            Jenis Rekening Bank
                                        </TableHead>
                                        <TableHead className="text-black font-semibold">
                                            Apakah Rekening Bank Utama
                                        </TableHead>
                                        <TableHead className="text-black font-semibold">
                                            Keterangan
                                        </TableHead>
                                        <TableHead className="text-black font-semibold">
                                            Tanggal Mulai
                                        </TableHead>
                                        <TableHead className="text-black font-semibold">
                                            Tanggal Berakhir
                                        </TableHead>
                                    </TableRow>
                                    {/* Filter Row */}
                                    <TableRow className="bg-white">
                                        <TableHead></TableHead>
                                        <TableHead>
                                            <Select
                                                value={
                                                    bankFilters.bank_name ||
                                                    ALL_OPTION
                                                }
                                                onValueChange={(value) =>
                                                    setBankFilters({
                                                        ...bankFilters,
                                                        bank_name:
                                                            value === ALL_OPTION
                                                                ? ""
                                                                : value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Pilih Nama Bank" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={ALL_OPTION}
                                                    >
                                                        Semua
                                                    </SelectItem>
                                                    {[
                                                        ...new Set(
                                                            banks.map(
                                                                (b) =>
                                                                    b.bank_name,
                                                            ),
                                                        ),
                                                    ].map((name) => (
                                                        <SelectItem
                                                            key={name}
                                                            value={name}
                                                        >
                                                            {name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableHead>
                                        <TableHead>
                                            <Input
                                                className="h-8"
                                                placeholder=""
                                                value={
                                                    bankFilters.account_number
                                                }
                                                onChange={(e) =>
                                                    setBankFilters({
                                                        ...bankFilters,
                                                        account_number:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <Select
                                                value={
                                                    bankFilters.account_type ||
                                                    ALL_OPTION
                                                }
                                                onValueChange={(value) =>
                                                    setBankFilters({
                                                        ...bankFilters,
                                                        account_type:
                                                            value === ALL_OPTION
                                                                ? ""
                                                                : value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Pilih Jenis Rekening Bank" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={ALL_OPTION}
                                                    >
                                                        Semua
                                                    </SelectItem>
                                                    <SelectItem value="tabungan">
                                                        Tabungan
                                                    </SelectItem>
                                                    <SelectItem value="giro">
                                                        Giro
                                                    </SelectItem>
                                                    <SelectItem value="deposito">
                                                        Deposito
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>
                                            <Input
                                                className="h-8"
                                                placeholder=""
                                                value={bankFilters.description}
                                                onChange={(e) =>
                                                    setBankFilters({
                                                        ...bankFilters,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <Popover
                                                open={bankStartOpen}
                                                onOpenChange={setBankStartOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "h-8 w-full justify-start text-left font-normal",
                                                            !bankFilters.start_date &&
                                                                "text-muted-foreground",
                                                        )}
                                                        onClick={() =>
                                                            setBankStartOpen(
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        {bankFilters.start_date ? (
                                                            bankFilters.start_date
                                                        ) : (
                                                            <span>
                                                                Pilih tanggal
                                                                mulai
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            bankFilters.start_date
                                                                ? new Date(
                                                                      bankFilters.start_date,
                                                                  )
                                                                : undefined
                                                        }
                                                        onSelect={(date) => {
                                                            setBankFilters({
                                                                ...bankFilters,
                                                                start_date: date
                                                                    ? format(
                                                                          date,
                                                                          "yyyy-MM-dd",
                                                                      )
                                                                    : "",
                                                            });
                                                            setBankStartOpen(
                                                                false,
                                                            );
                                                        }}
                                                        fromDate={minBankDate}
                                                        toDate={maxBankDate}
                                                        disabled={(date) =>
                                                            date <
                                                                minBankDate ||
                                                            date > maxBankDate
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </TableHead>
                                        <TableHead>
                                            <Popover
                                                open={bankEndOpen}
                                                onOpenChange={setBankEndOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "h-8 w-full justify-start text-left font-normal",
                                                            !bankFilters.end_date &&
                                                                "text-muted-foreground",
                                                        )}
                                                        onClick={() =>
                                                            setBankEndOpen(true)
                                                        }
                                                    >
                                                        {bankFilters.end_date ? (
                                                            bankFilters.end_date
                                                        ) : (
                                                            <span>
                                                                Pilih tanggal
                                                                berakhir
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            bankFilters.end_date
                                                                ? new Date(
                                                                      bankFilters.end_date,
                                                                  )
                                                                : undefined
                                                        }
                                                        onSelect={(date) => {
                                                            setBankFilters({
                                                                ...bankFilters,
                                                                end_date: date
                                                                    ? format(
                                                                          date,
                                                                          "yyyy-MM-dd",
                                                                      )
                                                                    : "",
                                                            });
                                                            setBankEndOpen(
                                                                false,
                                                            );
                                                        }}
                                                        fromDate={minBankDate}
                                                        toDate={maxBankDate}
                                                        disabled={(date) =>
                                                            date <
                                                                minBankDate ||
                                                            date > maxBankDate
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBanks.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-4 text-gray-500"
                                            >
                                                Tidak ada data bank yg
                                                ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBanks.map((bank) => (
                                            <TableRow
                                                key={bank.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleSelectBank(
                                                                bank,
                                                            )
                                                        }
                                                    >
                                                        Pilih
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    {bank.bank_name}
                                                </TableCell>
                                                <TableCell>
                                                    {bank.account_number}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {bank.account_type}
                                                </TableCell>
                                                <TableCell>
                                                    {bank.is_primary
                                                        ? "Ya"
                                                        : "Tidak"}
                                                </TableCell>
                                                <TableCell>
                                                    {bank.description || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {bank.start_date
                                                        ? format(
                                                              new Date(
                                                                  bank.start_date,
                                                              ),
                                                              "dd/MM/yyyy",
                                                          )
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {bank.end_date
                                                        ? format(
                                                              new Date(
                                                                  bank.end_date,
                                                              ),
                                                              "dd/MM/yyyy",
                                                          )
                                                        : "-"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination info */}
                        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                            <span>
                                Menampilkan {filteredBanks.length} dari{" "}
                                {banks.length} entri
                            </span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenBankModal(false)}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Batal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Authenticated>
    );
};

export default DetailSPTOP;
