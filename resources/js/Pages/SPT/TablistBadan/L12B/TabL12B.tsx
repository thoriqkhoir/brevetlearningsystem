import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { SectionL12B12 } from "./SectionL12B12";
import { SectionL12B3 } from "./SectionL12B3";
import { SectionL12B4 } from "./SectionL12B4";
import { SectionL12B5 } from "./SectionL12B5";
import { SectionL12B6 } from "./SectionL12B6";
import { SectionL12B7 } from "./SectionL12B7";
import { SectionL12B8 } from "./SectionL12B8";
import type {
    L12B12Item,
    L12B3Item,
    L12B4Item,
    L12B5Item,
    L12B6Item,
    L12B7Item,
    L12B8Item,
} from "./types";

interface TabL12BProps {
    sptBadanId: string;
    l12b12?: L12B12Item[];
    l12b3?: L12B3Item[];
    l12b4?: L12B4Item[];
    l12b5?: L12B5Item[];
    l12b6?: L12B6Item[];
    l12b7?: L12B7Item[];
    l12b8?: L12B8Item[];
}

export function TabL12B({
    sptBadanId,
    l12b12 = [],
    l12b3 = [],
    l12b4 = [],
    l12b5 = [],
    l12b6 = [],
    l12b7 = [],
    l12b8 = [],
}: TabL12BProps) {
    return (
        <div className="space-y-3">
            {/* Accordion 1 - Identitas Wajib Pajak Bentuk Usaha Tetap */}
            <Accordion type="single" collapsible defaultValue="acc1">
                <AccordionItem value="acc1">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        I. IDENTITAS WAJIB PAJAK BENTUK USAHA TETAP
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B12
                            data={l12b12}
                            sptBadanId={sptBadanId}
                            type="taxpayer"
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Accordion 2 - Identitas Kantor Pusat Bentuk Usaha Tetap */}
            <Accordion type="single" collapsible defaultValue="acc2">
                <AccordionItem value="acc2">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        II. IDENTITAS KANTOR PUSAT BENTUK USAHA TETAP
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B12
                            data={l12b12}
                            sptBadanId={sptBadanId}
                            type="company"
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Accordion 3 - Penghasilan Kena Pajak Sesudah Dikurangi Pajak */}
            <Accordion type="single" collapsible defaultValue="acc3">
                <AccordionItem value="acc3">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        III. PENGHASILAN KENA PAJAK SESUDAH DIKURANGI PAJAK
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B3 data={l12b3} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Accordion 4 - Penanaman Kembali Penghasilan Kena Pajak Sesudah Dikurangi Pajak */}
            <Accordion type="single" collapsible defaultValue="acc4">
                <AccordionItem value="acc4">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        IV. PENANAMAN KEMBALI PENGHASILAN KENA PAJAK SESUDAH
                        DIKURANGI PAJAK
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B4 data={l12b4} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Accordion 5 - Penanaman Kembali dalam Bentuk Penyertaan Modal pada Perusahaan yang Baru Didirikan */}
            <Accordion type="single" collapsible defaultValue="acc5">
                <AccordionItem value="acc5">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        V. PENANAMAN KEMBALI DALAM BENTUK PENYERTAAN MODAL PADA
                        PERUSAHAAN YANG BARU DIDIRIKAN
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B5 data={l12b5} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Accordion 6 - Penanaman Kembali dalam Bentuk Penyertaan Modal pada Perusahaan yang Sudah Berdiri */}
            <Accordion type="single" collapsible defaultValue="acc6">
                <AccordionItem value="acc6">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        VI. PENANAMAN KEMBALI DALAM BENTUK PENYERTAAN MODAL PADA
                        PERUSAHAAN YANG SUDAH BERDIRI
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B6 data={l12b6} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Accordion 7 - Penanaman Kembali dalam Bentuk Aktiva Tetap */}
            <Accordion type="single" collapsible defaultValue="acc7">
                <AccordionItem value="acc7">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        VII. PENANAMAN KEMBALI DALAM BENTUK AKTIVA TETAP
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B7 data={l12b7} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Accordion 8 - Penanaman Kembali dalam Bentuk Aktiva Tidak Berwujud */}
            <Accordion type="single" collapsible defaultValue="acc8">
                <AccordionItem value="acc8">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        VIII. PENANAMAN KEMBALI DALAM BENTUK AKTIVA TIDAK
                        BERWUJUD
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL12B8 data={l12b8} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default TabL12B;
