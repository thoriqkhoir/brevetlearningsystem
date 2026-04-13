import InputError from "@/Components/layout/InputError";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Tambahkan Loader2
import { FormEventHandler, useState } from "react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone_number: "",
        npwp: "",
        address: "",
        password: "",
        password_confirmation: "",
    });

    const handleNpwpChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        const limitedValue = numericValue.slice(0, 16);
        setData("npwp", limitedValue);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="flex flex-col gap-6">
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <form onSubmit={submit} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center mb-2">
                                    <Link href="/">
                                        <img
                                            src="/images/logo.png"
                                            alt="Brevet Learning System"
                                            className="w-36"
                                        />
                                    </Link>
                                    <p className="mt-2 text-balance text-muted-foreground text-sm">
                                        Silahkan lengkapi data diri untuk
                                        mendaftar akun
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        autoComplete="name"
                                        placeholder="Nama Lengkap"
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        autoFocus
                                        required
                                        disabled={processing}
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
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">
                                        Nomor Telepon
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        type="text"
                                        name="phone_number"
                                        value={data.phone_number}
                                        autoComplete="username"
                                        placeholder="08xxxxxxxxxx"
                                        onChange={(e) =>
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            )
                                        }
                                        required
                                        disabled={processing}
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="npwp">
                                        NPWP/NIK (16 digit angka)
                                    </Label>
                                    <Input
                                        id="npwp"
                                        type="text"
                                        name="npwp"
                                        value={data.npwp}
                                        placeholder="Contoh: 1234567890000000"
                                        onChange={(e) =>
                                            handleNpwpChange(e.target.value)
                                        }
                                        maxLength={16}
                                        pattern="[0-9]{16}"
                                        autoComplete="off"
                                        required
                                        disabled={processing}
                                    />
                                    <InputError message={errors.npwp} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        autoComplete="off"
                                        placeholder="Jl. Contoh No. 123"
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        required
                                        disabled={processing}
                                    />
                                    <InputError message={errors.address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            disabled={processing}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {showPassword ? (
                                                <Eye size={18} />
                                            ) : (
                                                <EyeOff size={18} />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            disabled={processing}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {showConfirmPassword ? (
                                                <Eye size={18} />
                                            ) : (
                                                <EyeOff size={18} />
                                            )}
                                        </button>
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                {/* Tombol Register dengan Spinner */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Mendaftar...
                                        </>
                                    ) : (
                                        "Daftar"
                                    )}
                                </Button>

                                <div className="text-center text-sm">
                                    Sudah memiliki akun?{" "}
                                    <Link
                                        href={route("login")}
                                        className={`hover:underline text-blue-800 hover:text-blue-700 ${
                                            processing
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }`}
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                        {/* <div className="relative hidden bg-muted md:block">
                            <img
                                src="/images/brevet.png"
                                alt="Image"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                            <div className="absolute inset-0 flex items-end justify-start px-6 py-8">
                                <h2 className="text-white text-3xl font-bold">
                                    Tax <br /> Learning <br /> System
                                </h2>
                            </div>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
