import { z } from "zod";

export const bankFormSchema = z
    .object({
        bank_name: z.string().min(1, "Nama Bank wajib diisi").max(255),
        account_number: z
            .string()
            .min(1, "Nomor Rekening wajib diisi")
            .max(255),
        account_name: z
            .string()
            .min(1, "Nama Pemilik Rekening wajib diisi")
            .max(255),
        account_type: z.enum(["tabungan", "giro", "deposito"], {
            required_error: "Jenis Rekening wajib dipilih",
        }),
        is_primary: z.boolean().default(false),
        description: z.string().max(500).optional().nullable(),
        start_date: z.string().optional().nullable(),
        end_date: z.string().optional().nullable(),
    })
    .superRefine((data, ctx) => {
        const { start_date, end_date } = data;
        if (!start_date || !end_date) return;

        const start = new Date(start_date);
        const end = new Date(end_date);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return;
        }

        if (end < start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Tanggal berakhir tidak boleh lebih awal dari tanggal mulai",
                path: ["end_date"],
            });
        }
    });

export type BankFormValues = z.infer<typeof bankFormSchema>;
