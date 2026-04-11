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
import { Check, ChevronsUpDown, User } from "lucide-react";
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
import InputMask from "react-input-mask";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { useState } from "react";

const formSchema = z.object({
    id: z.string().uuid(),
    event_id: z.number().int(),
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Email tidak valid"),
    phone_number: z.string().min(1, "Nomor telepon harus diisi"),
    role: z.enum(["admin", "pengguna"]),
    email_verified_at: z.string().nullable(),
    password: z.string().min(8, "Password minimal 8 karakter"),
    npwp: z.string().regex(/^\d{16}$/, "NPWP harus diisi 16 digit angka"),
    address: z.string().nullable(),
    last_login_at: z.date().nullable(),
    last_logout_at: z.date().nullable(),
    access_rights: z.array(z.enum(["efaktur", "ebupot"])).nullable(),
});

export default function FormCreateUser({ events }: any) {
    const defaultId = uuidv4();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultId,
            event_id: 1,
            name: "",
            email: "",
            phone_number: "",
            password: "12345678",
            role: "pengguna",
            npwp: "",
            address: "Malang",
            email_verified_at: null,
            last_login_at: null,
            last_logout_at: null,
            access_rights: [],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
            password: values.phone_number,
        };

        router.post(route("admin.store"), formattedValues, {
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
            <Head title="Tambah Pengguna" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("admin.users")}>
                                    Daftar Pengguna
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tambah Pengguna</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Tambah Pengguna
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={16} />
                                    <h3 className="font-medium">
                                        Identitas Pengguna
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
                                            name="npwp"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            NPWP*
                                                        </FormLabel>
                                                        <FormControl>
                                                            <InputMask
                                                                mask="9999999999999999"
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={
                                                                    field.onChange
                                                                }
                                                                autoComplete="off"
                                                            >
                                                                {(
                                                                    inputProps
                                                                ) => (
                                                                    <Input
                                                                        {...inputProps}
                                                                    />
                                                                )}
                                                            </InputMask>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat*
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={
                                                                    field.value ||
                                                                    ""
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        {/* <FormField
                                            control={form.control}
                                            name="access_rights"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Hak Akses
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="flex flex-col gap-2">
                                                                <label className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            "efaktur"
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            const newValue =
                                                                                checked
                                                                                    ? [
                                                                                          ...(field.value ||
                                                                                              []),
                                                                                          "efaktur",
                                                                                      ]
                                                                                    : field.value?.filter(
                                                                                          (
                                                                                              v
                                                                                          ) =>
                                                                                              v !==
                                                                                              "efaktur"
                                                                                      );
                                                                            field.onChange(
                                                                                newValue
                                                                            );
                                                                        }}
                                                                    />
                                                                    <span>
                                                                        e-Faktur
                                                                    </span>
                                                                </label>
                                                                <label className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            "ebupot"
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            const newValue =
                                                                                checked
                                                                                    ? [
                                                                                          ...(field.value ||
                                                                                              []),
                                                                                          "ebupot",
                                                                                      ]
                                                                                    : field.value?.filter(
                                                                                          (
                                                                                              v
                                                                                          ) =>
                                                                                              v !==
                                                                                              "ebupot"
                                                                                      );
                                                                            field.onChange(
                                                                                newValue
                                                                            );
                                                                        }}
                                                                    />
                                                                    <span>
                                                                        eBupot
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        /> */}
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
                                            name="event_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Event*
                                                    </FormLabel>
                                                    <Popover
                                                        open={isPopoverOpen}
                                                        onOpenChange={
                                                            setIsPopoverOpen
                                                        }
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "w-full justify-between",
                                                                        !field.value &&
                                                                            "text-muted-foreground",
                                                                        "whitespace-normal break-words"
                                                                    )}
                                                                >
                                                                    <span className="truncate">
                                                                        {field.value
                                                                            ? events.find(
                                                                                  (
                                                                                      event: any
                                                                                  ) =>
                                                                                      event.id ===
                                                                                      field.value
                                                                              )
                                                                                  ?.name
                                                                            : "Pilih Event"}
                                                                    </span>
                                                                    <ChevronsUpDown className="opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0">
                                                            <Command>
                                                                <CommandInput
                                                                    placeholder="Cari Event..."
                                                                    className="h-9"
                                                                />
                                                                <CommandList>
                                                                    <CommandEmpty>
                                                                        Tidak
                                                                        ada
                                                                        event
                                                                        yang
                                                                        tersedia.
                                                                    </CommandEmpty>
                                                                    <CommandGroup>
                                                                        {events?.length >
                                                                        0 ? (
                                                                            events.map(
                                                                                (
                                                                                    event: any
                                                                                ) => (
                                                                                    <CommandItem
                                                                                        key={
                                                                                            event.id
                                                                                        }
                                                                                        value={
                                                                                            event.id
                                                                                        }
                                                                                        onSelect={() => {
                                                                                            field.onChange(
                                                                                                event.id
                                                                                            );
                                                                                            setIsPopoverOpen(
                                                                                                false
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            event.name
                                                                                        }
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "ml-auto",
                                                                                                event.id ===
                                                                                                    field.value
                                                                                                    ? "opacity-100"
                                                                                                    : "opacity-0"
                                                                                            )}
                                                                                        />
                                                                                    </CommandItem>
                                                                                )
                                                                            )
                                                                        ) : (
                                                                            <CommandItem value="">
                                                                                Tidak
                                                                                ada
                                                                                event
                                                                                yang
                                                                                tersedia.
                                                                            </CommandItem>
                                                                        )}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormDescription>
                                                        Tambahkan Event di
                                                        Halaman Daftar Event
                                                        jika event yang Anda
                                                        cari tidak ada.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
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
