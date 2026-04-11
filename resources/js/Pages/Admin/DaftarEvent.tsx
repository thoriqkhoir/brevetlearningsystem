import { columns } from "@/Components/layout/Event/columns";
import { DataTableEvent } from "@/Components/layout/Event/data-table";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { CalendarPlus, RefreshCcw, Trash, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DaftarEvent({ events }: any) {
    const { flash }: any = usePage().props;
    const [initialEvents, setInitialEvents] = useState(events);

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
            route("admin.events"),
            {},
            {
                onSuccess: (page) => {
                    setInitialEvents(page.props.events);
                },
            }
        );
    };

    return (
        <AdminLayout>
            <Head title="Daftar Event" />

            <div className="py-8 mx-auto max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Daftar Event
                    </h1>

                    <div className="p-5 md:p-8 rounded-xl bg-sidebar border">
                        <div className="flex flex-col lg:flex-row gap-2 mb-2"></div>
                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                            <Button asChild>
                                <Link href={route("admin.createEvent")}>
                                    <CalendarPlus />
                                    Tambah Event
                                </Link>
                            </Button>
                            <Button
                                className="bg-yellow-400 text-primary hover:bg-yellow-400/90 hover:text-primary"
                                onClick={handleRefresh}
                            >
                                <RefreshCcw />
                            </Button>
                        </div>
                        <DataTableEvent
                            columns={columns}
                            data={initialEvents}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
