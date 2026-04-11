"use client";

import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Banknote,
    CircleDollarSign,
    Coins,
    File,
    FileText,
    FileX,
    HandCoins,
    Printer,
    RefreshCcw,
    Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DataTableLedger } from "@/Components/layout/Ledger/data-table";
import { columns } from "@/Components/layout/Ledger/columns";

export default function BukuBesar({ ledgers }: any) {
    const { flash }: any = usePage().props;
    const [initialLedgers, setInitialLedgers] = useState(ledgers);

    const totalCredit = initialLedgers.reduce(
        (total: number, ledger: any) => total + ledger.credit_amount,
        0
    );
    const totalDebit = initialLedgers.reduce(
        (total: number, ledger: any) => total + ledger.debit_amount,
        0
    );
    const totalDebitUnpaid = initialLedgers.reduce(
        (total: number, ledger: any) => total + ledger.debit_unpaid,
        0
    );
    const totalCreditLeft = totalDebit + totalCredit;

    const saldo = totalCreditLeft - totalDebitUnpaid;

    const formatCurrency = (value: number) => {
        const formattedValue = Math.abs(value).toLocaleString("id-ID");
        return `${value < 0 ? "- Rp " : "Rp "}${formattedValue}`;
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const handleRefresh = () => {
        router.get(
            route("ledger"),
            {},
            {
                onSuccess: (page) => {
                    setInitialLedgers(page.props.ledgers);
                },
            }
        );
    };

    return (
        <Authenticated>
            <Head title="Buku Besar" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-primary">
                            Buku Besar Saya
                        </h1>
                        <Button
                            onClick={() =>
                                window.open(route("ledger.pdf"), "_blank")
                            }
                        >
                            <Printer /> Cetak Laporan Bulanan
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 lg:grid-cols-5">
                        <div className="p-5 md:space-y-1 rounded-xl bg-sidebar border">
                            <div className="flex items-center gap-2">
                                <HandCoins size={18} />
                                <h2 className="text-sm font-medium">Debit</h2>
                            </div>
                            <p
                                className={`md:text-lg font-bold ${
                                    totalDebit < 0
                                        ? "text-red-500"
                                        : totalDebit > 0
                                        ? "text-green-500"
                                        : "text-black"
                                }`}
                            >
                                {formatCurrency(totalDebit)}
                            </p>
                        </div>
                        <div className="p-5 md:space-y-1 rounded-xl bg-sidebar border">
                            <div className="flex items-center gap-2">
                                <CircleDollarSign size={18} />
                                <h2 className="text-sm font-medium">Kredit</h2>
                            </div>
                            <p
                                className={`md:text-lg font-bold ${
                                    totalCredit < 0
                                        ? "text-red-500"
                                        : totalCredit > 0
                                        ? "text-green-500"
                                        : "text-black"
                                }`}
                            >
                                {formatCurrency(totalCredit)}
                            </p>
                        </div>
                        <div className="p-5 md:space-y-1 rounded-xl bg-sidebar border">
                            <div className="flex items-center gap-2">
                                <Banknote size={18} />
                                <h2 className="text-sm font-medium">
                                    Debit Tersisa
                                </h2>
                            </div>
                            <p
                                className={`md:text-lg font-bold ${
                                    totalDebitUnpaid < 0
                                        ? "text-red-500"
                                        : totalDebitUnpaid > 0
                                        ? "text-green-500"
                                        : "text-black"
                                }`}
                            >
                                {formatCurrency(totalDebitUnpaid)}
                            </p>
                        </div>
                        <div className="p-5 md:space-y-1 rounded-xl bg-sidebar border">
                            <div className="flex items-center gap-2">
                                <Coins size={18} />
                                <h2 className="text-sm font-medium">
                                    Kredit Tersisa
                                </h2>
                            </div>
                            <p
                                className={`md:text-lg font-bold ${
                                    totalCreditLeft < 0
                                        ? "text-red-500"
                                        : totalCreditLeft > 0
                                        ? "text-green-500"
                                        : "text-black"
                                }`}
                            >
                                {formatCurrency(totalCreditLeft)}
                            </p>
                        </div>
                        <div className="p-5 md:space-y-1 rounded-xl bg-sidebar border">
                            <div className="flex items-center gap-2">
                                <Wallet size={18} />
                                <h2 className="text-sm font-medium">Saldo</h2>
                            </div>
                            <p
                                className={`md:text-lg font-bold ${
                                    saldo < 0
                                        ? "text-red-500"
                                        : saldo > 0
                                        ? "text-green-500"
                                        : "text-black"
                                }`}
                            >
                                {formatCurrency(saldo)}
                            </p>
                        </div>
                    </div>
                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex gap-2">
                            <Button
                                className="bg-yellow-400 text-primary hover:bg-yellow-400/90 hover:text-primary"
                                onClick={handleRefresh}
                            >
                                <RefreshCcw />
                            </Button>
                            <Button
                                className="bg-zinc-400 hover:bg-zinc-400/90"
                                disabled
                            >
                                <File />
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-600/90"
                                disabled
                            >
                                <FileX />
                            </Button>
                            <Button
                                className="bg-destructive hover:bg-destructive/90"
                                disabled
                            >
                                <FileText />
                            </Button>
                        </div>
                        <DataTableLedger
                            columns={columns}
                            data={initialLedgers}
                        />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
