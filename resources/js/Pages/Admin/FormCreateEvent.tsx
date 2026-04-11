import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { CalendarFold } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import { useEffect } from "react";

const formSchema = z.object({
    code: z.string(),
    name: z.string().min(1, "Nama event harus diisi"),
});

export default function FormCreateEvent({ eventCount }: any) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            name: "",
        },
    });

    const nameValue = form.watch("name");

    useEffect(() => {
        if (nameValue) {
            const words = nameValue.split(" ");
            const initials = words
                .slice(0, 3)
                .map((word) => word[0]?.toUpperCase() || "");
            while (initials.length < 3) {
                initials.push(initials[initials.length - 1] || "A");
            }
            const letters = initials.join("");

            const number = String(eventCount + 1).padStart(3, "0");

            const code = `${letters}${number}`;
            form.setValue("code", code);
        }
    }, [nameValue, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
        };

        router.post(route("admin.storeEvent"), formattedValues);
    }

    return (
        <AdminLayout>
            <Head title="Tambah Event" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("admin.events")}>
                                    Daftar Event
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tambah Event</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Tambah Event
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <CalendarFold size={16} />
                                    <h3 className="font-medium">
                                        Detail Event
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Event*
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="code"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode Event*
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button type="submit">Simpan</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
