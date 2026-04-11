import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { SectionL14 } from "./SectionL14";
import type { L14Item } from "./types";

interface TabL14Props {
    sptBadanId: string;
    l14?: L14Item[];
}

export function TabL14({ sptBadanId, l14 = [] }: TabL14Props) {
    return (
        <div className="space-y-3">
            <Accordion type="single" collapsible defaultValue="acc1">
                <AccordionItem value="acc1">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        PENGGUNAAN SISA LEBIH UNTUK PEMBANGUNAN DAN PENGADAAN
                        SARANA DAN PRASARANA
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL14 data={l14} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
