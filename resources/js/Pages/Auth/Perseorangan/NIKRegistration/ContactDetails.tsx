import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

const contactDetailsSchema = z.object({
    email: z
        .string()
        .email("Format email tidak valid")
        .min(1, "Email harus diisi"),
    mobile_phone_number: z
        .string()
        .min(8, "Nomor handphone minimal 8 karakter")
        .max(15, "Nomor handphone maksimal 15 karakter")
        .regex(/^[0-9]+$/, "Nomor handphone hanya boleh berisi angka"),
    phone_number: z.string().optional(),
    fax_number: z.string().optional(),
});

interface Props {
    onNext: (responseData?: any) => void;
    existingData?: any;
}

export default function ContactDetails({ onNext, existingData }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [emailVerified, setEmailVerified] = useState(
        existingData?.emailVerified || false
    );
    const [phoneVerified, setPhoneVerified] = useState(
        existingData?.phoneVerified || false
    );

    const { data, setData } = useForm({
        email: existingData?.email || "",
        mobile_phone_number: existingData?.mobile_phone_number || "",
        phone_number: existingData?.phone_number || "",
        fax_number: existingData?.fax_number || "",
    });

    useEffect(() => {
        const contactData = {
            email: data.email,
            mobile_phone_number: data.mobile_phone_number,
            phone_number: data.phone_number,
            fax_number: data.fax_number,
            emailVerified,
            phoneVerified,
        };
        sessionStorage.setItem(
            "contactDetailsData",
            JSON.stringify(contactData)
        );
    }, [data, emailVerified, phoneVerified]);

    useEffect(() => {
        setEmailVerified(false);
    }, [data.email]);

    useEffect(() => {
        setPhoneVerified(false);
    }, [data.mobile_phone_number]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailVerified) {
            toast.error("Harap verifikasi email terlebih dahulu!");
            return;
        }

        if (!phoneVerified) {
            toast.error("Harap verifikasi nomor handphone terlebih dahulu!");
            return;
        }

        try {
            const validatedData = contactDetailsSchema.parse(data);
            setErrors({});
            setProcessing(true);

            const formattedValues = {
                ...validatedData,
                emailVerified,
                phoneVerified,
            };

            sessionStorage.removeItem("contactDetailsData");

            toast.success("Detail kontak berhasil divalidasi!");
            onNext(formattedValues);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                toast.error("Mohon periksa kembali data yang diisi");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleVerifyEmail = () => {
        if (!data.email) {
            toast.error("Masukkan email terlebih dahulu");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            toast.error("Format email tidak valid");
            setEmailVerified(false);
            return;
        }

        setEmailVerified(true);
        toast.success("Email berhasil diverifikasi");
    };

    const handleVerifyPhone = () => {
        if (!data.mobile_phone_number) {
            toast.error("Masukkan nomor handphone terlebih dahulu");
            return;
        }

        if (
            data.mobile_phone_number.length < 10 ||
            data.mobile_phone_number.length > 15
        ) {
            toast.error("Nomor handphone harus antara 8-15 karakter");
            setPhoneVerified(false);
            return;
        }

        if (!/^[0-9]+$/.test(data.mobile_phone_number)) {
            toast.error("Nomor handphone hanya boleh berisi angka");
            setPhoneVerified(false);
            return;
        }

        setPhoneVerified(true);
        toast.success("Nomor handphone berhasil diverifikasi");
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Mohon verifikasi detail kontak wajib pajak.
                </h1>
                <p className="text-gray-600">
                    Email dan nomor handphone harus diverifikasi untuk
                    melanjutkan
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            E-mail <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@gmail.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className={cn(
                                    "flex-1",
                                    errors.email ? "border-red-500" : "",
                                    emailVerified
                                        ? "border-green-500 bg-green-50"
                                        : ""
                                )}
                            />
                            <Button
                                type="button"
                                onClick={handleVerifyEmail}
                                className={cn(
                                    "px-6",
                                    emailVerified
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-blue-900 hover:bg-blue-800"
                                )}
                                disabled={emailVerified}
                            >
                                {emailVerified ? "Verified" : "Verify"}
                            </Button>
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mobile_phone_number">
                            Nomor Handphone{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="mobile_phone_number"
                                placeholder="0807"
                                value={data.mobile_phone_number}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                    if (value.length <= 15) {
                                        setData("mobile_phone_number", value);
                                    }
                                }}
                                className={cn(
                                    "flex-1",
                                    errors.mobile_phone_number
                                        ? "border-red-500"
                                        : "",
                                    phoneVerified
                                        ? "border-green-500 bg-green-50"
                                        : ""
                                )}
                            />
                            <Button
                                type="button"
                                onClick={handleVerifyPhone}
                                className={cn(
                                    "px-6",
                                    phoneVerified
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-blue-900 hover:bg-blue-800"
                                )}
                                disabled={phoneVerified}
                            >
                                {phoneVerified ? "Verified" : "Verify"}
                            </Button>
                        </div>
                        {errors.mobile_phone_number && (
                            <p className="text-sm text-red-500">
                                {errors.mobile_phone_number}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Nomor Telepon</Label>
                        <Input
                            id="phone_number"
                            placeholder="Masukkan Nomor Telepon"
                            value={data.phone_number}
                            onChange={(e) => {
                                const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                );
                                if (value.length <= 15) {
                                    setData("phone_number", value);
                                }
                            }}
                        />
                        <p className="text-xs text-gray-500">
                            Phone number start with 0, min 8 characters, max 15
                            characters, and digits only
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fax_number">Nomor Faksimile</Label>
                        <Input
                            id="fax_number"
                            placeholder="Masukkan Nomor Fax"
                            value={data.fax_number}
                            onChange={(e) => {
                                const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                );
                                if (value.length <= 15) {
                                    setData("fax_number", value);
                                }
                            }}
                        />
                        <p className="text-xs text-gray-500">
                            Phone number start with 0, min 8 characters, max 15
                            characters, and digits only
                        </p>
                    </div>
                </div>

                <div className="flex justify-end items-center pt-6">
                    <Button
                        type="submit"
                        disabled={
                            processing || !emailVerified || !phoneVerified
                        }
                        className={cn(
                            "bg-blue-900 hover:bg-blue-800",
                            (!emailVerified || !phoneVerified) &&
                                "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {processing ? "Memvalidasi..." : "Lanjut"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
