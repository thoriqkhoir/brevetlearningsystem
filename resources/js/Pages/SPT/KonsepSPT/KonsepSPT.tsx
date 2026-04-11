"use client";

import { columns } from "@/Components/layout/SPT/columns";
import { DataTableSPT } from "@/Components/layout/SPT/data-table";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { File, FileText, FileX, Plus, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function KonsepSPT({ spts }: any) {
    const { flash }: any = usePage().props;
    const [initialSpts, setInitialSpts] = useState(spts);

    useEffect(() => {
        setInitialSpts(spts);
    }, [spts]);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const handleRefresh = () => {
        router.get(
            route("spt.konsep"),
            {},
            {
                onSuccess: (page) => {
                    setInitialSpts(page.props.spts);
                },
            },
        );
    };

    return (
        <Authenticated>
            <Head title="Konsep SPT" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Konsep SPT
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("spt.create")}>
                                    <Plus />
                                    Buat Konsep SPT
                                </Link>
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                className="bg-yellow-400 text-primary hover:bg-yellow-400/90 hover:text-primary"
                                onClick={handleRefresh}
                            >
                                <RefreshCcw />
                            </Button>
                            <Button
                                className="bg-zinc-400 hover:bg-zinc-400/90"
                                disabled
                            >
                                <File />
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-600/90"
                                disabled
                            >
                                <FileX />
                            </Button>
                            <Button
                                className="bg-destructive hover:bg-destructive/90"
                                disabled
                            >
                                <FileText />
                            </Button>
                        </div>
                        <DataTableSPT columns={columns} data={initialSpts} />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
