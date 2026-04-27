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

    const saldoTextClass =
        saldo < 0
            ? "text-rose-600"
            : saldo > 0
              ? "text-emerald-600"
              : "text-slate-700";

    const saldoCardToneClass =
        saldo < 0
            ? "border-rose-200 bg-rose-50/80"
            : "border-teal-100 bg-gradient-to-r from-teal-50/80 to-cyan-50/80";

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
            <div className={`relative overflow-hidden ${className}`}>
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.2),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.2),_transparent_36%)]" />
                <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
                    <div className="mb-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                    Portal Pengguna
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold text-slate-800 md:text-3xl">
                                    Selamat Datang, {user.name}
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Kelola profil, saldo, dan akses kelas Anda
                                    dalam satu dashboard.
                                </p>
                            </div>
                            {user.role === "admin" && (
                                <Button variant="outline" asChild>
                                    <Link href={route("admin.dashboard")}>
                                        <MoveLeft /> Kembali ke Dashboard Admin
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid auto-rows-min gap-6 lg:grid-cols-[minmax(300px,_360px)_1fr]">
                        <div className="rounded-2xl border border-teal-100 bg-white/90 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8">
                            <h6 className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                Profil
                            </h6>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                                Informasi Pengguna
                            </p>
                            <div className="mt-6 flex flex-col items-center">
                                <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-700 text-4xl font-semibold text-white shadow-lg ring-4 ring-white">
                                    {getInitials(user.name)}
                                </div>
                                <h2 className="mt-3 text-xl font-semibold text-slate-800">
                                    {user.name}
                                </h2>
                                <div className="mb-5">
                                    <p className="font-medium text-slate-600">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="w-full space-y-3">
                                    <div className="rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                                            NPWP
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-700">
                                            {user.npwp ? user.npwp : "-"}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
                                            No.HP
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-700">
                                            {user.phone_number}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                                            Alamat
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-700">
                                            {user.address ? user.address : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
                                    <Button
                                        className="w-full"
                                        onClick={() =>
                                            setProfileModalOpen(true)
                                        }
                                    >
                                        Lengkapi Data Diri
                                    </Button>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() =>
                                            setPasswordModalOpen(true)
                                        }
                                    >
                                        Ubah Password
                                    </Button>
                                </div>

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

                        <div className="rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8">
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    className={`w-full rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md ${saldoCardToneClass}`}
                                >
                                    <div className="grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <Wallet
                                                    size={18}
                                                    className="text-teal-700"
                                                />
                                                <h2 className="text-sm font-semibold text-slate-700">
                                                    Saldo Tersedia
                                                </h2>
                                            </div>
                                            <p
                                                className={`text-2xl font-bold ${saldoTextClass}`}
                                            >
                                                {formatCurrency(saldo)}
                                            </p>
                                            {saldo < 0 && (
                                                <p className="mt-1 text-xs text-rose-600">
                                                    Saldo Anda negatif. Silakan
                                                    lakukan deposit segera.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex h-full items-center justify-end">
                                            <Button
                                                variant="accent"
                                                asChild
                                                className="w-full xl:w-auto"
                                            >
                                                <Link
                                                    href={route(
                                                        "payment.creation",
                                                    )}
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

                                <div className="w-full rounded-2xl border border-amber-100 bg-amber-50/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Building2
                                            size={18}
                                            className="text-amber-700"
                                        />
                                        <h2 className="text-sm font-semibold text-slate-700">
                                            Badan Usaha
                                        </h2>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Kelola badan usaha untuk impersonate.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <Button variant="neutral" asChild>
                                            <Link
                                                href={route(
                                                    "business-entities.index",
                                                )}
                                            >
                                                Lihat Daftar
                                            </Link>
                                        </Button>
                                        <Button variant="accentOutline" asChild>
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
                                    <div className="w-full rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/80 via-white to-teal-50/70 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
                                        <div className="mb-2 flex items-center gap-2">
                                            <School
                                                size={18}
                                                className="text-cyan-700"
                                            />
                                            <h2 className="text-sm font-semibold text-slate-700">
                                                Kelas Aktif
                                            </h2>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Kelas {active_course.name}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-600">
                                            Akses Materi:
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {access_rights.length > 0 ? (
                                                access_rights.map(
                                                    (access: string) => (
                                                        <span
                                                            key={access}
                                                            className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800"
                                                        >
                                                            {access}
                                                        </span>
                                                    ),
                                                )
                                            ) : (
                                                <span className="italic text-slate-400">
                                                    Tidak ada akses materi
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="info"
                                            className="mt-4 w-full"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "courses.detail",
                                                    active_course.id,
                                                )}
                                            >
                                                <School />
                                                Masuk Kelas
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full rounded-2xl border border-amber-300 bg-amber-50/80 p-5 shadow-sm">
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-amber-900">
                                                Anda belum memiliki kelas aktif
                                                saat ini.
                                            </p>
                                            <p className="mt-1 text-sm text-amber-800/80">
                                                Silakan mulai kelas untuk
                                                mendapatkan akses aplikasi BLS.
                                            </p>
                                            <Button
                                                variant="accent"
                                                className="mt-4"
                                                asChild
                                            >
                                                <Link href={route("courses")}>
                                                    <School />
                                                    Masuk Kelas
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
