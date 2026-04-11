import { Button } from "@/Components/ui/button";
import { Form } from "@/Components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
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
import FormFieldsIncomeTax from "./FormFieldGrossIncome";
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
    customer_address: z.string().min(1, "Alamat wajib diisi").max(255), // ← SAMA DENGAN CREATE
    customer_passport: z.string().max(255).optional().or(z.literal("")),
    customer_country: z.string().min(1, "Negara wajib diisi").max(255),
    customer_gender: z.string().min(1, "Jenis kelamin wajib diisi").max(255),
    customer_ptkp: z.string().min(1, "Status PTKP wajib diisi").max(255),
    customer_position: z.string().min(1, "Posisi wajib diisi").max(255),
    tax_type: z.string().min(1, "Jenis pajak wajib diisi").max(255),
    tax_code: z.string().min(1, "Kode pajak wajib diisi").max(255),
    bupot_types: z.string().min(1, "Jenis pemotongan wajib diisi").max(255),
    basic_salary: z.number().optional(),
    is_gross: z.boolean().optional(),
    tax_allowance: z.number().optional(),
    other_allowance: z.number().optional(),
    honorarium: z.number().optional(),
    premi: z.number().optional(),
    in_kind_acceptance: z.number().optional(),
    tantiem: z.number().optional(),
    gross_income_amount: z.number().optional(),
    position_allowance: z.number().optional(),
    pension_contribution: z.number().optional(),
    zakat: z.number().optional(),
    amount_of_reduction: z.number().optional(),
    neto: z.number().optional(),
    before_neto: z.number().optional(),
    total_neto: z.number().optional(),
    non_taxable_income: z.number().optional(),
    taxable_income: z.number().optional(),
    pph_taxable_income: z.number().optional(),
    pph_owed: z.number().optional(),
    pph_deducted: z.number().optional(),
    pph_deducted_withholding: z.number().optional(),
    pph_government: z.number().optional(),
    pph_desember: z.number().optional(),
    facility: z.enum([
        "tanpa fasilitas",
        "ditanggung pemerintah",
        "fasilitas lain",
    ]),
    kap: z.string().optional().or(z.literal("")), // ← SAMA DENGAN CREATE
    nitku: z.string().optional().or(z.literal("")), // ← SAMA DENGAN CREATE
    status: z.enum([
        "created",
        "approved",
        "canceled",
        "deleted",
        "draft",
    ]),
});

