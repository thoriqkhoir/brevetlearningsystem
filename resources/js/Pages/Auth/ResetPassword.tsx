import InputError from "@/Components/layout/InputError";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { FormEventHandler, useState } from "react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi" />

            <div className="flex flex-col gap-6">
                <Card className="overflow-hidden">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form
                            onSubmit={submit}
                            className="py-10 px-8 md:py-12 md:px-10"
                        >
                            <CardHeader className="px-0 pt-0 pb-6">
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                    <KeyRound className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-2xl">
                                    Atur Ulang Kata Sandi
                                </CardTitle>
                                <CardDescription>
                                    Masukkan kata sandi baru untuk melanjutkan
                                    akses akun Anda.
                                </CardDescription>
                            </CardHeader>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="email"
                                        placeholder="nama@email.com"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        autoFocus
                                        required
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Kata Sandi Baru
                                    </Label>
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
                                                    e.target.value,
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
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {showPassword ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Kata Sandi Baru
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={
                                                showPasswordConfirmation
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswordConfirmation(
                                                    !showPasswordConfirmation,
                                                )
                                            }
                                            disabled={processing}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {showPasswordConfirmation ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Kata Sandi Baru"
                                    )}
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Ingat kata sandi Anda?{" "}
                                    <Link
                                        href={route("login")}
                                        className="font-medium text-blue-800 hover:text-blue-700 hover:underline"
                                    >
                                        Kembali ke Login
                                    </Link>
                                </p>
                            </div>
                        </form>

                        <div className="relative hidden bg-muted md:block">
                            <img
                                src="/images/kemenkeu.jpg"
                                alt="Kementerian Keuangan"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                            <div className="absolute inset-0 flex items-end justify-start px-6 py-8">
                                <div className="text-white">
                                    <h2 className="text-3xl font-bold leading-tight">
                                        Keamanan Akun <br /> Tetap Terjaga
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-200">
                                        Gunakan kata sandi yang kuat dan jangan
                                        bagikan ke siapa pun.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
