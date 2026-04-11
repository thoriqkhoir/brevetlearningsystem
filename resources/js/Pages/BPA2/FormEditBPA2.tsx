import { Button } from "@/Components/ui/button";
import { Form } from "@/Components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { Banknote, File } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import FormFieldsGeneralInformation from "./FormFieldsGeneralInformation";
import FormFieldGrossIncome from "./FormFieldGrossIncome";
import FormFieldReducer from "./FormFieldReducer";
import FormFieldPph21 from "./FormFieldPph21";
import { useEffect } from "react";

const calculatePS17Tax = (pkp: number) => {
    let tax = 0;

    if (pkp <= 60000000) {
        tax = pkp * 0.05;
    } else if (pkp <= 250000000) {
        tax = 60000000 * 0.05 + (pkp - 60000000) * 0.15;
    } else if (pkp <= 500000000) {
        tax =
            60000000 * 0.05 +
            (250000000 - 60000000) * 0.15 +
            (pkp - 250000000) * 0.25;
    } else if (pkp <= 5000000000) {
        tax =
            60000000 * 0.05 +
            (250000000 - 60000000) * 0.15 +
            (500000000 - 250000000) * 0.25 +
            (pkp - 500000000) * 0.3;
    } else {
        tax =
            60000000 * 0.05 +
            (250000000 - 60000000) * 0.15 +
            (500000000 - 250000000) * 0.25 +
            (5000000000 - 500000000) * 0.3 +
            (pkp - 5000000000) * 0.35;
    }

    return Math.round(tax);
};

const formSchema = z.object({
    id: z.string().uuid(),
    object_id: z.number().int().min(1, "Pilih objek pajak"),
    is_more: z.enum(["ya", "tidak"]),
    start_period: z.string().min(1, "Masa pajak awal wajib diisi").max(255),
    end_period: z.string().min(1, "Masa pajak akhir wajib diisi").max(255),
    bupot_status: z.enum(["normal", "perbaikan"]),
    customer_id: z.string().min(1, "NPWP wajib diisi").max(255),
    customer_name: z.string().min(1, "Nama wajib diisi").max(255),
    nip: z.string().min(1, "NIP wajib diisi").max(255),
    rank_group: z.string().min(1, "Pangkat/Golongan wajib diisi").max(255),
    customer_ptkp: z.string().min(1, "Status PTKP wajib diisi").max(255),
    customer_position: z.string().min(1, "Posisi wajib diisi").max(255),
    tax_type: z.string().min(1, "Jenis pajak wajib diisi").max(255),
    tax_code: z.string().min(1, "Kode pajak wajib diisi").max(255),
    bupot_types: z.string().min(1, "Jenis pemotongan wajib diisi").max(255),
    // Penghasilan Bruto
    basic_salary: z.number().optional(),
    wifes_allowance: z.number().optional(),
    childs_allowance: z.number().optional(),
    income_improvement_allowance: z.number().optional(),
    fungtional_allowance: z.number().optional(),
    rice_allowance: z.number().optional(),
    other_allowance: z.number().optional(),
    separate_salary: z.number().optional(),
    gross_income_amount: z.number().optional(),
    // Pengurang
    position_allowance: z.number().optional(),
    pension_contribution: z.number().optional(),
    zakat: z.number().optional(),
    amount_of_reduction: z.number().optional(),
    // Penghitungan PPh
    neto: z.number().optional(),
    proof_number: z.number().optional(),
    before_neto: z.number().optional(),
    total_neto: z.number().optional(),
    non_taxable_income: z.number().optional(),
    taxable_income: z.number().optional(),
    pph_taxable_income: z.number().optional(),
    pph_owed: z.number().optional(),
    pph_deducted: z.number().optional(),
    pph_deducted_withholding: z.number().optional(),
    pph_hasbeen_deducted: z.number().optional(),
    pph_desember: z.number().optional(),
    kap: z.string().optional().or(z.literal("")),
    nitku: z.string().optional().or(z.literal("")),
    status: z.enum(["created", "approved", "canceled", "deleted", "draft"]),
});

