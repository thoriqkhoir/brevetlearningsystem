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
import { useState, useEffect } from "react";
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
import PasswordVerificationDialog from "@/Components/layout/PasswordConfirmationDialog";

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

export default function FormEditOutputInvoice({
    transactions,
    invoice,
    items,
    itemTransactions,
    unitTransactions,
    invoiceCount,
}: any) {
    const [openModalItem, setOpenModalItem] = useState(false);
    const [openModalCancel, setOpenModalCancel] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState<any[]>(items || []);
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [pendingSubmit, setPendingSubmit] = useState<z.infer<
        typeof formSchema
    > | null>(null);
    const [passwordAction, setPasswordAction] = useState<"approved" | "cancel">(
        "approved"
    );
    const user = usePage().props.auth.user;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...invoice,
            invoice_date: new Date(invoice.invoice_date),
            user_address: user.address,
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
            items: items.map((item: any) => ({
                ...item,
                id: item.id || uuidv4(),
            })),
        },
    });

    useEffect(() => {
        const totalDpp = invoiceItems.reduce((acc, item) => acc + item.dpp, 0);
        const totalDppLain = invoiceItems.reduce(
            (acc, item) => acc + item.dpp_lain,
            0
        );
        const totalPpn = invoiceItems.reduce((acc, item) => acc + item.ppn, 0);
        const totalPpnbm = invoiceItems.reduce(
            (acc, item) => acc + item.ppnbm,
            0
        );

        form.setValue("dpp", totalDpp);
        form.setValue("dpp_lain", totalDppLain);
        form.setValue("ppn", totalPpn);
        form.setValue("ppnbm", totalPpnbm);
    }, [invoiceItems, form]);

    useEffect(() => {
        form.reset({
            ...invoice,
            invoice_number:
                invoice.status === "approved"
                    ? "00.00.00.000-00000000"
                    : invoice.invoice_number,
            invoice_date:
                invoice.status === "approved"
                    ? null
                    : new Date(invoice.invoice_date),
            transaction_id:
                invoice.status === "approved" ? "" : invoice.transaction_id,
            invoice_period:
                invoice.status === "approved" ? "" : invoice.invoice_period,
            invoice_year:
                invoice.status === "approved" ? "" : invoice.invoice_year,
            correction_number:
                invoice.status === "approved"
                    ? invoice.correction_number + 1
                    : invoice.correction_number,
            invoice_reference: "",
            items: items.map((item: any) => ({
                ...item,
                id: item.id || uuidv4(),
            })),
        });
    }, [invoice]);

    function addItem(item: any) {
        setInvoiceItems([
            ...invoiceItems,
            { ...item, tempId: uuidv4(), id: uuidv4() },
        ]);
    }

    function updateItem(updatedItem: any) {
        setInvoiceItems((prevItems) =>
            prevItems.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    }

    function removeItem(id: string) {
        setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
    }

    function removeSelectedItems() {
        setInvoiceItems(
            invoiceItems.filter((item) => !selectedItemIds.includes(item.id))
        );
        setSelectedItemIds([]);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
            invoice_date: format(values.invoice_date, "yyyy-MM-dd"),
            items:
                invoiceItems.length > 0
                    ? invoiceItems.map(({ id, ...rest }) => rest)
                    : [],
        };

        if (invoice.status === "approved") {
            setPasswordAction("approved");
            setPendingSubmit({
                ...formattedValues,
                invoice_date: new Date(formattedValues.invoice_date),
            });
            setOpenPasswordModal(true);
        } else {
            router.put(route("invoice.update", invoice.id), formattedValues);
        }
    }

    const handleCancel = (id: string, password: string) => {
        router.visit(route("invoice.updateStatus", id), {
            method: "put",
            data: {
                status: "canceled",
                password,
            },
        });
    };

    const handlePasswordConfirm = async (password: string) => {
        if (passwordAction === "approved") {
            if (pendingSubmit) {
                router.visit(route("invoice.updateStatus", invoice.id), {
                    method: "put",
                    data: {
                        status: "amanded",
                        password,
                    },
                });

                const newInvoice = {
                    ...pendingSubmit,
                    id: uuidv4(),
                    status: "created",
                    invoice_date: format(
                        pendingSubmit.invoice_date,
                        "yyyy-MM-dd"
                    ),
                };
                router.post(route("invoice.store"), newInvoice);
                setPendingSubmit(null);
            }

            setOpenPasswordModal(false);
        } else if (passwordAction === "cancel") {
            handleCancel(invoice.id, password);
        }
        setOpenPasswordModal(false);
    };

    return (
        <Authenticated>
            <Head title="Edit Faktur Pajak Keluaran" />

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
                                    Edit Faktur Pajak Keluaran
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Edit Faktur Pajak Keluaran
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
                                            invoiceId={invoice.id}
                                            itemTransactions={itemTransactions}
                                            unitTransactions={unitTransactions}
                                            addItem={addItem}
                                        />
                                        <Button
                                            type="button"
                                            variant={"destructive"}
                                            onClick={() =>
                                                setOpenModalItem(true)
                                            }
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
                                        data={invoiceItems}
                                        setSelectedItemIds={setSelectedItemIds}
                                    />
                                </div>
                                {invoice.status !== "created" && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setPasswordAction("cancel");
                                            setOpenModalCancel(true);
                                        }}
                                        variant="destructive"
                                        className="mr-2"
                                    >
                                        Batal
                                    </Button>
                                )}
                                <Button type="submit">Simpan Perubahan</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <PasswordVerificationDialog
                open={openPasswordModal}
                onClose={() => setOpenPasswordModal(false)}
                onConfirm={handlePasswordConfirm}
            />
            <ConfirmDialog
                title="Hapus Item Transaksi"
                description="Apakah Anda yakin ingin menghapus Transaksi yang Anda pilih?"
                open={openModalItem}
                onClose={() => setOpenModalItem(false)}
                onConfirm={() => {
                    removeSelectedItems();
                    setOpenModalItem(false);
                }}
            />
            <ConfirmDialog
                title="Cancel Invoice"
                description="Apakah Anda yakin ingin membatalkan Faktur ini?"
                open={openModalCancel}
                onClose={() => setOpenModalCancel(false)}
                onConfirm={() => {
                    setOpenPasswordModal(true);
                    setOpenModalCancel(false);
                }}
            />
        </Authenticated>
    );
}
