import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { MoveRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FakturBupotChart } from "./FakturBupotChart";
import { SPTChart } from "./SPTChart";

export default function Dashboard({
    userCount,
    eventCount,
    userLoginToday,
    outputInvoiceCount,
    inputInvoiceCount,
    bupotCount,
    sptPpnCount,
    sptUnifikasiCount,
    sptPph21Count,
}: any) {
    const { flash }: any = usePage().props;

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const formattedTime = currentTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <AdminLayout>
            <Head title="Beranda Admin" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <h1 className="text-2xl font-semibold text-primary">
                            Admin Dashboard
                        </h1>
                        <Button variant="outline" asChild>
                            <Link href={route("dashboard")}>
                                Lihat Sebagai Pengguna <MoveRight />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="p-5 lg:p-8 text-center space-y-2 rounded-xl bg-sidebar border">
                            <h2 className="text-sm font-medium">
                                Jumlah Pengguna
                            </h2>
                            <p className="text-5xl font-bold text-amber-800">
                                {userCount}
                            </p>
                        </div>
                        <div className="p-5 lg:p-8 text-center space-y-2 rounded-xl bg-sidebar border">
                            <h2 className="text-sm font-medium">
                                Jumlah Event
                            </h2>
                            <p className="text-5xl font-bold text-blue-800">
                                {eventCount}
                            </p>
                        </div>
                        <div className="p-5 lg:p-8 text-center space-y-2 rounded-xl bg-sidebar border">
                            <h2 className="text-sm font-medium">
                                Jumlah Pengguna Login Hari Ini
                            </h2>
                            <p className="text-5xl font-bold text-green-800">
                                {userLoginToday}
                            </p>
                        </div>
                        <div className="col-span-2 order-first lg:order-none lg:col-span-1 p-5 lg:p-8 text-center space-y-1 rounded-xl bg-primary">
                            <p className="text-lg font-medium text-primary-foreground underline">
                                {formattedDate}
                            </p>
                            <p className="text-4xl font-bold text-primary-foreground">
                                {formattedTime}
                            </p>
                        </div>
                        <FakturBupotChart
                            outputInvoiceCount={outputInvoiceCount}
                            inputInvoiceCount={inputInvoiceCount}
                            bupotCount={bupotCount}
                        />
                        <SPTChart
                            sptPpnCount={sptPpnCount}
                            sptUnifikasiCount={sptUnifikasiCount}
                            sptPph21Count={sptPph21Count}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
