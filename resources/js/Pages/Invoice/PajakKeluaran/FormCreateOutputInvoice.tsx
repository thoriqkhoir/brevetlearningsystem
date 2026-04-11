import { columns } from "@/Components/layout/InvoiceItems/columns";
import { DataTableInvoiceItems } from "@/Components/layout/InvoiceItems/data-table";
import { Button } from "@/Components/ui/button";
import { Form } from "@/Components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { File, Sheet, Trash, UserPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import FormCreateTransactionItems from "./FormCreateTransactionItems";
import { useEffect, useState } from "react";
import FormFieldsTransactionDocument from "./FormFieldsTransactionDocument";
import FormFieldBuyerInformation from "./FormFieldBuyerInformation";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

const formSchema = z.object({
    id: z.string().uuid(),
    transaction_id: z.number().int(),
    transaction_code: z.string(),
    invoice_number: z.string(),
    invoice_date: z.date(),
    invoice_period: z.string(),
    invoice_year: z.string(),
    invoice_reference: z.string(),
    user_address: z.string(),
    customer_id_type: z.enum(["tin", "passport", "national_id", "other_id"]),
    country: z.string(),
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
    status: z.enum(["created", "approved", "canceled", "deleted", "amanded"]),
    payment_type: z.enum(["lunas", "uang muka", "pelunasan"]),
});

export default function FormOutputInvoice({
    transactions,
    itemTransactions,
    unitTransactions,
    invoiceCount,
}: any) {
    const defaultId = uuidv4();
    const [openModal, setOpenModal] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const user = usePage().props.auth.user;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultId,
            invoice_number: "00.00.00.000-00000000",
            user_address: user.address || "",
            invoice_reference: "",
            customer_id_type: "tin",
            country: "indonesia",
            dpp: 0,
            dpp_lain: 0,
            ppn: 0,
            ppnbm: 0,
            dpp_split: 0,
            ppn_split: 0,
            ppnbm_split: 0,
            correction_number: 0,
            type: "keluaran",
            status: "created",
        },
    });

    const selectedTransactionId = form.watch("transaction_id");
    const selectedTransaction = transactions.find(
        (t: any) => t.id === selectedTransactionId
    );
    const selectedTransactionCode = selectedTransaction?.code;

    useEffect(() => {
        const totalDpp = items.reduce((acc, item) => acc + item.dpp, 0);
        const totalDppLain = items.reduce(
            (acc, item) => acc + item.dpp_lain,
            0
        );
        const totalPpn = items.reduce((acc, item) => acc + item.ppn, 0);
        const totalPpnbm = items.reduce((acc, item) => acc + item.ppnbm, 0);

        form.setValue("dpp", totalDpp);
        form.setValue("dpp_lain", totalDppLain);
        form.setValue("ppn", totalPpn);
        form.setValue("ppnbm", totalPpnbm);
    }, [items, form]);

    function addItem(item: any) {
        setItems([...items, { ...item, id: uuidv4() }]);
    }

    function updateItem(updatedItem: any) {
        setItems(
            items.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    }

    function removeItem(id: string) {
        setItems(items.filter((item) => item.id !== id));
    }

    function removeSelectedItems() {
        setItems(items.filter((item) => !selectedItemIds.includes(item.id)));
        setSelectedItemIds([]);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
            invoice_date: format(values.invoice_date, "yyyy-MM-dd"),
            items: items.length > 0 ? items : [],
        };

        router.post(route("invoice.store"), formattedValues);
    }

    return (
        <Authenticated>
            <Head title="Tambah Faktur Pajak Keluaran" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("invoice.output")}>
                                    Pajak Keluaran
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Buat Faktur Pajak Keluaran
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Buat Faktur Pajak Keluaran
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
                                        transactions={transactions}
                                        invoiceCount={invoiceCount}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <UserPen size={16} />
                                    <h3 className="font-medium">
                                        Data Pembeli
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldBuyerInformation form={form} />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Sheet size={16} />
                                    <h3 className="font-medium">
                                        Data Barang / Jasa
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4 max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl">
                                    <div className="flex flex-col lg:flex-row gap-2 mb-2">
                                        <FormCreateTransactionItems
                                            invoiceId={defaultId}
                                            itemTransactions={itemTransactions}
                                            unitTransactions={unitTransactions}
                                            addItem={addItem}
                                            selectedTransactionCode={
                                                selectedTransactionCode
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant={"destructive"}
                                            onClick={() => setOpenModal(true)}
                                            disabled={
                                                selectedItemIds.length === 0
                                            }
                                        >
                                            <Trash />
                                            Hapus Item
                                        </Button>
                                    </div>
                                    <DataTableInvoiceItems
                                        columns={columns(
                                            removeItem,
                                            updateItem,
                                            itemTransactions,
                                            unitTransactions
                                        )}
                                        data={items}
                                        setSelectedItemIds={setSelectedItemIds}
                                    />
                                </div>
                                <Button type="submit">Kirim</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                title="Hapus Item Transaksi"
                description="Apakah Anda yakin ingin menghapus Transaksi yang Anda pilih?"
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => {
                    removeSelectedItems();
                    setOpenModal(false);
                }}
            />
        </Authenticated>
    );
}
