import { usePage } from "@inertiajs/react";
import {
    Ban,
    BookKey,
    Building2,
    CircleAlert,
    CircleCheck,
    CircleX,
    FileInput,
    FileOutput,
    FolderInput,
    FolderOutput,
    HandCoins,
    Home,
    Loader,
    MessageSquareOff,
    OctagonAlert,
    Receipt,
    School,
    Wallet,
} from "lucide-react";

const items = () => {
    const { url } = usePage();

    if (
        url.startsWith("/dashboard") ||
        url.startsWith("/business-entities") ||
        url.startsWith("/banks") ||
        url.startsWith("/courses") ||
        url.startsWith("/profile") ||
        url.startsWith("/tests")
    ) {
        return [
            {
                category: "Dashboard",
                items: [
                    {
                        title: "Beranda",
                        url: route("dashboard"),
                        icon: Home,
                    },
                    {
                        title: "Badan Usaha",
                        url: route("business-entities.index"),
                        icon: Building2,
                    },
                    {
                        title: "Bank Saya",
                        url: route("banks"),
                        icon: Wallet,
                    },
                    {
                        title: "Kelas Saya",
                        url: route("courses"),
                        icon: School,
                    },
                    {
                        title: "Ujian Saya",
                        url: route("tests.index"),
                        icon: BookKey,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/spt")) {
        return [
            {
                category: "Surat Pemberitahuan (SPT)",
                items: [
                    {
                        title: "Konsep SPT",
                        url: route("spt.konsep"),
                        icon: Home,
                    },
                    {
                        title: "SPT Menunggu Pembayaran",
                        url: route("spt.waiting"),
                        icon: Loader,
                    },
                    {
                        title: "SPT Dilaporkan",
                        url: route("spt.submitted"),
                        icon: OctagonAlert,
                    },
                    {
                        title: "SPT Ditolak",
                        url: route("spt.rejected"),
                        icon: MessageSquareOff,
                    },
                    {
                        title: "SPT Dibatalkan",
                        url: route("spt.canceled"),
                        icon: Ban,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/bppu")) {
        return [
            {
                category: "BPPU",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("bppu.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("bppu.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("bppu.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/bpnr")) {
        return [
            {
                category: "BPNR",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("bpnr.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("bpnr.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("bpnr.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/sp")) {
        return [
            {
                category: "Penyetoran Sendiri",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("sp.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("sp.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("sp.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/cy")) {
        return [
            {
                category: "Pemotongan Secara Digunggung",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("cy.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("cy.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("cy.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/bp21")) {
        return [
            {
                category: "BP 21 - Bukti Pemotongan Selain Pegawai Tetap",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("bp21.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("bp21.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("bp21.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/bp26")) {
        return [
            {
                category: "BP 26 - Bukti Pemotongan Wajib Pajak Luar Negeri",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("bp26.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("bp26.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("bp26.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/bpa1")) {
        return [
            {
                category: "BP A1 - Bukti Pemotongan A1 Masa Pajak Terakhir",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("bpa1.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("bpa1.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("bpa1.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/bpa2")) {
        return [
            {
                category: "BP A2 - Bukti Pemotongan A2 Masa Pajak Terakhir",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("bpa2.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("bpa2.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("bpa2.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/mp")) {
        return [
            {
                category: "Bukti Pemotongan Bulanan Pegawai Tetap",
                items: [
                    {
                        title: "Belum Terbit",
                        url: route("mp.notIssued"),
                        icon: CircleAlert,
                    },
                    {
                        title: "Telah Terbit",
                        url: route("mp.issued"),
                        icon: CircleCheck,
                    },
                    {
                        title: "Tidak Valid",
                        url: route("mp.invalid"),
                        icon: CircleX,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/invoice")) {
        return [
            {
                category: "Dashboard e-Faktur",
                items: [
                    {
                        title: "Dashboard",
                        url: route("invoice.index"),
                        icon: Home,
                    },
                ],
            },
            {
                category: "e-Faktur",
                items: [
                    {
                        title: "Pajak Keluaran",
                        url: route("invoice.output"),
                        icon: FileOutput,
                    },
                    {
                        title: "Pajak Masukan",
                        url: route("invoice.input"),
                        icon: FileInput,
                    },
                    {
                        title: "Retur Pajak Keluaran",
                        url: route("retur.output"),
                        icon: FolderOutput,
                    },
                    {
                        title: "Retur Pajak Masukan",
                        url: route("retur.input"),
                        icon: FolderInput,
                    },
                ],
            },
            {
                category: "Dokumen Lain",
                items: [
                    {
                        title: "Dokumen Keluaran",
                        url: route("other.export"),
                        icon: FileOutput,
                    },
                    {
                        title: "Dokumen Masukan",
                        url: route("other.import"),
                        icon: FileInput,
                    },
                    {
                        title: "Retur Dokumen Keluaran",
                        url: route("retur.export"),
                        icon: FolderOutput,
                    },
                    {
                        title: "Retur Dokumen Masukan",
                        url: route("retur.import"),
                        icon: FolderInput,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/payment")) {
        return [
            {
                category: "Pembayaran",
                items: [
                    {
                        title: "Layanan Mandiri Kode Billing",
                        url: route("payment.creation"),
                        icon: HandCoins,
                    },
                    {
                        title: "Daftar Kode Billing Belum Bayar",
                        url: route("payment.billing"),
                        icon: Receipt,
                    },
                ],
            },
        ];
    } else if (url.startsWith("/ledger")) {
        return [
            {
                category: "Buku Besar",
                items: [
                    {
                        title: "Buku Besar Saya",
                        url: route("ledger"),
                        icon: Wallet,
                    },
                ],
            },
        ];
    } else {
        return [
            {
                category: "General",
                items: [
                    {
                        title: "Home",
                        url: "/dashboard",
                        icon: Home,
                    },
                ],
            },
        ];
    }
};

export default items;