export default function FormEditBPA1({ user, bupot, objects, ter }: any) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...bupot,
            object_id: bupot.object_id || 0,
            is_more: bupot.is_more || "tidak",
            start_period: bupot.start_period || "",
            end_period: bupot.end_period || "",
            bupot_status: bupot.bupot_status || "normal",
            customer_id: bupot.customer_id || "",
            customer_name: bupot.customer_name || "",
            customer_address: bupot.customer_address || "-",
            customer_passport: bupot.customer_passport || "",
            customer_country: bupot.customer_country || "Indonesia",
            customer_gender: bupot.customer_gender || "",
            customer_ptkp: bupot.customer_ptkp || "",
            customer_position: bupot.customer_position || "",
            tax_type: bupot.tax_type || "",
            tax_code: bupot.tax_code || "",
            bupot_types: bupot.bupot_types || "",
            basic_salary: bupot.basic_salary || 0,
            is_gross: bupot.is_gross || false,
            tax_allowance: bupot.tax_allowance || 0,
            other_allowance: bupot.other_allowance || 0,
            honorarium: bupot.honorarium || 0,
            premi: bupot.premi || 0,
            in_kind_acceptance: bupot.in_kind_acceptance || 0,
            tantiem: bupot.tantiem || 0,
            gross_income_amount: bupot.gross_income_amount || 0,
            position_allowance: bupot.position_allowance || 0,
            pension_contribution: bupot.pension_contribution || 0,
            zakat: bupot.zakat || 0,
            amount_of_reduction: bupot.amount_of_reduction || 0,
            neto: bupot.neto || 0,
            before_neto: bupot.before_neto || 0,
            total_neto: bupot.total_neto || 0,
            non_taxable_income: bupot.non_taxable_income || 0,
            taxable_income: bupot.taxable_income || 0,
            pph_taxable_income: bupot.pph_taxable_income || 0,
            pph_owed: bupot.pph_owed || 0,
            pph_deducted: bupot.pph_deducted || 0,
            pph_deducted_withholding: bupot.pph_deducted_withholding || 0,
            pph_government: bupot.pph_government || 0,
            pph_desember: bupot.pph_desember || 0,
            facility: bupot.facility || "tanpa fasilitas",
            kap: bupot.kap || "411121-100",
            nitku: bupot.nitku || "",
            status: bupot.status || "created",
        },
    });
    
    const { watch, setValue, getValues } = form;
    const customerNpwp = watch("customer_id");
    const currentNitku = watch("nitku");
    const grossIncomeAmount = watch("gross_income_amount");
    const amountOfReduction = watch("amount_of_reduction");
    const neto = watch("neto");
    const totalNeto = watch("total_neto");
    const nonTaxableIncome = watch("non_taxable_income");
    const customerPtkp = watch("customer_ptkp");
    const taxableIncome = watch("taxable_income");
    const pphDeductedWithholding = watch("pph_deducted_withholding");
    const pphGovernment = watch("pph_government");
    
    useEffect(() => {
        console.log("useEffect triggered:");
        console.log("- customerNpwp:", customerNpwp);
        console.log("- user object:", user);
        console.log("- user.name:", user?.name);
        console.log("- user.username:", user?.username);
        console.log("- user.email:", user?.email);
        console.log("- current nitku:", currentNitku);
        
        if (user && customerNpwp && customerNpwp.trim() !== "") {
            const username = user.username || user.name || user.email?.split('@')[0] || 'user';
            const nitku = `${customerNpwp} - ${username}`;
            console.log("Setting NITKU to:", nitku);
            
            setTimeout(() => {
                setValue("nitku", nitku);
            }, 100);
        } else if (!customerNpwp || customerNpwp.trim() === "") {
            console.log("Clearing NITKU");
            setTimeout(() => {
                setValue("nitku", "");
            }, 100);
        }
    }, [customerNpwp, user, setValue]);

    useEffect(() => {
        if (grossIncomeAmount && grossIncomeAmount > 0) {
            const calculatedAllowance = Math.round(grossIncomeAmount * 0.05);
            const positionAllowance = Math.min(calculatedAllowance, 6000000);
            console.log("Calculating position allowance:", {
                grossIncomeAmount,
                calculatedAllowance,
                positionAllowance: positionAllowance,
                isMaxed: calculatedAllowance > 6000000
            });
            setValue("position_allowance", positionAllowance);
        } else {
            setValue("position_allowance", 0);
        }
    }, [grossIncomeAmount, setValue]);

    useEffect(() => {
        const gross = grossIncomeAmount || 0;
        const reduction = amountOfReduction || 0;
        const netoValue = gross - reduction;
        
        console.log("Calculating neto:", {
            grossIncomeAmount: gross,
            amountOfReduction: reduction,
            neto: netoValue
        });
        
        setValue("neto", netoValue);
    }, [grossIncomeAmount, amountOfReduction, setValue]);
    
    useEffect(() => {
        const netoValue = neto || 0;
        
        console.log("Setting total_neto:", {
            neto: netoValue,
            total_neto: netoValue
        });
        
        setValue("total_neto", netoValue);
    }, [neto, setValue]);

    // ← TAMBAHKAN MATH.MAX DAN MATH.FLOOR SEPERTI DI CREATE
    useEffect(() => {
        const totalNetoValue = totalNeto || 0;
        const nonTaxableValue = nonTaxableIncome || 0;
        const calculatedTaxableIncome = Math.max(0, totalNetoValue - nonTaxableValue);

        const taxableIncome = Math.floor(calculatedTaxableIncome / 1000) * 1000;
        
        console.log("Calculating taxable_income:", {
            total_neto: totalNetoValue,
            non_taxable_income: nonTaxableValue,
            calculated: calculatedTaxableIncome,
            taxable_income_rounded: taxableIncome
        });
        
        setValue("taxable_income", taxableIncome);
    }, [totalNeto, nonTaxableIncome, setValue]);

    useEffect(() => {
        const ptkp = customerPtkp;
        
        console.log("Auto-filling non_taxable_income based on PTKP:", {
            ptkp
        });

        if (!ptkp) {
            setValue("non_taxable_income", 0);
            return;
        }

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
        
        console.log("Setting non_taxable_income:", {
            ptkp,
            nonTaxableAmount
        });
        
        setValue("non_taxable_income", nonTaxableAmount);
    }, [customerPtkp, setValue]);

    useEffect(() => {
        const pkp = taxableIncome || 0;
        
        console.log("Calculating pph_taxable_income using PS17 tax:", {
            taxable_income: pkp
        });

        if (pkp <= 0) {
            setValue("pph_taxable_income", 0);
            setValue("pph_owed", 0);
            setValue("pph_deducted_withholding", 0);
            return;
        }

        const pphAmount = calculatePS17Tax(pkp);
        
        console.log("PS17 Tax Calculation Result:", {
            taxable_income: pkp,
            pph_taxable_income: pphAmount
        });
        
        setValue("pph_taxable_income", pphAmount);
        setValue("pph_owed", pphAmount);
        setValue("pph_deducted_withholding", pphAmount);
    }, [taxableIncome, setValue]);

    useEffect(() => {
        const deductedWithholding = pphDeductedWithholding || 0;
        const government = pphGovernment || 0;
        const pphDesember = deductedWithholding - government;
        
        console.log("Calculating pph_desember:", {
            pph_deducted_withholding: deductedWithholding,
            pph_government: government,
            pph_desember: pphDesember
        });
        
        setValue("pph_desember", pphDesember);
    }, [pphDeductedWithholding, pphGovernment, setValue]);

    // ← SAMA DENGAN CREATE: tambahkan console log dan validasi
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("=== FORM SUBMISSION STARTED ===");
        console.log("Data yang dikirim:", values); 
        console.log("Status:", values.status);
        
        // ← TAMBAHKAN INI SEPERTI DI CREATE
        if (!values.customer_address || values.customer_address.trim() === "") {
            values.customer_address = "-";
        }

        if (!values.customer_passport || values.customer_passport.trim() === "") {
            values.customer_passport = "-";
        }

        const result = formSchema.safeParse(values);
        
        console.log("Validation result:", result);
        
        if (!result.success) {
            console.error("❌ VALIDATION FAILED!");
            console.error("Validation errors:", result.error.flatten());
            console.error("Field errors:", result.error.issues);
            return;
        }
        
        console.log("✅ Validation passed, sending to backend...");
        
        router.put(route("bpa1.update", bupot.id), values, {
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

    // ← SAMA DENGAN CREATE
    function handleSubmitWithStatus(status: "created" | "draft") {
        console.log(`=== ${status.toUpperCase()} BUTTON CLICKED ===`);
        
        form.setValue("status", status);
        console.log("Status set to:", status);
        
        const values = form.getValues();
        console.log("All form values:", values);
        
        form.handleSubmit(onSubmit)();
    }

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
            <Head title="Edit eBupot BPA1" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("bpa1.notIssued")}>
                                    eBupot BPA1 Belum Terbit
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Edit eBupot BPA1
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Edit eBupot BPA1
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
                                        bupots={[]}
                                        isEditMode={true}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Banknote size={16} />
                                    <h3 className="font-medium">
                                        Penghasilan Bruto {/* ← SAMA DENGAN CREATE */}
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldsIncomeTax
                                        form={form}
                                        objects={objects}
                                        user={user}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Banknote size={16} />
                                    <h3 className="font-medium">
                                        Pengurang
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldReducer
                                        form={form}
                                        objects={objects}
                                        user={user}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Banknote size={16} />
                                    <h3 className="font-medium">
                                        Penghitungan PPh Pasal 21 {/* ← SAMA DENGAN CREATE */}
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldPph21
                                        form={form}
                                        objects={objects}
                                        user={user}
                                    />
                                </div>
                                {/* ← UBAH TOMBOL SEPERTI DI CREATE */}
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