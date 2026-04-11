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
import { Building2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormFieldsBusinessEntity from "./FormFieldsBusinessEntity";
import {
    businessEntityFormSchema,
    type BusinessEntityFormValues,
} from "./schema";

export default function Create() {
    const form = useForm<BusinessEntityFormValues>({
        resolver: zodResolver(businessEntityFormSchema),
        defaultValues: {
            name: "",
            npwp: "",
            address: "",
        },
    });

    function onSubmit(values: BusinessEntityFormValues) {
        const payload = {
            ...values,
            npwp: values.npwp.replace(/\D/g, ""),
            address: values.address?.trim() ? values.address.trim() : null,
        };

        router.post(route("business-entities.store"), payload);
    }

    return (
        <Authenticated>
            <Head title="Tambah Badan Usaha" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("dashboard")}>Dashboard</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link href={route("business-entities.index")}>
                                    Badan Usaha
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tambah</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Tambah Badan Usaha
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Building2 size={16} />
                                    <h3 className="font-medium">
                                        Informasi Badan Usaha
                                    </h3>
                                </div>

                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <FormFieldsBusinessEntity form={form} />
                                </div>

                                <Button type="submit" className="mr-2">
                                    Simpan
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link
                                        href={route("business-entities.index")}
                                    >
                                        Batal
                                    </Link>
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