export default function FormEditBPA2({ user, bupot, objects, bupots, ter }: any) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...bupot,
        },
    });

    // Auto-calculation effects (same as FormCreateBPA2)
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            // Auto-fill non_taxable_income based on customer_ptkp
            if (name === "customer_ptkp") {
                const ptkp = value.customer_ptkp;
                
                if (!ptkp) {
                    form.setValue("non_taxable_income", 0);
                } else {
                    const ptkpMapping: { [key: string]: number } = {
                        "TK/0": 54000000,
                        "TK/1": 58500000,
                        "TK/2": 63000000,
                        "TK/3": 67500000,
                        "K/0": 58500000,
                        "K/1": 63000000,
                        "K/2": 67500000,
                        "K/3": 72000000
                    };

                    const nonTaxableAmount = ptkpMapping[ptkp] || 0;
                    form.setValue("non_taxable_income", nonTaxableAmount);
                }
            }

            // Calculate gross_income_amount
            if (name?.includes("salary") || name?.includes("allowance")) {
                const total =
                    (value.basic_salary || 0) +
                    (value.wifes_allowance || 0) +
                    (value.childs_allowance || 0) +
                    (value.income_improvement_allowance || 0) +
                    (value.fungtional_allowance || 0) +
                    (value.rice_allowance || 0) +
                    (value.other_allowance || 0) +
                    (value.separate_salary || 0);
                form.setValue("gross_income_amount", total);
            }

            // Calculate amount_of_reduction
            if (
                name === "position_allowance" ||
                name === "pension_contribution" ||
                name === "zakat"
            ) {
                const total =
                    (value.position_allowance || 0) +
                    (value.pension_contribution || 0) +
                    (value.zakat || 0);
                form.setValue("amount_of_reduction", total);
            }

            // Calculate neto
            if (name === "gross_income_amount" || name === "amount_of_reduction") {
                const neto =
                    (value.gross_income_amount || 0) - (value.amount_of_reduction || 0);
                form.setValue("neto", neto);
            }

            // Calculate total_neto
            if (name === "neto" || name === "before_neto") {
                const total = (value.neto || 0) + (value.before_neto || 0);
                form.setValue("total_neto", total);
            }

            // Calculate taxable_income (PKP)
            if (name === "total_neto" || name === "non_taxable_income") {
                const pkp = Math.max(
                    (value.total_neto || 0) - (value.non_taxable_income || 0),
                    0
                );
                // Round down to nearest thousand
                const taxableIncome = Math.floor(pkp / 1000) * 1000;
                form.setValue("taxable_income", taxableIncome);

                // Auto-calculate PPh based on progressive tax
                const pphTax = calculatePS17Tax(taxableIncome);
                form.setValue("pph_taxable_income", pphTax);
            }

            // Auto-fill pph_owed with same value as pph_taxable_income (like BPA1)
            if (name === "pph_taxable_income") {
                form.setValue("pph_owed", value.pph_taxable_income || 0);
            }

            // Auto-fill pph_deducted_withholding with same value as pph_owed
            if (name === "pph_owed") {
                form.setValue("pph_deducted_withholding", value.pph_owed || 0);
            }

            // Calculate pph_desember
            if (
                name === "pph_deducted_withholding" ||
                name === "pph_hasbeen_deducted" ||
                name === "pph_deducted"
            ) {
                const desember =
                    (value.pph_deducted_withholding || 0) -
                    (value.pph_hasbeen_deducted || 0) -
                    (value.pph_deducted || 0);
                form.setValue("pph_desember", desember);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("=== FORM SUBMISSION STARTED ===");
        console.log("Data yang dikirim:", values);
        console.log("Status:", values.status);

        const result = formSchema.safeParse(values);
        
        console.log("Validation result:", result);
        
        if (!result.success) {
            console.error("❌ VALIDATION FAILED!");
            console.error("Validation errors:", result.error.flatten());
            console.error("Field errors:", result.error.issues);
            return;
        }

        console.log("✅ Validation passed, sending to backend...");

        const transformedValues = {
            ...values,
            kap: values.kap || "",
            nitku: values.nitku || "",
        };

        router.put(route("bpa2.update", bupot.id), transformedValues, {
            onStart: () => {
                console.log("🚀 Request dimulai - sending to server...");
            },
            onSuccess: (data) => {
                console.log("✅ SUCCESS! Server response:", data);
            },
            onError: (errors) => {
                console.error("❌ ERROR! Server response:", errors);
            },
            onFinish: () => {
                console.log("🏁 Request selesai");
            }
        });
    }

    // Fungsi untuk submit dengan mengubah status
    function handleSubmitWithStatus(status: "created" | "draft") {
        console.log(`=== ${status.toUpperCase()} BUTTON CLICKED ===`);
        
        form.setValue("status", status);
        console.log("Status set to:", status);
        
        const values = form.getValues();
        console.log("All form values:", values);
        
        form.handleSubmit(onSubmit)();
    }

    // Fungsi untuk submit dengan mempertahankan status yang ada
    function handleSubmitPreserveStatus() {
        console.log("=== SUBMIT WITH PRESERVE STATUS ===");
        // Tidak mengubah status, langsung submit dengan status yang ada

        const currentStatus = form.getValues("status");
        if (currentStatus === "approved") {
            form.setValue("bupot_status", "perbaikan");
            console.log("Status approved - set bupot_status ke perbaikan");
        }
        form.handleSubmit(onSubmit)();
    }

    return (
        <Authenticated>
            <Head title="Edit eBupot BPA2" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("bpa2.notIssued")}>
                                    eBupot BPA2 Belum Terbit
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Edit eBupot BPA2
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Edit eBupot BPA2
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <File size={16} />
                                    <h3 className="font-medium">
                                        Informasi Umum
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldsGeneralInformation
                                        form={form}
                                        objects={objects}
                                        user={user}
                                        bupots={bupots}
                                        isEditMode={true}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Banknote size={16} />
                                    <h3 className="font-medium">
                                        Penghasilan Bruto
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldGrossIncome form={form} />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Banknote size={16} />
                                    <h3 className="font-medium">Pengurang</h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldReducer form={form} />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Banknote size={16} />
                                    <h3 className="font-medium">
                                        Penghitungan PPh Pasal 21
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldPph21 form={form} />
                                </div>

                                <Button
                                    type="button"
                                    className="mr-2"
                                    onClick={handleSubmitPreserveStatus}
                                >
                                    Simpan
                                </Button>
                                {bupot.status === "draft" && (
                                    <Button
                                        type="button"
                                        onClick={() => handleSubmitWithStatus("draft")}
                                    >
                                        Simpan Draf
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}