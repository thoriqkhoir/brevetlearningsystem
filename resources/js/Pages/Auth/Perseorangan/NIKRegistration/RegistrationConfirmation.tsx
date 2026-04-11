import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import GuestLayout from "@/Layouts/GuestLayout";
import { CheckCircle2, Download, FileText, User, MapPin } from "lucide-react";

interface TaxpayerData {
    id: number;
    nik: string;
    name: string;
    npwp: string;
    email: string;
    mobile_phone_number: string;
    addresses: Array<{
        address_type: string;
        address_detail: string;
        province: string;
        region: string;
        district: string;
        sub_district: string;
    }>;
}

interface Props {
    taxpayer: TaxpayerData;
}

export default function RegistrationConfirmation({ taxpayer }: Props) {
    const handleDownloadNPWP = () => {
        window.open(route("npwp.pdf", taxpayer.id), "_blank");
    };

    const formatNPWP = (npwp: string) => {
        if (!npwp || npwp.length !== 16) return npwp;

        return npwp.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    };

    const mainAddress =
        taxpayer.addresses?.find(
            (addr) => addr.address_type === "Alamat Sesuai KTP"
        ) || taxpayer.addresses?.[0];

    return (
        <GuestLayout>
            <Head title="Pendaftaran Berhasil - Konfirmasi NPWP" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <CheckCircle2 className="w-20 h-20 text-green-500 animate-pulse" />
                                <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Selamat! Pendaftaran NPWP Berhasil
                        </h1>

                        <p className="text-lg text-gray-600 mb-2">
                            Terima kasih telah mengirimkan permohonan Anda
                        </p>

                        <p className="text-gray-500">
                            NPWP Anda telah berhasil dibuat dan siap untuk
                            diunduh
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Informasi Wajib Pajak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            NIK
                                        </label>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {taxpayer.nik}
                                        </p>
                                    </div> */}

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Nama Lengkap
                                        </label>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {taxpayer.name}
                                        </p>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <label className="text-sm font-medium text-green-700">
                                            NPWP
                                        </label>
                                        <p className="text-2xl font-bold text-green-800 tracking-wider">
                                            {formatNPWP(taxpayer.npwp)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Email
                                        </label>
                                        <p className="text-gray-800">
                                            {taxpayer.email}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            No. Handphone
                                        </label>
                                        <p className="text-gray-800">
                                            {taxpayer.mobile_phone_number}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            {mainAddress && (
                                <Card className="shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Alamat Utama
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-800">
                                                {mainAddress.address_type}
                                            </p>
                                            <p className="text-gray-700">
                                                {mainAddress.address_detail}
                                            </p>
                                            <p className="text-gray-600">
                                                {mainAddress.sub_district},{" "}
                                                {mainAddress.district}
                                            </p>
                                            <p className="text-gray-600">
                                                {mainAddress.region},{" "}
                                                {mainAddress.province}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="shadow-lg border-2 border-yellow-200">
                                <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-t-lg">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Dokumen NPWP
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <div className="mb-6">
                                            <FileText className="w-14 h-14 text-red-500 mx-auto mb-4" />
                                            <p className="text-lg font-semibold text-gray-800 mb-2">
                                                Kartu NPWP Anda
                                            </p>
                                            <p className="text-gray-600 mb-6">
                                                Unduh dan simpan kartu NPWP Anda
                                                dalam format PDF
                                            </p>
                                        </div>

                                        <Button
                                            onClick={handleDownloadNPWP}
                                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 text-md shadow-lg transform transition-all duration-200"
                                        >
                                            <Download className="w-5 h-5 mr-3" />
                                            Unduh Kartu NPWP (PDF)
                                        </Button>

                                        <p className="text-xs text-gray-500 mt-4">
                                            * Kartu NPWP ini hanya contoh untuk
                                            edukasi/pembelajaran.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            asChild
                            className="bg-blue-900 text-white hover:bg-blue-800 mt-8"
                        >
                            <Link href="/registration-portal">
                                Kembali ke Beranda
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
