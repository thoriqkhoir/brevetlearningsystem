import { Head, Link, router } from "@inertiajs/react";
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
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TeacherLayout from "@/Layouts/TeacherLayout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";

const formSchema = z.object({
    question_text: z.string().min(1, "Pertanyaan harus diisi"),
    question_type: z.enum(["multiple_choice", "true_false"], {
        required_error: "Pilih jenis soal",
    }),
});

export default function EditQuestion({
    test,
    question,
    mode = "bank",
    questionBank,
}: any) {
    const isBankMode = mode === "bank";
    const bankId = questionBank?.id ?? test.question_bank?.id ?? test.id;
    const bankName =
        questionBank?.name ?? test.question_bank?.name ?? test.title;

    const [options, setOptions] = useState<
        Array<{
            id?: number;
            text: string;
            is_correct: boolean;
            image?: File | null;
            image_url?: string;
            delete_image?: boolean;
        }>
    >([]);
    const [correctAnswer, setCorrectAnswer] = useState<boolean | undefined>(
        undefined,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const isInitialMount = useRef(true);
    const imagePreviewUrl = useMemo(() => {
        if (!imageFile) return null;
        try {
            return URL.createObjectURL(imageFile);
        } catch {
            return null;
        }
    }, [imageFile]);

    useEffect(() => {
        return () => {
            try {
                if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            } catch {}
        };
    }, [imagePreviewUrl]);

    // Initialize form data from existing question
    useEffect(() => {
        if (question.question_type === "multiple_choice" && question.options) {
            const initialOptions = question.options.map((option: any) => ({
                id: option.id,
                text: option.option_text,
                is_correct: option.is_correct,
                image: null,
                image_url: option.image_url || null,
                delete_image: false,
            }));
            setOptions(initialOptions);
        } else if (question.question_type === "true_false") {
            setCorrectAnswer(question.correct_answer);
        }
    }, [question]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question_text: question.question_text || "",
            question_type: question.question_type || undefined,
        },
    });

    const watchType = form.watch("question_type");

    // Reset options when question type changes (tapi skip saat initial mount)
    useEffect(() => {
        // Skip reset pada mount pertama kali karena options akan di-init dari database
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (watchType !== "multiple_choice") {
            setOptions([
                {
                    text: "",
                    is_correct: false,
                    image: null,
                    delete_image: false,
                },
                {
                    text: "",
                    is_correct: false,
                    image: null,
                    delete_image: false,
                },
            ]);
        }
        if (watchType !== "true_false") {
            setCorrectAnswer(undefined);
        }
    }, [watchType]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Validasi manual untuk multiple choice
        if (values.question_type === "multiple_choice") {
            if (options.length < 2) {
                form.setError("question_type", {
                    type: "manual",
                    message: "Soal pilihan ganda harus memiliki minimal 2 opsi",
                });
                return;
            }

            const correctOptions = options.filter(
                (option) => option.is_correct,
            );
            if (correctOptions.length !== 1) {
                form.setError("question_type", {
                    type: "manual",
                    message: "Pilih tepat 1 jawaban yang benar",
                });
                return;
            }

            const emptyOptions = options.filter(
                (option) =>
                    !option.text.trim() && !option.image && !option.image_url,
            );
            if (emptyOptions.length > 0) {
                form.setError("question_type", {
                    type: "manual",
                    message: "Setiap opsi harus memiliki teks atau gambar",
                });
                return;
            }
        }

        const formData = new FormData();
        formData.append("question_text", values.question_text);
        formData.append("question_type", values.question_type);

        if (values.question_type === "multiple_choice") {
            // Kirim data opsi tanpa file gambar (hanya id, text, is_correct, dan delete_image)
            const optionsData = options.map((opt) => ({
                id: opt.id || null,
                text: opt.text.trim() || "Opsi",
                is_correct: opt.is_correct,
                delete_image: opt.delete_image || false,
            }));
            formData.append("options", JSON.stringify(optionsData));

            // Kirim file gambar opsi secara terpisah
            options.forEach((option, index) => {
                if (option.image) {
                    formData.append(`option_image_${index}`, option.image);
                }
            });
        } else if (values.question_type === "true_false") {
            if (correctAnswer === undefined) {
                form.setError("question_type", {
                    type: "manual",
                    message: "Pilih jawaban yang benar untuk soal Benar/Salah",
                });
                return;
            }
            // true/false dikirim sebagai options juga agar konsisten dengan backend store
            const truefalseOptions = [
                { text: "Benar", is_correct: correctAnswer === true },
                { text: "Salah", is_correct: correctAnswer === false },
            ];
            formData.append("options", JSON.stringify(truefalseOptions));
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (!isBankMode || !bankId) {
            return;
        }

        router.post(
            route("teacher.questionBankQuestions.update", [
                bankId,
                question.id,
            ]),
            formData,
            {
                forceFormData: true,
                // Use POST with _method=PUT for file uploads
                onBefore: (visit) => {
                    formData.append("_method", "PUT");
                },
            },
        );
    }

    const addOption = () => {
        setOptions([...options, { text: "", is_correct: false, image: null }]);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const updateOption = (
        index: number,
        field: "text" | "is_correct" | "image",
        value: string | boolean | File | null,
    ) => {
        const newOptions = [...options];
        if (field === "is_correct" && value === true) {
            // Hanya boleh ada satu jawaban benar
            newOptions.forEach((option, i) => {
                option.is_correct = i === index;
            });
        } else if (field === "text") {
            newOptions[index].text = value as string;
        } else if (field === "is_correct") {
            newOptions[index].is_correct = value as boolean;
        } else if (field === "image") {
            newOptions[index].image = value as File | null;
        }
        setOptions(newOptions);
    };

    return (
        <TeacherLayout>
            <Head title={`Edit Soal Bank - ${bankName}`} />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.questionBanks")}>
                                    Bank Soal
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link
                                    href={route(
                                        "teacher.questionBankQuestions.index",
                                        bankId,
                                    )}
                                >
                                    {bankName}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Edit Soal</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-gray-600"
                        >
                            {/* <Link href={route("test.question.index", test.id)}>
                                <ArrowLeft size={16} />
                                Kembali
                            </Link> */}
                        </Button>
                        <h1 className="text-2xl font-semibold text-primary">
                            Edit Soal Bank - {bankName}
                        </h1>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                        Bank soal aktif:{" "}
                        <span className="font-semibold">
                            {bankName || "Belum dipilih"}
                        </span>
                        . Perubahan soal di halaman ini berlaku untuk semua
                        ujian yang memakai bank soal ini.
                    </div>

                    <div className="p-5 lg:p-8 rounded-xl bg-white border shadow">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="question_text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Pertanyaan*
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Masukkan pertanyaan..."
                                                        rows={4}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Upload Gambar (opsional) */}
                                    <FormItem>
                                        <FormLabel>Gambar (opsional)</FormLabel>
                                        {(imagePreviewUrl ||
                                            question?.image_url) && (
                                            <div className="mb-2">
                                                <img
                                                    src={
                                                        imagePreviewUrl ||
                                                        `/storage/${question.image_url}`
                                                    }
                                                    alt="Gambar soal"
                                                    className="max-h-40 rounded border object-contain"
                                                />
                                            </div>
                                        )}
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const f =
                                                        e.target.files?.[0] ||
                                                        null;
                                                    if (f) {
                                                        // Validasi ukuran file (max 2MB)
                                                        const maxSize =
                                                            2 * 1024 * 1024; // 2MB dalam bytes
                                                        if (f.size > maxSize) {
                                                            alert(
                                                                `Ukuran gambar terlalu besar! Maksimal 2MB. Ukuran file Anda: ${(f.size / 1024 / 1024).toFixed(2)}MB`,
                                                            );
                                                            e.target.value = ""; // Reset input
                                                            return;
                                                        }
                                                    }
                                                    setImageFile(f);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Unggah gambar untuk soal (jika ada).
                                            Maksimal ukuran 2MB.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>

                                    <FormField
                                        control={form.control}
                                        name="question_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Jenis Soal*
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih jenis soal" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="multiple_choice">
                                                            Pilihan Ganda
                                                        </SelectItem>
                                                        <SelectItem value="true_false">
                                                            Benar/Salah
                                                        </SelectItem>
                                                        {/* <SelectItem value="short_answer">
                                                            Jawaban Singkat
                                                        </SelectItem> */}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Multiple Choice Options */}
                                    {watchType === "multiple_choice" && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <FormLabel>
                                                    Pilihan Jawaban*
                                                </FormLabel>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addOption}
                                                >
                                                    <Plus size={16} />
                                                    Tambah Opsi
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                {options.map(
                                                    (option, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col gap-3 p-3 border rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        checked={
                                                                            option.is_correct
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            updateOption(
                                                                                index,
                                                                                "is_correct",
                                                                                checked ===
                                                                                    true,
                                                                            )
                                                                        }
                                                                    />
                                                                    <label className="text-sm font-medium">
                                                                        Benar
                                                                    </label>
                                                                </div>
                                                                <Input
                                                                    value={
                                                                        option.text
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateOption(
                                                                            index,
                                                                            "text",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Teks opsi (opsional jika ada gambar)"
                                                                    className="flex-1"
                                                                />
                                                                {options.length >
                                                                    2 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            removeOption(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            {/* Upload gambar opsi */}
                                                            <div className="ml-20">
                                                                {(option.image ||
                                                                    option.image_url) && (
                                                                    <div className="mb-2">
                                                                        <img
                                                                            src={
                                                                                option.image
                                                                                    ? URL.createObjectURL(
                                                                                          option.image,
                                                                                      )
                                                                                    : `/storage/${option.image_url}`
                                                                            }
                                                                            alt="Preview opsi"
                                                                            className="max-h-32 rounded border object-contain"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        id={`option-image-${index}`}
                                                                        key={`option-image-input-${index}-${option.image || option.image_url ? "has-image" : "no-image"}`}
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            const file =
                                                                                e
                                                                                    .target
                                                                                    .files?.[0] ||
                                                                                null;
                                                                            if (
                                                                                file
                                                                            ) {
                                                                                // Validasi ukuran file (max 2MB)
                                                                                const maxSize =
                                                                                    2 *
                                                                                    1024 *
                                                                                    1024; // 2MB dalam bytes
                                                                                if (
                                                                                    file.size >
                                                                                    maxSize
                                                                                ) {
                                                                                    alert(
                                                                                        `Ukuran gambar terlalu besar! Maksimal 2MB. Ukuran file Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
                                                                                    );
                                                                                    e.target.value =
                                                                                        ""; // Reset input
                                                                                    return;
                                                                                }
                                                                            }
                                                                            updateOption(
                                                                                index,
                                                                                "image",
                                                                                file,
                                                                            );
                                                                        }}
                                                                        className="text-sm"
                                                                    />
                                                                    {(option.image ||
                                                                        option.image_url) && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newOptions =
                                                                                    [
                                                                                        ...options,
                                                                                    ];
                                                                                newOptions[
                                                                                    index
                                                                                ].image =
                                                                                    null;
                                                                                newOptions[
                                                                                    index
                                                                                ].image_url =
                                                                                    undefined;
                                                                                newOptions[
                                                                                    index
                                                                                ].delete_image =
                                                                                    true; // Tandai untuk dihapus
                                                                                setOptions(
                                                                                    newOptions,
                                                                                );
                                                                            }}
                                                                            className="text-red-600 hover:text-red-700"
                                                                        >
                                                                            Hapus
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Gambar
                                                                    opsional.
                                                                    Jika hanya
                                                                    upload
                                                                    gambar tanpa
                                                                    teks, opsi
                                                                    akan diberi
                                                                    label "Opsi"
                                                                    secara
                                                                    otomatis
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Centang satu opsi sebagai
                                                jawaban yang benar. Setiap opsi
                                                harus memiliki teks atau gambar
                                                (atau keduanya).
                                            </p>
                                        </div>
                                    )}

                                    {/* True/False */}
                                    {watchType === "true_false" && (
                                        <div className="space-y-2">
                                            <FormLabel>
                                                Jawaban yang Benar*
                                            </FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    setCorrectAnswer(
                                                        value === "true",
                                                    )
                                                }
                                                value={
                                                    correctAnswer === undefined
                                                        ? ""
                                                        : correctAnswer.toString()
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jawaban yang benar" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">
                                                        Benar
                                                    </SelectItem>
                                                    <SelectItem value="false">
                                                        Salah
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Short Answer Info */}
                                    {/* {watchType === "short_answer" && (
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-700">
                                                <strong>Catatan:</strong> Soal jawaban singkat akan dinilai secara manual oleh pengajar.
                                            </p>
                                        </div>
                                    )} */}

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit">
                                            Update Soal
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "teacher.questionBankQuestions.index",
                                                    bankId,
                                                )}
                                            >
                                                Batal
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
