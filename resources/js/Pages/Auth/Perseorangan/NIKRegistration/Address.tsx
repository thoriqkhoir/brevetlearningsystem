import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
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
import {
    Trash2,
    Copy,
    Plus,
    Loader2,
    ChevronsUpDown,
    Check,
} from "lucide-react";
import axios from "axios";

const addressSchema = z.object({
    address_type: z.enum(
        ["Alamat Domisili (Alamat Utama)", "Alamat Sesuai KTP"],
        {
            required_error: "Jenis alamat harus dipilih",
        }
    ),
    address_detail: z.string().min(1, "Detail alamat harus diisi"),
    rt: z.string().min(1, "RT harus diisi"),
    rw: z.string().min(1, "RW harus diisi"),
    province: z.string().min(1, "Provinsi harus dipilih"),
    province_id: z.string().min(1, "ID Provinsi harus ada"),
    region: z.string().min(1, "Kota/Wilayah harus dipilih"),
    region_id: z.string().min(1, "ID Kota harus ada"),
    district: z.string().min(1, "Kecamatan harus dipilih"),
    district_id: z.string().min(1, "ID Kecamatan harus ada"),
    sub_district: z.string().min(1, "Desa/Kelurahan harus dipilih"),
    sub_district_id: z.string().min(1, "ID Kelurahan harus ada"),
    region_code: z.string().min(1, "Kode wilayah harus diisi"),
    post_code: z
        .string()
        .min(5, "Kode pos harus diisi")
        .max(5, "Kode pos maksimal 5 digit"),
    geometric_data: z.string().optional(),
    supervisory_section: z.string().min(1, "Seksi pengawasan harus dipilih"),
});

interface AddressItem {
    id?: string;
    address_type: string;
    address_detail: string;
    rt: string;
    rw: string;
    province: string;
    province_id: string;
    region: string;
    region_id: string;
    district: string;
    district_id: string;
    sub_district: string;
    sub_district_id: string;
    region_code: string;
    post_code: string;
    geometric_data?: string;
    supervisory_section: string;
}

interface LocationItem {
    id: string;
    name: string;
}

interface Props {
    onNext: (responseData?: any) => void;
    existingData?: any;
}

