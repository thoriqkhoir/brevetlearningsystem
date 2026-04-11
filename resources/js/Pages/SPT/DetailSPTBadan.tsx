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
import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Check, ChevronsUpDown, FolderOpen, Info } from "lucide-react";
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
import {
    TabL1A,
    TabL1B,
    TabL1C,
    TabL1D,
    TabL1E,
    TabL1F,
    TabL1G,
    TabL1H,
    TabL1I,
    TabL1J,
    TabL1K,
    TabL1L,
} from "./TablistBadan/L1";
import {
    type L1A1Item,
    type L1A2Item,
    type L1ALayout,
} from "./TablistBadan/L1";
import { SectionL2A } from "./TablistBadan/L2";
import { SectionL2B } from "./TablistBadan/L2";
import { type L2AItem } from "./TablistBadan/L2";
import { type L2BItem } from "./TablistBadan/L2";
import { SectionL3A, SectionL3B } from "./TablistBadan/L3";
import { type L3AItem, type L3BItem } from "./TablistBadan/L3";
import { SectionL4A, SectionL4B } from "./TablistBadan/L4";
import { type L4AItem, type L4BItem } from "./TablistBadan/L4";
import { SectionL5A, SectionL5B } from "./TablistBadan/L5";
import { type L5AItem, type L5BItem } from "./TablistBadan/L5";
import { TabL6 } from "./TablistBadan/L6";
import { SectionL7 } from "./TablistBadan/L7";
import { type L7Item } from "./TablistBadan/L7";
import { TabL8 } from "./TablistBadan/L8";
import { SectionL9 } from "./TablistBadan/L9";
import { type L9Item } from "./TablistBadan/L9";
import { SectionL10A, TabL10B, SectionL10C, TabL10D } from "./TablistBadan/L10";
import { TabL11A } from "./TablistBadan/L11A";
import { TabL11B } from "./TablistBadan/L11B";
import { TabL11C } from "./TablistBadan/L11C";
import { TabL12A } from "./TablistBadan/L12A";
import { TabL12B } from "./TablistBadan/L12B";
import type {
    L12B12Item,
    L12B3Item,
    L12B4Item,
    L12B5Item,
    L12B6Item,
    L12B7Item,
    L12B8Item,
} from "./TablistBadan/L12B";
import { TabL13A } from "./TablistBadan/L13A";
import type { L13AItem } from "./TablistBadan/L13A";
import { TabL13B } from "./TablistBadan/L13B";
import type {
    L13BAItem,
    L13BBItem,
    L13BCItem,
    L13BDItem,
} from "./TablistBadan/L13B";
import { TabL13C } from "./TablistBadan/L13C";
import type { L13CItem } from "./TablistBadan/L13C";
import { TabL14 } from "./TablistBadan/L14";
import type { L14Item } from "./TablistBadan/L14";
import {
    type L10AItem,
    type L10BData,
    type L10CItem,
    type L10DData,
} from "./TablistBadan/L10";
import type {
    L11A1Item,
    L11A2Item,
    L11A3Item,
    L11A4AItem,
    L11A4BData,
    L11A5Item,
} from "./TablistBadan/L11A";
import type {
    L11B1Data,
    L11B2AItem,
    L11B2BItem,
    L11B3Item,
} from "./TablistBadan/L11B";
import type { L11CItem } from "./TablistBadan/L11C";
import type { L12AData } from "./TablistBadan/L12A";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

// ----------------------------
// Zod Schema for SPT Badan Induk
// ----------------------------
const nullableStringField = z.preprocess(
    (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === "string") return value;
        if (typeof value === "number") return String(value);
        return value;
    },
    z.string().nullable().optional(),
);

const sptBadanIndukSchema = z.object({
    spt_id: z.string().uuid(),

    // Header
    type_of_bookkeeping: z.enum([
        "pembukuan stelsel akrual",
        "pembukuan stelsel kas",
        "pencatatan",
    ]),

    // B - Identitas Usaha / Perubahan
    b_1a: nullableStringField,
    b_2: z.boolean().optional(),
    b_2a: nullableStringField,
    b_2b: nullableStringField,
    b_2c: nullableStringField,

    // C - Fasilitas Perpajakan
    c_1a: z.boolean().optional(),
    c_1b: z.boolean().optional(),
    c_2: z.boolean().optional(),
    c_2_value: z.number().int(),
    c_3: z.boolean().optional(),
    c_3_value: z.number().int(),

    // D - PPh Terutang
    d_4: z.number().int(),
    d_5: z.boolean().optional(),
    d_5_value: z.number().int(),
    d_6: z.boolean().optional(),
    d_6_value: z.number().int(),
    d_7: z.number().int(),
    d_8: z.boolean().optional(),
    d_8_value: z.number().int(),
    d_9: z.number().int(),
    d_10: z.boolean().optional(),
    d_10_value: z.number().int(),
    d_11: nullableStringField,
    d_11_percentage: z.coerce.number(),
    d_12: z.number().int(),

    // E - Kredit Pajak
    e_13: z.boolean().optional(),
    e_13_value: z.number().int(),
    e_14: z.number().int(),
    e_15: z.number().int(),
    e_16: z.boolean().optional(),
    e_16_value: z.number().int(),

    // F - PPh Kurang/Lebih Bayar
    f_17a: z.number().int(),
    f_17b: z.boolean().optional(),
    f_17b_value: z.number().int(),
    f_17c: z.number().int(),
    f_18a: z.boolean().optional(),
    f_18a_value: z.number().int(),
    f_18b: z.number().int(),
    f_19a: nullableStringField,

    // Bank / Return Info
    account_number: nullableStringField,
    bank_name: nullableStringField,
    account_name: nullableStringField,

    // G - Angsuran PPh 25
    g_20: z.boolean().optional(),
    g_20_value: z.number().int(),

    // H - Pernyataan Transaksi
    h_21_a: z.boolean().optional(),
    h_21_b: z.boolean().optional(),
    h_21_c: z.boolean().optional(),
    h_21_d: z.boolean().optional(),
    h_21_e: z.boolean().optional(),
    h_21_f: z.boolean().optional(),
    h_21_g: z.boolean().optional(),
    h_21_h: z.boolean().optional(),
    h_21_i: z.boolean().optional(),
    h_21_j: z.number().int(),

    // Lampiran Checklist (H = f_21 in DB)
    f_21a: z.boolean().optional(),
    f_21b: z.boolean().optional(),
    f_21c: z.boolean().optional(),
    f_21d: z.boolean().optional(),
    f_21e: z.boolean().optional(),
    f_21f: z.boolean().optional(),
    f_21g: z.boolean().optional(),
    f_21h: z.boolean().optional(),
    f_21i: z.boolean().optional(),
    f_21j: z.number().int(),

    // I - Informasi / Pernyataan
    i_a_1: nullableStringField,
    i_a_2: nullableStringField,
    i_b: nullableStringField,
    i_c: nullableStringField,
    i_d: nullableStringField,
    i_e: nullableStringField,
    i_f: nullableStringField,
    i_f_1: nullableStringField,
    i_f_2: nullableStringField,
    i_f_3: nullableStringField,
    i_f_4: nullableStringField,
    i_g: nullableStringField,
    i_h_1: nullableStringField,
    i_h_2: nullableStringField,
    i_i: nullableStringField,
    i_j: nullableStringField,

    // J - Penandatangan
    j_signer: z.enum(["taxpayer", "representative"]),
    j_signer_id: nullableStringField,
    j_signer_name: nullableStringField,
    j_signer_position: nullableStringField,

    // Submit
    password: z.string(),
    payment_method: z.string(),
});

type SptBadanFormValues = z.infer<typeof sptBadanIndukSchema>;

// Fields that trigger auto-save
const AUTO_SAVE_FIELDS = new Set<keyof z.infer<typeof sptBadanIndukSchema>>([
    "type_of_bookkeeping",
    "b_1a",
    "b_2",
    "b_2a",
    "c_1a",
    "c_1b",
    "c_2",
    "c_3",
    "d_5",
    "d_6",
    "d_8",
    "d_10",
    "d_11",
    "d_11_percentage",
    "e_13",
    "e_16",
    "f_17b",
    "f_18a",
    "f_19a",
    "g_20",
    "h_21_a",
    "h_21_b",
    "h_21_c",
    "h_21_d",
    "h_21_e",
    "h_21_f",
    "h_21_g",
    "h_21_h",
    "h_21_i",
    "j_signer",
]);

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

interface SptBadanData {
    id: string;
    spt_id: string;
    bank_id: string | null;
    type_of_bookkeeping: string;
    b_1a: string | null;
    b_2: boolean | null;
    b_2a: string | null;
    b_2b: string | null;
    b_2c: string | null;
    c_1a: boolean | null;
    c_1b: boolean | null;
    c_2: boolean | null;
    c_2_value: number;
    c_3: boolean | null;
    c_3_value: number;
    d_4: number;
    d_5: boolean | null;
    d_5_value: number;
    d_6: boolean | null;
    d_6_value: number;
    d_7: number;
    d_8: boolean | null;
    d_8_value: number;
    d_9: number;
    d_10: boolean | null;
    d_10_value: number;
    d_11: string | null;
    d_11_percentage: number;
    d_12: number;
    e_13: boolean | null;
    e_13_value: number;
    e_14: number;
    e_15: number;
    e_16: boolean | null;
    e_16_value: number;
    f_17a: number;
    f_17b: boolean | null;
    f_17b_value: number;
    f_17c: number;
    f_18a: boolean | null;
    f_18a_value: number;
    f_18b: number;
    f_19a: string | null;
    account_number: string | null;
    bank_name: string | null;
    account_name: string | null;
    g_20: boolean | null;
    g_20_value: number;
    f_21a: boolean | null;
    f_21b: boolean | null;
    f_21c: boolean | null;
    f_21d: boolean | null;
    f_21e: boolean | null;
    f_21f: boolean | null;
    f_21g: boolean | null;
    f_21h: boolean | null;
    f_21i: boolean | null;
    f_21j: number;
    i_a_1: string | null;
    i_a_2: string | null;
    i_b: string | null;
    i_c: string | null;
    h_21_a: boolean | null;
    h_21_b: boolean | null;
    h_21_c: boolean | null;
    h_21_d: boolean | null;
    h_21_e: boolean | null;
    h_21_f: boolean | null;
    h_21_g: boolean | null;
    h_21_h: boolean | null;
    h_21_i: boolean | null;
    h_21_j: number;
    i_d: string | null;
    i_e: string | null;
    i_f: string | null;
    i_f_1: string | null;
    i_f_2: string | null;
    i_f_3: string | null;
    i_f_4: string | null;
    i_g: string | null;
    i_h_1: string | null;
    i_h_2: string | null;
    i_i: string | null;
    i_j: string | null;
    j_signer: string;
    j_signer_id: string | null;
    j_signer_name: string | null;
    j_signer_position: string | null;
}

interface DetailSPTBadanProps {
    spt: SPTColumns & { user?: any };
    sptBadan: SptBadanData | null;
    activeBusinessEntity?: {
        id: string;
        name: string;
        npwp: string;
        address?: string | null;
        email?: string | null;
        phone_number?: string | null;
    } | null;
    saldo: number;
    transactionNumber: string;
    banks: Bank[];
    masterAccounts?: any[];
    l1aLayout?: L1ALayout;
    l1bLayout?: L1ALayout;
    l1cLayout?: L1ALayout;
    l1dLayout?: L1ALayout;
    l1eLayout?: L1ALayout;
    l1fLayout?: L1ALayout;
    l1gLayout?: L1ALayout;
    l1hLayout?: L1ALayout;
    l1iLayout?: L1ALayout;
    l1jLayout?: L1ALayout;
    l1kLayout?: L1ALayout;
    l1lLayout?: L1ALayout;
    l1a1?: L1A1Item[];
    l1a2?: L1A2Item[];
    l2a?: L2AItem[];
    l2b?: L2BItem[];
    l3a?: L3AItem[];
    l3b?: L3BItem[];
    l4a?: L4AItem[];
    l4b?: L4BItem[];
    l5a?: L5AItem[];
    l5b?: L5BItem[];
    l6?: Record<string, any> | null;
    l7?: L7Item[];
    l8?: Record<string, any> | null;
    l9?: L9Item[];
    l10a?: L10AItem[];
    l10b?: L10BData | null;
    l10c?: L10CItem[];
    l10d?: L10DData | null;
    l11a1?: L11A1Item[];
    l11a2?: L11A2Item[];
    l11a3?: L11A3Item[];
    l11a4a?: L11A4AItem[];
    l11a4b?: L11A4BData | null;
    l11a5?: L11A5Item[];
    l11b1?: L11B1Data | null;
    l11b2a?: L11B2AItem[];
    l11b2b?: L11B2BItem[];
    l11b3?: L11B3Item[];
    l11c?: L11CItem[];
    l12a?: L12AData | null;
    l12b12?: L12B12Item[];
    l12b3?: L12B3Item[];
    l12b4?: L12B4Item[];
    l12b5?: L12B5Item[];
    l12b6?: L12B6Item[];
    l12b7?: L12B7Item[];
    l12b8?: L12B8Item[];
    l13a?: L13AItem[];
    l13ba?: L13BAItem[];
    l13bb?: L13BBItem | null;
    l13bc?: L13BCItem[];
    l13bd?: L13BDItem | null;
    l13c?: L13CItem[];
    l14?: L14Item[];
}

