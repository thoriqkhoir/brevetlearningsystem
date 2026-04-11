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

export default function Create() {
    const form = useForm<BankFormValues>({
        resolver: zodResolver(bankFormSchema),
        defaultValues: {
            bank_name: "",
            account_number: "",
            account_name: "",
            account_type: "tabungan",
            is_primary: false,
            description: "",
            start_date: "",
            end_date: "",
        },
    });

    function onSubmit(values: BankFormValues) {
        const payload = {
            ...values,
            description: values.description?.trim() || null,
            start_date: values.start_date || null,
            end_date: values.end_date || null,
        };

        router.post(route("banks.store"), payload);
    }

    return (
        <Authenticated>
            <Head title="Tambah Bank" />

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
                                <BreadcrumbPage>Tambah</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Tambah Bank
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
                                    Simpan
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
