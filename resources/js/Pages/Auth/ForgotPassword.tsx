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
import { Loader2, MailSearch } from "lucide-react";
import { FormEventHandler } from "react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="flex flex-col gap-6">
                <Card className="overflow-hidden">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form
                            onSubmit={submit}
                            className="py-10 px-8 md:py-12 md:px-10"
                        >
                            <CardHeader className="px-0 pt-0 pb-6">
                                <img
                                    src="/images/logo.png"
                                    alt="Tax Learning System"
                                    className="w-24 mb-6"
                                />
                                <CardTitle className="text-2xl">
                                    Lupa Kata Sandi
                                </CardTitle>
                                <CardDescription>
                                    Masukkan email akun Anda. Kami akan mengirim
                                    tautan untuk mengatur ulang kata sandi.
                                </CardDescription>
                            </CardHeader>

                            {status && (
                                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                                    {status}
                                </div>
                            )}

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
                                <InputError
                                    message={errors.email}
                                    className="mt-1"
                                />
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
                                            Mengirim...
                                        </>
                                    ) : (
                                        "Kirim Tautan Reset Kata Sandi"
                                    )}
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Sudah ingat kata sandi?{" "}
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
                                        Pulihkan Akses <br /> Akun Anda
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-200">
                                        Pastikan email yang dimasukkan sesuai
                                        dengan akun yang terdaftar di sistem.
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
