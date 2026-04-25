import { Checkbox } from "@/Components/ui/checkbox";
import InputError from "@/Components/layout/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("id-ID");
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="flex flex-col gap-6">
                <Card className="overflow-hidden">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form
                            onSubmit={submit}
                            className="py-12 px-8 md:py-10 md:px-8"
                        >
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center mb-2">
                                    <img
                                        src="/images/logo.png"
                                        alt="Brevet Learning System"
                                        className="w-36"
                                    />
                                    <p className="mt-2 text-balance text-muted-foreground text-sm">
                                        Silahkan login untuk melanjutkan
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="email"
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
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        {/* {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        )} */}
                                    </div>
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
                                            autoComplete="current-password"
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
                                    <Label htmlFor="language">
                                        Pemilihan Bahasa
                                    </Label>
                                    <Select
                                        value={selectedLanguage}
                                        onValueChange={setSelectedLanguage}
                                        disabled={processing}
                                    >
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Pilih bahasa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="id-ID">
                                                id-ID
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) =>
                                            setData("remember", !!checked)
                                        }
                                    />
                                    <span className="ms-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label> */}

                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={route("password.request")}
                                        className={`text-sm font-semibold hover:underline ${
                                            processing
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }`}
                                    >
                                        Lupa Kata Sandi?
                                    </Link>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Masuk...
                                            </>
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {/* <div className="text-center text-sm">
                                        Pengguna baru?{" "}
                                        <Link
                                            href={route("registration-portal")}
                                            className={`hover:underline text-blue-800 hover:text-blue-700 ${
                                                processing
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }`}
                                        >
                                            Daftar disini
                                        </Link>
                                    </div> */}
                                    {/* <Link
                                        href={route("register")}
                                        className={`hover:underline w-fit text-center mx-auto text-sm text-blue-800 hover:text-blue-700 ${
                                            processing
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }`}
                                    >
                                        Buat akun BLS baru
                                    </Link> */}
                                </div>
                            </div>
                        </form>
                        <div className="relative hidden bg-muted md:block">
                            <img
                                src="/images/brevet.png"
                                alt="Image"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                            <div className="absolute inset-0 flex items-end justify-start px-6 py-8">
                                <h2 className="text-white text-3xl font-bold">
                                    Brevet <br /> Learning <br /> System
                                </h2>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Link
                    href={route("about")}
                    className={`underline underline-offset-4 text-blue-800 hover:text-blue-700 text-center ${
                        processing ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                    Apa itu Brevet Learning System?
                </Link>
            </div>
        </GuestLayout>
    );
}
