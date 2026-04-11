import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import GuestLayout from "@/Layouts/GuestLayout";
import { Check, X, MoveLeft } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function RegistrationPortal() {
    const { flash }: any = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleNoNIKClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toast.error("Fitur belum tersedia", {
            duration: 3000,
            position: "top-center",
            style: {
                background: "#ef4444",
                color: "white",
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Pilih Jenis Pendaftaran" />

            <Link href="/" className="flex justify-center">
                <img
                    src="/images/logo.png"
                    alt="Tax Learning System"
                    className="w-36"
                />
            </Link>
            <Card className="overflow-hidden w-full max-w-7xl mx-auto mt-6">
                <CardContent>
                    <div className="text-center mb-12 md:mt-16">
                        <div className="flex justify-center mb-6"></div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Persiapan Registrasi Wajib Pajak
                        </h1>
                        <p className="text-gray-600 max-w-4xl mx-auto text-sm md:text-base">
                            Apakah wajib pajak sudah terdaftar dengan Nomor
                            Induk Kependudukan (NIK)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-28 max-w-xl mx-auto">
                        <Button
                            asChild
                            className="w-full bg-green-700 hover:bg-green-800 text-white"
                        >
                            <Link
                                href="/registration-portal/individual-registration/nik-registration-selector"
                                className="w-full"
                            >
                                <Check /> Ya, Wajib Pajak Memiliki NIK
                            </Link>
                        </Button>

                        <div className="relative">
                            <Button
                                className="w-full bg-red-500 hover:bg-red-600 text-white opacity-75 hover:opacity-90 cursor-pointer"
                                onClick={handleNoNIKClick}
                            >
                                <X /> Tidak Memiliki NIK
                            </Button>

                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full border-2 border-white shadow-lg">
                                Segera Hadir
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center md:mb-4">
                        <Button variant="outline" asChild>
                            <Link href="/registration-portal">
                                <MoveLeft /> Kembali ke Halaman Sebelumnya
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