export default function Address({ onNext, existingData }: Props) {
    const [errors, setErrors] = useState<
        Record<string, Record<string, string>>
    >({});
    const [processing, setProcessing] = useState(false);
    const [addresses, setAddresses] = useState<AddressItem[]>([
        {
            id: "1",
            address_type: "Alamat Sesuai KTP",
            address_detail: "",
            rt: "",
            rw: "",
            province: "",
            province_id: "",
            region: "",
            region_id: "",
            district: "",
            district_id: "",
            sub_district: "",
            sub_district_id: "",
            region_code: "",
            post_code: "",
            geometric_data: "",
            supervisory_section: "",
        },
    ]);

    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [regionsData, setRegionsData] = useState<
        Record<string, LocationItem[]>
    >({});
    const [districtsData, setDistrictsData] = useState<
        Record<string, LocationItem[]>
    >({});
    const [subDistrictsData, setSubDistrictsData] = useState<
        Record<string, LocationItem[]>
    >({});
    const [coordinateLoading, setCoordinateLoading] = useState<
        Record<string, boolean>
    >({});

    // Loading states
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
        {}
    );

    // Popover states for each address field
    const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>(
        {}
    );

    // Load data dari session storage
    useEffect(() => {
        const savedData = sessionStorage.getItem("addressData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData.addresses && parsedData.addresses.length > 0) {
                    setAddresses(parsedData.addresses);
                }
            } catch (error) {
                console.error("Error loading saved address data:", error);
            }
        }
    }, []);

    // Load provinces on component mount
    useEffect(() => {
        fetchProvinces();
    }, []);

    // Save data to session storage ketika addresses berubah
    useEffect(() => {
        const addressData = {
            addresses: addresses,
        };
        sessionStorage.setItem("addressData", JSON.stringify(addressData));
    }, [addresses]);

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

    const setLoading = (key: string, loading: boolean) => {
        setLoadingStates((prev) => ({
            ...prev,
            [key]: loading,
        }));
    };

    const fetchProvinces = async () => {
        setLoading("provinces", true);
        try {
            const response = await axios.get("/api/region/provinces");
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            toast.error("Gagal memuat data provinsi");
            // Fallback data jika API gagal
            setProvinces([
                { id: "11", name: "Aceh" },
                { id: "51", name: "Bali" },
                { id: "36", name: "Banten" },
                { id: "17", name: "Bengkulu" },
                { id: "34", name: "Daerah Istimewa Yogyakarta" },
                { id: "31", name: "DKI Jakarta" },
                { id: "75", name: "Gorontalo" },
                { id: "15", name: "Jambi" },
                { id: "32", name: "Jawa Barat" },
                { id: "33", name: "Jawa Tengah" },
                { id: "35", name: "Jawa Timur" },
                { id: "61", name: "Kalimantan Barat" },
                { id: "63", name: "Kalimantan Selatan" },
                { id: "62", name: "Kalimantan Tengah" },
                { id: "64", name: "Kalimantan Timur" },
                { id: "65", name: "Kalimantan Utara" },
                { id: "19", name: "Kepulauan Bangka Belitung" },
                { id: "21", name: "Kepulauan Riau" },
                { id: "18", name: "Lampung" },
                { id: "81", name: "Maluku" },
                { id: "82", name: "Maluku Utara" },
                { id: "52", name: "Nusa Tenggara Barat" },
                { id: "53", name: "Nusa Tenggara Timur" },
                { id: "91", name: "Papua" },
                { id: "92", name: "Papua Barat" },
                { id: "96", name: "Papua Barat Daya" },
                { id: "95", name: "Papua Pegunungan" },
                { id: "93", name: "Papua Selatan" },
                { id: "94", name: "Papua Tengah" },
                { id: "14", name: "Riau" },
                { id: "76", name: "Sulawesi Barat" },
                { id: "73", name: "Sulawesi Selatan" },
                { id: "72", name: "Sulawesi Tengah" },
                { id: "74", name: "Sulawesi Tenggara" },
                { id: "71", name: "Sulawesi Utara" },
                { id: "13", name: "Sumatera Barat" },
                { id: "16", name: "Sumatera Selatan" },
                { id: "12", name: "Sumatera Utara" },
            ]);
        } finally {
            setLoading("provinces", false);
        }
    };

    const fetchRegencies = async (provinceId: string) => {
        if (regionsData[provinceId]) {
            return regionsData[provinceId];
        }

        setLoading(`regions-${provinceId}`, true);
        try {
            const response = await axios.get(
                `/api/region/regencies/${provinceId}`
            );
            setRegionsData((prev) => ({
                ...prev,
                [provinceId]: response.data,
            }));
            return response.data;
        } catch (error) {
            console.error("Error fetching regencies:", error);
            toast.error("Gagal memuat data kota/kabupaten");
            return [];
        } finally {
            setLoading(`regions-${provinceId}`, false);
        }
    };

    const fetchDistricts = async (regencyId: string) => {
        if (districtsData[regencyId]) {
            return districtsData[regencyId];
        }

        setLoading(`districts-${regencyId}`, true);
        try {
            const response = await axios.get(
                `/api/region/districts/${regencyId}`
            );
            setDistrictsData((prev) => ({
                ...prev,
                [regencyId]: response.data,
            }));
            return response.data;
        } catch (error) {
            console.error("Error fetching districts:", error);
            toast.error("Gagal memuat data kecamatan");
            return [];
        } finally {
            setLoading(`districts-${regencyId}`, false);
        }
    };

    const fetchVillages = async (districtId: string) => {
        if (subDistrictsData[districtId]) {
            return subDistrictsData[districtId];
        }

        setLoading(`villages-${districtId}`, true);
        try {
            const response = await axios.get(
                `/api/region/villages/${districtId}`
            );
            setSubDistrictsData((prev) => ({
                ...prev,
                [districtId]: response.data,
            }));
            return response.data;
        } catch (error) {
            console.error("Error fetching villages:", error);
            toast.error("Gagal memuat data desa/kelurahan");
            return [];
        } finally {
            setLoading(`villages-${districtId}`, false);
        }
    };

    const fetchCoordinates = async (
        villageId: string,
        addressIndex: number
    ) => {
        if (!villageId) return null;

        const loadingKey = `coordinates-${villageId}`;
        setCoordinateLoading((prev) => ({ ...prev, [loadingKey]: true }));

        try {
            const response = await axios.get(
                `/api/region/coordinates/${villageId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            toast.error("Gagal mendapatkan koordinat wilayah");
            return null;
        } finally {
            setCoordinateLoading((prev) => ({ ...prev, [loadingKey]: false }));
        }
    };

    const supervisorySections = [
        { value: "Seksi Pengawasan I", label: "Seksi Pengawasan I" },
        { value: "Seksi Pengawasan II", label: "Seksi Pengawasan II" },
        { value: "Seksi Pengawasan III", label: "Seksi Pengawasan III" },
        { value: "Seksi Pengawasan IV", label: "Seksi Pengawasan IV" },
    ];

    const getAddressTypeOptions = (currentIndex: number) => {
        const usedTypes = addresses
            .filter((_, index) => index !== currentIndex)
            .map((addr) => addr.address_type);

        const allTypes = [
            {
                value: "Alamat Domisili (Alamat Utama)",
                label: "Alamat Domisili (Alamat Utama)",
            },
            { value: "Alamat Sesuai KTP", label: "Alamat Sesuai KTP" },
        ];

        return allTypes.filter((type) => {
            if (type.value === "Alamat Sesuai KTP") {
                return !usedTypes.includes(type.value);
            }
            return true;
        });
    };

    const getKtpAddress = () => {
        return addresses.find(
            (addr) => addr.address_type === "Alamat Sesuai KTP"
        );
    };

    const handleCopyFromKtpAddress = () => {
        const ktpAddress = getKtpAddress();
        if (!ktpAddress) {
            toast.error("Harap isi alamat sesuai KTP terlebih dahulu");
            return;
        }

        try {
            addressSchema.parse(ktpAddress);
        } catch (error) {
            toast.error("Harap lengkapi alamat sesuai KTP terlebih dahulu");
            return;
        }

        const hasDomisiliAddress = addresses.some(
            (addr) => addr.address_type === "Alamat Domisili (Alamat Utama)"
        );
        if (hasDomisiliAddress) {
            toast.error("Alamat Domisili sudah ada");
            return;
        }

        const newAddress: AddressItem = {
            ...ktpAddress,
            id: Date.now().toString(),
            address_type: "Alamat Domisili (Alamat Utama)",
        };

        setAddresses([...addresses, newAddress]);
        toast.success("Alamat berhasil disalin dari Alamat Sesuai KTP");
    };

    const handleAddNewAddress = () => {
        const availableTypes = getAddressTypeOptions(addresses.length);
        if (availableTypes.length === 0) {
            toast.error("Semua jenis alamat sudah ditambahkan");
            return;
        }

        const newAddress: AddressItem = {
            id: Date.now().toString(),
            address_type: availableTypes[0]
                .value as AddressItem["address_type"],
            address_detail: "",
            rt: "",
            rw: "",
            province: "",
            province_id: "",
            region: "",
            region_id: "",
            district: "",
            district_id: "",
            sub_district: "",
            sub_district_id: "",
            region_code: "",
            post_code: "",
            geometric_data: "",
            supervisory_section: "",
        };

        setAddresses([...addresses, newAddress]);
        toast.success("Alamat baru berhasil ditambahkan");
    };

    const handleDeleteAddress = (index: number) => {
        if (addresses.length === 1) {
            toast.error("Minimal harus ada satu alamat");
            return;
        }

        if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
            const newAddresses = addresses.filter((_, i) => i !== index);
            setAddresses(newAddresses);

            // Clear errors for deleted address
            const newErrors = { ...errors };
            delete newErrors[index];
            setErrors(newErrors);

            toast.success("Alamat berhasil dihapus!");
        }
    };

    const handleLocationChange = async (
        index: number,
        field: keyof AddressItem,
        value: string,
        selectedItem?: LocationItem
    ) => {
        const newAddresses = [...addresses];
        const currentAddress = { ...newAddresses[index] };

        if (field === "province") {
            currentAddress.province = selectedItem?.name || "";
            currentAddress.province_id = selectedItem?.id || "";
            currentAddress.region = "";
            currentAddress.region_id = "";
            currentAddress.district = "";
            currentAddress.district_id = "";
            currentAddress.sub_district = "";
            currentAddress.sub_district_id = "";
            currentAddress.region_code = "";
            currentAddress.post_code = "";
            currentAddress.geometric_data = "";

            if (selectedItem?.id) {
                await fetchRegencies(selectedItem.id);
            }
        } else if (field === "region") {
            currentAddress.region = selectedItem?.name || "";
            currentAddress.region_id = selectedItem?.id || "";
            currentAddress.district = "";
            currentAddress.district_id = "";
            currentAddress.sub_district = "";
            currentAddress.sub_district_id = "";
            currentAddress.region_code = "";
            currentAddress.post_code = "";
            currentAddress.geometric_data = "";

            if (selectedItem?.id) {
                await fetchDistricts(selectedItem.id);
            }
        } else if (field === "district") {
            currentAddress.district = selectedItem?.name || "";
            currentAddress.district_id = selectedItem?.id || "";
            currentAddress.sub_district = "";
            currentAddress.sub_district_id = "";
            currentAddress.region_code = "";
            currentAddress.post_code = "";
            currentAddress.geometric_data = "";

            if (selectedItem?.id) {
                await fetchVillages(selectedItem.id);
            }
        } else if (field === "sub_district") {
            currentAddress.sub_district = selectedItem?.name || "";
            currentAddress.sub_district_id = selectedItem?.id || "";
            // Auto generate region code from village ID
            currentAddress.region_code = selectedItem?.id || "";

            // Auto fetch coordinates when village is selected
            if (selectedItem?.id) {
                toast.loading("Mendapatkan koordinat wilayah...", {
                    id: `coordinates-${index}`,
                });

                const coordinateData = await fetchCoordinates(
                    selectedItem.id,
                    index
                );

                if (coordinateData) {
                    currentAddress.geometric_data =
                        coordinateData.formatted_coordinates;
                    toast.success(
                        `Koordinat berhasil didapat (${
                            coordinateData.source === "nominatim"
                                ? "akurat"
                                : "perkiraan"
                        })`,
                        { id: `coordinates-${index}` }
                    );
                } else {
                    toast.error("Gagal mendapatkan koordinat", {
                        id: `coordinates-${index}`,
                    });
                }
            }
        } else {
            if (field === "address_type") {
                currentAddress[field] = value as AddressItem["address_type"];
            } else {
                currentAddress[field] = value;
            }
        }

        newAddresses[index] = currentAddress;
        setAddresses(newAddresses);

        // Clear error for this field
        if (errors[index] && errors[index][field]) {
            const newErrors = { ...errors };
            delete newErrors[index][field];
            setErrors(newErrors);
        }
    };

    const handleFieldChange = (
        index: number,
        field: keyof AddressItem,
        value: string
    ) => {
        handleLocationChange(index, field, value);
    };

    const handleMarkAddress = async (index: number) => {
        const address = addresses[index];

        if (!address.sub_district_id) {
            toast.error(
                "Pilih desa/kelurahan terlebih dahulu untuk mendapatkan koordinat"
            );
            return;
        }

        toast.loading("Mendapatkan koordinat wilayah...", {
            id: `mark-${index}`,
        });

        const coordinateData = await fetchCoordinates(
            address.sub_district_id,
            index
        );

        if (coordinateData) {
            handleFieldChange(
                index,
                "geometric_data",
                coordinateData.formatted_coordinates
            );
            toast.success(
                `Koordinat berhasil didapat: ${coordinateData.formatted_coordinates}`,
                { id: `mark-${index}` }
            );
        } else {
            const fallbackCoords = "-6.200000, 106.816666";
            handleFieldChange(index, "geometric_data", fallbackCoords);
            toast.error("Menggunakan koordinat perkiraan", {
                id: `mark-${index}`,
            });
        }
    };

    const isMarkAddressEnabled = (address: AddressItem, index: number) => {
        return !!(address.sub_district_id && address.sub_district);
    };

    const isCoordinateLoading = (address: AddressItem) => {
        const loadingKey = `coordinates-${address.sub_district_id}`;
        return coordinateLoading[loadingKey] || false;
    };

    const validateAllAddresses = () => {
        const newErrors: Record<string, Record<string, string>> = {};
        let hasErrors = false;

        addresses.forEach((address, index) => {
            try {
                addressSchema.parse(address);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    newErrors[index] = {};
                    error.errors.forEach((err) => {
                        if (err.path[0]) {
                            newErrors[index][err.path[0] as string] =
                                err.message;
                            hasErrors = true;
                        }
                    });
                }
            }
        });

        setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAllAddresses()) {
            toast.error("Mohon periksa kembali data yang diisi");
            return;
        }

        setProcessing(true);

        try {
            const addressData = {
                addresses: addresses,
            };

            sessionStorage.setItem("addressData", JSON.stringify(addressData));
            toast.success("Data alamat berhasil disimpan!");
            onNext(addressData);
        } catch (error) {
            console.error("Error saving address data:", error);
            toast.error("Gagal menyimpan data alamat");
        } finally {
            setProcessing(false);
        }
    };

    const renderAddressForm = (address: AddressItem, index: number) => (
        <div key={address.id} className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                {addresses.length > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(index)}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Jenis Alamat */}
                <div className="space-y-2">
                    <Label>
                        Jenis Alamat <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                        open={openPopovers[`address_type_${index}`]}
                        onOpenChange={() =>
                            togglePopover(`address_type_${index}`)
                        }
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full justify-between",
                                    !address.address_type &&
                                        "text-muted-foreground",
                                    errors[index]?.address_type &&
                                        "border-red-500"
                                )}
                            >
                                <span className="truncate">
                                    {address.address_type ||
                                        "Pilih Jenis Alamat"}
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Cari jenis alamat..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        Tidak ada jenis alamat yang tersedia.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {getAddressTypeOptions(index).map(
                                            (type) => (
                                                <CommandItem
                                                    key={type.value}
                                                    value={type.value}
                                                    onSelect={() => {
                                                        handleFieldChange(
                                                            index,
                                                            "address_type",
                                                            type.value
                                                        );
                                                        closePopover(
                                                            `address_type_${index}`
                                                        );
                                                    }}
                                                >
                                                    {type.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            address.address_type ===
                                                                type.value
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
                    {errors[index]?.address_type && (
                        <p className="text-sm text-red-500">
                            {errors[index].address_type}
                        </p>
                    )}
                </div>

                {/* Detail Alamat */}
                <div className="space-y-2">
                    <Label>
                        Detail Alamat <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Masukkan detail alamat (jalan, nomor, gedung...)"
                        value={address.address_detail}
                        onChange={(e) =>
                            handleFieldChange(
                                index,
                                "address_detail",
                                e.target.value
                            )
                        }
                        className={cn(
                            errors[index]?.address_detail && "border-red-500"
                        )}
                    />
                    {errors[index]?.address_detail && (
                        <p className="text-sm text-red-500">
                            {errors[index].address_detail}
                        </p>
                    )}
                </div>

                {/* RT */}
                <div className="space-y-2">
                    <Label>
                        RT <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Masukkan RT (contoh: 001)"
                        value={address.rt}
                        onChange={(e) =>
                            handleFieldChange(index, "rt", e.target.value)
                        }
                        className={cn(errors[index]?.rt && "border-red-500")}
                    />
                    <p className="text-xs text-gray-500">
                        Jika RT/RW tidak ada, masukkan 000
                    </p>
                    {errors[index]?.rt && (
                        <p className="text-sm text-red-500">
                            {errors[index].rt}
                        </p>
                    )}
                </div>

                {/* RW */}
                <div className="space-y-2">
                    <Label>
                        RW <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Masukkan RW (contoh: 001)"
                        value={address.rw}
                        onChange={(e) =>
                            handleFieldChange(index, "rw", e.target.value)
                        }
                        className={cn(errors[index]?.rw && "border-red-500")}
                    />
                    <p className="text-xs text-gray-500">
                        Jika RT/RW tidak ada, masukkan 000
                    </p>
                    {errors[index]?.rw && (
                        <p className="text-sm text-red-500">
                            {errors[index].rw}
                        </p>
                    )}
                </div>

                {/* Provinsi */}
                <div className="space-y-2">
                    <Label>
                        Provinsi <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                        open={openPopovers[`province_${index}`]}
                        onOpenChange={() => togglePopover(`province_${index}`)}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                disabled={loadingStates.provinces}
                                className={cn(
                                    "w-full justify-between",
                                    !address.province &&
                                        "text-muted-foreground",
                                    errors[index]?.province && "border-red-500"
                                )}
                            >
                                <span className="truncate">
                                    {loadingStates.provinces
                                        ? "Memuat provinsi..."
                                        : address.province || "Pilih Provinsi"}
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Cari provinsi..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        Tidak ada provinsi yang tersedia.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {provinces.map((province) => (
                                            <CommandItem
                                                key={province.id}
                                                value={province.name}
                                                onSelect={() => {
                                                    handleLocationChange(
                                                        index,
                                                        "province",
                                                        province.id,
                                                        province
                                                    );
                                                    closePopover(
                                                        `province_${index}`
                                                    );
                                                }}
                                            >
                                                {province.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        address.province ===
                                                            province.name
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
                    {errors[index]?.province && (
                        <p className="text-sm text-red-500">
                            {errors[index].province}
                        </p>
                    )}
                </div>

                {/* Kota/Wilayah */}
                <div className="space-y-2">
                    <Label>
                        Kota/Wilayah <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                        open={openPopovers[`region_${index}`]}
                        onOpenChange={() => togglePopover(`region_${index}`)}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                disabled={
                                    !address.province_id ||
                                    loadingStates[
                                        `regions-${address.province_id}`
                                    ]
                                }
                                className={cn(
                                    "w-full justify-between",
                                    !address.region && "text-muted-foreground",
                                    errors[index]?.region && "border-red-500",
                                    (!address.province_id ||
                                        loadingStates[
                                            `regions-${address.province_id}`
                                        ]) &&
                                        "bg-gray-50"
                                )}
                            >
                                <span className="truncate">
                                    {!address.province_id
                                        ? "Pilih provinsi terlebih dahulu"
                                        : loadingStates[
                                              `regions-${address.province_id}`
                                          ]
                                        ? "Memuat kota..."
                                        : address.region ||
                                          "Pilih Kota/Wilayah"}
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Cari kota/wilayah..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        Tidak ada kota/wilayah yang tersedia.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {(
                                            regionsData[address.province_id] ||
                                            []
                                        ).map((region) => (
                                            <CommandItem
                                                key={region.id}
                                                value={region.name}
                                                onSelect={() => {
                                                    handleLocationChange(
                                                        index,
                                                        "region",
                                                        region.id,
                                                        region
                                                    );
                                                    closePopover(
                                                        `region_${index}`
                                                    );
                                                }}
                                            >
                                                {region.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        address.region ===
                                                            region.name
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
                    {loadingStates[`regions-${address.province_id}`] && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Memuat data kota...
                        </div>
                    )}
                    {errors[index]?.region && (
                        <p className="text-sm text-red-500">
                            {errors[index].region}
                        </p>
                    )}
                </div>

                {/* Kecamatan */}
                <div className="space-y-2">
                    <Label>
                        Kecamatan <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                        open={openPopovers[`district_${index}`]}
                        onOpenChange={() => togglePopover(`district_${index}`)}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                disabled={
                                    !address.region_id ||
                                    loadingStates[
                                        `districts-${address.region_id}`
                                    ]
                                }
                                className={cn(
                                    "w-full justify-between",
                                    !address.district &&
                                        "text-muted-foreground",
                                    errors[index]?.district && "border-red-500",
                                    (!address.region_id ||
                                        loadingStates[
                                            `districts-${address.region_id}`
                                        ]) &&
                                        "bg-gray-50"
                                )}
                            >
                                <span className="truncate">
                                    {!address.region_id
                                        ? "Pilih kota/wilayah terlebih dahulu"
                                        : loadingStates[
                                              `districts-${address.region_id}`
                                          ]
                                        ? "Memuat kecamatan..."
                                        : address.district || "Pilih Kecamatan"}
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Cari kecamatan..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        Tidak ada kecamatan yang tersedia.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {(
                                            districtsData[address.region_id] ||
                                            []
                                        ).map((district) => (
                                            <CommandItem
                                                key={district.id}
                                                value={district.name}
                                                onSelect={() => {
                                                    handleLocationChange(
                                                        index,
                                                        "district",
                                                        district.id,
                                                        district
                                                    );
                                                    closePopover(
                                                        `district_${index}`
                                                    );
                                                }}
                                            >
                                                {district.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        address.district ===
                                                            district.name
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
                    {loadingStates[`districts-${address.region_id}`] && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Memuat data kecamatan...
                        </div>
                    )}
                    {errors[index]?.district && (
                        <p className="text-sm text-red-500">
                            {errors[index].district}
                        </p>
                    )}
                </div>

                {/* Desa/Kelurahan */}
                <div className="space-y-2">
                    <Label>
                        Desa/Kelurahan <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                        open={openPopovers[`sub_district_${index}`]}
                        onOpenChange={() =>
                            togglePopover(`sub_district_${index}`)
                        }
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                disabled={
                                    !address.district_id ||
                                    loadingStates[
                                        `villages-${address.district_id}`
                                    ]
                                }
                                className={cn(
                                    "w-full justify-between",
                                    !address.sub_district &&
                                        "text-muted-foreground",
                                    errors[index]?.sub_district &&
                                        "border-red-500",
                                    (!address.district_id ||
                                        loadingStates[
                                            `villages-${address.district_id}`
                                        ]) &&
                                        "bg-gray-50"
                                )}
                            >
                                <span className="truncate">
                                    {!address.district_id
                                        ? "Pilih kecamatan terlebih dahulu"
                                        : loadingStates[
                                              `villages-${address.district_id}`
                                          ]
                                        ? "Memuat desa/kelurahan..."
                                        : address.sub_district ||
                                          "Pilih Desa/Kelurahan"}
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Cari desa/kelurahan..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        Tidak ada desa/kelurahan yang tersedia.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {(
                                            subDistrictsData[
                                                address.district_id
                                            ] || []
                                        ).map((village) => (
                                            <CommandItem
                                                key={village.id}
                                                value={village.name}
                                                onSelect={() => {
                                                    handleLocationChange(
                                                        index,
                                                        "sub_district",
                                                        village.id,
                                                        village
                                                    );
                                                    closePopover(
                                                        `sub_district_${index}`
                                                    );
                                                }}
                                            >
                                                {village.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        address.sub_district ===
                                                            village.name
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
                    {loadingStates[`villages-${address.district_id}`] && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Memuat data desa/kelurahan...
                        </div>
                    )}
                    {errors[index]?.sub_district && (
                        <p className="text-sm text-red-500">
                            {errors[index].sub_district}
                        </p>
                    )}
                </div>

                {/* Kode Wilayah */}
                <div className="space-y-2">
                    <Label>
                        Kode Wilayah <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Kode wilayah (otomatis dari kelurahan)"
                        value={address.region_code}
                        onChange={(e) =>
                            handleFieldChange(
                                index,
                                "region_code",
                                e.target.value
                            )
                        }
                        className={cn(
                            errors[index]?.region_code && "border-red-500",
                            address.region_code && "bg-gray-50"
                        )}
                        readOnly={!!address.region_code}
                    />
                    {errors[index]?.region_code && (
                        <p className="text-sm text-red-500">
                            {errors[index].region_code}
                        </p>
                    )}
                </div>

                {/* Kode Pos */}
                <div className="space-y-2">
                    <Label>
                        Kode Pos <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Masukkan kode pos (5 digit)"
                        value={address.post_code}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            if (value.length <= 5) {
                                handleFieldChange(index, "post_code", value);
                            }
                        }}
                        className={cn(
                            errors[index]?.post_code && "border-red-500"
                        )}
                        maxLength={5}
                    />
                    {errors[index]?.post_code && (
                        <p className="text-sm text-red-500">
                            {errors[index].post_code}
                        </p>
                    )}
                </div>

                {/* Data Geometris */}
                <div className="space-y-2">
                    <Label>Data geometris</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Koordinat (latitude, longitude)"
                            value={address.geometric_data}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    "geometric_data",
                                    e.target.value
                                )
                            }
                            className={cn(
                                errors[index]?.geometric_data &&
                                    "border-red-500"
                            )}
                        />
                        <Button
                            type="button"
                            onClick={() => handleMarkAddress(index)}
                            disabled={
                                !isMarkAddressEnabled(address, index) ||
                                isCoordinateLoading(address)
                            }
                            className={cn(
                                "bg-blue-900 hover:bg-blue-800",
                                !isMarkAddressEnabled(address, index) &&
                                    "bg-gray-400 cursor-not-allowed"
                            )}
                            title={
                                !isMarkAddressEnabled(address, index)
                                    ? "Pilih desa/kelurahan terlebih dahulu"
                                    : "Dapatkan koordinat wilayah"
                            }
                        >
                            {isCoordinateLoading(address) ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Mark Address"
                            )}
                        </Button>
                    </div>

                    {/* Show coordinate info */}
                    {address.geometric_data && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            📍 Koordinat: {address.geometric_data}
                        </div>
                    )}

                    {errors[index]?.geometric_data && (
                        <p className="text-sm text-red-500">
                            {errors[index].geometric_data}
                        </p>
                    )}
                </div>

                {/* Seksi Pengawasan */}
                <div className="space-y-2">
                    <Label>
                        Seksi Pengawasan <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                        open={openPopovers[`supervisory_section_${index}`]}
                        onOpenChange={() =>
                            togglePopover(`supervisory_section_${index}`)
                        }
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full justify-between",
                                    !address.supervisory_section &&
                                        "text-muted-foreground",
                                    errors[index]?.supervisory_section &&
                                        "border-red-500"
                                )}
                            >
                                <span className="truncate">
                                    {address.supervisory_section ||
                                        "Pilih Seksi Pengawasan"}
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Cari seksi pengawasan..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        Tidak ada seksi pengawasan yang
                                        tersedia.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {supervisorySections.map((section) => (
                                            <CommandItem
                                                key={section.value}
                                                value={section.value}
                                                onSelect={() => {
                                                    handleFieldChange(
                                                        index,
                                                        "supervisory_section",
                                                        section.value
                                                    );
                                                    closePopover(
                                                        `supervisory_section_${index}`
                                                    );
                                                }}
                                            >
                                                {section.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        address.supervisory_section ===
                                                            section.value
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
                    {errors[index]?.supervisory_section && (
                        <p className="text-sm text-red-500">
                            {errors[index].supervisory_section}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Masukkan detail Alamat wajib pajak.
                </h2>
            </div>

            {/* Render all address forms */}
            {addresses.map((address, index) =>
                renderAddressForm(address, index)
            )}

            {/* Action Buttons */}
            <div className="flex md:flex-row flex-col justify-center gap-3 mb-6">
                {getKtpAddress() &&
                    !addresses.some(
                        (addr) =>
                            addr.address_type ===
                            "Alamat Domisili (Alamat Utama)"
                    ) && (
                        <Button
                            type="button"
                            onClick={handleCopyFromKtpAddress}
                            className="bg-blue-900 hover:bg-blue-800"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Salin dari Alamat KTP
                        </Button>
                    )}

                {getAddressTypeOptions(addresses.length).length > 0 && (
                    <Button
                        type="button"
                        onClick={handleAddNewAddress}
                        variant="outline"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Alamat
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        {processing ? "Menyimpan..." : "Lanjutkan"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
