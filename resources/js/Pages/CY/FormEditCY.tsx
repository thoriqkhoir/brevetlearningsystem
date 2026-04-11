import { Button } from "@/Components/ui/button";
import { Form } from "@/Components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Banknote, BookMarked, File } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import FormFieldsGeneralInformation from "./FormFieldsGeneralInformation";
import FormFieldsIncomeTax from "./FormFieldIncomeTax";
import FormFieldsReferenceDocument from "./FormFieldReferenceDocument";

const formSchema = z.object({
    id: z.string().uuid(),
    object_id: z.number().int(),
    bupot_period: z.string(),
    bupot_year: z.string(),
    bupot_status: z.enum(["normal", "perbaikan"]),
    customer_id: z.string().min(16).max(16),
    customer_name: z.string(),
    customer_nitku: z.string(),
    facility: z.enum([
        "fasilitas lainnya",
        "pph ditanggung pemerintah",
        "tanpa fasilitas",
    ]),
    tax_type: z.string(),
    tax_code: z.string(),
    tax_nature: z.string(),
    dpp: z.number(),
    rates: z.number(),
    tax: z.number(),
    kap: z.string(),
    doc_type: z.string(),
    doc_no: z.string(),
    doc_date: z.date(),
    nitku: z.string(),
    status: z.enum([
        "created",
        "approved",
        "canceled",
        "deleted",
        "amanded",
        "draft",
    ]),
});

export default function FormEditCY({ user, bupot, objects }: any) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...bupot,
            doc_date: new Date(bupot.doc_date),
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
            doc_date: format(values.doc_date, "yyyy-MM-dd"),
        };

        router.put(route("cy.update", bupot.id), formattedValues);
    }

    function handleSetStatus(status: any) {
        form.setValue("status", status);
    }

    return (
        <Authenticated>
            <Head title="Edit eBupot CY" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("cy.notIssued")}>
                                    CY Belum Terbit
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit eBupot CY</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Edit eBupot CY
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
                                        isEditMode={true}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Banknote size={16} />
                                    <h3 className="font-medium">
                                        Pajak Penghasilan (Rp)
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldsIncomeTax
                                        form={form}
                                        objects={objects}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <BookMarked size={16} />
                                    <h3 className="font-medium">
                                        Dokumen Referensi
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldsReferenceDocument
                                        form={form}
                                        user={user}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="mr-2"
                                    onClick={() => handleSetStatus("created")}
                                >
                                    Simpan
                                </Button>
                                {bupot.status === "draft" && (
                                    <Button
                                        type="submit"
                                        onClick={() => handleSetStatus("draft")}
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
