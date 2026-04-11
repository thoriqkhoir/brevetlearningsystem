import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { forwardRef, useImperativeHandle } from "react";
import { SectionL1A1 } from "./L1/SectionL1A1";
import { SectionL1A2 } from "./L1/SectionL1A2";
import { SectionL1A3 } from "./L1/SectionL1A3";
import { SectionL1A4 } from "./L1/SectionL1A4";
import { SectionL1A5 } from "./L1/SectionL1A5";
import { SectionL1A6 } from "./L1/SectionL1A6";
import { SectionL1A7 } from "./L1/SectionL1A7";
import { SectionL1B } from "./L1/SectionL1B";
import { SectionL1C } from "./L1/SectionL1C";
import { SectionL1D } from "./L1/SectionL1D";
import { SectionL1E } from "./L1/SectionL1E";
import type {
    LampiranL1Data,
    L1A1Item,
    L1A2Item,
    L1A3Item,
    L1A4Item,
    L1A5Item,
    L1A6Item,
} from "./L1/types";

interface User {
    name: string;
    address: string;
    phone_number: string;
    npwp: string;
}

interface Spt {
    id?: string;
    start_period: string;
    year: number;
    correction_number: number;
}

interface SptOp {
    id: string;
    spt_id: string;
}

export type TabL1RefType = {
    getFormData: () => Required<NonNullable<LampiranL1Data>>;
};

const toNumber = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
};