const DetailSPTBadan = ({
    spt,
    sptBadan,
    activeBusinessEntity,
    saldo,
    transactionNumber,
    banks: initialBanks,
    masterAccounts,
    l1aLayout,
    l1bLayout,
    l1cLayout,
    l1dLayout,
    l1eLayout,
    l1fLayout,
    l1gLayout,
    l1hLayout,
    l1iLayout,
    l1jLayout,
    l1kLayout,
    l1lLayout,
    l1a1,
    l1a2,
    l2a,
    l2b,
    l3a,
    l3b,
    l4a,
    l4b,
    l5a,
    l5b,
    l6,
    l7,
    l8,
    l9,
    l10a,
    l10b,
    l10c,
    l10d,
    l11a1,
    l11a2,
    l11a3,
    l11a4a,
    l11a4b,
    l11a5,
    l11b1,
    l11b2a,
    l11b2b,
    l11b3,
    l11c,
    l12a,
    l12b12,
    l12b3,
    l12b4,
    l12b5,
    l12b6,
    l12b7,
    l12b8,
    l13a,
    l13ba,
    l13bb,
    l13bc,
    l13bd,
    l13c,
    l14,
}: DetailSPTBadanProps) => {
    const pageProps = usePage().props as any;
    const user = pageProps.auth.user as any;
    const entityIdentity =
        activeBusinessEntity ??
        (pageProps?.active_business_entity
            ? {
                  ...pageProps.active_business_entity,
                  email: user?.email,
                  phone_number: user?.phone_number,
              }
            : null);
    const { flash }: any = pageProps;

    const [activeTab, setActiveTab] = useState<string>("induk");
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
    const autoSaveTimeoutRef = useRef<number | null>(null);

    // I - Lampiran Lainnya file upload infrastructure
    type IFileField =
        | "i_a_1"
        | "i_a_2"
        | "i_b"
        | "i_c"
        | "i_d"
        | "i_e"
        | "i_f"
        | "i_f_1"
        | "i_f_2"
        | "i_f_3"
        | "i_f_4"
        | "i_g"
        | "i_h_1"
        | "i_h_2"
        | "i_i"
        | "i_j";
    const iA1FileInputRef = useRef<HTMLInputElement>(null);
    const iA2FileInputRef = useRef<HTMLInputElement>(null);
    const iBFileInputRef = useRef<HTMLInputElement>(null);
    const iCFileInputRef = useRef<HTMLInputElement>(null);
    const iDFileInputRef = useRef<HTMLInputElement>(null);
    const iEFileInputRef = useRef<HTMLInputElement>(null);
    const iFFileInputRef = useRef<HTMLInputElement>(null);
    const iF1FileInputRef = useRef<HTMLInputElement>(null);
    const iF2FileInputRef = useRef<HTMLInputElement>(null);
    const iF3FileInputRef = useRef<HTMLInputElement>(null);
    const iF4FileInputRef = useRef<HTMLInputElement>(null);
    const iGFileInputRef = useRef<HTMLInputElement>(null);
    const iH1FileInputRef = useRef<HTMLInputElement>(null);
    const iH2FileInputRef = useRef<HTMLInputElement>(null);
    const iIFileInputRef = useRef<HTMLInputElement>(null);
    const iJFileInputRef = useRef<HTMLInputElement>(null);

    const iFileRefMap: Record<IFileField, React.RefObject<HTMLInputElement>> = {
        i_a_1: iA1FileInputRef,
        i_a_2: iA2FileInputRef,
        i_b: iBFileInputRef,
        i_c: iCFileInputRef,
        i_d: iDFileInputRef,
        i_e: iEFileInputRef,
        i_f: iFFileInputRef,
        i_f_1: iF1FileInputRef,
        i_f_2: iF2FileInputRef,
        i_f_3: iF3FileInputRef,
        i_f_4: iF4FileInputRef,
        i_g: iGFileInputRef,
        i_h_1: iH1FileInputRef,
        i_h_2: iH2FileInputRef,
        i_i: iIFileInputRef,
        i_j: iJFileInputRef,
    };

    const iFileUploadingInit: Record<IFileField, boolean> = {
        i_a_1: false,
        i_a_2: false,
        i_b: false,
        i_c: false,
        i_d: false,
        i_e: false,
        i_f: false,
        i_f_1: false,
        i_f_2: false,
        i_f_3: false,
        i_f_4: false,
        i_g: false,
        i_h_1: false,
        i_h_2: false,
        i_i: false,
        i_j: false,
    };
    const [iFileUploading, setIFileUploading] =
        useState<Record<IFileField, boolean>>(iFileUploadingInit);

    const iFileNamesInit: Record<IFileField, string> = {
        i_a_1: sptBadan?.i_a_1 ? (sptBadan.i_a_1.split("/").pop() ?? "") : "",
        i_a_2: sptBadan?.i_a_2 ? (sptBadan.i_a_2.split("/").pop() ?? "") : "",
        i_b: sptBadan?.i_b ? (sptBadan.i_b.split("/").pop() ?? "") : "",
        i_c: sptBadan?.i_c ? (sptBadan.i_c.split("/").pop() ?? "") : "",
        i_d: sptBadan?.i_d ? (sptBadan.i_d.split("/").pop() ?? "") : "",
        i_e: sptBadan?.i_e ? (sptBadan.i_e.split("/").pop() ?? "") : "",
        i_f: sptBadan?.i_f ? (sptBadan.i_f.split("/").pop() ?? "") : "",
        i_f_1: sptBadan?.i_f_1 ? (sptBadan.i_f_1.split("/").pop() ?? "") : "",
        i_f_2: sptBadan?.i_f_2 ? (sptBadan.i_f_2.split("/").pop() ?? "") : "",
        i_f_3: sptBadan?.i_f_3 ? (sptBadan.i_f_3.split("/").pop() ?? "") : "",
        i_f_4: sptBadan?.i_f_4 ? (sptBadan.i_f_4.split("/").pop() ?? "") : "",
        i_g: sptBadan?.i_g ? (sptBadan.i_g.split("/").pop() ?? "") : "",
        i_h_1: sptBadan?.i_h_1 ? (sptBadan.i_h_1.split("/").pop() ?? "") : "",
        i_h_2: sptBadan?.i_h_2 ? (sptBadan.i_h_2.split("/").pop() ?? "") : "",
        i_i: sptBadan?.i_i ? (sptBadan.i_i.split("/").pop() ?? "") : "",
        i_j: sptBadan?.i_j ? (sptBadan.i_j.split("/").pop() ?? "") : "",
    };
    const [iFileNames, setIFileNames] =
        useState<Record<IFileField, string>>(iFileNamesInit);

    const getIFileRef = (field: IFileField) => iFileRefMap[field];

    const uploadIAttachment = async (field: IFileField, file: File) => {
        if (!sptBadan?.id) {
            toast.error("Data SPT Badan belum siap");
            return;
        }
        if (file.type !== "application/pdf") {
            toast.error("File harus berformat PDF");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Ukuran file maksimal 10MB");
            return;
        }

        setIFileUploading((prev) => ({ ...prev, [field]: true }));
        try {
            const formData = new FormData();
            formData.append("spt_badan_id", String(sptBadan.id));
            formData.append("field", field);
            formData.append("file", file);

            const response = await axios.post(
                route("spt.badan.upload-attachment"),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );

            const path = response.data?.path ?? "";
            const originalName = response.data?.original_name ?? file.name;

            form.setValue(field as any, path);
            setIFileNames((prev) => ({ ...prev, [field]: originalName }));
            toast.success("File berhasil diunggah");
        } catch {
            toast.error("Gagal mengunggah file");
        } finally {
            setIFileUploading((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleIFileChange = async (
        field: IFileField,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        await uploadIAttachment(field, selectedFile);
    };

    const deleteIAttachment = async (
        field: IFileField,
        inputRef: React.RefObject<HTMLInputElement>,
    ) => {
        if (!sptBadan?.id) return;
        setIFileUploading((prev) => ({ ...prev, [field]: true }));
        try {
            await axios.delete(route("spt.badan.delete-attachment"), {
                data: { spt_badan_id: sptBadan.id, field },
            });
            form.setValue(field as any, "");
            setIFileNames((prev) => ({ ...prev, [field]: "" }));
            if (inputRef.current) inputRef.current.value = "";
            toast.success("File berhasil dihapus");
        } catch {
            toast.error("Gagal menghapus file");
        } finally {
            setIFileUploading((prev) => ({ ...prev, [field]: false }));
        }
    };

    // Bank filter state
    const [bankFilters, setBankFilters] = useState({
        bank_name: "",
        account_number: "",
        account_type: "",
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
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

    const getValueByPath = (
        source: Record<string, unknown>,
        path: (string | number)[],
    ) => {
        return path.reduce<unknown>((current, key) => {
            if (current === null || current === undefined) return undefined;
            if (typeof current !== "object") return undefined;
            return (current as Record<string, unknown>)[String(key)];
        }, source);
    };

    const logSchemaInputComparison = (
        input: SptBadanFormValues,
        context: string,
    ) => {
        const result = sptBadanIndukSchema.safeParse(input);

        if (result.success) {
            console.groupCollapsed(
                `[SPT Badan][${context}] schema check passed`,
            );
            console.log("input", input);
            console.groupEnd();
            return true;
        }

        console.groupCollapsed(
            `[SPT Badan][${context}] schema-input mismatch (${result.error.issues.length})`,
        );
        console.log("input", input);

        result.error.issues.forEach((issue, index) => {
            const issueAny = issue as any;
            const path = issue.path.map(String).join(".") || "(root)";
            const actualValue = getValueByPath(input as Record<string, unknown>, issue.path);

            console.log(`[#${index + 1}] ${path}`, {
                code: issue.code,
                message: issue.message,
                expected: issueAny?.expected,
                received: issueAny?.received,
                actualType:
                    actualValue === null ? "null" : typeof actualValue,
                actualValue,
            });
        });

        console.groupEnd();
        return false;
    };

    // Bank helpers
    const fetchBanks = async () => {
        setIsLoadingBanks(true);
        try {
            const response = await axios.get("/api/banks");
            setBanks(response.data);
        } catch {
            toast.error("Gagal memuat data bank");
        } finally {
            setIsLoadingBanks(false);
        }
    };

    const handleSelectBank = (bank: Bank) => {
        form.setValue("account_number", bank.account_number);
        form.setValue("bank_name", bank.bank_name);
        form.setValue("account_name", entityIdentity?.name || user?.name || "");
        setOpenBankModal(false);
    };

    const filteredBanks = banks.filter((bank) => {
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
        return matchBankName && matchAccountNumber && matchAccountType;
    });

    // Form
    const form = useForm<z.infer<typeof sptBadanIndukSchema>>({
        resolver: zodResolver(sptBadanIndukSchema),
        defaultValues: {
            spt_id: spt.id,
            type_of_bookkeeping:
                (sptBadan?.type_of_bookkeeping as any) ?? (undefined as any),

            b_1a: sptBadan?.b_1a ?? "",
            b_2: sptBadan?.b_2 ?? undefined,
            b_2a: sptBadan?.b_2a ?? "",
            b_2b: sptBadan?.b_2b ?? "",
            b_2c: sptBadan?.b_2c ?? "",

            c_1a: sptBadan?.c_1a ?? undefined,
            c_1b: sptBadan?.c_1b ?? undefined,
            c_2: sptBadan?.c_2 ?? undefined,
            c_2_value: sptBadan?.c_2_value ?? 0,
            c_3: sptBadan?.c_3 ?? undefined,
            c_3_value: sptBadan?.c_3_value ?? 0,

            d_4: sptBadan?.d_4 ?? 0,
            d_5: sptBadan?.d_5 ?? undefined,
            d_5_value: sptBadan?.d_5_value ?? 0,
            d_6: sptBadan?.d_6 ?? undefined,
            d_6_value: sptBadan?.d_6_value ?? 0,
            d_7: sptBadan?.d_7 ?? 0,
            d_8: sptBadan?.d_8 ?? undefined,
            d_8_value: sptBadan?.d_8_value ?? 0,
            d_9: sptBadan?.d_9 ?? 0,
            d_10: sptBadan?.d_10 ?? undefined,
            d_10_value: sptBadan?.d_10_value ?? 0,
            d_11: sptBadan?.d_11 ?? "",
            d_11_percentage: Number(sptBadan?.d_11_percentage ?? 0),
            d_12: sptBadan?.d_12 ?? 0,

            e_13: sptBadan?.e_13 ?? undefined,
            e_13_value: sptBadan?.e_13_value ?? 0,
            e_14: sptBadan?.e_14 ?? 0,
            e_15: sptBadan?.e_15 ?? 0,
            e_16: sptBadan?.e_16 ?? undefined,
            e_16_value: sptBadan?.e_16_value ?? 0,

            f_17a: sptBadan?.f_17a ?? 0,
            f_17b: sptBadan?.f_17b ?? undefined,
            f_17b_value: sptBadan?.f_17b_value ?? 0,
            f_17c: sptBadan?.f_17c ?? 0,
            f_18a: sptBadan?.f_18a ?? undefined,
            f_18a_value: sptBadan?.f_18a_value ?? 0,
            f_18b: sptBadan?.f_18b ?? 0,
            f_19a: sptBadan?.f_19a ?? "",

            account_number: sptBadan?.account_number ?? "",
            bank_name: sptBadan?.bank_name ?? "",
            account_name: sptBadan?.account_name ?? "",

            g_20: sptBadan?.g_20 ?? undefined,
            g_20_value: sptBadan?.g_20_value ?? 0,

            f_21a: sptBadan?.f_21a ?? undefined,
            f_21b: sptBadan?.f_21b ?? undefined,
            f_21c: sptBadan?.f_21c ?? undefined,
            f_21d: sptBadan?.f_21d ?? undefined,
            f_21e: sptBadan?.f_21e ?? undefined,
            f_21f: sptBadan?.f_21f ?? undefined,
            f_21g: sptBadan?.f_21g ?? undefined,
            f_21h: sptBadan?.f_21h ?? undefined,
            f_21i: sptBadan?.f_21i ?? undefined,
            f_21j: sptBadan?.f_21j ?? 0,

            i_a_1: sptBadan?.i_a_1 ?? "",
            i_a_2: sptBadan?.i_a_2 ?? "",
            i_b: sptBadan?.i_b ?? "",
            i_c: sptBadan?.i_c ?? "",
            i_d: sptBadan?.i_d ?? "",
            i_e: sptBadan?.i_e ?? "",
            i_f: sptBadan?.i_f ?? "",
            i_f_1: sptBadan?.i_f_1 ?? "",
            i_f_2: sptBadan?.i_f_2 ?? "",
            i_f_3: sptBadan?.i_f_3 ?? "",
            i_f_4: sptBadan?.i_f_4 ?? "",
            i_g: sptBadan?.i_g ?? "",
            i_h_1: sptBadan?.i_h_1 ?? "",
            i_h_2: sptBadan?.i_h_2 ?? "",
            i_i: sptBadan?.i_i ?? "",
            i_j: sptBadan?.i_j ?? "",

            h_21_a: sptBadan?.h_21_a ?? sptBadan?.f_21a ?? undefined,
            h_21_b: sptBadan?.h_21_b ?? sptBadan?.f_21b ?? undefined,
            h_21_c: sptBadan?.h_21_c ?? sptBadan?.f_21c ?? undefined,
            h_21_d: sptBadan?.h_21_d ?? sptBadan?.f_21d ?? undefined,
            h_21_e: sptBadan?.h_21_e ?? sptBadan?.f_21e ?? undefined,
            h_21_f: sptBadan?.h_21_f ?? sptBadan?.f_21f ?? undefined,
            h_21_g: sptBadan?.h_21_g ?? sptBadan?.f_21g ?? undefined,
            h_21_h: sptBadan?.h_21_h ?? sptBadan?.f_21h ?? undefined,
            h_21_i: sptBadan?.h_21_i ?? sptBadan?.f_21i ?? undefined,
            h_21_j: sptBadan?.h_21_j ?? sptBadan?.f_21j ?? 0,

            j_signer: (sptBadan?.j_signer as any) ?? "taxpayer",
            j_signer_id: sptBadan?.j_signer_id ?? "",
            j_signer_name: sptBadan?.j_signer_name ?? "",
            j_signer_position: sptBadan?.j_signer_position ?? "",

            password: "",
            payment_method: "",
        },
    });

    useEffect(() => {
        const dbD9 = Number(sptBadan?.d_9 ?? 0);
        const currentD9 = Number(form.getValues("d_9") ?? 0);

        if (dbD9 > 0 && currentD9 === 0) {
            form.setValue("d_9", dbD9, {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
            });
        }
    }, [form, sptBadan?.d_9]);

    useEffect(() => {
        form.setValue("d_4", Number(sptBadan?.d_4 ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("c_2", sptBadan?.c_2 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("c_2_value", Number(sptBadan?.c_2_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("c_3", sptBadan?.c_3 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("c_3_value", Number(sptBadan?.c_3_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_5", sptBadan?.d_5 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_5_value", Number(sptBadan?.d_5_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_6", sptBadan?.d_6 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_6_value", Number(sptBadan?.d_6_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_8", sptBadan?.d_8 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_8_value", Number(sptBadan?.d_8_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_10", sptBadan?.d_10 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("d_10_value", Number(sptBadan?.d_10_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("e_13", sptBadan?.e_13 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("e_13_value", Number(sptBadan?.e_13_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("e_16", sptBadan?.e_16 ?? undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("e_16_value", Number(sptBadan?.e_16_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("f_19a", sptBadan?.f_19a ?? "", {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
        form.setValue("g_20_value", Number(sptBadan?.g_20_value ?? 0), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
    }, [
        form,
        sptBadan?.d_4,
        sptBadan?.c_2,
        sptBadan?.c_2_value,
        sptBadan?.c_3,
        sptBadan?.c_3_value,
        sptBadan?.d_5,
        sptBadan?.d_5_value,
        sptBadan?.d_6,
        sptBadan?.d_6_value,
        sptBadan?.d_8,
        sptBadan?.d_8_value,
        sptBadan?.d_10,
        sptBadan?.d_10_value,
        sptBadan?.e_13,
        sptBadan?.e_13_value,
        sptBadan?.e_16,
        sptBadan?.e_16_value,
        sptBadan?.f_19a,
        sptBadan?.g_20_value,
    ]);

    const sektorUsaha = (form.watch("b_1a") ?? "")
        .toString()
        .trim()
        .toLowerCase();
    const l1TabBySektor: Record<string, { tab: string; label: string }> = {
        umum: { tab: "l1a", label: "L1-A" },
        manufaktur: { tab: "l1b", label: "L1-B" },
        dagang: { tab: "l1c", label: "L1-C" },
        jasa: { tab: "l1d", label: "L1-D" },
        "bank konvensional": { tab: "l1e", label: "L1-E" },
        "dana pensiun": { tab: "l1f", label: "L1-F" },
        asuransi: { tab: "l1g", label: "L1-G" },
        properti: { tab: "l1h", label: "L1-H" },
        "bank syariah": { tab: "l1i", label: "L1-I" },
        infrastruktur: { tab: "l1j", label: "L1-J" },
        sekuritas: { tab: "l1k", label: "L1-K" },
        pembiayaan: { tab: "l1l", label: "L1-L" },
    };
    const selectedL1Tab = l1TabBySektor[sektorUsaha] ?? null;
    const selectedL1Code = selectedL1Tab?.tab?.replace("l1", "") ?? null;
    const selectedL1Layout = useMemo<L1ALayout | undefined>(() => {
        switch (selectedL1Code) {
            case "a":
                return l1aLayout;
            case "b":
                return l1bLayout;
            case "c":
                return l1cLayout;
            case "d":
                return l1dLayout;
            case "e":
                return l1eLayout;
            case "f":
                return l1fLayout;
            case "g":
                return l1gLayout;
            case "h":
                return l1hLayout;
            case "i":
                return l1iLayout;
            case "j":
                return l1jLayout;
            case "k":
                return l1kLayout;
            case "l":
                return l1lLayout;
            default:
                return undefined;
        }
    }, [
        selectedL1Code,
        l1aLayout,
        l1bLayout,
        l1cLayout,
        l1dLayout,
        l1eLayout,
        l1fLayout,
        l1gLayout,
        l1hLayout,
        l1iLayout,
        l1jLayout,
        l1kLayout,
        l1lLayout,
    ]);
    const penjualanBrutoL1 = useMemo(() => {
        if (!selectedL1Code) return 0;

        const normalizedCode = selectedL1Code.toLowerCase();
        const sectorRows = (l1a1 ?? []).filter(
            (row) => (row?.code ?? "").toString().toLowerCase() === normalizedCode,
        );
        if (!sectorRows.length) return 0;

        const amountByAccountId = new Map<number, number>();
        for (const row of sectorRows) {
            const accountId = Number(row?.account_id);
            if (!Number.isFinite(accountId) || accountId <= 0) continue;
            amountByAccountId.set(
                accountId,
                (amountByAccountId.get(accountId) ?? 0) + Number(row?.amount ?? 0),
            );
        }

        const allLayoutAccounts = Object.values(selectedL1Layout?.a1 ?? {}).flat();

        const sumByNeedles = (needles: string[]) => {
            let total = 0;
            for (const account of allLayoutAccounts) {
                const accountId = Number(account?.id);
                const accountName = (account?.name ?? "").toString().toLowerCase();
                if (!Number.isFinite(accountId) || accountId <= 0) continue;
                if (!needles.some((needle) => accountName.includes(needle))) continue;
                total += Number(amountByAccountId.get(accountId) ?? 0);
            }
            return total;
        };

        const formulaLikeL1A = sumByNeedles([
            "penjualan domestik",
            "penjualan ekspor",
        ]);
        if (formulaLikeL1A > 0) return Math.max(0, formulaLikeL1A);

        const directBrutoFromLayout = sumByNeedles([
            "penjualan bruto",
            "peredaran bruto",
            "penghasilan bruto",
            "pendapatan bruto",
        ]);
        if (directBrutoFromLayout > 0) return Math.max(0, directBrutoFromLayout);

        const fallbackAccountIds = new Set<number>();
        for (const account of masterAccounts ?? []) {
            const accountId = Number(account?.id);
            const accountName = (account?.name ?? "").toString().toLowerCase();
            if (!Number.isFinite(accountId) || accountId <= 0) continue;
            if (
                accountName.includes("penjualan bruto") ||
                accountName.includes("peredaran bruto") ||
                accountName.includes("penghasilan bruto") ||
                accountName.includes("pendapatan bruto")
            ) {
                fallbackAccountIds.add(accountId);
            }
        }

        let fallbackTotal = 0;
        for (const [accountId, amount] of amountByAccountId.entries()) {
            if (!fallbackAccountIds.has(accountId)) continue;
            fallbackTotal += Number(amount ?? 0);
        }

        return Math.max(0, fallbackTotal);
    }, [l1a1, masterAccounts, selectedL1Code, selectedL1Layout]);
    const isL3Enabled = form.watch("e_13") === true;
    const isL4Enabled =
        form.watch("c_2") === true || form.watch("c_3") === true;
    const isL5Enabled = form.watch("c_1a") === true;
    const isL6Enabled = form.watch("g_20") === false;
    const isL7Enabled = form.watch("d_8") === true;
    const isL8Enabled = form.watch("d_11") === "3";
    const isL9Enabled = form.watch("h_21_e") === true;
    const isL10ABCEnabled = form.watch("h_21_a") === true;
    const isL10DEnabled = form.watch("h_21_b") === true;
    const isL11AEnabled = form.watch("h_21_f") === true;
    const isL14Enabled = form.watch("h_21_h") === true;
    const isL13Enabled =
        form.watch("d_5") === true || form.watch("h_21_g") === true;
    const isL13BEnabled =
        form.watch("d_6") === true || form.watch("d_10") === true;
    const isL13CEnabled = form.watch("e_16") === true;
    const getH21InfoText = (
        fieldName:
            | "h_21_a"
            | "h_21_b"
            | "h_21_c"
            | "h_21_d"
            | "h_21_e"
            | "h_21_f"
            | "h_21_g"
            | "h_21_h"
            | "h_21_i",
        isYes: boolean,
    ) => {
        if (!isYes) {
            return "Tidak, silahkan lanjut pertanyaan berikutnya";
        }

        switch (fieldName) {
            case "h_21_a":
                return "Ya, silahkan mengisi Lampiran 10A, 10B, dan 10C";
            case "h_21_b":
                return "Ya, silahkan mengisi Lampiran 10D";
            case "h_21_c":
                return "Ya, silahkan mengisi Lampiran 2 bagian B";
            case "h_21_d":
                return "Ya, silahkan mengisi Lampiran 2 bagian B";
            case "h_21_e":
                return "Ya, silahkan mengisi Lampiran 9";
            case "h_21_f":
                return "Ya, silahkan mengisi Lampiran 11A";
            case "h_21_g":
                return "Ya, silahkan mengisi Lampiran 13A";
            case "h_21_h":
                return "Ya, silahkan mengisi Lampiran 14";
            case "h_21_i":
                return "Ya, silahkan menyampaikan Laporan Realisasi Investasi secara terpisah sesuai dengan ketentuan perundang-undangan yang berlaku.";
        }
    };

    const getF21Alias = (
        name: keyof z.infer<typeof sptBadanIndukSchema>,
    ): keyof z.infer<typeof sptBadanIndukSchema> | null => {
        switch (name) {
            case "h_21_a":
                return "f_21a";
            case "h_21_b":
                return "f_21b";
            case "h_21_c":
                return "f_21c";
            case "h_21_d":
                return "f_21d";
            case "h_21_e":
                return "f_21e";
            case "h_21_f":
                return "f_21f";
            case "h_21_g":
                return "f_21g";
            case "h_21_h":
                return "f_21h";
            case "h_21_i":
                return "f_21i";
            case "h_21_j":
                return "f_21j";
            default:
                return null;
        }
    };

    const sanitizeBadanDraftPayload = (
        values: z.infer<typeof sptBadanIndukSchema>,
    ) => {
        const payload: Record<string, unknown> = { ...values };

        for (const [key, value] of Object.entries(values)) {
            const alias = getF21Alias(
                key as keyof z.infer<typeof sptBadanIndukSchema>,
            );
            if (alias) {
                payload[alias] = value;
            }
        }

        return payload;
    };

    const visibleTabs = useMemo(() => {
        const tabSet = new Set<string>([
            "induk",
            "l2",
            "l11b",
            "l11c",
            "l12a",
            "l12b",
        ]);

        if (selectedL1Tab?.tab) {
            tabSet.add(selectedL1Tab.tab);
        }

        if (isL3Enabled) {
            tabSet.add("l3");
        }

        if (isL4Enabled) {
            tabSet.add("l4");
        }

        if (isL5Enabled) {
            tabSet.add("l5");
        }

        if (isL6Enabled) {
            tabSet.add("l6");
        }

        if (isL7Enabled) {
            tabSet.add("l7");
        }

        if (isL8Enabled) {
            tabSet.add("l8");
        }

        if (isL9Enabled) {
            tabSet.add("l9");
        }

        if (isL10ABCEnabled) {
            tabSet.add("l10a");
            tabSet.add("l10b");
            tabSet.add("l10c");
        }

        if (isL10DEnabled) {
            tabSet.add("l10d");
        }

        if (isL11AEnabled) {
            tabSet.add("l11a");
        }

        if (isL13Enabled) {
            tabSet.add("l13a");
        }

        if (isL13BEnabled) {
            tabSet.add("l13b");
        }

        if (isL13CEnabled) {
            tabSet.add("l13c");
        }

        if (isL14Enabled) {
            tabSet.add("l14");
        }

        return tabSet;
    }, [
        selectedL1Tab,
        isL3Enabled,
        isL4Enabled,
        isL5Enabled,
        isL6Enabled,
        isL7Enabled,
        isL8Enabled,
        isL9Enabled,
        isL10ABCEnabled,
        isL10DEnabled,
        isL11AEnabled,
        isL13Enabled,
        isL13BEnabled,
        isL13CEnabled,
        isL14Enabled,
    ]);

    useEffect(() => {
        if (!visibleTabs.has(activeTab)) {
            setActiveTab("induk");
        }
    }, [activeTab, visibleTabs]);

    // Auto save
    const queueAutoSave = useCallback(
        (name: keyof z.infer<typeof sptBadanIndukSchema>, value: unknown) => {
            if (!AUTO_SAVE_FIELDS.has(name)) return;
            if (value === undefined) return;
            if (autoSaveTimeoutRef.current)
                window.clearTimeout(autoSaveTimeoutRef.current);
            autoSaveTimeoutRef.current = window.setTimeout(() => {
                const mappedName = getF21Alias(name);
                const sptBadanDataPayload: Record<string, unknown> = {
                    [name]: value,
                };

                if (mappedName) {
                    sptBadanDataPayload[mappedName] = value;
                }

                axios
                    .post(route("spt.saveBadanDraft"), {
                        spt_id: spt.id,
                        spt_badan_data: sptBadanDataPayload,
                    })
                    .catch(() => {});
            }, 300);
        },
        [spt.id],
    );

    useEffect(() => {
        const subscription = form.watch((values, info) => {
            if (!info.name) return;
            const name = info.name as keyof z.infer<typeof sptBadanIndukSchema>;
            const value = (values as Record<string, unknown>)[name];
            queueAutoSave(name, value);
        });
        return () => subscription.unsubscribe();
    }, [form, queueAutoSave]);

    // Auto-calculate D section (PPh Terutang)
    useEffect(() => {
        if (form.watch("c_1a") !== true) {
            form.setValue("c_1b", undefined);
        }
    }, [form.watch("c_1a")]);

    // Auto-calculate D section
    useEffect(() => {
        const d_4 = form.watch("d_4") || 0;
        const d_5 = form.watch("d_5");
        const d_5_value = d_5 ? form.watch("d_5_value") || 0 : 0;
        const d_6 = form.watch("d_6");
        const d_6_value = d_6 ? form.watch("d_6_value") || 0 : 0;

        // D.7 = Penghasilan Neto Fiskal Setelah Fasilitas Pajak
        const d_7 = Math.max(0, d_4 - d_5_value - d_6_value);
        form.setValue("d_7", d_7);

        // D.8 = Kompensasi kerugian fiskal
        const d_8 = form.watch("d_8");
        const d_8_value = d_8 ? form.watch("d_8_value") || 0 : 0;

        // D.9 = Penghasilan Kena Pajak
        const d_9 = Math.max(0, d_7 - d_8_value);
        form.setValue("d_9", d_9);

        // D.10 = Fasilitas Pengurangan Penghasilan Bruto Litbang
        const d_10 = form.watch("d_10");
        const d_10_value = d_10 ? form.watch("d_10_value") || 0 : 0;

        // D.11 = Tarif Pajak
        const d_11 = (form.watch("d_11") || "").toString();
        const effectivePKP = Math.max(0, d_9 - d_10_value);

        let d11PercentageNext = 0;
        let d12Next = 0;

        if (d_11 === "1") {
            if (effectivePKP > 50_000_000_000) {
                d11PercentageNext = 22;
                d12Next = Math.round(effectivePKP * 0.22);
            }
        } else if (d_11 === "3") {
            if (
                effectivePKP >= 4_800_000_000 &&
                effectivePKP <= 50_000_000_000 &&
                d_4 > 0 &&
                penjualanBrutoL1 > 0
            ) {
                const tarifPertamaDasar =
                    (4_800_000_000 / penjualanBrutoL1) * d_4;
                const tarifPertama = Math.max(
                    0,
                    Math.min(d_4, tarifPertamaDasar),
                );
                const tarifKedua = Math.max(0, d_4 - tarifPertama);

                d12Next = Math.round(tarifPertama * 0.11 + tarifKedua * 0.22);
            }
        }

        const currentD11Percentage = Number(form.getValues("d_11_percentage") || 0);
        if (currentD11Percentage !== d11PercentageNext) {
            form.setValue("d_11_percentage", d11PercentageNext, {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
            });
        }

        // D.12 = PPh Terutang
        form.setValue("d_12", Math.max(0, d12Next));
    }, [
        form.watch("d_4"),
        form.watch("d_5"),
        form.watch("d_5_value"),
        form.watch("d_6"),
        form.watch("d_6_value"),
        form.watch("d_8"),
        form.watch("d_8_value"),
        form.watch("d_10"),
        form.watch("d_10_value"),
        form.watch("d_11"),
        penjualanBrutoL1,
    ]);

    // Auto-calculate F section (Kurang/Lebih Bayar)
    useEffect(() => {
        const d_12 = form.watch("d_12") || 0;
        const e_13 = form.watch("e_13");
        const e_13_value = e_13 ? form.watch("e_13_value") || 0 : 0;
        const e_14 = form.watch("e_14") || 0;
        const e_15 = form.watch("e_15") || 0;
        const e_16 = form.watch("e_16");
        const e_16_value = e_16 ? form.watch("e_16_value") || 0 : 0;
        const totalKredit = e_13_value + e_14 + e_15 + e_16_value;
        // 17.a = D.12 - total kredit (positif = kurang bayar, negatif = lebih bayar)
        const f_17a = d_12 - totalKredit;
        form.setValue("f_17a", f_17a);

        // 17.c = 17.a
        const f_17c = f_17a;
        form.setValue("f_17c", f_17c);

        // 18.b = 17.c - 18.a
        const f_18a_value = form.watch("f_18a_value") || 0;
        const f_18b = f_17c - f_18a_value;
        form.setValue("f_18b", f_18b);
    }, [
        form.watch("d_12"),
        form.watch("e_13"),
        form.watch("e_13_value"),
        form.watch("e_14"),
        form.watch("e_15"),
        form.watch("e_16"),
        form.watch("e_16_value"),
        form.watch("f_18a_value"),
    ]);

    // Set total for payment
    useEffect(() => {
        const pphKurangBayar = form.watch("f_17c");
        setTotal(Math.max(0, pphKurangBayar || 0));
    }, [form.watch("f_17c")]);

    // Auto-calculate g_20_value = 1/12 x (D.12 - E.13)
    useEffect(() => {
        if (form.watch("g_20") === true) {
            const d_12 = form.watch("d_12") || 0;
            const e_13_value = form.watch("e_13")
                ? form.watch("e_13_value") || 0
                : 0;
            const computed = Math.round((d_12 - e_13_value) / 12);
            form.setValue("g_20_value", computed > 0 ? computed : 0);
        }
    }, [
        form.watch("g_20"),
        form.watch("d_12"),
        form.watch("e_13"),
        form.watch("e_13_value"),
    ]);

    const handleSaveDraft = async () => {
        const formData = sanitizeBadanDraftPayload(form.getValues());

        try {
            await axios.post(route("spt.saveBadanDraft"), {
                spt_id: form.getValues("spt_id"),
                spt_badan_data: formData as Record<string, any>,
            });

            toast.success("SPT Badan berhasil disimpan sebagai draft");
            router.visit(route("spt.konsep"));
        } catch (error: any) {
            const message =
                error?.response?.data?.error ?? "Gagal menyimpan draft";
            toast.error(String(message));
        }
    };

    const onSubmit = (data: z.infer<typeof sptBadanIndukSchema>) => {
        logSchemaInputComparison(data, "onSubmit");

        if (!pernyataanSetuju) {
            toast.error("Anda harus menyetujui pernyataan terlebih dahulu");
            return;
        }

        const pphKurangBayar = Number(data.f_17c ?? 0);
        const paymentTotal = Math.max(0, pphKurangBayar);
        setTotal(paymentTotal);
        setPendingSubmit(data);

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
            Math.floor(
                100000000000000 + Math.random() * 900000000000000,
            ).toString();

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
            let n = num;
            while (n > 0) {
                const chunk = n % 1000;
                if (chunk > 0) {
                    let chunkWords = "";
                    const hundreds = Math.floor(chunk / 100);
                    const remainder = chunk % 100;
                    if (hundreds > 0)
                        chunkWords +=
                            hundreds === 1
                                ? "seratus "
                                : `${units[hundreds]} ratus `;
                    if (remainder > 0) {
                        if (remainder < 10) chunkWords += units[remainder];
                        else if (remainder < 20)
                            chunkWords += teens[remainder - 10];
                        else
                            chunkWords += `${tens[Math.floor(remainder / 10)]} ${units[remainder % 10]}`;
                    }
                    if (i === 1 && chunk === 1) chunkWords = "seribu";
                    else chunkWords += ` ${thousands[i]}`;
                    words = `${chunkWords.trim()} ${words}`.trim();
                }
                n = Math.floor(n / 1000);
                i++;
            }
            return (
                words
                    .trim()
                    .replace(/\s+/g, " ")
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ") + " Rupiah"
            );
        };

        const amount = Math.max(0, Number(pendingSubmit.f_17c ?? 0));

        const submitData = {
            spt_id: pendingSubmit.spt_id,
            spt_badan_data: pendingSubmit,
            password,
            payment_method: paymentMethod,
            transaction_number: transactionNumber,
            total_payment: amount,
            billing_data: {
                billing_type_id: 57,
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
                billing_type_id: 57,
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
                kap: "411126",
                kap_description: "PPh Badan",
                kjs: "200",
                tax_period: spt.start_period + " " + spt.year,
                transaction_number: transactionNumber,
            },
        };

        router.post(route("spt.storeBadan"), submitData, {
            onSuccess: () => {
                toast.success("SPT Badan berhasil dikirim");
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

    // Helpers
    const immediateDraftSave = useCallback(
        (payload: Record<string, unknown>) => {
            axios
                .post(route("spt.saveBadanDraft"), {
                    spt_id: spt.id,
                    spt_badan_data: payload,
                })
                .catch(() => {});
        },
        [spt.id],
    );

    // F.19.a aktif hanya jika F.17.a atau F.18.b bernilai negatif (lebih bayar)
    const isF19aEnabled =
        (form.watch("f_17a") || 0) < 0 || (form.watch("f_18b") || 0) < 0;
    const conditionalValueCacheRef = useRef<
        Partial<Record<keyof z.infer<typeof sptBadanIndukSchema>, number>>
    >({});

    useEffect(() => {
        if (!isF19aEnabled && form.getValues("f_19a")) {
            form.setValue("f_19a", "", {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
            });

            immediateDraftSave({ f_19a: "" });
        }
    }, [form, isF19aEnabled, immediateDraftSave]);

    const g20ValueCacheRef = useRef<number>(0);

    useEffect(() => {
        const g20 = form.watch("g_20");
        const currentG20Value = Number(form.getValues("g_20_value") ?? 0);

        if (g20 === true && currentG20Value !== 0) {
            g20ValueCacheRef.current = currentG20Value;
        }

        if (g20 === false && currentG20Value === 0) {
            const backendValue = Number(sptBadan?.g_20_value ?? 0);
            const restoredValue =
                g20ValueCacheRef.current !== 0
                    ? g20ValueCacheRef.current
                    : backendValue;

            if (restoredValue !== 0) {
                form.setValue("g_20_value", restoredValue, {
                    shouldDirty: false,
                    shouldTouch: false,
                    shouldValidate: false,
                });
            }
        }
    }, [form, form.watch("g_20"), sptBadan?.g_20_value]);

    useEffect(() => {
        const conditionalValuePairs: Array<{
            flag: keyof z.infer<typeof sptBadanIndukSchema>;
            value: keyof z.infer<typeof sptBadanIndukSchema>;
        }> = [
            { flag: "c_2", value: "c_2_value" },
            { flag: "c_3", value: "c_3_value" },
            { flag: "d_5", value: "d_5_value" },
            { flag: "d_6", value: "d_6_value" },
            { flag: "d_8", value: "d_8_value" },
            { flag: "d_10", value: "d_10_value" },
            { flag: "e_13", value: "e_13_value" },
            { flag: "e_16", value: "e_16_value" },
            { flag: "f_17b", value: "f_17b_value" },
            { flag: "f_18a", value: "f_18a_value" },
        ];

        for (const { flag, value } of conditionalValuePairs) {
            const isEnabled = form.getValues(flag) === true;
            const currentValue = Number(form.getValues(value) ?? 0);

            if (!isEnabled && currentValue !== 0) {
                conditionalValueCacheRef.current[value] = currentValue;
                form.setValue(value, 0 as never, {
                    shouldDirty: false,
                    shouldTouch: false,
                    shouldValidate: false,
                });
                continue;
            }

            if (isEnabled && currentValue === 0) {
                const cachedValue = Number(
                    conditionalValueCacheRef.current[value] ?? 0,
                );
                const backendValue = Number(
                    (sptBadan as Record<string, unknown> | null)?.[
                        value as string
                    ] ?? 0,
                );
                const restoredValue =
                    cachedValue !== 0 ? cachedValue : backendValue;

                if (restoredValue !== 0) {
                    form.setValue(value, restoredValue as never, {
                        shouldDirty: false,
                        shouldTouch: false,
                        shouldValidate: false,
                    });
                }
            }
        }
    }, [
        form,
        sptBadan,
        form.watch("c_2"),
        form.watch("c_3"),
        form.watch("d_5"),
        form.watch("d_6"),
        form.watch("d_8"),
        form.watch("d_10"),
        form.watch("e_13"),
        form.watch("e_16"),
        form.watch("f_17b"),
        form.watch("f_18a"),
    ]);

    const YaTidakRadio = ({
        name,
        label,
    }: {
        name: keyof z.infer<typeof sptBadanIndukSchema>;
        label?: string;
    }) => (
        <FormField
            control={form.control}
            name={name as any}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <RadioGroup
                            className="flex flex-wrap items-center gap-4"
                            value={
                                field.value === true
                                    ? "ya"
                                    : field.value === false
                                      ? "tidak"
                                      : ""
                            }
                            onValueChange={(v) => field.onChange(v === "ya")}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ya" id={`${name}_ya`} />
                                <Label htmlFor={`${name}_ya`}>Ya</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="tidak"
                                    id={`${name}_tidak`}
                                />
                                <Label htmlFor={`${name}_tidak`}>Tidak</Label>
                            </div>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const NumberField = ({
        name,
        disabled = false,
        placeholder = "0",
        className = "w-full text-right",
    }: {
        name: keyof z.infer<typeof sptBadanIndukSchema>;
        disabled?: boolean;
        placeholder?: string;
        className?: string;
    }) => (
        <FormField
            control={form.control}
            name={name as any}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={formatRupiah(field.value as number)}
                            onChange={(e) =>
                                field.onChange(parseRupiah(e.target.value))
                            }
                            className={className}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    // Row helper for consistent two-column layout
    const FormRow = ({
        label,
        number,
        children,
        bg = "white",
    }: {
        label: string;
        number?: string;
        children: React.ReactNode;
        bg?: "white" | "gray";
    }) => (
        <div
            className={`grid grid-cols-1 md:grid-cols-[60px_1fr_280px] gap-4 p-4 items-start border-t ${bg === "gray" ? "bg-gray-50" : "bg-white"}`}
        >
            <div className="text-sm font-medium text-gray-500">{number}</div>
            <div className="text-sm">{label}</div>
            <div>{children}</div>
        </div>
    );

    const d11TarifOptions = [
        {
            label: "1.Tarif Ketentuan Umum sebagaimana Pasal 17 ayat (1) huruf b UU PPh",
            value: "1",
            description:
                "Tarif 22% diterapkan jika Penghasilan Kena Pajak di atas 50 miliar.",
        },
        {
            label: "2.Tarif Fasilitas sebagaimana Pasal 31E ayat (1) UU PPh",
            value: "3",
            description:
                "Tarif berlapis 11% dan 22% dengan formula khusus untuk PKP 4,8 miliar s.d. 50 miliar.",
        },
        {
            label: "3.Tarif Pajak Lainnya",
            value: "4",
            description: "Persentase tarif lainnya ditetapkan 0%.",
        },
    ] as const;
    const selectedD11Tarif = d11TarifOptions.find(
        (option) => option.value === form.watch("d_11"),
    );
    const d11InfoText = selectedD11Tarif?.description ?? "";

    return (
        <Authenticated>
            <Head title="Detail SPT PPh Wajib Pajak Badan" />

            <div className="py-8 mx-auto w-full max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
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
                                    Detail SPT PPh Wajib Pajak Badan
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-bold text-primary mb-2">
                        SPT TAHUNAN PAJAK PENGHASILAN (PPh) WAJIB PAJAK BADAN
                    </h1>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                logSchemaInputComparison(
                                    form.getValues(),
                                    "onSubmitInvalid",
                                );

                                const firstError = Object.values(errors)[0];
                                const message =
                                    firstError && "message" in firstError
                                        ? (firstError as any).message
                                        : "Ada field yang belum diisi dengan benar";
                                toast.error(String(message));
                            })}
                        >
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="flex flex-wrap justify-start gap-2 h-auto">
                                    <TabsTrigger value="induk">
                                        Induk
                                    </TabsTrigger>
                                    {selectedL1Tab ? (
                                        <TabsTrigger value={selectedL1Tab.tab}>
                                            {selectedL1Tab.label}
                                        </TabsTrigger>
                                    ) : null}
                                    <TabsTrigger value="l2">L2</TabsTrigger>
                                    {isL3Enabled ? (
                                        <TabsTrigger value="l3">L3</TabsTrigger>
                                    ) : null}
                                    {isL4Enabled ? (
                                        <TabsTrigger value="l4">L4</TabsTrigger>
                                    ) : null}
                                    {isL5Enabled ? (
                                        <TabsTrigger value="l5">L5</TabsTrigger>
                                    ) : null}
                                    {isL6Enabled ? (
                                        <TabsTrigger value="l6">L6</TabsTrigger>
                                    ) : null}
                                    {isL7Enabled ? (
                                        <TabsTrigger value="l7">L7</TabsTrigger>
                                    ) : null}
                                    {isL8Enabled ? (
                                        <TabsTrigger value="l8">L8</TabsTrigger>
                                    ) : null}
                                    {isL9Enabled ? (
                                        <TabsTrigger value="l9">L9</TabsTrigger>
                                    ) : null}
                                    {isL10ABCEnabled ? (
                                        <TabsTrigger value="l10a">
                                            L10-A
                                        </TabsTrigger>
                                    ) : null}
                                    {isL10ABCEnabled ? (
                                        <TabsTrigger value="l10b">
                                            L10-B
                                        </TabsTrigger>
                                    ) : null}
                                    {isL10ABCEnabled ? (
                                        <TabsTrigger value="l10c">
                                            L10-C
                                        </TabsTrigger>
                                    ) : null}
                                    {isL10DEnabled ? (
                                        <TabsTrigger value="l10d">
                                            L10-D
                                        </TabsTrigger>
                                    ) : null}
                                    {isL11AEnabled ? (
                                        <TabsTrigger value="l11a">
                                            L11-A
                                        </TabsTrigger>
                                    ) : null}
                                    <TabsTrigger value="l11b">
                                        L11-B
                                    </TabsTrigger>
                                    {/* <TabsTrigger value="l11c">
                                        L11-C
                                    </TabsTrigger>
                                    <TabsTrigger value="l12a">
                                        L12-A
                                    </TabsTrigger>
                                    <TabsTrigger value="l12b">
                                        L12-B
                                    </TabsTrigger> */}
                                    {isL13Enabled ? (
                                        <TabsTrigger value="l13a">
                                            L13-A
                                        </TabsTrigger>
                                    ) : null}
                                    {isL13BEnabled ? (
                                        <TabsTrigger value="l13b">
                                            L13-B
                                        </TabsTrigger>
                                    ) : null}
                                    {isL13CEnabled ? (
                                        <TabsTrigger value="l13c">
                                            L13-C
                                        </TabsTrigger>
                                    ) : null}
                                    {isL14Enabled ? (
                                        <TabsTrigger value="l14">
                                            L14
                                        </TabsTrigger>
                                    ) : null}
                                </TabsList>

                                {/* ======================== TAB INDUK ======================== */}
                                <TabsContent value="induk">
                                    <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow dark:bg-gray-800">
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
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                Tahun
                                                                Pajak/Bagian
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                value={spt.year}
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                Status
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    spt.correction_number ===
                                                                    0
                                                                        ? "NORMAL"
                                                                        : "PEMBETULAN"
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                Periode
                                                                Pembukuan
                                                            </Label>
                                                            <div className="flex gap-3 max-w-xs">
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

                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                Metode
                                                                Pembukuan/Pencatatan
                                                            </Label>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="type_of_bookkeeping"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem>
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

                                                    {/* Posting SPT */}
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
                                                        <p className="mt-3 text-sm text-muted-foreground">
                                                            Posting belum pernah
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
                                                                1. NPWP
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    entityIdentity?.npwp ||
                                                                    "-"
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                2. Nama
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    entityIdentity?.name ||
                                                                    "-"
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                3. Alamat Email
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    entityIdentity?.email ||
                                                                    user?.email ||
                                                                    "-"
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                4. Nomor Telepon
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    entityIdentity?.phone_number ||
                                                                    user?.phone_number ||
                                                                    "-"
                                                                }
                                                                disabled
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* B. INFORMASI LAPORAN KEUANGAN*/}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="informasiLaporanKeuangan"
                                        >
                                            <AccordionItem value="informasiLaporanKeuangan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    B. INFORMASI LAPORAN
                                                    KEUANGAN
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4 space-y-4">
                                                        {/* B.1.a */}
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                1.a. Sektor
                                                                Usaha Laporan
                                                                Keuangan pada
                                                                Lampiran 01
                                                            </Label>
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="b_1a"
                                                                render={({
                                                                    field,
                                                                }) => {
                                                                    const [
                                                                        openSektorUsaha,
                                                                        setOpenSektorUsaha,
                                                                    ] =
                                                                        React.useState(
                                                                            false,
                                                                        );
                                                                    const sektorUsahaOptions =
                                                                        [
                                                                            "Umum",
                                                                            "Manufaktur",
                                                                            "Dagang",
                                                                            "Jasa",
                                                                            "Bank Konvensional",
                                                                            "Dana Pensiun",
                                                                            "Asuransi",
                                                                            "Properti",
                                                                            "Bank Syariah",
                                                                            "Infrastruktur",
                                                                            "Sekuritas",
                                                                            "Pembiayaan",
                                                                        ];
                                                                    return (
                                                                        <FormItem>
                                                                            <Popover
                                                                                open={
                                                                                    openSektorUsaha
                                                                                }
                                                                                onOpenChange={
                                                                                    setOpenSektorUsaha
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
                                                                                                "w-full justify-between font-normal",
                                                                                                !field.value &&
                                                                                                    "text-muted-foreground",
                                                                                            )}
                                                                                        >
                                                                                            {field.value ||
                                                                                                "Pilih sektor usaha"}
                                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                                        </Button>
                                                                                    </FormControl>
                                                                                </PopoverTrigger>
                                                                                <PopoverContent
                                                                                    className="w-full p-0"
                                                                                    align="start"
                                                                                >
                                                                                    <Command>
                                                                                        <CommandInput placeholder="Cari sektor usaha..." />
                                                                                        <CommandEmpty>
                                                                                            Sektor
                                                                                            tidak
                                                                                            ditemukan.
                                                                                        </CommandEmpty>
                                                                                        <CommandGroup>
                                                                                            {sektorUsahaOptions.map(
                                                                                                (
                                                                                                    sektor,
                                                                                                ) => (
                                                                                                    <CommandItem
                                                                                                        key={
                                                                                                            sektor
                                                                                                        }
                                                                                                        value={
                                                                                                            sektor
                                                                                                        }
                                                                                                        onSelect={() => {
                                                                                                            field.onChange(
                                                                                                                sektor,
                                                                                                            );
                                                                                                            setOpenSektorUsaha(
                                                                                                                false,
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        <Check
                                                                                                            className={cn(
                                                                                                                "mr-2 h-4 w-4",
                                                                                                                field.value ===
                                                                                                                    sektor
                                                                                                                    ? "opacity-100"
                                                                                                                    : "opacity-0",
                                                                                                            )}
                                                                                                        />
                                                                                                        {
                                                                                                            sektor
                                                                                                        }
                                                                                                    </CommandItem>
                                                                                                ),
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

                                                        {/* B.2 */}
                                                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                            <Label>
                                                                2. Apakah
                                                                Laporan Keuangan
                                                                diaudit oleh
                                                                Akuntan Publik?
                                                            </Label>
                                                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                                                <YaTidakRadio name="b_2" />
                                                                {form.watch(
                                                                    "b_2",
                                                                ) !==
                                                                    undefined && (
                                                                    <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2 md:max-w-sm">
                                                                        <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                        <span>
                                                                            {form.watch(
                                                                                "b_2",
                                                                            )
                                                                                ? "Ya, pertanyaan selanjutnya"
                                                                                : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {form.watch("b_2") ===
                                                            true && (
                                                            <>
                                                                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                                    <Label>
                                                                        2.a.
                                                                        Opini
                                                                        Auditor
                                                                    </Label>
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="b_2a"
                                                                        render={({
                                                                            field,
                                                                        }) => {
                                                                            const [
                                                                                openOpini,
                                                                                setOpenOpini,
                                                                            ] =
                                                                                React.useState(
                                                                                    false,
                                                                                );
                                                                            const opiniOptions =
                                                                                [
                                                                                    "Wajar Tanpa Pengecualian",
                                                                                    "Wajar Tanpa Pengecualian dengan Paragraf Penjelasan",
                                                                                    "Wajar Dengan Pengecualian",
                                                                                    "Tidak Wajar",
                                                                                    "Tidak Menyatakan Pendapat",
                                                                                ];
                                                                            return (
                                                                                <FormItem>
                                                                                    <Popover
                                                                                        open={
                                                                                            openOpini
                                                                                        }
                                                                                        onOpenChange={
                                                                                            setOpenOpini
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
                                                                                                        "w-full justify-between font-normal",
                                                                                                        !field.value &&
                                                                                                            "text-muted-foreground",
                                                                                                    )}
                                                                                                >
                                                                                                    {field.value ||
                                                                                                        "Pilih opini auditor"}
                                                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                                                </Button>
                                                                                            </FormControl>
                                                                                        </PopoverTrigger>
                                                                                        <PopoverContent
                                                                                            className="w-full p-0"
                                                                                            align="start"
                                                                                        >
                                                                                            <Command>
                                                                                                <CommandInput placeholder="Cari opini..." />
                                                                                                <CommandEmpty>
                                                                                                    Opini
                                                                                                    tidak
                                                                                                    ditemukan.
                                                                                                </CommandEmpty>
                                                                                                <CommandGroup>
                                                                                                    {opiniOptions.map(
                                                                                                        (
                                                                                                            opini,
                                                                                                        ) => (
                                                                                                            <CommandItem
                                                                                                                key={
                                                                                                                    opini
                                                                                                                }
                                                                                                                value={
                                                                                                                    opini
                                                                                                                }
                                                                                                                onSelect={() => {
                                                                                                                    field.onChange(
                                                                                                                        opini,
                                                                                                                    );
                                                                                                                    setOpenOpini(
                                                                                                                        false,
                                                                                                                    );
                                                                                                                }}
                                                                                                            >
                                                                                                                <Check
                                                                                                                    className={cn(
                                                                                                                        "mr-2 h-4 w-4",
                                                                                                                        field.value ===
                                                                                                                            opini
                                                                                                                            ? "opacity-100"
                                                                                                                            : "opacity-0",
                                                                                                                    )}
                                                                                                                />
                                                                                                                {
                                                                                                                    opini
                                                                                                                }
                                                                                                            </CommandItem>
                                                                                                        ),
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
                                                                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                                    <Label>
                                                                        2.b.
                                                                        NPWP
                                                                        Kantor
                                                                        Akuntan
                                                                        Publik
                                                                    </Label>
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="b_2b"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        value={
                                                                                            field.value ??
                                                                                            ""
                                                                                        }
                                                                                        maxLength={
                                                                                            16
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            if (
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                                    .length <=
                                                                                                16
                                                                                            ) {
                                                                                                field.onChange(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                        placeholder="NPWP Kantor Akuntan Publik"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-3">
                                                                    <Label>
                                                                        2.c.
                                                                        Nama
                                                                        Kantor
                                                                        Akuntan
                                                                        Publik
                                                                    </Label>
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="b_2c"
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        value={
                                                                                            field.value ??
                                                                                            ""
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            field.onChange(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            )
                                                                                        }
                                                                                        placeholder="Nama Kantor Akuntan Publik"
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* C. PENGHASILAN BERSIFAT FINAL & TIDAK TERMASUK OBJEK PAJAK */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="penghasilan"
                                        >
                                            <AccordionItem value="penghasilan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    C. PENGHASILAN BERSIFAT
                                                    FINAL & TIDAK TERMASUK OBJEK
                                                    PAJAK
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="rounded-lg overflow-x-auto">
                                                        <table className="w-full min-w-[880px] table-fixed border-collapse">
                                                            <colgroup>
                                                                <col
                                                                    style={{
                                                                        width: "52px",
                                                                    }}
                                                                />
                                                                <col />
                                                                <col
                                                                    style={{
                                                                        width: "200px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "180px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "260px",
                                                                    }}
                                                                />
                                                            </colgroup>
                                                            <tbody>
                                                                {/* C.1a */}
                                                                <tr className="bg-white">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        1.a
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        menerima
                                                                        atau
                                                                        memperoleh
                                                                        penghasilan
                                                                        dari
                                                                        usaha
                                                                        dengan
                                                                        peredaran
                                                                        bruto
                                                                        tertentu
                                                                        yang
                                                                        dikenakan
                                                                        PPh yang
                                                                        bersifat
                                                                        Final?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="c_1a"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="c_1a_tidak"
                                                                                                />
                                                                                                <Label htmlFor="c_1a_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="c_1a_ya"
                                                                                                />
                                                                                                <Label htmlFor="c_1a_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "c_1a",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "c_1a",
                                                                                    )
                                                                                        ? "Ya, silahkan lanjut ke lampiran 5"
                                                                                        : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* C.1b (show only when C.1a = Ya) */}
                                                                {form.watch(
                                                                    "c_1a",
                                                                ) === true && (
                                                                    <tr className="bg-gray-50 border-t">
                                                                        <td className="p-4 text-sm font-medium align-middle">
                                                                            1.b
                                                                        </td>
                                                                        <td className="p-4 text-sm align-middle">
                                                                            Apakah
                                                                            penghasilan
                                                                            Wajib
                                                                            Pajak
                                                                            semata-mata
                                                                            hanya
                                                                            penghasilan
                                                                            dari
                                                                            usaha
                                                                            dengan
                                                                            peredaran
                                                                            bruto
                                                                            tertentu
                                                                            yang
                                                                            dikenakan
                                                                            PPh
                                                                            yang
                                                                            bersifat
                                                                            final?
                                                                        </td>
                                                                        <td className="p-4 align-middle">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="c_1b"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem>
                                                                                        <FormControl>
                                                                                            <RadioGroup
                                                                                                className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                        value="tidak"
                                                                                                        id="c_1b_tidak"
                                                                                                    />
                                                                                                    <Label htmlFor="c_1b_tidak">
                                                                                                        Tidak
                                                                                                    </Label>
                                                                                                </div>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                    <RadioGroupItem
                                                                                                        value="ya"
                                                                                                        id="c_1b_ya"
                                                                                                    />
                                                                                                    <Label htmlFor="c_1b_ya">
                                                                                                        Ya
                                                                                                    </Label>
                                                                                                </div>
                                                                                            </RadioGroup>
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </td>
                                                                        <td className="p-4 align-middle" />
                                                                        <td className="p-4 align-middle">
                                                                            {form.watch(
                                                                                "c_1b",
                                                                            ) !==
                                                                                undefined && (
                                                                                <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                    <span>
                                                                                        Silahkan
                                                                                        lanjut
                                                                                        pertanyaan
                                                                                        berikutnya
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )}

                                                                {/* C.2 */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        2
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        menerima
                                                                        atau
                                                                        memperoleh
                                                                        penghasilan
                                                                        yang
                                                                        dikenakan
                                                                        PPh yang
                                                                        bersifat
                                                                        final?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
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
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="c_2_tidak"
                                                                                                />
                                                                                                <Label htmlFor="c_2_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="c_2_ya"
                                                                                                />
                                                                                                <Label htmlFor="c_2_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="c_2_value"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className={cn(
                                                                                                    "text-right",
                                                                                                    form.watch(
                                                                                                        "c_2",
                                                                                                    ) !==
                                                                                                        true &&
                                                                                                        "hidden",
                                                                                                )}
                                                                                                disabled
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "c_2",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "c_2",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 4 Bagian A"
                                                                                        : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* C.3 */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        3
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        menerima
                                                                        atau
                                                                        memperoleh
                                                                        penghasilan
                                                                        yang
                                                                        tidak
                                                                        termasuk
                                                                        objek
                                                                        pajak?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
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
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="c_3_tidak"
                                                                                                />
                                                                                                <Label htmlFor="c_3_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="c_3_ya"
                                                                                                />
                                                                                                <Label htmlFor="c_3_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="c_3_value"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className={cn(
                                                                                                    "text-right",
                                                                                                    form.watch(
                                                                                                        "c_3",
                                                                                                    ) !==
                                                                                                        true &&
                                                                                                        "hidden",
                                                                                                )}
                                                                                                disabled
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "c_3",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "c_3",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 4 Bagian B"
                                                                                        : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* D. PENGHITUNGAN PPh */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="pphPenghitungan"
                                        >
                                            <AccordionItem value="pphPenghitungan">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    D. PENGHITUNGAN PPh
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="rounded-lg overflow-x-auto">
                                                        <table className="w-full min-w-[880px] table-fixed border-collapse">
                                                            <colgroup>
                                                                <col
                                                                    style={{
                                                                        width: "52px",
                                                                    }}
                                                                />
                                                                <col />
                                                                <col
                                                                    style={{
                                                                        width: "200px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "180px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "260px",
                                                                    }}
                                                                />
                                                            </colgroup>
                                                            <tbody>
                                                                {/* D.4 */}
                                                                <tr className="bg-white">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        4
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Penghasilan
                                                                        Neto
                                                                        Fiskal
                                                                        Sebelum
                                                                        Fasilitas
                                                                        Pajak
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <NumberField
                                                                            name="d_4"
                                                                            disabled
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* D.5 */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        5
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        memperoleh
                                                                        Fasilitas
                                                                        Perpajakan
                                                                        Dalam
                                                                        Rangka
                                                                        Penanaman
                                                                        Modal
                                                                        berupa
                                                                        pengurangan
                                                                        penghasilan
                                                                        neto?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_5"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="d_5_tidak"
                                                                                                />
                                                                                                <Label htmlFor="d_5_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="d_5_ya"
                                                                                                />
                                                                                                <Label htmlFor="d_5_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_5_value"
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
                                                                                            className={cn(
                                                                                                "text-right",
                                                                                                form.watch(
                                                                                                    "d_5",
                                                                                                ) !==
                                                                                                    true &&
                                                                                                    "hidden",
                                                                                            )}
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "d_5",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "d_5",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 13A"
                                                                                        : "Tidak, silakan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* D.6 */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        6
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        memperoleh
                                                                        Fasilitas
                                                                        Pengurangan
                                                                        Penghasilan
                                                                        Bruto
                                                                        untuk
                                                                        Kegiatan
                                                                        Praktik
                                                                        Kerja,
                                                                        Pemagangan,
                                                                        dan/atau
                                                                        Pembelajaran
                                                                        Dalam
                                                                        Rangka
                                                                        Pembinaan
                                                                        dan
                                                                        Pengembangan
                                                                        Sumber
                                                                        Daya
                                                                        Manusia
                                                                        Berbasis
                                                                        Kompetensi
                                                                        Tertentu?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_6"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="d_6_tidak"
                                                                                                />
                                                                                                <Label htmlFor="d_6_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="d_6_ya"
                                                                                                />
                                                                                                <Label htmlFor="d_6_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_6_value"
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
                                                                                            className={cn(
                                                                                                "text-right",
                                                                                                form.watch(
                                                                                                    "d_6",
                                                                                                ) !==
                                                                                                    true &&
                                                                                                    "hidden",
                                                                                            )}
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "d_6",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "d_6",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 13B"
                                                                                        : "Tidak, silakan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* D.7 */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        7
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Penghasilan
                                                                        Neto
                                                                        Fiskal
                                                                        Setelah
                                                                        Fasilitas
                                                                        Pajak
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <NumberField
                                                                            name="d_7"
                                                                            disabled
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* D.8 */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        8
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        terdapat
                                                                        kerugian
                                                                        fiskal
                                                                        yang
                                                                        dapat
                                                                        dikompensasikan?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_8"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="d_8_tidak"
                                                                                                />
                                                                                                <Label htmlFor="d_8_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="d_8_ya"
                                                                                                />
                                                                                                <Label htmlFor="d_8_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_8_value"
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
                                                                                            className={cn(
                                                                                                "text-right",
                                                                                                form.watch(
                                                                                                    "d_8",
                                                                                                ) !==
                                                                                                    true &&
                                                                                                    "hidden",
                                                                                            )}
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "d_8",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "d_8",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 7"
                                                                                        : "Tidak, silakan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* D.9 */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        9
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Penghasilan
                                                                        Kena
                                                                        Pajak
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <NumberField
                                                                            name="d_9"
                                                                            disabled
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* D.10 */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        10
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        memperoleh
                                                                        Fasilitas
                                                                        Pengurangan
                                                                        Penghasilan
                                                                        Bruto
                                                                        untuk
                                                                        Kegiatan
                                                                        Penelitian
                                                                        dan
                                                                        Pengembangan?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_10"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="d_10_tidak"
                                                                                                />
                                                                                                <Label htmlFor="d_10_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="d_10_ya"
                                                                                                />
                                                                                                <Label htmlFor="d_10_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_10_value"
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
                                                                                            className={cn(
                                                                                                "text-right",
                                                                                                form.watch(
                                                                                                    "d_10",
                                                                                                ) !==
                                                                                                    true &&
                                                                                                    "hidden",
                                                                                            )}
                                                                                            disabled
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "d_10",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "d_10",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 13B"
                                                                                        : "Tidak, silakan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* D.11 */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        11
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Tarif
                                                                        Pajak{" "}
                                                                        <span className="text-destructive">
                                                                            *
                                                                        </span>
                                                                    </td>
                                                                    <td
                                                                        className="p-4 align-middle"
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                    >
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="d_11"
                                                                            render={({
                                                                                field,
                                                                            }) => {
                                                                                const [
                                                                                    openTarif,
                                                                                    setOpenTarif,
                                                                                ] =
                                                                                    React.useState(
                                                                                        false,
                                                                                    );
                                                                                const selected =
                                                                                    d11TarifOptions.find(
                                                                                        (
                                                                                            option,
                                                                                        ) =>
                                                                                            option.value ===
                                                                                            field.value,
                                                                                    );
                                                                                return (
                                                                                    <FormItem>
                                                                                        <Popover
                                                                                            open={
                                                                                                openTarif
                                                                                            }
                                                                                            onOpenChange={
                                                                                                setOpenTarif
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
                                                                                                            "w-full justify-between font-normal",
                                                                                                            !field.value &&
                                                                                                                "text-muted-foreground",
                                                                                                        )}
                                                                                                    >
                                                                                                        <span className="truncate">
                                                                                                            {selected
                                                                                                                ? selected.label
                                                                                                                : "Pilih tarif pajak"}
                                                                                                        </span>
                                                                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                                                    </Button>
                                                                                                </FormControl>
                                                                                            </PopoverTrigger>
                                                                                            <PopoverContent
                                                                                                className="w-[min(92vw,480px)] p-0"
                                                                                                align="start"
                                                                                            >
                                                                                                <Command>
                                                                                                    <CommandGroup>
                                                                                                        {d11TarifOptions.map(
                                                                                                            (
                                                                                                                tarif,
                                                                                                            ) => (
                                                                                                                <CommandItem
                                                                                                                    key={
                                                                                                                        tarif.value
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        tarif.label
                                                                                                                    }
                                                                                                                    onSelect={() => {
                                                                                                                        field.onChange(
                                                                                                                            tarif.value,
                                                                                                                        );
                                                                                                                        setOpenTarif(
                                                                                                                            false,
                                                                                                                        );
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Check
                                                                                                                        className={cn(
                                                                                                                            "mr-2 h-4 w-4",
                                                                                                                            field.value ===
                                                                                                                                tarif.value
                                                                                                                                ? "opacity-100"
                                                                                                                                : "opacity-0",
                                                                                                                        )}
                                                                                                                    />
                                                                                                                    {
                                                                                                                        tarif.label
                                                                                                                    }
                                                                                                                </CommandItem>
                                                                                                            ),
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
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {selectedD11Tarif && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {
                                                                                        d11InfoText
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* D.12 */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        12
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        PPh
                                                                        Terutang
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <NumberField
                                                                            name="d_12"
                                                                            disabled
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* E. PENGHITUNGAN PPh TERUTANG */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="penghitunganPphTerutang"
                                        >
                                            <AccordionItem value="penghitunganPphTerutang">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    E. PENGHITUNGAN PPh TERUTANG
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="rounded-lg overflow-x-auto">
                                                        <table className="w-full min-w-[880px] table-fixed border-collapse">
                                                            <colgroup>
                                                                <col
                                                                    style={{
                                                                        width: "52px",
                                                                    }}
                                                                />
                                                                <col />
                                                                <col
                                                                    style={{
                                                                        width: "200px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "180px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "260px",
                                                                    }}
                                                                />
                                                            </colgroup>
                                                            <tbody>
                                                                {/* E.13 */}
                                                                <tr className="bg-white">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        13
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        terdapat
                                                                        kredit
                                                                        pajak
                                                                        yang
                                                                        dibayarkan
                                                                        di luar
                                                                        negeri
                                                                        dan/atau
                                                                        dipotong/pungut
                                                                        oleh
                                                                        pihak
                                                                        lain?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="e_13"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="e_13_tidak"
                                                                                                />
                                                                                                <Label htmlFor="e_13_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="e_13_ya"
                                                                                                />
                                                                                                <Label htmlFor="e_13_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="e_13_value"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className={cn(
                                                                                                    "text-right",
                                                                                                    form.watch(
                                                                                                        "e_13",
                                                                                                    ) !==
                                                                                                        true &&
                                                                                                        "hidden",
                                                                                                )}
                                                                                                disabled
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "e_13",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "e_13",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 3"
                                                                                        : "Tidak, lanjutkan ke pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* E.14 */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        14
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Angsuran
                                                                        PPh
                                                                        Pasal 25
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="e_14"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className="text-right"
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* E.15 */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        15
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Surat
                                                                        Tagihan
                                                                        Pajak
                                                                        PPh
                                                                        Pasal 25
                                                                        (hanya
                                                                        pokok
                                                                        pajak)
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="e_15"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className="text-right"
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* E.16 */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        16
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        memperoleh
                                                                        Fasilitas
                                                                        Pengurangan
                                                                        PPh
                                                                        Badan?{" "}
                                                                        <span className="text-destructive">
                                                                            *
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="e_16"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="e_16_tidak"
                                                                                                />
                                                                                                <Label htmlFor="e_16_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="e_16_ya"
                                                                                                />
                                                                                                <Label htmlFor="e_16_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="e_16_value"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className={cn(
                                                                                                    "text-right",
                                                                                                    form.watch(
                                                                                                        "e_16",
                                                                                                    ) !==
                                                                                                        true &&
                                                                                                        "hidden",
                                                                                                )}
                                                                                                disabled
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "e_16",
                                                                        ) !==
                                                                            undefined && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    {form.watch(
                                                                                        "e_16",
                                                                                    )
                                                                                        ? "Ya, silahkan mengisi Lampiran 13C"
                                                                                        : "Tidak, silahkan lanjut pertanyaan berikutnya"}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* F. PPH KURANG / LEBIH BAYAR */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="kurangLebihBayar"
                                        >
                                            <AccordionItem value="kurangLebihBayar">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    F. PPH KURANG/LEBIH BAYAR
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="rounded-lg overflow-x-auto">
                                                        <table className="w-full min-w-[880px] border-collapse">
                                                            <colgroup>
                                                                <col
                                                                    style={{
                                                                        width: "52px",
                                                                    }}
                                                                />
                                                                <col />
                                                                <col
                                                                    style={{
                                                                        width: "200px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "180px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "260px",
                                                                    }}
                                                                />
                                                            </colgroup>
                                                            <tbody>
                                                                {/* 17.a */}
                                                                <tr className="bg-white">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        17.a
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        PPh yang
                                                                        Kurang/Lebih
                                                                        Bayar
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="f_17a"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className="text-right"
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* 17.b */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        17.b
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        terdapat
                                                                        Surat
                                                                        Keputusan
                                                                        Persetujuan
                                                                        Pengangsuran
                                                                        atau
                                                                        Penundaan
                                                                        Pembayaran
                                                                        Pajak?
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="f_17b"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="f_17b_tidak"
                                                                                                />
                                                                                                <Label htmlFor="f_17b_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="f_17b_ya"
                                                                                                />
                                                                                                <Label htmlFor="f_17b_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="f_17b_value"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className={cn(
                                                                                                    "text-right",
                                                                                                    form.watch(
                                                                                                        "f_17b",
                                                                                                    ) !==
                                                                                                        true &&
                                                                                                        "hidden",
                                                                                                )}
                                                                                                disabled={
                                                                                                    form.watch(
                                                                                                        "f_17b",
                                                                                                    ) !==
                                                                                                    true
                                                                                                }
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* 17.c */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        17.c
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        PPh yang
                                                                        masih
                                                                        harus
                                                                        dibayar
                                                                        atau
                                                                        lebih
                                                                        dibayar
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="f_17c"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
                                                                                        <FormControl>
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={formatRupiah(
                                                                                                    field.value,
                                                                                                )}
                                                                                                className="text-right"
                                                                                                disabled
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* 18.a */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        18.a
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        PPh yang
                                                                        kurang
                                                                        atau
                                                                        lebih
                                                                        bayar
                                                                        pada SPT
                                                                        yang
                                                                        dibetulkan
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {/* <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="f_18a"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="f_18a_tidak"
                                                                                                />
                                                                                                <Label htmlFor="f_18a_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="f_18a_ya"
                                                                                                />
                                                                                                <Label htmlFor="f_18a_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        /> */}
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="f_18a_value"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
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
                                                                                                className={cn(
                                                                                                    "text-right",
                                                                                                    form.watch(
                                                                                                        "f_18a",
                                                                                                    ) !==
                                                                                                        true &&
                                                                                                        "hidden",
                                                                                                )}
                                                                                                disabled={
                                                                                                    form.watch(
                                                                                                        "f_18a",
                                                                                                    ) !==
                                                                                                    true
                                                                                                }
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* 18.b */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        18.b
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        PPh yang
                                                                        kurang
                                                                        atau
                                                                        lebih
                                                                        bayar
                                                                        karena
                                                                        pembetulan
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name="f_18b"
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem className="flex-1">
                                                                                        <FormControl>
                                                                                            <Input
                                                                                                type="text"
                                                                                                value={formatRupiah(
                                                                                                    field.value,
                                                                                                )}
                                                                                                className="text-right"
                                                                                                disabled
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>

                                                                {/* 19.a */}
                                                                <tr className="bg-gray-50 border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        19.a
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Lebih
                                                                        Bayar
                                                                        pada
                                                                        Angka
                                                                        17.a.
                                                                        atau
                                                                        18.b.
                                                                        mohon
                                                                        untuk:
                                                                        (pilih
                                                                        salah
                                                                        satu):{" "}
                                                                        <span className="text-destructive">
                                                                            *
                                                                        </span>
                                                                    </td>
                                                                    <td
                                                                        colSpan={
                                                                            3
                                                                        }
                                                                        className="p-4 align-middle"
                                                                    >
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="f_19a"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-col gap-2"
                                                                                            value={
                                                                                                field.value ??
                                                                                                ""
                                                                                            }
                                                                                            onValueChange={(
                                                                                                value,
                                                                                            ) => {
                                                                                                if (
                                                                                                    isF19aEnabled
                                                                                                ) {
                                                                                                    field.onChange(
                                                                                                        value,
                                                                                                    );
                                                                                                    immediateDraftSave(
                                                                                                        {
                                                                                                            f_19a: value,
                                                                                                        },
                                                                                                    );
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="dikembalikan melalui pemeriksaan"
                                                                                                    id="f_19a_periksa"
                                                                                                    disabled={
                                                                                                        !isF19aEnabled
                                                                                                    }
                                                                                                />
                                                                                                <Label
                                                                                                    htmlFor="f_19a_periksa"
                                                                                                    className={cn(
                                                                                                        !isF19aEnabled &&
                                                                                                            "text-muted-foreground",
                                                                                                    )}
                                                                                                >
                                                                                                    dikembalikan
                                                                                                    melalui
                                                                                                    pemeriksaan
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="dikembalikan melalui Pengembalian Pendahuluan"
                                                                                                    id="f_19a_pendahuluan"
                                                                                                    disabled={
                                                                                                        !isF19aEnabled
                                                                                                    }
                                                                                                />
                                                                                                <Label
                                                                                                    htmlFor="f_19a_pendahuluan"
                                                                                                    className={cn(
                                                                                                        !isF19aEnabled &&
                                                                                                            "text-muted-foreground",
                                                                                                    )}
                                                                                                >
                                                                                                    dikembalikan
                                                                                                    melalui
                                                                                                    Pengembalian
                                                                                                    Pendahuluan
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                </tr>

                                                                {/* 19.b - Informasi Rekening */}
                                                                <tr className="bg-white border-t ">
                                                                    <td
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="p-4"
                                                                    >
                                                                        <p className="text-sm font-semibold mb-4">
                                                                            19.b.
                                                                            Informasi
                                                                            rekening
                                                                        </p>
                                                                        <div className="flex justify-end">
                                                                            <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-4 gap-4 md:gap-0">
                                                                                <div></div>
                                                                                <div className="order-last md:order-none grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-y-3 gap-x-4 items-center">
                                                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                                                        Pilih
                                                                                        Rekening
                                                                                        Bank
                                                                                    </div>
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="outline"
                                                                                        size="icon"
                                                                                        className="justify-self-start"
                                                                                        onClick={() => {
                                                                                            fetchBanks();
                                                                                            setOpenBankModal(
                                                                                                true,
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <FolderOpen className="h-4 w-4" />
                                                                                    </Button>

                                                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                                                        Nomor
                                                                                        Rekening
                                                                                    </div>
                                                                                    <FormField
                                                                                        control={
                                                                                            form.control
                                                                                        }
                                                                                        name="account_number"
                                                                                        render={({
                                                                                            field,
                                                                                        }) => (
                                                                                            <FormItem>
                                                                                                <FormControl>
                                                                                                    <Input
                                                                                                        value={
                                                                                                            field.value ??
                                                                                                            ""
                                                                                                        }
                                                                                                        readOnly
                                                                                                        placeholder=""
                                                                                                        className="w-full bg-gray-100"
                                                                                                    />
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                            </FormItem>
                                                                                        )}
                                                                                    />

                                                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                                                        Nama
                                                                                        Bank
                                                                                    </div>
                                                                                    <FormField
                                                                                        control={
                                                                                            form.control
                                                                                        }
                                                                                        name="bank_name"
                                                                                        render={({
                                                                                            field,
                                                                                        }) => (
                                                                                            <FormItem>
                                                                                                <FormControl>
                                                                                                    <Input
                                                                                                        value={
                                                                                                            field.value ??
                                                                                                            ""
                                                                                                        }
                                                                                                        readOnly
                                                                                                        placeholder=""
                                                                                                        className="w-full bg-gray-100"
                                                                                                    />
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                            </FormItem>
                                                                                        )}
                                                                                    />

                                                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                                                        Nama
                                                                                        Pemilik
                                                                                        Rekening
                                                                                    </div>
                                                                                    <FormField
                                                                                        control={
                                                                                            form.control
                                                                                        }
                                                                                        name="account_name"
                                                                                        render={({
                                                                                            field,
                                                                                        }) => (
                                                                                            <FormItem>
                                                                                                <FormControl>
                                                                                                    <Input
                                                                                                        value={
                                                                                                            field.value ??
                                                                                                            ""
                                                                                                        }
                                                                                                        readOnly
                                                                                                        placeholder=""
                                                                                                        className="w-full bg-gray-100"
                                                                                                    />
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                            </FormItem>
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* G. PERHITUNGAN ANGSURAN PPh PASAL 25 TAHUN BERJALAN */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="angsuran"
                                        >
                                            <AccordionItem value="angsuran">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    G. PERHITUNGAN ANGSURAN PPh
                                                    PASAL 25 TAHUN BERJALAN
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="rounded-lg overflow-x-auto">
                                                        <table className="w-full min-w-[880px] table-fixed border-collapse">
                                                            <colgroup>
                                                                <col
                                                                    style={{
                                                                        width: "52px",
                                                                    }}
                                                                />
                                                                <col />
                                                                <col
                                                                    style={{
                                                                        width: "200px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "180px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "260px",
                                                                    }}
                                                                />
                                                            </colgroup>
                                                            <tbody>
                                                                <tr className="bg-white">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        20
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Apakah
                                                                        Wajib
                                                                        Pajak
                                                                        berkewajiban
                                                                        menyampaikan
                                                                        Angsuran
                                                                        Laporan
                                                                        Penghitungan
                                                                        PPh
                                                                        Pasal
                                                                        25? *
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="g_20"
                                                                            render={({
                                                                                field,
                                                                            }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <RadioGroup
                                                                                            className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                    value="tidak"
                                                                                                    id="g_20_tidak"
                                                                                                />
                                                                                                <Label htmlFor="g_20_tidak">
                                                                                                    Tidak
                                                                                                </Label>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value="ya"
                                                                                                    id="g_20_ya"
                                                                                                />
                                                                                                <Label htmlFor="g_20_ya">
                                                                                                    Ya
                                                                                                </Label>
                                                                                            </div>
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        <NumberField
                                                                            name="g_20_value"
                                                                            disabled
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle">
                                                                        {form.watch(
                                                                            "g_20",
                                                                        ) ===
                                                                            false && (
                                                                            <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                <span>
                                                                                    Ya,
                                                                                    silahkan
                                                                                    mengisi
                                                                                    Lampiran
                                                                                    6
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* H. PERNYATAAN TRANSAKSI */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="pernyataanTransaksi"
                                        >
                                            <AccordionItem value="pernyataanTransaksi">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    H. PERNYATAAN TRANSAKSI
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="rounded-lg overflow-x-auto">
                                                        <table className="w-full min-w-[880px] table-fixed border-collapse">
                                                            <colgroup>
                                                                <col
                                                                    style={{
                                                                        width: "52px",
                                                                    }}
                                                                />
                                                                <col />
                                                                <col
                                                                    style={{
                                                                        width: "200px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "180px",
                                                                    }}
                                                                />
                                                                <col
                                                                    style={{
                                                                        width: "260px",
                                                                    }}
                                                                />
                                                            </colgroup>
                                                            <tbody>
                                                                {[
                                                                    {
                                                                        number: "21.a",
                                                                        name: "h_21_a" as const,
                                                                        label: "Apakah terdapat transaksi yang dipengaruhi hubungan istimewa atau transaksi dengan pihak yang merupakan penduduk tax haven country?",
                                                                    },
                                                                    {
                                                                        number: "21.b",
                                                                        name: "h_21_b" as const,
                                                                        label: "Apakah Wajib Pajak berkewajiban menyampaikan Dokumen Penentuan Harga Transfer? *",
                                                                    },
                                                                    {
                                                                        number: "21.c",
                                                                        name: "h_21_c" as const,
                                                                        label: "Apakah terdapat penanaman modal pada perusahaan afiliasi? *",
                                                                    },
                                                                    {
                                                                        number: "21.d",
                                                                        name: "h_21_d" as const,
                                                                        label: "Apakah Wajib Pajak memiliki utang dari pemilik modal atau perusahaan afiliasi, dan/atau piutang ke pemilik modal atau perusahaan afiliasi? *",
                                                                    },
                                                                    {
                                                                        number: "21.e",
                                                                        name: "h_21_e" as const,
                                                                        label: "Apakah Wajib Pajak membebankan biaya penyusutan dan/atau amortisasi fiskal? *",
                                                                    },
                                                                    {
                                                                        number: "21.f",
                                                                        name: "h_21_f" as const,
                                                                        label: "Apakah Wajib Pajak membebankan biaya entertainment, biaya promosi dan penjualan, penggantian atau imbalan dalam bentuk natura dan/atau kenikmatan, dan piutang yang nyata-nyata tidak dapat ditagih? *",
                                                                    },
                                                                    {
                                                                        number: "21.g",
                                                                        name: "h_21_g" as const,
                                                                        label: "Apakah Wajib Pajak memperoleh fasilitas perpajakan dalam rangka penanaman modal di bidang-bidang usaha tertentu dan/atau daerah-daerah tertentu selain pengurangan penghasilan neto *",
                                                                    },
                                                                    {
                                                                        number: "21.h",
                                                                        name: "h_21_h" as const,
                                                                        label: "Apakah Wajib Pajak memiliki sisa lebih yang digunakan untuk pembangunan dan pengadaan sarana dan prasarana? *",
                                                                    },
                                                                    {
                                                                        number: "21.i",
                                                                        name: "h_21_i" as const,
                                                                        label: "Apakah Wajib Pajak menerima atau memperoleh penghasilan dividen dari luar negeri dan melaporkannya sebagai penghasilan yang tidak termasuk objek pajak? *",
                                                                    },
                                                                ].map(
                                                                    (
                                                                        {
                                                                            number,
                                                                            name,
                                                                            label,
                                                                        },
                                                                        idx,
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                name
                                                                            }
                                                                            className={
                                                                                idx %
                                                                                    2 ===
                                                                                0
                                                                                    ? "bg-white"
                                                                                    : "bg-gray-50 border-t"
                                                                            }
                                                                        >
                                                                            <td className="p-4 text-sm font-medium align-middle">
                                                                                {
                                                                                    number
                                                                                }
                                                                            </td>
                                                                            <td className="p-4 text-sm align-middle">
                                                                                {
                                                                                    label
                                                                                }
                                                                            </td>
                                                                            <td className="p-4 align-middle">
                                                                                <FormField
                                                                                    control={
                                                                                        form.control
                                                                                    }
                                                                                    name={
                                                                                        name
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <FormItem>
                                                                                            <FormControl>
                                                                                                <RadioGroup
                                                                                                    className="flex flex-wrap items-center justify-start md:justify-center gap-3"
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
                                                                                                            value="tidak"
                                                                                                            id={`${name}_tidak`}
                                                                                                        />
                                                                                                        <Label
                                                                                                            htmlFor={`${name}_tidak`}
                                                                                                        >
                                                                                                            Tidak
                                                                                                        </Label>
                                                                                                    </div>
                                                                                                    <div className="flex items-center space-x-2">
                                                                                                        <RadioGroupItem
                                                                                                            value="ya"
                                                                                                            id={`${name}_ya`}
                                                                                                        />
                                                                                                        <Label
                                                                                                            htmlFor={`${name}_ya`}
                                                                                                        >
                                                                                                            Ya
                                                                                                        </Label>
                                                                                                    </div>
                                                                                                </RadioGroup>
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )}
                                                                                />
                                                                            </td>
                                                                            <td className="p-4 align-middle" />
                                                                            <td className="p-4 align-middle">
                                                                                <div className="bg-sky-200/70 text-sky-950 px-3 py-2 rounded text-sm flex items-start gap-2">
                                                                                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                                                    <span>
                                                                                        {getH21InfoText(
                                                                                            name,
                                                                                            form.watch(
                                                                                                name,
                                                                                            ) ===
                                                                                                true,
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ),
                                                                )}

                                                                {/* 21.j - nilai input */}
                                                                <tr className="bg-white border-t">
                                                                    <td className="p-4 text-sm font-medium align-middle">
                                                                        21.j
                                                                    </td>
                                                                    <td className="p-4 text-sm align-middle">
                                                                        Kelebihan
                                                                        PPh yang
                                                                        bersifat
                                                                        final
                                                                        atas
                                                                        penghasilan
                                                                        dari
                                                                        usaha
                                                                        dengan
                                                                        peredaran
                                                                        bruto
                                                                        tertentu
                                                                        yang
                                                                        dapat
                                                                        diajukan
                                                                        pengembalian
                                                                        pajak *
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                    <td className="p-4 align-middle">
                                                                        <FormField
                                                                            control={
                                                                                form.control
                                                                            }
                                                                            name="h_21_j"
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
                                                                                            className="text-right"
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 align-middle" />
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* I. LAMPIRAN LAINNYA */}
                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="lampiranLainnya"
                                        >
                                            <AccordionItem value="lampiranLainnya">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    I. LAMPIRAN LAINNYA
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="rounded-lg overflow-x-auto">
                                                        {/* a.1 */}
                                                        <div className="bg-white flex flex-col lg:flex-row w-full">
                                                            <div className="p-4 border-b lg:border-b-0 flex-1 min-w-0 flex items-start">
                                                                <span className="text-sm">
                                                                    a. 1.
                                                                    Laporan
                                                                    Keuangan/Laporan
                                                                    Keuangan
                                                                    yang Telah
                                                                    Diaudit*
                                                                </span>
                                                            </div>
                                                            <div className="p-4 bg-gray-50 w-full lg:max-w-4xl lg:my-2">
                                                                <input
                                                                    ref={
                                                                        iA1FileInputRef
                                                                    }
                                                                    type="file"
                                                                    accept=".pdf,application/pdf"
                                                                    className="hidden"
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleIFileChange(
                                                                            "i_a_1",
                                                                            e,
                                                                        )
                                                                    }
                                                                />
                                                                <div className="flex flex-wrap gap-2 items-center mb-3">
                                                                    <Button
                                                                        type="button"
                                                                        className="bg-blue-950 hover:bg-blue-900 h-8 px-3 text-xs"
                                                                        disabled={
                                                                            iFileUploading.i_a_1
                                                                        }
                                                                        onClick={() =>
                                                                            iA1FileInputRef.current?.click()
                                                                        }
                                                                    >
                                                                        + Pilih
                                                                    </Button>

                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        className=" text-xs"
                                                                        disabled={
                                                                            !iFileNames.i_a_1 ||
                                                                            iFileUploading.i_a_1
                                                                        }
                                                                        onClick={() =>
                                                                            deleteIAttachment(
                                                                                "i_a_1",
                                                                                iA1FileInputRef,
                                                                            )
                                                                        }
                                                                    >
                                                                        × Batal
                                                                    </Button>
                                                                </div>
                                                                <div className="border rounded bg-white p-3 min-h-[48px]">
                                                                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                                                                        File
                                                                        yang
                                                                        Diunggah
                                                                    </p>
                                                                    <p className="text-sm text-gray-700">
                                                                        {iFileUploading.i_a_1 ? (
                                                                            "Sedang mengunggah..."
                                                                        ) : iFileNames.i_a_1 ? (
                                                                            iFileNames.i_a_1
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-xs">
                                                                                Belum
                                                                                ada
                                                                                file
                                                                                yang
                                                                                diunggah
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* a.2 */}
                                                        <div className="bg-white border-t flex flex-col lg:flex-row w-full">
                                                            <div className="p-4 border-b lg:border-b-0 flex-1 min-w-0 flex items-start">
                                                                <span className="text-sm">
                                                                    a. 2.
                                                                    Laporan
                                                                    Keuangan
                                                                    Konsolidasian
                                                                    untuk Wajib
                                                                    Pajak Grup
                                                                </span>
                                                            </div>
                                                            <div className="p-4 bg-gray-50 w-full lg:max-w-4xl lg:my-2">
                                                                <input
                                                                    ref={
                                                                        iA2FileInputRef
                                                                    }
                                                                    type="file"
                                                                    accept=".pdf,application/pdf"
                                                                    className="hidden"
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleIFileChange(
                                                                            "i_a_2",
                                                                            e,
                                                                        )
                                                                    }
                                                                />
                                                                <div className="flex flex-wrap gap-2 items-center mb-3">
                                                                    <Button
                                                                        type="button"
                                                                        className="bg-blue-950 hover:bg-blue-900 h-8 px-3 text-xs"
                                                                        disabled={
                                                                            iFileUploading.i_a_2
                                                                        }
                                                                        onClick={() =>
                                                                            iA2FileInputRef.current?.click()
                                                                        }
                                                                    >
                                                                        + Pilih
                                                                    </Button>

                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        className="h-8 px-3 text-xs"
                                                                        disabled={
                                                                            !iFileNames.i_a_2 ||
                                                                            iFileUploading.i_a_2
                                                                        }
                                                                        onClick={() =>
                                                                            deleteIAttachment(
                                                                                "i_a_2",
                                                                                iA2FileInputRef,
                                                                            )
                                                                        }
                                                                    >
                                                                        × Batal
                                                                    </Button>
                                                                </div>
                                                                <div className="border rounded bg-white p-3 min-h-[48px]">
                                                                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                                                                        File
                                                                        yang
                                                                        Diunggah
                                                                    </p>
                                                                    <p className="text-sm text-gray-700">
                                                                        {iFileUploading.i_a_2 ? (
                                                                            "Sedang mengunggah..."
                                                                        ) : iFileNames.i_a_2 ? (
                                                                            iFileNames.i_a_2
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-xs">
                                                                                Belum
                                                                                ada
                                                                                file
                                                                                yang
                                                                                diunggah
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {(
                                                            [
                                                                {
                                                                    field: "i_b" as const,
                                                                    label: "b. Daftar Penyusutan dan Amortisasi Fiskal",
                                                                },
                                                                {
                                                                    field: "i_c" as const,
                                                                    label: "c. Penghitungan Kompensasi Kerugian",
                                                                },
                                                                {
                                                                    field: "i_d" as const,
                                                                    label: "d. Daftar Fasilitas Penanaman Modal",
                                                                },
                                                                {
                                                                    field: "i_e" as const,
                                                                    label: "e. Daftar Cabang Utama Perusahaan",
                                                                },
                                                                {
                                                                    field: "i_f" as const,
                                                                    label: "f. Surat Setoran Pajak (SSP) Lembar ke-3 PPh Pasal 29",
                                                                },
                                                                {
                                                                    field: "i_f_1" as const,
                                                                    label: "f.1. Surat Kuasa Khusus",
                                                                },
                                                                {
                                                                    field: "i_f_2" as const,
                                                                    label: "f.2. Perhitungan PPh Atas Penyerahan Hak atas Tanah dan/atau Bangunan",
                                                                },
                                                                {
                                                                    field: "i_f_3" as const,
                                                                    label: "f.3. Pernyataan Transaksi Dalam Hubungan Istimewa (Form 3A/3A1)",
                                                                },
                                                                {
                                                                    field: "i_f_4" as const,
                                                                    label: "f.4. Daftar Nominatif Biaya Promosi",
                                                                },
                                                                {
                                                                    field: "i_g" as const,
                                                                    label: "g. Kredit Pajak Luar Negeri",
                                                                },
                                                                {
                                                                    field: "i_h_1" as const,
                                                                    label: "h.1. Transkrip Kutipan Elemen-Elemen dari Laporan Keuangan",
                                                                },
                                                                {
                                                                    field: "i_h_2" as const,
                                                                    label: "h.2. Rekap Daftar Norma",
                                                                },
                                                                {
                                                                    field: "i_i" as const,
                                                                    label: "i. Dokumen/informasi tambahan lainnya yang diperlukan",
                                                                },
                                                                {
                                                                    field: "i_j" as const,
                                                                    label: "j. Dokumen yang disyaratkan bagi WP tertentu",
                                                                },
                                                            ] as {
                                                                field:
                                                                    | "i_b"
                                                                    | "i_c"
                                                                    | "i_d"
                                                                    | "i_e"
                                                                    | "i_f"
                                                                    | "i_f_1"
                                                                    | "i_f_2"
                                                                    | "i_f_3"
                                                                    | "i_f_4"
                                                                    | "i_g"
                                                                    | "i_h_1"
                                                                    | "i_h_2"
                                                                    | "i_i"
                                                                    | "i_j";
                                                                label: string;
                                                            }[]
                                                        ).map(
                                                            ({
                                                                field,
                                                                label,
                                                            }) => (
                                                                <div
                                                                    key={field}
                                                                    className="border-t bg-white flex flex-col lg:flex-row w-full"
                                                                >
                                                                    <div className="p-4 border-b lg:border-b-0 flex-1 min-w-0 flex items-start">
                                                                        <span className="text-sm">
                                                                            {
                                                                                label
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="p-4 bg-gray-50 w-full lg:max-w-4xl lg:my-2">
                                                                        <input
                                                                            ref={
                                                                                iFileRefMap[
                                                                                    field
                                                                                ]
                                                                            }
                                                                            type="file"
                                                                            accept=".pdf,application/pdf"
                                                                            className="hidden"
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                handleIFileChange(
                                                                                    field,
                                                                                    e,
                                                                                )
                                                                            }
                                                                        />
                                                                        <div className="flex flex-wrap gap-2 items-center mb-3">
                                                                            <Button
                                                                                type="button"
                                                                                className="bg-blue-950 hover:bg-blue-900  text-xs"
                                                                                disabled={
                                                                                    iFileUploading[
                                                                                        field
                                                                                    ]
                                                                                }
                                                                                onClick={() =>
                                                                                    iFileRefMap[
                                                                                        field
                                                                                    ].current?.click()
                                                                                }
                                                                            >
                                                                                +
                                                                                Pilih
                                                                            </Button>
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                className=" text-xs"
                                                                                disabled={
                                                                                    !iFileNames[
                                                                                        field
                                                                                    ] ||
                                                                                    iFileUploading[
                                                                                        field
                                                                                    ]
                                                                                }
                                                                                onClick={() =>
                                                                                    deleteIAttachment(
                                                                                        field,
                                                                                        iFileRefMap[
                                                                                            field
                                                                                        ],
                                                                                    )
                                                                                }
                                                                            >
                                                                                ×
                                                                                Batal
                                                                            </Button>
                                                                        </div>
                                                                        <div className="border rounded bg-white p-3 min-h-[48px]">
                                                                            <p className="text-xs text-muted-foreground font-semibold mb-1">
                                                                                File
                                                                                yang
                                                                                Diunggah
                                                                            </p>
                                                                            <p className="text-sm text-gray-700">
                                                                                {iFileUploading[
                                                                                    field
                                                                                ] ? (
                                                                                    "Sedang mengunggah..."
                                                                                ) : iFileNames[
                                                                                      field
                                                                                  ] ? (
                                                                                    iFileNames[
                                                                                        field
                                                                                    ]
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-xs">
                                                                                        Belum
                                                                                        ada
                                                                                        file
                                                                                        yang
                                                                                        diunggah
                                                                                    </span>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        <Accordion
                                            type="single"
                                            collapsible
                                            defaultValue="pernyataanJ"
                                        >
                                            <AccordionItem value="pernyataanJ">
                                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    J. PERNYATAAN
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="p-4 space-y-4">
                                                        {/* Checkbox pernyataan */}
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                id="pernyataanJ"
                                                                className="mt-1 h-4 w-4"
                                                                checked={
                                                                    pernyataanSetuju
                                                                }
                                                                onChange={(e) =>
                                                                    setPernyataanSetuju(
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="pernyataanJ"
                                                                className="text-sm text-gray-700 leading-relaxed break-words"
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
                                                                lengkap dan
                                                                jelas.
                                                            </label>
                                                        </div>

                                                        {/* Penandatangan */}
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="j_signer"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8">
                                                                        <span className="text-sm w-full sm:w-40 sm:shrink-0">
                                                                            Penandatangan
                                                                            *
                                                                        </span>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                className="flex flex-wrap items-start sm:items-center gap-4 sm:gap-6"
                                                                                value={
                                                                                    field.value
                                                                                }
                                                                                onValueChange={
                                                                                    field.onChange
                                                                                }
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="taxpayer"
                                                                                        id="j_signer_taxpayer"
                                                                                    />
                                                                                    <Label htmlFor="j_signer_taxpayer">
                                                                                        Wajib
                                                                                        Pajak
                                                                                    </Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem
                                                                                        value="representative"
                                                                                        id="j_signer_representative"
                                                                                    />
                                                                                    <Label htmlFor="j_signer_representative">
                                                                                        Kuasa
                                                                                        Wajib
                                                                                        Pajak
                                                                                    </Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Tanda Tangan */}
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8">
                                                            <span className="text-sm w-full sm:w-40 sm:shrink-0">
                                                                Tanda Tangan
                                                            </span>
                                                        </div>

                                                        {/* NPWP/NIK */}
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="j_signer_id"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8">
                                                                        <span className="text-sm w-full sm:w-40 sm:shrink-0">
                                                                            NPWP/NIK
                                                                        </span>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                value={
                                                                                    field.value ??
                                                                                    ""
                                                                                }
                                                                                className="w-full sm:max-w-md"
                                                                            />
                                                                        </FormControl>
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Nama */}
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="j_signer_name"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8">
                                                                        <span className="text-sm w-full sm:w-40 sm:shrink-0">
                                                                            Nama
                                                                        </span>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                value={
                                                                                    field.value ??
                                                                                    ""
                                                                                }
                                                                                className="w-full sm:max-w-md"
                                                                            />
                                                                        </FormControl>
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Posisi */}
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name="j_signer_position"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8">
                                                                        <span className="text-sm w-full sm:w-40 sm:shrink-0">
                                                                            Posisi
                                                                        </span>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                value={
                                                                                    field.value ??
                                                                                    ""
                                                                                }
                                                                                className="w-full sm:max-w-md"
                                                                            />
                                                                        </FormControl>
                                                                    </div>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* Pernyataan & Submit */}
                                    </div>
                                    <div className="p-4 rounded-lg  mt-4 space-y-4">
                                        <div className="flex gap-3 flex-wrap">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleSaveDraft}
                                            >
                                                Simpan Draft
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-blue-950 hover:bg-blue-900"
                                            >
                                                Submit SPT
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                {selectedL1Tab?.tab === "l1a" ? (
                                    <TabsContent value="l1a">
                                        <TabL1A
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1aLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1b" ? (
                                    <TabsContent value="l1b">
                                        <TabL1B
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1bLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1c" ? (
                                    <TabsContent value="l1c">
                                        <TabL1C
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1cLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1d" ? (
                                    <TabsContent value="l1d">
                                        <TabL1D
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1dLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1e" ? (
                                    <TabsContent value="l1e">
                                        <TabL1E
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1eLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1f" ? (
                                    <TabsContent value="l1f">
                                        <TabL1F
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1fLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1g" ? (
                                    <TabsContent value="l1g">
                                        <TabL1G
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1gLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1h" ? (
                                    <TabsContent value="l1h">
                                        <TabL1H
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1hLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1i" ? (
                                    <TabsContent value="l1i">
                                        <TabL1I
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1iLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1j" ? (
                                    <TabsContent value="l1j">
                                        <TabL1J
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1jLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1k" ? (
                                    <TabsContent value="l1k">
                                        <TabL1K
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1kLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {selectedL1Tab?.tab === "l1l" ? (
                                    <TabsContent value="l1l">
                                        <TabL1L
                                            user={{
                                                npwp:
                                                    entityIdentity?.npwp ?? "",
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            sptBadanId={sptBadan?.id ?? ""}
                                            masterAccounts={
                                                masterAccounts ?? []
                                            }
                                            l1aLayout={l1lLayout}
                                            l1a1={l1a1 ?? []}
                                            l1a2={l1a2 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L2 ======================== */}
                                <TabsContent value="l2">
                                    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-8">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-6">
                                                DAFTAR KEPEMILIKAN
                                            </h2>
                                            <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                HEADER
                                            </div>
                                            <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm">
                                                            Tahun Pajak
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={String(
                                                                spt.year,
                                                            )}
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm">
                                                            NPWP
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={
                                                                entityIdentity?.npwp ??
                                                                ""
                                                            }
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                A. DAFTAR PEMEGANG SAHAM/PEMILIK
                                                MODAL DAN JUMLAH
                                                DIVIDEN/PEMBAGIAN LABA YANG
                                                DIBAGIKAN SERTA DAFTAR SUSUNAN
                                                PENGURUS DAN KOMISARIS
                                            </p>
                                            <SectionL2A
                                                sptBadanId={sptBadan?.id ?? ""}
                                                data={l2a ?? []}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                B. DAFTAR PENYERTAAN MODAL,
                                                UTANG, DAN/ATAU PIUTANG PADA
                                                PERUSAHAAN AFILIASI
                                            </p>
                                            <SectionL2B
                                                sptBadanId={sptBadan?.id ?? ""}
                                                data={l2b ?? []}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                {isL3Enabled ? (
                                    <TabsContent value="l3">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-8">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    DAFTAR PAJAK PENGHASILAN
                                                    YANG DIPOTONG/ DIPUNGUT OLEH
                                                    PIHAK LAIN
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                    A. PENGHASILAN DARI LUAR
                                                    NEGERI
                                                </p>
                                                <SectionL3A
                                                    sptBadanId={
                                                        sptBadan?.id ?? ""
                                                    }
                                                    data={l3a ?? []}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                    B. PPh YANG
                                                    DIPOTONG/DIPUNGUT PIHAK LAIN
                                                </p>
                                                <SectionL3B
                                                    sptBadanId={
                                                        sptBadan?.id ?? ""
                                                    }
                                                    data={l3b ?? []}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {isL4Enabled ? (
                                    <TabsContent value="l4">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-8">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    PENGHASILAN YANG DIKENAKAN
                                                    PAJAK FINAL DAN DAFTAR
                                                    PENGHASILAN YANG BUKAN OBJEK
                                                    PAJAK
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                    A. PENGHASILAN YANG
                                                    DIKENAKAN PPh YANG BERSIFAT
                                                    FINAL
                                                </p>
                                                <SectionL4A
                                                    sptBadanId={
                                                        sptBadan?.id ?? ""
                                                    }
                                                    data={l4a ?? []}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                    B. PENGHASILAN YANG TIDAK
                                                    TERMASUK OBJEK PAJAK
                                                </p>
                                                <SectionL4B
                                                    sptBadanId={
                                                        sptBadan?.id ?? ""
                                                    }
                                                    data={l4b ?? []}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L5 ======================== */}
                                {isL5Enabled ? (
                                    <TabsContent value="l5">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-8">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    REKAPITULASI PEREDARAN BRUTO
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                    A. ALAMAT TEMPAT KEGIATAN
                                                    USAHA
                                                </p>
                                                <SectionL5A
                                                    sptBadanId={
                                                        sptBadan?.id ?? ""
                                                    }
                                                    data={l5a ?? []}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-4 bg-blue-950 p-4 rounded-lg">
                                                    B. REKAPITULASI PEREDARAN
                                                    BRUTO DAN PPh YANG TELAH
                                                    DIBAYAR
                                                </p>
                                                <SectionL5B
                                                    sptBadanId={
                                                        sptBadan?.id ?? ""
                                                    }
                                                    data={l5b ?? []}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                ) : null}
                                {isL6Enabled ? (
                                    <TabsContent value="l6">
                                        <TabL6
                                            sptBadan={{
                                                id: sptBadan?.id ?? "",
                                                npwp: activeBusinessEntity?.npwp,
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            l6={l6 ?? null}
                                            l7={l7 ?? []}
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L7 ======================== */}
                                {isL7Enabled ? (
                                    <TabsContent value="l7">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-8 mb-0">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    PENGHITUNGAN KOMPENSASI
                                                    KERUGIAN FISKAL
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <SectionL7
                                                sptBadanId={sptBadan?.id ?? ""}
                                                taxYear={Number(spt.year)}
                                                data={l7 ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L8 ======================== */}
                                {isL8Enabled ? (
                                    <TabsContent value="l8">
                                        <TabL8
                                            sptBadan={{
                                                id: sptBadan?.id ?? "",
                                                npwp: activeBusinessEntity?.npwp,
                                                d_9: sptBadan?.d_9 ?? 0,
                                                d_11_percentage:
                                                    form.watch(
                                                        "d_11_percentage",
                                                    ) ??
                                                    sptBadan?.d_11_percentage ??
                                                    0,
                                            }}
                                            spt={{ year: Number(spt.year) }}
                                            l8={l8 ?? null}
                                        />
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L9 ======================== */}
                                {isL9Enabled ? (
                                    <TabsContent value="l9">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-8">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    DAFTAR PENYUSUTAN DAN/ATAU
                                                    AMORTISASI FISKAL
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <SectionL9
                                                sptBadanId={sptBadan?.id ?? ""}
                                                data={l9 ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L10-A ======================== */}
                                {isL10ABCEnabled ? (
                                    <TabsContent value="l10a">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    DAFTAR TRANSAKSI YANG
                                                    DIPENGARUHI HUBUNGAN
                                                    ISTIMEWA
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <SectionL10A
                                                sptBadanId={sptBadan?.id ?? ""}
                                                data={l10a ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L10-B ======================== */}
                                {isL10ABCEnabled ? (
                                    <TabsContent value="l10b">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    PERNYATAAN TERKAIT TRANSAKSI
                                                    YANG DIPENGARUHI HUBUNGAN
                                                    ISTIMEWA
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <TabL10B
                                                sptBadanId={sptBadan?.id ?? ""}
                                                l10b={l10b ?? null}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L10-C ======================== */}
                                {isL10ABCEnabled ? (
                                    <TabsContent value="l10c">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    PERNYATAAN TRANSAKSI DENGAN
                                                    PIHAK YANG MERUPAKAN
                                                    PENDUDUK TAX HAVEN COUNTRY
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <SectionL10C
                                                sptBadanId={sptBadan?.id ?? ""}
                                                data={l10c ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L10-D ======================== */}
                                {isL10DEnabled ? (
                                    <TabsContent value="l10d">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    IKHTISAR DOKUMEN INDUK DAN
                                                    DOKUMEN LOKAL
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <TabL10D
                                                sptBadanId={sptBadan?.id ?? ""}
                                                l10d={l10d ?? null}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L11-A ======================== */}
                                {isL11AEnabled ? (
                                    <TabsContent value="l11a">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    RINCIAN BIAYA TERTENTU
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <TabL11A
                                                sptBadanId={sptBadan?.id ?? ""}
                                                l11a1={l11a1 ?? []}
                                                l11a2={l11a2 ?? []}
                                                l11a3={l11a3 ?? []}
                                                l11a4a={l11a4a ?? []}
                                                l11a4b={l11a4b ?? null}
                                                l11a5={l11a5 ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L11-B ======================== */}
                                <TabsContent value="l11b">
                                    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-6">
                                                PENGHITUNGAN BIAYA PINJAMAN YANG
                                                DAPAT DIBEBANKAN UNTUK KEPERLUAN
                                                PENGHITUNGAN PAJAK PENGHASILAN
                                            </h2>
                                            <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                HEADER
                                            </div>
                                            <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm">
                                                            Tahun Pajak
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={String(
                                                                spt.year,
                                                            )}
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm">
                                                            NPWP
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={
                                                                entityIdentity?.npwp ??
                                                                ""
                                                            }
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <TabL11B
                                            sptBadanId={sptBadan?.id ?? ""}
                                            l11b1={l11b1 ?? null}
                                            l11b2a={l11b2a ?? []}
                                            l11b2b={l11b2b ?? []}
                                            l11b3={l11b3 ?? []}
                                        />
                                    </div>
                                </TabsContent>

                                {/* ======================== TAB L11-C ======================== */}
                                <TabsContent value="l11c">
                                    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-6">
                                                LAPORAN UTANG SWASTA LUAR NEGERI
                                            </h2>
                                            <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                HEADER
                                            </div>
                                            <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm">
                                                            Tahun Pajak
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={String(
                                                                spt.year,
                                                            )}
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm">
                                                            NPWP
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={
                                                                entityIdentity?.npwp ??
                                                                ""
                                                            }
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <TabL11C
                                            sptBadanId={sptBadan?.id ?? ""}
                                            l11c={l11c ?? []}
                                        />
                                    </div>
                                </TabsContent>

                                {/* ======================== TAB L12-A ======================== */}
                                <TabsContent value="l12a">
                                    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-6">
                                                PENGHITUNGAN PPh PASAL 26 AYAT
                                                (4)
                                            </h2>
                                            <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                HEADER
                                            </div>
                                            <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm">
                                                            Tahun Pajak
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={String(
                                                                spt.year,
                                                            )}
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm">
                                                            NPWP
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={
                                                                entityIdentity?.npwp ??
                                                                ""
                                                            }
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <TabL12A
                                            sptBadanId={sptBadan?.id ?? ""}
                                            l12a={l12a ?? null}
                                        />
                                    </div>
                                </TabsContent>

                                {/* ======================== TAB L12-B ======================== */}
                                <TabsContent value="l12b">
                                    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-6">
                                                PEMBERITAHUAN PENANAMAN KEMBALI
                                                PENGHASILAN KENA PAJAK SESUDAH
                                                DIKURANGI PAJAK BAGI WAJIB PAJAK
                                                BENTUK USAHA TETAP
                                            </h2>
                                            <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                HEADER
                                            </div>
                                            <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm">
                                                            Tahun Pajak
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={String(
                                                                spt.year,
                                                            )}
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm">
                                                            NPWP
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={
                                                                entityIdentity?.npwp ??
                                                                ""
                                                            }
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <TabL12B
                                            sptBadanId={sptBadan?.id ?? ""}
                                            l12b12={l12b12 ?? []}
                                            l12b3={l12b3 ?? []}
                                            l12b4={l12b4 ?? []}
                                            l12b5={l12b5 ?? []}
                                            l12b6={l12b6 ?? []}
                                            l12b7={l12b7 ?? []}
                                            l12b8={l12b8 ?? []}
                                        />
                                    </div>
                                </TabsContent>

                                {/* ======================== TAB L13-A ======================== */}
                                {isL13Enabled ? (
                                    <TabsContent value="l13a">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    DAFTAR FASILITAS PENANAMAN
                                                    MODAL
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <TabL13A
                                                sptBadanId={sptBadan?.id ?? ""}
                                                l13a={l13a ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L13-B ======================== */}
                                {isL13BEnabled ? (
                                    <TabsContent value="l13b">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    DAFTAR TAMBAHAN PENGURANGAN
                                                    PENGHASILAN BRUTO
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <TabL13B
                                                sptBadanId={sptBadan?.id ?? ""}
                                                l13ba={l13ba ?? []}
                                                l13bb={l13bb ?? null}
                                                l13bc={l13bc ?? []}
                                                l13bd={l13bd ?? null}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L13-C ======================== */}
                                {isL13CEnabled ? (
                                    <TabsContent value="l13c">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    DAFTAR FASILITAS PENGURANGAN
                                                    PPh BADAN
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <TabL13C
                                                sptBadanId={sptBadan?.id ?? ""}
                                                l13c={l13c ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}

                                {/* ======================== TAB L14 ======================== */}
                                {isL14Enabled ? (
                                    <TabsContent value="l14">
                                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-6">
                                                    PENGGUNAAN SISA LEBIH UNTUK
                                                    PEMBANGUNAN DAN PENGADAAN
                                                    SARANA DAN PRASARANA
                                                </h2>
                                                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                                    HEADER
                                                </div>
                                                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-sm">
                                                                Tahun Pajak
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={String(
                                                                    spt.year,
                                                                )}
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm">
                                                                NPWP
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    entityIdentity?.npwp ??
                                                                    ""
                                                                }
                                                                disabled
                                                                className="bg-gray-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <TabL14
                                                sptBadanId={sptBadan?.id ?? ""}
                                                l14={l14 ?? []}
                                            />
                                        </div>
                                    </TabsContent>
                                ) : null}
                            </Tabs>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Bank Selection Modal */}
            <Dialog open={openBankModal} onOpenChange={setOpenBankModal}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Pilih Rekening Bank</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Cari nama bank..."
                                value={bankFilters.bank_name}
                                onChange={(e) =>
                                    setBankFilters((prev) => ({
                                        ...prev,
                                        bank_name: e.target.value,
                                    }))
                                }
                            />
                            <Input
                                placeholder="Cari no rekening..."
                                value={bankFilters.account_number}
                                onChange={(e) =>
                                    setBankFilters((prev) => ({
                                        ...prev,
                                        account_number: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        {isLoadingBanks ? (
                            <p className="text-sm text-muted-foreground">
                                Memuat data bank...
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Bank</TableHead>
                                        <TableHead>No. Rekening</TableHead>
                                        <TableHead>Nama Rekening</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBanks.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center text-muted-foreground"
                                            >
                                                Tidak ada data bank
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBanks.map((bank) => (
                                            <TableRow key={bank.id}>
                                                <TableCell>
                                                    {bank.bank_name}
                                                </TableCell>
                                                <TableCell>
                                                    {bank.account_number}
                                                </TableCell>
                                                <TableCell>
                                                    {bank.account_name}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {bank.account_type}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
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
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Tutup</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Modal */}
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

            {/* Password Modal */}
            <PasswordVerificationDialog
                open={openPasswordModal}
                onClose={() => setOpenPasswordModal(false)}
                onConfirm={handlePasswordConfirm}
            />
        </Authenticated>
    );
};

export default DetailSPTBadan;
