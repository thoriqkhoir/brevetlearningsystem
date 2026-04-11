import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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

const formSchema = z.object({
    id: z.string().uuid(),
    event_id: z.number().int(),
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Email tidak valid"),
    phone_number: z.string().min(1, "Nomor telepon harus diisi"),
    role: z.enum(["admin", "pengguna", "pengajar"]),
    institution: z.string(),
    max_class: z.number().int().min(1, "Jumlah kelas minimal 1"),
    max_test: z.number().int().min(1, "Jumlah ujian minimal 1"),
    email_verified_at: z.string().nullable(),
    password: z.string().min(8, "Password minimal 8 karakter"),
    last_login_at: z.date().nullable(),
    last_logout_at: z.date().nullable(),
    access_rights: z.array(z.enum(["efaktur", "ebupot"])).nullable(),
});

export default function FormCreateTeacher() {
    const defaultId = uuidv4();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultId,
            event_id: 1,
            name: "",
            email: "",
            phone_number: "",
            password: "12345678",
            role: "pengajar",
            institution: "",
            max_class: 1,
            max_test: 1,
            email_verified_at: null,
            last_login_at: null,
            last_logout_at: null,
            access_rights: ["efaktur", "ebupot"],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
            password: values.phone_number,
        };

        console.log(formattedValues);

        router.post(route("admin.storeTeacher"), formattedValues, {
            onError: (errors) => {
                if (errors.email) {
                    form.setError("email", {
                        type: "manual",
                        message: "Email sudah digunakan",
                    });
                }

                if (errors.phone_number) {
                    form.setError("phone_number", {
                        type: "manual",
                        message: "Input Nomor Telepon Salah",
                    });
                }
            },
        });
    }

    return (
        <AdminLayout>
            <Head title="Tambah Pengajar" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("admin.teachers")}>
                                    Daftar Pengajar
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tambah Pengajar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Tambah Pengajar
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={16} />
                                    <h3 className="font-medium">
                                        Identitas Pengajar
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama*
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
                                            name="email"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email*
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
                                            name="phone_number"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            No Telepon*
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
                                            name="phone_number"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Password*
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
                                        <FormField
                                            control={form.control}
                                            name="institution"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Instansi*
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
                                            name="max_class"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jumlah Maksimal
                                                            Kelas*
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                value={
                                                                    field.value ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        e.target
                                                                            .value ===
                                                                            ""
                                                                            ? ""
                                                                            : Number(
                                                                                  e
                                                                                      .target
                                                                                      .value
                                                                              )
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="max_test"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jumlah Maksimal
                                                            Ujian*
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                value={
                                                                    field.value ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        e.target
                                                                            .value ===
                                                                            ""
                                                                            ? ""
                                                                            : Number(
                                                                                  e
                                                                                      .target
                                                                                      .value
                                                                              )
                                                                    )
                                                                }
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
