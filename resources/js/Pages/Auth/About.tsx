import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    ArrowLeft,
    BookOpen,
    Calculator,
    FileText,
    Users,
    Shield,
    TrendingUp,
} from "lucide-react";

export default function About() {
    return (
        <GuestLayout>
            <Head title="Tentang Brevet Learning System" />

            <div className="min-h-screen ">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/images/logo.png"
                                    alt="Brevet Learning System"
                                    className="w-48 h-auto"
                                />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Brevet Learning System
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Platform pembelajaran dan simulasi perpajakan
                                yang komprehensif untuk meningkatkan pemahaman
                                dan keterampilan perpajakan
                            </p>
                        </div>
                        {/* Main Features */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            <Card
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() =>
                                    document
                                        .getElementById("efaktur-section")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                                        <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        E-Faktur Simulation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Simulasi lengkap untuk pembuatan dan
                                        pengelolaan e-faktur dengan berbagai
                                        skenario transaksi
                                    </p>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                                        Klik untuk detail →
                                    </p>
                                </CardContent>
                            </Card>

                            <Card
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() =>
                                    document
                                        .getElementById("ebupot-section")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center">
                                        <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        E-Bupot Simulation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Simulasi lengkap untuk pembuatan dan
                                        pengelolaan e-bupot dengan berbagai
                                        skenario transaksi
                                    </p>
                                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                                        Klik untuk detail →
                                    </p>
                                </CardContent>
                            </Card>
                            <Card
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() =>
                                    document
                                        .getElementById("spt-section")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        SPT Management
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Pengelolaan SPT Masa PPN, SPT Masa
                                        Unifikasi dan SPT Masa PPh 21/26 dengan
                                        fitur setor dan lapor terintegrasi
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                        Klik untuk detail →
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mb-12">
                            <Card className="border-black-200 dark:border-blue-800">
                                <CardHeader className="bg-zinc-100 dark:bg-blue-900/20">
                                    <CardTitle className="text-2xl text-black-800 dark:text-blue-200 flex items-center">
                                        <Calculator className="w-6 h-6 mr-3" />
                                        Fitur Kelas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-8">
                                        {/* Point 1 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-black-700 dark:text-blue-300 text-lg">
                                                1. Kelas untuk Mengakses Setiap
                                                Fitur
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Setiap fitur utama seperti
                                                e-Faktur, e-Bupot, dan SPT dapat
                                                diakses melalui kelas
                                                interaktif. Peserta dapat
                                                belajar, berlatih, dan
                                                mengerjakan studi kasus sesuai
                                                topik yang dipilih, serta
                                                mendapatkan pengalaman praktik
                                                langsung sesuai kebutuhan
                                                pembelajaran.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/course-type.png"
                                                    alt="Jenis-jenis E-Faktur"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>

                                        {/* Point 2 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-black-700 dark:text-blue-300 text-lg">
                                                2. Terintegrasi dengan Mentor
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Setiap kelas didampingi oleh
                                                mentor berpengalaman yang akan
                                                memberikan penilaian, umpan
                                                balik, dan bimbingan secara
                                                langsung. Peserta dapat
                                                mendapatkan evaluasi hasil
                                                latihan untuk mempercepat
                                                pemahaman materi.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/course-types-detail.png"
                                                    alt="Form Pembuatan E-Faktur"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div id="efaktur-section" className="mb-12">
                            <Card className="border-blue-200 dark:border-blue-800">
                                <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                                    <CardTitle className="text-2xl text-blue-800 dark:text-blue-200 flex items-center">
                                        <Calculator className="w-6 h-6 mr-3" />
                                        E-Faktur Simulation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-8">
                                        {/* Point 1 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-blue-700 dark:text-blue-300 text-lg">
                                                1. Fitur Pembuatan E-Faktur
                                                Lengkap
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Platform ini memungkinkan Anda
                                                untuk membuat berbagai jenis
                                                e-faktur termasuk pajak
                                                keluaran, pajak masukan, retur,
                                                dan dokumen perpajakan lainnya
                                                dengan mudah dan sesuai regulasi
                                                terbaru.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/efaktur-types.png"
                                                    alt="Jenis-jenis E-Faktur"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>

                                        {/* Point 2 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-blue-700 dark:text-blue-300 text-lg">
                                                2. Tampilan Interface Pembuatan
                                                Faktur
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Interface yang user-friendly
                                                dengan form yang mudah dipahami
                                                untuk input data faktur,
                                                validasi otomatis, dan preview
                                                sebelum menyimpan.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/efaktur-create-form.png"
                                                    alt="Form Pembuatan E-Faktur"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* E-Bupot Section */}
                        <div id="ebupot-section" className="mb-12">
                            <Card className="border-purple-200 dark:border-purple-800">
                                <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                                    <CardTitle className="text-2xl text-purple-800 dark:text-purple-200 flex items-center">
                                        <BookOpen className="w-6 h-6 mr-3" />
                                        E-Bupot Simulation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-8">
                                        {/* Point 1 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-purple-700 dark:text-purple-300 text-lg">
                                                1. Fitur Pembuatan E-Bupot
                                                Komprehensif
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Sistem ini mendukung pembuatan
                                                e-bupot, unifikasi, dan PPh
                                                21/26 dengan perhitungan
                                                otomatis dan validasi sesuai
                                                ketentuan perpajakan yang
                                                berlaku.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/ebupot-types.png"
                                                    alt="Jenis-jenis E-Bupot"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>

                                        {/* Point 2 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-purple-700 dark:text-purple-300 text-lg">
                                                2. Tampilan Interface Pembuatan
                                                Bupot
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Interface yang intuitif dengan
                                                form yang mudah digunakan untuk
                                                input data pemotongan,
                                                perhitungan otomatis PPh, dan
                                                management data subjek pajak.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/ebupot-create-form.png"
                                                    alt="Form Pembuatan E-Bupot"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* SPT Management Section */}
                        <div id="spt-section" className="mb-12">
                            <Card className="border-green-200 dark:border-green-800">
                                <CardHeader className="bg-green-50 dark:bg-green-900/20">
                                    <CardTitle className="text-2xl text-green-800 dark:text-green-200 flex items-center">
                                        <FileText className="w-6 h-6 mr-3" />
                                        SPT Management
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-8">
                                        {/* Point 1 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-green-700 dark:text-green-300 text-lg">
                                                1. Fitur Pembuatan SPT
                                                Terintegrasi
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Platform ini menyediakan fitur
                                                lengkap untuk membuat SPT PPN,
                                                SPT Unifikasi, dan SPT PPh 21/26
                                                dengan integrasi data dari
                                                e-faktur dan e-bupot, serta
                                                simulasi e-billing.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/spt-types.png"
                                                    alt="Jenis-jenis SPT"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>

                                        {/* Point 2 */}
                                        <div>
                                            <h4 className="font-semibold mb-4 text-green-700 dark:text-green-300 text-lg">
                                                2. Tampilan Interface
                                                Pengelolaan SPT
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Interface yang komprehensif
                                                untuk melihat, mengedit, dan
                                                mengelola SPT dengan fitur
                                                detail view, perhitungan
                                                otomatis, dan proses setor lapor
                                                yang terintegrasi.
                                            </p>
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src="/images/spt-view-form.png"
                                                    alt="Halaman View SPT"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* About Section */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="text-2xl text-center">
                                    Tentang Platform
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                            <Users className="w-5 h-5 mr-2 text-blue-600" />
                                            Untuk Siapa?
                                        </h3>
                                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                            <li>
                                                • Mahasiswa jurusan akuntansi
                                                dan perpajakan
                                            </li>
                                            <li>
                                                • Praktisi perpajakan dan
                                                konsultan pajak
                                            </li>
                                            <li>
                                                • Pegawai perusahaan bidang
                                                keuangan
                                            </li>
                                            <li>
                                                • Siapa saja yang ingin belajar
                                                perpajakan
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                                            Keunggulan
                                        </h3>
                                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                            <li>
                                                • Interface yang user-friendly
                                            </li>
                                            <li>
                                                • Simulasi sesuai regulasi
                                                terbaru
                                            </li>
                                            <li>
                                                • Integrasi dengan sistem
                                                pembayaran
                                            </li>
                                            <li>
                                                • Laporan dan analisis yang
                                                detail
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                                        Fitur Utama
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                                        <div>
                                            <h4 className="font-medium mb-2">
                                                Manajemen Faktur
                                            </h4>
                                            <p className="text-sm">
                                                Buat, edit, kelola faktur dengan
                                                mudah
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">
                                                Manajemen Bupot
                                            </h4>
                                            <p className="text-sm">
                                                Buat, edit, kelola bupot dengan
                                                mudah
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">
                                                SPT Terintegrasi
                                            </h4>
                                            <p className="text-sm">
                                                Sistem pelaporan SPT yang
                                                terintegrasi dengan simulasi
                                                e-billing dan deposito
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">
                                                Retur dan Koreksi
                                            </h4>
                                            <p className="text-sm">
                                                Fitur untuk melakukan retur dan
                                                pembetulan SPT
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CTA Section */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                Siap Memulai Pembelajaran?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Bergabunglah dengan Brevet Learning  System dan
                                tingkatkan kemampuan perpajakan Anda
                            </p>
                            <div className="justify-center">
                                <Link href={route("login")}>
                                    <Button size="lg" className="min-w-[200px]">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Kembali ke Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
