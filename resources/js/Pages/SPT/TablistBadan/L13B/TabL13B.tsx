import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { SectionL13BA } from "./SectionL13BA";
import { SectionL13BB } from "./SectionL13BB";
import { SectionL13BC } from "./SectionL13BC";
import { SectionL13BD } from "./SectionL13BD";
import type { L13BAItem, L13BBItem, L13BCItem, L13BDItem } from "./types";

interface TabL13BProps {
    sptBadanId: string;
    l13ba?: L13BAItem[];
    l13bb?: L13BBItem | null;
    l13bc?: L13BCItem[];
    l13bd?: L13BDItem | null;
}

export function TabL13B({
    sptBadanId,
    l13ba = [],
    l13bb = null,
    l13bc = [],
    l13bd = null,
}: TabL13BProps) {
    return (
        <div className="space-y-3">
            {/* Bagian A */}
            <Accordion type="single" collapsible defaultValue="accA">
                <AccordionItem value="accA">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded text-left">
                        A. DALAM HAL PERUSAHAAN MENDAPAT FASILITAS PENGURANGAN
                        PENGHASILAN BRUTO UNTUK KEGIATAN PRAKTIK KERJA,
                        PEMAGANGAN, DAN/ATAU PEMBELAJARAN DALAM RANGKA PEMBINAAN
                        DAN PENGEMBANGAN SUMBER DAYA MANUSIA BERBASIS KOMPETENSI
                        TERTENTU
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL13BA data={l13ba} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Bagian B */}
            <Accordion type="single" collapsible defaultValue="accB">
                <AccordionItem value="accB">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded text-left">
                        B. REKAPITULASI BIAYA KEGIATAN PRAKTIK KERJA,
                        PEMAGANGAN, DAN/ATAU PEMBELAJARAN DALAM RANGKA PEMBINAAN
                        DAN PENGEMBANGAN SUMBER DAYA MANUSIA BERBASIS KOMPETENSI
                        TERTENTU
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL13BB data={l13bb} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Bagian C */}
            <Accordion type="single" collapsible defaultValue="accC">
                <AccordionItem value="accC">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded text-left">
                        C. DALAM HAL PERUSAHAAN MENDAPAT FASILITAS PENGURANGAN
                        PENGHASILAN BRUTO UNTUK PENELITIAN DAN PENGEMBANGAN
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL13BC data={l13bc} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Bagian D */}
            <Accordion type="single" collapsible defaultValue="accD">
                <AccordionItem value="accD">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded text-left">
                        D. PENGHITUNGAN TAMBAHAN PENGURANGAN PENGHASILAN BRUTO
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL13BD data={l13bd} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
