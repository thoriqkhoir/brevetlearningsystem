import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { SectionL3DA } from "./SectionL3DA";
import { SectionL3DB } from "./SectionL3DB";
import { SectionL3DC } from "./SectionL3DC";
import { L3DAItem, L3DBItem, L3DCItem } from "./types";

export default function TabL3D({
    user,
    spt,
    sptOpId,
    l3da,
    l3db,
    l3dc,
}: {
    user: { npwp: string };
    spt: { year: number };
    sptOpId: string;
    l3da: L3DAItem[];
    l3db: L3DBItem[];
    l3dc: L3DCItem[];
}) {
    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <h2 className="text-2xl font-semibold">DAFTAR NOMINATIF (L-3D)</h2>

            <div>
                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                    HEADER
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <Label className="text-sm">Tahun Pajak</Label>
                            <Input
                                type="text"
                                value={String(spt.year)}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <Label className="text-sm">NPWP</Label>
                            <Input
                                type="text"
                                value={user.npwp}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={["a", "b", "c"]}>
                <AccordionItem value="a">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        A. DAFTAR NOMINATIF BIAYA ENTERTAINMENT
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-4">
                        <SectionL3DA data={l3da ?? []} sptOpId={sptOpId} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="b">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        B. DAFTAR NOMINATIF BIAYA PROMOSI
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-4">
                        <SectionL3DB data={l3db ?? []} sptOpId={sptOpId} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="c">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        C. DAFTAR NOMINATIF PIUTANG TAK TERTAGIH
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-4">
                        <SectionL3DC data={l3dc ?? []} sptOpId={sptOpId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
