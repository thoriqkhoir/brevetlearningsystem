import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronsUpDown, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import axios from "axios";
import {
    occupations,
    countries,
    genders,
    maritalStatuses,
    religions,
    familyRelationships,
    individualCategories,
} from "@/data/taxpayer-data";

const taxpayerIdentitySchema = z.object({
    nik: z
        .string()
        .length(16, "NIK harus 16 digit")
        .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
    name: z.string().min(1, "Nama wajib pajak harus diisi"),
    type: z.enum(["Orang Pribadi atau Warisan Belum Terbagi"]),
    birth_place: z.string().min(1, "Tempat lahir harus diisi"),
    birth_date: z
        .date({ required_error: "Tanggal lahir harus diisi" })
        .nullable()
        .refine((date) => date !== null, {
            message: "Tanggal lahir harus diisi",
        }),
    country: z.string().min(1, "Negara harus diisi"),
    gender: z.string().min(1, "Jenis kelamin harus dipilih"),
    marital_status: z.string().min(1, "Status perkawinan harus dipilih"),
    religion: z.string().min(1, "Agama harus dipilih"),
    occupation: z.string().min(1, "Jenis pekerjaan harus diisi"),
    mother_name: z.string().min(1, "Nama ibu kandung harus diisi"),
    family_card_number: z.string().min(1, "Nomor kartu keluarga harus diisi"),
    family_relationship_status: z
        .string()
        .min(1, "Status hubungan keluarga harus dipilih"),
    individual_category: z.string().optional(),
});

interface Props {
    onNext: (responseData?: any) => void;
    existingData?: any;
}

