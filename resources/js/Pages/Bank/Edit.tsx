import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Form } from "@/Components/ui/form";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Wallet } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormFieldsBank from "./FormFieldsBank";
import { bankFormSchema, type BankFormValues } from "./schema";

type Bank = {
    id: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    account_type: "tabungan" | "giro" | "deposito";
    is_primary: boolean;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
};

export default function Edit(props: { bank: Bank }) {
    const { bank } = props;

    const form = useForm<BankFormValues>({
        resolver: zodResolver(bankFormSchema),
        defaultValues: {
            bank_name: bank.bank_name ?? "",
            account_number: bank.account_number ?? "",
            account_name: bank.account_name ?? "",
            account_type: bank.account_type ?? "tabungan",
            is_primary: bank.is_primary ?? false,
            description: bank.description ?? "",
            start_date: bank.start_date ?? "",
            end_date: bank.end_date ?? "",
        },
    });

    function onSubmit(values: BankFormValues) {
        const payload = {
            ...values,
            description: values.description?.trim() || null,
            start_date: values.start_date || null,
            end_date: values.end_date || null,
        };

        router.put(route("banks.update", bank.id), payload);
    }

    return (
        <Authenticated>
            <Head title="Edit Bank" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("dashboard")}>Dashboard</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link href={route("banks")}>Bank Saya</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Edit Bank
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Wallet size={16} />
                                    <h3 className="font-medium">
                                        Informasi Rekening Bank
                                    </h3>
                                </div>

                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldsBank form={form} />
                                </div>

                                <Button type="submit" className="mr-2">
                                    Update
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route("banks")}>Batal</Link>
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
