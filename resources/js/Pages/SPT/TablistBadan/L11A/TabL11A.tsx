import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { FormL11A4B } from "./FormL11A4B";
import { SectionL11A1 } from "./SectionL11A1";
import { SectionL11A2 } from "./SectionL11A2";
import { SectionL11A3 } from "./SectionL11A3";
import { SectionL11A4A } from "./SectionL11A4A";
import { SectionL11A5 } from "./SectionL11A5";
import type {
    L11A1Item,
    L11A2Item,
    L11A3Item,
    L11A4AItem,
    L11A4BData,
    L11A5Item,
} from "./types";

interface TabL11AProps {
    sptBadanId: string;
    l11a1: L11A1Item[];
    l11a2: L11A2Item[];
    l11a3: L11A3Item[];
    l11a4a: L11A4AItem[];
    l11a4b: L11A4BData | null;
    l11a5: L11A5Item[];
}

export function TabL11A({
    sptBadanId,
    l11a1,
    l11a2,
    l11a3,
    l11a4a,
    l11a4b,
    l11a5,
}: TabL11AProps) {
    return (
        <Accordion
            type="multiple"
            defaultValue={["1", "2", "3", "4a", "5"]}
            className="space-y-2"
        >
            {/* 1. Biaya yang Berkaitan dengan Penghasilan Bruto */}
            <AccordionItem value="1" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 py-3 w-full text-left hover:no-underline hover:bg-blue-900">
                    1. DAFTAR NOMINATIF BIAYA PROMOSI DAN PENJUALAN, SERTA PENGGANTIAN ATAU IMBALAN DALAM BENTUK NATURA DAN/ATAU KENIKMATAN
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                    <SectionL11A1 data={l11a1} sptBadanId={sptBadanId} />
                </AccordionContent>
            </AccordionItem>

            {/* 2. Biaya Promosi */}
            <AccordionItem value="2" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 py-3 w-full text-left hover:no-underline hover:bg-blue-900">
                    2.  DAFTAR NOMINATIF BIAYA ENTERTAINMENT
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                    <SectionL11A2 data={l11a2} sptBadanId={sptBadanId} />
                </AccordionContent>
            </AccordionItem>

            {/* 3. Piutang yang Nyata-Nyata Tidak Dapat Ditagih */}
            <AccordionItem value="3" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 py-3 w-full text-left hover:no-underline hover:bg-blue-900">
                    3. PIUTANG YANG NYATA-NYATA TIDAK DAPAT DITAGIH
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                    <SectionL11A3 data={l11a3} sptBadanId={sptBadanId} />
                </AccordionContent>
            </AccordionItem>

            {/* 4A. Penyusutan Harta Berwujud */}
            <AccordionItem value="4a" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 py-3 w-full text-left hover:no-underline hover:bg-blue-900">
                     RINCIAN BAGI WAJIB PAJAK PEMBERI NATURA DAN/ATAU KENIKMATAN
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                    <SectionL11A4A data={l11a4a} sptBadanId={sptBadanId} />
                    <FormL11A4B sptBadanId={sptBadanId} l11a4b={l11a4b} />
                </AccordionContent>
            </AccordionItem>

            {/* 5. Kerugian dari Penanaman Modal */}
            <AccordionItem value="5" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 py-3 w-full text-left hover:no-underline hover:bg-blue-900">
                    5.  DAFTAR DEBITUR NON-PERFORMING LOAN
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                    <SectionL11A5 data={l11a5} sptBadanId={sptBadanId} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default TabL11A;
