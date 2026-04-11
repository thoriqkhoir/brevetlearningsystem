import { DataTableBilling } from "@/Components/layout/Billing/data-table";
import { columns, BillingColumns } from "@/Components/layout/Billing/columns";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";
import { File, FileText, FileX, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface Props extends PageProps {
    billingGroups: BillingColumns[];
}

export default function DaftarBilling({ billingGroups = [] }: Props) {
    const [totalAmount, setTotalAmount] = useState(0);
    const { flash }: any = usePage().props;
    const [initialBillings, setInitialBillings] = useState(billingGroups);

    useEffect(() => {
        setInitialBillings(billingGroups || []);
    }, [billingGroups]);

    const calculateTotalAmount = (billingData: any[]) => {
        const total = billingData
            .filter((billing) => {
                const activeDate = new Date(billing.active_period);
                const currentDate = new Date();
                return !billing.is_paid && activeDate >= currentDate;
            })
            .reduce((sum, billing) => sum + (billing.amount || 0), 0);

        return total;
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (initialBillings && initialBillings.length > 0) {
            const total = calculateTotalAmount(initialBillings);
            setTotalAmount(total);
        } else {
            setTotalAmount(0);
        }
    }, [initialBillings]);

    const handleRefresh = () => {
        router.get(route("payment.billing"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Billing" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Daftar Kode Billing Belum Bayar (Rupiah)
                    </h1>
                    <div className="flex flex-col items-end text-right gap-2 mr-6">
                        <p>Total Payment for Active Billing Code</p>
                        <p className="font-bold text-2xl ">
                            {formatRupiah(totalAmount)}
                        </p>
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
                        <DataTableBilling
                            columns={columns}
                            data={billingGroups || []}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
