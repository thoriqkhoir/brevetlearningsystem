import InputError from "@/Components/layout/InputError";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
    onSuccess,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    onSuccess?: () => void;
}) {
    const user = usePage().props.auth.user;
    const { flash }: any = usePage().props;

    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
        wasSuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        npwp: user.npwp,
        address: user.address,
    });

    const handleNpwpChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        const limitedValue = numericValue.slice(0, 16);
        setData("npwp", limitedValue);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    useEffect(() => {
        if (wasSuccessful) {
            toast.success("Profile berhasil diperbarui!");
            if (onSuccess) {
                onSuccess();
            }
        }
    }, [wasSuccessful, onSuccess]);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-primary">
                    Informasi Pengguna
                </h2>

                <p className="mt-1 text-sm text-primary/70">
                    Gunakan form di bawah ini untuk memperbarui informasi
                    pengguna Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        placeholder="Your Name"
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="email"
                        placeholder="m@example.com"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone_number">Nomor Telepon</Label>
                    <Input
                        id="phone_number"
                        type="text"
                        name="phone_number"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData("phone_number", e.target.value)
                        }
                        required
                    />
                    <InputError message={errors.phone_number} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="npwp">NPWP/NIK (16 digit angka)</Label>
                    <Input
                        id="npwp"
                        type="text"
                        name="npwp"
                        value={data.npwp}
                        placeholder="Contoh: 1234567890000000"
                        onChange={(e) => handleNpwpChange(e.target.value)}
                        maxLength={16}
                        pattern="[0-9]{16}"
                        title="NPWP harus berupa 16 digit angka"
                        required
                    />
                    <p className="text-xs text-gray-500">
                        {data.npwp?.length || 0}/16 karakter
                    </p>
                    <InputError message={errors.npwp} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                        id="address"
                        type="text"
                        name="address"
                        value={data.address}
                        placeholder="Isikan Alamat Lengkap"
                        onChange={(e) => setData("address", e.target.value)}
                        required
                    />
                    <InputError message={errors.address} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Email Anda belum terverifikasi.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-primary/70 underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Klik di sini untuk mengirim ulang email
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Tautan verifikasi telah dikirim ke alamat email
                                Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? "Menyimpan..." : "Simpan"}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-primary/70">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
