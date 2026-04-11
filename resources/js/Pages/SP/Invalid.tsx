import { columns } from "@/Components/layout/Bupot/columns";
import { DataTableBupot } from "@/Components/layout/Bupot/data-table";
import { Button } from "@/Components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { File, FileText, FileX, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Invalid({ bupots }: any) {
    const { flash }: any = usePage().props;
    const [selectedSp, setSelectedSp] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [initialSp, setInitialSp] = useState(bupots);

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
            route("sp.notIssued"),
            {},
            {
                onSuccess: (page) => {
                    setInitialSp(page.props.bupots);
                },
            }
        );
    };

    const handleSelectIds = (ids: string[]) => {
        setSelectedIds(ids);
        const selected = initialSp.filter((bupots: any) =>
            ids.includes(bupots.id)
        );
        setSelectedSp(selected);
    };

    return (
        <Authenticated>
            <Head title="eBupot SP" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        eBupot SP Tidak Valid
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
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
                        <DataTableBupot
                            columns={columns}
                            data={initialSp}
                            setSelectedIds={handleSelectIds}
                        />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
