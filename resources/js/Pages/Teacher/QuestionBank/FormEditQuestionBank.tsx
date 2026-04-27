import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Checkbox } from "@/Components/ui/checkbox";

const formSchema = z.object({
    name: z.string().min(1, "Nama bank soal harus diisi"),
    description: z.string().nullable(),
    is_active: z.boolean(),
});

export default function FormEditQuestionBank({ questionBank }: any) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: questionBank.name,
            description: questionBank.description || "",
            is_active: !!questionBank.is_active,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.put(route("teacher.updateQuestionBank", questionBank.id), {
            ...values,
            description: values.description || null,
        });
    }

    return (
        <TeacherLayout>
            <Head title="Edit Bank Soal" />

            <div className="teacher-page-shell">
                <div className="teacher-page-stack">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.questionBanks")}>
                                    Bank Soal
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit Bank Soal</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="teacher-page-title">
                        Edit Bank Soal
                    </h1>

                    <div className="teacher-panel">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nama Bank Soal*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deskripsi</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={
                                                            field.value || ""
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            field.onChange(
                                                                !!checked,
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Aktifkan bank soal
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
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