export default function TaxpayerIdentity({ onNext, existingData }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>(
        {}
    );
    const [nikExists, setNikExists] = useState(false);
    const [nikCheckLoading, setNikCheckLoading] = useState(false);

    const { data, setData } = useForm({
        nik: existingData?.nik || "",
        name: existingData?.name || "",
        type: "Orang Pribadi atau Warisan Belum Terbagi",
        birth_place: existingData?.birth_place || "",
        birth_date: existingData?.birth_date
            ? new Date(existingData.birth_date)
            : (null as Date | null),
        country: existingData?.country || "Indonesia",
        gender: existingData?.gender || "",
        marital_status: existingData?.marital_status || "",
        religion: existingData?.religion || "",
        occupation: existingData?.occupation || "",
        mother_name: existingData?.mother_name || "",
        family_card_number: existingData?.family_card_number || "",
        family_relationship_status:
            existingData?.family_relationship_status || "",
        individual_category: existingData?.individual_category || "",
    });

    useEffect(() => {
        if (data.nik.length === 16) {
            checkNikExists(data.nik);
        } else {
            setNikExists(false);
        }
    }, [data.nik]);

    const checkNikExists = async (nik: string) => {
        setNikCheckLoading(true);
        try {
            const response = await axios.get(
                route("taxpayer-identity.check-nik"),
                {
                    params: { nik },
                }
            );

            if (response.data.exists) {
                setNikExists(true);
                toast.error("NIK sudah terdaftar dalam sistem!");
            } else {
                setNikExists(false);
            }
        } catch (error) {
            console.error("Error checking NIK:", error);
            setNikExists(false);
        } finally {
            setNikCheckLoading(false);
        }
    };

    const togglePopover = (field: string) => {
        setOpenPopovers((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const closePopover = (field: string) => {
        setOpenPopovers((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (nikExists) {
            toast.error(
                "NIK sudah terdaftar! Silakan gunakan NIK yang berbeda."
            );
            return;
        }

        try {
            const validatedData = taxpayerIdentitySchema.parse({
                ...data,
                birth_date: data.birth_date,
            });
            setErrors({});

            const formattedValues = {
                ...validatedData,
                birth_date: format(validatedData.birth_date, "yyyy-MM-dd"),
            };

            toast.success("Data identitas berhasil divalidasi!");
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
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Masukkan data identitas wajib pajak.
                </h1>
            </div>

            {nikExists && (
                <Alert className="mb-6 border-red-500 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700 mt-1.5">
                        NIK sudah terdaftar dalam sistem! Silakan gunakan NIK
                        yang berbeda.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="nik">
                            Nomor Identitas Kependudukan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="nik"
                                placeholder="NIK"
                                value={data.nik}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                    if (value.length <= 16) {
                                        setData("nik", value);
                                    }
                                }}
                                maxLength={16}
                                className={cn(
                                    errors.nik ? "border-red-500" : "",
                                    nikExists ? "border-red-500 bg-red-50" : "",
                                    nikCheckLoading ? "bg-gray-50" : ""
                                )}
                                disabled={nikCheckLoading}
                            />
                            {nikCheckLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                </div>
                            )}
                        </div>
                        {errors.nik && (
                            <p className="text-sm text-red-500">{errors.nik}</p>
                        )}
                        {nikExists && (
                            <p className="text-sm text-red-500">
                                NIK sudah terdaftar dalam sistem
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nama Wajib Pajak{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Masukkan nama Wajib Pajak"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Jenis Wajib Pajak{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value="Orang Pribadi atau Warisan Belum Terbagi"
                            disabled
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="birth_place">
                            Tempat Lahir <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="birth_place"
                            placeholder="Masukkan Tempat Lahir"
                            value={data.birth_place}
                            onChange={(e) =>
                                setData("birth_place", e.target.value)
                            }
                            className={
                                errors.birth_place ? "border-red-500" : ""
                            }
                        />
                        {errors.birth_place && (
                            <p className="text-sm text-red-500">
                                {errors.birth_place}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Negara Asal <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.country}
                            onOpenChange={() => togglePopover("country")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.country &&
                                            "text-muted-foreground",
                                        errors.country && "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.country || "Pilih Negara Asal"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari negara..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada negara yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {countries.map((country) => (
                                                <CommandItem
                                                    key={country.value}
                                                    value={country.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "country",
                                                            country.value
                                                        );
                                                        closePopover("country");
                                                    }}
                                                >
                                                    {country.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.country ===
                                                                country.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.country && (
                            <p className="text-sm text-red-500">
                                {errors.country}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="birth_date">
                            Tanggal Lahir{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.birth_date}
                            onOpenChange={() => togglePopover("birth_date")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.birth_date &&
                                            "text-muted-foreground",
                                        errors.birth_date && "border-red-500"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.birth_date ? (
                                        format(data.birth_date, "PPP", {
                                            locale: id,
                                        })
                                    ) : (
                                        <span>Masukkan Tanggal Lahir</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.birth_date || undefined}
                                    onSelect={(date) => {
                                        setData("birth_date", date || null);
                                        closePopover("birth_date");
                                    }}
                                    initialFocus
                                    locale={id}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.birth_date && (
                            <p className="text-sm text-red-500">
                                {errors.birth_date}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Jenis Kelamin{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.gender}
                            onOpenChange={() => togglePopover("gender")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.gender && "text-muted-foreground",
                                        errors.gender && "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.gender || "Pilih Jenis Kelamin"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari jenis kelamin..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada jenis kelamin yang
                                            tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {genders.map((gender) => (
                                                <CommandItem
                                                    key={gender.value}
                                                    value={gender.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "gender",
                                                            gender.value
                                                        );
                                                        closePopover("gender");
                                                    }}
                                                >
                                                    {gender.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.gender ===
                                                                gender.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.gender && (
                            <p className="text-sm text-red-500">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Status Perkawinan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.marital_status}
                            onOpenChange={() => togglePopover("marital_status")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.marital_status &&
                                            "text-muted-foreground",
                                        errors.marital_status &&
                                            "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.marital_status ||
                                            "Pilih Status Perkawinan"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari status perkawinan..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada status perkawinan yang
                                            tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {maritalStatuses.map((status) => (
                                                <CommandItem
                                                    key={status.value}
                                                    value={status.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "marital_status",
                                                            status.value
                                                        );
                                                        closePopover(
                                                            "marital_status"
                                                        );
                                                    }}
                                                >
                                                    {status.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.marital_status ===
                                                                status.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.marital_status && (
                            <p className="text-sm text-red-500">
                                {errors.marital_status}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Agama <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.religion}
                            onOpenChange={() => togglePopover("religion")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.religion &&
                                            "text-muted-foreground",
                                        errors.religion && "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.religion || "Pilih Agama"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari agama..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada agama yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {religions.map((religion) => (
                                                <CommandItem
                                                    key={religion.value}
                                                    value={religion.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "religion",
                                                            religion.value
                                                        );
                                                        closePopover(
                                                            "religion"
                                                        );
                                                    }}
                                                >
                                                    {religion.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.religion ===
                                                                religion.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.religion && (
                            <p className="text-sm text-red-500">
                                {errors.religion}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Jenis Pekerjaan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.occupation}
                            onOpenChange={() => togglePopover("occupation")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.occupation &&
                                            "text-muted-foreground",
                                        errors.occupation && "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.occupation ||
                                            "Pilih Jenis Pekerjaan"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari pekerjaan..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada pekerjaan yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {occupations.map((occupation) => (
                                                <CommandItem
                                                    key={occupation.value}
                                                    value={occupation.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "occupation",
                                                            occupation.value
                                                        );
                                                        closePopover(
                                                            "occupation"
                                                        );
                                                    }}
                                                >
                                                    {occupation.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.occupation ===
                                                                occupation.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.occupation && (
                            <p className="text-sm text-red-500">
                                {errors.occupation}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mother_name">
                            Nama Ibu Kandung{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="mother_name"
                            placeholder="Masukkan Nama Ibu Kandung"
                            value={data.mother_name}
                            onChange={(e) =>
                                setData("mother_name", e.target.value)
                            }
                            className={
                                errors.mother_name ? "border-red-500" : ""
                            }
                        />
                        {errors.mother_name && (
                            <p className="text-sm text-red-500">
                                {errors.mother_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="family_card_number">
                            Nomor Kartu Keluarga{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="family_card_number"
                            placeholder="Masukkan Nomor Kartu Keluarga"
                            value={data.family_card_number}
                            onChange={(e) =>
                                setData("family_card_number", e.target.value)
                            }
                            className={
                                errors.family_card_number
                                    ? "border-red-500"
                                    : ""
                            }
                        />
                        {errors.family_card_number && (
                            <p className="text-sm text-red-500">
                                {errors.family_card_number}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Status Hubungan Keluarga{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.family_relationship_status}
                            onOpenChange={() =>
                                togglePopover("family_relationship_status")
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.family_relationship_status &&
                                            "text-muted-foreground",
                                        errors.family_relationship_status &&
                                            "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.family_relationship_status ||
                                            "Pilih Status Hubungan Keluarga"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari status keluarga..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada status keluarga yang
                                            tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {familyRelationships.map(
                                                (relationship) => (
                                                    <CommandItem
                                                        key={relationship.value}
                                                        value={
                                                            relationship.value
                                                        }
                                                        onSelect={() => {
                                                            setData(
                                                                "family_relationship_status",
                                                                relationship.value
                                                            );
                                                            closePopover(
                                                                "family_relationship_status"
                                                            );
                                                        }}
                                                    >
                                                        {relationship.label}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                data.family_relationship_status ===
                                                                    relationship.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.family_relationship_status && (
                            <p className="text-sm text-red-500">
                                {errors.family_relationship_status}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Kategori Individu</Label>
                        <Popover
                            open={openPopovers.individual_category}
                            onOpenChange={() =>
                                togglePopover("individual_category")
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.individual_category &&
                                            "text-muted-foreground",
                                        errors.individual_category &&
                                            "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.individual_category ||
                                            "Pilih Kategori Individu"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari kategori..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada kategori yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {individualCategories.map(
                                                (category) => (
                                                    <CommandItem
                                                        key={category.value}
                                                        value={category.value}
                                                        onSelect={() => {
                                                            setData(
                                                                "individual_category",
                                                                category.value
                                                            );
                                                            closePopover(
                                                                "individual_category"
                                                            );
                                                        }}
                                                    >
                                                        {category.label}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                data.individual_category ===
                                                                    category.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.individual_category && (
                            <p className="text-sm text-red-500">
                                {errors.individual_category}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end items-center pt-6">
                    <Button
                        type="submit"
                        disabled={processing || nikCheckLoading || nikExists}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        {processing ? "Memverifikasi..." : "Verifikasi"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
