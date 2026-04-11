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
import { Wallet } from "lucide-react";
import { DataTableBank } from "@/Components/layout/Bank/data-table";
import { columns, type BankColumns } from "@/Components/layout/Bank/columns";
import toast from "react-hot-toast";

export default function Index(props: { banks: BankColumns[] }) {
    const { flash }: any = usePage().props;
    const { banks } = props;

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
            <Head title="Bank Saya" />

            <div className="py-8 mx-auto lg:px-4 max-w-full overflow-hidden">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-full">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("dashboard")}>Dashboard</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Bank Saya</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <h1 className="text-2xl font-semibold text-primary">
                            Bank Saya
                        </h1>

                        <Button asChild>
                            <Link href={route("banks.create")}>
                                Tambah Bank
                            </Link>
                        </Button>
                    </div>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border max-w-full overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet size={16} />
                            <h3 className="font-medium">
                                Daftar Rekening Bank
                            </h3>
                        </div>

                        <div className="p-6 rounded-xl bg-white border overflow-x-auto max-w-full">
                            <DataTableBank columns={columns} data={banks} />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
