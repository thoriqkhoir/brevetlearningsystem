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
import TeacherLayout from "@/Layouts/TeacherLayout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Input } from "@/Components/ui/input";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputMask from "react-input-mask";
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
    event_id: z.number().int(),
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Email tidak valid"),
    phone_number: z.string().min(8, "Nomor telepon minimal 8 digit"),
    npwp: z.string().regex(/^\d{16}$/, "NPWP harus diisi 16 digit angka"),
    address: z.string().min(1, "Alamat harus diisi"),
});

export default function FormEditParticipant({ participant, events = [] }: any) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            event_id: participant?.event_id ?? 0,
            name: participant?.name || "",
            email: participant?.email || "",
            phone_number: participant?.phone_number || "",
            npwp: participant?.npwp || "",
            address: participant?.address || "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.put(route("teacher.updateParticipant", participant.id), values);
    }

    return (
        <TeacherLayout>
            <Head title="Edit Peserta" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.participants")}>
                                    Daftar Peserta
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit Peserta</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Edit Peserta
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={16} />
                                    <h3 className="font-medium">
                                        Identitas Peserta
                                    </h3>
                                </div>
                                <div className="p-8 rounded-xl bg-white border mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama*</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Email*
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        No Telepon*
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="npwp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>NPWP*</FormLabel>
                                                    <FormControl>
                                                        <InputMask
                                                            mask="9999999999999999"
                                                            value={field.value}
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            autoComplete="off"
                                                        >
                                                            {(inputProps) => (
                                                                <Input
                                                                    {...inputProps}
                                                                />
                                                            )}
                                                        </InputMask>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Alamat*
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
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
                                                                        "whitespace-normal break-words",
                                                                    )}
                                                                >
                                                                    <span className="truncate">
                                                                        {field.value
                                                                            ? events.find(
                                                                                  (
                                                                                      event: any,
                                                                                  ) =>
                                                                                      event.id ===
                                                                                      field.value,
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
                                                                        {events.map(
                                                                            (
                                                                                event: any,
                                                                            ) => (
                                                                                <CommandItem
                                                                                    key={
                                                                                        event.id
                                                                                    }
                                                                                    value={`${event.id}-${event.name}`}
                                                                                    onSelect={() => {
                                                                                        field.onChange(
                                                                                            Number(
                                                                                                event.id,
                                                                                            ),
                                                                                        );
                                                                                        setIsPopoverOpen(
                                                                                            false,
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
                                                                                                : "opacity-0",
                                                                                        )}
                                                                                    />
                                                                                </CommandItem>
                                                                            ),
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
                                <Button type="submit">Simpan Perubahan</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
