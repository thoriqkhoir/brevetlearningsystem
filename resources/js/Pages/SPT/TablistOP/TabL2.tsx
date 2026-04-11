import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { SectionL2A } from "./L2/SectionL2A";
import { SectionL2B } from "./L2/SectionL2B";
import { SectionL2C } from "./L2/SectionL2C";
import type { L2AItem, L2BItem, L2CItem, MasterObjectOption } from "./L2/types";

interface User {
    npwp: string;
}

interface Spt {
    year: number;
}

interface SptOp {
    id: string;
}

type MasterObjectFromProps = {
    id: string | number;
    code?: string;
    name?: string;
    kap?: string;
    tax_code?: string;
    tax_name?: string;
};

type LampiranL2Data = {
    l2a?: unknown[];
    l2b?: unknown[];
    l2c?: unknown[];
} | null;

export default function TabL2({
    user,
    spt,
    sptOp,
    lampiranData,
    masterObjects,
}: {
    user: User;
    spt: Spt;
    sptOp: SptOp | null;
    lampiranData: LampiranL2Data;
    masterObjects: MasterObjectFromProps[];
}) {
    const sptOpId = sptOp?.id ?? "";

    const masterObjectOptions: MasterObjectOption[] = (masterObjects ?? []).map(
        (m) => ({
            id: Number(m.id),
            code: m.code ?? m.tax_code ?? "",
            name: m.name ?? m.tax_name ?? "",
            kap: m.kap ?? "",
        }),
    );

    const l2a = (lampiranData?.l2a ?? []) as unknown[] as L2AItem[];
    const l2b = (lampiranData?.l2b ?? []) as unknown[] as L2BItem[];
    const l2c = (lampiranData?.l2c ?? []) as unknown[] as L2CItem[];

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>
                    A. DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh OLEH PIHAK LAIN
                </li>
                <li>
                    B. DAFTAR PENGHASILAN YANG DIKENAKAN PAJAK BERSIFAT FINAL
                </li>
                <li>C. PENGHASILAN NETO LUAR NEGERI</li>
            </ul>

            <div>
                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                    HEADER
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="col-span-2">Tahun Pajak</Label>
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

            <Accordion type="multiple" defaultValue={["a", "b", "c"]}>
                <AccordionItem value="a">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        A. DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh OLEH PIHAK
                        LAIN
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        <div className="p-4 bg-white w-full rounded-b-xl">
                            <SectionL2A
                                data={l2a}
                                sptOpId={sptOpId}
                                masterObjects={masterObjectOptions}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="b">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        B. DAFTAR PENGHASILAN YANG DIKENAKAN PAJAK BERSIFAT
                        FINAL
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        <div className="p-4 bg-white w-full rounded-b-xl">
                            <SectionL2B data={l2b} sptOpId={sptOpId} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="c">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        C. PENGHASILAN NETO LUAR NEGERI
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        <div className="p-4 bg-white w-full rounded-b-xl">
                            <SectionL2C data={l2c} sptOpId={sptOpId} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
