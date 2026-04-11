import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import UpdatePasswordForm from "./Profile/Partials/UpdatePasswordForm";
import Modal from "@/Components/ui/modal";
import UpdateProfileInformationForm from "./Profile/Partials/UpdateProfileInformationForm";
import { Building2, MoveLeft, School, Wallet } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard({
    mustVerifyEmail,
    status,
    className = "",
    ledgers = [],
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    ledgers?: any[];
}) {
    const { flash }: any = usePage().props;
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const user = usePage().props.auth.user;
    const active_course = usePage().props.active_course as {
        id: number;
        name: string;
        access_rights: string[];
    } | null;
    const access_rights =
        active_course && active_course.access_rights
            ? Array.isArray(active_course.access_rights)
                ? active_course.access_rights
                : JSON.parse(active_course.access_rights)
            : user.access_rights;
    const getInitials = (name: string) => {
        const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
        return initials.substring(0, 2).toUpperCase();
    };
    const totalCredit = ledgers.reduce(
        (total: number, ledger: any) => total + ledger.credit_amount,
        0,
    );
    const totalDebit = ledgers.reduce(
        (total: number, ledger: any) => total + ledger.debit_amount,
        0,
    );
    const totalDebitUnpaid = ledgers.reduce(
        (total: number, ledger: any) => total + ledger.debit_unpaid,
        0,
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

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-8 mx-auto px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <h1 className="text-2xl font-semibold text-primary">
                            Selamat Datang, {user.name}
                        </h1>
                        {user.role === "admin" && (
                            <Button variant="outline" asChild>
                                <Link href={route("admin.dashboard")}>
                                    <MoveLeft /> Kembali ke Dashboard Admin
                                </Link>
                            </Button>
                        )}
                    </div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="py-4 px-5 md:px-8 rounded-xl bg-sidebar border">
                            <h6 className="font-semibold">Dashboard</h6>
                            <p className="font-medium text-sm text-primary/70">
                                Informasi Pengguna
                            </p>
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-blue-950 flex items-center justify-center text-white text-4xl font-semibold mt-8">
                                    {getInitials(user.name)}
                                </div>
                                <h2 className="text-xl font-semibold mt-2">
                                    {user.name}
                                </h2>
                                <div className="mb-4">
                                    <p className="font-semibold">
                                        {user.email}
                                    </p>
                                </div>

                                <p className="font-medium text-sm text-primary/70">
                                    NPWP
                                </p>
                                <p className="font-semibold mb-2">
                                    {user.npwp ? user.npwp : "-"}
                                </p>
                                <p className="font-medium text-sm text-primary/70">
                                    No.HP
                                </p>
                                <p className="font-semibold mb-2">
                                    {user.phone_number}
                                </p>
                                <p className="font-medium text-sm text-primary/70">
                                    Alamat
                                </p>
                                <p className="font-semibold mb-4">
                                    {user.address ? user.address : "-"}
                                </p>
                                <Button
                                    onClick={() => setProfileModalOpen(true)}
                                >
                                    Lengkapi Data Diri
                                </Button>
                                <Button
                                    className="mt-2"
                                    variant={"outline"}
                                    onClick={() => setPasswordModalOpen(true)}
                                >
                                    Ubah Password
                                </Button>

                                <Modal
                                    isOpen={isProfileModalOpen}
                                    onClose={() => setProfileModalOpen(false)}
                                    title="Edit Profile"
                                >
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                        onSuccess={() =>
                                            setProfileModalOpen(false)
                                        }
                                    />
                                </Modal>
                                <Modal
                                    isOpen={isPasswordModalOpen}
                                    onClose={() => setPasswordModalOpen(false)}
                                    title="Edit Profile"
                                >
                                    <UpdatePasswordForm />
                                </Modal>
                            </div>
                        </div>
                        <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                            <div className="flex flex-col items-center gap-4 justify-center">
                                <div className="w-full p-4 mb-2 rounded-lg bg-white border shadow-sm">
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-center ">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Wallet size={18} />
                                                <h2 className="text-sm font-medium">
                                                    Saldo Tersedia
                                                </h2>
                                            </div>
                                            <p
                                                className={`text-2xl font-bold ${
                                                    saldo < 0
                                                        ? "text-red-500"
                                                        : saldo > 0
                                                          ? "text-green-500"
                                                          : "text-black"
                                                }`}
                                            >
                                                {formatCurrency(saldo)}
                                            </p>
                                            {saldo < 0 && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Saldo Anda negatif. Silahkan
                                                    deposit segera.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end h-full">
                                            <Button
                                                asChild
                                                className="w-full xl:w-auto"
                                            >
                                                <Link
                                                    href={route(
                                                        "payment.creation",
                                                    )}
                                                    className="btn btn-primary"
                                                >
                                                    <Wallet
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Deposit Sekarang
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full p-4 mb-4 rounded-lg bg-white border shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 size={18} />
                                        <h2 className="text-sm font-medium">
                                            Badan Usaha
                                        </h2>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Kelola badan usaha untuk impersonate
                                    </p>
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        <Button asChild>
                                            <Link
                                                href={route(
                                                    "business-entities.index",
                                                )}
                                            >
                                                Lihat Daftar
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={route(
                                                    "business-entities.create",
                                                )}
                                            >
                                                Tambah Badan
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {active_course ? (
                                    <div className="w-full p-4 mb-4 rounded-lg bg-white border shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <School size={18} />
                                            <h2 className="text-sm font-medium">
                                                Kelas Aktif
                                            </h2>
                                        </div>
                                        <h3 className="text-lg font-semibold">
                                            Kelas {active_course.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Akses Materi:
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {access_rights.length > 0 ? (
                                                access_rights.map(
                                                    (access: string) => (
                                                        <span
                                                            key={access}
                                                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                                                        >
                                                            {access}
                                                        </span>
                                                    ),
                                                )
                                            ) : (
                                                <span className="italic text-gray-400">
                                                    Tidak ada akses materi
                                                </span>
                                            )}
                                        </div>
                                        <Button className="mt-4 w-full" asChild>
                                            <Link
                                                href={route(
                                                    "courses.detail",
                                                    active_course.id,
                                                )}
                                                className="btn btn-primary"
                                            >
                                                <School />
                                                Masuk Kelas
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full p-4 mb-4 rounded-lg bg-red-50 border border-red-300 shadow-sm">
                                        <div className="text-center">
                                            <p className="text-lg font-medium">
                                                Anda belum memiliki kelas yang
                                                aktif saat ini.
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Silakan mulai kelas untuk
                                                mendapatkan akses aplikasi TLS.
                                            </p>
                                            <Button className="mt-4" asChild>
                                                <Link
                                                    href={route("courses")}
                                                    className="btn btn-primary"
                                                >
                                                    <School />
                                                    Masuk Kelas
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <img
                                    className="w-80"
                                    src="/images/ilustrasi page.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    {/* <UpdatePasswordForm></UpdatePasswordForm> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
