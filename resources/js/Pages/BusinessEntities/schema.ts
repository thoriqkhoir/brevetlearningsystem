import { z } from "zod";

export const businessEntityFormSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi").max(255),
    npwp: z
        .string()
        .regex(/^\d{16}$/, "NPWP harus 16 digit")
        .min(16)
        .max(16),
    address: z.string().max(255).optional().default(""),
});

export type BusinessEntityFormValues = z.infer<typeof businessEntityFormSchema>;