const TabL1 = forwardRef(
    (
        {
            user,
            spt,
            sptOp,
            lampiranData,
        }: {
            user: User;
            spt: Spt;
            sptOp: SptOp | null;
            lampiranData: LampiranL1Data;
        },
        ref,
    ) => {
        const normalizedLampiran: Required<NonNullable<LampiranL1Data>> = {
            l1a1: (lampiranData?.l1a1 ?? []) as L1A1Item[],
            l1a2: (lampiranData?.l1a2 ?? []) as L1A2Item[],
            l1a3: (lampiranData?.l1a3 ?? []) as L1A3Item[],
            l1a4: (lampiranData?.l1a4 ?? []) as L1A4Item[],
            l1a5: (lampiranData?.l1a5 ?? []) as L1A5Item[],
            l1a6: (lampiranData?.l1a6 ?? []) as L1A6Item[],
            l1a7: lampiranData?.l1a7 ?? [],
            l1b: lampiranData?.l1b ?? [],
            l1c: lampiranData?.l1c ?? [],
            l1d: lampiranData?.l1d ?? [],
            l1e: lampiranData?.l1e ?? [],
        };

        // A7 adalah rekap otomatis dari poin 1-6.
        const totalA7AcquisitionCost =
            normalizedLampiran.l1a1.reduce(
                (sum, item) => sum + toNumber(item.integer),
                0,
            ) +
            normalizedLampiran.l1a2.reduce(
                (sum, item) => sum + toNumber(item.amount),
                0,
            ) +
            normalizedLampiran.l1a3.reduce(
                (sum, item) => sum + toNumber(item.acquisition_cost),
                0,
            ) +
            normalizedLampiran.l1a4.reduce(
                (sum, item) => sum + toNumber(item.acquisition_cost),
                0,
            ) +
            normalizedLampiran.l1a5.reduce(
                (sum, item) => sum + toNumber(item.acquisition_cost),
                0,
            ) +
            normalizedLampiran.l1a6.reduce(
                (sum, item) => sum + toNumber(item.acquisition_cost),
                0,
            );

        const totalA7AmountNow =
            normalizedLampiran.l1a1.reduce(
                (sum, item) => sum + toNumber(item.integer),
                0,
            ) +
            normalizedLampiran.l1a2.reduce(
                (sum, item) => sum + toNumber(item.amount_now),
                0,
            ) +
            normalizedLampiran.l1a3.reduce(
                (sum, item) => sum + toNumber(item.amount_now),
                0,
            ) +
            normalizedLampiran.l1a4.reduce(
                (sum, item) => sum + toNumber(item.amount_now),
                0,
            ) +
            normalizedLampiran.l1a5.reduce(
                (sum, item) => sum + toNumber(item.amount_now),
                0,
            ) +
            normalizedLampiran.l1a6.reduce(
                (sum, item) => sum + toNumber(item.amount_now),
                0,
            );

        useImperativeHandle(
            ref,
            (): TabL1RefType => ({
                getFormData: () => normalizedLampiran,
            }),
        );

        return (
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>A. HARTA PADA AKHIR TAHUN PAJAK</li>
                    <li>B. UTANG PADA AKHIR TAHUN PAJAK</li>
                    <li>C. DAFTAR ANGGOTA KELUARGA YANG MENJADI TANGGUNGAN</li>
                    <li>D. PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN</li>
                    <li>E. DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh</li>
                </ul>

                {/* HEADER (bukan accordion) */}
                <div>
                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        HEADER
                    </div>
                    <div className="p-4 bg-white w-full rounded-b-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="col-span-2">
                                    Tahun Pajak
                                </Label>
                                <Input
                                    type="text"
                                    defaultValue={String(spt.year)}
                                    disabled
                                />
                            </div>

                            <div>
                                <Label className="col-span-2">NPWP</Label>
                                <Input
                                    type="text"
                                    defaultValue={user.npwp}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACCORDION SECTIONS */}
                <Accordion
                    type="multiple"
                    defaultValue={["a", "b", "c", "d", "e"]}
                >
                    <AccordionItem value="a">
                        <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                            A. HARTA PADA AKHIR TAHUN PAJAK
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-white w-full">
                            <div className="p-4 space-y-6">
                                <div>
                                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                        1. KAS DAN SETARA KAS
                                    </div>
                                    <div className="p-4 bg-white w-full rounded-b-xl">
                                        <SectionL1A1
                                            data={normalizedLampiran.l1a1}
                                            sptOpId={sptOp?.id ?? ""}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded mt-4">
                                        2. PIUTANG
                                    </div>
                                    <div className="p-4 bg-white w-full rounded-b-xl">
                                        <SectionL1A2
                                            data={normalizedLampiran.l1a2}
                                            sptOpId={sptOp?.id ?? ""}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded mt-4">
                                        3. INVESTASI/SEKURITAS
                                    </div>
                                    <div className="p-4 bg-white w-full rounded-b-xl">
                                        <SectionL1A3
                                            data={normalizedLampiran.l1a3}
                                            sptOpId={sptOp?.id ?? ""}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded mt-4">
                                        4. HARTA BERGERAK
                                    </div>
                                    <div className="p-4 bg-white w-full rounded-b-xl">
                                        <SectionL1A4
                                            data={normalizedLampiran.l1a4}
                                            sptOpId={sptOp?.id ?? ""}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded mt-4">
                                        5. HARTA TIDAK BERGERAK (TERMASUK TANAH
                                        BANGUNAN)
                                    </div>
                                    <div className="p-4 bg-white w-full rounded-b-xl">
                                        <SectionL1A5
                                            data={normalizedLampiran.l1a5}
                                            sptOpId={sptOp?.id ?? ""}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded mt-4">
                                        6. HARTA LAINNYA
                                    </div>
                                    <div className="p-4 bg-white w-full rounded-b-xl">
                                        <SectionL1A6
                                            data={normalizedLampiran.l1a6}
                                            sptOpId={sptOp?.id ?? ""}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded mt-4">
                                        7. REKAPITULASI HARTA (OTOMATIS)
                                    </div>
                                    <div className="p-4 bg-white w-full rounded-b-xl">
                                        <SectionL1A7
                                            totalAcquisitionCost={
                                                totalA7AcquisitionCost
                                            }
                                            totalAmountNow={totalA7AmountNow}
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="b">
                        <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                            B. UTANG PADA AKHIR TAHUN PAJAK
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-white w-full">
                            <SectionL1B
                                data={normalizedLampiran.l1b}
                                sptOpId={sptOp?.id ?? ""}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="c">
                        <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                            C. DAFTAR ANGGOTA KELUARGA YANG MENJADI TANGGUNGAN
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-white w-full">
                            <SectionL1C
                                data={normalizedLampiran.l1c}
                                sptOpId={sptOp?.id ?? ""}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="d">
                        <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                            D. PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-white w-full">
                            <SectionL1D
                                data={normalizedLampiran.l1d}
                                sptOpId={sptOp?.id ?? ""}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="e">
                        <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                            E. DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-white w-full">
                            <SectionL1E
                                data={normalizedLampiran.l1e}
                                sptOpId={sptOp?.id ?? ""}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    },
);

export default TabL1;
