import { Button } from "@/Components/ui/button";
import { Form } from "@/Components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { File, Sheet, UserPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import FormFieldsTransactionDocument from "./FormFieldsTransactionDocument";
import FormFieldBuyerInformation from "./FormFieldsBuyerInformation";
import FormFieldTransactionDetail from "./FormFieldsTransactionDetail";
import toast from "react-hot-toast";

const formSchema = z.object({
    id: z.string().uuid(),
    transaction_id: z.number().int(),
    transaction_code: z.string(),
    invoice_number: z.string(),
    invoice_date: z.date(),
    invoice_period: z.string(),
    invoice_year: z.string(),
    invoice_reference: z.string(),
    customer_id: z.string(),
    customer_name: z.string(),
    customer_address: z.string(),
    customer_email: z.string(),
    dpp: z.number(),
    dpp_lain: z.number(),
    ppn: z.number(),
    ppnbm: z.number(),
    dpp_split: z.number(),
    ppn_split: z.number(),
    ppnbm_split: z.number(),
    correction_number: z.number().int().max(127),
    type: z.enum(["keluaran", "masukan"]),
    status: z.enum([
        "created",
        "approved",
        "canceled",
        "deleted",
        "amanded",
        "credited",
        "uncredited",
    ]),
    payment_type: z.enum(["lunas", "uang muka", "pelunasan"]),
});

export default function FormCreateInputInvoice({ invoiceCount }: any) {
    const defaultId = uuidv4();
    const [items, setItems] = useState<any[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultId,
            transaction_code: "01",
            transaction_id: 1,
            invoice_reference: "",
            customer_email: "customer@biinspira.co.id",
            dpp: 0,
            dpp_lain: 0,
            ppn: 0,
            ppnbm: 0,
            dpp_split: 0,
            ppn_split: 0,
            ppnbm_split: 0,
            correction_number: 0,
            type: "masukan",
            payment_type: "lunas",
            status: "approved",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const invoiceNumberPrefix = values.invoice_number.substring(0, 2);

        const transactionId = parseInt(invoiceNumberPrefix, 10);
        if (isNaN(transactionId) || transactionId < 1 || transactionId > 10) {
            toast.error("Nomor faktur tidak valid!");
            return;
        }

        const formattedValues = {
            ...values,
            transaction_code: invoiceNumberPrefix,
            transaction_id: transactionId,
            invoice_date: format(values.invoice_date, "yyyy-MM-dd"),
            items: items.length > 0 ? items : [],
        };

        router.post(route("invoice.store"), formattedValues);
    }

    return (
        <Authenticated>
            <Head title="Tambah Faktur Pajak Masukan" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("invoice.input")}>
                                    Pajak Masukan
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Tambah Faktur Pajak Masukan
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Tambah Faktur Pajak Masukan
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <File size={16} />
                                    <h3 className="font-medium">
                                        Dokumen Transaksi
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldsTransactionDocument
                                        form={form}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <UserPen size={16} />
                                    <h3 className="font-medium">
                                        Informasi Penjual
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldBuyerInformation form={form} />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Sheet size={16} />
                                    <h3 className="font-medium">
                                        Detail Transaksi
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldTransactionDetail
                                        form={form}
                                        isEditMode={false}
                                    />
                                </div>
                                <Button type="submit">Kirim</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
