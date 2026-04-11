import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { SectionL13C } from "./SectionL13C";
import type { L13CItem } from "./types";

interface TabL13CProps {
    sptBadanId: string;
    l13c?: L13CItem[];
}

export function TabL13C({ sptBadanId, l13c = [] }: TabL13CProps) {
    return (
        <div className="space-y-3">
            <Accordion type="single" collapsible defaultValue="acc1">
                <AccordionItem value="acc1">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        DAFTAR FASILITAS PENGURANGAN PPh BADAN
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                        <SectionL13C data={l13c} sptBadanId={sptBadanId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
