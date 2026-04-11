import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { SectionL13A } from "./SectionL13A";
import type { L13AItem } from "./types";

interface TabL13AProps {
    sptBadanId: string;
    l13a?: L13AItem[];
}

export function TabL13A({ sptBadanId, l13a = [] }: TabL13AProps) {
    return (
        <div className="space-y-3">
            <Accordion type="single" collapsible defaultValue="acc1">
                <AccordionItem value="acc1">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        DAFTAR FASILITAS PENANAMAN MODAL
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL13A data={l13a} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
