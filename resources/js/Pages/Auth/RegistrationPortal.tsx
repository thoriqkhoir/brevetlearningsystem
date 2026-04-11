import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import GuestLayout from "@/Layouts/GuestLayout";
import { Building2, Users, Landmark, FileText } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function RegistrationPortal() {
    const { flash }: any = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const registrationTypes = [
        {
            id: "individual-registration",
            title: "Perorangan",
            icon: Users,
            color: "bg-gradient-to-br from-blue-600 to-blue-800",
            available: true,
        },
        {
            id: "government-agency",
            title: "Instansi Pemerintah",
            icon: Building2,
            color: "bg-gradient-to-br from-orange-500 to-orange-700",
            available: false,
        },
        {
            id: "coorporation",
            title: "Badan",
            icon: Landmark,
            color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
            available: false,
        },
        {
            id: "foreign-vat-collector",
            title: "Pemungut PPN PMSE Luar Negeri",
            icon: FileText,
            color: "bg-gradient-to-br from-red-500 to-red-700",
            available: false,
        },
    ];

    const handleCardClick = (
        type: (typeof registrationTypes)[0],
        e: React.MouseEvent
    ) => {
        if (!type.available) {
            e.preventDefault();
            toast.error("Fitur belum tersedia", {
                style: {
                    background: "#ef4444",
                    color: "white",
                },
            });
        }
    };

    return (
        <GuestLayout>
            <Head title="Pilih Jenis Wajib Pajak" />

            <Link href="/" className="flex justify-center">
                <img
                    src="/images/logo.png"
                    alt="Tax Learning System"
                    className="w-36"
                />
            </Link>
            <Card className="overflow-hidden w-full max-w-7xl mx-auto mt-6">
                <CardContent>
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6"></div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Persiapan Registrasi Wajib Pajak
                        </h1>
                        <p className="text-gray-600 max-w-4xl mx-auto text-sm md:text-base">
                            Silakan pilih jenis wajib pajak yang ingin Anda
                            daftarkan sesuai dengan kategori yang paling relevan
                            dengan status perpajakan Anda. Pastikan untuk
                            memilih dengan cermat, karena setiap jenis wajib
                            pajak memiliki kewajiban perpajakan dan prosedur
                            pendaftaran yang berbeda.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        {registrationTypes.map((type) => {
                            const Icon = type.icon;

                            const CardComponent = (
                                <Card
                                    className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg border-0 overflow-hidden"
                                    onClick={(e) => handleCardClick(type, e)}
                                >
                                    <CardContent className="p-0">
                                        <div
                                            className={`${type.color} transition-all duration-300 h-32 flex items-center justify-center relative overflow-hidden`}
                                        >
                                            {!type.available && (
                                                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/30">
                                                    Segera Hadir
                                                </div>
                                            )}

                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-0 right-0 w-20 h-20 rounded-full border-2 border-white translate-x-8 -translate-y-8"></div>
                                                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full border-2 border-white -translate-x-6 translate-y-6"></div>
                                            </div>

                                            <div className="text-white z-10">
                                                <Icon
                                                    size={48}
                                                    className="mx-auto"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-6 text-center bg-white">
                                            <h3 className="font-semibold text-gray-800 leading-tight">
                                                {type.title}
                                            </h3>
                                        </div>
                                    </CardContent>
                                </Card>
                            );

                            return type.available ? (
                                <Link
                                    href={`/registration-portal/${type.id}`}
                                    key={type.id}
                                >
                                    {CardComponent}
                                </Link>
                            ) : (
                                <div key={type.id}>{CardComponent}</div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
