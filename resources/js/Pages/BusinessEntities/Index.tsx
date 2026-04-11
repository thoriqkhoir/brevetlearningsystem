import React, { useEffect } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Head, Link, usePage } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import { DataTableBusinessEntity } from "@/Components/layout/BusinessEntity/data-table";
import {
    columns,
    type BusinessEntityColumns,
} from "@/Components/layout/BusinessEntity/columns";
import toast from "react-hot-toast";

export default function Index(props: {
    businessEntities: BusinessEntityColumns[];
}) {
    const { flash }: any = usePage().props;
    const { businessEntities } = props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    return (
        <Authenticated>
            <Head title="Badan Usaha" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("dashboard")}>Dashboard</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Badan Usaha</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <h1 className="text-2xl font-semibold text-primary">
                            Badan Usaha
                        </h1>

                        <Button asChild>
                            <Link href={route("business-entities.create")}>
                                Tambah Badan Usaha
                            </Link>
                        </Button>
                    </div>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 size={16} />
                            <h3 className="font-medium">Daftar Badan Usaha</h3>
                        </div>

                        <div className="p-6 rounded-xl bg-white border overflow-hidden">
                            <DataTableBusinessEntity
                                columns={columns}
                                data={businessEntities}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
